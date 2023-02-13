<template>
  <div class="app-container">
    <bt-page :title="title">
      <template slot="sections">
        <bt-section :show-drawer="false">
          <template slot="options">
            <bt-button
              v-if="activeTabName === 'attr'"
              type="primary"
              @click="handleAddAttrs"
            >
              新增
            </bt-button>
          </template>
          <el-tabs v-model="activeTabName" :before-leave="handlerBeforeLeave">
            <el-tab-pane label="基本信息" name="base">
              <div class="tab-item">
                <div class="flex-item fixed-400">
                  <el-form
                    ref="formBase"
                    :label-position="'top'"
                    :model="form"
                    :rules="baseRules"
                    label-width="80px"
                  >
                    <bt-section :show-drawer="false">
                      <div class="section">
                        <bt-title title="基础信息" />
                        <el-row :gutter="16">
                          <el-col :span="12">
                            <el-form-item label="设备编码" prop="equipmentCode">
                              <el-input
                                v-model="form.equipmentCode"
                                placeholder="请输入设备编码"
                              />
                            </el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item label="设备名称" prop="equipmentName">
                              <el-input
                                v-model="form.equipmentName"
                                placeholder="请输入设备名称"
                              />
                            </el-form-item>
                          </el-col>
                        </el-row>
                        <el-row :gutter="16">
                          <el-col :span="12">
                            <el-form-item label="设备分类" prop="equipmentKindId">
                              <!--                              <el-select-->
                              <!--                                v-model="form.kindId"-->
                              <!--                                placeholder="请选择设备分类"-->
                              <!--                              >-->
                              <!--                                <option value="1">1</option>-->
                              <!--                                <option value="2">2</option>-->
                              <!--                              </el-select>-->
                              <el-cascader
                                ref="kindCa"
                                v-model="form.equipmentKindId"
                                placeholder="请选择设备分类"
                                :props="customProps"
                                :options="typeOptions"
                                :show-all-levels="true"
                                style="width: 100%"
                                @change="handleTypeChange"
                              />
                            </el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item label="所属区域" prop="areaId">
                              <el-cascader
                                ref="caRef"
                                v-model="form.areaId"
                                :disabled="Boolean(form.equipmentLocation) || operationType==='add.sub'"
                                placeholder="请选择所属区域"
                                :props="customAreaProps"
                                :options="areaOptions"
                                :show-all-levels="true"
                                style="width: 100%"
                                @change="handleAreaChange"
                              />
                            </el-form-item>
                          </el-col>
                        </el-row>
                        <el-row :gutter="16">
                          <el-col :span="12">
                            <el-form-item label="设备型号" prop="equipmentModel">
                              <el-input
                                v-model="form.equipmentModel"
                                placeholder="请输入设备型号"
                              />
                            </el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item label="设备类型" prop="equipmentType">
                              <el-select
                                v-model="form.equipmentType"
                                :disabled="Boolean(detailedInfo.equipmentType&&operationType!=='add.sub')"
                                placeholder="请选择设备类型"
                                @change="handleEquipTypeChange"
                              >
                                <el-option v-for="item in taxonOptions" :key="item" :label="item" :value="item" />
                              </el-select>
                            </el-form-item>
                          </el-col>
                        </el-row>
                        <el-row :gutter="16">
                          <el-col :span="12">
                            <el-form-item label="设备规格" prop="equipmentSpecifications">
                              <el-input
                                v-model="form.equipmentSpecifications"
                                placeholder="请输入设备规格"
                              />
                            </el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item label="设备负责人" prop="managerId">
                              <el-select
                                v-model="form.managerId"
                                remote
                                filterable
                                value-key="userCode"
                                :remote-method="filterManagerId"
                                placeholder="请选择设备负责人"
                              >
                                <el-option
                                  v-for="item in managerOptions" :key="item.userCode" :label="item.userName"
                                  :value="item.userCode"
                                />
                              </el-select>
                            </el-form-item>
                          </el-col>
                        </el-row>
                        <el-row :gutter="16">
                          <el-col>
                            <el-form-item label="备品备件">
                              <el-select
                                ref="ep"
                                v-model="equipmentReplacements"
                                value-key="id"
                                clearable
                                filterable
                                remote
                                reserve-keyword
                                multiple
                                :remote-method="fetchMaterialList"
                                placeholder="请输入关键词筛选备品备件"
                                style="width: 100%"
                                @change="handleMaChange"
                              >
                                <el-option
                                  v-for="material in materialOptions"
                                  :key="material.id"
                                  :label="material.materialName"
                                  :value="material"
                                >
                                  <!--                                  <span style="float: left">{{ attr.attrName }}</span>-->
                                  <!--                                  <span style="float: right">-->
                                  <!--                                    {{ attr.attrDesc }}-->
                                  <!--                                  </span>-->
                                </el-option>
                              </el-select>
                            </el-form-item>
                          </el-col>
                        </el-row>
                      </div>
                    </bt-section>
                    <bt-section :show-drawer="false">
                      <template slot="options">
                        <el-switch
                          v-model="form.isManagePoint"
                          :active-value="0" :inactive-value="1"
                          style="margin-top: 20px"
                          @change="handleSwitchChange"
                        />
                      </template>
                      <div class="section">
                        <bt-title title="管理点" />
                        <el-row :gutter="16">
                          <el-col :span="12">
                            <el-form-item label="NFC编码" prop="nfcCode">
                              <el-input
                                v-model="form.nfcCode"
                                placeholder="请输入NFC编码"
                              />
                            </el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item label="二维码编码" prop="qrCode">
                              <el-input
                                v-model="form.qrCode"
                                placeholder="请输入二维码编码"
                              />
                            </el-form-item>
                          </el-col>
                        </el-row>
                      </div>
                    </bt-section>
                  </el-form>
                </div>
                <div class="flex-item">
                  <bt-section :show-drawer="false">
                    <bt-title title="设备布局" />
                    <div class="area-map">
                      <bt-map
                        v-if="activeTabName==='base'&& form.equipmentLocation && displayEquipJSON.length"
                        :datas="displayEquipJSON" :symbol="`${operationType==='edit'?detailedId:tempMakerId}`"
                        :tool-show="false" height="500px"
                      />
                      <el-button class="btn_area__reset" type="primary" @click="handleRewrite">
                        编辑设备
                      </el-button>
                      <div v-show="!form.equipmentLocation" class="area__empty">
                        <el-button type="primary" @click="handleEditMap">
                          <img src="@/assets/images/inspect/map_icon.png" alt>设置地图
                        </el-button>
                        <img src="@/assets/images/inspect/map_bg.png" alt="MAP">
                      </div>
                    </div>
                  </bt-section>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="属性" name="attr">
              <el-form ref="formParam" :model="form">
                <el-table
                  v-if="activeTabName==='attr'"
                  :data="form.attributesInfoList"
                  :header-cell-style="{ textAlign: 'center' }"
                  :cell-style="{ textAlign: 'center' }"
                  stripe
                  fit
                  highlight-current-row
                  style="width: 100%"
                  class="btTable"
                >
                  <el-table-column type="index" label="序号" />
                  <el-table-column prop="attrId" label="属性">
                    <template #default="scope">
                      <el-form-item
                        :prop="`attributesInfoList.${scope.$index}.attrId`"
                        :rules="paramRules.attrId"
                      >
                        <!--                        remote-->
                        <!--                        :remote-method="fetchAttrsList"-->
                        <el-select
                          v-model="scope.row.attrId"
                          clearable
                          filterable
                          placeholder="请选择属性"
                          style="width: 100%"
                          @change="(val)=>handleAttrSelectChange(val,scope.$index)"
                        >
                          <!--                          @change="()=>handleAttrSelectChange(scope.row)"-->
                          <el-option
                            v-for="(attr,k) in attrOptions"
                            :key="attr.id+k"
                            :label="attr.attrName"
                            :value="attr.id"
                          >
                            <!--                            :value="attr.id"-->
                            <span style="float: left">{{ attr.attrName }}</span>
                            <span style="float: right">
                              {{ attr.attrDesc }}
                            </span>
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="属性值">
                    <template slot-scope="scope">
                      <!--                      {{ scope.row }}-->
                      <!--                        <el-input v-model="scope.row.attrVal" />-->
                      <el-form-item
                        :prop="`attributesInfoList.${scope.$index}.attrVal`"
                        :rules="scope.row.attrRule.rules"
                      >
                        <!--                        <el-input v-model="scope.row.attrVal" />-->
                        <attr-box
                          v-model="scope.row.attrVal"
                          :attr-constraint="scope.row.attrRule"
                        />
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="属性单位" prop="attrUnit" />
                  <el-table-column label="属性描述" prop="attrDesc" />
                  <el-table-column fixed="right" width="200px" label="操作">
                    <template #default="{ $index }">
                      <bt-dropdown :show-split="false">
                        <bt-dropdown-menu>
                          <bt-dropdown-item
                            @click.native="handleDeleteAttr($index)"
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
            </el-tab-pane>
            <el-tab-pane label="图形" name="graph">
              <el-form
                ref="formGraph"
                :label-position="'top'"
                :model="form"
                label-width="80px"
              >
                <el-row>
                  <el-form-item label="图形">
                    <el-col
                      v-for="(item, index) of form.equipmentInstanceKindGraphList"
                      :key="index"
                      :span="6"
                    >
                      <el-form-item
                        :label="item.graphType"
                        :prop="`equipmentInstanceKindGraphList.${index}.graphUrl`"
                        :rules="graphRules.graph"
                      >
                        <pic-single-upload
                          v-model="item.graphUrl"
                          :file-type="item.graphType === '3D' ? '3D' : 'image'"
                        />
                      </el-form-item>
                    </el-col>
                  </el-form-item>
                </el-row>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </bt-section>
      </template>
      <template slot="sections">
        <el-button style="float: right; margin-left: 10px" @click="cancel">
          取消
        </el-button>
        <el-button type="primary" style="float: right" @click="onSubmit">
          保存
        </el-button>
      </template>
    </bt-page>
    <equip-pop
      v-if="((typeof form.equipmentLocation) === 'object'||(typeof form.equipmentLocation) === 'string')&&refreshPop"
      ref="equipPop" :symbol="`${operationType==='edit'?detailedId:tempMakerId}`" :dd="lineInitData||[]"
      :is-show="showLineEditor"
      @postdata="handlePostMapData"
      @close="handlePostMapClose"
    />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import picSingleUpload from '@/module/inspect/components/picSingleUpload.vue'
import tool from '@/utils/tools'
import EquipPop from '@/module/inspect/pages/basicSetting/component/EquipPop';
import BtMap from '@/module/inspect/pages/map'
import AttrBox from '@/module/inspect/components/AttrBox'
import { detailedEquipTypeInfo, listEquipTypeTree } from '@/module/inspect/api/basicSetting/equipType';
import { detailedAreaInfo, listAreaTree } from '@/module/inspect/api/basicSetting/area';
import {
  listBaseData,
  listMaterialItems,
  saveEquip,
  setEquipInsAttrs,
  setEquipInsGraphs,
  updateEquip
} from '@/module/inspect/api/basicSetting/equipPos';

const { mapState: mapState1 } = createNamespacedHelpers('coreCommon')

function uuid (prefix) {
  const s = [];
  const hexDigits = "0123456789abcdef";
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";
  return `${ prefix }-${ s.join("") }`;
}

const { mapState, mapActions, mapMutations, mapGetters } = createNamespacedHelpers('inspectBasicSettingEquipPos')
const TMAP = {
  'add': '新增设备位置',
  'add.sub': '新增子设备位置',
  'edit': '编辑设备位置'
}
const sortsMap = ['小', '中', '大', '3D']
export default {
  name: 'EquipPosForm',
  components: {
    picSingleUpload,
    BtMap,
    EquipPop,
    AttrBox
  },
  data () {
    return {
      showLineEditor: false,
      title: '',
      tempMakerId: '',
      activeTabName: 'base',
      refreshPop: true,
      lineInitData: [],
      displayEquipJSON: [],
      areaGeoData: [],
      typeOptions: [],
      areaOptions: [],
      parentArrayMap: [],
      baseRules: {
        equipmentCode: [
          {
            required: true,
            message: '请输入分类编码',
            trigger: 'blur',
          },
        ],
        equipmentName: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur',
          },
        ],
        equipmentKindId: [
          {
            required: true,
            message: '请选择设备分类',
            trigger: 'change',
          },
        ],
        areaId: [
          {
            required: true,
            message: '请选择设备区域',
            trigger: 'change'
          }
        ],
        equipmentType: [
          {
            required: true,
            message: '请选择设备类别',
            trigger: 'change'
          }
        ],
        managerId: [
          {
            required: true,
            message: '请选择设备负责人',
            trigger: 'change'
          }
        ]
      },
      graphRules: {
        graph: [
          // {
          //   required: true,
          //   message: '请上传图片',
          //   trigger: 'change',
          // },
        ],
      },
      paramRules: {
        attrId: [
          {
            required: true,
            message: '请选择属性',
            trigger: 'change',
          },
        ],
      },
      structureRules: {
        deviceId: [
          {
            required: true,
            message: '请选择部件',
            trigger: 'change',
          },
        ],
      },
      // 备品备件
      equipmentReplacements: [],
      form: {
        id: '',
        equipmentCode: '',
        equipmentName: '',
        equipmentKindId: '',
        parentInstanceId: '',
        areaId: '',
        equipmentModel: '',
        equipmentLocation: null, // dont change
        equipmentInstanceKindGraphList: [
          { graphUrl: '', graphName: '', graphType: '小' },
          { graphUrl: '', graphName: '', graphType: '中' },
          { graphUrl: '', graphName: '', graphType: '大' },
          { graphUrl: '', graphName: '', graphType: '3D' }
        ],
        attributesInfoList: []
      },
      propData: {
        label: 'kindName',
        value: 'id',
        children: 'children',
        emitPath: false,
        checkStrictly: true,
      },
      options: [],
      taxonOptions: [],
      customProps: {
        label: 'kindName',
        value: 'id',
        children: 'children',
        emitPath: false,
        // checkStrictly: true,
      },
      customAreaProps: {
        label: 'areaName',
        value: 'id',
        children: 'children',
        emitPath: false,
        // checkStrictly: true,
      },
      attrOptions: [],
      materialOptions: [],
      managerOptions: []
    }
  },
  computed: {
    ...mapState({
      operationType: 'operationType',
      treeWhole: 'treeWhole',
      treeNodeSelected: 'treeNodeSelected',
      editing: 'editing',
      detailedInfo: 'detailedInfo',
      detailedId: 'detailedId'
    }),
    ...mapState1({ allUnits: 'allUnits', allUser: 'allUser' })
    // displayEquipJSON () {
    //   const type = this.form.equipmentType === '输送机' ? 'line' : 'point'
    //   // const area = Array.from(this.areaGeoData)
    //   const area = [{ id: this.detailedInfo.areaId, type: 'area', features: this.areaGeoData }]
    //   const obj = [{ id: this.detailedId || this.tempMakerId, type, features: this.form.equipmentLocation }]
    //   console.log('[...area, ...obj]', [...area, ...obj])
    //   return [...area, ...obj]
    // }
  },
  watch: {
    treeWhole: {
      handler: function (val) {
        this.options = val
      },
      immediate: true,
    },
    operationType: {
      handler: function (val) {
        this.title = TMAP[val] || ''
      },
      immediate: true,
    },
    detailedInfo (val) {
      if (this.detailedId && this.operationType === 'edit') {
        this.copyDetailedData()
      }
    }
  },
  created () {
    if (this.operationType === 'add' || this.operationType === 'add.sub') {
      this.tempMakerId = this.uuid('equip')
    }
  },
  mounted () {
    this.fetchTypeTreeData()
    this.fetchAreaTreeData()
    this.fetchTaxonData()
    this.filterManagerId('')
    if (this.detailedId && this.operationType === 'edit') {
      // this.$nextTick(() => {
      this.copyDetailedData()
      this.fetchAttrsList(this.detailedInfo.equipmentKindId)
      this.handleAreaChange(this.detailedInfo.areaId)
      // })
    }
    if (this.operationType === 'add.sub') {
      this.form.areaId = this.detailedInfo.areaId
      this.handleAreaChange(this.form.areaId)
    }
  },
  methods: {
    ...mapMutations(['setIsComponent', 'setEditing', 'setTreeNodeSelected', 'setOperationType', 'SET_DETAILED_ID']),
    ...mapActions(['fetchDetailedEquipInfo']),
    uuid,
    copyDetailedData () {
      const sourceData = JSON.parse(JSON.stringify(this.detailedInfo))
      // todo 先找回设备信息
      let {
        equipmentInstanceKindGraphList,
        attributesInfoList,
        equipmentReplacementIds,
        equipmentReplacementNames
      } = sourceData
      this.form = {
        ...this.form, ...sourceData,
        attributesInfoList: attributesInfoList || [],
        equipmentReplacementIds: equipmentReplacementIds || [],
        equipmentReplacementNames: equipmentReplacementNames || [],
        equipmentInstanceKindGraphList: equipmentInstanceKindGraphList
      }
      console.log('detail', sourceData)
      // todo 物料options 从 detail中获取
      if (this.form.equipmentReplacementIds.length && this.form.equipmentReplacementNames.length) {
        let replacementList = equipmentReplacementIds.map((id, i) => ({
          id,
          materialName: equipmentReplacementNames[i]
        }))
        this.materialOptions = replacementList
        this.equipmentReplacements = replacementList
        console.log('test', this.materialOptions)
      } else {
        this.equipmentReplacements = []
      }
    },
    filterManagerId (keyword) {
      if (keyword !== '') {
        // get id
        const aa = this.allUser.filter(item => item.userName.includes(keyword))
        this.managerOptions = aa
      } else {
        this.managerOptions = this.allUser
      }
    },
    // it's mean kind
    handleTypeChange (e) {
      //When type value changed, fetch new attrs
      this.fetchAttrsList(e)
    },
    handleSwitchChange (v) {
      // 0 开 , 1 关  :( wtf
      if (!v) {
        const rrr = {
          nfcCode: [
            {
              required: true,
              message: '请输入NFC编码',
              trigger: 'blur',
            }
          ],
          qrCode: [
            {
              required: true,
              message: '请输入二维码',
              trigger: 'blur',
            }
          ]
        }
        this.baseRules = { ...this.baseRules, ...rrr }
        this.$nextTick(() => {
          this.$refs.formBase.clearValidate()
        })
      } else {
        const or = Object.assign({}, this.baseRules)
        Reflect.deleteProperty(or, 'nfcCode')
        Reflect.deleteProperty(or, 'qrCode')
        this.$nextTick(() => {
          this.$refs.formBase.clearValidate()
        })
        this.baseRules = { ...or }
      }
    },
    handleAreaChange (e) {
      // get area mapGeoJSON
      detailedAreaInfo({ id: e }).then(res => {
        if (res.success) {
          this.areaGeoData = res.data.areaMap
          this.displayEquipJSON.push({ id: this.detailedInfo.areaId, type: 'area', features: res.data.areaMap })
          this.displayEquipJSON.push({
            id: this.detailedId,
            type: 'line',
            features: this.detailedInfo.equipmentLocation
          })
          console.log('选择的区域', res.data, typeof this.areaGeoData)
        }
      })
    },
    handleEquipTypeChange (val) {
      // if (this.operationType !== 'edit') {
      //   let type = ''
      //   if (val === '输送带') {
      //     type = 'line'
      //   } else {
      //     type = 'point'
      //   }
      //   this.lineInitData.splice(1, 1, {
      //     id: this.tempMakerId,
      //     type,
      //     features: null
      //   })
      //   // this.form.equipmentLocation = [this.areaGeoData[0], {
      //   //   id: this.tempMakerId,
      //   //   type,
      //   //   features: null
      //   // }]
      //   console.log('现在是什么类型', type)
      // }
    },
    // Fetching options
    fetchAreaTreeData () {
      listAreaTree().then(res => {
        if (res.success) {
          this.areaOptions = res.data
        }
      })
    },
    fetchTaxonData () {
      listBaseData({ code: 'equipment_type' }).then(res => {
        if (res.success) {
          this.taxonOptions = res.data
        }
      })
    },
    fetchTypeTreeData () {
      listEquipTypeTree().then(res => {
        if (res.success) {
          this.typeOptions = res.data
        }
      })
    },
    handleRewrite () {
      // redraw device granted when add or add .sub
      if (this.operationType === 'edit') {
        // this.lineInitData = this.form.equipmentLocation
        this.lineInitData = this.displayEquipJSON
      } else {
        const type = this.form.equipmentType === '输送机' ? 'line' : 'point'
        // const area = Array.from(this.areaGeoData)
        const area = [{ id: this.detailedInfo.areaId, type: 'area', features: this.areaGeoData }]
        const obj = JSON.parse(JSON.stringify({
          id: this.tempMakerId,
          type,
          features: null
        }))
        this.lineInitData = [...area, ...[obj]]
      }
      this.form.equipmentLocation = null
      this.refreshPop = true
      this.$nextTick(() => {
        this.showLineEditor = true
      })
    },
    // add
    handleEditMap () {
      if (!this.form.areaId || !this.areaGeoData) {
        this.$msg.error('请选择有效的区域')
        return
      }
      if (!this.form.equipmentType) {
        this.$msg.error('请选择设备类型')
        return;
      }
      const type = this.form.equipmentType === '输送机' ? 'line' : 'point'
      // const area = Array.from(this.areaGeoData)
      const area = [{ id: this.detailedInfo.areaId, type: 'area', features: this.areaGeoData }]
      const obj = [{ id: this.operationType === 'edit' ? this.detailedId : this.tempMakerId, type, features: null }]
      // const obj = JSON.parse(JSON.stringify({
      //   id: this.tempMakerId,
      //   type,
      //   features: null
      // }))
      this.lineInitData = [...area, ...obj]
      // add new logic
      // if (this.operationType === 'add.sub') {
      //   this.lineInitData = [...this.lineInitData, ...this.parentArrayMap]
      // }
      this.refreshPop = true
      this.$nextTick(() => {
        this.showLineEditor = true
      })
    },
    handlePostMapData (data) {
      console.log('设置form中的equipmentLocation', data, typeof data) // string
      console.log('设置好的form', this.form.equipmentLocation)
      const type = this.form.equipmentType === '输送机' ? 'line' : 'point'
      // this.$set(this.form, 'equipmentLocation', [{
      //   id: this.detailedId || this.tempMakerId,
      //   type,
      //   features: data
      // }, this.areaGeoData[0]])
      this.$set(this.form, 'equipmentLocation', data)
      console.log('设置好的form ---cpm', this.form.equipmentLocation)
      // todo 设置display json
      this.displayEquipJSON = [{
        id: this.detailedInfo.areaId,
        type: 'area',
        features: this.areaGeoData
      }, { id: this.detailedId, type, features: data }]
      console.log('displayJson', this.displayEquipJSON)
    },
    handlePostMapClose (keep) {
      if (keep && this.operationType === 'edit') {
        this.copyDetailedData()
      }
      this.showLineEditor = false
      this.refreshPop = false
      this.lineInitData = []
    },
    // ATTRS
    fetchAttrsList (id) {
      detailedEquipTypeInfo({ id }).then(res => {
        if (res.success) {
          const dd = res.data.attributesInfoList || []
          dd.forEach(item => {
            if (item.attrRule) {
              let obj = {}
              try {
                obj = JSON.parse(item.attrRule) || {}
              } catch (e) {}
              item.attrRule = obj
            }
          })
          this.attrOptions = dd
          console.log('this.attrOptions', this.attrOptions)
        }
      })
    },
    handleAttrSelectChange (val, ridx) {
      const item = this.attrOptions.find(item => item.id == val)
      const { attrRule, attrName, attrUnit, id, attrDesc } = item
      this.form.attributesInfoList.splice(ridx, 1, {
        attrId: id,
        attrRule,
        attrName,
        attrUnit,
        attrVal: '',
        attrDesc
      })
    },
    handleAddAttrs () {
      let arr = this.form.attributesInfoList ? this.form.attributesInfoList.splice(0) : []
      let obj = {
        id: '',
        attrRule: { type: 1, rules: [] },
        attrType: '',
        attrUnit: '',
        attrDesc: ''
      }
      arr = [...arr, obj]
      this.form.attributesInfoList = [...arr]
    },
    handleDeleteAttr (index) {
      this.form.attributesInfoList.splice(index, 1)
    },
    // Material
    fetchMaterialList (keyword) {
      if (keyword !== '') {
        listMaterialItems({ materialName: keyword }).then(res => {
          if (res.code === '200') {
            this.materialOptions = res.data.records
          }
        })
      } else {
        this.materialOptions = []
      }
    },
    handleMaChange (ele) {
      console.log('=====change', ele)
    },
    handleSaveEquip () {
      if (this.operationType === 'add.sub') {
        this.form.parentInstanceId = this.detailedId
      }
      // 备品备件
      this.form.equipmentReplacementIds = this.equipmentReplacements.map(item => { return item.id }).join(',')
      this.form.equipmentReplacementNames = this.equipmentReplacements.map(item => { return item.materialName }).join(',')
      const data = JSON.parse(JSON.stringify(this.form))
      delete data.attributesInfoList;
      delete data.equipmentInstanceKindGraphList;
      saveEquip(data).then(res => {
        if (res.success) {
          this.$msg.success('新增成功')
          this.SET_DETAILED_ID(res.data)
          this.$emit('getTree')
          this.setOperationType('edit')
          this.fetchDetailedEquipInfo({ id: res.data })
        } else {
          this.$msg.error('新增失败')
        }
      })
    },
    handleUpdateEquip () {
      console.log(this.$refs.ep)
      // 备品备件
      this.form.equipmentReplacementIds = this.equipmentReplacements.map(item => { return item.id }).join(',')
      this.form.equipmentReplacementNames = this.equipmentReplacements.map(item => { return item.materialName }).join(',')
      console.log('update form', this.form)
      // (typeof this.form.equipmentLocation === 'object') && (this.form.equipmentLocation = JSON.stringify(this.form.equipmentLocation))
      updateEquip(this.form).then(res => {
        if (res.success) {
          this.setEditing(this.activeTabName)
          this.$msg.success('修改成功')
          this.$emit('getTree')
          this.fetchDetailedEquipInfo({ id: this.detailedId })
        } else {
          this.$msg.error('修改失败')
        }
      })
    },
    handleSetEquipInsAttrs () {
      const dd = {
        equipmentId: this.detailedId,
        attrList: this.form.attributesInfoList
      }
      setEquipInsAttrs(dd).then(res => {
        if (res.success) {
          this.$msg.success('设置成功')
          this.setEditing(this.activeTabName)
          this.$emit('getTree')
          this.fetchDetailedEquipInfo({ id: this.detailedId })
        } else {
          this.$msg.error('设置失败')
        }
      })
    },
    handleSaveEquipInsGraphs () {
      const data = {
        equipmentOrKindId: this.detailedId,
        graphList: this.form.equipmentInstanceKindGraphList
      }
      setEquipInsGraphs(data).then(res => {
        if (res.success) {
          this.setEditing(this.activeTabName)
          this.$msg.success('设置成功')
          this.$emit('getTree')
          this.fetchDetailedEquipInfo({ id: this.detailedId })
        } else {
          this.$msg.error('设置失败')
        }
      })
    },
    handlerBeforeLeave (activeName, oldActiveName) {
      if (this.operationType === 'add') {
        this.$msg.warning('请先保存')
        return false
      }
      if (this.operationType === 'edit') {
        // 验证是否有改动
        switch (oldActiveName) {
          case 'base':
            if (
              !tool.checkEqual(this.form, this.detailedInfo, 'equipmentCode') ||
              !tool.checkEqual(this.form, this.detailedInfo, 'equipmentName') ||
              !tool.checkEqual(this.form, this.detailedInfo, 'equipmentKindId') ||
              !tool.checkEqual(this.form, this.detailedInfo, 'areaId') ||
              !tool.checkEqual(this.form, this.detailedInfo, 'equipmentModel')
            ) {
              this.$msg.warning('请先保存')
              return false
            }
            break
          case 'graph':
            let isChange = !this.form.equipmentInstanceKindGraphList.every((obj1, index) => {
                return (obj1.graphUrl == '' && this.detailedInfo.equipmentInstanceKindGraphList === null) || tool.checkEqual(
                  obj1,
                  this.detailedInfo.equipmentInstanceKindGraphList[index],
                  'graphUrl'
                )
              }
            )
            if (isChange) {
              this.$msg.warning('请先保存')
              return false
            }
            break
          case 'attr':
            if (this.form.attributesInfoList == this.detailedInfo.attributesInfoList) {
              return true
            } else if (
              this.form.attributesInfoList &&
              this.detailedInfo.attributesInfoList &&
              this.form.attributesInfoList.length !==
              this.detailedInfo.attributesInfoList.length
            ) {
              this.$msg.warning('请先保存')
              return false
            } else {
              for (let i = 0; i < this.form.attributesInfoList.length; i++) {
                if (
                  !this.form.attributesInfoList ||
                  !this.detailedInfo.attributesInfoList
                ) {
                  this.$msg.warning('请先保存')
                  return false
                }
                let obj1 = this.form.attributesInfoList[i]
                let obj2 = this.detailedInfo.attributesInfoList[i]
                if (!tool.checkEqual(obj1, obj2, 'attrId')) {
                  this.$msg.warning('请先保存')
                  return false
                }
              }
            }
            break
          default:
            break
        }
      }
    },
    checkEqual (obj1, obj2, key) {
      return obj1[key] == obj2[key];
    },
    onSubmit () {
      switch (this.activeTabName) {
        case 'base':
          this.$refs.formBase
            .validate()
            .then(() => {
              // check map
              if (!this.form.isManagePoint && !this.form.equipmentLocation) {
                this.$msg.error("管理点必须设置地图位置")
                return
              }
              const nodes = this.$refs.caRef.getCheckedNodes()
              const nodes2 = this.$refs.kindCa.getCheckedNodes()
              if (nodes && nodes.length) {
                this.form.areaName = nodes[0].label
              }
              if (nodes2 && nodes2.length) {
                this.form.equipmentKindName = nodes2[0].label
              }
              if (this.operationType === 'add.sub' || this.operationType === 'add') {
                this.handleSaveEquip()
              } else if (this.operationType === 'edit') {
                this.handleUpdateEquip()
              }
            })
            .catch((e) => {
              console.log(e)
              this.$msg({
                type: 'error',
                message: '必填项请填写完整',
              })
            })
          break
        case 'graph':
          this.$refs.formGraph
            .validate()
            .then(() => {
              this.handleSaveEquipInsGraphs()
            })
            .catch(() => {
              this.$msg({
                type: 'error',
                message: '必填项请填写完整',
              })
            })
          break
        case 'attr':
          this.$refs.formParam
            .validate()
            .then(() => {
              this.handleSetEquipInsAttrs()
            })
            .catch(() => {
              this.$msg({
                type: 'error',
                message: '必填项请填写完整',
              })
            })
          break
        default:
          break
      }
    },
    cancel () {
      this.setIsComponent('equipPosDetail')
      this.setEditing('')
      // this.$nextTick(() => {
      //   this.$refs.equip.describeGepJson()
      // })
      this.fetchDetailedEquipInfo({ id: this.detailedId })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/module/inspect/css/btDetail.scss';
</style>
