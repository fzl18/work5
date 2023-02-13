<template>
  <div class="app-container">
    <bt-page title="设备位置">
      <template slot="option">
        <bt-dropdown :show-arrow="true">
          {{ $translateTitle('操作') }}
          <bt-dropdown-menu>
            <bt-dropdown-item
              v-show="hasPermission('DXJ-SBWZ-edit')" v-if="detailedId"
              @click.native="operate('edit')"
            >
              编辑设备
            </bt-dropdown-item>
            <bt-dropdown-item
              v-show="hasPermission('DXJ-SBWZ-add')" v-if="!detailedId"
              @click.native="operate('add')"
            >
              添加设备
            </bt-dropdown-item>
            <bt-dropdown-item
              v-show="hasPermission('DXJ-SBWZ-add')" v-if="detailedId"
              @click.native="operate('add.sub')"
            >
              添加子设备
            </bt-dropdown-item>
            <bt-dropdown-item
              v-show="hasPermission('DXJ-SBWZ-delete')"
              v-if="detailedId &&!(treeNodeSelected.children &&treeNodeSelected.children.length > 0)"
              @click.native="handleDelete()"
            >
              删除设备
            </bt-dropdown-item>
          </bt-dropdown-menu>
        </bt-dropdown>
      </template>
      <template v-if="detailedId" slot="sections">
        <bt-section :show-drawer="false">
          <el-tabs v-model="activeTabName">
            <el-tab-pane label="基本信息" name="base">
              <div class="tab-item">
                <div class="flex-item fixed-400">
                  <bt-section :show-drawer="false">
                    <div class="section">
                      <bt-title title="基础信息" />
                      <el-row :gutter="50">
                        <el-col :span="12">
                          <label>设备编码</label>
                          <div class="value">{{ detailedInfo.equipmentCode }}</div>
                        </el-col>
                        <el-col :span="12">
                          <label>设备名称</label>
                          <div class="value">{{ detailedInfo.equipmentName }}</div>
                        </el-col>
                        <el-col :span="12">
                          <label>设备分类</label>
                          <div class="value">{{ detailedInfo.equipmentKindName }}</div>
                        </el-col>
                        <el-col :span="12">
                          <label>所属区域</label>
                          <div class="value">{{ detailedInfo.areaName }}</div>
                        </el-col>
                        <el-col :span="12">
                          <label>设备型号</label>
                          <div class="value">{{ detailedInfo.equipmentModel }}</div>
                        </el-col>
                        <el-col :span="12">
                          <label>设备类型</label>
                          <div class="value">{{ detailedInfo.equipmentType }}</div>
                        </el-col>
                        <el-col :span="12">
                          <label>设备规格</label>
                          <div class="value">{{ detailedInfo.equipmentSpecifications }}</div>
                        </el-col>
                        <el-col :span="12">
                          <label>设备负责人</label>
                          <div class="value">{{ detailedInfo.managerName }}</div>
                        </el-col>
                        <el-col :span="24">
                          <label>备品备件</label>
                          <div class="value">{{ detailedInfo.equipmentReplacementNames }}</div>
                        </el-col>
                        <!--Todo: Delay -->
                        <!--                        <el-col :span="12">-->
                        <!--                          <label>备品备件</label>-->
                        <!--                          <div class="value">999999</div>-->
                        <!--                        </el-col>-->
                      </el-row>
                    </div>
                  </bt-section>
                  <bt-section :show-drawer="false">
                    <template slot="options">
                      <el-switch
                        v-model="detailedInfo.isManagePoint"
                        disabled
                        :active-value="0" :inactive-value="1"
                        style="margin-top: 20px"
                      />
                    </template>
                    <div class="section">
                      <bt-title title="管理点" />
                      <el-row :gutter="50">
                        <el-col :span="12">
                          <label>NFC编码</label>
                          <div class="value">{{ detailedInfo.nfcCode }}</div>
                        </el-col>
                        <el-col :span="12">
                          <label>二维码编码</label>
                          <div class="value">{{ detailedInfo.qrCode }}</div>
                        </el-col>
                      </el-row>
                    </div>
                  </bt-section>
                </div>
                <div class="flex-item">
                  <bt-section :show-drawer="false">
                    <bt-title title="设备布局" />
                    <div class="area-map">
                      <bt-map
                        v-if="activeTabName==='base'&&detailedInfo.equipmentLocation && detailedInfo.equipmentLocation
                          !== 'null' && lineData.length && isSmlMap"
                        :key="detailedId"
                        :tool-show="false"
                        :datas="lineData" height="500px"
                      />
                      <!--                      :symbol="detailedId"-->
                      <div
                        v-show="!detailedInfo.equipmentLocation || detailedInfo.equipmentLocation==='null'"
                        class="area__empty"
                      >
                        <!--                        <el-button type="primary">-->
                        <!--                          <img src="@/assets/images/inspect/map_icon.png" alt>设置地图-->
                        <!--                        </el-button>-->
                        <img src="@/assets/images/inspect/map_bg.png" alt="MAP">
                      </div>
                      <el-button
                        v-if="activeTabName==='base'&&detailedInfo.equipmentLocation && detailedInfo.equipmentLocation"
                        class="btn_area__reset" type="primary"
                        @click="handleViewDetail"
                      >
                        查看
                      </el-button>
                    </div>
                  </bt-section>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="属性" name="attr">
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
                  prop="attrVal"
                  label="属性值"
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
                    :file-type="item.graphType === '3D' ? '3D' : 'image'"
                    class="pic"
                    view
                  />
                </el-col>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </bt-section>
      </template>
    </bt-page>
    <equip-pop
      v-if="typeof detailedInfo.equipmentLocation ==='string'"
      ref="equipPop"
      :is-view="true" :dd="lineData||[]"
      :is-show="showLineEditor"
      @close="handleDetailMapClose"
    />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
// import Api from '@/module/onlineMonitoring/api/typeManage'
import picSingleUpload from '@/module/inspect/components/picSingleUpload.vue'
import EquipPop from '@/module/inspect/pages/basicSetting/component/EquipPop'
import { deleteEquip } from '@/module/inspect/api/basicSetting/equipPos'
import BtMap from '@/module/inspect/pages/map'
import { detailedAreaInfo } from '@/module/inspect/api/basicSetting/area'
import { hasPermission } from '@/utils/hasPermission'

const { mapState, mapGetters, mapMutations } = createNamespacedHelpers(
  'inspectBasicSettingEquipPos'
)
const sortsMap = ['小', '中', '大', '3D']
export default {
  name: 'EquipPosDetail',
  components: {
    picSingleUpload,
    BtMap,
    EquipPop
  },
  data () {
    return {
      activeTabName: 'base',
      areaMapJson: '',
      lineData: [],
      showLineEditor: false,
      isSmlMap: true
    }
  },
  computed: {
    ...mapState(['treeNodeSelected', 'detailedId', 'detailedInfo'])
    // lineData () {
    //   const type = this.detailedInfo.equipmentType === '输送机' ? 'line' : 'point'
    //   // const area = Array.from(this.areaGeoData)
    //   const area = [{ id: this.detailedInfo.areaId, type: 'area', features: this.areaMapJson }]
    //   const obj = JSON.parse(JSON.stringify({
    //     id: this.detailedId,
    //     type,
    //     features: this.detailedInfo.equipmentLocation
    //   }))
    //   console.log('计算出', [...area, ...[obj]])
    //   return [...area, ...[obj]]
    // }
  },
  watch: {
    detailedInfo (val) {
      console.log('详情变化', val, this.detailedId)
      // this.describeGepJson()
    }
  },
  mounted () {
    this.describeGepJson()
    // this.detailedInfo.equipmentReplacementNames = '主皮带-减速机 , 主皮带-机械室改向滚筒,主皮带-减速机,主皮带-机械室改向滚筒'
  },
  methods: {
    hasPermission,

    ...mapMutations(['setIsComponent', 'setOperationType', 'setTreeNodeSelected', 'SET_DETAILED_INFO', 'SET_DETAILED_ID']),
    handleViewDetail () {
      this.isSmlMap = false
      this.$nextTick(() => {
        this.showLineEditor = true
      })
    },
    handleDetailMapClose () {
      this.isSmlMap = true
      this.showLineEditor = false
    },
    handleAreaChange (e) {
      // get area mapGeoJSON
      detailedAreaInfo({ id: e }).then(res => {
        if (res.success) {
          this.areaMapJson = res.data.areaMap
          const type = this.detailedInfo.equipmentType === '输送机' ? 'line' : 'point'
          let area = [{ type: 'area', id: this.detailedInfo.areaId, features: res.data.areaMap }]
          const d = [{ id: this.detailedId, type, features: this.detailedInfo.equipmentLocation }]
          area = [...area, ...d]
          this.lineData = area.splice(0)
          // this.displayEquipJSON.push({ id: this.detailedInfo.areaId, type: 'area', features: res.data.areaMap })
        }
      })
    },
    describeGepJson () {
      this.lineData = []
      if (this.detailedInfo.areaId) {
        // this.lineData.push({ id: this.detailedId, type: 'line', features: this.detailedInfo.equipmentLocation })
        this.handleAreaChange(this.detailedInfo.areaId)
      }
    },
    handleDelete () {
      this.$confirm('确定本次操作吗?执行后将不可撤销', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true,
        })
        .then(() => {
          deleteEquip({ id: this.detailedId }).then((res) => {
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
      this.setIsComponent('equipPosForm')
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '@/module/inspect/css/btDetail.scss';
</style>
