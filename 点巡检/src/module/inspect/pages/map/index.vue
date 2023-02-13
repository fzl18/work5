<template>
  <div class="s-box" :style="{ height }">
    <v-map
      ref="map"
      height="100%"
      :view="view"
      :controls="controls"
      @load="mapLoaded = true"
      @click="onClick"
      @clickfeature="onClickFeature"
      @dblclick="onDblClick"
      @dblclickfeature="onDblclickfeature"
      @contextmenu.prevent="onContextmenu"
      @pointermove="pointermove"
    >
      <v-tool
        v-show="toolShow"
        ref="tool"
        :draw-type="drawType"
        :page-type="pageType"
        :visible="!editable"
        :mobile="isMobile()"
        @changeTile="changeTile"
        @changeDrawType="changeDrawType"
        @edit="setEditType"
        @saveHandler="saveHandler"
      />
      <v-tile :tile-type="tile" />
      <v-symbol
        v-for="(item, index) in datas"
        :key="index"
        :ref="item.id"
        :layer-id="item.id"
        :type="drawType"
        :editable="item.id == symbol"
        :features="item.features"
        :animation="item.animation"
        :height-light="selectedLine"
        @drawend="drawend"
        @drawstart="drawstart"
        @modifyend="modifyend"
        @select="onselect"
      />
      <v-overlay class="overlay-menu" :position="positionMenu">
        <ul>
          <li @click="delHandler"><i class="el-icon-error" /></li>
        </ul>
      </v-overlay>
    </v-map>
  </div>
</template>

<script>
import { translateTitle } from '../../i18n'
import GeoJSON from 'ol/format/GeoJSON'
import { calculateCenter, isMobile } from '../../components/olMap/utils'
export default {
  name: 'BtMap',
  props: {
    height: {
      type: String,
      default: '100vh',
    },
    toolShow: {
      type: Boolean,
      default: true,
    },
    datas: {
      type: Array,
      default: () => {
        // return []
        return [
          {
            id: '43243234',
            type: 'area',
            // features:
            //   '{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[118.07177284173613,24.634653365617925],[118.09374549798613,24.599497120332746],[118.04719093308032,24.60444096589352],[118.04828956746442,24.63039616818431],[118.07177284173613,24.634653365617925]]]},"properties":null}]}',
          },
          {
            id: '32123',
            type: 'line',
            animation: false,
            features:
              '{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"LineString","coordinates":[[118.19382416578404,24.652685556936497],[118.18805634770936,24.587454241552344]]},"properties":null}]}',
          },
          {
            id: '3223',
            type: 'point',
            features:
              '{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[118.16805634770936,24.557454241552344]},"properties":null}]}',
          },
        ]
      },
    },
    symbol: {
      type: String,
      default: '43243234',
    },
    selectedLine: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      location_coords: '', // 经度,纬度
      mapLoaded: false,
      mapZoom: 5,
      addModify: false,
      editable: true,
      // layerFeatures: [],
      pageType: '',
      view: {
        center: [116.71847, 39.903883],
        zoom: 13,
        maxZoom: 18,
      },
      controls: {
        attribution: false,
        zoom: false,
        rotate: false,
        FullScreen: false,
        ScaleLine: true,
        ZoomSlider: false,
      },
      tile: 'TD_IMG',
      modify: false,
      features: '',
      position: undefined,
      positionMenu: undefined,
      drawType: null,
      hasArea: false,
      currentCoordinateText: '',
    }
  },

  mounted() {
    this.init()
  },
  methods: {
    isMobile,
    translateTitle,
    init() {
      let { datas } = this
      if (datas.length) {
        datas.forEach((item) => {
          if (item.type == 'area' && item.features) {
            this.hasArea = true
            this.areaGeometry = new GeoJSON()
              .readFeatures(item.features)[0]
              .getGeometry()
            // const center = calculateCenter(this.areaGeometry).center
            // this.view.center = center
            this.$refs.map.map.getView().fit(this.areaGeometry)
          }
          if (item.id == this.symbol) {
            this.editable = item.features ? true : false
            this.pageType = item.type
          }
        })
      }
      if (isMobile()) {
        this.getDrivePosition()
      }
    },

    onClick(evt, map) {
      // console.log(evt)
      this.currentCoordinateText = [
        evt.coordinate[0].toFixed(6),
        evt.coordinate[1].toFixed(6),
      ].join(',')
      this.positionMenu = undefined
    },

    onContextmenu(evt, map, hit) {
      //右键菜单
      if (this.drawType) {
        this.drawType = null
      } else {
        if (hit) {
          map.forEachSmFeatureAtPixel(
            evt.pixel,
            (feature, layer) => {
              if (layer) {
                const layerId = layer.get('id')
                if (layerId == this.symbol) {
                  this.positionMenu = evt.coordinate
                }
              }
            },
            {},
            evt
          )
        }
      }
    },
    onClickFeature(feature, layer, evt) {
      // console.log(feature)
    },
    onDblClick(evt, map) {
      // console.log(evt)
      this.position = undefined
    },
    onDblclickfeature(feature, layer, evt, map) {
      const coordinates = feature.getGeometry().getCoordinates()
      if (layer) {
        // console.log(layer.get('type'), coordinates)
      }
    },
    pointermove(evt, map) {
      const pixel = map.getEventPixel(evt.originalEvent)
      const hit = map.hasFeatureAtPixel(pixel)
      if (hit) {
        const features = map.getFeaturesAtPixel(pixel)
        if (features.length > 0) {
        }
      }
    },
    changeTile(val) {
      this.tile = val
    },
    changeDrawType(val) {
      if (val == 'LineString' && !this.hasArea) {
        this.$message.error('请先设置区域！')
        return
      }
      if (val == 'Point' && !this.hasArea) {
        this.$message.error('请先设置区域！')
        return
      }
      this.drawType = val
    },

    drawstart(evt, map) {
      if (this.pageType == 'line') {
        let hit = this.areaGeometry.intersectsCoordinate(
          evt.feature.getGeometry().getCoordinates()[0]
        )
        if (!hit) {
          this.$message({
            message: '输送机起点必须在厂区内，请重绘！',
            type: 'error',
          })
          this.$refs[this.symbol][0].draw.removeLastPoint()
        }
      }
    },
    drawend(evt, map) {
      if (this.pageType == 'line') {
        let [start, end] = evt.feature.getGeometry().getCoordinates()
        let hitEnd = this.areaGeometry.intersectsCoordinate(end)
        if (!hitEnd) {
          this.$message({
            message: '输送机终点必须在厂区内，请重绘！',
            type: 'error',
          })
          setTimeout(() => {
            this.$refs[this.symbol][0].layer.getSource().clear()
          }, 10)
        } else {
          setTimeout(() => {
            this.editable = !this.editable
          }, 260)
          this.drawType = null
        }
      } else if (this.pageType == 'point') {
        console.log(evt.feature.getGeometry().getCoordinates())
        let hit = this.areaGeometry.intersectsCoordinate(
          evt.feature.getGeometry().getCoordinates()
        )
        if (!hit) {
          this.$message({
            message: '巡检点必须在厂区内，请重绘！',
            type: 'error',
          })
          setTimeout(() => {
            this.$refs[this.symbol][0].layer.getSource().clear()
          }, 10)
        } else {
          setTimeout(() => {
            this.editable = !this.editable
          }, 260)
          this.drawType = null
        }
      } else {
        setTimeout(() => {
          this.editable = !this.editable
        }, 260)
        this.drawType = null
      }
    },

    onselect(evt, map) {
      // console.log('on select: ', evt, map)
    },
    modifystart(evt, map) {
      // console.log('modify start: ', evt, map)
    },
    modifyend(evt, map) {
      if (this.pageType == 'line') {
        let [start, end] = this.$refs[this.symbol][0].layer
          .getSource()
          .getFeatures()[0]
          .getGeometry()
          .getCoordinates()
        let hitStart = this.areaGeometry.intersectsCoordinate(start)
        let hitEnd = this.areaGeometry.intersectsCoordinate(end)
        if (!hitStart || !hitEnd) {
          this.$message.error('输送机头尾不在厂区内，请重绘！')
          this.delHandler()
        }
      }
      if (this.pageType == 'point') {
        let coordinate = this.$refs[this.symbol][0].layer
          .getSource()
          .getFeatures()[0]
          .getGeometry()
          .getCoordinates()
        let hit = this.areaGeometry.intersectsCoordinate(coordinate)
        if (!hit) {
          this.$message.error('巡检点不在厂区内，请重绘！')
          this.delHandler()
        }
      }
    },
    modifychange(evt, map, feature) {
      // console.log('modify change: ', evt, map, feature)
    },
    moveEnd(camera, map) {
      // console.log(camera)
      // console.log(map)
    },
    closeOverlays() {
      this.$refs.map.closeOverlays()
    },

    editHandler() {
      this.editable = true
      this.closeOverlays()
    },
    delHandler() {
      this.closeOverlays()
      this.$refs[this.symbol][0].layer.getSource().clear()
      this.editable = !this.editable
    },

    saveHandler() {
      const source = this.$refs[this.symbol][0].layer.getSource()
      if (source.getFeatures().length) {
        const geoJSON = new GeoJSON().writeFeatures(source.getFeatures())
        this.$emit('save', geoJSON)
        console.log(geoJSON)
      } else {
        this.$message.error('没有图形元素！')
      }
    },
    setEditType(val) {
      this.editable = val
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../css/base';
.s-box {
  // height: 100%;
  width: 100%;
}
.overlay-menu {
  background: #fff;
  // padding: 6px 10px;
  border-radius: 3px;
  overflow: hidden;
  ul {
    padding: 0;
    margin: 0;
  }
  li {
    list-style: none;
    padding: 2px;
    min-width: 30px;
    text-align: center;
    font-size: 16px;
    border-bottom: 1px solid #eee;
    font-weight: bold;
    &:first-child {
      color: rgb(0, 0, 0);
    }
    &:nth-child(2) {
      color: rgb(121, 27, 215);
    }
    &:hover {
      cursor: pointer;
      background: rgba(197, 225, 255, 0.5);
    }
  }
}
</style>
