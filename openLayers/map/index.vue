<template>
  <div class="s-box">
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
        :draw-type="drawType"
        :page-type="pageType"
        :visible="!editable"
        @changeTile="changeTile"
        @changeDrawType="changeDrawType"
        @edit="setEditType"
        @saveHandler="saveHandler"
      ></v-tool>
      <v-tile :tile-type="tile"></v-tile>
      <v-vector
        ref="layer1"
        layer-id="layer1"
        :features="features2"
        :visible="visible1"
        :z-index="3"
        :select="false"
        :modify="modify"
        @select="onselect"
        @modifystart="modifystart"
        @modifyend="modifyend"
        @modifychange="modifychange"
      ></v-vector>
      <!-- <v-vector
          :features="features2"
          :modify="modify"
          :visible="visible2"
          select
          :z-index="4"
          @select="onselect"
          @modifystart="modifystart"
          @modifyend="modifyend"
          @modifychange="modifychange"
        ></v-vector> -->
      <v-draw
        ref="drawLayer"
        layer-id="darwLayer"
        :type="drawType"
        end-right
        :editable="editable"
        @drawend="drawend"
        @drawstart="drawstart"
        @modifyend="modifyend"
        @select="onselect"
      ></v-draw>
      <v-overlay class="overlay-menu" :position="positionMenu">
        <ul>
          <li @click="delHandler"><i class="el-icon-error"></i></li>
          <!-- <li v-show="!editable" @click="editHandler">
            <i class="el-icon-edit"></i>
          </li> -->
        </ul>
      </v-overlay>
    </v-map>
  </div>
</template>

<script>
  import { translateTitle } from '../../i18n'
  export default {
    name: 'BtMap',
    props: {
      pageType: {
        type: String,
        default: 'area',
      },
    },
    data() {
      return {
        location_lon: '',
        location_lat: '', // 经度,纬度
        mapLoaded: false,
        mapZoom: 5,
        addModify: false,
        editable: false,
        view: {
          center: [118.1689, 24.6478],
          zoom: 13,
          maxZoom: 18,
        },
        controls: {
          attribution: false,
          zoom: false,
          rotate: false,
          // rotateOptions: {
          //   className: 'ol-rotate-custom',
          // },
          FullScreen: true,
          ScaleLine: true,
          ZoomSlider: false,
        },
        // rotateWithView: false,
        // interactions: {
        //   DragRotateAndZoom: true,
        //   doubleClickZoom: false,
        // },
        // perspectiveMap: {
        //   pitch: 0,
        //   roll: 0,
        //   heading: 0,
        // },
        tile: 'TD_IMG',
        modify: false,
        // select: {
        //   style: {
        //     stroke: {
        //       color: 'red',
        //       width: 3,
        //     },
        //   },
        // },
        features2: [
          {
            id: 'polygon',
            type: 'polygon', // 除了普通icon点位，其他元素需注明元素类型
            style: {
              fill: {
                color: 'rgba(67,126,152,0.15)',
              },
              stroke: {
                color: 'rgba(67,126,255,1)',
                width: 1,
                lineDash: [20, 10, 20, 10],
              },
              text: {
                text: '多边形',
                font: '13px sans-serif',
                fill: {
                  color: '#3d73e8',
                },
              },
            },
            updateStyle: {
              fill: {
                color: 'rgba(4,3,43,0.5)',
              },
            },
            coordinates: [
              [118.23048075355373, 24.587052571002776],
              [118.25051461705989, 24.592192894082423],
              [118.24383041710121, 24.561810933485354],
              [118.23048075355373, 24.587052571002776],
            ],
          },
          {
            type: 'polyline',
            style: {
              stroke: {
                color: 'rgba(220,171,119,1)',
                width: 2,
                // lineDash: [20, 10, 20, 10]
              },
              text: {
                text: 'line',
              },
            },
            coordinates: [
              [118.20513460817911, 24.6005204040184],
              [118.22511304202654, 24.607323827184675],
              [118.22998527470209, 24.627570481933592],
            ],
          },
          {
            type: 'circle',
            center: [118.25945470514871, 24.608883531726836],
            radius: 500,
            style: {
              text: {
                text: '圆形',
              },
            },
          },
        ],
        // toggleCluster: false,
        // clusterOption: {
        //   distance: 120,
        // },
        // positionCluster: undefined,
        // clusterFeatures: [],
        visible1: true,
        visible2: true,
        // features: [
        //   {
        //     id: 'point1',
        //     coordinates: [118.140448, 24.512917],
        //     convert: 'bd-84', // 特殊属性，经纬度转化。支持：百度(bd)、高德(gd)、wgs84(84)互转
        //     style: {
        //       icon: {
        //         scale: 0.6,
        //         src: require('@/assets/img/point_6.png'),
        //         // src: new URL("./assets/img/point_3.png", import.meta.url).href,
        //       },
        //       text: {
        //         text: '百度转84',
        //         font: '13px sans-serif',
        //         fill: {
        //           color: '#3d73e8',
        //         },
        //         backgroundFill: {
        //           color: '#ffffff',
        //         },
        //         stroke: {
        //           color: '#ffffff',
        //           width: 1,
        //         },
        //         backgroundStroke: {
        //           color: '#000000',
        //           width: 1,
        //         },
        //         offsetX: 0,
        //         offsetY: 30,
        //       },
        //       styleFunction: function (feature, resolution, map, style) {
        //         const viewZoom = map.getView().getZoom()
        //         const minZoom = 12
        //         const maxZoom = 16
        //         const textStyle = style.getText()
        //         if (viewZoom >= 14) {
        //           textStyle.setText('百度转84')
        //         }
        //         if (viewZoom >= 15) {
        //           textStyle.setText('根据层级显示不同内容')
        //         }
        //         style.setText(textStyle)
        //         return minZoom <= viewZoom && viewZoom <= maxZoom ? style : null
        //       },
        //     },
        //     properties: {
        //       name: 'feature1',
        //       level: 1,
        //     },
        //     flash: {
        //       rate: 1,
        //       color: 'green',
        //     },
        //     noCluster: true,
        //   },
        //   {
        //     id: 'point2',
        //     coordinates: [118.168742, 24.487505],
        //     style: {
        //       icon: {
        //         scale: 0.6,
        //         src: require('@/assets/img/point_5.png'),
        //         // src: new URL("./assets/img/point_4.png", import.meta.url).href,
        //       },
        //     },
        //     properties: {
        //       name: 'feature1',
        //       level: 2,
        //     },
        //     flash: {
        //       rate: 2,
        //       color: 'orange',
        //     },
        //     noCluster: true,
        //   },
        //   {
        //     id: 'point3',
        //     coordinates: [118.1401534526062, 24.461376055501933],
        //     style: {
        //       icon: {
        //         scale: 0.6,
        //         src: require('@/assets/img/point_5.png'),
        //         // src: new URL("./assets/img/point_2.png", import.meta.url).href,
        //       },
        //     },
        //     properties: {
        //       level: 3,
        //     },
        //     flash: {
        //       color: 'red',
        //     },
        //     noCluster: true,
        //   },
        //   {
        //     id: 'point4',
        //     coordinates: [118.102941, 24.454704],
        //     style: {},
        //     noCluster: true,
        //   },
        //   {
        //     id: 'circleCenter',
        //     coordinates: [0, 0],
        //     style: {
        //       circle: {
        //         radius: 4,
        //         stroke: {
        //           color: 'rgba(0,0,0,0.4)',
        //           width: 2,
        //         },
        //         fill: {
        //           color: 'rgba(255,255,255,0.4)',
        //         },
        //       },
        //     },
        //   },
        //   {
        //     id: 'circleEdge',
        //     coordinates: [0, 0],
        //     style: {
        //       circle: {
        //         radius: 4,
        //         stroke: {
        //           color: 'rgba(0,0,0,0.4)',
        //           width: 2,
        //         },
        //         fill: {
        //           color: 'rgba(255,255,255,0.4)',
        //         },
        //       },
        //     },
        //   },
        // ],
        radius: 0,
        positionRadius: undefined,
        position: undefined,
        positionLevel: undefined,
        positionMenu: undefined,
        level: undefined,
        drawType: null,
        currentCoordinateText: '',
      }
    },
    mounted() {
      this.getDrivePosition()
    },
    methods: {
      translateTitle,
      getDrivePosition() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              this.location_lon = position.coords.longitude
              this.location_lat = position.coords.latitude
              console.log(position)
            },
            (e) => {
              console.log(e)
            }
          )
        }
      },
      getRandomIntegerInRange(min, max) {
        return Math.floor((max + 1 - min) * Math.random() + min)
      },
      // addClusterFeatures(count = 1000) {
      //   for (let i = 0; i < count; i++) {
      //     this.features.push({
      //       coordinates: [117.6 + Math.random(), 24.1 + Math.random()],
      //       style: {
      //         icon: {
      //           // src: new URL(
      //           //   `./assets/img/point_${this.getRandomIntegerInRange(1, 6)}.png`,
      //           //   import.meta.url
      //           // ).href,
      //           scale: 0.6,
      //         },
      //       },
      //       name: `聚合要素-${i + 1}`,
      //     })
      //   }
      // },
      // setModify() {
      //   this.addModify = !this.addModify
      //   if (this.addModify) {
      //     this.features2.push({
      //       id: 'add',
      //       type: 'circle',
      //       center: [0, 0],
      //       radius: 400,
      //     })
      //   }
      // },
      onClick(evt, map) {
        // console.log(evt)
        this.currentCoordinateText = [
          evt.coordinate[0].toFixed(6),
          evt.coordinate[1].toFixed(6),
        ].join(',')
        this.positionMenu = undefined
        // if (this.addModify && !this.drawType && !this.measureType) {
        //   this.features2[3].center = evt.coordinate
        //   this.features.forEach((feature) => {
        //     if (feature.id === 'circleCenter') {
        //       feature.coordinates = evt.coordinate
        //     }
        //   })
        //   this.addModify = false
        //   // this.$refs.map.panTo({
        //   //   center: evt.coordinate,
        //   //   zoom: 15
        //   // })
        // }
      },

      // changeZoom(evt, map) {
      //   this.mapZoom = map.getView().getZoom()
      //   if (this.mapZoom >= 16) {
      //     this.toggleCluster = true
      //   } else {
      //     this.toggleCluster = false
      //   }
      // },

      onContextmenu(evt, map, hit) {
        //右键菜单
        if (this.drawType) {
          this.drawType = null
        } else {
          if (hit) {
            this.positionMenu = evt.coordinate
            map.forEachSmFeatureAtPixel(
              evt.pixel,
              (feature, layer) => {
                console.log(feature, layer.get('id'))
              },
              {},
              evt
            )
          }
        }
      },
      onClickFeature(feature, layer, evt) {
        // console.log(feature)
        // console.log(layer.get('id'))
        // console.log(evt)
        // if (this.drawType || this.measureType) return
        // if (layer.get('id') === 'layer1' && feature.getId() === 'point4') {
        //   this.position = evt.coordinate
        // }
        // if (layer.get('cluster')) {
        //   const coordinates = feature.getGeometry().getCoordinates()
        //   console.log(coordinates)
        //   this.clusterFeatures = []
        //   feature.get('features').forEach((feature) => {
        //     console.log(feature)
        //     this.clusterFeatures.push({
        //       name: feature.get('name'),
        //     })
        //   })
        //   this.positionCluster = coordinates
        // }
      },
      onDblClick(evt, map) {
        // console.log(evt)
        this.position = undefined
      },
      onDblclickfeature(feature, layer, evt, map) {
        const coordinates = feature.getGeometry().getCoordinates()
        if (layer) {
          console.log(layer.get('type'), coordinates)
        }
      },
      pointermove(evt, map) {
        const pixel = map.getEventPixel(evt.originalEvent)
        const hit = map.hasFeatureAtPixel(pixel)
        if (hit) {
          const features = map.getFeaturesAtPixel(pixel)
          if (features.length > 0) {
            features.forEach((feature) => {
              if (this.toggleCluster) {
                features.forEach((item) => {
                  const clusterFeatures = item.get('features')
                  if (clusterFeatures && clusterFeatures.length > 0) {
                    clusterFeatures.forEach((el) => {
                      const properties = el.get('properties')
                      if (
                        properties &&
                        Object.prototype.hasOwnProperty.call(
                          properties,
                          'level'
                        )
                      ) {
                        this.level = properties.level
                        this.positionLevel = el.get('coordinates')
                      }
                    })
                  }
                })
              } else {
                const properties = feature.get('properties')
                if (
                  properties &&
                  Object.prototype.hasOwnProperty.call(properties, 'level')
                ) {
                  this.level = properties.level
                  this.positionLevel = feature.get('coordinates')
                }
              }
            })
          }
        }
      },
      changeTile(val) {
        this.tile = val
      },
      changeDrawType(val) {
        this.drawType = val
      },
      onLoadTrack(track) {
        console.log(track)
      },
      // startTrack() {
      //   if (this.$refs.track) {
      //     this.$refs.track.start()
      //   } else {
      //     alert('track unload')
      //   }
      // },
      // pauseTrack() {
      //   if (this.$refs.track) {
      //     this.$refs.track.pause()
      //   } else {
      //     alert('track unload')
      //   }
      // },
      // stopTrack() {
      //   if (this.$refs.track) {
      //     this.$refs.track.stop()
      //   } else {
      //     alert('track unload')
      //   }
      // },
      // disposeTrack() {
      //   if (this.$refs.track) {
      //     // this.track.paths = []
      //     this.$refs.track.dispose()
      //   } else {
      //     alert('track unload')
      //   }
      // },
      drawstart(evt, map) {
        // const pixel = map.getEventPixel(evt.originalEvent)
        // const hit = map.hasFeatureAtPixel(pixel)
        // console.log(evt.pixel)
        // map.forEachSmFeatureAtPixel(
        //   evt.pixel,
        //   (i, e) => {
        //     console.log(i, e)
        //   },
        //   {},
        //   evt
        // )
        // const layers = map.getLayers()
        // console.log('drawstart:', evt, layers)
        // map.getLayers().forEach((item) => {
        //   console.log(item.get('id'))
        // })
      },
      drawend(evt, map) {
        const feature = evt.feature
        const geometry = feature.getGeometry()
        const extent = geometry.getExtent()
        const inExtent = []
        console.log('on drawend: ')
        this.drawType = null
        setTimeout(() => {
          this.editable = !this.editable
        }, 260)

        // this.$refs.layer1.layer
        //   .getSource()
        //   .forEachFeatureInExtent(extent, (feature) => {
        //     if (feature.get("flash")) {
        //       inExtent.push(feature);
        //     }
        //   });
        // this.$refs.map.updateFeature(feature, "style", {
        //   text: {
        //     text: `范围内包含${inExtent.length}个预警点`,
        //     fill: {
        //       color: "white",
        //     },
        //     offsetY: 20,
        //   },
        // });
      },

      onselect(evt, map) {
        console.log('on select: ', evt, map)
      },
      modifystart(evt, map) {
        console.log('modify start: ', evt, map)
      },
      modifyend(evt, map) {
        console.log('modify end: ', evt, map)
      },
      modifychange(evt, map, feature) {
        console.log('modify change: ', evt, map, feature)
        // if (feature.getId() === 'add') {
        //   const Geometry = feature.getGeometry()
        //   const center = this.$refs.map.calculateCenter(Geometry)
        //   console.log(center)
        //   const radius = Geometry.getRadius() // 半径
        //   const metersPerUnit = map.getView().getProjection().getMetersPerUnit() // 半径以米为单位
        //   const extent = Geometry.getExtent()
        //   this.positionRadius = [extent[2], (extent[3] + extent[1]) / 2]
        //   this.radius = (radius * metersPerUnit).toFixed(2)
        //   this.features.forEach((feature) => {
        //     if (feature.id === 'circleCenter') {
        //       feature.coordinates = center.center
        //     }
        //     if (feature.id === 'circleEdge') {
        //       feature.coordinates = this.positionRadius
        //     }
        //   })
        // }
      },
      moveEnd(camera, map) {
        // console.log(camera)
        // console.log(map)
      },
      closeOverlays() {
        this.$refs.map.closeOverlays()
      },
      // drawHandler(type) {
      //   this.positionMenu = undefined
      //   if (this.drawType && this.drawType === type) {
      //     this.$refs.drawLayer.setActive(true)
      //   }
      //   this.drawType = type
      // },
      // measureHandler(type) {
      //   this.positionMenu = undefined
      //   if (this.measureType && this.measureType === type) {
      //     this.$refs.measureLayer.setActive(true)
      //   }
      //   this.measureType = type
      // },

      editHandler() {
        this.editable = true
        this.closeOverlays()
      },
      delHandler() {
        this.closeOverlays()

        if (false) {
        } else {
          this.$refs.drawLayer.layer.getSource().clear()
          this.editable = !this.editable
        }
      },

      saveHandler(map) {
        // if (this.drawType) {
        //   map.map.getLayers().forEach((i) => {
        //     console.log(i.get('id'))
        //   })
        // } else {
        // }
        console.log(this.$refs.drawLayer.layer.getSource())
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
    height: calc(100vh - 200px);
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
