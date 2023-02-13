<template>
  <div v-if="isShowMap" class="m-box">
    <el-row class="s-box" type="flex" justify="space-between">
      <el-col :span="type == 1 ? 15 : 24">
        <div class="amap-wrapper" style="width: 100%; height: 100%">
          <tdt-map
            :zoom-enable="true"
            class="amap-box"
            vid="map"
            :zoom="zoom"
            :center="center"
          >
            <template v-if="type == 1">
              <tdt-marker
                v-for="(marker, index) in defaultMarkData"
                :key="`1${marker.equipmentId}`"
                :position="marker.coordinates"
                :dragging="false"
                :vid="index"
              />
              <tdt-label
                v-for="(marker, index) in defaultMarkData"
                :key="`2${marker.equipmentId}`"
                :position="marker.coordinates"
                :text="marker.equipmentName"
                :offset="marker.offset"
                border-color="#0000FF"
                :dragging="false"
                :vid="index"
              />
              <tdt-polygon
                :path="defaultPolygons"
                :draggable="false"
                color="#444444"
              />

              <tdt-marker
                v-for="(marker, index) in actulMarkData"
                :key="`1${marker.equipmentId}`"
                :position="marker.coordinates"
                :dragging="false"
                :vid="index"
              />
              <tdt-label
                v-for="(marker, index) in actulMarkData"
                :key="`2${marker.equipmentId}`"
                :position="marker.coordinates"
                :text="marker.equipmentName"
                :offset="marker.offset"
                border-color="#0000FF"
                :dragging="false"
                :vid="index"
              />
              <tdt-polygon
                :path="actulPolygons"
                :draggable="false"
                color="#ff0000"
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
              <tdt-polyline
                :path="realPolygons"
                :draggable="false"
                color="#444444"
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
          </tdt-map>
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
  import VueTianditu from 'vue-tianditu'
  Vue.use(VueTianditu, {
    v: '4.0',
    tk: 'df4846bd0e93cc6c56d63869081c769f',
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
      uniqueTaskId: {
        type: [Number, String],
        default: '',
        required: true,
      },
      //巡检1，工单2
      isShowMap: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        zoom: 20,
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
      }
    },
    watch: {
      uniqueTaskId(newVal, oldVal) {
        console.log('newId--', newVal, 'oldId--', oldVal)
        if (newVal) {
          this.changeData()
        }
      },
      /* type(newVal, oldVal) {
        console.log('newType--', newVal, 'oldType--', oldVal)
        if (newVal) {
          this.changeData()
        }
      },*/
    },
    created() {
      // console.log(this.id);
      if (!this.id) return
      this.requestData()
    },
    methods: {
      translateTitle,
      changeData() {
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
      },
      requestData() {
        if (this.type == 1) {
          getPollingTrace({
            taskId: this.id,
          }).then((res) => {
            if (res.success == 1) {
              let { data } = res
              let index1 = 0
              let defaultPreCoordinates = [0, 0]
              data.pathVO.forEach((item, index) => {
                if (
                  item.coordinates.length == 2 &&
                  item.coordinates[0] &&
                  item.coordinates[1]
                ) {
                  this.defaultPolygons.push(item.coordinates)
                  let currC1 = Number(item.coordinates[0])
                  let currC2 = Number(item.coordinates[1])
                  let preC1 = Number(defaultPreCoordinates[0])
                  let preC2 = Number(defaultPreCoordinates[1])
                  if (
                    Math.abs(currC1 - preC1) >= 0.0006 ||
                    Math.abs(currC2 - preC2) >= 0.0006
                  ) {
                    index2 = 1
                    item.offset = [0, 0]
                  } else {
                    item.offset = [1, index2 * 25]
                  }
                  this.defaultMarkData.push(item)
                  defaultPreCoordinates = item.coordinates
                  index1++
                }
              })

              //actulPolygons
              this.tableLoading = true
              let index2 = 0
              let actulPreCoordinates = [0, 0]
              data.actulVO.forEach((item, index) => {
                if (
                  item.coordinates.length == 2 &&
                  item.coordinates[0] &&
                  item.coordinates[1]
                ) {
                  this.actulPolygons.push(item.coordinates)
                  let currC1 = Number(item.coordinates[0])
                  let currC2 = Number(item.coordinates[1])
                  let preC1 = Number(actulPreCoordinates[0])
                  let preC2 = Number(actulPreCoordinates[1])
                  if (
                    Math.abs(currC1 - preC1) >= 0.0006 ||
                    Math.abs(currC2 - preC2) >= 0.0006
                  ) {
                    index2 = 1
                    item.offset = [0, 0]
                  } else {
                    item.offset = [1, index2 * 25]
                  }
                  this.tableData.push({
                    equipmentId: item.equipmentId,
                    equipmentName: item.equipmentName,
                    scanningTime: item.scanningTime,
                  })
                  this.actulMarkData.push(item)
                  actulPreCoordinates = item.coordinates
                  index2++
                }
              })
              this.tableLoading = false
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
            this.realPolygons.push(item.coordinate)
            this.realMarkData.push(item)
            count++
          }
        })
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
