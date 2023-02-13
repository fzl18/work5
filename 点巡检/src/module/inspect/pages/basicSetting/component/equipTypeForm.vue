<template>
  <div class="app-container">
    <bt-page :title="title">
      <template slot="sections">
        <bt-section :show-drawer="false">
          <template slot="options">
            <!-- Add attrs -->
            <bt-button
              v-if="activeTabName === 'attr'"
              type="primary"
              @click="handleAddAttrs"
            >
              新增
            </bt-button>
            <bt-button
              v-if="activeTabName === 'structure'"
              type="primary"
              @click="handleAddStructs"
            >
              新增
            </bt-button>
          </template>
          <el-tabs v-model="activeTabName" :before-leave="handlerBeforeLeave">
            <el-tab-pane label="基本信息" name="base">
              <el-form
                ref="formBase"
                :label-position="'top'"
                :model="form"
                :rules="baseRules"
                label-width="80px"
              >
                <el-row>
                  <el-col :span="10">
                    <el-form-item label="分类编码" prop="kindCode">
                      <el-input
                        v-model="form.kindCode"
                        placeholder="请输入分类编码"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="10">
                    <el-form-item label="分类名称" prop="kindName">
                      <el-input
                        v-model="form.kindName"
                        placeholder="请输入分类名称"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <!--                <el-row-->
                <!--                  v-if="-->
                <!--                    (operationType == 'add' && treeNodeSelectedId) ||-->
                <!--                      (operationType == 'edit' && form.parentKind)-->
                <!--                  "-->
                <!--                >-->
                <!--                  <el-col :span="10">-->
                <!--                    <el-form-item label="上级分类" prop="parentKind">-->
                <!--                      <el-cascader-->
                <!--                        v-model="form.parentKind"-->
                <!--                        placeholder="请选择上级分类"-->
                <!--                        :props="propData"-->
                <!--                        :options="options"-->
                <!--                        :show-all-levels="true"-->
                <!--                        style="width: 100%"-->
                <!--                      />-->
                <!--                    </el-form-item>-->
                <!--                  </el-col>-->
                <!--                </el-row>-->
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="属性管理" name="attr">
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
                  <el-table-column prop="id" label="属性">
                    <template #default="scope">
                      <el-form-item
                        :prop="`attributesInfoList.${scope.$index}.id`"
                        :rules="paramRules.id"
                      >
                        <el-select
                          v-model="scope.row.id"
                          clearable
                          filterable
                          remote
                          :remote-method="fetchAttrsList"
                          placeholder="请选择属性"
                          style="width: 100%"
                        >
                          <el-option
                            v-for="attr in attrOptions"
                            :key="attr.id"
                            :label="attr.attrName"
                            :value="attr.id"
                          >
                            <span style="float: left">{{ attr.attrName }}</span>
                            <span style="float: right">
                              {{ attr.attrDesc }}
                            </span>
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </template>
                  </el-table-column>
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
            <el-tab-pane label="组装结构" name="structure">
              <el-form ref="formStructure" :model="form">
                <el-table
                  v-if="activeTabName==='structure'"
                  :key="new Date().getTime()"
                  :data="form.equipmentKindStructureRelationList"
                  :header-cell-style="{ textAlign: 'center' }"
                  :cell-style="{ textAlign: 'center' }"
                  stripe
                  default-expand-all
                  fit
                  :row-key="operationType==='add'?'key':'id'"
                  highlight-current-row
                  style="width: 100%"
                  :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                  class="btTable tree-rows"
                >
                  <el-table-column type="index" label="序号" />
                  <el-table-column prop="structureId" label="部件分类">
                    <template #default="scope">
                      <!--                      :prop="`equipmentKindStructureRelationList.${scope.$index}.id`"-->
                      <el-form-item
                        :rules="structureRules.structureId"
                      >
                        <!--                        <el-input v-model="scope.row.id" />-->
                        <el-cascader
                          v-model="scope.row.structureId"
                          placeholder="请选择部件分类"
                          :props="propStructureData"
                          :options="structOptions"
                          :show-all-levels="true"
                          style="width: 100%"
                        />
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column fixed="right" width="200px" label="操作">
                    <template #default="{row, $index }">
                      <bt-dropdown :show-split="false">
                        <bt-dropdown-menu>
                          <bt-dropdown-item
                            @click.native="handleAddSubStructs(row)"
                          >
                            <i class="el-icon-delete" />
                            添加子结构
                          </bt-dropdown-item>
                          <bt-dropdown-item
                            @click.native="handleDeleteStruct($index)"
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
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
// import Api from '@/module/onlineMonitoring/api/typeManage'
import picSingleUpload from '@/module/inspect/components/picSingleUpload.vue'
import tool from '@/utils/tools'
import {
  listAttrsList,
  saveEquipType,
  setEquipAttrs,
  setEquipTypeGraphs,
  setEquipTypeStructs,
  updateEquipType
} from '@/module/inspect/api/basicSetting/equipType';

const { mapState, mapActions, mapMutations, mapGetters } = createNamespacedHelpers('inspectBasicSettingEquipType')
const TMAP = {
  // 'add': '新增区域',
  'add.sub': '新增子设备分类',
  'edit': '编辑设备分类'
}
const sortsMap = ['小', '中', '大', '3D']
export default {
  name: 'EquipTypeForm',
  components: {
    picSingleUpload,
  },
  data () {
    return {
      // Api,
      title: '',
      activeTabName: 'base',
      baseRules: {
        kindCode: [
          {
            required: true,
            message: '请输入分类编码',
            trigger: 'blur',
          },
        ],
        kindName: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur',
          },
        ],
        parentKind: [
          {
            required: true,
            message: '请选择上级分类',
            trigger: 'change',
          },
        ],
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
      structureRules: {
        structureId: [
          {
            required: true,
            message: '请选择部件',
            trigger: 'change',
          },
        ],
      },
      form: {
        id: '',
        kindCode: '',
        kindName: '',
        equipmentInstanceKindGraphList: [
          {
            graphUrl: '',
            graphName: '',
            graphType: '小',
          },
          {
            graphUrl: '',
            graphName: '',
            graphType: '中',
          },
          {
            graphUrl: '',
            graphName: '',
            graphType: '大',
          },
          {
            graphUrl: '',
            graphName: '',
            graphType: '3D',
          },
        ],
        attributesInfoList: [], // attrs
        equipmentKindStructureRelationList: [], // structs
      },
      propData: {
        label: 'kindName',
        value: 'id',
        children: 'children',
        emitPath: false,
        checkStrictly: true,
      },
      options: [],
      propStructureData: {
        label: 'kindName',
        value: 'id',
        children: 'children',
        emitPath: false,
        // checkStrictly: true,
      },
      structureOptions: [],
      attrOptions: [],
      isDeleted: null,
      row: 0
    }
  },
  computed: {
    ...mapState({
      operationType: 'operationType',
      treeWhole: 'treeWhole',
      detailedInfo: 'detailedInfo',
      detailedId: 'detailedId',
      treeNodeSelected: 'treeNodeSelected',
      editing: 'editing',
      treeData: 'treeData'
    }),
    structOptions: function () {
      return this.treeData
    }
  },
  watch: {
    // treeWhole: {
    //   handler: function (val) {
    //     this.options = val
    //   },
    //   immediate: true,
    // },
    operationType: {
      handler: function (val) {
        this.title = TMAP[val] || ''
      },
      immediate: true,
    },
    detailedInfo () {
      if (this.detailedId && this.operationType === 'edit') {
        this.copyDetailedData()
      }
    }
  },
  mounted () {
    // this.getStructureOptions()
    if (this.detailedId && this.operationType === 'edit') {
      // this.$nextTick(() => {
      this.copyDetailedData()
      // })
    }
    this.fetchAttrsList('')
  },
  methods: {
    ...mapMutations(['setIsComponent', 'setEditing', 'setOperationType', 'setTreeNodeSelected', 'SET_DETAILED_ID']),
    ...mapActions(['fetchDetailedEquipTypeInfo']),
    copyDetailedData () {
      const sourceData = JSON.parse(JSON.stringify(this.detailedInfo))
      let {
        equipmentInstanceKindGraphList,
        attributesInfoList,
        equipmentKindStructureRelationList
      } = sourceData
      this.form = {
        ...this.form, ...sourceData,
        attributesInfoList: attributesInfoList || [],
        equipmentKindStructureRelationList: equipmentKindStructureRelationList || [],
        //   [
        //   { key: '6666', id: '6666', children: [{ key: '6666-1', id: '6666-1' }, { key: '6666-2', id: '6666-2' }] },
        //   { key: '7777', id: '7777', children: [] }
        // ],
        equipmentInstanceKindGraphList: equipmentInstanceKindGraphList || [
          { graphUrl: '', graphType: '小', graphName: '' },
          { graphUrl: '', graphType: '中', graphName: '' },
          { graphUrl: '', graphType: '大', graphName: '' },
          { graphUrl: '', graphType: '3D', graphName: '' },
        ]
      }
    },
    fetchAttrsList (name) {
      listAttrsList({ data: {}, params: { name } }).then(res => {
        if (res.success) {
          this.attrOptions = res.data
        }
      })
    },
    handleAddAttrs () {
      let arr = this.form.attributesInfoList ? this.form.attributesInfoList.splice(0) : []
      let obj = {
        id: ''
      }
      arr = [...arr, obj]
      this.form.attributesInfoList = [...arr]
    },
    handleDeleteAttr (index) {
      this.form.attributesInfoList.splice(index, 1)
    },
    handleAddStructs () {
      let arr = this.form.equipmentKindStructureRelationList ? this.form.equipmentKindStructureRelationList.splice(0) : []
      let obj = {
        id: Math.random(),
        key: Math.random(),
        children: null
      }
      arr = [...arr, obj]
      this.form.equipmentKindStructureRelationList = [...arr]
    },
    handleAddSubStructs (row) {
      // const pRow = Object.assign({}, this.form.equipmentKindStructureRelationList[index])
      let rows = this.form.equipmentKindStructureRelationList
      let obj = {
        id: Math.random(), key: Math.random()
      }
      if (row.children) {
        this.$nextTick(() => {
          row.children.push(obj)
        })
      } else {
        this.$nextTick(() => {
          row.children = []
          row.children.push(obj)
        })
      }
      this.$set(this.form, 'equipmentKindStructureRelationList', rows.splice(0))
    },
    cycleDeleteNode (tableData, rmIndex) {
      for (let index = 0; !this.isDeleted && index < tableData.length; index++) {
        if (this.row == rmIndex) {
          //删除行
          tableData.splice(index, 1);
          this.isDeleted = true;
        }
        if (!this.isDeleted) {
          let childTable = tableData[index];
          this.row++;
          if (childTable.children !== undefined && childTable.children && childTable.children.length > 0) {
            this.cycleDeleteNode(childTable.children, rmIndex);
          }
        }
      }
    },
    handleDeleteStruct (index) {
      // this.form.equipmentKindStructureRelationList.splice(index, 1)
      this.isDeleted = false;
      this.row = 0;
      this.cycleDeleteNode(this.form.equipmentKindStructureRelationList, index);
    },
    handleSaveAttrs () {
      const ids = this.form.attributesInfoList.map(item => item.id)
      const dd = {
        equipmentKindId: this.detailedId,
        attrIdList: ids
      }
      setEquipAttrs(dd).then(res => {
        if (res.success) {
          this.$msg.success('设置成功')
          this.setEditing(this.activeTabName)
          this.$emit('getTree')
          this.fetchDetailedEquipTypeInfo({ id: this.detailedId })
        } else {
          this.$msg.error('设置失败')
        }
      })
    },
    handleSaveEquipType () {
      if (this.operationType === 'add.sub') {
        this.form.parentKindId = this.detailedId
      }
      const { kindCode, kindName, parentKindId } = this.form
      saveEquipType({ kindCode, kindName, parentKindId }).then(res => {
        if (res.success) {
          this.$msg.success('新增成功')
          this.SET_DETAILED_ID(res.data)
          this.setOperationType('edit')
          this.$emit('getTree')
          this.fetchDetailedEquipTypeInfo({ id: res.data })
        } else {
          this.$msg.error('新增失败')
        }
      })
    },
    handleUpdateEquipType () {
      const { id, kindCode, kindName, parentKindId } = this.form
      updateEquipType({ id, kindCode, kindName, parentKindId }).then(res => {
        if (res.success) {
          this.$msg.success('编辑成功')
          this.setEditing(this.activeTabName)
          this.$emit('getTree')
          this.fetchDetailedEquipTypeInfo({ id: this.detailedId })
        } else {
          this.$msg.error('编辑失败')
        }
      })
    },
    handleSaveEquipTypeGraphs () {
      const data = {
        equipmentOrKindId: this.detailedId,
        graphList: this.form.equipmentInstanceKindGraphList
      }
      setEquipTypeGraphs(data).then(res => {
        if (res.success) {
          this.setEditing(this.activeTabName)
          this.$msg.success('设置成功')
          this.$emit('getTree')
          this.fetchDetailedEquipTypeInfo({ id: this.detailedId })
        } else {
          this.$msg.error('设置失败')
        }
      })
    },
    handleSaveEquipTypeStructs () {
      const data = {
        equipmentKindId: this.detailedId,
        structureList: this.form.equipmentKindStructureRelationList
      }
      setEquipTypeStructs(data).then(res => {
        if (res.success) {
          this.setEditing(this.activeTabName)
          this.$msg.success('设置成功')
          this.$emit('getTree')
          this.fetchDetailedEquipTypeInfo({ id: this.detailedId })
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
              !tool.checkEqual(this.form, this.detailedInfo, 'kindCode') ||
              !tool.checkEqual(this.form, this.detailedInfo, 'kindName') ||
              !tool.checkEqual(this.form, this.detailedInfo, 'parentKindId')
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
          case 'structure':
            if (
              this.form.equipmentKindStructureRelationList == this.detailedInfo.equipmentKindStructureRelationList) {
              return true
            } else if (
              this.form.equipmentKindStructureRelationList &&
              this.detailedInfo.equipmentKindStructureRelationList &&
              this.form.equipmentKindStructureRelationList.length != this.detailedInfo.equipmentKindStructureRelationList.length
            ) {
              this.$msg.warning('请先保存')
              return false
            } else {
              for (let i = 0; i < this.form.equipmentKindStructureRelationList.length; i++) {
                if (
                  !this.form.equipmentKindStructureRelationList ||
                  !this.detailedInfo.equipmentKindStructureRelationList
                ) {
                  this.$msg.warning('请先保存')
                  return false
                }
                let obj1 = this.form.equipmentKindStructureRelationList[i]
                let obj2 = this.detailedInfo.equipmentKindStructureRelationList[i]
                if (!tool.checkEqual(obj1, obj2, 'deviceId')) {
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
            if (this.operationType.indexOf('add') > -1) {
              this.handleSaveEquipType()
            } else if (this.operationType === 'edit') {
              this.handleUpdateEquipType()
            }
          })
          .catch(() => {
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
            this.handleSaveEquipTypeGraphs()
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
            this.handleSaveAttrs()
          })
          .catch(() => {
            this.$msg({
              type: 'error',
              message: '必填项请填写完整',
            })
          })
          break
        case 'structure':
          this.$refs.formStructure
          .validate()
          .then(() => {
            this.handleSaveEquipTypeStructs()
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
      this.setIsComponent('equipTypeDetail')
      this.setEditing('')
      this.detailedId && this.fetchDetailedEquipTypeInfo({ id: this.detailedId })
    }
  },
}
</script>

<style lang="scss" scoped>
  @import '@/module/inspect/css/btDetail.scss';
</style>
