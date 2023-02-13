<template>
  <el-main ref="main" class="si">
    <bt-page :title="title" icon-bg-color="#FF866A">
      <!--    <zPageTitle :title="title" :show-filter="false" />-->
      <div v-show="tipIndex == 2" class="more-info-form">
        <el-form ref="form" :model="form" :rules="addRules" :disabled="onlyRead">
          <el-row type="flex" justify="space-between">
            <el-col :span="5">
              <el-form-item :label="translateTitle('计划名称')" prop="planName">
                <el-input
                  v-model="form.planName"
                  :placeholder="translateTitle('计划名称')"
                />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item :label="translateTitle('维护类别')" prop="planType">
                <el-select v-model="form.planType" @change="changePlanTypeFn">
                  <el-option
                    :label="translateTitle('给油脂')"
                    value="oil"
                  />
                  <!-- <el-option
                    :label="translateTitle('紧固')"
                    value="fasten"
                  ></el-option>-->
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <!--<el-form-item
                :label="translateTitle('厂区')"
                prop="factoryDistrictId"
              >
                <el-select
                  v-model="form.factoryDistrictId"
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
              </el-form-item>-->

              <el-form-item :label="translateTitle('区域')" prop="departId">
                <el-cascader
                  v-model="form.departId"
                  :placeholder="translateTitle('区域筛选')"
                  clearable
                  style="width: 100%"
                  :props="propData"
                  :show-all-levels="true"
                  :options="areaList"
                  @change="getDevicePageFn"
                />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <!--<el-form-item :label="translateTitle('作业区')" prop="workSpaceId">
                <el-select
                  v-model="form.workSpaceId"
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
              </el-form-item>-->
              <el-form-item :label="translateTitle('输送机')" prop="conveyorIds">
                <el-select
                  v-model="form.conveyorIds"
                  value-key="id"
                  :placeholder="translateTitle('输送机筛选')"
                  multiple
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
            </el-col>
          </el-row>
          <el-row type="flex" justify="space-between">
            <!--<el-col :span="5">
              <el-form-item
                :label="translateTitle('输送线')"
                prop="productionLineIds"
              >
                <el-select
                  v-model="form.productionLineIds"
                  multiple
                  filterable
                  clearable
                  :placeholder="translateTitle('输送线筛选')"
                >
                  <el-option
                    v-for="list in productLineList"
                    :key="list.id"
                    :value="list.id"
                    :label="list.name"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>-->

            <el-col :span="5">
              <el-form-item
                :label="
                  form.planType === 'oil'
                    ? translateTitle('给油脂计划开始时间')
                    : translateTitle('紧固计划开始时间')
                "
                prop="startTime"
              >
                <el-date-picker
                  v-model="form.startTime"
                  style="width: 100%"
                  type="date"
                  :picker-options="expireTimeOptionStart"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  :placeholder="
                    form.planType === 'oil'
                      ? translateTitle('给油脂计划开始时间')
                      : translateTitle('紧固计划开始时间')
                  "
                  @change="changeStartTime"
                />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item
                :label="
                  form.planType === 'oil'
                    ? translateTitle('给油脂计划结束时间')
                    : translateTitle('紧固计划结束时间')
                "
                prop="endTime"
              >
                <el-date-picker
                  v-model="form.endTime"
                  style="width: 100%"
                  type="date"
                  :picker-options="expireTimeOptionEnd"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  :placeholder="
                    form.planType === 'oil'
                      ? translateTitle('给油脂计划结束时间')
                      : translateTitle('紧固计划结束时间')
                  "
                />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item :label="translateTitle('执行状态')">
                <el-select v-model="form.isEnabled">
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
            </el-col>
          </el-row>
          <el-row class="filterUser">
            <el-col :span="24" class="filterBar">
              <el-form-item
                :label="translateTitle('执行人')"
                prop="actionUserList"
              >
                <div>
                  <template v-for="(list, index) in form.actionUserList">
                    <el-tag
                      :key="index"
                      effect="plain"
                      type="info"
                      :closable="!onlyRead"
                      @close="spanClose('actionUser', list)"
                    >
                      {{ list.name }}
                    </el-tag>
                  </template>
                  <el-select
                    v-model="form.actionUserIdList"
                    style="display: none"
                    multiple
                  >
                    <el-option
                      v-for="list in form.actionUserList"
                      :key="list.id"
                      :value="list.id"
                      :label="list.name"
                    />
                  </el-select>
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
            </el-col>
          </el-row>
          <el-row type="flex" justify="space-between">
            <el-col :span="6">
              <el-form-item :label="translateTitle('移动轨迹')">
                <div style="display: flex; width: 100%">
                  <el-button type="primary" @click="openMap">
                    {{ translateTitle('请选择') }}
                  </el-button>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="18">
              <el-form-item :label="translateTitle('提交范围')">
                <div style="display: flex; width: 100%">
                  <el-InputNumber
                    v-model="form.submitScope"
                    size="mini"
                    :min="0"
                    @blur="inputNumberBlur"
                  />
                  <div>
                    {{ translateTitle('米') }}
                    <el-tooltip effect="dark">
                      <div slot="content">
                        {{ translateTitle('限制提交的范围') }}
                      </div>
                      <i class="ri-question-fill" />
                    </el-tooltip>
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 已选择维护部位列表 -->
          <el-row v-show="form.planType == 'oil'">
            <el-col>
              <span>
                <bt-button type="primary" @click="addLubricatePartList">
                  添加维护设备部位
                </bt-button>
              </span>
              <el-tabs>
                <el-tab-pane label="维护设备部位">
                  <div class="el-box">
                    <el-form
                      ref="formData"
                      :model="formData"
                      :disabled="onlyRead"
                    >
                      <el-table
                        class="table-form"
                        :data="formData.lubricateDeviceList"
                        :header-cell-style="{ textAlign: 'center' }"
                        :cell-style="{ textAlign: 'center' }"
                        stripe
                        fit
                        highlight-current-row
                        style="width: 100%"
                      >
                        <el-table-column type="index" label="序号" />
                        <el-table-column
                          prop="lubricatePart"
                          label="润滑部位"
                          width="120"
                        >
                          <template slot-scope="scope">
                            <el-form-item
                              class="table-form-item"
                              :prop="`lubricateDeviceList.${scope.$index}.lubricatePart`"
                              :rules="addRules.lubricatePart"
                            >
                              <el-select v-model="scope.row.lubricatePart">
                                <el-option
                                  v-for="item in lubricateParts"
                                  :key="item.dataCode"
                                  :label="item.dataValue"
                                  :value="item.dataCode"
                                />
                              </el-select>
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="oilType"
                          label="润滑油牌号"
                          width="200"
                        >
                          <template slot-scope="scope">
                            <el-form-item
                              class="table-form-item"
                              :prop="`lubricateDeviceList.${scope.$index}.oilType`"
                              :rules="addRules.oilType"
                            >
                              <el-select v-model="scope.row.oilType">
                                <el-option
                                  v-for="item in oilTypes"
                                  :key="item.dataCode"
                                  :label="item.dataValue"
                                  :value="item.dataCode"
                                />
                              </el-select>
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="replenishOilCycleTimes"
                          label="补油周期"
                        >
                          <template slot-scope="scope">
                            <el-form-item
                              class="table-form-item"
                              :prop="`lubricateDeviceList.${scope.$index}.replenishOilCycleTimes`"
                              :rules="addRules.replenishOilCycleTimes"
                            >
                              <el-input
                                v-model="scope.row.replenishOilCycleTimes"
                                size="mini"
                              />
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="replenishOilCycleUnit"
                          label="补油周期-单位"
                          width="120"
                        >
                          <template slot-scope="scope">
                            <el-form-item
                              class="table-form-item"
                              :prop="`lubricateDeviceList.${scope.$index}.replenishOilCycleUnit`"
                              :rules="addRules.replenishOilCycleUnit"
                            >
                              <el-select
                                v-model="scope.row.replenishOilCycleUnit"
                              >
                                <el-option
                                  v-for="item in cycles"
                                  :key="item.dataCode"
                                  :label="item.dataValue"
                                  :value="item.dataCode"
                                />
                              </el-select>
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="replenishOilTimes"
                          label="补油次数"
                        >
                          <template slot-scope="scope">
                            <el-form-item
                              class="table-form-item"
                              :prop="`lubricateDeviceList.${scope.$index}.replenishOilTimes`"
                              :rules="addRules.replenishOilTimes"
                            >
                              <el-input
                                v-model="scope.row.replenishOilTimes"
                                size="mini"
                              />
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="nextExecuteTimeReplenish"
                          label="补油开始执行时间"
                          width="160"
                        >
                          <template slot-scope="scope">
                            <el-form-item
                              class="table-form-item"
                              :prop="`lubricateDeviceList.${scope.$index}.nextExecuteTimeReplenish`"
                              :rules="addRules.nextExecuteTimeReplenish"
                            >
                              <el-date-picker
                                v-model="scope.row.nextExecuteTimeReplenish"
                                style="width: 100%"
                                type="date"
                                :picker-options="nextTime"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd"
                              />
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="changeOilCycleTimes"
                          label="换油周期"
                        >
                          <template slot-scope="scope">
                            <el-form-item
                              class="table-form-item"
                              :prop="`lubricateDeviceList.${scope.$index}.changeOilCycleTimes`"
                              :rules="addRules.changeOilCycleTimes"
                            >
                              <el-input
                                v-model="scope.row.changeOilCycleTimes"
                                size="mini"
                              />
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="changeOilCycleUnit"
                          label="换油周期-单位"
                          width="120"
                        >
                          <template slot-scope="scope">
                            <el-form-item
                              class="table-form-item"
                              :prop="`lubricateDeviceList.${scope.$index}.changeOilCycleUnit`"
                              :rules="addRules.changeOilCycleUnit"
                            >
                              <el-select v-model="scope.row.changeOilCycleUnit">
                                <el-option
                                  v-for="item in cycles"
                                  :key="item.dataCode"
                                  :label="item.dataValue"
                                  :value="item.dataCode"
                                />
                              </el-select>
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column prop="changeOilTimes" label="换油次数">
                          <template slot-scope="scope">
                            <el-form-item
                              class="table-form-item"
                              :prop="`lubricateDeviceList.${scope.$index}.changeOilTimes`"
                              :rules="addRules.changeOilTimes"
                            >
                              <el-input
                                v-model="scope.row.changeOilTimes"
                                size="mini"
                              />
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="nextExecuteTimeChange"
                          label="换油开始执行时间"
                          width="160"
                        >
                          <template slot-scope="scope">
                            <el-form-item
                              class="table-form-item"
                              :prop="`lubricateDeviceList.${scope.$index}.nextExecuteTimeChange`"
                              :rules="addRules.nextExecuteTimeChange"
                            >
                              <el-date-picker
                                v-model="scope.row.nextExecuteTimeChange"
                                style="width: 100%"
                                type="date"
                                :picker-options="nextTime"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd"
                              />
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="oilQuantityType"
                          label="加油量"
                          width="120"
                        >
                          <template slot-scope="scope">
                            <el-form-item
                              class="table-form-item"
                              :prop="`lubricateDeviceList.${scope.$index}.oilQuantityType`"
                              :rules="addRules.oilQuantityType"
                            >
                              <el-select v-model="scope.row.oilQuantityType">
                                <el-option
                                  v-for="item in oilQuantityTypes"
                                  :key="item.dataCode"
                                  :label="item.dataValue"
                                  :value="item.dataCode"
                                />
                              </el-select>
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column
                          fixed="right"
                          label="操作"
                          min-width="80%"
                        >
                          <template #default="{ row }">
                            <bt-dropdown :show-split="false">
                              <bt-dropdown-menu>
                                <bt-dropdown-item
                                  @click.native="delModelSpecialInfoList(row)"
                                >
                                  <i class="el-icon-delete" />
                                  删除
                                </bt-dropdown-item>
                              </bt-dropdown-menu>
                            </bt-dropdown>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-form>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </el-col>
          </el-row>

          <!--<el-row v-show="form.planType == 'fasten'">
            <el-col>
              <span>
              <bt-button type="primary" @click="addLubricatePartList">
                添加维护设备部位
              </bt-button>
            </span>
              <el-tabs>
                <el-tab-pane label="维护设备部位">
                  <div class="el-box">
                    <el-form ref="formData" :model="formData">
                      <el-table
                        class="table-form"
                        :data="formData.lubricateDeviceList"
                        :header-cell-style="{ textAlign: 'center' }"
                        :cell-style="{ textAlign: 'center' }"
                        stripe
                        fit
                        highlight-current-row
                        style="width: 100%"
                      >
                        <el-table-column type="index" label="序号" />
                        <el-table-column prop="modelPropertyCode" label="紧固部位">
                          <template slot-scope="scope">
                            <el-form-item
                              class="table-form-item"
                              :prop="`lubricateDeviceList.${scope.$index}.modelPropertyCode`"
                              :rules="addRules.modelPropertyCode"
                            >
                              <el-select
                                v-model="scope.row.unit"
                              >
                                <el-option
                                  :label="translateTitle('滚筒轴承')"
                                  value="1"
                                ></el-option>
                              </el-select>
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column prop="modelPropertyName" label="紧固工具">
                          <template slot-scope="scope">
                            <el-form-item
                              class="table-form-item"
                              :prop="`lubricateDeviceList.${scope.$index}.modelPropertyName`"
                              :rules="addRules.modelPropertyName"
                            >

                              <el-select
                                v-model="scope.row.unit"
                              >
                                <el-option
                                  :label="translateTitle('螺丝刀')"
                                  value="1"
                                ></el-option>
                              </el-select>
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column prop="unitSymbol" label="紧固周期-单位">
                          <template slot-scope="scope">
                            <el-form-item
                              class="table-form-item"
                              :prop="`lubricateDeviceList.${scope.$index}.unitSymbol`"
                              :rules="addRules.unitSymbol"
                            >
                              <el-select
                                v-model="scope.row.unit"
                              >
                                <el-option
                                  :label="translateTitle('日')"
                                  value="1"
                                ></el-option>
                              </el-select>
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column prop="unitSymbol" label="紧固周期-次数">
                          <template slot-scope="scope">
                            <el-form-item
                              class="table-form-item"
                              :prop="`lubricateDeviceList.${scope.$index}.unitSymbol`"
                              :rules="addRules.unitSymbol"
                            >
                              <el-input
                                v-model="scope.row.unitName"
                                size="mini"
                              ></el-input>
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column fixed="right" label="操作" min-width="20%">
                          <template #default="{ row }">
                            <bt-dropdown :show-split="false">
                              <bt-dropdown-menu>
                                <bt-dropdown-item
                                  @click.native="delModelSpecialInfoList(row)"
                                >
                                  <i class="el-icon-delete"></i>
                                  删除
                                </bt-dropdown-item>
                              </bt-dropdown-menu>
                            </bt-dropdown>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-form>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </el-col>
          </el-row>-->
        </el-form>
        <div class="form-btns">
          <el-button
            v-if="addFlag"
            class="conBtn"
            type="primary"
            @click="allSubmitForm('save')"
          >
            {{ translateTitle('确定') }}
          </el-button>
          <el-button
            v-if="editFlag && !onlyRead"
            class="conBtn"
            type="primary"
            @click="allSubmitForm('update')"
          >
            {{ translateTitle('修改') }}
          </el-button>
          <el-button
            v-if="addFlag || (editFlag && !onlyRead)"
            class="resetBtn"
            @click="resetFn"
          >
            {{ translateTitle('重置') }}
          </el-button>
          <el-button class="cancelBtn" @click="cancelBtn">
            {{ translateTitle('取消') }}
          </el-button>
        </div>
      </div>
      <div v-if="tipIndex == 4">
        <mapRange
          :limit-coordinate="form.limitCoordinate"
          :limit-radius="form.limitRadius"
          @mapData="getMapData"
          @mapCancel="mapCancel"
        />
      </div>
      <!-- 选择人员弹窗 -->
      <el-dialog
        :close-on-click-modal="false"
        :modal="false"
        :title="translateTitle('选择人员')"
        width="60%"
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
          <el-row>
            <el-col>
              <zTable
                ref="userSelect"
                :table-data="userInfo.tableData"
                :height="300"
                :cols="userCols"
                :total="userInfo.total"
                :each-page-size="userInfo.eachPageSize"
                :current-page="userInfo.currentPage"
                :show-selection="true"
                @pageChange="handleUserCurrentChange"
                @rowChange="handleCurUserChange"
                @selectionChange="handleCurUserChange"
              />
            </el-col>
          </el-row>
        </div>
        <span slot="footer" class="dialog-footer form-btns">
          <el-button class="cancelBtn" @click="handleCloseUserDia">
            {{ translateTitle('取消') }}
          </el-button>
          <el-button type="primary" class="conBtn" @click="confirmUserSelect">
            {{ translateTitle('确定') }}
          </el-button>
        </span>
      </el-dialog>
    </bt-page>
  </el-main>
</template>

<script>
import { hasPermission } from '@/utils/hasPermission'
import { translateTitle } from '../../i18n'
import {
  createNewPreventmaintainPlan,
  getPreventmaintainPlanInfoById,
  updatePreventmaintainPlan,
} from '../../api/preventMaintainPlan'
import { getPollingDetailById } from '../../api/pollingRecord'
import { getUserList, } from '../../api/myApi'
import { listAreaTree } from '../../api/basicSetting/area'
import { listMainEquip } from '../../api/basicSetting/equipPos'
import zTable from '../../components/zTable'
// import zPageTitle from '../../components/zPageTitle'
import mapRange from '../../components/mapRange/mapRange'
import { blurInteger } from './validate'

export default {
  components: {
    zTable,
    // zPageTitle,
    mapRange,
  },
  data () {
    return {
      code: 'em:prevent_maintain',
      title: '预防性维护计划（新增）',
      level3List: [],
      topActiveName: 'plan',
      botActiveName: 'record',
      recordOpList: [{ value: '查看', disabled: false }],
      tipIndex: 2,
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
      dialog: false,
      pagesInfo: {
        showPlan: false,
        showRecord: false,
      },
      active: true,
      addFlag: true,
      editFlag: false,
      onlyRead: false,
      tableData: [],
      tableContentData: [],
      total: 0,
      eachPageSize: 10,
      currentPage: 1,
      form: {
        planType: 'oil',
        planName: '',
        startTime: '',
        endTime: '',
        isEnabled: true,
        //执行人多人员
        actionUserIdList: [],
        actionUserList: [],
        //执行人单个人员
        actionUserName: '',
        actionUser: '',
        //关联的润滑部位
        devices: [],
        limitCoordinate: '',
        limitRadius: 0,
        //巡检提交范围
        submitScope: 0,
        // factoryDistrictId: '',
        // workSpaceId: '',
        // productionLineIds: [],
        departId: '',
        conveyorIds: [],
      },
      rules: {},
      lubricateParts: [],
      oilTypes: [],
      cycles: [],
      oilQuantityTypes: [],
      searchPlanData: {
        isEnabled: '',
        planNameAndCode: '',
        startTime: '',
        endTime: '',
        planName: '',
        planCode: '',
      },
      //选择人员
      dialogUserVisible: false,
      userFlag: 'multiple',
      //搜索用户信息
      searchUserData: {},
      //临时选择的用户
      tempUserList: [],
      //人员列表
      person: {
        //执行
        actionUserList: [],
        type: '1',
      },
      //选择人员
      userInfo: {
        tableData: [],
        total: 0,
        eachPageSize: 10,
        currentPage: 1,
      },
      //设备列表信息
      deviceInfo: {
        tableData: [],
        total: 0,
        eachPageSize: 10,
        currentPage: 1,
      },
      //标准名称
      standardName: '',
      //设备类型id
      equipmentTypeId: '',
      dialogStandardVisible: false,
      standardInfo: {
        tableData: [],
        total: 0,
        eachPageSize: 10,
        currentPage: 1,
      },
      dialogRecordVisible: false,
      //记录详情
      taskDetail: {},
      //之前时间不可选
      expireTimeOptionStart: {
        disabledDate: (date) => {
          return date.getTime() < Date.now()
        },
      },
      expireTimeOptionEnd: {
        disabledDate: (date) => {
          if (this.form.startTime) {
            return (
              date.getTime() <
              new Date(this.form.startTime).getTime() + 24 * 60 * 60 * 1000
            )
          } else {
            return date.getTime() < Date.now()
          }
        },
      },
      nextTime: {
        disabledDate: (date) => {
          if (this.form.endTime) {
            return (
              date.getTime() > new Date(this.form.endTime).getTime() ||
              date.getTime() < Date.now()
            )
          }
          return date.getTime() < Date.now()
        },
      },
      // factoryList: [],
      // workSpaceList: [],
      // productLineList: [],
      formData: {
        lubricateDeviceList: [], // 润滑部位
      },
      addRules: {
        planName: [
          {
            required: true,
            message: '计划名称不可为空',
            trigger: 'blur',
          },
          {
            min: 2,
            max: 50,
            message: '长度在2到50个字符',
            trigger: 'blur',
          },
        ],
        startTime: [
          {
            required: true,
            message: '开始时间不可为空',
            trigger: 'blur',
          },
        ],
        endTime: [
          {
            required: true,
            message: '结束时间不可为空',
            trigger: 'blur',
          },
        ],
        actionUserList: [
          {
            required: true,
            message: '执行人不可为空',
            trigger: ['blur', 'change'],
          },
        ],
        factoryDistrictId: [
          {
            required: true,
            message: '厂区不可为空',
            trigger: ['blur', 'change'],
          },
        ],
        workSpaceId: [
          {
            required: true,
            message: '作业区不可为空',
            trigger: ['blur', 'change'],
          },
        ],
        productionLineIds: [
          {
            required: true,
            message: '输送线不可为空',
            trigger: ['blur', 'change'],
          },
        ],
        departId: [
          {
            required: true,
            message: '所属区域不可为空',
            trigger: ['blur', 'change'],
          },
        ],
        conveyorIds: [
          {
            required: true,
            message: '输送机不可为空',
            trigger: ['blur', 'change'],
          },
        ],
        lubricatePart: [
          { required: true, message: '请输入润滑部位', trigger: 'change' },
        ],
        oilType: [
          { required: true, message: '请输入润滑油牌号', trigger: 'change' },
        ],
        replenishOilCycleTimes: [
          { required: true, message: '请输入补油周期', trigger: 'blur' },
          { validator: blurInteger, trigger: 'blur' },
        ],
        replenishOilCycleUnit: [
          {
            required: true,
            message: '请输入补油周期-单位',
            trigger: 'change',
          },
        ],
        replenishOilTimes: [
          { required: true, message: '请输入补油次数', trigger: 'blur' },
          { validator: blurInteger, trigger: 'blur' },
        ],
        nextExecuteTimeReplenish: [
          {
            required: true,
            message: '请输入补油开始执行时间',
            trigger: 'blur',
          },
        ],
        changeOilCycleTimes: [
          { required: true, message: '请输入换油周期', trigger: 'blur' },
          { validator: blurInteger, trigger: 'blur' },
        ],
        changeOilCycleUnit: [
          {
            required: true,
            message: '请输入换油周期-单位',
            trigger: 'change',
          },
        ],
        changeOilTimes: [
          { required: true, message: '请输入换油次数', trigger: 'blur' },
          { validator: blurInteger, trigger: 'blur' },
        ],
        nextExecuteTimeChange: [
          {
            required: true,
            message: '请输入换油开始执行时间',
            trigger: 'blur',
          },
        ],
        oilQuantityType: [
          { required: true, message: '请输入加油量', trigger: 'change' },
        ],
      },
      conveyorList: [],
      areaList: [],
      propData: {
        label: 'areaName',
        value: 'id',
        children: 'children',
        emitPath: false,
        checkStrictly: true,
      },
    }
  },
  computed: {},
  watch: {
    onlyRead (newVal, oldVal) {},
    '$i18n.locale' () {
      this.setRules()
    },
  },
  async created () {
    /*getFactoryList().then((res) => {
      let { success, data } = res
      if (success) this.factoryList = data
    })*/
    this.getAllDevicePageFn()

    listAreaTree().then(res => {
      if (res.success) {
        this.areaList = this.getTreeData(res.data)
        console.log("====ZZ:" + this.areaList)
      }
    })
  },
  mounted () {
    // 查看详情
    if (this.$route.query.params)
      this.rowData = JSON.parse(this.$route.query.params)

    if (this.rowData && this.rowData.isEdit) {
      let onlyRead = this.rowData.onlyRead ? true : false
      this.title = onlyRead
        ? '预防性维护计划（查看）'
        : '预防性维护计划（编辑）'
      this.getPlanInfoById(onlyRead)
    }
    // 润滑部位
    let data1 = {
      params: {
        catalogCode: 'LUBRICATE_PART',
      },
    }
    this.$api.getDailyCheckDictionary(data1).then((res) => {
      if (res.code === 0) {
        this.lubricateParts = res.data
      }
    })

    // 润滑油牌号
    let data2 = {
      params: {
        catalogCode: 'OIL_TYPE',
      },
    }
    this.$api.getDailyCheckDictionary(data2).then((res) => {
      if (res.code === 0) {
        this.oilTypes = res.data
      }
    })

    // 周期
    let data3 = {
      params: {
        catalogCode: 'CYCLE',
      },
    }
    this.$api.getDailyCheckDictionary(data3).then((res) => {
      if (res.code === 0) {
        this.cycles = res.data
      }
    })

    // 加油量
    let data4 = {
      params: {
        catalogCode: 'OIL_QUANTITY_TYPE',
      },
    }
    this.$api.getDailyCheckDictionary(data4).then((res) => {
      if (res.code === 0) {
        this.oilQuantityTypes = res.data
      }
    })
  },
  methods: {
    hasPermission,
    translateTitle,
    changeTag (index) {
      this.tipIndex = index
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
      /*
      if (index != 1) {
        this.$nextTick(() => {
          this.$refs.recordTable.doLayout()
          this.$refs.planTable.doLayout()
        })
      }
       */
    },
    /*changeGetWorkSpacePageList(val) {
      this.workSpaceList = []
      this.productLineList = []
      this.form.workSpaceId = ''
      this.form.productionLineIds = []
      this.getWorkSpacePageFn(val)
    },
    changeGetProductionLinePageList(val) {
      this.productLineList = []
      this.form.productionLineIds = []
      this.getProductLineListFn(val)
    },
    // 获取作业区
    getWorkSpacePageFn(factoryId) {
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
    },*/
    // 获取输送机列表
    getDevicePageFn (areaId) {

      this.conveyorList = []
      this.form.conveyorIds = []
      this.form.conveyorNames = []

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
    getAllDevicePageFn (areaId) {
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
    //更改计划执行状态
    changeEnabled (index, row, flag) {
      console.log(row)
      changePlanActionStatus({
        id: row.id,
        status: flag,
      }).then((res) => {
        if (res.success == 1) {
          this.showSuccessTip('计划状态修改成功')
        }
      })
    },
    //plan
    handlePlanSizeChange (val) {
      this.eachPageSize = val
      this.currentPage = 1
    },
    //plan
    handlePlanCurrentChange (val) {
      this.currentPage = val
    },
    // 切换预防性维护类型
    changePlanTypeFn () {
      this.$refs.form.resetFields()
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
      this.dialogUserVisible = true
      this.requestUserData(1, this.userInfo.eachPageSize)
    },
    //获取用户列表
    async requestUserData (pageNum, pageSize) {
      await getUserList({
        pageNum,
        pageSize,
        nameLike: this.searchUserData.nameLike,
      }).then((res) => {
        if (res.success == 1) {
          let { data } = res
          console.log(data)
          data.result.forEach((item) => {
            item.isPublic = item.isPublic ? '通用账户' : '移动端账户'
          })
          let temp = {
            currentPage: data.pageNum,
            eachPageSize: data.pageSize,
            total: data.total,
            tableData: data.result,
          }
          this.userInfo = Object.assign({}, temp)
        }
      })
    },
    handleCurUserChange (val) {
      console.log('UserChange--', this.userFlag, 'val--', val)
      if (!val) return
      if (this.userFlag == 'single') {
        this.tempUserList = [val]
      } else {
        this.tempUserList = val
      }
    },
    //用户分页
    handleUserCurrentChange (val) {
      this.userInfo.currentPage = val
      this.requestUserData(val, this.userInfo.eachPageSize)
    },
    //删除已选人员
    spanClose (userType, list) {
      console.log(userType, list)
      if (userType == 'actionUser') {
        this.person.actionUserList.forEach((item, i) => {
          console.log(item)
          if (list.id == item.id) {
            this.person.actionUserList.splice(i, 1)
            this.form.actionUserList.splice(i, 1)
            this.form.actionUserIdList.splice(
              this.form.actionUserIdList.findIndex((val) => val == item.id),
              1
            )
          }
        })
      }
    },
    //确认选择人员
    confirmUserSelect () {
      let noRepeat = () => {
        //人员不能重复
        let arr = [...this.form.actionUserIdList]
        let repeat = false
        this.tempUserList.forEach((item) => {
          arr.forEach((el) => {
            if (item.id == el) repeat = true
          })
        })
        return repeat
      }
      if (this.tempUserList.length == 0) {
        this.showErrorTip('至少选择一人')
        return
      } else {
        if (this.person.type == '1') {
          // 执行人
          if (noRepeat()) {
            // 人员不能重复提示
            this.showUserNotSameTip()
            return
          }
          let obj = {}
          let res = this.person.actionUserList
            .concat(this.tempUserList)
            .reduce((prev, cur) => {
              obj[cur.id] ? '' : (obj[cur.id] = true && prev.push(cur))
              return prev
            }, [])
          this.person.actionUserList = res
          console.log('res--', res)
          //获得最新的人员列表 清空之前的列表重新放入人员
          this.form.actionUserList = []
          this.form.actionUserIdList = []
          this.person.actionUserList.forEach((item) => {
            this.form.actionUserList.push(item)
            this.form.actionUserIdList.push(item.id)
          })
        }
        this.dialogUserVisible = false
        this.tempUserList = []
        this.searchUserData = {}
      }
    },
    searchUserDataFn () {
      this.requestUserData(1, this.deviceInfo.eachPageSize)
    },
    //获取当前年月日
    getCurTime () {
      let curTime = new Date()
      let year = curTime.getFullYear()
      let month = curTime.getMonth() + 1
      let day = curTime.getDate()
      let beTwo = (num) => (num < 10 ? '0' + num : num)
      return year + '-' + beTwo(month) + '-' + beTwo(day)
    },
    //表单数据梳理
    checkFormData () {
      let canGoOn = true

      if (this.formData.lubricateDeviceList.length == 0) {
        this.$msg({
          message: this.translateTitle('请添加维护设备部位'),
          type: 'warning',
        })
        return
      }

      this.formData.lubricateDeviceList.forEach((device) => {
        this.lubricateParts.forEach((item) => {
          if (device.lubricatePart === item.dataCode)
            device.lubricatePartName = item.dataValue
        })

        this.oilTypes.forEach((item) => {
          if (device.oilType === item.dataCode)
            device.oilTypeName = item.dataValue
        })

        this.oilQuantityTypes.forEach((item) => {
          if (device.oilQuantityType === item.dataCode)
            device.oilQuantityTypeName = item.dataValue
        })

        if (
          device.nextExecuteTimeReplenish &&
          device.nextExecuteTimeReplenish.length == 10
        ) {
          device.nextExecuteTimeReplenish =
            device.nextExecuteTimeReplenish + ' 00:00:00'
        }

        if (
          device.nextExecuteTimeChange &&
          device.nextExecuteTimeChange.length == 10
        ) {
          device.nextExecuteTimeChange =
            device.nextExecuteTimeChange + ' 00:00:00'
        }
      })
      this.form.devices = this.formData.lubricateDeviceList

      //userId
      this.form.actionUserList.forEach((action) => {
        action.userId = action.id
      })
      // 开始时间和结束时间尾部
      if (this.form.startTime && this.form.startTime.length == 10) {
        this.form.startTime = this.form.startTime + ' 00:00:00'
      }
      if (this.form.endTime && this.form.endTime.length == 10) {
        this.form.endTime = this.form.endTime + ' 00:00:00'
      }
      return true
    },
    getFormValidPromise (form) {
      return new Promise((resolve, reject) => {
        form.validate((res) => {
          resolve(res)
        })
      })
    },
    //提交数据 创建计划
    allSubmitForm (type) {
      const father_form = this.$refs.form
      const children_form = this.$refs.formData
      Promise.all(
        [father_form, children_form].map(this.getFormValidPromise)
      ).then((res) => {
        const validateResult = res.every((item) => !!item)
        if (validateResult) {
          if (type === 'save') {
            this.submitForm()
          }
          if (type === 'update') {
            this.updateForm()
          }
        } else {
          this.showErrorTip('必填项请填写完整')
        }
      })
    },
    async submitForm () {
      // 处理数据
      let res = this.checkFormData()

      /*
      this.form.departName = this.areaList.find(item => item.id == this.form.departId).areaName
      this.form.conveyorNames = this.conveyorList.map(item => {
        if (this.form.conveyorIds.includes(item.id)) {
          return item.equipmentName
        }
      })

       */

      console.log(res, this.form)
      res &&
      createNewPreventmaintainPlan(this.form).then((res) => {
        console.log(res)
        if (res.success == 1) {
          this.showSuccessTip('计划创建成功')
          // 跳到列表
          this.cancelBtn()
          this.tipClose(2)
        } else {
          this.$msg.error(res.errorMsg ? res.errorMsg : '新增计划失败')
        }
      })
    },
    //更新计划
    async updateForm () {
      let res = this.checkFormData()

      /*
      this.form.departName = this.areaList.find(item => item.id == this.form.departId).areaName
      this.form.conveyorNames = this.conveyorList.map(item => {
        if (this.form.conveyorIds.includes(item.id)) {
          return item.equipmentName
        }
      })

       */

      console.log('testttt', this.form)

      console.log(res, this.form)
      res &&
      updatePreventmaintainPlan(this.form).then((res) => {
        console.log(res)
        if (res.success == 1) {
          this.showSuccessTip('修改成功')
          // 跳到列表
          this.cancelBtn()
          this.tipClose(2)
        } else {
          this.$msg.error(res.errorMsg ? res.errorMsg : '修改计划失败')
        }
      })
    },
    //取消按钮
    cancelBtn () {
      this.$router.go(-1)
    },
    resetFn () {
      const planType = this.form.planType
      this.$refs.form.resetFields()
      this.$refs.formData.resetFields()
      this.formData.lubricateDeviceList = []
      this.formData.lubricateDeviceList.push({})
      this.person = this.$options.data().person
      this.form = this.$options.data().form
      if (planType === 'oil') {
        this.form.planType = 'oil'
      } else {
        this.form.planType = 'fasten'
      }
    },
    //编辑计划
    getPlanInfoById (onlyRead) {
      getPreventmaintainPlanInfoById({ id: this.rowData.data.id }).then(
        (res) => {
          console.log(res)
          if (res.success == 1) {
            let { data } = res
            this.form = this.$options.data().form
            this.person = this.$options.data().person
            this.form = Object.assign({}, this.form, data)

            this.pagesInfo.showPlan = true
            //执行人
            if (this.form.actionUserList.length > 0) {
              this.form.actionUserList.forEach((action) => {
                action.id = action.userId
                this.form.actionUserIdList.push(action.userId)
                this.person.actionUserList.push({
                  id: action.userId,
                  name: action.name,
                })
              })
            }
            // 如何部位
            this.formData.lubricateDeviceList = [...this.form.devices]
            // 加载厂区，作业区
            // if (this.form.factoryDistrictId)
            //   this.getWorkSpacePageFn(this.form.factoryDistrictId)
            // if (this.form.workSpaceId)
            //   this.getProductLineListFn(this.form.workSpaceId)
            if (this.form.departId)
              this.getAllDevicePageFn(this.form.departId)

            this.changeTag(2)
            this.onlyRead = onlyRead
            this.editFlag = true
            this.addFlag = false
          }
        }
      )
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
    //关闭巡检记录弹窗
    handleCloseRecordDia () {
      this.dialogRecordVisible = false
    },
    transformArrToStr (arr) {
      let res = arr.map((item) => item.userName)
      return res.join(',')
    },
    changeStartTime (date) {
      this.form.endTime = ''
    },
    changeSearchStartTime () {
      this.searchPlanData.endTime = ''
    },
    //关闭子组件页面
    closeChild () {
      this.changeTag(1)
      this.tipClose(3)
    },
    openDrawer () {
      this.dialog = true
    },
    closeDrawer () {
      this.dialog = false
    },
    // 预防性维护-润滑部位
    addLubricatePartList () {
      let data = {
        /* lubricatePart: '',
        oilType: '',
        replenishOilCycleUnit: '',
        replenishOilCycleTimes: '',
        nextExecuteTimeReplenish: '',
        changeOilCycleUnit: '',
        changeOilCycleTimes: '',
        nextExecuteTimeChange: '',
        oilQuantityType: '',*/
      }
      this.formData.lubricateDeviceList.push(data)
    },
    delModelSpecialInfoList (val) {
      let idx = this.formData.lubricateDeviceList.indexOf(val)
      this.formData.lubricateDeviceList.splice(idx, 1)
    },
    openMap () {
      this.tipIndex = 4
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
    inputNumberBlur () {
      if (this.form.submitScope === undefined) this.form.submitScope = 0
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
  },
}
</script>

<style scoped lang="scss">
  @import '../../css/base';

  .pass-date {
    height: 100px;
    padding: 10px;
    background: #f9f9f9;
  }

  .filterUser {
    background: #f9f9f9;
  }

  .filterBar {
    .is-error {
      .el-button {
        border: 1px solid #ff4d4f;
      }
    }
  }

  .eltag-table {
    .el-tag + .el-tag {
      margin-left: 0;
    }
  }
</style>
