<template>
  <el-main class="si">
    <bt-page :title="$route.meta.title" icon-bg-color="#FF866A" :show-drawer="true">
      <template slot="option">
        <bt-dropdown>
          <i class="el-icon-plus" />
          操作
          <bt-dropdown-menu>
            <bt-dropdown-item v-show="hasPermission('DXJ-YFXWH-add')" @click="handleDropClick">
              <i class="el-icon-plus" />
              新建
            </bt-dropdown-item>
          </bt-dropdown-menu>
        </bt-dropdown>
      </template>
      <!--      <zPageTitle title="预防性维护管理" @handleIconClick="openDrawer">-->
      <!--        <zDropdown-->
      <!--          v-show="hasPermission('DXJ-YFXWH-add')"-->
      <!--          :drop-data="dropData"-->
      <!--          @handleClick="handleDropClick"-->
      <!--          @handleDropClick="handleCommand"-->
      <!--        />-->
      <!--      </zPageTitle>-->

      <div>
        <el-tabs>
          <el-tab-pane :label="translateTitle('预防性维护计划')">
            <zTable
              ref="planTable"
              :height="300"
              :table-data="tableData"
              :cols="cols"
              :total="total"
              :current-page="currentPage"
              :show-handle="true"
              :show-index="true"
              :show-row-highlight="true"
              @pageChange="handleCurrentChange"
              @rowChange="handleCurPlanChange"
            >
              <template #planType="scope">
                {{
                  scope.row.planType === 'oil'
                    ? translateTitle('给油脂')
                    : translateTitle('紧固')
                }}
              </template>

              <template #startTime="scope">
                {{ scope.row.startTime.split(' ')[0] }}
              </template>

              <template #endTime="scope">
                {{ scope.row.endTime.split(' ')[0] }}
              </template>

              <template #actionUserNameList="scope">
                <span v-if="scope.row.actionUserNameList.length > 0">
                  {{ scope.row.actionUserNameList.join(',') }}
                </span>
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

        <el-tabs>
          <el-tab-pane :label="translateTitle('预防性维护记录')">
            <zTable
              ref="recordTable"
              :height="300"
              :table-data="workorderRecordInfo.tableData"
              :cols="recordCols"
              :total="workorderRecordInfo.total"
              :show-index="true"
              :each-page-size="workorderRecordInfo.eachPageSize"
              :current-page="workorderRecordInfo.currentPage"
              @pageChange="handleCurrentPlanRecordChange"
            >
              <template #workorderStatus="scope">
                {{ scope.row.workorderStatus == '3' ? '待维修' : '' }}
                {{ scope.row.workorderStatus == '4' ? '维修中' : '' }}
                {{ scope.row.workorderStatus == '6' ? '已完成' : '' }}
                {{ scope.row.workorderStatus == '-1' ? '漏执行' : '' }}
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
      <!-- 筛选 -->
      <template slot="drawer">
        <el-form class="si-title-body">
          <el-form-item :label="translateTitle('计划名称/号')">
            <el-input v-model="searchPlanData.planNameAndCode" />
          </el-form-item>
          <el-form-item :label="translateTitle('区域')">
            <el-cascader
              v-model="searchPlanData.departId"
              placeholder=""
              clearable
              style="width: 100%"
              :props="propData"
              :show-all-levels="true"
              :options="areaList"
              @change="getDevicePageFn"
            />
          </el-form-item>
          <el-form-item :label="translateTitle('输送机')">
            <el-select
              v-model="searchPlanData.conveyorId"
              placeholder=""
              filterable
              clearable
            >
              <el-option
                v-for="list in conveyorList"
                :key="list.id"
                :value="list.id"
                :label="list.equipmentName"
              />
            </el-select>
          </el-form-item>

          <el-form-item :label="translateTitle('计划类别')">
            <el-select v-model="searchPlanData.planType" placeholder="" clearable>
              <el-option
                v-for="list in preventMaintainType"
                :key="list.code"
                :value="list.code"
                :label="list.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="translateTitle('执行状态')">
            <el-select
              v-model="searchPlanData.isEnabled"
              placeholder=""
              clearable
            >
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
          <el-form-item :label="translateTitle('开始日期')">
            <el-date-picker
              v-model="searchPlanData.startTime"
              style="width: 100%"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              @change="changeSearchStartTime"
            />
          </el-form-item>
          <el-form-item :label="translateTitle('结束日期')">
            <el-date-picker
              v-model="searchPlanData.endTime"
              style="width: 100%"
              type="date"
              :picker-options="searchEndTimeOptionEnd"
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
// import zDropdown from '../../components/zDropdown'
import zTable from '../../components/zTable'
// import zPageTitle from '../../components/zPageTitle'
import zDropicon from '../../components/zDropicon'
// import zDrawer from '../../components/zDrawer'
import {
  changePreventmaintainPlanActionStatus,
  deletePreventmaintainPlan,
  getPreventMaintainPlanList,
} from '../../api/preventMaintainPlan'
import { getWorkorderList } from '../../api/workOrder'
import { listAreaTree } from '../../api/basicSetting/area'
import { listMainEquip } from '../../api/basicSetting/equipPos'

export default {
  components: {
    zTable,
    // zDropdown,
    // zPageTitle,
    zDropicon
    // zDrawer,
  },
  data () {
    return {
      planOpList: [
        { value: '查看', disabled: false, hasPermission: 'DXJ-YFXWH-view' },
        {
          value: '编辑',
          disabled: false,
          hasPermission: 'DXJ-YFXWH-edit',
        },
        {
          value: '删除',
          disabled: false,
          hasPermission: 'DXJ-YFXWH-delete',
        },
        {
          value: '启用',
          disabled: false,
          hasPermission: 'DXJ-YFXWH-on',
        },
        {
          value: '停用',
          disabled: false,
          hasPermission: 'DXJ-YFXWH-off',
        },
      ],
      recordOpList: [],
      cols: [
        { slot: 'planType', label: '维护类别' },
        {
          prop: 'planCode',
          label: '计划号',
          width: 140,
          showOverflowTooltip: true,
        },
        {
          prop: 'planName',
          label: '计划名称',
          width: 100,
          showOverflowTooltip: true,
        },
        // { prop: 'factoryName', label: '厂区' },
        // { prop: 'workSpaceName', label: '作业区' },
        // {
        //   prop: 'productionLineName',
        //   label: '输送线',
        //   width: 150,
        //   showOverflowTooltip: true,
        // },
        { prop: 'departName', label: '所属区域' },
        {
          prop: 'conveyorName',
          label: '输送机',
          width: 150,
          showOverflowTooltip: true,
        },
        { prop: 'isEnabled', label: '执行状态' },
        {
          slot: 'startTime',
          label: '开始日期',
          width: 100,
          showHeaderTip: true,
          headerContent: '每日凌晨1点生成预防性维护工作任务',
        },
        { prop: 'endTime', label: '结束日期', width: 100 },
        {
          slot: 'actionUserNameList',
          label: '执行人',
          showOverflowTooltip: true,
        },
        { prop: 'equipmentNum', label: '关联设备', width: '80' },
      ],
      recordCols: [
        {
          prop: 'workorderNo',
          label: '工单号',
          width: 120,
          showOverflowTooltip: true,
        },
        {
          prop: 'workorderName',
          label: '工单名称',
          width: 210,
          showOverflowTooltip: true,
        },
        {
          prop: 'createdTime',
          label: '生成时间',
          width: 150,
          showOverflowTooltip: true,
        },
        {
          prop: 'pmPlanCompleteTime',
          label: '需完成时间',
          width: 150,
        },
        {
          prop: 'startTime',
          label: '开始时间',
          width: 150,
          showOverflowTooltip: true,
        },
        {
          prop: 'completeTime',
          label: '实际完成时间',
          width: 150,
          showOverflowTooltip: true,
        },
        // {
        //   prop: 'productionLineName',
        //   label: '输送线',
        //   width: 150,
        //   showOverflowTooltip: true,
        // },
        {
          prop: 'conveyorName',
          label: '输送机',
          width: 150,
          showOverflowTooltip: true,
        },
        {
          prop: 'actionUserName',
          label: '保养人',
          width: 150,
          showOverflowTooltip: true,
        },
        {
          prop: 'additionalRemarks',
          label: '补充说明',
          width: 200,
          showOverflowTooltip: true,
        },
        { slot: 'workorderStatus', label: '完成情况' },
      ],
      dropData: [],
      curPlanData: null,
      //工单记录数据
      workorderRecordInfo: {
        tableData: [],
        total: 0,
        eachPageSize: 10,
        currentPage: 1,
      },
      level3List: [],
      isCreate: true,
      addFlag: true,
      editFlag: false,
      onlyRead: false,
      currentPage: 1,
      tableData: [],
      editData: {},
      curIndex: -1,
      tableLoading: false,
      dialog: false,
      preventMaintainType: [
        { value: '给油脂', code: 'oil' },
        { value: '紧固', code: 'fasten' },
      ],
      total: 1,
      eachPageSize: 10,
      searchPlanData: {
        isEnabled: '',
        planNameAndCode: '',
        startTime: '',
        endTime: '',
        planName: '',
        planCode: '',
        // factoryId: '',
        // workSpaceId: '',
        // productionLineId: '',
        departId: '',
        conveyorId: '',
      },
      createData: {
        isEnabled: true,
        rfidFrequency: '9.15',
        rfidPower: '2400',
      },
      fAreaList: [],
      formRules: {},
      dialogCopyVisible: false,
      factoryList: [],
      workSpaceList: [],
      productLineList: [],
      form: {
        factoryId: '',
        workSpaceId: '',
        productionLineId: '',
      },
      searchEndTimeOptionEnd: {
        disabledDate: (date) => {
          if (this.searchPlanData.startTime) {
            return (
              date.getTime() <
              new Date(this.searchPlanData.startTime).getTime()
            )
          }
        },
      },
      conveyorList: [],
      propData: {
        label: 'areaName',
        value: 'id',
        children: 'children',
        emitPath: false,
        checkStrictly: true,
      },
      areaList: [],
    }
  },
  watch: {
    '$i18n.locale' () {
      this.setRules()
    },
  },
  created () {
    this.requestPlanData(1, this.eachPageSize)
    // getFactoryList().then((res) => {
    //   let { success, data } = res
    //   if (success) this.factoryList = data
    // })
    this.getDevicePageFn()
    this.showOrHidden(this.planOpList)

    listAreaTree().then(res => {
      if (res.success) {
        this.areaList = this.getTreeData(res.data)
        console.log("====ZZ:" + this.areaList)
      }
    })
  },
  mounted () {},
  methods: {
    hasPermission,
    translateTitle,
    changeTag (index) {
      this.tipIndex = index
      if (preventMaintainIndex == 1) {
        this.$nextTick(() => {
          this.$refs.planTable.doLayout()
        })
      }
    },
    requestPlanData (pageNum, pageSize) {
      getPreventMaintainPlanList({
        pageNum,
        pageSize,
        ...this.searchPlanData,
      }).then((res) => {
        let { success, data } = res
        if (!success) return
        this.currentPage = data.pageNum
        this.eachPageSize = data.pageSize
        this.total = data.total
        data.result.forEach((item) => {
          item.isEnabled
            ? (item.isEnabled = '启用中')
            : (item.isEnabled = '禁用')
        })
        this.tableData = data.result
      })
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.requestPlanData(val, this.eachPageSize)
    },
    requestWorkorderData (pageNum, pageSize) {
      let query = { pmPlanId: this.curPlanData.id }
      getWorkorderList({
        pageNum,
        pageSize,
        ...query,
      }).then((res) => {
        // console.log(res);
        if (res.success == 1) {
          let { data } = res
          console.log('工单数据', data)
          this.workorderRecordInfo.currentPage = data.pageNum
          this.workorderRecordInfo.eachPageSize = data.pageSize
          this.workorderRecordInfo.total = data.total
          this.workorderRecordInfo.tableData = data.result
        }
      })
    },
    //计划巡检记录翻页器
    handleCurrentPlanRecordChange (val) {
      this.requestWorkorderData(val, this.workorderRecordInfo.eachPageSize)
    },
    //plan 当前选中的计划
    handleCurPlanChange (val) {
      console.log('当前选中的计划', val)
      this.curPlanData = val
      // this.pollingPlanRecordInfo
      this.curPlanData &&
      this.requestWorkorderData(1, this.workorderRecordInfo.eachPageSize)
    },
    handleIconRecord (res) {},
    showOrHidden (arr) {
      arr.forEach((item) => {
        item.disabled = hasPermission(item.hasPermission) ? false : true
      })
    },
    resetData () {
      this.createData = this.$options.data().createData
      this.$refs.form.resetFields()
    },
    cancelFn () {
      this.addFlag = true
      this.editFlag = false
      this.onlyRead = false
      this.createData = this.$options.data().createData
      this.$refs.form.resetFields()
      this.changeTag(1)
    },
    handleCommand (command) {
      if (command == 'create') {
        this.addFlag = true
        this.editFlag = false
        ;(this.onlyRead = false), this.resetData()
        this.changeTag(2)
      }
    },
    handleDropClick () {
      // this.addFlag = true
      // this.editFlag = false
      // this.onlyRead = false
      // this.resetData()
      // this.changeTag(2)
      this.$router.push({ name: 'preventMaintainAdd' })
    },
    handleCopyClick () {
      this.dialogCopyVisible = true
    },
    //设备
    handleCloseCopyDia () {
      this.dialogCopyVisible = false
    },
    handleIconPlan (res) {
      switch (res.type) {
        case '查看':
          this.handleViewPlan(res.index, res.row)
          break
        case '编辑':
          this.handleEditPlan(res.index, res.row)
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
    handleViewPlan (index, row) {
      this.$router.push({
        path: 'preventMaintainAdd',
        query: {
          params: JSON.stringify({
            isEdit: true,
            onlyRead: true,
            data: row,
          }),
        },
      })
    },
    handleEditPlan (index, row) {
      this.$router.push({
        path: 'preventMaintainAdd',
        query: {
          params: JSON.stringify({
            isEdit: true,
            data: row,
          }),
        },
      })
    },
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
          deletePreventmaintainPlan({ id: row.id }).then((res) => {
            if (res.success == 1) {
              this.$msg.success('删除成功')
              this.requestPlanData(1, this.eachPageSize)
            }
          })
        })
        .catch((e) => {})
    },
    //更改计划执行状态
    changeEnabled (index, row, flag) {
      console.log(row)
      changePreventmaintainPlanActionStatus({
        id: row.id,
        status: flag,
      }).then((res) => {
        if (res.success == 1) {
          this.$msg.success('计划状态修改成功')
          this.requestPlanData(1, this.eachPageSize)
        }
      })
    },
    /*changeGetWorkSpacePageList(val) {
      this.workSpaceList = []
      this.productLineList = []
      this.form.workSpaceId = ''
      this.form.productionLineId = ''
      getWorkSpacePage({
        pageSize: 99999,
        pageNum: 1,
        factoryId: val,
      }).then((res) => {
        let { success, data } = res
        if (success) this.workSpaceList = data
      })
    },
    changeGetProductionLinePageList(val) {
      this.productLineList = []
      this.form.productionLineId = ''
      getProductLineList({
        pageSize: 99999,
        pageNum: 1,
        workSpaceId: val,
      }).then((res) => {
        let { success, data } = res
        if (success) this.productLineList = data
      })
    },*/
    // 获取输送机列表
    getDevicePageFn (areaId) {

      /*
      monitorApi
        .getConveyorList({ params: { current: -1, size: -1, domain } })
        .then((res) => {
          let { success, data } = res
          this.conveyorList = data.records
        })

       */

      listMainEquip({ areaId: areaId }).then(res => {
        if (res.success) {
          this.conveyorList = res.data
          console.log("====YY:" + this.conveyorList)
        }
      })
    },
    openDrawer () {
      this.dialog = true
    },
    closeDrawer () {
      this.dialog = false
    },
    changeSearchStartTime () {
      this.searchPlanData.endTime = ''
    },
    //搜索计划
    doSearch () {
      this.requestPlanData(1, this.eachPageSize)
      this.closeDrawer()
    },
    doRest () {
      ;(this.searchPlanData = {
        isEnabled: '',
        planNameAndCode: '',
        startTime: '',
        endTime: '',
        planName: '',
        planCode: '',
        // factoryId: '',
        // workSpaceId: '',
        // productionLineId: '',
        departId: '',
        conveyorId: '',
      }),
        this.requestPlanData(1, this.eachPageSize)
      this.closeDrawer()
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
