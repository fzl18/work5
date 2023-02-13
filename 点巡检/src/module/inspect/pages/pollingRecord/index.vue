<template>
  <el-main class="record si">
    <bt-page :title="$route.meta.title" icon-bg-color="#FF866A" :show-drawer="true">
      <!--      <zPageTitle-->
      <!--        title="点巡检记录"-->
      <!--        :show-filter="tipIndex == 1"-->
      <!--        @handleIconClick="openDrawer"-->
      <!--      />-->
      <el-row v-show="tipIndex == 1">
        <el-col>
          <zTable
            ref="recordTable"
            :table-data="tableData"
            :cols="recordCols"
            :total="total"
            :each-page-size="eachPageSize"
            :current-page="currentPage"
            :show-index="true"
            :show-handle="true"
            @pageChange="handleCurrentChange"
          >
            <template #actionUserNameList="scope">
              {{ scope.row.actionUserNameList.join(',') }}
            </template>
            <template #taskStatus="scope">
              {{ scope.row.taskStatus == '1' ? translateTitle('待执行') : '' }}
              {{ scope.row.taskStatus == '2' ? translateTitle('执行中') : '' }}
              {{ scope.row.taskStatus == '3' ? translateTitle('已完成') : '' }}
              {{ scope.row.taskStatus == '4' ? translateTitle('跳过') : '' }}
              {{ scope.row.taskStatus == '5' ? translateTitle('漏检') : '' }}
            </template>
            <template #equipmentAbnormalNum="scope">
              {{
                scope.row.taskStatus == '1' ? '' : scope.row.equipmentAbnormalNum
              }}
            </template>
            <template #equipmentSkipNum="scope">
              {{ scope.row.taskStatus == '1' ? '' : scope.row.equipmentSkipNum }}
            </template>
            <template #isTimeout="scope">
              {{
                scope.row.taskStatus == '1'
                  ? ''
                  : scope.row.isTimeout
                    ? translateTitle('是')
                    : translateTitle('否')
              }}
            </template>
            <template #trace="scope">
              <div
                v-if="scope.row.taskStatus == '3' || scope.row.taskStatus == '5'"
              >
                <el-button
                  type="text"
                  size="small"
                  style="padding-top: 0; padding-bottom: 0"
                  @click="handleCheckRecordTrace(scope.row)"
                >
                  {{ translateTitle('查看') }}
                </el-button>
              </div>
            </template>
            <template #curTrace="scope">
              <div>
                <el-button
                  type="text"
                  size="small"
                  style="padding-top: 0; padding-bottom: 0"
                  @click="handleCheckRealTrace(scope.row)"
                >
                  {{ translateTitle('查看') }}
                </el-button>
              </div>
            </template>
            <template #handle="slotData">
              <zDropicon
                :slot-data="slotData"
                :op-list="recordOpList"
                @handleIconFn="handleIconRecord"
              />
            </template>
          </zTable>
        </el-col>
      </el-row>
      <div v-show="tipIndex == 2">
        <recordDetail
          :cur-task-detail="curTaskDetail"
          @goBack="showRecordTable"
        />
      </div>
      <el-row>
        <Trace
          :id="taskId"
          :unique-task-id="uniqueTaskId"
          :type="pollingType"
          :is-show-map="isShowMap"
          @closeMap="showRecordTable"
        />
      </el-row>
      <template slot="drawer">
        <el-form class="si-title-body" :model="form">
          <!--<el-form-item :label="translateTitle('所属厂区')">
            <el-select v-model="form.factoryId" placeholder="" clearable>
              <el-option
                v-for="list in factoryList"
                :key="list.id"
                :value="list.id"
                :label="list.name"
              ></el-option>
            </el-select>
          </el-form-item>-->
          <el-form-item :label="translateTitle('所属区域')">
            <el-cascader
              v-model="form.departId"
              placeholder=""
              clearable
              style="width: 100%"
              :props="propData"
              :show-all-levels="true"
              :options="areaList"
            />
          </el-form-item>
          <el-form-item :label="translateTitle('执行班组-人员')">
            <el-input v-model="form.actionUserNameLike" />
            <!--          <el-select v-model="form.actionUserNameLike" placeholder="" clearable>-->
            <!--            <el-option-->
            <!--              v-for="list in pollingTaskSelectEnums"-->
            <!--              :key="list.code"-->
            <!--              :value="list.code"-->
            <!--              :label="list.value"-->
            <!--            ></el-option>-->
            <!--          </el-select>-->
          </el-form-item>
          <el-form-item :label="translateTitle('巡检类型')">
            <el-select v-model="form.taskType" placeholder="" clearable>
              <el-option value="1" :label="translateTitle('巡检')" />
              <el-option value="2" :label="translateTitle('点检')" />
            </el-select>
          </el-form-item>
          <el-form-item :label="translateTitle('计划名称')">
            <el-select v-model="form.pollingPlanId" placeholder="" filterable clearable>
              <el-option
                v-for="list in PlanList"
                :key="list.id"
                :value="list.id"
                :label="list.planName"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="translateTitle('任务状态')">
            <el-select v-model="form.taskStatus" placeholder="" clearable>
              <el-option
                v-for="list in pollingTaskSelectEnums"
                :key="list.code"
                :value="list.code"
                :label="list.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="translateTitle('是否异常')">
            <el-select v-model="form.isAbnormal" placeholder="" clearable>
              <el-option :value="true" :label="translateTitle('是')" />
              <el-option :value="false" :label="translateTitle('否')" />
            </el-select>
          </el-form-item>
          <el-form-item :label="translateTitle('开始时间')">
            <el-date-picker
              v-model="form.startCreatedTime"
              style="width: 100%"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              @change="changeStartTime"
            />
          </el-form-item>
          <el-form-item :label="translateTitle('结束时间')">
            <el-date-picker
              v-model="form.endCreatedTime"
              style="width: 100%"
              type="date"
              :picker-options="expireTimeOptionEnd"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-button class="bt-search_btn" type="primary" @click="doSearch">查询</el-button>
          <el-button class="common-search__reset" type="default" @click="doRest">重置</el-button>
        </el-form>
      </template>

      <!--      <zDrawer-->
      <!--        :visible="dialog"-->
      <!--        @closeDrawer="closeDrawer"-->
      <!--        @doSearch="doSearch"-->
      <!--        @doRest="doRest"-->
      <!--      >-->
      <!--      </zDrawer>-->
    </bt-page>
  </el-main>
</template>

<script>
import { hasPermission } from '@/utils/hasPermission'
import { translateTitle } from '../../i18n'
import { getSelectEnums } from '../../api/index'
import { getPollingCurTrace, getPollingDetailById, getPollingTaskList, getPollingTrace, } from '../../api/pollingRecord'
import { getFactoryList } from '../../api/factory'
import { getPollingPlanList } from '../../api/pollingPlan'
import zTable from '../../components/zTable'
import zDropicon from '../../components/zDropicon'
// import zDrawer from '../../components/zDrawer'
// import zPageTitle from '../../components/zPageTitle'
import recordDetail from '../../components/recordDetail/recordDetail'
import Trace from '../../components/trace/trace'
import { listAreaTree } from "@/module/inspect/api/basicSetting/area";

export default {
  components: {
    Trace,
    zTable,
    zDropicon,
    recordDetail,
  },
  data () {
    return {
      code: 'em:polling_task',
      level3List: [],
      tipIndex: 1,
      dialog: false,
      recordCols: [
        {
          prop: 'taskName',
          label: '计划名称',
          width: '160',
          showOverflowTooltip: true,
        },
        {
          prop: 'createdTime',
          label: '创建时间',
          width: '140',
          showOverflowTooltip: true,
        },
        {
          prop: 'shiftName',
          label: '执行班次',
          width: '160',
          showOverflowTooltip: true,
        },
        {
          slot: 'actionUserNameList',
          label: '执行班组-人员',
          width: '160',
          showOverflowTooltip: true,
        },
        { slot: 'taskStatus', label: '任务状态', width: '120' },
        { slot: 'equipmentAbnormalNum', label: '异常设备数', width: '100' },
        { slot: 'equipmentSkipNum', label: '跳过设备数', width: '100' },
        // { slot: 'isTimeout', label: '是否超时' },
        // { prop: 'createdTime', label: '计划开始时间', width: '100' },
        {
          prop: 'endTime',
          label: '实际结束时间',
          width: '150',
          showOverflowTooltip: true,
        },
        { prop: 'skipReason', label: '任务跳过原因', width: '140' },
        // { slot: 'trace', label: '巡检轨迹' },
        // { slot: 'curTrace', label: '实时轨迹' },
      ],
      recordOpList: [
        { value: '查看', disabled: false, hasPermission: 'DXJ-JL-view' },
      ],
      taskId: '',
      uniqueTaskId: '',
      pollingType: 1,
      isShowMap: false,
      form: {
        startCreatedTime: '',
        endCreatedTime: '',
      },
      PlanList: [],
      factoryList: [],
      ENUM_KEY: 'POLLING_TASK_STATUS',
      //下拉枚举
      pollingTaskSelectEnums: [],
      tableData: [],
      //区域列表
      areaList: [],
      total: 0,
      eachPageSize: 10,
      currentPage: 1,
      //当前任务详情
      curTaskDetail: { taskStandardVOList: [] },
      expireTimeOptionEnd: {
        disabledDate: (date) => {
          if (this.form.startCreatedTime) {
            return (
              date.getTime() < new Date(this.form.startCreatedTime).getTime()
            )
          }
        },
      },
      propData: {
        label: 'areaName',
        value: 'id',
        children: 'children',
        emitPath: false,
        checkStrictly: true,
      },
    }
  },
  async created () {
    await this.requestRecordData(1, this.eachPageSize)
    console.log('record page')
    getFactoryList().then((res) => {
      if (res.success == 1) {
        let { data } = res
        console.log('工厂列表', data)
        this.factoryList = data
      }
    })

    getPollingPlanList({
      pageNum: 1,
      pageSize: 1000,
    }).then((res) => {
      if (res.success == 1) {
        let { data } = res
        console.log('点巡检plan数据', data.result)
        this.PlanList = data.result
      }
    })

    listAreaTree().then(res => {
      if (res.success) {
        this.areaList = this.getTreeData(res.data)
        console.log("====ZZ:" + this.areaList)
      }
    })

    await getSelectEnums().then((res) => {
      let enumData = res.data
      this.pollingTaskSelectEnums = enumData[this.ENUM_KEY]
      console.log('selectEnums--', this.pollingTaskSelectEnums)
    })
    this.showOrHidden(this.recordOpList)
  },
  methods: {
    hasPermission,
    translateTitle,
    changeTag (index) {
      this.tipIndex = index
      if (index == 1) {
        //表格重新渲染
        this.$nextTick(() => this.$refs.recordTable.doLayout())
      }
    },
    //获取记录数据
    async requestRecordData (pageNum, pageSize) {
      await getPollingTaskList({
        pageSize,
        pageNum,
        ...this.form,
      }).then((res) => {
        let { data } = res
        console.log('点巡检记录数据', data)
        this.currentPage = data.pageNum
        this.eachPageSize = data.pageSize
        this.total = data.total
        this.tableData = data.result
      })
    },
    doSearch () {
      this.requestRecordData(1, this.eachPageSize)
      this.closeDrawer()
    },
    doRest () {
      this.form = {
        startCreatedTime: '',
        endCreatedTime: '',
      }
      this.requestRecordData(1, this.eachPageSize)
      this.closeDrawer()
    },
    //查看巡检轨迹
    async handleCheckRecordTrace (row) {
      // console.log(row)
      this.taskId = row.id
      this.uniqueTaskId = row.id + 'type1'
      this.pollingType = 1
      let flag = true
      await getPollingTrace({
        taskId: this.taskId,
      }).then((res) => {
        if (res.success == 1) {
          let { data } = res
          //actulPolygons
          let actulMarkData = []
          data.actulVO.forEach((item, index) => {
            if (
              item.coordinates.length == 2 &&
              item.coordinates[0] &&
              item.coordinates[1]
            ) {
              actulMarkData.push(item)
            }
          })
          if (actulMarkData.length == 0) flag = false
        }
      })
      if (!flag) {
        this.$msg({
          message: this.translateTitle('暂无有效巡检轨迹'),
          type: 'warning',
        })
        return
      }
      this.tipIndex = 3
      this.isShowMap = true
    },
    //查看实时轨迹
    handleCheckRealTrace (row) {
      console.log(row)
      getPollingCurTrace({ taskId: row.id }).then((res) => {
        let { success, data } = res
        if (success == 1) {
          if (data.length == 0) {
            this.$msg({
              message: this.translateTitle('暂无有效巡检轨迹'),
              type: 'warning',
            })
            return
          } else {
            this.taskId = row.id
            this.uniqueTaskId = row.id + 'type2'
            this.pollingType = 2
            this.tipIndex = 3
            this.isShowMap = true
          }
        }
      })
    },
    //查看巡检详情
    handleCheckRecordDetail (index, row) {
      console.log('当前任务--', index, row)
      getPollingDetailById({ id: row.id }).then((res) => {
        if (res.success == 1) {
          let { data } = res
          this.curTaskDetail = data
          console.log('当前选中任务详情--', this.curTaskDetail)
          this.tipIndex = 2
        }
      })
    },
    //分页
    handleCurrentChange (val) {
      this.currentPage = val
      this.requestRecordData(val, this.eachPageSize)
    },
    showOrHidden (arr) {
      arr.forEach((item) => {
        item.disabled = hasPermission(item.hasPermission) ? false : true
      })
    },
    changeStartTime (date) {
      this.form.endCreatedTime = ''
    },
    openDrawer () {
      this.dialog = true
    },
    closeDrawer () {
      this.dialog = false
    },
    handleIconRecord (res) {
      if (res.type === '查看')
        this.handleCheckRecordDetail(res.index, res.row)
    },
    showRecordTable () {
      this.tipIndex = 1
      this.isShowMap = false
      this.$refs.recordTable.doLayout()
    },

    getTreeData (data) {
      // 循环遍历json数据
      for (var i = 0; i < data.length; i++) {
        if ((data[i].children == undefined) || (data[i].children.length < 1)) {
          // children若为空数组，则将children设为undefined
          data[i].children = undefined
        } else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].children)
        }
      }
      return data
    },
  },
}
</script>

<style scoped lang="scss">
  @import '../../css/base';
</style>
