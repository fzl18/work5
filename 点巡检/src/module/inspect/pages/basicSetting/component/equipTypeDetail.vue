<template>
  <div class="app-container">
    <bt-page title="设备分类">
      <template slot="option">
        <bt-dropdown :show-arrow="true">
          {{ $translateTitle('操作') }}
          <bt-dropdown-menu>
            <bt-dropdown-item v-show="hasPermission('DXJ-JCSZ-SBLB-add')" v-if="detailedId===''" @click.native="operate('add')">
              新增分类
            </bt-dropdown-item>
            <bt-dropdown-item
              v-show="hasPermission('DXJ-JCSZ-SBLB-edit')" v-if="detailedId"
              @click.native="operate('edit')"
            >
              编辑分类
            </bt-dropdown-item>
            <bt-dropdown-item v-show="hasPermission('DXJ-JCSZ-SBLB-add')" v-if="detailedId" @click.native="operate('add.sub')">
              新增子分类
            </bt-dropdown-item>
            <bt-dropdown-item
              v-show="hasPermission('DXJ-JCSZ-SBLB-delete')" v-if="detailedId &&!(treeNodeSelected.children && treeNodeSelected.children.length > 0)"
              @click.native="handleDelete()"
            >
              删除分类
            </bt-dropdown-item>
          </bt-dropdown-menu>
        </bt-dropdown>
      </template>
      <template v-if="detailedId" slot="sections">
        <bt-section :show-drawer="false">
          <el-tabs v-model="activeTabName">
            <el-tab-pane label="基本信息" name="base">
              <div class="tab-item">
                <div class="flex-item">
                  <el-row :gutter="50">
                    <el-col :span="6">
                      <label>分类编码</label>
                      <div class="value">
                        {{ detailedInfo.kindCode }}
                      </div>
                    </el-col>
                    <el-col :span="6">
                      <label>分类名称</label>
                      <div class="value">
                        {{ detailedInfo.kindName }}
                      </div>
                    </el-col>
                    <el-col :span="6">
                      <label>上级分类</label>
                      <div class="value">
                        {{ detailedInfo.parentKindName || '无' }}
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="属性管理" name="attr">
              <el-table
                v-if="activeTabName==='attr'"
                :data="detailedInfo.attributesInfoList"
                :header-cell-style="{ textAlign: 'center' }"
                :cell-style="{ textAlign: 'center' }"
                stripe
                fit
                highlight-current-row
                style="width: 100%"
              >
                <el-table-column type="index" label="序号" />
                <el-table-column
                  prop="attrName"
                  label="属性名称"
                />
                <el-table-column
                  prop="attrType"
                  label="属性类型"
                />
                <el-table-column
                  prop="attrUnit"
                  label="属性单位"
                />
                <!-- <el-table-column
                  prop="attrVal"
                  label="属性域"
                ></el-table-column> -->
                <el-table-column
                  prop="attrDesc"
                  label="属性描述"
                />
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="图形" name="graph">
              <!--              <div class="tab-item">-->
              <el-row>
                <el-col :span="24">
                  <label>图形</label>
                </el-col>
                <el-col
                  v-for="(item, index) of detailedInfo.equipmentInstanceKindGraphList"
                  :key="index"
                  :span="6"
                >
                  <label>{{ item.graphType }}</label>
                  <pic-single-upload
                    v-model="item.graphUrl"
                    :file-type="item.graphType == '3D' ? '3D' : 'image'"
                    class="pic"
                    view
                  />
                </el-col>
              </el-row>
              <!--              </div>-->
            </el-tab-pane>
            <el-tab-pane label="组装结构" name="structure">
              <el-table
                v-if="activeTabName==='structure'"
                :data="detailedInfo.equipmentKindStructureRelationList || []"
                :header-cell-style="{ textAlign: 'center' }"
                :cell-style="{ textAlign: 'center' }"
                row-key="id"
                default-expand-all
                stripe
                fit
                highlight-current-row
                style="width: 100%"
              >
                <el-table-column type="index" align="center" label="序号" />
                <el-table-column
                  prop="structureName"
                  header-align="left"
                  label="部件分类名称"
                />
                <el-table-column
                  prop="structureCode"
                  label="部件分类编码"
                />
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="工作标准" name="standards">
              <el-table
                v-if="activeTabName==='standards'"
                :data="detailedInfo.emPollingStandardList||[]"
                :header-cell-style="{ textAlign: 'center' }"
                :cell-style="{ textAlign: 'center' }"
                row-key="id"
                default-expand-all
                stripe
                fit
                highlight-current-row
                style="width: 100%"
              >
                <el-table-column type="index" align="center" label="序号" />
                <el-table-column
                  prop="version"
                  header-align="left"
                  label="版本号"
                />
                <el-table-column
                  prop="standardName"
                  label="检标准名称"
                />
                <el-table-column
                  prop="standardType"
                  label="标准类型"
                />
                <el-table-column
                  prop="effectiveTime"
                  label="生效日期"
                />
                <el-table-column
                  prop="ineffectiveTime"
                  label="失效日期"
                />
              </el-table>
            </el-tab-pane>
            <!-- Delay handling -->
            <!--            <el-tab-pane label="工作标准" name="work">-->
            <!--              <div class="tab-item">-->
            <!--                <div class="flex-item">-->
            <!--                  <el-row :gutter="50">-->
            <!--                    <el-col :span="6">-->
            <!--                      <label>分类编码</label>-->
            <!--                      <div class="value">-->
            <!--                        {{ detailedInfo.kindCode }}-->
            <!--                      </div>-->
            <!--                    </el-col>-->
            <!--                    <el-col :span="6">-->
            <!--                      <label>分类名称</label>-->
            <!--                      <div class="value">-->
            <!--                        {{ detailedInfo.kindName }}-->
            <!--                      </div>-->
            <!--                    </el-col>-->
            <!--                    <el-col :span="6">-->
            <!--                      <label>上级分类</label>-->
            <!--                      <div class="value">-->
            <!--                        {{-->
            <!--                          detailedInfo.parent-->
            <!--                            ? detailedInfo.parent.kindName || '空'-->
            <!--                            : '无'-->
            <!--                        }}-->
            <!--                      </div>-->
            <!--                    </el-col>-->
            <!--                  </el-row>-->
            <!--                </div>-->
            <!--              </div>-->
            <!--            </el-tab-pane>-->
          </el-tabs>
        </bt-section>
      </template>
    </bt-page>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
// import Api from '@/module/onlineMonitoring/api/typeManage'
import picSingleUpload from '@/module/inspect/components/picSingleUpload.vue'
import { deleteEquipTypeById } from '@/module/inspect/api/basicSetting/equipType';
import { hasPermission } from '@/utils/hasPermission'

const { mapState, mapGetters, mapMutations } = createNamespacedHelpers(
  'inspectBasicSettingEquipType'
)

const sortsMap = ['小', '中', '大', '3D']

export default {
  name: 'EquipTypeDetail',
  components: {
    picSingleUpload,
  },
  data () {
    return {
      activeTabName: 'base',
    }
  },
  computed: {
    ...mapState(['detailedId', 'detailedInfo', 'treeNodeSelected'])
    // ...mapGetters(['treeNodeSelectedId']),
  },
  watch: {
    detailedInfo (val) {
      if (val.equipmentInstanceKindGraphList) {
        let arr = val.equipmentInstanceKindGraphList
        arr.sort(function (a, b) {
          return sortsMap.indexOf(a.graphType || '3D') - sortsMap.indexOf(b.graphType || '3D')
        })
      } else {
        val.equipmentInstanceKindGraphList = [
          { graphUrl: '', graphType: '小', graphName: '' },
          { graphUrl: '', graphType: '中', graphName: '' },
          { graphUrl: '', graphType: '大', graphName: '' },
          { graphUrl: '', graphType: '3D', graphName: '' }
        ]
      }
    }
  },
  methods: {
    hasPermission,

    ...mapMutations(['setIsComponent', 'setOperationType', 'setTreeNodeSelected', 'SET_DETAILED_INFO', 'SET_DETAILED_ID']),
    handleDelete () {
      this.$confirm('确定本次操作吗?执行后将不可撤销', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true,
        })
        .then(() => {
          deleteEquipTypeById({ id: this.detailedId }).then((res) => {
            if (res.success) {
              this.$emit('getTree')
              this.setTreeNodeSelected({})
              this.SET_DETAILED_ID('')
              this.SET_DETAILED_INFO({})
              this.$msg({
                type: 'success',
                message: '删除成功',
              })
            } else {
              let msg = res.errorMsg
              this.$msg({
                type: 'error',
                message: `${ msg }`,
              })
            }
          })
        })
        .catch(() => {
          this.$msg({
            type: 'warning',
            message: '取消了删除',
          })
        })
    },
    operate (type) {
      this.setOperationType(type)
      if (type === 'add') {
        this.SET_DETAILED_ID('')
        this.SET_DETAILED_INFO({})
      }
      if (type === 'add.sub') {
        this.SET_DETAILED_INFO({})
      }
      this.setIsComponent('equipTypeForm')
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '@/module/inspect/css/btDetail.scss';
</style>
