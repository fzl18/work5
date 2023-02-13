<template>
  <el-main class="si">
    <bt-page :title="$route.meta.title" icon-bg-color="#FF866A">
      <!--      <zPageTitle title="计划执行趋势" :show-filter="false"></zPageTitle>-->
      <div>
        <el-tabs @tab-click="handleClick">
          <el-tab-pane :label="translateTitle('巡检计划执行趋势')" />
          <el-tab-pane :label="translateTitle('点检计划执行趋势')" />
        </el-tabs>
        <div style="margin-bottom: 20px; display: flex; flex-wrap: wrap">
          <div style="margin: 0 50px 20px 0">
            {{ translateTitle('时间') }}:
            <el-button
              :class="{
                'el-button--primary': dayStr == '7',
                'el-button--info': dayStr != '7',
              }"
              @click="handleSevenDays"
            >
              {{ translateTitle('近7日') }}
            </el-button>
            <el-button
              :class="{
                'el-button--primary': dayStr == '30',
                'el-button--info': dayStr != '30',
              }"
              @click="handleThirtyDays"
            >
              {{ translateTitle('近30日') }}
            </el-button>
          </div>
          <div>
            {{ translateTitle('自定义') }}:
            <el-date-picker
              v-model="searchTime"
              type="daterange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd HH:mm:ss"
              :start-placeholder="translateTitle('开始日期')"
              :end-placeholder="translateTitle('结束日期')"
              @change="dateChange"
            />
          </div>
        </div>
        <el-row style="margin-bottom: 15px">
          <el-col>
            <div id="main" style="width: 100%; height: 400px" />
          </el-col>
        </el-row>
        <el-row v-if="echartData" style="font-size: 16px; margin: 10px 0">
          {{ translateTitle('数据汇总') }}:
        </el-row>
        <el-row
          v-if="echartData"
          type="flex"
          class="data-box"
          style="text-align: center"
        >
          <el-col :span="6">应巡次数: {{ echartData.total.shouldAction }}</el-col>
          <el-col :span="6">实巡次数: {{ echartData.total.actulAction }}</el-col>
          <el-col :span="6">漏检次数: {{ echartData.total.omitAction }}</el-col>
          <el-col :span="6">异常次数: {{ echartData.total.abnormalNum }}</el-col>
        </el-row>
        <el-row>
          <zTable
            ref="zTable"
            :height="298"
            :table-data="tableData"
            :cols="cols"
            :show-pagination="true"
            :total="total"
            :current-page="currentPage"
            :each-page-size="eachPageSize"
            @pageChange="handleCurrentChange"
          >
            <template #actionDate="scope">
              {{ scope.row.actionDate.split(' ')[0] }}
            </template>
          </zTable>
        </el-row>
      </div>
    </bt-page>
  </el-main>
</template>

<script>
import { translateTitle } from '../../i18n'
import * as echarts from 'echarts'
import { getDashTrendEchartsData, getDashTrendTableData, } from '../../api/planTrend'
import zTable from '../../components/zTable'
// import zPageTitle from '../../components/zPageTitle'

export default {
  components: { zTable },
  beforeRouteLeave (to, from, next) {
    window.removeEventListener('resize', this.resize)
    next()
  },
  data () {
    return {
      tipIndex: 1,
      searchTime: null,
      echartData: null,
      //默认1巡检 2点检
      taskType: 1,
      cols: [
        { slot: 'actionDate', label: '日期' },
        { prop: 'shouldAction', label: '应巡次数' },
        { prop: 'actulAction', label: '实巡次数' },
        { prop: 'omitAction', label: '漏检次数' },
        { prop: 'abnormalNum', label: '异常次数' },
      ],
      tableData: [],
      total: 0,
      eachPageSize: 10,
      currentPage: 1,
      curBeginTime: '',
      curEndTime: '',
      dayStr: '7',
      timer: null,
    }
  },
  mounted () {
    this.curBeginTime = this.getTargetDay(-6)
    this.curEndTime = this.getNowTime()
    //默认查看7天内巡检数据
    this.getEchartsDataFn(this.curBeginTime, this.curEndTime, this.taskType)

    this.getTableDataFn(
      this.curBeginTime,
      this.curEndTime,
      this.taskType,
      1,
      this.eachPageSize
    )

    window.addEventListener('resize', this.resize)
  },
  methods: {
    translateTitle,
    handleClick (tab) {
      console.log(tab.index)
      if (tab.index == '0') this.changeTag(1)
      if (tab.index == '1') this.changeTag(2)
    },
    changeTag (index) {
      this.tipIndex = index
      this.taskType = index
      this.searchTime = null
      this.dayStr = '7'
      this.curBeginTime = this.getTargetDay(-6)
      this.curEndTime = this.getNowTime()
      //默认查看7天内巡检数据
      this.getEchartsDataFn(this.curBeginTime, this.curEndTime, this.taskType)

      this.getTableDataFn(
        this.curBeginTime,
        this.curEndTime,
        this.taskType,
        1,
        this.eachPageSize
      )
    },
    myEcharts () {
      let myChart = echarts.init(document.getElementById('main'))
      let sList = []
      console.log('this.echartData--', this.echartData)
      if (!this.echartData) {
        console.log('echartData=null')
        let option = {
          title: {
            show: true,
            text: this.translateTitle('暂无数据'),
            left: 'center',
            top: 'center',
            textStyle: {
              color: 'grey',
              fontSize: 20,
            },
          },
          tooltip: {
            trigger: 'axis',
          },
          legend: {
            data: '',
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: [],
          },
          yAxis: {
            type: 'value',
          },
          series: [],
        }
        myChart.setOption(option, true)
        return
      }
      let colorArr = ['#08a0fe', '#309a00', '#ff0000', '#9a00ff']
      this.echartData.allData &&
      this.echartData.allData.forEach((data, index) => {
        sList.push({
          name: data.name,
          type: 'line',
          data: data.trends,
          itemStyle: { color: colorArr[index] },
        })
      })
      // config
      let option = {
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: this.echartData.projectNames,
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.echartData.dates,
        },
        yAxis: {
          type: 'value',
        },
        series: sList,
      }
      myChart.setOption(option, true)
    },
    getTargetDay (day) {
      let doHandleMonth = (month) => {
        var m = month
        if (month.toString().length == 1) {
          m = '0' + month
        }
        return m
      }
      let today = new Date()
      let targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day
      today.setTime(targetday_milliseconds)
      let tYear = today.getFullYear()
      let tMonth = today.getMonth()
      let tDate = today.getDate()
      tMonth = doHandleMonth(tMonth + 1)
      tDate = doHandleMonth(tDate)
      return tYear + '-' + tMonth + '-' + tDate + ' 00:00:00'
    },
    getNowTime () {
      const time = new Date()
      let y = time.getFullYear()
      let m = time.getMonth() + 1
      let d = time.getDate()
      let h = time.getHours()
      let mi = time.getMinutes()
      let s = time.getSeconds()
      m = m < 10 ? `0${ m }` : m
      d = d < 10 ? `0${ d }` : d
      h = h < 10 ? `0${ h }` : h
      mi = mi < 10 ? `0${ mi }` : mi
      s = s < 10 ? `0${ s }` : s
      return `${ y }-${ m }-${ d } ${ h }:${ mi }:${ s }`
    },
    async getEchartsDataFn (beginTime, endTime, taskType) {
      // console.log(beginTime,endTime,taskType)
      await getDashTrendEchartsData({
        beginTime,
        endTime,
        taskType,
      }).then((res) => {
        if (res.success == 1) {
          let { data } = res
          // console.log('echarts 数据', data)
          if (Object.keys(data).length === 0) {
            this.echartData = null
            this.myEcharts()
            return
          } else {
            this.echartData = data
            this.myEcharts()
          }
        }
      })
    },
    async getTableDataFn (beginTime, endTime, taskType, pageNum, pageSize) {
      // console.log(beginTime,endTime,taskType,pageSize,pageNum)
      await getDashTrendTableData({
        beginTime,
        endTime,
        taskType,
        pageSize,
        pageNum,
      }).then((res) => {
        if (res.success == 1) {
          let { data } = res
          this.currentPage = data.pageNum
          this.eachPageSize = data.pageSize
          this.total = data.total
          this.tableData = data.result
        }
      })
    },
    //日期切换
    dateChange (date) {
      if (date) {
        this.curBeginTime = date[0]
        this.curEndTime = date[1]
        this.dayStr = '0'
        console.log(this.curBeginTime, this.curEndTime, this.taskType)
        this.getEchartsDataFn(
          this.curBeginTime,
          this.curEndTime,
          this.taskType
        )

        this.getTableDataFn(
          this.curBeginTime,
          this.curEndTime,
          this.taskType,
          1,
          this.eachPageSize
        )
      }
    },
    //分页
    handleCurrentChange (val) {
      console.log(`当前页: ${ val }`)
      this.currentPage = val
      this.getTableDataFn(
        this.curBeginTime,
        this.curEndTime,
        this.taskType,
        val,
        this.eachPageSize
      )
    },
    //近7天
    handleSevenDays () {
      this.dayStr = '7'
      this.searchTime = null
      this.curBeginTime = this.getTargetDay(-6)
      console.log('7--', this.curBeginTime, this.curEndTime)
      this.getEchartsDataFn(
        this.curBeginTime,
        this.getNowTime(),
        this.taskType
      )
      this.getTableDataFn(
        this.curBeginTime,
        this.getNowTime(),
        this.taskType,
        1,
        this.eachPageSize
      )
    },
    //近30天
    handleThirtyDays () {
      this.dayStr = '30'
      this.searchTime = null
      this.curBeginTime = this.getTargetDay(-29)
      console.log('30--', this.curBeginTime, this.curEndTime)
      this.getEchartsDataFn(
        this.curBeginTime,
        this.getNowTime(),
        this.taskType
      )
      this.getTableDataFn(
        this.curBeginTime,
        this.getNowTime(),
        this.taskType,
        1,
        this.eachPageSize
      )
    },
    resize () {
      if (this.timer) clearInterval(this.timer)
      this.timer = setTimeout(() => {
        let main = document.getElementById('main')
        if (!main) return
        let myChart = echarts.init(main)
        myChart.resize()
      }, 30)
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '../../css/base';

  .data-box {
    padding: 20px 10px;
    border: 1px solid #ccc;
    margin-bottom: 30px;
  }
</style>
