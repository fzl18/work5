<template>
  <el-main class="si">
    <bt-page :title="title" icon-bg-color="#FF866A">
      <!--      <zPageTitle-->
      <!--        :show-filter="false"-->
      <!--        :title="title"-->
      <!--        @handleIconClick="handleDropClick"-->
      <!--      />-->

      <div v-show="tipIndex == 2" class="more-info-form">
        <div class="top-title">
          <h6>{{ translateTitle('工单信息') }}</h6>
        </div>
        <el-form
          ref="form1"
          :model="form"
          :rules="rules"
          :disabled="onlyRead"
          class="my-form"
        >
          <h6 class="my-title">
            <remix-icon
              icon-class="chat-settings-fill"
              style="color: orange"
            />
            {{ translateTitle('设备信息') }}
          </h6>
          <div class="d-info">
            <ul class="inner">
              <li v-if="isRepairWorkOrder">
                {{ translateTitle('设备编码') }}:
                {{ form.equipmentNo ? form.equipmentNo : '--' }}
              </li>
              <li>
                {{ translateTitle('设备名称') }}:
                {{ form.equipmentName ? form.equipmentName : '--' }}
              </li>
              <li v-if="isRepairWorkOrder">
                {{ translateTitle('设备型号') }}:
                {{ form.model ? form.model : '--' }}
              </li>
              <li v-if="isRepairWorkOrder">
                {{ translateTitle('设备规格') }}:
                {{ form.specification ? form.specification : '--' }}
              </li>
              <!--  <li>
                {{ translateTitle('所属厂区') }}:
                {{ form.factoryName ? form.factoryName : '--' }}
              </li>
              <li>
                {{ translateTitle('所属作业区') }}:
                {{ form.workSpaceName ? form.workSpaceName : '--' }}
              </li> -->
              <li v-if="isRepairWorkOrder">
                {{ translateTitle('所属输送机') }}:
                {{ form.conveyorName ? form.conveyorName : '--' }}
              </li>
            </ul>
            <div v-if="isRepairWorkOrder" class="special-valid">
              <!-- <el-popover
                v-model="isShow"
                placement="bottom-start"
                trigger="click"
              >
                <div class="choosed">
                  <span>{{ currentChoose }}</span>
                  <el-button
                    type="primary"
                    size="mini"
                    :disabled="!choosed.length"
                    @click="handleChoose"
                  >
                    确认
                  </el-button>
                </div>
                <el-cascader-panel
                  ref="cascader-panel"
                  v-model="choosed"
                  :options="options"
                  style="border: none"
                  @change="cascaderChange"
                  @expand-change="expandChange"
                ></el-cascader-panel>
                <el-button slot="reference" type="primary">选择设备</el-button>
              </el-popover> -->
              <el-form-item prop="equipmentNo">
                <el-button type="primary" @click="chooseDevice">
                  {{ translateTitle('选择设备') }}
                </el-button>
                <el-input
                  v-model="form.equipmentNo"
                  style="display: none"
                />
              </el-form-item>
            </div>
          </div>
          <h6 class="my-title" style="padding-left: 22px; margin-top: 34px">
            {{ translateTitle('工单信息') }}
          </h6>
          <el-row type="flex" justify="space-between">
            <el-col :span="8">
              <el-form-item prop="workorderName" class="s-form-item">
                <span>
                  <i style="color: red">*</i>
                  {{ translateTitle('工单名称') }}:
                </span>
                <el-input v-model="form.workorderName" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="presetTime" class="s-form-item">
                <span>{{ translateTitle('预计执行时间') }}:</span>
                <el-date-picker
                  v-model="form.presetTime"
                  :picker-options="expireTimeOption"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  @input="$forceUpdate()"
                />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item class="s-form-item">
                <span>{{ translateTitle('轨迹范围') }}:</span>
                <el-button type="primary" @click="openMap">
                  {{ translateTitle('请选择') }}
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row v-if="!isRepairWorkOrder" type="flex" justify="space-between">
            <el-col :span="8">
              <el-form-item prop="pmPlanCompleteTime" class="s-form-item">
                <span>{{ translateTitle('工单任务完成时间点') }}:</span>
                <el-date-picker
                  v-model="form.pmPlanCompleteTime"
                  :picker-options="expireTimeOption"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                />
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item prop="additionalRemarks" class="s-form-item">
                <span>{{ translateTitle('补充说明') }}:</span>
                <el-input v-model="form.additionalRemarks" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :xs="24" :sm="8" class="special-valid">
              <el-form-item prop="priority" class="bg-form-item">
                <span class="bg-title">{{ translateTitle('状态优先级') }}</span>
                <span
                  v-for="(item, index) in baseInfoData.status_priority"
                  :key="item"
                  :class="{
                    'bg-item': true,
                    active: index == priorityIndex || form.priority == item,
                  }"
                  @click="getPriority(index, item)"
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
            <el-col
              v-if="isRepairWorkOrder"
              :xs="24"
              :sm="8"
              class="special-valid"
            >
              <el-form-item prop="troubleLevel" class="bg-form-item">
                <span class="bg-title">{{ translateTitle('故障等级') }}</span>
                <span
                  v-for="(item, index) in baseInfoData.trouble_level"
                  :key="item"
                  :class="{
                    'bg-item': true,
                    active: index == troubleIndex || form.troubleLevel == item,
                  }"
                  @click="getTrouble(index, item)"
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
            <el-col
              v-if="isRepairWorkOrder"
              :xs="24"
              :sm="8"
              class="special-valid"
            >
              <el-form-item prop="troubleCause" class="bg-form-item">
                <span class="bg-title">{{ translateTitle('故障原因') }}</span>
                <span
                  v-for="(item, index) in baseInfoData.trouble_cause"
                  :key="item"
                  :class="{
                    'bg-item': true,
                    active:
                      index == troubleCauseIndex || form.troubleCause == item,
                  }"
                  @click="getTroubleCause(index, item)"
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
          <el-row v-if="isRepairWorkOrder">
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
          <el-row v-if="isRepairWorkOrder">
            <el-col>
              <el-form-item>
                <span style="font-size: 12px">
                  {{ translateTitle('故障附件') }}
                </span>
                <zUpload
                  v-if="isRepairWorkOrder"
                  ref="upload"
                  type="img"
                  :only-read="onlyRead"
                  :limit="5"
                  :multiple="true"
                  :file-list="imgFileList"
                  :dir-obj="{ dir: 'workDir', name: 'workorder' }"
                  @handleUpload="handleUpload"
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
          <el-row v-if="rowData.isEdit">
            <el-col class="filterBar">
              <el-form-item class="item" prop="actionUser">
                <span class="t-span">{{ translateTitle('执行人') }}:</span>
                <div>
                  <template v-if="form.doThingUserNameList && form.doThingUserNameList.length">
                    <el-tag
                      effect="plain"
                      type="info"
                      :closable="!onlyRead"
                      @close="spanClose('actionUser')"
                    >
                      {{ form.doThingUserNameList.join('、') }}
                    </el-tag>
                  </template>
                  <!-- // TODO check -->
                  <!--                  <el-input-->
                  <!--                    v-model="form.actionUser"-->
                  <!--                    style="display: none"-->
                  <!--                    type="text"-->
                  <!--                  />-->
                  <el-button
                    v-if="!onlyRead"
                    size="mini"
                    type="primary"
                    style="margin-left: 20px"
                    @click="openUserDia('1')"
                  >
                    {{ translateTitle('选择人员') }}
                  </el-button>
                </div>
              </el-form-item>
              <!--              <el-form-item class="item">-->
              <!--                <div>-->
              <!--                  <span class="t-span">{{ translateTitle('监督人') }}:</span>-->
              <!--                  <template v-for="(list, index) in form.watchUserNameList">-->
              <!--                    <el-tag-->
              <!--                      :key="index"-->
              <!--                      effect="plain"-->
              <!--                      type="info"-->
              <!--                      :closable="!onlyRead"-->
              <!--                      @close="spanClose('supervise', list)"-->
              <!--                    >-->
              <!--                      {{ list }}-->
              <!--                    </el-tag>-->
              <!--                  </template>-->
              <!--                  <el-select-->
              <!--                    v-model="form.watchUserList"-->
              <!--                    style="display: none"-->
              <!--                    multiple-->
              <!--                  >-->
              <!--                    <el-option-->
              <!--                      v-for="(list, index) in form.watchUserList"-->
              <!--                      :key="index"-->
              <!--                      :value="list"-->
              <!--                      :label="list"-->
              <!--                    />-->
              <!--                  </el-select>-->
              <!--                  <el-button-->
              <!--                    v-if="!onlyRead"-->
              <!--                    size="mini"-->
              <!--                    type="primary"-->
              <!--                    style="margin-left: 20px"-->
              <!--                    @click="openUserDia('2')"-->
              <!--                  >-->
              <!--                    {{ translateTitle('选择人员') }}-->
              <!--                  </el-button>-->
              <!--                </div>-->
              <!--              </el-form-item>-->
              <!--              <el-form-item class="item">-->
              <!--                <div>-->
              <!--                  <span class="t-span">{{ translateTitle('参与人') }}:</span>-->
              <!--                  <template v-for="(list, index) in form.joinUserNameList">-->
              <!--                    <el-tag-->
              <!--                      :key="index"-->
              <!--                      effect="plain"-->
              <!--                      type="info"-->
              <!--                      :closable="!onlyRead"-->
              <!--                      @close="spanClose('join', list)"-->
              <!--                    >-->
              <!--                      {{ list }}-->
              <!--                    </el-tag>-->
              <!--                  </template>-->
              <!--                  <el-select-->
              <!--                    v-model="form.joinUserList"-->
              <!--                    style="display: none"-->
              <!--                    multiple-->
              <!--                  >-->
              <!--                    <el-option-->
              <!--                      v-for="(list, index) in form.joinUserList"-->
              <!--                      :key="index"-->
              <!--                      :value="list"-->
              <!--                      :label="list"-->
              <!--                    />-->
              <!--                  </el-select>-->
              <!--                  <el-button-->
              <!--                    v-if="!onlyRead"-->
              <!--                    size="mini"-->
              <!--                    type="primary"-->
              <!--                    style="margin-left: 20px"-->
              <!--                    @click="openUserDia('3')"-->
              <!--                  >-->
              <!--                    {{ translateTitle('选择人员') }}-->
              <!--                  </el-button>-->
              <!--                </div>-->
              <!--              </el-form-item>-->
            </el-col>
          </el-row>

          <h6
            v-if="isRepairWorkOrder && onlyRead && isHavefaultClassInfo"
            class="my-title"
          >
            <remix-icon
              icon-class="attachment-line"
              style="color: orange"
            />
            {{ translateTitle('故障代码信息') }}
          </h6>
          <div v-if="isRepairWorkOrder && onlyRead && isHavefaultClassInfo">
            <el-row type="flex" justify="space-between">
              <el-col :span="6">
                <el-form-item class="s-form-item">
                  <span>
                    <el-tag>{{ translateTitle('故障代码') }}:</el-tag>
                  </span>
                  {{ faultClassInfo.faultNo }}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item class="s-form-item">
                  <span>
                    <el-tag>{{ translateTitle('故障名称') }}:</el-tag>
                  </span>
                  {{ faultClassInfo.faultName }}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item class="s-form-item">
                  <span>
                    <el-tag>{{ translateTitle('父故障代码名称') }}:</el-tag>
                  </span>
                  {{ faultClassInfo.parentFaultName }}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form>
                  <el-button type="primary" @click="viewFaultInfo">
                    查看故障代码详情
                  </el-button>
                </el-form>
              </el-col>
            </el-row>
          </div>
        </el-form>
        <div class="btn-align-center form-btns">
          <el-button
            v-if="addFlag"
            class="conBtn"
            type="primary"
            @click="createWorkOrder"
          >
            {{ translateTitle('确定') }}
          </el-button>
          <el-button
            v-if="editFlag && !onlyRead"
            class="conBtn"
            type="primary"
            @click="editWorkOrder"
          >
            {{ translateTitle('修改') }}
          </el-button>
          <el-button
            v-if="addFlag || (editFlag && !onlyRead)"
            class="resetBtn"
            @click="doReset"
          >
            {{ translateTitle('重置') }}
          </el-button>
          <el-button class="cancelBtn" @click="cancelBtn">
            {{ translateTitle('取消') }}
          </el-button>
          <el-button
            v-if="onlyRead && curWorkOrderInfo.workorderStatus == '1'"
            type="primary"
            @click="ApprovalBtn()"
          >
            审批
          </el-button>
          <el-button
            v-if="onlyRead && curWorkOrderInfo.workorderStatus == '5'"
            type="primary"
            @click="acceptanceBtn(curWorkOrderInfo)"
          >
            验收
          </el-button>
        </div>
      </div>
      <div v-if="tipIndex == 3">
        <mapRange
          :limit-coordinate="form.limitCoordinate"
          :limit-radius="form.limitRadius"
          @mapData="getMapData"
          @mapCancel="mapCancel"
        />
      </div>

      <!-- 选择设备弹窗 -->
      <el-dialog
        :close-on-click-modal="false"
        :title="translateTitle('选择设备')"
        width="65%"
        :modal="false"
        :visible.sync="dialogDVisible"
        :before-close="handleCloseDeviceDia"
      >
        <div>
          <el-row style="margin-bottom: 15px">
            <!-- <el-col :span="6">
              <el-select
                v-model="searchDeviceData.deviceTypeId"
                style="width: 100%"
                clearable
                :placeholder="translateTitle('设备分类')"
              >
                <el-option
                  v-for="list in deviceTypeList"
                  :key="list.id"
                  :value="list.id"
                  :label="list.name"
                ></el-option>
              </el-select>
            </el-col> -->

            <el-col :span="6" style="margin: 0 20px 0 0">
              <el-input
                v-model="searchDeviceForm.equipmentNameOrCode"
                :placeholder="translateTitle('设备名称、编码')"
              />
            </el-col>

            <el-col :span="6" style="margin: 0 20px 0 0">
              <el-cascader
                v-model="searchDeviceForm.areaId"
                :placeholder="translateTitle('区域')"
                clearable
                style="width: 100%"
                :props="propData"
                :show-all-levels="true"
                :options="areaList"
                @change="getDevicePageFn"
              />
            </el-col>

            <el-col :span="6" style="margin: 0 20px 0 0">
              <el-select
                v-model="searchDeviceForm.mainEquipmentId"
                :placeholder="translateTitle('输送机')"
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
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6" style="margin: 5px 20px 5px 0">
              <el-cascader
                v-model="searchDeviceForm.equipmentKindId"
                :placeholder="translateTitle('输送带/部件分类')"
                clearable
                style="width: 100%"
                :props="kindPropData"
                :show-all-levels="true"
                :options="kindList"
              />
            </el-col>

            <!--<el-col :span="6" style="margin: 0 20px 0 0">
              <el-input
                v-model="searchDeviceData.materialName"
                :placeholder="translateTitle('设备名称、编码')"
              ></el-input>
            </el-col>
            &lt;!&ndash;<el-col :span="6" style="margin: 0 20px 0 0">&ndash;&gt;
            &lt;!&ndash;<el-input&ndash;&gt;
            &lt;!&ndash;v-model="searchDeviceData.materialObjectCode"&ndash;&gt;
            &lt;!&ndash;:placeholder="translateTitle('设备编码')"&ndash;&gt;
            &lt;!&ndash;&gt;</el-input>&ndash;&gt;
            &lt;!&ndash;</el-col>&ndash;&gt;
            <el-col :span="6" style="margin: 0 20px 0 0">
              <el-select
                v-model="searchDeviceData.factoryId"
                filterable
                clearable
                :placeholder="translateTitle('厂区筛选')"
                @change="changeGetWorkSpacePageList"
              >
                <el-option
                  v-for="list in factoryList"
                  :key="list.id"
                  :value="list.id"
                  :label="list.name"
                ></el-option>
              </el-select>
            </el-col>

            <el-col :span="6" style="margin: 0 20px 0 0">
              <el-select
                v-model="searchDeviceData.workSpaceId"
                filterable
                clearable
                :placeholder="translateTitle('作业区筛选')"
                @change="changeGetProductionLinePageList"
              >
                <el-option
                  v-for="list in workSpaceList"
                  :key="list.id"
                  :value="list.id"
                  :label="list.name"
                ></el-option>
              </el-select>
            </el-col>

            <el-col :span="6" style="margin: 5px 20px 0 0">
              <el-select
                v-model="searchDeviceData.productionLineId"
                filterable
                clearable
                :placeholder="translateTitle('输送线筛选')"
                @change="changeGetBeltPageList"
              >
                <el-option
                  v-for="list in productLineList"
                  :key="list.id"
                  :value="list.id"
                  :label="list.name"
                ></el-option>
              </el-select>
            </el-col>

            <el-col :span="6" style="margin: 5px 20px 0 0">
              <el-select
                v-model="searchDeviceData.coverybeltId"
                filterable
                clearable
                :placeholder="translateTitle('输送带筛选')"
              >
                <el-option
                  v-for="list in beltList"
                  :key="list.id"
                  :value="list.id"
                  :label="list.coveryBeltName"
                ></el-option>
              </el-select>
            </el-col>-->
            <el-col :span="1" style="margin: 5px 20px 0 0">
              <el-button type="primary" @click="searchDeviceDataFn">
                {{ translateTitle('搜索') }}
              </el-button>
            </el-col>
            <el-col :span="1" style="margin: 5px 20px 0 4em">
              <el-button type="primary" @click="reSearchDeviceDataFn">
                {{ translateTitle('重置') }}
              </el-button>
            </el-col>
          </el-row>
          <zTable
            ref="deviceTable"
            :height="300"
            :table-data="deviceInfo.tableData"
            :cols="deviceCols"
            :show-pagination="true"
            :show-row-highlight="true"
            :each-page-size="deviceInfo.pageConfig.eachPageSize"
            :total="deviceInfo.pageConfig.total"
            :current-page="deviceInfo.pageConfig.currentPage"
            @rowChange="handleCurDeviceChange"
            @pageChange="handleDeviceCurrentChange"
          />
        </div>
        <span slot="footer" class="dialog-footer form-btns">
          <el-button class="cancelBtn" @click="handleCloseDeviceDia">
            {{ translateTitle('取消') }}
          </el-button>
          <el-button class="conBtn" type="primary" @click="setDeviceData">
            {{ translateTitle('确定') }}
          </el-button>
        </span>
      </el-dialog>

      <!-- 选择人员弹窗 -->
      <el-dialog
        :close-on-click-modal="false"
        :title="translateTitle('人员选择')"
        width="60%"
        :modal="false"
        :visible.sync="dialogUserVisible"
        :before-close="handleCloseUserDia"
      >
        <div>
          <el-row style="margin-bottom: 15px">
            <el-col :span="6" style="margin-right: 20px">
              <el-input
                v-model="searchUserData.nameLike"
                :placeholder="translateTitle('用户姓名')"
              />
            </el-col>
            <el-col :span="4">
              <el-button type="primary" @click="searchUserDataFn">
                {{ translateTitle('搜索') }}
              </el-button>
            </el-col>
          </el-row>
          <zTable
            ref="userSelect"
            :height="300"
            :table-data="userInfo.tableData"
            :cols="userCols"
            :show-pagination="true"
            :show-row-highlight="person.type == '1'"
            :show-selection="person.type != '1'"
            :total="userInfo.pageConfig.total"
            :current-page="userInfo.pageConfig.currentPage"
            :each-page-size="userInfo.pageConfig.eachPageSize"
            @rowChange="handleCurUserChange"
            @selectionChange="handleCurUserChange"
            @pageChange="handleUserCurrentChange"
          >
            <!-- <template #form="scope">
              {{ numToStr(scope.row.form) }}
            </template> -->
          </zTable>
        </div>
        <span slot="footer" class="dialog-footer form-btns">
          <el-button class="cancelBtn" @click="handleCloseUserDia">
            {{ translateTitle('取消') }}
          </el-button>
          <el-button class="conBtn" type="primary" @click="confirmUserSelect">
            {{ translateTitle('确定') }}
          </el-button>
        </span>
      </el-dialog>

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

      <el-dialog center :visible.sync="dialogVisible" width="50%">
        <bt-title title="预览" />
        <img :src="codeImg" style="width: 100%; height: 100%">
      </el-dialog>

      <!-- 故障详情 -->
      <el-dialog
        :close-on-click-modal="false"
        :title="translateTitle('故障详情')"
        width="60%"
        :modal="false"
        :visible.sync="dialogFaultVisible"
        :before-close="handleCloseFaultDia"
      >
        <div>
          <el-row>
            <el-col :span="8">
              <el-tag>{{ translateTitle('故障代码') }}:</el-tag>
              {{ faultClassInfo.faultNo ? faultClassInfo.faultNo : '--' }}
            </el-col>
            <el-col :span="8">
              <el-tag>{{ translateTitle('故障名称') }}:</el-tag>
              {{ faultClassInfo.faultName ? faultClassInfo.faultName : '--' }}
            </el-col>
            <el-col :span="8">
              <el-tag>{{ translateTitle('父故障代码名称') }}:</el-tag>
              {{
                faultClassInfo.parentFaultName
                  ? faultClassInfo.parentFaultName
                  : '--'
              }}
            </el-col>
          </el-row>

          <el-row style="margin-top: 15px">
            <el-col :span="24">
              <el-tag>{{ translateTitle('故障原因') }}:</el-tag>
              {{ faultClassInfo.reason ? faultClassInfo.reason : '--' }}
            </el-col>
          </el-row>

          <el-row style="margin-top: 15px">
            <el-col :span="24">
              <el-tag>{{ translateTitle('解决方法') }}:</el-tag>
              {{ faultClassInfo.resolvent ? faultClassInfo.resolvent : '--' }}
            </el-col>
          </el-row>

          <el-row style="margin-top: 15px">
            <el-col :span="24">
              <el-tag>{{ translateTitle('所需工种') }}:</el-tag>
              {{
                faultClassInfo.repairWorkerTypeName
                  ? faultClassInfo.repairWorkerTypeName
                  : '--'
              }}
            </el-col>
          </el-row>

          <el-row style="margin-top: 15px">
            <el-col :span="24">
              <el-tag>{{ translateTitle('工种等级') }}:</el-tag>
              {{
                faultClassInfo.repairJobGradeName
                  ? faultClassInfo.repairJobGradeName
                  : '--'
              }}
            </el-col>
          </el-row>

          <el-row style="margin-top: 15px">
            <el-col :span="24">
              <el-tag>{{ translateTitle('所需工具') }}:</el-tag>
              {{
                faultClassInfo.repairToolName
                  ? faultClassInfo.repairToolName
                  : '--'
              }}
            </el-col>
          </el-row>

          <el-row style="margin-top: 15px">
            <el-col :span="8">
              <el-tag>{{ translateTitle('文档') }}:</el-tag>
              <img
                v-if="faultClassInfo.fileType === 'img'"
                :src="faultClassInfo.resolventFile"
                width="40"
                height="40"
                class="head_pic"
                @click="viewFiles(faultClassInfo.resolventFile)"
              >
              <video
                v-if="faultClassInfo.fileType === 'video'"
                :src="faultClassInfo.resolventFile"
                width="40"
                height="40"
                controls="controls"
              >
                您的浏览器不支持视频播放
              </video>
              <img
                v-if="
                  faultClassInfo.fileType === 'pdf' &&
                    faultClassInfo.resolventFile
                "
                src="@/assets/images/inspect/file_pdf.png"
                title="点击下载pdf"
                width="40"
                height="40"
                class="head_pic"
                @click="downFiles(faultClassInfo.resolventFile)"
              >
              <img
                v-if="
                  faultClassInfo.fileType === 'word' &&
                    faultClassInfo.resolventFile
                "
                src="@/assets/images/inspect/file_word.png"
                title="点击下载word"
                width="40"
                height="40"
                class="head_pic"
                @click="downFiles(faultClassInfo.resolventFile)"
              >
            </el-col>
          </el-row>
        </div>
        <span slot="footer" class="dialog-footer form-btns">
          <el-button class="cancelBtn" @click="handleCloseFaultDia">
            {{ translateTitle('取消') }}
          </el-button>
        </span>
      </el-dialog>
    </bt-page>
  </el-main>
</template>

<script>
import { hasPermission } from '@/utils/hasPermission'
import { translateTitle } from '../../i18n'
import { mapActions, mapGetters } from 'vuex'
import { getUserList, } from '../../api/myApi'
import { getBaseInfoOptionList } from '../../api/baseData'
import { listEquip, listMainEquip } from '../../api/basicSetting/equipPos'
import { listEquipTypeTree } from '../../api/basicSetting/equipType'
import { listAreaTree } from '../../api/basicSetting/area'
import {
  appraiseWorkOrder,
  approveWorkOrder,
  checkWorkOrder,
  createNewWorkOrder,
  getWorkOrderById,
  updateWorkOrder,
} from '../../api/workOrder'
import zTable from '../../components/zTable'
// import zPageTitle from '../../components/zPageTitle'
import zUpload from '../../components/zUpload'
import mapRange from '../../components/mapRange/mapRange'
import FaultClass from '@/module/inspect/api/faultClass';

export default {
  components: {
    // zPageTitle,
    zTable,
    zUpload,
    mapRange,
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
      rowData: {},
      customProps: {
        label: 'label',
        value: 'id',
        children: 'children',
        emitPath: false,
        checkStrictly: true
      },
      code: 'em:workorder',
      title: '工单（新增）',
      isRepairWorkOrder: true,
      level3List: [],
      taskId: '',
      isShow: false,
      currentChoose: '',
      choosed: [],
      //状态，故障，原因
      priorityIndex: -1,
      troubleIndex: -1,
      troubleCauseIndex: -1,
      dialog: false,
      dialogDVisible: false,
      dialogFaultVisible: false,
      dialogUserVisible: false,
      approveDialog: false,
      checkDialog: false,
      //验收
      acceptanceDialog: false,
      //评价
      evaluateDialog: false,
      tipIndex: 2,
      addFlag: true,
      editFlag: false,
      onlyRead: false,
      //设备
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
        //   prop: 'status',
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
        //   label: '物料定义名称',
        //   width: 120,
        //   showOverflowTooltip: true,
        // },
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
          prop: 'equipmentCode',
          label: '设备编码',
          width: 240,
          showOverflowTooltip: true,
        },
        {
          prop: 'equipmentName',
          label: '设备名称',
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
      userCols: [
        { prop: 'name', label: '真实姓名', showOverflowTooltip: true },
        {
          prop: 'loginName',
          label: '工号/登录名',
          showOverflowTooltip: true,
        },
        { prop: 'deptName', label: '所属部门', showOverflowTooltip: true },
        { prop: 'id', label: '用户ID', showOverflowTooltip: true },
      ],
      tableData: [],
      //设备分类
      deviceTypeList: [],
      //部门列表
      deptList: [],
      //搜索工单信息
      searchWorkOrderData: {
        workorderStatus: '',
        factoryDistrictId: '',
        startCreatedTime: '',
        endCreatedTime: '',
        prodLineId: '',
      },
      //搜索用户信息
      searchUserData: {
        nameLike: '',
      },
      //人员列表
      person: {
        actionUser: '',
        supervise: [],
        join: [],
        type: '1',
      },
      //临时选择的用户
      tempUserList: [],
      //选择设备
      deviceInfo: {
        tableData: [],
        pageConfig: {
          total: 0,
          eachPageSize: 10,
          currentPage: 1,
        },
      },
      //选择人员
      userInfo: {
        tableData: [],
        pageConfig: {
          total: 0,
          eachPageSize: 10,
          currentPage: 1,
        },
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
      searchDeviceForm: {
        equipmentNameOrCode: '',
        equipmentKindId: '',
        areaId: '',
        mainEquipmentId: '',
      },
      //当前选中设备信息
      curDeviceInfo: null,
      //当前选中工单信息
      curWorkOrderInfo: null,
      //upload
      imgFileList: [],
      file: null,
      form: {
        //执行人id
        // actionUser: '',
        // adaptId: '',
        equipmentName: '',
        equipmentId: '',
        conveyorName: '',
        factoryDistrictId: '',
        priority: '',
        productionLineId: '',
        faultClassId: '',
        troubleCause: '',
        troubleLevel: '',
        workorderName: '',
        expendTime: '',
        expendUnit: '分',
        troubleDesc: '',
        watchUserList: [],
        watchUserNameList: [],
        joinUserList: [],
        joinUserNameList: [],
        troubleAttachIdList: [],
      },
      faultClassInfo: {},
      isHavefaultClassInfo: false,
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
      userFlag: 'single',
      rules: {},
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
      //审批信息
      approveInfo: {
        id: '',
        isPass: true,
        remark: '',
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
      // factoryList: [],
      // workSpaceList: [],
      // productLineList: [],
      // beltList: [],
      codeImg: '',
      dialogVisible: false,
      conveyorList: [],
      propData: {
        label: 'areaName',
        value: 'id',
        children: 'children',
        emitPath: false,
        checkStrictly: true,
      },
      faultClassPropData: {
        label: 'faultName',
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

    this.getBaseInfoFn()
    /*getFactoryList().then((res) => {
        if (res.success == 1) {
          this.factoryList = res.data
        }
      })*/

    this.getDevicePageFn()

    /*
    monitorApi.getKindPage({ params: { ignoreConveyor: '1' } }).then((res) => {
      let { data } = res
      this.kindList = this.getTreeData(data)
    })

     */

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

    if (this.workOrderStatus) {
      this.searchWorkOrderData.workorderStatus = this.workOrderStatus
      this._setWorkOrderStatus('')
      return
    }

    //query传参筛选工单
    let qs = this.$route.query
    if (qs.prodLineId) {
      this.searchWorkOrderData.prodLineId = qs.prodLineId
      this.searchWorkOrderData.workorderStatus = '3'
    }
  },
  mounted () {
    this.setRules()
    setTimeout(() => {
      this.$refs.form1.resetFields()
    }, 30)
    // 查看详情
    if (this.$route.query.params)
      this.rowData = JSON.parse(this.$route.query.params)
    console.log('this.rowData', this.rowData)

    if (this.rowData && this.rowData.isEdit) {
      let onlyRead = this.rowData.onlyRead ? true : false
      this.title = onlyRead ? '工单（查看）' : '工单（编辑）'
      this.getWorkOrderInfoById(onlyRead)
      this.fetchingFaultClas()
    }
  },
  methods: {
    hasPermission,
    setRules () {
      this.rules = {
        equipmentNo: [
          {
            required: true,
            message: this.translateTitle('设备不可为空'),
            trigger: ['blur', 'change'],
          },
        ],
        workorderName: [
          {
            required: true,
            message: this.translateTitle('工单名称不可为空'),
            trigger: ['blur', 'change'],
          },
          {
            min: 2,
            max: 15,
            message: this.translateTitle('长度在2到15个字符'),
            trigger: 'blur',
          },
        ],
        actionUser: [
          {
            required: false,
            message: this.translateTitle('执行人不可为空'),
            trigger: ['blur', 'change'],
          },
        ],
        priority: [
          {
            required: true,
            message: this.translateTitle('优先级不可为空'),
            trigger: ['blur', 'change'],
          },
        ],
        troubleCause: [
          {
            required: true,
            message: this.translateTitle('故障原因不可为空'),
            trigger: ['blur', 'change'],
          },
        ],
        troubleLevel: [
          {
            required: true,
            message: this.translateTitle('故障等级不可为空'),
            trigger: ['blur', 'change'],
          },
        ],
      }
    },
    openMap () {
      this.tipIndex = 3
    },
    getMapData (data) {
      console.log('地图范围返回数据-', data)
      let { limitCoordinate, limitRadius } = data
      this.form.limitCoordinate = limitCoordinate
      this.form.limitRadius = limitRadius
      this.tipIndex = 2
    },
    mapCancel () {
      this.tipIndex = 2
    },
    translateTitle,
    ...mapActions({
      _setRepairFlag: 'zcoreBase/_setRepairFlag',
      _setEqtRepairInfo: 'zcoreBase/_setRepairFlag',
      _setWorkOrderStatus: 'zcoreBase/_setWorkOrderStatus',
    }),
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
    /*changeGetWorkSpacePageList(val) {
        this.workSpaceList = []
        this.productLineList = []
        this.beltList = []
        this.searchDeviceData.workSpaceId = ''
        this.searchDeviceData.productionLineId = ''
        this.searchDeviceData.coverybeltId = ''
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
        this.beltList = []
        this.searchDeviceData.productionLineId = ''
        this.searchDeviceData.coverybeltId = ''
        getProductLineList({
          pageSize: 99999,
          pageNum: 1,
          workSpaceId: val,
        }).then((res) => {
          let { success, data } = res
          if (success) this.productLineList = data
        })
      },
      changeGetBeltPageList(val) {
        this.beltList = []
        this.searchDeviceData.coverybeltId = ''
        getBeltList({
          pageSize: 99999,
          pageNum: 1,
          coveryLineId: val,
        }).then((res) => {
          let { success, data } = res
          if (success) this.beltList = data
        })
      },*/
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
    cancelBtn () {
      this.$router.go(-1)
    },
    getPriority (index, item) {
      if (this.onlyRead) return
      this.priorityIndex = index
      this.form.priority = item
    },
    getTrouble (index, item) {
      if (this.onlyRead) return
      this.troubleIndex = index
      this.form.troubleLevel = item
    },
    getTroubleCause (index, item) {
      if (this.onlyRead) return
      this.troubleCauseIndex = index
      this.form.troubleCause = item
    },
    //重置
    doReset () {
      this.$refs.form1.resetFields()
      this.form = this.$options.data().form
      this.person = this.$options.data().person
      this.imgFileList = []
      this.priorityIndex = -1
      this.troubleIndex = -1
      this.troubleCauseIndex = -1
    },
    //设备分页
    handleDeviceCurrentChange (val) {
      this.deviceInfo.pageConfig.currentPage = val
      this.requestDeviceData(val, this.deviceInfo.pageConfig.eachPageSize)
    },
    //用户分页
    handleUserCurrentChange (val) {
      this.userInfo.pageConfig.currentPage = val
      this.requestUserData(val, this.userInfo.pageConfig.eachPageSize)
    },
    handleCloseDeviceDia () {
      this.dialogDVisible = false
      this.curDeviceInfo = null
      this.searchDeviceData = {}
    },
    //选中的设备信息
    handleCurDeviceChange (val) {
      console.log('*******' + val)
      this.curDeviceInfo = val
    },
    //打开选择设备弹窗
    chooseDevice () {
      this.dialogDVisible = true
      //获取设备分类列表
      /*getAllDeviceTypeList().then((res) => {
          if (res.success == 1) {
            let { data } = res
            this.deviceTypeList = data
            console.log(this.deviceTypeList)
          }
        })*/
      //获取设备列表
      this.requestDeviceData(1, this.deviceInfo.pageConfig.eachPageSize)
    },
    //设备列表
    async requestDeviceData (pageNum, pageSize) {
      /*await getAdaptPageList({
          pageNum,
          pageSize,
          ...this.searchDeviceData,
        }).then((res) => {
          if (res.success == 1) {
            let resData = res.data
            console.log(resData)
            let temp = {
              pageConfig: {
                currentPage: resData.pageNum,
                eachPageSize: resData.pageSize,
                total: resData.total,
              },
              tableData: resData.result,
            }
            this.deviceInfo = Object.assign({}, temp)
          }
        })*/

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
          let temp = {
            pageConfig: {
              currentPage: data.current,
              eachPageSize: data.size,
              total: data.total,
            },
            tableData: data.records,
          }
          this.deviceInfo = Object.assign({}, temp)
        })

       */

      listEquip({
        pageNum: pageNum,
        pageSize: pageSize,
        ...this.searchDeviceForm,
      }).then(res => {
        if (res.success) {
          let temp = {
            pageConfig: {
              currentPage: res.data.pageNum,
              eachPageSize: res.data.pageSize,
              total: res.data.total,
            },
            tableData: res.data.result,
          }
          this.deviceInfo = Object.assign({}, temp)
          console.log("====ZZ:" + this.deviceInfo)

        }
      })

    },
    //获取用户列表
    async requestUserData (pageNum, pageSize) {
      await getUserList({
        pageNum,
        pageSize,
        nameLike: this.searchUserData.nameLike,
      }).then((res) => {
        // console.log(res);
        if (res.success == 1) {
          let { data } = res
          console.log(data)
          let temp = {
            pageConfig: {
              currentPage: data.pageNum,
              eachPageSize: data.pageSize,
              total: data.total,
            },
            tableData: data.result,
          }
          this.userInfo = Object.assign({}, temp)
        }
      })
    },
    //把选择的设备值赋值给form 回显
    setDeviceData () {
      if (!this.curDeviceInfo) {
        this.showErrorTip('请选择一个设备')
        return
      }
      //处理设备信息
      let temp = {
        // adaptId: this.curDeviceInfo.id,
        equipmentNo: this.curDeviceInfo.equipmentCode,
        deviceId: this.curDeviceInfo.id,
        equipmentName: this.curDeviceInfo.equipmentName,
        model: this.curDeviceInfo.equipmentModel,
        specification: this.curDeviceInfo.equipmentSpecifications,
        beltName: this.curDeviceInfo.mainEquipmentName,
        id: this.form.id, //保留工单id
        conveyorName: this.curDeviceInfo.mainEquipmentName, //所属输送机
      }
      this.form = Object.assign({}, this.form, temp)
      console.log('form--', this.form)
      this.dialogDVisible = false
      this.curDeviceInfo = null
    },
    reSearchDeviceDataFn () {
      // this.searchDeviceData = {}
      this.searchDeviceForm = {}
      this.requestDeviceData(1, this.deviceInfo.pageConfig.eachPageSize)
    },
    searchDeviceDataFn () {
      this.requestDeviceData(1, this.deviceInfo.pageConfig.eachPageSize)
    },
    searchUserDataFn () {
      this.requestUserData(1, this.userInfo.pageConfig.eachPageSize)
    },
    //打开故障详情
    viewFaultInfo () {
      this.dialogFaultVisible = true
    },
    //关闭故障详情
    handleCloseFaultDia () {
      this.dialogFaultVisible = false
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
    //关闭用户弹窗
    handleCloseUserDia () {
      this.dialogUserVisible = false
      this.searchUserData = {}
    },
    //打开用户弹窗
    openUserDia (type) {
      console.log(type)
      this.person.type = type
      this.userFlag = type == '1' ? 'single' : 'multiple'
      this.dialogUserVisible = true
      this.requestUserData(1, this.userInfo.pageConfig.eachPageSize)
    },
    handleCurUserChange (val) {
      console.log(this.userFlag, val)
      if (this.userFlag == 'single') {
        this.tempUserList = [val]
      } else {
        this.tempUserList = val
      }
    },
    //删除已选人员
    spanClose (userType, name) {
      //actionUser supervise join
      console.log(userType, name)
      if (userType == 'actionUser') {
        // this.form.actionUserName = ''
        // this.form.actionUser = ''
        this.form.doThingUserNameList.splice(0)
        this.form.doThingUserList.splice(0)
        return
      }

      if (userType == 'supervise') {
        this.person.supervise.forEach((item, i) => {
          console.log(item)
          if (name == item.name) {
            this.person.supervise.splice(i, 1)
            this.form.watchUserList.splice(i, 1)
            this.form.watchUserNameList.splice(i, 1)
          }
        })
      }

      if (userType == 'join') {
        this.person.join.forEach((item, i) => {
          console.log(item)
          if (name == item.name) {
            this.person.join.splice(i, 1)
            this.form.joinUserList.splice(i, 1)
            this.form.joinUserNameList.splice(i, 1)
          }
        })
      }
    },
    //确认选择人员
    confirmUserSelect () {
      let noRepeat = () => {
        //人员不能重复
        let arr = [...this.form.watchUserList, ...this.form.joinUserList]
        if (this.form.actionUser) arr.push(this.form.actionUser)
        let repeat = false

        this.tempUserList.forEach((item) => {
          arr.forEach((el) => {
            if (item.id == el) repeat = true
          })
        })
        return repeat
      }
      if (this.userFlag == 'single' && this.person.type == '1') {
        // 执行人
        if (this.tempUserList.length == 1) {
          //人员不能重复
          // let arr = [...this.form.watchUserList,...this.form.joinUserList];
          if (noRepeat()) {
            this.showUserNotSameTip()
            return
          }
          // TODO set user
          // this.form.actionUserName = this.tempUserList[0].name
          // this.form.actionUser = this.tempUserList[0].id
          this.form.doThingUserList = [this.tempUserList[0].id]
          this.form.doThingUserNameList = [this.tempUserList[0].name]
          this.dialogUserVisible = false
          this.tempUserList = []
          this.searchUserData = {}
        } else {
          this.showErrorTip('执行人需选择一人')
        }
      } else {
        if (this.tempUserList.length == 0) {
          this.showErrorTip('至少选择一人')
          return
        } else {
          // if (this.person.type == '2') {
          //   // 监督人
          //   //人员不能重复
          //   if (noRepeat()) {
          //     this.showUserNotSameTip()
          //     return
          //   }
          //   let obj = {}
          //   let res = this.person.supervise
          //     .concat(this.tempUserList)
          //     .reduce((prev, cur) => {
          //       obj[cur.id] ? '' : (obj[cur.id] = true && prev.push(cur))
          //       return prev
          //     }, [])
          //   this.person.supervise = res
          //   //获得最新的人员列表 清空之前的列表重新放入人员
          //   this.form.watchUserList = []
          //   this.form.watchUserNameList = []
          //   this.person.supervise.forEach((item) => {
          //     this.form.watchUserList.push(item.id)
          //     this.form.watchUserNameList.push(item.name)
          //   })
          // } else if (this.person.type == '3') {
          //   // 参与人
          //   //人员不能重复
          //   if (noRepeat()) {
          //     this.showUserNotSameTip()
          //     return
          //   }
          //
          //   let obj = {}
          //   let res = this.person.join
          //     .concat(this.tempUserList)
          //     .reduce((prev, cur) => {
          //       obj[cur.id] ? '' : (obj[cur.id] = true && prev.push(cur))
          //       return prev
          //     }, [])
          //   this.person.join = res
          //   //获得最新的人员列表 清空之前的列表重新放入人员
          //   this.form.joinUserList = []
          //   this.form.joinUserNameList = []
          //   this.person.join.forEach((item) => {
          //     this.form.joinUserList.push(item.id)
          //     this.form.joinUserNameList.push(item.name)
          //   })
          // }
          this.dialogUserVisible = false
          this.tempUserList = []
          this.searchUserData = {}
        }
      }
    },
    //创建工单
    async createWorkOrder () {
      console.log(this.form)
      this.$refs.form1.validate(async (valid) => {
        if (!valid) {
          this.showErrorTip('必填项不能为空')
        } else {
          console.log(this.form)
          createNewWorkOrder(this.form).then((res) => {
            if (res.success == 1) {
              this.showSuccessTip('创建成功')
              this.cancelBtn()
            }
          })
        }
      })
    },
    //查看评价
    handleCheckEvaluate (index, row) {
      console.log(row)
      this.evaluateData.appraiseGrade = row.appraiseGrade
      this.evaluateData.appraiseRemark = row.appraiseRemark
      this.evaluateData.disabled = true
      this.evaluateDialog = true
    },
    // 获取工单
    getWorkOrderInfoById (onlyRead) {
      getWorkOrderById({ id: this.rowData.data.id }).then((res) => {
        if (res.success == 1) {
          console.log(res)
          let { data } = res
          this.curWorkOrderInfo = data
          this.isRepairWorkOrder =
            data.workorderType === 'preventMaintain' ? false : true
          if (data.faultClassInfoVO) {
            this.faultClassInfo = data.faultClassInfoVO
            this.isHavefaultClassInfo = true
          }
          //还原person
          this.person = this.$options.data().person
          this.form = Object.assign({}, this.form, data)
          this.form.watchUserList.forEach((item, index) => {
            this.person.supervise.push({
              id: item,
              name: this.form.watchUserNameList[index],
            })
          })
          //加入人list
          this.form.joinUserList.forEach((item, index) => {
            this.person.join.push({
              id: item,
              name: this.form.joinUserNameList[index],
            })
          })
          //图片
          this.imgFileList = []

          if (data.fileUploadVOList && data.fileUploadVOList.length) {
            data.fileUploadVOList.forEach((item) => {
              let obj = {}
              obj.url = item.fileUrl
              obj.id = item.id
              obj.uploaded = true
              this.imgFileList.push(obj)
              this.form.troubleAttachIdList.push(item.id)
            })
          }

          //如果没有时间 默认单位为分
          if (!this.form.expendUnit) {
            this.form.expendUnit = this.timeList[0].value
          }
          this.onlyRead = onlyRead
          console.log('请求后的onlyread', onlyRead, this.onlyRead)
          this.addFlag = false
          this.editFlag = true
        }
      })
    },
    //更改工单信息
    async editWorkOrder () {
      console.log(this.form)
      this.$refs.form1.validate(async (valid) => {
        if (!valid) {
          this.showErrorTip('必填项不能为空')
        } else {
          // task --> filter data fields
          // Reflect.deleteProperty(this.form, 'finishUserList')
          // Reflect.deleteProperty(this.form, 'finishUserNameLis')
          // Reflect.deleteProperty(this.form, 'checkUserList')
          // Reflect.deleteProperty(this.form, 'checkUserNameList')
          updateWorkOrder(this.form).then((res) => {
            if (res.success == 1) {
              this.showSuccessTip('更新成功')
              this.cancelBtn()
            }
          })
        }
      })
    },
    //审批按钮
    ApprovalBtn () {
      // console.log(row)
      // if (row) this.curWorkOrderInfo = row
      // console.log(this.curWorkOrderInfo)
      // if (
      //   !this.curWorkOrderInfo.actionUserName ||
      //   !this.curWorkOrderInfo.priority
      // ) {
      //   this.showErrorTip('工单必填信息有缺失，请完善')
      //   return
      // }

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
          this.cancelBtn()
          //工单评价打开
          this.acceptanceDialog = false
          this.evaluateDialog = true
        }
      })
    },
    //拒绝验收 重做任务
    acceptanceFail () {
      this.checkInfo.isPass = false
      checkWorkOrder(this.checkInfo).then((res) => {
        if (res.success == 1) {
          this.showSuccessTip('任务状态已更新')
          this.cancelBtn()
          this.acceptanceDialog = false
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
          this.cancelBtn()
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
    handleDropClick () {
      this.dialog = true
    },
    //numToStr
    numToStr (num) {
      let str = ''
      switch (num) {
        case '1':
          str = '通用账户'
          break
        case '2':
          str = '管理端账户'
          break
        case '3':
          str = '前端账户'
          break
      }
      return str
    },
    downFiles (url) {
      window.open(url)
    },
    viewFiles (url) {
      this.codeImg = url
      this.dialogVisible = true
    },
    // 人员不能重复提示
    showUserNotSameTip () {
      this.$msg({
        message: this.translateTitle('人员不能重复'),
        type: 'error',
      })
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
    fetchingFaultClas () {
      FaultClass.getClassTree({}).then(res => {
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
