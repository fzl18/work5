<template>
  <div class="m-box">
    <el-row class="s-box" type="flex" justify="space-between">
      <el-col :span="type == 1 ? 15 : 24">
        <div class="amap-wrapper" style="width: 100%; height: 100%">
          <el-amap
            :zoom-enable="true"
            class="amap-box"
            vid="map"
            :zoom="zoom"
            :center="center"
          >
            <template v-if="type == 1">
              <el-amap-marker
                v-for="(marker, index) in defaultMarkData"
                :key="`1${marker.equipmentId}`"
                :position="marker.coordinates"
                :label="marker.label"
                :draggable="false"
                :vid="index"
              />
              <el-amap-marker
                v-for="(marker, index) in actulMarkData"
                :key="`2${marker.equipmentId}`"
                :position="marker.coordinates"
                :label="marker.label"
                :draggable="false"
                :vid="index"
              />
              <el-amap-polygon
                v-for="(polygon, index) in defaultPolygons"
                :key="`3${polygon.id[index]}`"
                :ref="`polygon_${index}`"
                :vid="polygon.id[index]"
                :path="polygon.path"
                :draggable="false"
                stroke-color="#444444"
                fill-color=""
              />
              <el-amap-polygon
                v-for="(polygon, index) in actulPolygons"
                :key="`4${polygon.id[index]}`"
                :vid="polygon.id[index]"
                :path="polygon.path"
                :draggable="false"
                stroke-color="#ff0000"
                fill-color=""
              />
            </template>
            <template v-if="type == 2">
              <!--  <el-amap-marker
                v-for="(marker, index) in realMarkData"
                :key="`5${marker.recordTime}`"
                :position="marker.coordinate"
                :label="marker.label"
                :draggable="false"
                :vid="index"
              ></el-amap-marker> -->
              <el-amap-polyline
                v-for="(polygon, index) in realPolygons"
                :key="`6${polygon.id[index]}`"
                :ref="`polygon_${index}`"
                :vid="polygon.id[index]"
                :path="polygon.path"
                :draggable="false"
                stroke-color="#444444"
                fill-color=""
              />
              <!-- <el-amap-polygon
                v-for="(polygon, index) in realPolygons"
                :key="`7${polygon.id[index]}`"
                :ref="`polygon_${index}`"
                :vid="polygon.id[index]"
                :path="polygon.path"
                :draggable="false"
                stroke-color="#444444"
                fill-color=""
              ></el-amap-polygon> -->
            </template>
          </el-amap>
          <div v-if="type == 1" class="top-tip">
            <p class="p1">{{ translateTitle('系统建议线路') }}</p>
            <p>{{ translateTitle('实际巡检线路') }}</p>
          </div>
        </div>
      </el-col>
      <el-col v-if="type == 1" :span="8">
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column
            type="index"
            :label="translateTitle('顺序')"
            width="80"
          />
          <el-table-column
            prop="equipmentName"
            :label="translateTitle('设备名称')"
          />
          <el-table-column
            width="160"
            prop="scanningTime"
            :label="translateTitle('设备验证时间')"
          />
        </el-table>
        <div class="btn-box">
          <el-button class="cancelBtn" @click="backFn">
            {{ translateTitle('取消') }}
          </el-button>
        </div>
      </el-col>
    </el-row>
    <div v-if="type == 2" class="btn-box">
      <el-button class="cancelBtn" @click="backFn">
        {{ translateTitle('取消') }}
      </el-button>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import VueAMap from 'vue-amap'
  Vue.use(VueAMap)
  VueAMap.initAMapApiLoader({
    key: '819cfe78c219b08dbeaa9b74fa9bc170',
    plugin: [
      'AMap.Autocomplete',
      'AMap.PlaceSearch',
      'AMap.Scale',
      'AMap.OverView',
      'AMap.ToolBar',
      'AMap.MapType',
      'AMap.PolyEditor',
      'AMap.CircleEditor',
    ],
    // 默认高德 sdk 版本为 1.4.4
    v: '1.4.4',
  })
  import { getPollingTrace, getPollingCurTrace } from '../../api/pollingRecord'
  import { getWorkOrderCurTrace } from '../../api/workOrder'
  import { translateTitle } from '../../i18n'
  export default {
    props: {
      //1 巡检轨迹 2 实时轨迹
      type: {
        type: Number,
        default: 1,
      },
      //巡检1，工单2
      pageType: {
        type: Number,
        default: 1,
      },
      //根据id获取轨迹数据
      id: {
        type: [Number, String],
        default: '',
        required: true,
      },
    },
    data() {
      return {
        zoom: 18,
        center: [0, 0],
        //默认
        defaultMarkData: [],
        defaultPolygons: [],
        //实际的
        actulMarkData: [],
        actulPolygons: [],
        tableData: [],
        //实时巡检数据
        realMarkData: [],
        realPolygons: [],
        demoData: [
          {
            coordinate: '120.421916,31.557277',
            pollingTaskId: 1,
            recordTime: '2021-04-06 16:36:18',
          },
          {
            coordinate: '120.422366,31.557272',
            pollingTaskId: 1,
            recordTime: '2021-04-06 16:36:19',
          },
          {
            coordinate: '120.422425,31.556998',
            pollingTaskId: 1,
            recordTime: '2021-04-06 16:36:20',
          },
          {
            coordinate: '120.422484,31.556546',
            pollingTaskId: 1,
            recordTime: '2021-04-06 16:36:21',
          },
          {
            coordinate: '120.421427,31.556646',
            pollingTaskId: 1,
            recordTime: '2021-04-06 16:36:22',
          },
          {
            coordinate: '120.42117,31.557428',
            pollingTaskId: 1,
            recordTime: '2021-04-06 16:36:23',
          },
          {
            coordinate: '120.421604,31.557826',
            pollingTaskId: 1,
            recordTime: '2021-04-06 16:36:24',
          },
          {
            coordinate: '120.422602,31.557976',
            pollingTaskId: 1,
            recordTime: '2021-04-06 16:36:26',
          },
        ],
      }
    },
    watch: {
      id(newVal, oldVal) {
        // console.log('newId--', newVal, 'oldId--', oldVal)
        if (newVal) {
          this.defaultMarkData = []
          this.defaultPolygons = []
          //实际的
          this.actulMarkData = []
          this.actulPolygons = []
          //实时的
          this.realMarkData = []
          this.realPolygons = []
          this.tableData = []
          this.requestData()
        }
      },
    },
    created() {
      // console.log(this.id);
      if (!this.id) return
      this.requestData()
    },
    methods: {
      translateTitle,
      requestData() {
        this.demoData = this.$options.data().demoData
        if (this.type == 1) {
          getPollingTrace({
            taskId: this.id,
          }).then((res) => {
            if (res.success == 1) {
              let { data } = res
              let poly1 = []
              let polyId1 = []
              let index1 = 0
              data.pathVO.forEach((item, index) => {
                if (
                  item.coordinates.length == 2 &&
                  item.coordinates[0] &&
                  item.coordinates[1]
                ) {
                  poly1.push(item.coordinates)
                  polyId1.push(item.equipmentId)
                  item.label = {}
                  item.label.content =
                    `${index1 + 1}` + '.' + item.equipmentName
                  item.label.offset = [-40, 40 + index1 * 22]
                  this.defaultMarkData.push(item)
                  index1++
                }
              })
              if (poly1.length > 0) {
                this.defaultPolygons.push({ path: poly1, id: polyId1 })
              }

              //actulPolygons
              let poly2 = []
              let polyId2 = []
              this.tableLoading = true
              let index2 = 0
              data.actulVO.forEach((item, index) => {
                if (
                  item.coordinates.length == 2 &&
                  item.coordinates[0] &&
                  item.coordinates[1]
                ) {
                  poly2.push(item.coordinates)
                  polyId2.push(item.equipmentId)
                  item.label = {}
                  item.label.content = `<span class="span2">${index2 + 1}.${
                    item.equipmentName
                  }</span>`
                  item.label.offset = [-40, 40 + index2 * 22]
                  this.tableData.push({
                    equipmentId: item.equipmentId,
                    equipmentName: item.equipmentName,
                    scanningTime: item.scanningTime,
                  })
                  this.actulMarkData.push(item)
                  index2++
                }
              })
              this.tableLoading = false
              if (poly2.length > 0) {
                this.actulPolygons.push({ path: poly2, id: polyId2 })
              }
              if (
                this.actulMarkData.length > 0 &&
                this.actulMarkData[0].coordinates.length == 2 &&
                this.actulMarkData[0].coordinates[0] &&
                this.actulMarkData[0].coordinates[1]
              ) {
                this.center = this.actulMarkData[0].coordinates
              }
            }
          })
        } else {
          //2 实时轨迹
          if (this.pageType == 1) {
            getPollingCurTrace({ taskId: this.id }).then((res) => {
              let { success, data } = res
              if (success == 1) {
                this.handleData(data)
              }
            })
          } else {
            getWorkOrderCurTrace({ id: this.id }).then((res) => {
              let { success, data } = res
              if (success == 1) {
                this.handleData(data)
              }
            })
          }
        }
      },
      backFn() {
        this.$emit('closeMap')
      },
      handleData(data) {
        let poly1 = []
        let polyId1 = []
        let count = 1
        //demo数据
        if (data.length == 0) {
          this.$msg({
            message: this.translateTitle('暂无有效巡检轨迹'),
            type: 'warning',
          })
          this.backFn()
          return
        }
        data.forEach((item) => {
          if (item.coordinate) {
            item.coordinate = item.coordinate.split(',')
            item.label = {}
            item.label.content = count
            item.label.offset = [0, 30]
            this.realMarkData.push(item)
            poly1.push(item.coordinate)
            polyId1.push(item.recordTime)
            count++
          }
        })
        this.realPolygons.push({ path: poly1, id: polyId1 })
        this.center = this.realMarkData[0].coordinate
        console.log(this.realMarkData)
      },
    },
  }
</script>

<style lang="scss" scoped>
  .m-box {
    background: #fff;
    padding: 20px;
    border-radius: 5px;
  }
  .s-box {
    height: 75vh;

    .cancelBtn {
      width: 88px;
      height: 34px;
      color: #fff;
      font-size: 14px;
      background: #bcbcbc;
      border-color: #bcbcbc;
    }
  }
  .amap-wrapper {
    position: relative;
    .top-tip {
      position: absolute;
      z-index: 99999;
      width: 200px;
      top: 20px;
      left: 56%;
      transform: translateX(-50%);
      font-size: 20px;
      font-weight: bold;
      p {
        position: relative;
        &:after {
          content: '';
          position: absolute;
          height: 3px;
          width: 55px;
          background: #000;
          left: -55px;
          top: 50%;
          transform: translateX(-50%);
        }
        &:last-child {
          &:after {
            background: red;
          }
        }
      }
    }
  }
  .amap-marker-label {
    color: #444444;
    border: none;
    font-size: 16px;
  }
  .span2 {
    color: red;
  }
  .amap-box {
    height: 100%;
  }
  .btn-box {
    margin-top: 20px;
    text-align: right;
  }
  .cancelBtn {
    width: 88px;
    height: 34px;
    color: #fff;
    font-size: 14px;
    background: #bcbcbc;
    border-color: #bcbcbc;
  }
</style>
