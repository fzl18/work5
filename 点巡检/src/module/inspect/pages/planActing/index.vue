<template>
  <el-main class="si">
    <bt-page :title="$route.meta.title" icon-bg-color="#FF866A" :show-drawer="true">
      <!--      <zPageTitle title="计划执行统计" :show-filter="false" />-->
      <div>
        <el-tabs @tab-click="handleClick">
          <el-tab-pane :label="translateTitle('巡检计划执行统计')" />
          <el-tab-pane :label="translateTitle('点检计划执行统计')" />
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
        <el-row
          v-if="echartData"
          type="flex"
          justify="space-between"
          class="count-box"
          style="
          margin-bottom: 20px;
          border: 1px solid #ccc;
          padding: 15px;
          text-align: center;
        "
        >
          <el-col :span="2">
            <p>{{ translateTitle('应巡次数') }}</p>
            <span>{{ echartData.shouldAction }}</span>
          </el-col>
          <el-col :span="2">
            <p>{{ translateTitle('实巡次数') }}</p>
            <span>{{ echartData.actulAction }}</span>
          </el-col>
          <el-col :span="2">
            <p>{{ translateTitle('未巡次数') }}</p>
            <span>{{ echartData.nonPolling }}</span>
          </el-col>
          <el-col :span="2">
            <p>{{ translateTitle('跳过次数') }}</p>
            <span>{{ echartData.skiped }}</span>
          </el-col>
          <el-col :span="2">
            <p>{{ translateTitle('漏检次数') }}</p>
            <span>{{ echartData.omitAction }}</span>
          </el-col>
          <el-col :span="2">
            <p>{{ translateTitle('异常次数') }}</p>
            <span>{{ echartData.abnormalNum }}</span>
          </el-col>
          <el-col :span="2">
            <p>{{ translateTitle('执行率') }}</p>
            <span>{{ echartData.actingRate }}</span>
          </el-col>
          <el-col :span="2">
            <p>{{ translateTitle('应巡设备数') }}</p>
            <span>{{ echartData.totalEquipment }}</span>
          </el-col>
          <el-col :span="2">
            <p>{{ translateTitle('实巡设备数') }}</p>
            <span>{{ echartData.actulPollingEquipment }}</span>
          </el-col>
          <el-col :span="2">
            <p>{{ translateTitle('跳过设备数') }}</p>
            <span>{{ echartData.skippedNum }}</span>
          </el-col>
          <el-col :span="2">
            <p>{{ translateTitle('巡检覆盖率') }}</p>
            <span>{{ echartData.coveredRate }}</span>
          </el-col>
        </el-row>
        <el-row>
          <zTable
            ref="zTable"
            :height="500"
            :table-data="tableData"
            :cols="cols"
            :show-index="true"
            :show-pagination="true"
            :total="total"
            :current-page="currentPage"
            :each-page-size="eachPageSize"
            @pageChange="handleCurrentChange"
          />
        </el-row>
      </div>
    </bt-page>
  </el-main>
</template>

<script>
import { translateTitle } from '../../i18n'
import { getDashActingData } from '../../api/planActing'
import zTable from '../../components/zTable'

export default {
  components: { zTable },
  data () {
    return {
      tipIndex: 1,
      searchTime: null,
      echartData: null,
      //默认1巡检 2点检
      taskType: 1,
      cols: [
        {
          prop: 'taskCode',
          label: '计划编号',
          width: 160,
          showOverflowTooltip: true,
        },
        {
          prop: 'taskName',
          label: '计划名称',
          showOverflowTooltip: true,
          width: 160,
        },
        { prop: 'shouldAction', label: '应巡次数' },
        { prop: 'actulAction', label: '实巡次数' },
        { prop: 'nonPolling', label: '未巡次数' },
        { prop: 'skiped', label: '跳过次数' },
        { prop: 'omitAction', label: '漏检次数' },
        { prop: 'abnormalNum', label: '异常次数' },
        { prop: 'actingRate', label: '执行率' },
        { prop: 'totalEquipment', label: '应巡设备数' },
        { prop: 'actulPollingEquipment', label: '实巡设备数' },
        { prop: 'skippedNum', label: '跳过设备数' },
        { prop: 'coveredRate', label: '巡检覆盖率' },
      ],
      tableData: [],
      total: 0,
      eachPageSize: 10,
      currentPage: 1,
      curBeginTime: '',
      curEndTime: '',
      dayStr: '7',
    }
  },
  mounted () {
    this.curBeginTime = this.getTargetDay(-6)
    this.curEndTime = this.getNowTime()

    this.requestData(
      this.curBeginTime,
      this.curEndTime,
      this.taskType,
      1,
      this.eachPageSize
    )
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
      this.requestData(
        this.curBeginTime,
        this.curEndTime,
        this.taskType,
        1,
        this.eachPageSize
      )
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
    requestData (beginTime, endTime, taskType, pageNum, pageSize) {
      getDashActingData({
        beginTime,
        endTime,
        taskType,
        pageSize,
        pageNum,
      }).then((res) => {
        if (res.success == 1) {
          let { data } = res
          if (Object.keys(data).length === 0) {
            this.echartData = null
            this.currentPage = 1
            this.eachPageSize = 10
            this.total = 0
            this.tableData = []
            return
          } else {
            this.currentPage = data.pageResult.pageNum
            this.eachPageSize = data.pageResult.pageSize
            this.total = data.pageResult.total
            this.tableData = data.pageResult.result
            this.echartData = data.echartData
          }
        }
      })
    },
    dateChange (date) {
      if (date) {
        this.curBeginTime = date[0]
        this.curEndTime = date[1]
        this.dayStr = '0'
        this.requestData(
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
      this.currentPage = val
      this.requestData(
        this.curBeginTime,
        this.curEndTime,
        this.taskType,
        1,
        this.eachPageSize
      )
    },
    //近7天
    handleSevenDays () {
      this.dayStr = '7'
      this.searchTime = null
      this.curBeginTime = this.getTargetDay(-6)
      this.requestData(
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
      this.requestData(
        this.curBeginTime,
        this.getNowTime(),
        this.taskType,
        1,
        this.eachPageSize
      )
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '../../css/base';

  .count-box {
    .el-col {
      border-right: 1px solid #ccc;

      &:last-child {
        border-right: none;
      }
    }
  }
</style>
