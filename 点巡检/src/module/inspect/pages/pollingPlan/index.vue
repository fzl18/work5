<template>
  <el-main ref="main" class="si">
    <bt-page :title="$route.meta.title" icon-bg-color="#FF866A" :show-drawer="true">
      <!--      <zPageTitle-->
      <!--        title="点巡检计划"-->
      <!--        show-filter-->
      <!--        @handleIconClick="openDrawer"-->
      <!--      >-->
      <!--        <zDropdown-->
      <!--          v-show="hasPermission('DXJ-JH-add') && tipIndex == 1"-->
      <!--          :drop-data="dropData"-->
      <!--          @handleDropClick="handleCommand"-->
      <!--        />-->
      <!--      </zPageTitle>-->
      <template slot="option">
        <bt-dropdown>
          <i class="el-icon-plus" />
          操作
          <bt-dropdown-menu v-show="hasPermission('DXJ-JH-add') && tipIndex == 1">
            <bt-dropdown-item @click="handleCommand('around')">
              <i class="el-icon-plus" />
              新建巡检
            </bt-dropdown-item>
            <bt-dropdown-item @click="handleCommand('spot')">
              <i class="el-icon-plus" />
              新建点检
            </bt-dropdown-item>
          </bt-dropdown-menu>
        </bt-dropdown>
      </template>

      <div v-show="tipIndex == 1" class="s-box">
        <!-- 计划表格 -->
        <el-tabs>
          <el-tab-pane :label="translateTitle('点巡检计划')">
            <!--          :height="300"-->
            <zTable
              ref="planTable"
              :table-data="tableData"
              :cols="planCols"
              :height="300"
              :total="total"
              :each-page-size="eachPageSize"
              :current-page="currentPage"
              :show-handle="true"
              :show-index="true"
              :show-row-highlight="true"
              @pageChange="handlePlanCurrentChange"
              @sizeChange="handlePlanSizeChange"
              @rowChange="handleCurPlanChange"
            >
              <template #planType="scope">
                {{
                  scope.row.planType == '1'
                    ? translateTitle('巡检')
                    : translateTitle('点检')
                }}
              </template>
              <template #handle="slotData">
                <zDropicon
                  :slot-data="slotData"
                  :op-list="planOpList"
                  @handleIconFn="handleIconPlan"
                />
              </template>
            </zTable>
          </el-tab-pane>
        </el-tabs>
        <!-- 巡检记录表格 -->
        <el-tabs>
          <el-tab-pane :label="translateTitle('巡检记录')">
            <zTable
              ref="recordTable"
              :height="300"
              :table-data="pollingPlanRecordInfo.tableData"
              :cols="recordCols"
              :total="pollingPlanRecordInfo.total"
              :show-index="true"
              :each-page-size="pollingPlanRecordInfo.eachPageSize"
              :current-page="pollingPlanRecordInfo.currentPage"
              :show-handle="true"
              @pageChange="handleCurrentPlanRecordChange"
            >
              <template #actionUserNameList="scope">
                {{ scope.row.actionUserNameList.join(',') }}
              </template>
              <template #isSkip="scope">
                {{
                  scope.row.isSkip ? translateTitle('是') : translateTitle('否')
                }}
              </template>
              <template #handle="slotData">
                <zDropicon
                  :slot-data="slotData"
                  :op-list="recordOpList"
                  @handleIconFn="handleIconRecord"
                />
              </template>
            </zTable>
          </el-tab-pane>
        </el-tabs>
      </div>

      <div v-show="tipIndex == 3">
        <recordDetail :cur-task-detail="taskDetail" @goBack="changeTag(1)" />
      </div>

      <zDrawer
        :visible="dialog"
        @closeDrawer="closeDrawer"
        @doSearch="doSearch"
        @doRest="doRest"
      >
        <el-form class="si-title-body">
          <el-form-item :label="translateTitle('点巡检')">
            <el-select v-model="searchPlanData.planType" placeholder="" clearable>
              <el-option
                v-for="list in standardTypeSelect"
                :key="list.code"
                :value="list.code"
                :label="list.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="translateTitle('计划名称/号')">
            <el-input v-model="searchPlanData.planNameAndCode" />
          </el-form-item>
          <el-form-item :label="translateTitle('执行状态')">
            <el-select v-model="searchPlanData.isEnabled" placeholder="" clearable>
              <el-option
                :value="true"
                :label="translateTitle('启用')"
              />
              <el-option
                :value="false"
                :label="translateTitle('停用')"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </zDrawer>
    </bt-page>
  </el-main>
</template>

<script>
import { hasPermission } from '@/utils/hasPermission'
import { translateTitle } from '../../i18n'
import { getSelectEnums } from '../../api/index'
import { changePlanActionStatus, deletePollingPlan, getPollingPlanList, } from '../../api/pollingPlan'
import { getPollingDetailById, getPollingRecordsByPlanId, } from '../../api/pollingRecord'
import zTable from '../../components/zTable'
import zDropicon from '../../components/zDropicon'
import zDrawer from '../../components/zDrawer'
import recordDetail from '../../components/recordDetail/recordDetail'

export default {
  components: {
    // PollingRecord
    zTable,
    // zDropdown,
    zDropicon,
    zDrawer,
    // zPageTitle,
    recordDetail,
  },
  data () {
    return {
      code: 'em:polling_plan',
      level3List: [],
      topActiveName: 'plan',
      botActiveName: 'record',
      dropData: [],
      planOpList: [
        { value: '查看', disabled: false, hasPermission: 'DXJ-JH-view' },
        {
          value: '编辑',
          disabled: false,
          hasPermission: 'DXJ-JH-edit',
        },
        {
          value: '删除',
          disabled: false,
          hasPermission: 'DXJ-JH-delete',
        },
        {
          value: '启用',
          disabled: false,
          hasPermission: 'DXJ-JH-on',
        },
        {
          value: '停用',
          disabled: false,
          hasPermission: 'DXJ-JH-off',
        },
      ],
      standardOpList: [
        { value: '添加标准', disabled: false },
        { value: '删除', disabled: false },
      ],
      recordOpList: [{ value: '查看', disabled: false }],
      tipIndex: 1,
      planCols: [
        { slot: 'planType', label: '点巡检', width: '70' },
        {
          prop: 'planCode',
          label: '计划编号',
          width: 150,
          showOverflowTooltip: true,
        },
        {
          prop: 'planName',
          label: '计划名称',
          width: 160,
          showOverflowTooltip: true,
        },
        { prop: 'isEnabled', label: '执行状态', width: '100' },
        {
          prop: 'checkInPointNum',
          label: '关联管理点',
          width: 80,
          showOverflowTooltip: true,
        },
        {
          prop: 'equipmentNum',
          label: '关联设备',
          width: 80,
          showOverflowTooltip: true,
        },
        {
          prop: 'shiftTeamNames',
          width: 500,
          label: '执行班次-班组',
          showOverflowTooltip: true,
        }
      ],
      recordCols: [
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
        {
          prop: 'taskStatusStr',
          label: '执行状态',
          width: '90',
          showOverflowTooltip: true,
        },
        // {
        //   prop: 'startTime',
        //   label: '开始时间',
        //   width: '150',
        //   showOverflowTooltip: true,
        // },
        // {
        //   prop: 'endTime',
        //   label: '结束时间',
        //   width: '150',
        //   showOverflowTooltip: true,
        // },
        {
          prop: 'equipmentAbnormalNum',
          label: '异常设备数',
          width: '90',
        },
        {
          prop: 'equipmentSkipNum',
          label: '跳过设备数',
          width: '90',
        },
        {
          slot: 'isSkip',
          label: '是否跳过',
          width: '90',
        },
        { prop: 'skipReason', label: '跳过原因' },
      ],
      dialog: false,
      pagesInfo: {
        showPlan: false,
        showRecord: false,
      },
      active: true,
      onlyRead: false,
      tableData: [],
      tableContentData: [],
      total: 0,
      eachPageSize: 10,
      currentPage: 1,
      searchPlanData: {
        isEnabled: '',
        planNameAndCode: '',
        planType: '',
      },
      ENUM_KEY: 'POLLING_TYPE',
      //点检 巡检
      standardTypeSelect: [],
      curPlanData: null,
      //巡检记录数据
      pollingPlanRecordInfo: {
        tableData: [],
        total: 0,
        eachPageSize: 10,
        currentPage: 1,
      },
      //记录详情
      taskDetail: {},
      searchExpireTimeOptionEnd: {
        disabledDate: (date) => {
          if (this.searchPlanData.startTime) {
            return (
              date.getTime() <
              new Date(this.searchPlanData.startTime).getTime() +
              24 * 60 * 60 * 1000
            )
          }
        },
      },
    }
  },
  watch: {
    onlyRead (newVal, oldVal) {
      if (newVal) {
        this.standardOpList.forEach((item) => (item.disabled = true))
      } else {
        this.standardOpList.forEach((item) => (item.disabled = false))
      }
    },
    '$i18n.locale' () {
      this.setRules()
    },
  },
  async created () {
    this.showOrHidden(this.planOpList)
    await this.requestPlanData(1, this.eachPageSize)

    await getSelectEnums().then((res) => {
      let enumData = res.data
      this.standardTypeSelect = enumData[this.ENUM_KEY]
    })

  },
  mounted () {
    this.setRules()
  },
  methods: {
    hasPermission,
    translateTitle,
    setRules () {
      this.dropData = [
        {
          command: 'around',
          value: this.translateTitle('新建巡检'),
          iconClass: 'el-icon-plus',
        },
        {
          command: 'spot',
          value: this.translateTitle('新建点检'),
          iconClass: 'el-icon-plus',
        },
      ]
    },
    changeTag (index) {
      this.tipIndex = index
      if (index == 1) {
        this.$nextTick(() => {
          this.$refs.recordTable.doLayout()
          this.$refs.planTable.doLayout()
        })
      }
    },
    //tip关闭
    tipClose (index) {
      if (index == 2) {
        this.pagesInfo.showPlan = false
      }
      if (index == 3) {
        this.pagesInfo.showRecord = false
      }
      this.tipIndex = 1
      this.$refs.main.$el.scrollTop = 0
      if (index != 1) {
        this.$nextTick(() => {
          this.$refs.recordTable.doLayout()
          this.$refs.planTable.doLayout()
        })
      }
    },
    handleSavePlan ({ id = '', planType = '1' }) {
      this.$router.push({
        name: 'planAdd',
        query: { id, planType }
      })
    },
    //新建巡检计划
    // handleNewAroundPlan () {
    //   this.$router.push({
    //     name: 'planAdd',
    //     query: {
    //       planType: '1'
    //       // params: JSON.stringify({
    //       //   data: {'planType': '1'},
    //       // }),
    //     },
    //   })
    // },
    // //新建点检计划
    // handleNewSpotPlan () {
    //   this.$router.push({
    //     name: 'planAdd',
    //     query: {
    //       planType: '2'
    //     }
    //   })
    // },
    //获取plan列表
    async requestPlanData (pageNum, pageSize) {
      await getPollingPlanList({
        pageNum,
        pageSize,
        ...this.searchPlanData,
      }).then((res) => {
        if (res.success == 1) {
          let { data } = res
          console.log('点巡检plan数据', data)
          this.currentPage = data.pageNum
          this.eachPageSize = data.pageSize
          this.total = data.total
          data.result.forEach((item) => {
            item.isEnabled = item.isEnabled ? '启用' : '停用'
            //frequency 频次
            item.frequency =
              item.intervalTime +
              item.intervalUnit +
              '/' +
              item.intervalCount +
              '次'
          })
          this.tableData = data.result
        }
      })
    },
    //plan 当前选中的计划
    handleCurPlanChange (val) {
      console.log('当前选中的计划', val)
      this.curPlanData = val
      // this.pollingPlanRecordInfo
      this.curPlanData &&
      this.requestPlanRecordData(1, this.pollingPlanRecordInfo.eachPageSize)
    },
    //更改计划执行状态
    changeEnabled (index, row, flag) {
      console.log(row)
      changePlanActionStatus({
        id: row.id,
        status: flag,
      }).then((res) => {
        if (res.success == 1) {
          this.showSuccessTip('计划状态修改成功')
          this.requestPlanData(1, this.eachPageSize)
        }
      })
    },
    //plan
    handlePlanSizeChange (val) {
      this.eachPageSize = val
      this.currentPage = 1
      this.requestPlanData(1, this.eachPageSize)
    },
    //plan
    handlePlanCurrentChange (val) {
      this.currentPage = val
      this.requestPlanData(val, this.eachPageSize)
    },
    //查看计划
    handleCheckPlan (index, row) {

      this.$router.push({
        path: 'planAdd',
        query: {
          params: JSON.stringify({
            isEdit: true,
            onlyRead: true,
            data: row,
          }),
        },
      })
    },
    //删除计划
    handleDeletePlan (index, row) {
      this.$confirm(
          this.translateTitle('确定本次操作吗执行后将不可撤销'),
          this.translateTitle('警告'),
          {
            confirmButtonText: this.translateTitle('确定'),
            cancelButtonText: this.translateTitle('取消'),
            type: 'warning',
            center: true,
          }
        )
        .then((res) => {
          deletePollingPlan({ id: row.id }).then((res) => {
            if (res.success == 1) {
              this.showSuccessTip('删除成功')
              this.requestPlanData(1, this.eachPageSize)
            }
          })
        })
        .catch((e) => {})
    },
    //编辑计划
    handleEditPlan (index, row) {
      this.$router.push({
        path: 'planAdd',
        query: {
          id
          // params: JSON.stringify({
          //   isEdit: true,
          //   data: row,
          // }),
        }
      })
    },
    //查看巡检记录详细信息
    handleCheckRecord (index, row) {
      console.log(index, row)
      getPollingDetailById({ id: row.id }).then((res) => {
        if (res.success == 1) {
          let { data } = res
          this.taskDetail = data
          console.log('当前选中任务jilu详情--', this.taskDetail)
          this.pagesInfo.showRecord = true
          this.tipIndex = 3
        }
      })
    },
    //请求计划巡检记录数据
    requestPlanRecordData (pageNum, pageSize) {
      getPollingRecordsByPlanId({
        id: this.curPlanData.id,
        pageNum,
        pageSize,
      }).then((res) => {
        if (res.success == 1) {
          let { data } = res
          console.log(data)
          this.pollingPlanRecordInfo.tableData = data.result
          this.pollingPlanRecordInfo.currentPage = data.pageNum
          this.pollingPlanRecordInfo.eachPageSize = data.pageSize
          this.pollingPlanRecordInfo.total = data.total
          this.$refs.recordTable.doLayout()
        }
      })
    },
    //计划巡检记录翻页器
    handleCurrentPlanRecordChange (val) {
      this.requestPlanRecordData(val, this.pollingPlanRecordInfo.eachPageSize)
    },
    //搜索计划
    doSearch () {
      this.requestPlanData(1, this.eachPageSize)
      this.closeDrawer()
    },
    doRest () {
      this.searchPlanData = {
        isEnabled: '',
        planNameAndCode: '',
        startTime: '',
        endTime: '',
        planName: '',
        planCode: '',
      }
      this.requestPlanData(1, this.eachPageSize)
      this.closeDrawer()
    },
    showOrHidden (arr) {
      arr.forEach((item) => {
        item.disabled = this.hasPermission(item.hasPermission) ? false : true
      })
    },
    changeSearchStartTime () {
      this.searchPlanData.endTime = ''
    },
    //查看排班计划
    naviToScheduling (row) {
      console.log(row)
      this.$router.push({
        name: 'scheduling',
        params: {
          id: row.schedulingId,
        },
      })
    },
    openDrawer () {
      this.dialog = true
    },
    closeDrawer () {
      this.dialog = false
    },
    handleCommand (command) {
      const cmd = { 'around': '1', 'spot': '2' }
      if (cmd.hasOwnProperty(command)) {
        this.handleSavePlan({ planType: cmd[command] })
      }
      // if (command === 'around') this.handleNewAroundPlan()
      // if (command === 'spot') this.handleNewSpotPlan()
    },
    handleIconPlan (res) {
      switch (res.type) {
        case '查看':
          // this.handleCheckPlan(res.index, res.row)
          this.handleSavePlan({ id: res.row.id })
          break
        case '编辑':
          // this.handleEditPlan(res.index, res.row)
          this.handleSavePlan({ id: res.row.id })
          break
        case '删除':
          this.handleDeletePlan(res.index, res.row)
          break
        case '启用':
          this.changeEnabled(res.index, res.row, true)
          break
        case '停用':
          this.changeEnabled(res.index, res.row, false)
          break
      }
    },
    handleIconRecord (res) {
      if (res.type === '查看') this.handleCheckRecord(res.index, res.row)
    },
    showSuccessTip (title) {
      this.$msg({
        message: this.translateTitle(title),
        type: 'success',
      })
    },
    showErrorTip (title) {
      this.$msg({
        message: this.translateTitle(title),
        type: 'error',
      })
    },
  },
}
</script>

<style scoped lang="scss">
  @import '../../css/base';
</style>
