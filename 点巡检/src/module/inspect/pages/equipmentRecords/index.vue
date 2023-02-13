<template>
  <el-main class="si">
    <bt-page :title="$route.meta.title" icon-bg-color="#FF866A" :show-drawer="true">
      <!--      <zPageTitle-->
      <!--        :title="translateTitle('设备记录')"-->
      <!--        @handleIconClick="openDrawer"-->
      <!--      />-->

      <div v-show="tipIndex == 1" class="s-box">
        <!-- 上表格 -->
        <el-row>
          <el-tabs>
            <el-tab-pane label="设备列表">
              <zTable
                ref="deviceTable"
                :table-data="tableData"
                :cols="deviceCols"
                :height="300"
                :total="total"
                :show-index="true"
                :each-page-size="eachPageSize"
                :current-page="currentPage"
                :show-row-highlight="true"
                @pageChange="handleCurrentChange"
                @rowChange="handleCurLineChange"
              >
                <!--<template #usageState="scope">-->
                <!--{{ scope.row.usageState == '0' ? '库外' : '' }}-->
                <!--{{ scope.row.usageState == '1' ? '库中' : '' }}-->
                <!--{{ scope.row.usageState == '2' ? '线上' : '' }}-->
                <!--{{ scope.row.usageState == '3' ? '作废' : '' }}-->
                <!--{{ scope.row.usageState == '4' ? '未入库' : '' }}-->
                <!--{{ scope.row.usageState == '5' ? '在途' : '' }}-->
                <!--{{ scope.row.usageState == '6' ? '退回供应商' : '' }}-->
                <!--</template>-->
                <!--<template #equipmentStatus="scope">-->
                <!--{{ scope.row.equipmentStatus == '1' ? '已绑定' : '' }}-->
                <!--{{ scope.row.equipmentStatus == '2' ? '未绑定' : '' }}-->
                <!--</template>-->
              </zTable>
            </el-tab-pane>
          </el-tabs>
        </el-row>
        <!-- 下表格 -->
        <el-row>
          <el-tabs @tab-click="handleTabChange">
            <el-tab-pane :label="translateTitle('巡检记录')">
              <zTable
                ref="roundTable"
                :table-data="checkDatas.roundData.tableData"
                :cols="roundCols"
                :height="200"
                :total="checkDatas.roundData.total"
                :each-page-size="checkDatas.roundData.eachPageSize"
                :current-page="checkDatas.roundData.currentPage"
                :show-handle="true"
                :handle-width="80"
                @pageChange="handleCurrentRoundChange"
              >
                <template #actionUserNameList="scope">
                  {{
                    scope.row.actionUserNameList &&
                      scope.row.actionUserNameList.join(',')
                  }}
                </template>
                <template #isTimeout="scope">
                  {{ scope.row.isTimeout ? '是' : '否' }}
                </template>
                <template #handle="slotData">
                  <el-button
                    type="text"
                    size="small"
                    @click="
                      handleCheckPollingRecord(slotData.$index, slotData.row)
                    "
                  >
                    查看
                  </el-button>
                </template>
              </zTable>
            </el-tab-pane>
            <el-tab-pane :label="translateTitle('点检记录')">
              <zTable
                ref="spotTable"
                :cols="spotCols"
                :height="200"
                :table-data="checkDatas.spotData.tableData"
                :total="checkDatas.spotData.total"
                :each-page-size="checkDatas.spotData.eachPageSize"
                :current-page="checkDatas.spotData.currentPage"
                :show-handle="true"
                :handle-width="80"
                @pageChange="handleCurrentSpotChange"
              >
                <template #actionUserNameList="scope">
                  {{
                    scope.row.actionUserNameList &&
                      scope.row.actionUserNameList.join(',')
                  }}
                </template>
                <template #isTimeout="scope">
                  {{ scope.row.isTimeout ? '是' : '否' }}
                </template>
                <template #handle="slotData">
                  <el-button
                    type="text"
                    size="small"
                    @click="
                      handleCheckPollingRecord(slotData.$index, slotData.row)
                    "
                  >
                    查看
                  </el-button>
                </template>
              </zTable>
            </el-tab-pane>
            <el-tab-pane :label="translateTitle('故障报修记录')">
              <zTable
                ref="faultTable"
                :cols="faultCols"
                :height="200"
                :table-data="faultWorkOrder.tableData"
                :total="faultWorkOrder.total"
                :each-page-size="faultWorkOrder.eachPageSize"
                :current-page="faultWorkOrder.currentPage"
                :show-handle="true"
                :handle-width="80"
                @pageChange="handleCurrentFaultChange"
              >
                <template #workorderStatus="scope">
                  {{ scope.row.workorderStatus == '1' ? '待审批' : '' }}
                  {{ scope.row.workorderStatus == '2' ? '已驳回' : '' }}
                  {{ scope.row.workorderStatus == '3' ? '待维修' : '' }}
                  {{ scope.row.workorderStatus == '4' ? '维修中' : '' }}
                  {{ scope.row.workorderStatus == '5' ? '待验收' : '' }}
                  {{ scope.row.workorderStatus == '6' ? '已完成' : '' }}
                </template>
                <template #handle="slotData">
                  <el-button
                    type="text"
                    size="small"
                    @click="handleCheckRecord(slotData.$index, slotData.row)"
                  >
                    查看
                  </el-button>
                </template>
              </zTable>
            </el-tab-pane>
            <el-tab-pane :label="translateTitle('备件更换记录')">
              <zTable
                ref="partsTable"
                :cols="partsCols"
                :height="200"
                :table-data="checkDatas.partsData.tableData"
                :total="checkDatas.partsData.total"
                :each-page-size="checkDatas.partsData.eachPageSize"
                :current-page="checkDatas.partsData.currentPage"
                @pageChange="handleCurrentPartsChange"
              />
            </el-tab-pane>
          </el-tabs>
        </el-row>
      </div>
      <div v-show="tipIndex == 2">
        <recordDetail :cur-task-detail="curTaskDetail" @goBack="goBack" />
      </div>
      <div v-show="tipIndex == 3" class="more-info-form">
        <div class="top-title">
          <h6>{{ translateTitle('查看工单') }}</h6>
        </div>
        <el-form ref="form" :model="form" :disabled="true" class="my-form">
          <h6 class="my-title">
            <remix-icon
              icon-class="chat-settings-fill"
              style="color: orange"
            />
            {{ translateTitle('设备信息') }}
          </h6>
          <div class="d-info">
            <ul class="inner">
              <li>
                {{ translateTitle('设备编码') }}:
                {{ form.equipmentNo ? form.equipmentNo : '--' }}
              </li>
              <li>
                {{ translateTitle('设备名称') }}:
                {{ form.equipmentName ? form.equipmentName : '--' }}
              </li>
              <li>
                {{ translateTitle('设备型号') }}:
                {{ form.model ? form.model : '--' }}
              </li>
              <li>
                {{ translateTitle('设备规格') }}:
                {{ form.specification ? form.specification : '--' }}
              </li>
              <li>
                {{ translateTitle('所属厂区') }}:
                {{ form.factoryName ? form.factoryName : '--' }}
              </li>
              <li>
                {{ translateTitle('所属作业区') }}:
                {{ form.workSpaceName ? form.workSpaceName : '--' }}
              </li>
              <li>
                {{ translateTitle('所属输送线') }}:
                {{ form.productionLineName ? form.productionLineName : '--' }}
              </li>
            </ul>
          </div>
          <h6 class="my-title" style="padding-left: 22px; margin-top: 34px">
            {{ translateTitle('故障信息') }}
          </h6>
          <el-row type="flex" justify="space-between">
            <el-col :span="8">
              <el-form-item prop="workorderName" class="s-form-item">
                <span>{{ translateTitle('工单名称') }}:</span>
                <el-input v-model="form.workorderName" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="presetTime" class="s-form-item">
                <span>{{ translateTitle('预计执行时间') }}:</span>
                <el-date-picker
                  v-model="form.presetTime"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item class="s-form-item">
                <span>{{ translateTitle('轨迹范围') }}:</span>
                <el-button type="primary">
                  {{ translateTitle('请选择') }}
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :xs="24" :sm="6" class="special-valid">
              <el-form-item prop="priority" class="bg-form-item">
                <span class="bg-title">{{ translateTitle('状态优先级') }}</span>
                <span
                  v-for="item in baseInfoData.status_priority"
                  :key="item"
                  :class="{
                    'bg-item': true,
                    active: form.priority == item,
                  }"
                >
                  {{ item }}
                </span>
                <el-input
                  v-model="form.priority"
                  style="display: none"
                  type="text"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="6" class="special-valid">
              <el-form-item prop="troubleLevel" class="bg-form-item">
                <span class="bg-title">{{ translateTitle('故障等级') }}</span>
                <span
                  v-for="item in baseInfoData.trouble_level"
                  :key="item"
                  :class="{
                    'bg-item': true,
                    active: form.troubleLevel == item,
                  }"
                >
                  {{ item }}
                </span>
                <el-input
                  v-model="form.troubleLevel"
                  style="display: none"
                  type="text"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" class="special-valid">
              <el-form-item prop="troubleCause" class="bg-form-item">
                <span class="bg-title">{{ translateTitle('故障原因') }}</span>
                <span
                  v-for="item in baseInfoData.trouble_cause"
                  :key="item"
                  :class="{
                    'bg-item': true,
                    active: form.troubleCause == item,
                  }"
                >
                  {{ item }}
                </span>
                <el-input
                  v-model="form.troubleCause"
                  style="display: none"
                  type="text"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <div class="bg-line"><p /></div>
          <el-row>
            <el-col>
              <el-form-item :label="translateTitle('故障描述')">
                <el-input
                  v-model="form.troubleDesc"
                  rows="3"
                  type="textarea"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item>
                <span style="font-size: 12px">
                  {{ translateTitle('故障附件') }}
                </span>
                <zUpload
                  ref="upload"
                  type="img"
                  :only-read="true"
                  :limit="5"
                  :multiple="true"
                  :file-list="imgFileList"
                  :dir-obj="{ dir: 'workDir', name: 'workorder' }"
                />
                <div class="gs">
                  <span style="font-size: 12px">
                    {{ translateTitle('预计消耗工时') }}：
                  </span>
                  <el-InputNumber
                    v-model="form.expendTime"
                    size="mini"
                    :min="0"
                    style="margin: 0 20px 0 15px"
                  />
                  <el-radio-group v-model="form.expendUnit" size="mini">
                    <el-radio-button
                      v-for="(list, index) in timeList"
                      :key="index"
                      :label="list.value"
                    >
                      {{ translateTitle(list.name) }}
                    </el-radio-button>
                  </el-radio-group>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col class="filterBar">
              <el-form-item class="item" prop="actionUser">
                <span class="t-span">{{ translateTitle('执行人') }}:</span>
                <div>
                  <template v-if="form.actionUserName">
                    <el-tag
                      effect="plain"
                      type="info"
                      :closable="false"
                      @close="spanClose('actionUser')"
                    >
                      {{ form.actionUserName }}
                    </el-tag>
                  </template>
                  <el-input
                    v-model="form.actionUser"
                    style="display: none"
                    type="text"
                  />
                </div>
              </el-form-item>
              <el-form-item class="item">
                <div>
                  <span class="t-span">{{ translateTitle('监督人') }}:</span>
                  <template v-for="(list, index) in form.watchUserNameList">
                    <el-tag
                      :key="index"
                      effect="plain"
                      type="info"
                      :closable="false"
                    >
                      {{ list }}
                    </el-tag>
                  </template>
                  <el-select
                    v-model="form.watchUserList"
                    style="display: none"
                    multiple
                  >
                    <el-option
                      v-for="(list, index) in form.watchUserList"
                      :key="index"
                      :value="list"
                      :label="list"
                    />
                  </el-select>
                </div>
              </el-form-item>
              <el-form-item class="item">
                <div>
                  <span class="t-span">{{ translateTitle('参与人') }}:</span>
                  <template v-for="(list, index) in form.joinUserNameList">
                    <el-tag
                      :key="index"
                      effect="plain"
                      type="info"
                      :closable="false"
                    >
                      {{ list }}
                    </el-tag>
                  </template>
                  <el-select
                    v-model="form.joinUserList"
                    style="display: none"
                    multiple
                  >
                    <el-option
                      v-for="(list, index) in form.joinUserList"
                      :key="index"
                      :value="list"
                      :label="list"
                    />
                  </el-select>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="btn-align-center form-btns">
          <el-button class="cancelBtn" @click="goBack">
            {{ translateTitle('取消') }}
          </el-button>
        </div>
      </div>

      <!-- 筛选条件 -->
      <template slot="drawer">
        <el-form class="si-title-body">
          <el-form-item :label="translateTitle('设备名称、编码')">
            <el-input v-model="searchDeviceForm.equipmentNameOrCode" />
          </el-form-item>
          <el-form-item :label="translateTitle('区域')">
            <el-cascader
              v-model="searchDeviceForm.areaId"
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
              v-model="searchDeviceForm.mainEquipmentId"
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
          <el-form-item :label="translateTitle('输送带/部件分类')">
            <el-cascader
              v-model="searchDeviceForm.equipmentKindId"
              placeholder=""
              clearable
              style="width: 100%"
              :props="kindPropData"
              :show-all-levels="true"
              :options="kindList"
            />
          </el-form-item>
          <!--<el-form-item :label="translateTitle('设备状态')">-->
          <!--<el-select v-model="searchForm.equipmentStatus" filterable clearable>-->
          <!--<el-option label="已绑定" :value="1"></el-option>-->
          <!--<el-option label="未绑定" :value="2"></el-option>-->
          <!--</el-select>-->
          <!--</el-form-item>-->
          <!--<el-form-item :label="translateTitle('厂区筛选')">
            <el-select
              v-model="searchForm.factoryId"
              placeholder=""
              filterable
              clearable
              @change="changeGetWorkSpacePageList"
            >
              <el-option
                v-for="list in factoryList"
                :key="list.id"
                :value="list.id"
                :label="list.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="translateTitle('作业区筛选')">
            <el-select
              v-model="searchForm.workSpaceId"
              placeholder=""
              filterable
              clearable
              @change="changeGetProductionLinePageList"
            >
              <el-option
                v-for="list in workSpaceList"
                :key="list.id"
                :value="list.id"
                :label="list.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="translateTitle('输送线筛选')">
            <el-select
              v-model="searchForm.productionLineId"
              placeholder=""
              filterable
              clearable
              @change="changeGetBeltPageList"
            >
              <el-option
                v-for="list in productLineList"
                :key="list.id"
                :value="list.id"
                :label="list.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="translateTitle('输送带筛选')">
            <el-select v-model="searchForm.coverybeltId" placeholder="" filterable clearable>
              <el-option
                v-for="list in beltList"
                :key="list.id"
                :value="list.id"
                :label="list.coveryBeltName"
              ></el-option>
            </el-select>
          </el-form-item>-->
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
import { translateTitle } from '../../i18n'
import { getBaseInfoOptionList } from '../../api/baseData'
import { getDeviceChangePartsRecord, } from '../../api/equipmentRecords'
import { getPollingDetailById, getPollingTaskList, } from '../../api/pollingRecord'
import { listEquip, listMainEquip } from '../../api/basicSetting/equipPos'
import { listEquipTypeTree } from '../../api/basicSetting/equipType'
import { listAreaTree } from '../../api/basicSetting/area'
import { getWorkOrderById, getWorkorderList } from '../../api/workOrder'
import zTable from '../../components/zTable'
import recordDetail from '../../components/recordDetail/recordDetail'
import zUpload from '../../components/zUpload'
import BtPage from '@/components/BtPage/bt-page';

export default {
  components: { BtPage, zTable, recordDetail, zUpload },
  data () {
    return {
      dialog: false,
      tipIndex: 1,
      //设备列表
      deviceCols: [
        // {
        //   prop: 'coveryBeltName',
        //   label: '所属输送带',
        //   width: 120,
        //   showOverflowTooltip: true,
        // },
        // {
        //   prop: 'formCode',
        //   label: '组成编码',
        //   width: 120,
        //   showOverflowTooltip: true,
        // },
        // {
        //   prop: 'longitude',
        //   label: '经度',
        //   showOverflowTooltip: true,
        // },
        // {
        //   prop: 'latitude',
        //   label: '纬度',
        //   showOverflowTooltip: true,
        // },
        // {
        //   prop: 'materialObjectCode',
        //   label: '设备编码',
        //   width: 240,
        //   showOverflowTooltip: true,
        // },
        // {
        //   prop: 'materialName',
        //   label: '设备名称',
        //   width: 120,
        //   showOverflowTooltip: true,
        // },
        // {
        //   prop: 'materialModel',
        //   label: '型号',
        //   showOverflowTooltip: true,
        // },
        // {
        //   prop: 'materialSpec',
        //   label: '规格',
        //   showOverflowTooltip: true,
        // },
        // {
        //   prop: 'materialUnit',
        //   label: '单位名称',
        //   showOverflowTooltip: true,
        // },
        // {
        //   slot: 'equipmentStatus',
        //   label: '设备状态',
        //   showOverflowTooltip: true,
        // },
        // {
        //   prop: 'modelCode',
        //   label: '物料模型编码',
        //   width: 110,
        //   showOverflowTooltip: true,
        // },
        // {
        //   prop: 'modelName',
        //   label: '物料模型名称',
        //   width: 110,
        //   showOverflowTooltip: true,
        // },
        // {
        //   prop: 'materialMaterialName',
        //   label: '物料名称',
        //   width: 120,
        //   showOverflowTooltip: true,
        // },
        // { prop: 'equipmentTypeName', label: '设备分类' },
        /*  { prop: 'factoryName', label: '所属厂区' },
          { prop: 'location', label: '设备位置' }, */
        // { slot: 'usageState', label: '状态', showOverflowTooltip: true },
        {
          prop: 'equipmentCode',
          label: '设备编码',
          width: 120,
          showOverflowTooltip: true,
        },
        {
          prop: 'equipmentName',
          label: '设备名称',
          width: 120,
          showOverflowTooltip: true,
        },
        {
          prop: 'areaName',
          label: '所属区域',
          width: 120,
          showOverflowTooltip: true,
        },
        {
          prop: 'mainEquipmentName',
          label: '所属输送机',
          width: 120,
          showOverflowTooltip: true,
        },
        {
          prop: 'mainEquipmentCode',
          label: '输送机编码',
          width: 120,
          showOverflowTooltip: true,
        },
        {
          prop: 'equipmentType',
          label: '设备类型',
          width: 120,
          showOverflowTooltip: true,
        },
        {
          prop: 'equipmentModel',
          label: '型号',
          showOverflowTooltip: true,
        },
        {
          prop: 'equipmentSpecifications',
          label: '规格',
          showOverflowTooltip: true,
        },
      ],
      //巡检
      roundCols: [
        /*
        {
          slot: 'actionUserNameList',
          label: '执行人',
          showOverflowTooltip: true,
          width: '140',
        },
        {
          prop: 'taskName',
          label: '计划名称',
          width: '200',
          showOverflowTooltip: true,
        },
         */
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
        {
          prop: 'taskStatusStr',
          label: '执行状态',
          width: '90',
          showOverflowTooltip: true,
        },
        { prop: 'equipmentAbnormalNum', label: '异常设备数', width: '90' },
        { prop: 'equipmentSkipNum', label: '跳过设备数', width: '90' },
        { slot: 'isTimeout', label: '是否超时' },
        // { slot: 'isTimeout', label: '是否超时', width: '90' },
        // { prop: 'startTime', label: '实际开始时间', width: '160' },
        // { prop: 'endTime', label: '实际结束时间' },
      ],
      //点检
      spotCols: [
        /*
        {
          slot: 'actionUserNameList',
          label: '执行人',
          showOverflowTooltip: true,
          width: '140',
        },
        {
          prop: 'taskName',
          label: '计划名称',
          width: 200,
          showOverflowTooltip: true,
        },
        { prop: 'startTime', label: '实际开始时间', width: '160' },
        { prop: 'endTime', label: '实际结束时间', width: '160' },
        { prop: 'equipmentAbnormalNum', label: '异常设备数' },
        { prop: 'equipmentSkipNum', label: '跳过设备数' },
        { slot: 'isTimeout', label: '是否超时' },

         */
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
        {
          prop: 'taskStatusStr',
          label: '执行状态',
          width: '90',
          showOverflowTooltip: true,
        },
        { prop: 'equipmentAbnormalNum', label: '异常设备数', width: '90' },
        { prop: 'equipmentSkipNum', label: '跳过设备数', width: '90' },
        { slot: 'isTimeout', label: '是否超时' },
        // { slot: 'isTimeout', label: '是否超时', width: '90' },
        // { prop: 'startTime', label: '实际开始时间', width: '160' },
        // { prop: 'endTime', label: '实际结束时间' },
      ],
      //故障
      faultCols: [
        { prop: 'workorderNo', label: '工单号' },
        {
          prop: 'workorderName',
          label: '工单名称',
          width: 200,
          showOverflowTooltip: true,
        },
        { prop: 'createdTime', label: '提交时间', width: 160 },
        {
          prop: 'createdName',
          label: '提交人',
          width: 120,
          showOverflowTooltip: true,
        },
        {
          prop: 'actionUserName',
          label: '执行人',
          width: 120,
          showOverflowTooltip: true,
        },
        { prop: 'priority', label: '紧急程度' },
        { slot: 'workorderStatus', label: '工单状态' },
      ],
      //备件
      partsCols: [
        {
          prop: 'deviceNo',
          label: '设备编码',
          width: 220,
          showOverflowTooltip: true,
        },
        {
          prop: 'deviceName',
          label: '设备名称',
          width: 220,
          showOverflowTooltip: true,
        },
        {
          prop: 'deviceModel',
          label: '备件型号',
          width: 220,
          showOverflowTooltip: true,
        },
        {
          prop: 'deviceSpec',
          label: '备件规格',
          showOverflowTooltip: true,
        },
        {
          prop: 'deviceNum',
          label: '备件消耗数量',
          showOverflowTooltip: true,
        },
        // { prop: 'deviceStatusStr', label: '备件状态' },
      ],
      //当前任务详情
      curTaskDetail: {},
      tableData: [],
      total: 0,
      eachPageSize: 10,
      currentPage: 1,
      //底部tab栏下标
      tabIndex: '0',
      //查看点巡检数据
      checkDatas: {
        //巡检
        roundData: {
          tableData: [],
          total: 0,
          eachPageSize: 10,
          currentPage: 1,
        },
        //点检
        spotData: {
          tableData: [],
          total: 0,
          eachPageSize: 10,
          currentPage: 1,
        },
        //备件
        partsData: {
          tableData: [],
          total: 0,
          eachPageSize: 10,
          currentPage: 1,
        },
      },
      //二级表格,
      curDeviceInfo: null,
      //故障报修工单信息
      faultWorkOrder: {
        tableData: [],
        total: 0,
        eachPageSize: 10,
        currentPage: 1,
        workOrderDetail: null,
      },
      //查看工单
      form: {},
      searchForm: {
        isAll: true,
        formCode: '',
        materialName: '',
        materialObjectCode: '',
        factoryId: '',
        workSpaceId: '',
        productionLineId: '',
        coverybeltId: '',
        adaptId: '',
      },
      searchDeviceForm: {
        equipmentNameOrCode: '',
        equipmentKindId: '',
        areaId: '',
        mainEquipmentId: '',
      },
      //基础配置信息
      baseInfoData: {
        baseInfoList: [],
        //状态优先级
        status_priority: [],
        //故障等级
        trouble_level: [],
        //故障原因
        trouble_cause: [],
      },
      imgFileList: [],
      timeList: [
        {
          name: '分钟',
          value: '分',
        },
        {
          name: '小时',
          value: '时',
        },
        {
          name: '天',
          value: '天',
        },
      ],
      // factoryList: [],
      // workSpaceList: [],
      // productLineList: [],
      // beltList: [],
      conveyorList: [],
      systemCode: 'onlineMonitor',
      isHaveQuery: false,
      propData: {
        label: 'areaName',
        value: 'id',
        children: 'children',
        emitPath: false,
        checkStrictly: true,
      },
      kindPropData: {
        label: 'kindName',
        value: 'id',
        children: 'children',
        emitPath: false,
        checkStrictly: true,
      },
      //分类列表
      kindList: [],
      //区域列表
      areaList: [],
    }
  },
  async created () {
    let qs = this.$route.query
    if (
      qs.factoryId &&
      qs.workSpaceId &&
      qs.productionLineId &&
      qs.coverybeltId
    ) {
      this.isHaveQuery = true
      this.searchForm.factoryId = qs.factoryId
      this.searchForm.workSpaceId = qs.workSpaceId
      this.searchForm.productionLineId = qs.productionLineId
      this.searchForm.coverybeltId = qs.coverybeltId
      this.searchForm.systemCode = this.systemCode
      // this.getWorkSpacePageFn(this.searchForm.factoryId)
      // this.getProductLineListFn(this.searchForm.workSpaceId)
      // this.getBeltListFn(this.searchForm.productionLineId)
    }
    if (qs.adaptId && qs.systemCode) {
      this.isHaveQuery = true
      this.systemCode = qs.systemCode
      this.searchForm.systemCode = this.systemCode
      this.searchForm.adaptId = qs.adaptId
    }

    await this.requestData(1, this.eachPageSize)
    this.getBaseInfoFn()
    /*getFactoryList().then((res) => {
        let { success, data } = res
        if (success) this.factoryList = data
      })*/
    this.getDevicePageFn()

    listEquipTypeTree().then(res => {
      if (res.success) {
        this.kindList = this.getTreeData(res.data)
        console.log("====XX:" + this.kindList)
      }
    })

    listAreaTree().then(res => {
      if (res.success) {
        this.areaList = this.getTreeData(res.data)
        console.log("====ZZ:" + this.areaList)
      }
    })

    /*
    listMainEquip().then(res => {
      if (res.success) {
        this.conveyorList = res.data
        console.log("====YYY:" + this.conveyorList)
      }
    })
    */

  },
  methods: {
    translateTitle,
    async requestData (pageNum, pageSize) {
      // await getAdaptPageList({
      //   pageNum,
      //   pageSize,
      //   ...this.searchForm,
      // }).then((res) => {
      //   let { data } = res
      //   console.log(data)
      //   this.currentPage = data.pageNum
      //   this.eachPageSize = data.pageSize
      //   this.total = data.total
      //   this.tableData = data.result
      // })

      /*
      monitorApi
        .getDevicePage({
          params: {
            current: pageNum,
            size: pageSize,
            ...this.searchDeviceForm,
          },
        })
        .then((res) => {
          let { data } = res
          console.log(data)
          this.currentPage = data.current
          this.eachPageSize = data.size
          this.total = data.total
          this.tableData = data.records
        })

       */

      listEquip({
        pageNum: pageNum,
        pageSize: pageSize,
        ...this.searchDeviceForm,
      }).then(res => {
        if (res.success) {
          this.currentPage = res.data.pageNum
          this.eachPageSize = res.data.pageSize
          this.total = res.data.total
          this.tableData = res.data.result
          console.log("====ZZ:" + this.tableData)
        }
      })


    },
    handleCurrentChange (val) {
      this.requestData(val, this.eachPageSize)
    },
    doSearch () {
      this.requestData(1, this.eachPageSize)
      this.closeDrawer()
    },
    doRest () {
      let query = { isAll: true }
      if (this.isHaveQuery) {
        query = { isAll: true, systemCode: this.systemCode }
      }
      // this.searchForm = Object.assign({}, query)
      this.searchDeviceForm = {}
      this.requestData(1, this.eachPageSize)
      this.closeDrawer()
    },
    openDrawer () {
      this.dialog = true
    },
    closeDrawer () {
      this.dialog = false
    },
    /*changeGetWorkSpacePageList(val) {
        this.workSpaceList = []
        this.productLineList = []
        this.beltList = []
        this.searchForm.workSpaceId = ''
        this.searchForm.productionLineId = ''
        this.searchForm.coverybeltId = ''
        this.getWorkSpacePageFn(val)
      },
      changeGetProductionLinePageList(val) {
        this.productLineList = []
        this.beltList = []
        this.searchForm.productionLineId = ''
        this.searchForm.coverybeltId = ''
        this.getProductLineListFn(val)
      },
      changeGetBeltPageList(val) {
        this.beltList = []
        this.searchForm.coverybeltId = ''
        this.getBeltListFn(val)
      },*/
    //当前选中设备
    handleCurLineChange (val) {
      console.log('当前选择设备--', val)
      this.curDeviceInfo = val
      if (!this.curDeviceInfo) return
      if (this.tabIndex == '0') {
        console.log('巡检记录')
        this.requestPollingRecordData(
          this.checkDatas.roundData.currentPage,
          this.checkDatas.roundData.eachPageSize,
          '1',
          this.curDeviceInfo.id
        )
        this.$refs.roundTable.doLayout()
      } else if (this.tabIndex == '1') {
        console.log('点检记录')
        this.requestPollingRecordData(
          this.checkDatas.roundData.currentPage,
          this.checkDatas.roundData.eachPageSize,
          '2',
          this.curDeviceInfo.id
        )
        this.$refs.spotTable.doLayout()
      } else if (this.tabIndex == '2') {
        console.log('故障记录')
        this.requestWorkOrderByEqId(
          this.faultWorkOrder.currentPage,
          this.faultWorkOrder.eachPageSize
        )
        this.$refs.faultTable.doLayout()
      } else if (this.tabIndex == '3') {
        console.log('备件记录')
        this.requestDevicePartsById(
          this.checkDatas.partsData.currentPage,
          this.checkDatas.partsData.eachPageSize
        )
        this.$refs.partsTable.doLayout()
      }
    },
    //tab change
    async handleTabChange (tab) {
      let index = tab.index
      this.tabIndex = index
      if (!this.curDeviceInfo) return
      if (index == '0') {
        console.log('巡检记录')
        this.checkDatas.roundData.currentPage = 1
        await this.requestPollingRecordData(
          this.checkDatas.roundData.currentPage,
          this.checkDatas.roundData.eachPageSize,
          '1',
          this.curDeviceInfo.id
        )
        this.$refs.roundTable.doLayout()
      } else if (index == '1') {
        console.log('点检记录')
        this.checkDatas.roundData.currentPage = 1
        await this.requestPollingRecordData(
          this.checkDatas.roundData.currentPage,
          this.checkDatas.roundData.eachPageSize,
          '2',
          this.curDeviceInfo.id
        )
        this.$refs.spotTable.doLayout()
      } else if (index == '2') {
        console.log('故障记录')
        this.faultWorkOrder.currentPage = 1
        await this.requestWorkOrderByEqId(
          this.faultWorkOrder.currentPage,
          this.faultWorkOrder.eachPageSize
        )
        this.$refs.faultTable.doLayout()
      } else if (index == '3') {
        console.log('备件记录')
        this.checkDatas.partsData.currentPage = 1
        await this.requestDevicePartsById(
          this.checkDatas.partsData.currentPage,
          this.checkDatas.partsData.eachPageSize
        )
        this.$refs.partsTable.doLayout()
      }
    },
    //根据设备id获取工单列表
    async requestWorkOrderByEqId (pageNum, pageSize) {
      if (!this.curDeviceInfo) {
        this.$msg({
          message: this.translateTitle('请选择一个设备'),
          type: 'error',
        })
        return
      }
      await getWorkorderList({
        deviceId: this.curDeviceInfo.deviceId,
        pageSize,
        pageNum,
      }).then((res) => {
        console.log('工单数据--', res)
        if (res.success == 1) {
          let { data } = res
          this.faultWorkOrder.tableData = data.result
          this.faultWorkOrder.currentPage = data.pageNum
          this.faultWorkOrder.eachPageSize = data.pageSize
          this.faultWorkOrder.total = data.total
        }
      })
    },
    //根据设备id查询备件
    async requestDevicePartsById (pageNum, pageSize) {
      if (!this.curDeviceInfo) {
        this.$msg({
          message: this.translateTitle('请选择一个设备'),
          type: 'error',
        })
        return
      }
      await getDeviceChangePartsRecord({
        deviceId: this.curDeviceInfo.deviceId,
        pageSize,
        pageNum,
      }).then((res) => {
        if (res.success == 1) {
          let { data } = res
          console.log('备件数据--', data)
          this.checkDatas.partsData.tableData = data.result
          this.checkDatas.partsData.currentPage = data.pageNum
          this.checkDatas.partsData.eachPageSize = data.pageSize
          this.checkDatas.partsData.total = data.total
        }
      })
    },
    //查看工单信息
    handleCheckRecord (index, row) {
      console.log(index, row)
      this.form = {}
      this.faultWorkOrder.workOrderDetail = {}
      getWorkOrderById({ id: row.id }).then((res) => {
        if (res.success == 1) {
          let { data } = res
          this.faultWorkOrder.workOrderDetail = data
          console.log('当前工单--', this.faultWorkOrder.workOrderDetail)
          this.form = Object.assign({}, this.faultWorkOrder.workOrderDetail)

          //图片
          this.imgFileList = []
          data.fileUploadVOList.forEach((item) => {
            let obj = {}
            obj.url = item.fileUrl
            obj.id = item.id
            obj.uploaded = true
            this.imgFileList.push(obj)
          })
          //如果没有时间 默认单位为分
          if (!this.form.expendUnit) {
            this.form.expendUnit = this.timeList[0].value
          }
          this.tipIndex = 3
        }
      })
    },
    //查看点巡检记录
    handleCheckPollingRecord (index, row) {
      console.log(index, row)
      getPollingDetailById({ id: row.id }).then((res) => {
        if (res.success == 1) {
          let { data } = res
          this.curTaskDetail = data
          console.log('当前选中巡检详情--', this.curTaskDetail)
          this.tipIndex = 2
        }
      })
    },
    //获取记录数据
    async requestPollingRecordData (pageNum, pageSize, taskType, deviceId) {
      await getPollingTaskList({
        pageSize,
        pageNum,
        taskType,
        deviceId,
      }).then((res) => {
        let { data } = res
        if (taskType == '1') {
          //巡检
          console.log('巡检记录数据', data)
          this.checkDatas.roundData.currentPage = data.pageNum
          this.checkDatas.roundData.eachPageSize = data.pageSize
          this.checkDatas.roundData.total = data.total
          this.checkDatas.roundData.tableData = data.result
        } else {
          //点检
          console.log('点检记录数据', data)
          this.checkDatas.spotData.currentPage = data.pageNum
          this.checkDatas.spotData.eachPageSize = data.pageSize
          this.checkDatas.spotData.total = data.total
          this.checkDatas.spotData.tableData = data.result
        }
      })
    },
    //巡检分页
    handleCurrentRoundChange (val) {
      this.checkDatas.roundData.currentPage = val
      this.requestPollingRecordData(
        val,
        this.checkDatas.roundData.eachPageSize,
        '1',
        this.curDeviceInfo.deviceId
      )
    },
    //点检分页
    handleCurrentSpotChange (val) {
      this.checkDatas.spotData.currentPage = val
      this.requestPollingRecordData(
        val,
        this.checkDatas.spotData.eachPageSize,
        '2',
        this.curDeviceInfo.deviceId
      )
    },
    //故障报修记录分页
    handleCurrentFaultChange (val) {
      this.faultWorkOrder.currentPage = val
      this.requestWorkOrderByEqId(val, this.faultWorkOrder.eachPageSize)
    },
    //备件更换记录分页
    handleCurrentPartsChange (val) {
      this.checkDatas.partsData.currentPage = val
      this.requestDevicePartsById(val, this.checkDatas.partsData.eachPageSize)
    },
    tableLayOut () {
      this.$nextTick(() => {
        this.$refs.deviceTable.doLayout()
        this.$refs.roundTable.doLayout()
        this.$refs.spotTable.doLayout()
        this.$refs.faultTable.doLayout()
        this.$refs.partsTable.doLayout()
      })
    },
    goBack () {
      this.tipIndex = 1
      this.imgFileList = []
      this.tableLayOut()
    },
    //获取基础配置信息
    getBaseInfoFn () {
      getBaseInfoOptionList().then((res) => {
        let { data } = res
        if (!data) return
        this.baseInfoData.baseInfoList = data
        this.baseInfoData.baseInfoList.forEach((item) => {
          if (item.optionCode == 'trouble_level') {
            this.baseInfoData.trouble_level = item.optionValueList
          }
          if (item.optionCode == 'trouble_cause') {
            this.baseInfoData.trouble_cause = item.optionValueList
          }
          if (item.optionCode == 'status_priority') {
            this.baseInfoData.status_priority = item.optionValueList
          }
        })
        console.log('baseInfoData--', this.baseInfoData)
      })
    },
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
    // 获取作业区
    /*getWorkSpacePageFn(factoryId) {
        getWorkSpacePage({
          pageSize: 99999,
          pageNum: 1,
          factoryId: factoryId,
        }).then((res) => {
          let { success, data } = res
          if (success) this.workSpaceList = data
        })
      },
      // 获取输送线
      getProductLineListFn(workSpaceId) {
        getProductLineList({
          pageSize: 99999,
          pageNum: 1,
          workSpaceId: workSpaceId,
        }).then((res) => {
          let { success, data } = res
          if (success) this.productLineList = data
        })
      },
      // 获取输送带
      getBeltListFn(productionLineId) {
        getBeltList({
          pageSize: 99999,
          pageNum: 1,
          coveryLineId: productionLineId,
        }).then((res) => {
          let { success, data } = res
          if (success) this.beltList = data
        })
      },*/
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

<style lang="scss" scoped>
  @import '../../css/base';

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
</style>
