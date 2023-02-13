<template>
  <div class="app-container">
    <bt-page title="区域详情">
      <template slot="option">
        <bt-dropdown :show-arrow="true">
          {{ $translateTitle('操作') }}
          <bt-dropdown-menu>
            <bt-dropdown-item
              v-show="hasPermission('DXJ-JCSZ-QYGL-add')" v-if="detailedId===''"
              @click.native="operate('add')"
            >
              添加区域
            </bt-dropdown-item>
            <bt-dropdown-item
              v-show="hasPermission('DXJ-JCSZ-QYGL-add')"
              v-if="detailedId"
              @click.native="operate('add.sub')"
            >
              添加子区域
            </bt-dropdown-item>
            <bt-dropdown-item
              v-show="hasPermission('DXJ-JCSZ-QYGL-edit')"
              v-if="detailedId"
              @click.native="operate('edit')"
            >
              编辑区域
            </bt-dropdown-item>
            <bt-dropdown-item
              v-show="hasPermission('DXJ-JCSZ-QYGL-delete')"
              v-if="detailedId"
              @click.native="handleDelete"
            >
              删除区域
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
                          <label>区域名称</label>
                          <div class="value">{{ detailedInfo.areaName }}</div>
                        </el-col>
                        <el-col :span="12">
                          <label>区域编码</label>
                          <div class="value">{{ detailedInfo.areaCode }}</div>
                        </el-col>
                        <el-col :span="24">
                          <label>地址</label>
                          <div class="value">{{ detailedInfo.areaPlace }}</div>
                        </el-col>
                        <el-col :span="12">
                          <label>所属机构</label>
                          <div class="value">{{ detailedInfo.organizationName }}</div>
                        </el-col>
                        <el-col :span="12">
                          <label>区域经理</label>
                          <div class="value">{{ detailedInfo.areaManagerName }}</div>
                        </el-col>
                        <el-col :span="12">
                          <label>区域作业长</label>
                          <div class="value">{{ detailedInfo.areaForemanName }}</div>
                        </el-col>
                        <el-col :span="12">
                          <label>关联仓库</label>
                          <div class="value">{{ detailedInfo.storehouseName }}</div>
                        </el-col>
                        <el-col :span="12">
                          <label>点检员</label>
                          <div class="value">{{ detailedInfo.areaPartyaInspector }}</div>
                        </el-col>
                      </el-row>
                    </div>
                  </bt-section>
                </div>
                <div class="flex-item">
                  <bt-section :show-drawer="false">
                    <bt-title title="区域布局" />
                    <div class="area-map">
                      <bt-map
                        v-if="activeTabName==='base'&&detailedInfo.areaMap && areaMapData.length && isShowArea"
                        :key="detailedId"
                        :datas="areaMapData"
                        :tool-show="false"
                        height="500px"
                      />
                      <el-button class="btn_area__reset" type="primary" @click="handleViewAreaMap">
                        查看
                      </el-button>
                    </div>
                  </bt-section>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="关联设备" name="device">
              <div class="tab-item">
                <div class="flex-item fixed-400">
                  <bt-section :show-drawer="false">
                    <bt-title title="设备列表" />
                    <el-table
                      :data="detailedInfo.equipmentList || []"
                      :header-cell-style="{ textAlign: 'center' }"
                      :cell-style="{ textAlign: 'center' }"
                      stripe
                      fit
                      highlight-current-row
                      style="width: 100%"
                      @row-click="handleRowClick"
                    >
                      <el-table-column type="index" label="序号" />
                      <el-table-column
                        prop="equipmentType"
                        label="设备类型"
                      />
                      <el-table-column
                        prop="equipmentCode"
                        label="设备编号"
                      />
                      <el-table-column
                        prop="equipmentName"
                        label="设备名称"
                      />
                      <!--                      <el-table-column-->
                      <!--                        prop="attrDesc"-->
                      <!--                        label="操作"-->
                      <!--                      />-->
                    </el-table>
                  </bt-section>
                </div>
                <div class="flex-item">
                  <bt-section :show-drawer="false">
                    <bt-title title="设备布局" />
                    <div class="area-map">
                      <bt-map
                        v-if="activeTabName==='device'&&detailedInfo.areaMap && geoData.length && isShowAreaDevice"
                        :key="`all-${detailedId}`"
                        :datas="geoData"
                        :selected-line="highlightDeviceId"
                        :tool-show="false"
                        height="500px"
                      />
                      <div v-show="!detailedInfo.areaMap" class="area__empty">
                        <!--                        <el-button type="primary">-->
                        <!--                          <img src="@/assets/images/inspect/map_icon.png" alt>设置地图-->
                        <!--                        </el-button>-->
                        <img src="@/assets/images/inspect/map_bg.png" alt="MAP">
                      </div>
                      <el-button class="btn_area__reset" type="primary" @click="handleViewDeviceAreaBound">
                        查看
                      </el-button>
                    </div>
                  </bt-section>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="关联班组" name="group">
              <div class="tab-item">
                <bt-section :show-drawer="false">
                  <bt-title title="班组列表" />
                  <el-table
                    :data="detailedInfo.teamList || []"
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
                  </el-table>
                </bt-section>
              </div>
            </el-tab-pane>
          </el-tabs>
        </bt-section>
      </template>
    </bt-page>
    <area-pop
      v-if="(typeof detailedInfo.areaMap) === 'string'"
      ref="areaPop" :key="viewKey"
      :dd="popMapData"
      :is-show="isShowPopMap"
      :is-view="isViewMode"
      @close="handlePostMapClose"
    />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import BtTitle from '@/components/BtPage/bt-title'
import AreaPop from '@/module/inspect/pages/basicSetting/component/AreaPop';
import BtMap from '@/module/inspect/pages/map'
import { deleteArea } from '@/module/inspect/api/basicSetting/area';
import { hasPermission } from '@/utils/hasPermission'
// import picSingleUpload from '@/module/onlineMonitoring/components/picSingleUpload.vue'

const { mapState, mapGetters, mapMutations } = createNamespacedHelpers(
  'inspectBasicSettingArea'
)

export default {
  name: 'AreaDetail',
  components: {
    BtTitle,
    BtMap,
    AreaPop
    // picSingleUpload,
  },
  data () {
    return {
      activeTabName: 'base',
      isShowPopMap: false,
      isViewMode: true,
      geoData: [],
      // areaMapData: [],
      highlightDeviceId: '',
      isShowArea: true,
      viewKey: 'area-view',
      isShowAreaDevice: true
    }
  },
  computed: {
    ...mapState(['detailedId', 'detailedInfo']),
    areaMapData () {
      let cc = []
      if (typeof this.detailedInfo.areaMap === 'string') {
        cc = [{ id: this.detailedId, type: 'area', features: this.detailedInfo.areaMap }]
      }
      return cc
    },
    popMapData () {
      if (this.isShowAreaDevice === false) {
        return JSON.parse(JSON.stringify(this.geoData)) || []
      } else {
        return JSON.parse(JSON.stringify(this.areaMapData)) || []
        // return this.areaMapData || []
      }
      // isShowAreaDevice===false ? geoData : areaMapData
    }
    // ...mapState({
    //   treeNodeSelected: 'treeNodeSelected',
    // }),
  },
  watch: {
    detailedInfo () {
      this.describeGeoJson()
    }
  },
  mounted () {
    console.log('mouthed')
    this.describeGeoJson()
  },
  methods: {
    hasPermission,
    ...mapMutations(['setIsComponent', 'setOperationType', 'setTreeNodeSelected', 'SET_DETAILED_INFO', 'SET_DETAILED_ID']),
    handleRowClick (row, col, e) {
      console.log(row, col, e)
      this.highlightDeviceId = row.id
    },
    handlePostMapClose () {
      this.isShowPopMap = false
      this.isShowArea = true
      this.isShowAreaDevice = true
      this.$nextTick(() => {
        this.describeGeoJson()
      })
    },
    handleViewAreaMap () {
      this.isShowArea = false
      this.viewKey = 'area-view'
      this.$nextTick(() => {
        this.isShowPopMap = true
        this.$refs.areaPop.$forceUpdate()
      })
    },
    handleViewDeviceAreaBound () {
      this.isShowAreaDevice = false
      this.viewKey = 'device-view'
      this.$nextTick(() => {
        this.isShowPopMap = true
        this.$refs.areaPop.$forceUpdate()
      })
    },
    describeGeoJson () {
      // this.areaMapData = []
      // this.geoData = []
      console.log('执行绘制区域')
      if (!Object.keys(this.detailedInfo).length) {
        console.log('绘制毛线oan')
        return
      }
      let area = [{ id: this.detailedId, type: 'area', features: this.detailedInfo.areaMap }]
      // this.areaMapData = JSON.parse(JSON.stringify(area)) // Map1
      // console.log('区域单地图', this.areaMapData)
      if (this.detailedInfo.equipmentList instanceof Array) {
        const data = this.detailedInfo.equipmentList
        let result = data.reduce((pre, cur) => {
          const type = cur.equipmentType === '输送机' ? 'line' : 'point'
          let cc = { id: cur.id, type, features: cur.equipmentLocation }
          pre.push(cc)
          return pre
        }, [])
        // console.log('提取结果', result)
        area = [...area, ...result]
      }
      this.geoData = area.splice(0) // Map2
      console.log('地图2带设备的', this.geoData)
    },
    handleDelete () {
      this.$confirm('确定本次操作吗?执行后将不可撤销', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true,
        })
        .then(() => {
          deleteArea({ id: this.detailedId }).then(res => {
            if (res.success) {
              this.$msg({
                type: 'success',
                message: '删除成功',
              })
              this.$emit('getTree')
              this.SET_DETAILED_ID('')
              this.SET_DETAILED_INFO({})
            } else {
              let msg = res.errorMsg
              this.$msg({
                type: 'error',
                message: `${ msg || '删除失败' }`,
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
      this.setIsComponent('areaForm')
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '@/module/inspect/css/btDetail.scss';
</style>
