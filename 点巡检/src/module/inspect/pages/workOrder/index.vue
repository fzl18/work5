<template>
  <el-main class="si">
    <bt-page :title="$route.meta.title" icon-bg-color="#FF866A" :show-drawer="true">
      <template slot="option">
        <bt-dropdown>
          <i class="el-icon-plus" />
          操作
          <bt-dropdown-menu>
            <bt-dropdown-item v-if="hasPermission('DXJ-GDGL-add') && tipIndex == 1" @click="addWorkOrderBtn">
              <i class="el-icon-plus" />
              新建
            </bt-dropdown-item>
          </bt-dropdown-menu>
        </bt-dropdown>
      </template>
      <!--      <zPageTitle-->
      <!--        :show-filter="tipIndex == 1"-->
      <!--        title="工单管理"-->
      <!--        @handleIconClick="handleDropClick"-->
      <!--      >-->
      <!--        <zDropdown-->
      <!--          v-show="hasPermission('DXJ-GDGL-add') && tipIndex == 1"-->
      <!--          :drop-data="[]"-->
      <!--          @handleClick="addWorkOrderBtn"-->
      <!--        />-->
      <!--      </zPageTitle>-->
      <div v-show="tipIndex == 1" class="s-box">
        <el-tabs>
          <el-tab-pane :label="translateTitle('工单列表')">
            <zTable
              ref="topTable"
              :table-data="tableData"
              :cols="workOrderCols"
              :height="300"
              :total="pageConfig.total"
              :each-page-size="pageConfig.eachPageSize"
              :current-page="pageConfig.currentPage"
              :show-handle="true"
              :show-index="true"
              :show-row-highlight="true"
              @rowChange="handleCurWorkOrderChange"
              @pageChange="handleCurrentChange"
            >
              <template #workorderType="scope">
                {{ scope.row.workorderType == 'abnormal' ? '维修' : '' }}
                {{ scope.row.workorderType == 'preventMaintain' ? '保养' : '' }}
              </template>
              <template #workorderStatus="scope">
                {{ scope.row.workorderStatus == '1' ? '待审批' : '' }}
                {{ scope.row.workorderStatus == '2' ? '已驳回' : '' }}
                {{ scope.row.workorderStatus == '3' ? '待维修' : '' }}
                {{ scope.row.workorderStatus == '4' ? '维修中' : '' }}
                {{ scope.row.workorderStatus == '5' ? '待验收' : '' }}
                {{ scope.row.workorderStatus == '6' ? '已完成' : '' }}
                {{ scope.row.workorderStatus == '-1' ? '漏执行' : '' }}
              </template>
              <template #isOvertime="scope">
                {{ scope.row.isOvertime == true ? '已超时' : '' }}
                {{ scope.row.isOvertime == false ? '未超时' : '' }}
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
                <el-dropdown
                  class="s-dropdown-onlyicon"
                  placement="bottom"
                  trigger="click"
                >
                  <span class="el-dropdown-link">
                    <span class="s-span">
                      <i class="el-icon-caret-bottom" />
                    </span>
                  </span>
                  <el-dropdown-menu slot="dropdown" class="s-dropdown-menu">
                    <el-dropdown-item
                      v-if="
                        hasPermission('DXJ-GDGL-pj') &&
                          slotData.row.workorderStatus == '6'
                      "
                      @click.native="
                        handleCheckEvaluate(slotData.$index, slotData.row)
                      "
                    >
                      <i class="el-icon-view" />
                      {{ translateTitle('查看评价') }}
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-if="hasPermission('DXJ-GDGL-view')"
                      @click.native="
                        handleCheckOrder(slotData.$index, slotData.row)
                      "
                    >
                      <i class="el-icon-view" />
                      {{ translateTitle('查看') }}
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-if="
                        hasPermission('DXJ-GDGL-edit') &&
                          (slotData.row.workorderStatus == '1' ||
                            slotData.row.workorderStatus == '2')
                      "
                      @click.native="
                        handleEditOrder(slotData.$index, slotData.row)
                      "
                    >
                      <i class="el-icon-edit" />
                      {{ translateTitle('编辑') }}
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-if="hasPermission('DXJ-GDGL-delete')"
                      @click.native="
                        handleDeleteOrder(slotData.$index, slotData.row)
                      "
                    >
                      <i class="el-icon-delete" />
                      {{ translateTitle('删除') }}
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-if="
                        hasPermission('DXJ-GDGL-sp') &&
                          slotData.row.workorderStatus == '1'
                      "
                      @click.native="ApprovalBtn(slotData.row)"
                    >
                      <i class="el-icon-edit-outline" />
                      {{ translateTitle('审批') }}
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-if="
                        hasPermission('DXJ-GDGL-ys') &&
                          slotData.row.workorderStatus == '5'
                      "
                      @click.native="acceptanceBtn(slotData.row)"
                    >
                      <i class="el-icon-document-checked" />
                      {{ translateTitle('验收') }}
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-if="hasPermission('DXJ-GDGL-exportExcel')"
                      @click.native="exportExcel(slotData.row)"
                    >
                      <i class="el-icon-document-checked" />
                      {{ translateTitle('导出检修单') }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </zTable>
          </el-tab-pane>
        </el-tabs>

        <!-- 操作记录 -->
        <el-tabs>
          <el-tab-pane :label="translateTitle('操作记录')">
            <zTable
              ref="rTable"
              :height="200"
              :table-data="curDeviceRecordData.operationRecords"
              :cols="operationCols"
              :show-index="true"
              :show-pagination="false"
            />
          </el-tab-pane>
          <el-tab-pane :label="translateTitle('更换备件')">
            <zTable
              ref="pTable"
              :height="200"
              :table-data="curDeviceRecordData.partsRecords"
              :cols="partsRecordCols"
              :show-index="true"
              :show-pagination="false"
            />
          </el-tab-pane>
        </el-tabs>
      </div>

      <div>
        <Trace
          :id="taskId"
          :unique-task-id="taskId"
          :type="2"
          :is-show-map="isShowMap"
          :page-type="2"
          @closeMap="showWorkOrderTable"
        />
      </div>

      <!-- 工单审批 -->
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="approveDialog"
        :title="translateTitle('工单审批')"
        :modal="false"
        :before-close="handleCloseApproveDialog"
      >
        <el-form label-width="100px">
          <el-form-item label="审批结果">
            <el-radio-group v-model="approveInfo.approvalStatus">
              <el-radio :label="1">
                {{ translateTitle('审批通过') }}
              </el-radio>
              <el-radio :label="2">
                {{ translateTitle('暂不审批') }}
              </el-radio>
              <el-radio :label="3">
                {{ translateTitle('驳回') }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="故障分类">
            <el-cascader
              v-model="approveInfo.faultId"
              :props="customProps"
              placeholder="请选择故障分类"
              :options="faultOptions"
            />
          </el-form-item>
          <el-form-item prop="presetTime" :label="translateTitle('预计执行时间')" style="width: 305px">
            <el-date-picker
              v-model="approveInfo.presetTime"
              :picker-options="expireTimeOption"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              @input="$forceUpdate()"
            />
          </el-form-item>
          <el-form-item label="审批意见">
            <el-input
              v-model="approveInfo.remark"
              rows="3"
              type="textarea"
              :placeholder="translateTitle('审批意见')"
            />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer form-btns">
          <el-button class="cancelBtn" @click="handleCloseApproveDialog">
            {{ translateTitle('取消') }}
          </el-button>
          <el-button class="conBtn" type="primary" @click="confirmApprove">
            {{ translateTitle('确定') }}
          </el-button>
        </span>
      </el-dialog>

      <!-- 工单评价 -->
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="evaluateDialog"
        :show-close="false"
        :title="translateTitle('评价')"
        :modal="false"
        :before-close="handleCloseEvaluateDialog"
      >
        <el-form label-width="100px" :disabled="evaluateData.disabled">
          <el-form-item :label="translateTitle('完成情况')" class="evaluate">
            <el-rate v-model="evaluateData.appraiseGrade" />
          </el-form-item>
          <el-form-item :label="translateTitle('完成评价')">
            <el-input
              v-model="evaluateData.appraiseRemark"
              type="textarea"
            />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer form-btns">
          <el-button
            v-if="evaluateData.disabled"
            class="cancelBtn"
            @click="handleCloseEvaluateDialog"
          >
            <span>
              {{
                evaluateData.disabled
                  ? translateTitle('关闭')
                  : translateTitle('取消')
              }}
            </span>
          </el-button>
          <el-button
            v-show="!evaluateData.disabled"
            type="primary"
            class="conBtn"
            @click="confirmEvaluate"
          >
            {{ translateTitle('确定') }}
          </el-button>
        </span>
      </el-dialog>

      <!-- 工单验收 -->
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="acceptanceDialog"
        :title="translateTitle('工单验收')"
        :modal="false"
      >
        <div style="font-size: 16px">
          {{ translateTitle('确定要完成验收吗') }}?
        </div>
        <span slot="footer" class="dialog-footer form-btns">
          <el-button
            class="cancelBtn"
            style="width: 100px"
            @click="acceptanceFail"
          >
            {{ translateTitle('否,重做任务') }}
          </el-button>
          <el-button class="conBtn" type="primary" @click="acceptanceDone">
            {{ translateTitle('确定') }}
          </el-button>
        </span>
      </el-dialog>
      <template slot="drawer">
        <el-form class="si-title-body">
          <el-form-item label="工单名称">
            <el-input v-model.trim="searchWorkOrderData.workorderName" />
          </el-form-item>
          <el-form-item label="工单号">
            <el-input v-model.trim="searchWorkOrderData.workorderNo" />
          </el-form-item>
          <el-form-item :label="translateTitle('工单类型')">
            <el-select
              v-model="searchWorkOrderData.workorderType"
              placeholder=""
              clearable
            >
              <el-option
                v-for="list in workTypes"
                :key="list.code"
                :value="list.code"
                :label="list.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="translateTitle('工单状态')">
            <el-select
              v-model="searchWorkOrderData.workorderStatus"
              placeholder=""
              clearable
            >
              <el-option
                v-for="list in selectEnums"
                :key="list.code"
                :value="list.code"
                :label="list.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="translateTitle('是否超时')">
            <el-select
              v-model="searchWorkOrderData.overtimeType"
              placeholder=""
              clearable
            >
              <el-option value="no" :label="translateTitle('未超时')" />
              <el-option value="is" :label="translateTitle('已超时')" />
            </el-select>
          </el-form-item>
          <el-form-item :label="translateTitle('所属区域')">
            <!--<el-select v-model="searchWorkOrderData.factoryDistrictId" placeholder="" clearable>
              <el-option
                v-for="list in factoryList"
                :key="list.id"
                :value="list.id"
                :label="list.name"
              ></el-option>
            </el-select>-->
            <el-cascader
              v-model="searchWorkOrderData.departId"
              placeholder=""
              clearable
              style="width: 100%"
              :props="propData"
              :show-all-levels="true"
              :options="areaList"
            />
          </el-form-item>
          <el-form-item :label="translateTitle('提交时间')">
            <el-date-picker
              v-model="searchWorkOrderData.startCreatedTime"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              @change="changeStartTime"
            />
          </el-form-item>
          <el-form-item :label="translateTitle('~')">
            <el-date-picker
              v-model="searchWorkOrderData.endCreatedTime"
              type="date"
              :picker-options="expireTimeOptionEnd"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-button class="bt-search_btn" type="primary" @click="doWorkOrderSearch">查询</el-button>
          <el-button class="common-search__reset" type="default" @click="doRest">重置</el-button>
        </el-form>
      </template>
      <!--      <zDrawer-->
      <!--        :visible="dialog"-->
      <!--        @closeDrawer="closeDrawer"-->
      <!--        @doSearch="doWorkOrderSearch"-->
      <!--        @doRest="doRest"-->
      <!--      >-->
      <!--      </zDrawer>-->
    </bt-page>
  </el-main>
</template>

<script>
import { hasPermission } from '@/utils/hasPermission'
import { translateTitle } from '../../i18n'
import { mapActions, mapGetters } from 'vuex'
import { getSelectEnums } from '../../api/index'
import {
  appraiseWorkOrder,
  approveWorkOrder,
  checkWorkOrder,
  deleteWorkOrderById,
  getPartsRecordByWorkOrderId,
  getWorkOrderCurTrace,
  getWorkorderList,
  getWorkOrderRecord,
} from '../../api/workOrder'
import workOrder2 from '../../api/workOrder2'
import zTable from '../../components/zTable'
import Trace from '../../components/trace/trace'
import { listAreaTree } from "@/module/inspect/api/basicSetting/area";
import FaultClass from "@/module/inspect/api/faultClass"


export default {
  components: {
    zTable,
    Trace
  },
  props: {
    orderDetail: {
      type: Object,
      default: null,
    },
  },
  data () {
    return {
      faultOptions: [],
      customProps: {
        label: 'label',
        value: 'id',
        children: 'children',
        emitPath: false,
        checkStrictly: true
      },
      // ⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆ NEW //
      code: 'em:workorder',
      level3List: [],
      taskId: '',
      isShow: false,
      isShowMap: false,
      currentChoose: '',
      choosed: [],
      //状态，故障，原因
      priorityIndex: -1,
      troubleIndex: -1,
      troubleCauseIndex: -1,
      dialog: false,
      approveDialog: false,
      checkDialog: false,
      //验收
      acceptanceDialog: false,
      //评价
      evaluateDialog: false,
      tipIndex: 1,
      addFlag: false,
      editFlag: false,
      onlyRead: false,
      workOrderCols: [
        { slot: 'workorderType', label: '工单类型' },
        { slot: 'workorderStatus', label: '工单状态' },
        { prop: 'workorderNo', label: '工单号', width: '150' },
        {
          prop: 'workorderName',
          label: '工单名称',
          width: '200',
          showOverflowTooltip: true,
        },
        { prop: 'createdTime', label: '提交时间', width: '150' },
        { prop: 'createdName', label: '提交人', width: '100' },
        {
          prop: 'actionUserName',
          label: '执行人',
          width: '100',
          showOverflowTooltip: true,
        },
        { prop: 'presetTime', label: '预设执行时间', width: '160' },
        { slot: 'isOvertime', label: '是否超时', width: '160' },
        { prop: 'priority', label: '优先级', width: '100' },
        {
          prop: 'equipmentName',
          label: '设备名称',
          showOverflowTooltip: true,
          width: '120',
        },
        {
          prop: 'model',
          label: '型号',
          showOverflowTooltip: true,
          width: '120',
        },
        {
          // prop: 'factoryName',
          // label: '所属厂区',
          prop: 'departName',
          label: '所属区域',
          showOverflowTooltip: true,
          width: '120',
        },
        {
          slot: 'curTrace',
          label: '移动轨迹',
        },
      ],
      //操作记录
      operationCols: [
        { prop: 'flowTime', label: '操作时间' },
        { prop: 'flowUser', label: '用户' },
        { prop: 'remark', label: '操作' },
      ],
      //更换备件
      partsRecordCols: [
        // { prop: 'businessNo', label: '出库单号' },
        { prop: 'deviceNo', label: '备件编号' },
        { prop: 'deviceName', label: '备件名称' },
        { prop: 'deviceModel', label: '备件型号' },
        { prop: 'deviceSpec', label: '备件规格' },
        { prop: 'deviceNum', label: '备件消耗数量' },
        // { prop: 'depositoryName', label: '仓库' },
        // { prop: 'outType', label: '备件状态' },
      ],
      tableData: [],
      workOrderOpList: [
        { value: '查看评价', disabled: false },
        { value: '查看', disabled: false },
        { value: '编辑', disabled: false },
        { value: '删除', disabled: false },
      ],
      pageConfig: {
        total: 0,
        eachPageSize: 10,
        currentPage: 1,
      },
      propData: {
        label: 'areaName',
        value: 'id',
        children: 'children',
        emitPath: false,
        checkStrictly: true,
      },
      //搜索工单信息
      searchWorkOrderData: {
        workorderName: '',
        workorderNo: '',
        workorderType: '',
        workorderStatus: '',
        overtimeType: '',
        // factoryDistrictId: '',
        departId: '',
        startCreatedTime: '',
        endCreatedTime: '',
        // prodLineId: '',
        conveyorId: '',
      },
      //人员列表
      person: {
        actionUser: '',
        supervise: [],
        join: [],
        type: '1',
      },
      //设备搜索信息
      searchDeviceData: {
        formCode: '',
        materialName: '',
        materialObjectCode: '',
        factoryId: '',
        workSpaceId: '',
        productionLineId: '',
        coverybeltId: '',
      },
      //当前选中工单信息
      curWorkOrderInfo: null,
      //upload
      imgFileList: [],
      file: null,
      //工单页下拉枚举
      ENUM_KEY: 'WORKORDER_STATUS',
      //下拉枚举
      selectEnums: [],
      workTypes: [
        {
          code: 'preventMaintain',
          value: '保养',
        },
        {
          code: 'abnormal',
          value: '维修',
        },
      ],
      //审批信息
      approveInfo: {
        id: '',
        approvalStatus: '',
        remark: '',
        faultId: ''
      },
      //验收信息
      checkInfo: {
        id: '',
        isPass: true,
      },
      //评价信息
      evaluateData: {
        appraiseGrade: 5,
        id: '',
        appraiseRemark: '',
        disabled: false,
      },
      expireTimeOption: {
        disabledDate (date) {
          return date.getTime() < Date.now() - 24 * 60 * 60 * 1000
        },
      },
      curDeviceRecordData: {
        //操作记录
        operationRecords: [],
        //配件记录
        partsRecords: [],
      },
      expireTimeOptionEnd: {
        disabledDate: (date) => {
          if (this.searchWorkOrderData.startCreatedTime) {
            return (
              date.getTime() <
              new Date(this.searchWorkOrderData.startCreatedTime).getTime()
            )
          }
        },
      },
      // factoryList: [],
      areaList: [],
    }
  },
  computed: {
    ...mapGetters({
      equipmentRepairFlag: 'zcoreBase/equipmentRepairFlag',
      equipmentRepairInfo: 'zcoreBase/equipmentRepairInfo',
      workOrderStatus: 'zcoreBase/workOrderStatus',
    }),
  },
  watch: {
    '$i18n.locale' () {
      this.setRules()
    },
  },
  async created () {
    //设备报修跳转过来的直接创建工单
    if (this.equipmentRepairFlag) {
      this.changeTag(2)
      this.addFlag = true
      this.editFlag = false
      this.onlyRead = false
      this.form.equipmentNo = this.equipmentRepairInfo.equipmentNo
      this.form.equipmentName = this.equipmentRepairInfo.equipmentName
      this.form.model = this.equipmentRepairInfo.model
      this.form.specification = this.equipmentRepairInfo.specification
      this.form.productionLineId = this.equipmentRepairInfo.productionLineId
      this.form.productionLineName = this.equipmentRepairInfo.productionLineName
      this.form.factoryDistrictId = this.equipmentRepairInfo.factoryDistrictId
      this.form.factoryName = this.equipmentRepairInfo.factoryName
      this.form.equipmentId = this.equipmentRepairInfo.id
      this._setRepairFlag(false)
      this._setEqtRepairInfo(null)
    }

    /*getFactoryList().then((res) => {
        if (res.success == 1) {
          this.factoryList = res.data
        }
      })*/

    listAreaTree().then(res => {
      if (res.success) {
        this.areaList = this.getTreeData(res.data)
        console.log("====ZZ:" + this.areaList)
      }
    })

    await getSelectEnums().then((res) => {
      let enumData = res.data
      this.selectEnums = enumData[this.ENUM_KEY]
    })
    if (this.workOrderStatus) {
      this.searchWorkOrderData.workorderStatus = this.workOrderStatus
      this.doWorkOrderSearch()
      this._setWorkOrderStatus('')
      return
    }
    // 解析参数
    //query传参筛选工单
    let qs = this.$route.query
    if (qs.prodLineId) {
      this.searchWorkOrderData.prodLineId = qs.prodLineId
      this.searchWorkOrderData.workorderStatus = '3'
      this.doWorkOrderSearch()
    }
    if (qs.conveyorId) {
      this.searchWorkOrderData.conveyorId = qs.conveyorId
      this.searchWorkOrderData.workorderStatus = '3'
      this.doWorkOrderSearch()
    }
    if (qs.workorderNo) {
      this.searchWorkOrderData.workorderNo = qs.workorderNo
    }
    this.requestData(1, this.pageConfig.eachPageSize)
  },
  mounted () {
    this.fetchingFaultClas()
  },
  methods: {
    hasPermission,
    //查看实时轨迹
    handleCheckRealTrace (row) {
      getWorkOrderCurTrace({ id: row.id }).then((res) => {
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
            this.tipIndex = 4
            this.isShowMap = true
          }
        }
      })
    },
    showWorkOrderTable () {
      this.tipIndex = 1
      this.isShowMap = false
      this.tableLayOut()
    },
    translateTitle,
    ...mapActions({
      _setRepairFlag: 'zcoreBase/_setRepairFlag',
      _setEqtRepairInfo: 'zcoreBase/_setRepairFlag',
      _setWorkOrderStatus: 'zcoreBase/_setWorkOrderStatus',
    }),
    tableLayOut () {
      this.$nextTick(() => {
        this.$refs.topTable.doLayout()
        this.$refs.rTable.doLayout()
        this.$refs.pTable.doLayout()
      })
    },
    cascaderChange (val) {
      this.currentChoose = ''
      this.currentChoose = val.join(' > ')
    },
    expandChange (item) {
      this.currentChoose = ''
      this.currentChoose = item.join(' > ')
    },
    handleChoose () {
      this.isShow = false
    },
    changeTag (index) {
      this.tipIndex = index
      this.tableLayOut()
    },
    tipClose () {
      this.tipIndex = 1
      this.addFlag = false
      this.editFlag = false
      this.onlyRead = false
      this.person = this.$options.data().person
      this.imgFileList = []
      this.tableLayOut()
    },
    //重置
    doReset () {
      this.$refs.form1.resetFields()
      this.person = this.$options.data().person
      this.imgFileList = []
      this.priorityIndex = -1
      this.troubleIndex = -1
      this.troubleCauseIndex = -1
    },
    //新增工单
    addWorkOrderBtn () {
      this.$router.push({ name: 'workOrderAdd' })
    },
    //获取工单列表
    requestData (pageNum, pageSize) {
      getWorkorderList({
        pageNum,
        pageSize,
        ...this.searchWorkOrderData,
      }).then((res) => {
        // console.log(res);
        if (res.success == 1) {
          let { data } = res
          console.log('工单数据', data)
          this.pageConfig.currentPage = data.pageNum
          this.pageConfig.eachPageSize = data.pageSize
          this.pageConfig.total = data.total
          this.tableData = data.result
        }
      })
    },
    //工单分页
    handleCurrentChange (val) {
      this.pageConfig.currentPage = val
      this.requestData(val, this.pageConfig.eachPageSize)
    },
    //upload处理
    handleUpload (data) {
      console.log(data)
      switch (data.type) {
        case 'change':
          this.imgFileList = data.fileList
          break
        case 'del':
          this.imgFileList.splice(data.index, 1)
          this.form.troubleAttachIdList.splice(data.index, 1)
          break
        case 'id':
          this.form.troubleAttachIdList.push(data.id)
          break
      }
    },
    //当前选择的工单
    handleCurWorkOrderChange (val) {
      this.curWorkOrderInfo = val
      if (!this.curWorkOrderInfo) return
      console.log('当前选择的工单--', this.curWorkOrderInfo)
      getWorkOrderRecord({ id: val.id }).then((res) => {
        if (res.success == 1) {
          let { data } = res
          console.log('操作记录数据--', data)
          this.curDeviceRecordData.operationRecords = [...data]
        }
      })
      getPartsRecordByWorkOrderId({ id: val.id }).then((res) => {
        if (res.success == 1) {
          let { data } = res
          console.log('配件操作记录数据--', data)
          this.curDeviceRecordData.partsRecords = [...data]
        }
      })
      // }
    },
    //查看评价
    handleCheckEvaluate (index, row) {
      console.log(row)
      this.evaluateData.appraiseGrade = row.appraiseGrade
      this.evaluateData.appraiseRemark = row.appraiseRemark
      this.evaluateData.disabled = true
      this.evaluateDialog = true
    },
    //工单查看
    handleCheckOrder (index, row) {
      this.$router.push({
        path: 'workOrderAdd',
        query: {
          params: JSON.stringify({
            isEdit: true,
            onlyRead: true,
            data: row,
          }),
        },
      })
    },
    //工单编辑
    handleEditOrder (index, row) {
      this.$router.push({
        path: 'workOrderAdd',
        query: {
          params: JSON.stringify({
            isEdit: true,
            data: row,
          }),
        },
      })
    },
    //工单删除
    handleDeleteOrder (index, row) {
      console.log(row)
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
          deleteWorkOrderById({
            id: row.id,
          }).then((res) => {
            if (res.success == 1) {
              this.showSuccessTip('删除成功')
              this.requestData(1, this.pageConfig.eachPageSize)
            }
          })
        })
        .catch((e) => console.log(e))
    },
    //工单搜索
    doWorkOrderSearch () {
      this.requestData(1, this.pageConfig.eachPageSize)
      this.closeDrawer()
    },
    doRest () {
      ;(this.searchWorkOrderData = {
        workorderName: '',
        workorderNo: '',
        workorderType: '',
        workorderStatus: '',
        overtimeType: '',
        // factoryDistrictId: '',
        departId: '',
        startCreatedTime: '',
        endCreatedTime: '',
        // prodLineId: '',
        conveyorId: '',
      }),
        this.requestData(1, this.pageConfig.eachPageSize)
      this.closeDrawer()
    },
    //审批按钮
    ApprovalBtn (row) {
      console.log(row)
      if (row) this.curWorkOrderInfo = row
      console.log(this.curWorkOrderInfo)
      /*
      if (
        !this.curWorkOrderInfo.actionUserName ||
        !this.curWorkOrderInfo.priority
      ) {
        this.showErrorTip('工单必填信息有缺失，请完善')
        return
      }
       */

      if (this.curWorkOrderInfo.workorderStatus == '1') {
        this.approveDialog = true
      } else {
        this.showErrorTip('该工单状态无法执行该操作')
      }
    },
    //验收按钮
    acceptanceBtn (row) {
      this.curWorkOrderInfo = row
      if (this.curWorkOrderInfo.workorderStatus == '5') {
        this.checkInfo.id = this.curWorkOrderInfo.id
        this.acceptanceDialog = true
      } else {
        this.showErrorTip('该工单状态无法执行该操作')
      }
    },
    //完成验收
    acceptanceDone () {
      this.checkInfo.isPass = true
      checkWorkOrder(this.checkInfo).then((res) => {
        if (res.success == 1) {
          this.showSuccessTip('验收成功')
          this.tipClose()
          //工单评价打开
          this.acceptanceDialog = false
          this.evaluateDialog = true
        }
      })
    },
    //导出excel
    exportExcel (row) {
      workOrder2.exportExcel(row.id).then((res) => {
        const contentDisposition = res.headers['content-disposition']
        const filename = contentDisposition.split(';')[1].split('=')[1]
        const filenamedecode = decodeURI(filename)
        const blob = new Blob([res.data])
        const url = window.URL.createObjectURL(blob)
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', filenamedecode) //指定下载后的文件名，防跳转
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    },
    //拒绝验收 重做任务
    acceptanceFail () {
      this.checkInfo.isPass = false
      checkWorkOrder(this.checkInfo).then((res) => {
        if (res.success == 1) {
          this.showSuccessTip('任务状态已更新')
          this.tipClose()
          this.acceptanceDialog = false
          this.requestData(1, this.pageConfig.eachPageSize)
        }
      })
    },
    //关闭审批窗口
    handleCloseApproveDialog () {
      this.approveDialog = false
      this.approveInfo = this.$options.data().approveInfo
    },
    //提交审批信息
    confirmApprove () {
      this.approveInfo.id = this.curWorkOrderInfo.id
      approveWorkOrder(this.approveInfo).then((res) => {
        console.log(res)
        if (res.success == 1) {
          this.showSuccessTip('审批成功')
          this.handleCloseApproveDialog()
          this.tipClose()
          this.requestData(1, this.pageConfig.eachPageSize)
        }
      })
    },
    //关闭评价弹窗
    handleCloseEvaluateDialog () {
      this.evaluateDialog = false
      setTimeout(() => {
        this.evaluateData = this.$options.data().evaluateData
      }, 200)
    },
    //确认评价打分
    confirmEvaluate () {
      this.evaluateData.id = this.curWorkOrderInfo.id
      console.log(this.evaluateData)
      appraiseWorkOrder(this.evaluateData).then((res) => {
        console.log(res)
        if (res.success == 1) {
          this.showSuccessTip('评价已完成')
          this.evaluateDialog = false
          this.evaluateData = this.$options.data().evaluateData
          this.requestData(1, this.pageConfig.eachPageSize)
        }
      })
    },
    //tab 更改
    handleTabChange (obj) {
      let index = obj.index
      if (index == '0') {
        this.$refs.rTable.doLayout()
      } else {
        this.$refs.pTable.doLayout()
      }
    },
    getLevel3List () {
      //获取level3 list
      let list = JSON.parse(localStorage.getItem('em_list'))
      list &&
      list.forEach((item) => {
        item.childrenList.forEach((el) => {
          if (el.code === this.code) this.level3List = el.childrenList
        })
      })
    },
    showOrHidden (code) {
      //code: "sys:user:list"
      let result = false
      for (let i = 0; i < this.level3List.length; i++) {
        if (this.level3List[i].code === code) {
          result = true
          return result
        }
      }
    },
    //重置结束时间
    changeStartTime (date) {
      this.searchWorkOrderData.endCreatedTime = ''
    },
    handleDropClick () {
      this.dialog = true
    },
    closeDrawer () {
      this.dialog = false
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
    // ⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇ NEW //
    fetchingFaultClas () {
      FaultClass.getClassTree({}).then(res => {
        console.log('错误分类', res)
        if (res.success) {
          this.faultOptions = res.data
        }
      })
    }
  },
}
</script>

<style scoped lang="scss">
  @import '../../css/base';

  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }

  .evaluate {
    .el-rate {
      line-height: 42px;
    }
  }

  .s-dropdown-onlyicon {
    .s-span {
      border-radius: 3px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      box-sizing: border-box;
      background: #307ec7;
      text-align: center;

      i {
        color: #fff;
      }
    }
  }

  .my-form {
    .my-title {
      margin: 0 0 15px 0;
      font-size: 14px;
    }

    .d-info {
      background: #f9f9f9;
      padding: 24px 24px 20px;

      .inner {
        display: flex;
        justify-content: space-between;
        padding: 0 0 32px;
        border-bottom: 1px dashed #e5e5e5;
        color: #8d9096;
        margin-bottom: 18px;
      }
    }
  }

  .choosed {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e4e7ed;
    padding: 0 0 10px 10px;

    span {
      color: cornflowerblue;
      font-weight: bold;
      margin-left: 30px;
    }
  }

  ::v-deep {
    .el-cascader-node {
      border-radius: 6px;
      margin: 0 10px;

      &.in-active-path {
        background: rgb(222, 242, 255);
      }
    }
  }

  .s-form-item {
    ::v-deep(.el-form-item__content) {
      display: flex;

      span {
        white-space: nowrap;
        margin-right: 5px;
        font-size: 12px;
      }
    }
  }

  .bg-form-item {
    ::v-deep(.el-form-item__content) {
      display: flex;
      font-size: 12px;
      line-height: 22px;

      .bg-title {
        white-space: nowrap;
        margin-right: 16px;
        background: #307ec7;
        color: #fff;
        padding: 0 6px;
        position: relative;

        &:after {
          content: '';
          position: absolute;
          width: 0;
          border-width: 6px 0 0 4px;
          border-style: solid;
          border-color: #307ec7 transparent transparent transparent;
          right: -1px;
          bottom: -6px;
        }
      }

      .bg-item {
        cursor: pointer;
        margin-right: 24px;
        white-space: nowrap;

        &:last-child {
          margin-right: 0;
        }

        &.active {
          color: #307ec7;
        }
      }
    }
  }

  .bg-line {
    padding: 0 24px 20px;

    p {
      height: 1px;
      width: 100%;
      background: #e5e5e5;
    }
  }

  .gs {
    display: flex;
    align-items: center;
    margin: 30px 0 0;
  }

  .filterBar {
    display: flex;
    flex-direction: column;
    padding: 10px 20px;
    background: #f9f9f9;
    margin: 20px 0;

    .item {
      ::v-deep(.el-form-item__content) {
        display: flex;
        flex-direction: columns;
        align-items: center;
        min-height: 40px;

        .t-span {
          margin-right: 15px;
          font-size: 12px;
        }
      }
    }

    .is-error {
      .el-button {
        border: 1px solid #ff4d4f;
      }
    }
  }

  .special-valid {
    .bg-title {
      border: 1px solid $blueColor;
    }

    .is-error {
      .bg-title,
      .el-button {
        border: 1px solid #ff4d4f;
      }
    }
  }
</style>
