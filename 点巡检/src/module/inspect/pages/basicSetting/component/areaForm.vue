<template>
  <div class="app-container">
    <bt-page :title="title">
      <template slot="sections">
        <bt-section :show-drawer="false">
          <template slot="options">
            <bt-button
              v-if="activeTabName === 'group'"
              type="primary"
              @click="handleAddOrSaveG({})"
            >
              新增
            </bt-button>
          </template>
          <el-tabs v-model="activeTabName" :before-leave="handlerBeforeLeave">
            <el-tab-pane label="基本信息" name="base">
              <div class="tab-item">
                <div class="flex-item fixed-400">
                  <bt-section :show-drawer="false">
                    <div class="section">
                      <bt-title title="基础信息" />
                      <el-form
                        ref="formBase"
                        :label-position="'top'"
                        :model="form"
                        :rules="baseRules"
                        label-width="80px"
                      >
                        <el-row :gutter="16">
                          <el-col :span="12">
                            <el-form-item label="区域名称" prop="areaName">
                              <el-input
                                v-model="form.areaName"
                                placeholder="请输入区域名称"
                              />
                            </el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item label="区域编码" prop="areaCode">
                              <el-input
                                v-model="form.areaCode"
                                placeholder="请输入区域编码"
                              />
                            </el-form-item>
                          </el-col>
                        </el-row>
                        <el-row :gutter="16">
                          <el-col :span="24">
                            <el-form-item label="地址" prop="areaPlace">
                              <el-input
                                v-model="form.areaPlace"
                                placeholder="请输入地址"
                              />
                            </el-form-item>
                          </el-col>
                        </el-row>
                        <el-row :gutter="16">
                          <el-col :span="12">
                            <el-form-item label="所属组织机构" prop="organizationId">
                              <el-cascader
                                v-model="form.organizationId"
                                :props="customProps"
                                placeholder="请选择机构"
                                :options="allUnits"
                              />
                            </el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item label="区域经理" prop="areaManagerId">
                              <el-select
                                v-model="form.areaManagerId"
                                remote
                                filterable
                                value-key="userCode"
                                :remote-method="filterManagerId"
                                placeholder="请选择区域经理"
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
                          <el-col :span="12">
                            <el-form-item label="区域作业长" prop="areaForemanId">
                              <el-select
                                v-model="form.areaForemanId"
                                remote
                                filterable
                                value-key="userCode"
                                :remote-method="filterForemanId"
                                placeholder="请选择区域作业长"
                              >
                                <el-option
                                  v-for="item in foremanOptions" :key="item.userCode" :label="item.userName"
                                  :value="item.userCode"
                                />
                              </el-select>
                            </el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item label="关联仓库" prop="storehouseId">
                              <el-select
                                v-model="form.storehouseId"
                                placeholder="请选择关联仓库"
                              >
                                <el-option
                                  v-for="item in storeOptions" :key="item.id" :label="item.storeName"
                                  :value="item.id"
                                />
                              </el-select>
                            </el-form-item>
                          </el-col>
                        </el-row>
                        <el-row :gutter="16">
                          <el-col :span="12">
                            <el-form-item label="点检员" prop="areaPartyaInspector">
                              <el-input
                                v-model="form.areaPartyaInspector"
                                placeholder="请输入点检员"
                              />
                            </el-form-item>
                          </el-col>
                        </el-row>
                      </el-form>
                    </div>
                  </bt-section>
                </div>
                <div class="flex-item">
                  <bt-section :show-drawer="false">
                    <bt-title title="区域布局" />
                    <div class="area-map">
                      <bt-map
                        v-if="activeTabName==='base'&&form.areaMap" :datas="displayAreaJSON"
                        :symbol="`${operationType==='edit'?detailedId:tempMakerId}`"
                        :tool-show="false"
                        height="500px"
                      />
                      <el-button class="btn_area__reset" type="primary" @click="handleRewrite">
                        编辑区域
                      </el-button>
                      <div v-show="!form.areaMap" class="area__empty">
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
            <!--            <el-tab-pane label="关联设备" name="device">-->
            <!--              <div class="tab-item">-->
            <!--                <div class="flex-item">-->
            <!--                  <bt-section :show-drawer="false">-->
            <!--                    <bt-title title="设备列表" />-->
            <!--                    <el-table-->
            <!--                      :data="detailedInfo.equipmentList||[]"-->
            <!--                      :header-cell-style="{ textAlign: 'center' }"-->
            <!--                      :cell-style="{ textAlign: 'center' }"-->
            <!--                      stripe-->
            <!--                      fit-->
            <!--                      highlight-current-row-->
            <!--                      style="width: 100%"-->
            <!--                    >-->
            <!--                      <el-table-column type="index" label="序号" />-->
            <!--                      <el-table-column-->
            <!--                        prop="equipmentType"-->
            <!--                        label="设备类型"-->
            <!--                      />-->
            <!--                      <el-table-column-->
            <!--                        prop="equipmentCode"-->
            <!--                        label="设备编号"-->
            <!--                      />-->
            <!--                      <el-table-column-->
            <!--                        prop="equipmentKindName"-->
            <!--                        label="设备名称"-->
            <!--                      />-->
            <!--                      &lt;!&ndash;                      <el-table-column&ndash;&gt;-->
            <!--                      &lt;!&ndash;                        prop="attrDesc"&ndash;&gt;-->
            <!--                      &lt;!&ndash;                        label="操作"&ndash;&gt;-->
            <!--                      &lt;!&ndash;                      >&ndash;&gt;-->
            <!--                      &lt;!&ndash;                        <template slot-scope="scope">&ndash;&gt;-->
            <!--                      &lt;!&ndash;                          <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>&ndash;&gt;-->
            <!--                      &lt;!&ndash;                          <el-button type="text" size="small">布局</el-button>&ndash;&gt;-->
            <!--                      &lt;!&ndash;                        </template>&ndash;&gt;-->
            <!--                      &lt;!&ndash;                      </el-table-column>&ndash;&gt;-->
            <!--                    </el-table>-->
            <!--                  </bt-section>-->
            <!--                </div>-->
            <!--                <div class="flex-item">-->
            <!--                  <bt-section :show-drawer="false">-->
            <!--                    <bt-title title="设备布局" />-->
            <!--                    <div class="area-map">-->
            <!--                      <bt-map v-if="activeTabName==='device'&&detailedInfo.areaMap" height="400px" />-->
            <!--                      <div v-show="!detailedInfo.areaMap" class="area__empty">-->
            <!--                        <el-button type="primary">-->
            <!--                          <img src="@/assets/images/inspect/map_icon.png" alt>设置地图-->
            <!--                        </el-button>-->
            <!--                        <img src="@/assets/images/inspect/map_bg.png" alt="MAP">-->
            <!--                      </div>-->
            <!--                    </div>-->
            <!--                  </bt-section>-->
            <!--                </div>-->
            <!--              </div>-->
            <!--            </el-tab-pane>-->
            <el-tab-pane label="关联班组" name="group">
              <div class="tab-item">
                <bt-section :show-drawer="false">
                  <bt-title title="班组列表" />
                  <el-table
                    :data="detailedInfo.teamList||[]"
                    :header-cell-style="{ textAlign: 'center' }"
                    :cell-style="{ textAlign: 'center' }"
                    stripe
                    fit
                    highlight-current-row
                    style="width: 100%"
                  >
                    <el-table-column type="index" label="序号" />
                    <el-table-column
                      prop="teamName"
                      label="班组名称"
                    />
                    <el-table-column
                      prop="teamLeader"
                      label="班组长"
                    />
                    <el-table-column
                      prop="teamMember"
                      label="班组成员"
                    />
                    <el-table-column
                      prop="attrDesc"
                      label="操作"
                    >
                      <template slot-scope="scope">
                        <el-button type="text" size="small" @click="handleAddOrSaveG(scope.row)">编辑</el-button>
                        <el-button type="text" size="small" @click="handleDeleteGroup(scope.row.id)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </bt-section>
              </div>
            </el-tab-pane>
          </el-tabs>
        </bt-section>
      </template>
      <template slot="sections">
        <el-button style="float: right; margin-left: 10px" @click="cancel">
          取消
        </el-button>
        <el-button v-if="activeTabName!=='group'" type="primary" style="float: right" @click="onSubmit">
          保存
        </el-button>
      </template>
    </bt-page>
    <group-pop-form ref="groupForm" :is-show="showGroupPnl" @close="showGroupPnl=false" />
    <area-pop
      v-if="(typeof form.areaMap) === 'object'"
      ref="areaPop" :symbol="`${operationType==='edit'?detailedId:tempMakerId}`" :dd="areaInitData||[]"
      :is-show="showAreaEditor"
      @postdata="handlePostMapData"
      @close="handlePostMapClose"
    />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import tool from '@/utils/tools'
import BtMap from '@/module/inspect/pages/map'
import AreaPop from '@/module/inspect/pages/basicSetting/component/AreaPop';
import GroupPopForm from '@/module/inspect/pages/basicSetting/component/groupPopForm';
import { deleteGroupByAreaId, listStoreByFilters, saveArea, updateArea } from '@/module/inspect/api/basicSetting/area';

const { mapState, mapActions, mapMutations, mapGetters } = createNamespacedHelpers('inspectBasicSettingArea')
const { mapState: mapState1 } = createNamespacedHelpers('coreCommon')
const TMAP = {
  'add': '新增区域',
  'add.sub': '新增子区域',
  'edit': '编辑区域'
}

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

export default {
  name: 'AreaForm',
  components: {
    GroupPopForm,
    BtMap,
    AreaPop
    // picSingleUpload,
  },
  data () {
    return {
      // Api,
      showGroupPnl: false,
      showAreaEditor: false,
      tempMakerId: '',
      areaInitData: [
        {
          id: this.detailedId,
          type: 'area',
          features: null
        }
      ],
      title: '',
      activeTabName: 'base',
      customProps: {
        label: 'unitName',
        value: 'id',
        children: 'children',
        emitPath: false,
        checkStrictly: true
      },
      storeOptions: [],
      managerOptions: [],
      foremanOptions: [],
      baseRules: {
        areaName: [
          {
            required: true,
            message: '请输入区域名称',
            trigger: 'blur',
          }
        ],
        areaCode: [
          {
            required: true,
            message: '请输入区域编码',
            trigger: 'blur',
          }
        ],
        organizationId: [
          {
            required: true,
            message: '请选择所属机构组织',
            trigger: 'blur',
          }
        ],
        areaManagerId: [
          {
            required: true,
            message: '请选择区域经理',
            trigger: 'blur',
          }
        ],
        areaForemanId: [
          {
            required: true,
            message: '请选择区域作业长',
            trigger: 'blur',
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
        id: [
          {
            required: true,
            message: '请选择属性',
            trigger: 'change',
          },
        ],
      },
      form: {
        id: '',
        areaMap: null,
        parentAreaId: ''
      },
      options: [],
      attrOptions: [],
    }
  },
  computed: {
    ...mapState({
      operationType: 'operationType',
      treeWhole: 'treeWhole',
      detailedId: 'detailedId',
      detailedInfo: 'detailedInfo',
      treeNodeSelected: 'treeNodeSelected',
      editing: 'editing'
    }),
    ...mapState1({ allUnits: 'allUnits', allUser: 'allUser' }),
    displayAreaJSON () {
      return [{
        id: this.operationType === 'edit' ? this.detailedId : this.tempMakerId,
        type: 'area',
        features: this.form.areaMap
      }]
    }
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
    detailedInfo (val, oldval) {
      if (this.detailedId && this.operationType === 'edit') {
        this.copyDetailedData()
      }
    }    // treeNodeSelected: {
  },
  created () {
    this.tempMakerId = this.uuid('area')
  },
  mounted () {
    this.filterManagerId('')
    this.filterForemanId('')
    if (this.detailedId && this.operationType === 'edit') {
      this.copyDetailedData()
    }
    this.listStoresByFilters()
  },
  methods: {
    ...mapMutations(['setIsComponent', 'setEditing', 'setOperationType', 'setTreeNodeSelected', 'SET_DETAILED_ID']),
    ...mapActions(['fetchDetailedAreaInfo']),
    uuid,
    copyDetailedData () {
      const sourceData = JSON.parse(JSON.stringify(this.detailedInfo))
      this.form = { ...this.form, ...sourceData }
    },
    /* sim filter data */
    filterManagerId (keyword) {
      if (keyword !== '') {
        // get id
        const aa = this.allUser.filter(item => item.userName.includes(keyword))
        this.managerOptions = aa
      } else {
        this.managerOptions = this.allUser
      }
    },
    filterForemanId (keyword) {
      if (keyword !== '') {
        // get id
        const aa = this.allUser.filter(item => item.userName.includes(keyword))
        this.foremanOptions = aa
      } else {
        this.foremanOptions = this.allUser
      }
    },
    handleAddOrSaveG ({ id = '', teamName, teamLeader, teamLeaderId, teamMember }) {
      this.showGroupPnl = true
      if (id) {
        this.$nextTick(() => {
          this.$refs.groupForm.initFormData({ id, teamName, teamLeaderId, teamLeader, teamMember })
        })
      }
    },
    handleEditMap () {
      this.areaInitData = [{
        id: this.operationType === 'edit' ? this.detailedId : this.tempMakerId,
        type: 'area',
        features: null
      }]
      this.showAreaEditor = true
    },
    handleRewrite () {
      console.log(this.form.areaMap, '编辑前')
      this.areaInitData = [{
        id: this.operationType === 'edit' ? this.detailedId : this.tempMakerId,
        type: 'area',
        features: this.form.areaMap
      }]
      this.form.areaMap = null
      this.showAreaEditor = true
    },
    handlePostMapData (data) {
      console.log('设置form中的areaMap', data, typeof data)
      this.$set(this.form, 'areaMap', data)
    },
    handlePostMapClose (keep) {
      if (keep) {
        console.log('keep,data', keep)
        this.copyDetailedData()
      }
      this.showAreaEditor = false
    },
    listStoresByFilters () {
      listStoreByFilters().then(res => {
        this.storeOptions = res.data || []
      })
    },
    handleDeleteGroup (id) {
      deleteGroupByAreaId({ areaId: this.detailedId, teamId: id }).then(res => {
        if (res.success) {
          this.$msg.success('删除成功')
          this.fetchDetailedAreaInfo({ id: this.detailedId })
          this.setEditing(this.activeTabName)
        } else {
          this.$msg.error('删除失败')
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
              !tool.checkEqual(this.form, this.detailedInfo, 'areaCode') ||
              !tool.checkEqual(this.form, this.detailedInfo, 'areaName') ||
              !tool.checkEqual(this.form, this.detailedInfo, 'areaPlace') ||
              !tool.checkEqual(this.form, this.detailedInfo, 'organizationId') ||
              !tool.checkEqual(this.form, this.detailedInfo, 'areaManagerId') ||
              !tool.checkEqual(this.form, this.detailedInfo, 'areaForemanId') ||
              !tool.checkEqual(this.form, this.detailedInfo, 'storehouseId') ||
              !tool.checkEqual(this.form, this.detailedInfo, 'areaPartyaInspector')
            ) {
              this.$msg.warning('请先保存')
              return false
            }
            break
          case 'device':
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
              if (this.operationType === 'add' || this.operationType === 'add.sub') {
                this.form.parentAreaId = this.operationType === 'add.sub' ? (this.detailedId || '') : '';
                // (typeof this.form.areaMap === 'object') && (this.form.areaMap = JSON.stringify(this.form.areaMap))
                saveArea(this.form).then(res => {
                  if (res.success) {
                    this.$msg.success('添加成功')
                    this.SET_DETAILED_ID(res.data)
                    this.fetchDetailedAreaInfo({ id: res.data })
                    this.setEditing(this.activeTabName)
                    this.setOperationType('edit')
                    // this.setTreeNodeSelected(res.data)
                    this.$emit('getTree')
                  } else {
                    this.$msg.error('添加失败')
                  }
                })
              } else if (this.operationType === 'edit') {
                // (typeof this.form.areaMap === 'object') && (this.form.areaMap = JSON.stringify(this.form.areaMap))
                updateArea(this.form).then(res => {
                  if (res.success) {
                    this.$msg.success('编辑成功')
                    this.fetchDetailedAreaInfo({ id: this.detailedId })
                    this.setEditing(this.activeTabName)
                    // this.setTreeNodeSelected(res.data)
                    this.$emit('getTree')
                  } else {
                    this.$msg.error('编辑失败')
                  }
                })
              }
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
      this.setIsComponent('areaDetail')
      this.setEditing('')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/module/inspect/css/btDetail.scss';
</style>
