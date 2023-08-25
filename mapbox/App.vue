<template>
  <div class="con">
    <div id="map"></div>
    <div class="plan">
      <div @click="click">宝通</div>
      <div @click="mapStyle('black')">黑</div>
      <div @click="mapStyle('white')">白</div>
      <div @click="mapStyle('street')">街</div>
      <div @click="mapStyle('dark')">深</div>
      <div @click="mapStyle('td')">天地卫</div>
      <div @click="mapStyle('dem')">高程图</div>
      <div @click="mapStyle('sjz')">水经注</div>
      <div @click="mapStyle('tenx')">腾讯影像</div>
      <div @click="mapStyle('see')">地平线上的凝视</div>
      <div @click="spin">旋转启停</div>
    </div>
    <div :class="['side', open ? 'open' : '']">
      <span @click="close">close</span>
      <div>公司介绍</div>
      <div @click="click">厂区 ：张公路</div>
      <div @click="scene.setZoomAndCenter(17, [120.458938, 31.530048])">
        厂区 ：梅育路
      </div>
      <div @click="scene.setZoomAndCenter(17, [120.463855, 31.458598])">
        厂区 ：百年通
      </div>
      <div>
        销售网络：<span
          @click="scene.setZoomAndCenter(5, [112.251621, 34.665534])"
          >查看</span
        >
      </div>
      <div>船到桥头必有路</div>
    </div>
    <div class="lng">
      {{ lngLat }}
    </div>
  </div>
</template>

<script>
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import china from "@/area/china.json";
import { Scene, PointLayer, LineLayer, PolygonLayer } from "@antv/l7";
import { Mapbox } from "@antv/l7-maps";
// import { GaodeMap } from "@antv/l7-maps";
// import { DrawControl, ControlEvent } from "@antv/l7-draw";
export default {
  name: "App",
  data() {
    return {
      scene: {},
      lngLat: "",
      userInteracting: false,
      open: false,
      spinEnabled: false,
      river: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [120.416778, 31.562011],
                  [120.416802, 31.562071],
                  [120.416883, 31.562099],
                  [120.420243, 31.559564],
                  [120.420208, 31.559421],
                  [120.416778, 31.562011],
                ],
              ],
            },
          },
        ],
      },
    };
  },
  mounted() {
    this.init();
    this.addLayer();
    this.flyLayer();
  },

  methods: {
    spin() {
      if (this.spinEnabled) {
        this.scene.map.stop();
        this.spinEnabled = !this.spinEnabled;
      } else {
        this.spinEnabled = !this.spinEnabled;
        this.rotate();
      }
    },
    init() {
      mapboxgl.accessToken =
        "pk.eyJ1IjoiY2hlbmdiZW5jaGFvIiwiYSI6ImNsODU3aGRiODA0Y2UzcHBzZmFlcmdqZ2sifQ.8k59W_pB_Riwe6o-MneRlA";
      const vmap = new mapboxgl.Map({
        container: "map", // container id
        style: "http://localhost:1234/api/styles/tiantu", // "mapbox://styles/mapbox/streets-v12",
        // center: [-74.5, 40],
        // zoom: 1.6,
        // minZoom: 0.6,
        // maxZoom: 17.4,
        // projection: "globe",
      });
      const scene = new Scene({
        id: "map",
        map: new Mapbox({
          mapInstance: vmap,
        }),
        logoVisible: false,
        stencil: true,
      });
      this.scene = scene;
      const map = scene.map;
      map.on("style.load", () => {
        const name = map.getStyle().name;
        if (name == "tdt") {
          // map.setFog({
          // "horizon-blend": 0.8,
          // color: "orange",
          // "high-color": "#000",
          // "space-color": "pink",
          // "star-intensity": 0.7,
          // range: [1, 10],
          // });
        } else if (name == "sjz") {
          map.setFog({
            "horizon-blend": 0.01,
            color: "orange",
            "high-color": "#320550",
            "space-color": "#002",
            "star-intensity": 0.3,
            range: [1, 10],
          });
        }

        console.log(map.getStyle(), map.getCanvas());
      });
      // console.log(scene, map, mapboxgl);
      // console.log(vmap, map);
      // scene.setBgColor("#000");

      scene.on("zoom", () => {
        this.userInteracting = true;
        // console.log(scene.getZoom());
        // map.setStyle("mapbox://styles/mapbox/dark-v11");
        // this.botonText();
      });
      scene.on("zoomend", () => {
        setTimeout(() => {
          this.userInteracting = false;
          this.rotate();
        }, 500);

        // console.log(scene.getZoom());
        // map.setStyle("mapbox://styles/mapbox/dark-v11");
        this.botonText();
      });

      map.on("mousedown", () => {
        this.userInteracting = true;
      });
      map.on("mouseup", () => {
        this.userInteracting = false;
        this.rotate();
      });

      map.on("dragend", () => {
        this.userInteracting = false;
        this.rotate();
      });
      map.on("pitchend", () => {
        this.userInteracting = false;
        this.rotate();
      });
      map.on("rotateend", () => {
        this.userInteracting = false;
        this.rotate();
      });
      map.on("moveend", () => {
        this.rotate();
      });
      map.on("mousemove", (e) => {
        this.lngLat = JSON.stringify(e.lngLat.wrap());
      });

      scene.on("loaded", () => {
        // const drawControl = new DrawControl(scene, {});
        // scene.addControl(drawControl);
        // drawControl.on(ControlEvent.DrawChange, (changeType) => {
        //   console.log(changeType);
        // });
      });
    },
    mapStyle(val) {
      switch (val) {
        case "black":
          // const map = this.scene.map
          this.scene.map.setStyle("mapbox://styles/mapbox/dark-v11");
          this.scene.map.on("style.load", () => {
            this.scene.map.addSource("china", {
              type: "geojson",
              data: china,
            });
            this.scene.map.addLayer({
              id: "china",
              type: "fill",
              source: "china", // reference the data source
              minzoom: 0.5,
              maxzoom: 4,
              layout: {},
              paint: {
                "fill-color": "yellow", // blue color fill
                "fill-opacity": 0.8, // 100% opaque
              },
            });
            this.scene.map.addLayer({
              id: "outline",
              type: "line",
              source: "china",
              minzoom: 0.5,
              maxzoom: 4,
              layout: {},
              paint: {
                "line-color": "orange",
                "line-width": 1,
              },
            });
          });

          break;
        case "dem":
          this.scene.map.setStyle(
            "mapbox://styles/mapbox-map-design/claitl3i0002715qm9990tl95"
          );
          setTimeout(() => {
            this.scene.map.flyTo({
              center: [6.6301, 45.35625],
              pitch: 80,
              bearing: 41,
              zoom: 14,
            });
          }, 1500);

          break;
        case "white":
          this.scene.map.setStyle("mapbox://styles/mapbox/light-v11");
          break;
        case "street":
          this.scene.map.setStyle("mapbox://styles/mapbox/streets-v12");
          break;
        case "dark":
          this.scene.map.setStyle(
            "mapbox://styles/mapbox/satellite-streets-v12"
          );

          break;
        case "td":
          this.scene.map.setStyle("http://localhost:1234/api/styles/tiantu");
          break;
        case "sjz":
          this.scene.map.setStyle("http://localhost:1234/api/styles/sjz");
          break;
        case "tenx":
          this.scene.map.setStyle("http://localhost:1234/api/styles/tenx");
          break;
        case "see":
          this.scene.map.flyTo({
            center: [102, 55.7213],
            pitch: 80,
            bearing: 0,
            zoom: 3,
          });
          setTimeout(() => {
            this.spin();
          }, 1000);
          break;

        default:
          this.scene.map.setStyle("http://localhost:1234/api/styles/tiantu");
          break;
      }
    },
    addLayer() {
      const { scene } = this;
      const { map } = scene;
      scene.addImage(
        "marker",
        "https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*BJ6cTpDcuLcAAAAAAAAAAABkARQnAQ"
      );
      scene.addImage(
        "02",
        "https://gw.alipayobjects.com/zos/bmw-prod/ce83fc30-701f-415b-9750-4b146f4b3dd6.svg"
      );
      scene.on("loaded", () => {
        fetch(
          "https://gw.alipayobjects.com/os/basement_prod/e2fc6e0a-af2a-4320-96e5-d9f5a5fda442.json"
        )
          .then((res) => res.json())
          .then((data) => {
            const imageLayer = new PointLayer({
              maxZoom: 17.5,
              minZoom: 10,
            })
              .source(data)
              .shape("marker")
              .setAutoFit()
              .size(12);
            scene.addLayer(imageLayer);
          });

        const riverLayer = new PolygonLayer({
          maxZoom: 17.5,
          minZoom: 10,
        })
          .source(this.river)
          .shape("ocean") //ocean
          .color("#1E90FF")
          .style({
            watercolor: "#6D99A8",
          })
          .animate(true);
        scene.addLayer(riverLayer);

        const bt = new PolygonLayer({
          maxZoom: 17.5,
          minZoom: 10,
        })
          .source({
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: {},
                geometry: {
                  type: "Polygon",
                  coordinates: [
                    [
                      [120.41717100000002, 31.562012999999997],
                      [120.41731000000001, 31.562412999999996],
                      [120.418058, 31.562210999999994],
                      [120.41782400000002, 31.561640999999998],
                      [120.41717100000002, 31.562012999999997],
                    ],
                  ],
                },
              },
            ],
          })
          .shape("extrude")
          .color("#eee")
          .active(true)
          .size(120)
          .style({
            raisingHeight: 10,
            heightfixed: false,
            opacity: 0.6,
          })
          .animate(true);
        scene.addLayer(bt);

        const bntline = new LineLayer({
          maxZoom: 17.5,
          minZoom: 15,
          zIndex: 5,
        })
          .source({
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: {},
                geometry: {
                  type: "LineString",
                  coordinates: [
                    [120.464449, 31.455048],
                    [120.464602, 31.456806],
                    [120.463131, 31.456879],
                    [120.463256, 31.455109],
                    [120.464449, 31.455048],
                  ],
                },
              },
            ],
          })
          .shape("wall")
          .size("ww", () => 10 - this.scene.getZoom())
          .texture("02")
          .animate({
            interval: 1, // 间隔
            duration: 1, // 持续时间，延时
            trailLength: 2, // 流线长度
          })
          .style({
            opacity: "testOpacity",
            lineTexture: true, // 开启线的贴图功能
            iconStep: 300, // 设置贴图纹理的间距
            iconStepCount: 4,
            sourceColor: "#00ff00",
            targetColor: "rbga(255,255,255, 0)",
            heightfixed: false,
          });
        scene.addLayer(bntline);

        const bntline2 = new LineLayer({
          maxZoom: 17.5,
          minZoom: 15,
          zIndex: 5,
        })
          .source({
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: {},
                geometry: {
                  type: "LineString",
                  coordinates: [
                    [120.46465900000001, 31.45705300000001],
                    [120.46482800000004, 31.459851000000008],
                    [120.462119, 31.46002500000001],
                    [120.461956, 31.458055],
                    [120.462483, 31.457117],
                    [120.464647, 31.457042],
                  ],
                },
              },
            ],
          })
          .shape("wall") //ocean
          .size(10)
          .texture("02")
          .style({
            opacity: "testOpacity",
            lineTexture: true, // 开启线的贴图功能
            iconStep: 600, // 设置贴图纹理的间距
            iconStepCount: 1,
            sourceColor: "#0DCCFF",
            targetColor: "rbga(255,255,255, 0)",
            heightfixed: false,
          })
          .animate({
            interval: 3, // 间隔
            duration: 3, // 持续时间，延时
            trailLength: 5, // 流线长度
          });
        scene.addLayer(bntline2);

        // const bntArea = new PolygonLayer({
        //   // maxZoom: 17.5,
        //   // minZoom: 10,
        // })
        //   .source({
        //     type: "FeatureCollection",
        //     features: [
        //       {
        //         type: "Feature",
        //         properties: {},
        //         geometry: {
        //           type: "Polygon",
        //           coordinates: [
        //             [
        //               [120.46485899999998, 31.459878],
        //               [120.46448500000001, 31.454995000000007],
        //               [120.46326099999997, 31.455058000000005],
        //               [120.46178999999954, 31.458124000000137],
        //               [120.46211999999956, 31.460060000000137],
        //               [120.46485899999998, 31.459878],
        //             ],
        //           ],
        //         },
        //       },
        //     ],
        //   })
        //   .shape("fill")
        //   .color("#1E90FF")
        //   .style({
        //     opacity: 0.5,
        //     stroke: "white",
        //     // raisingHeight: 200,
        //     // strokeWidth: 3,
        //   })
        //   .active(true);
        // scene.addLayer(bntArea);

        const bnt = new PointLayer({
          maxZoom: 17.5,
          minZoom: 10,
        })
          .source({
            type: "Feature",
            properties: {
              id: "B0H0M5KPOV",
              name: "无锡百年通工业输送有限公司",
              district: "江苏省无锡市新吴区",
              adcode: "320214",
              location: "120.468157,31.456707",
              address: "里河路",
              typecode: "170200",
              city: [],
              longitude: 120.468157,
              latitude: 31.456707,
            },
            geometry: {
              type: "Point",
              coordinates: [120.468157, 31.456707],
            },
          })
          .shape("simple") //ocean
          .size(15)
          .color("#1E90FF")
          .style({
            opacity: 0.6,
            strokeWidth: 3,
          })
          .animate(true);
        scene.addLayer(bnt);
      });

      map.on("load", () => {
        fetch(
          "https://gw.alipayobjects.com/os/basement_prod/e2fc6e0a-af2a-4320-96e5-d9f5a5fda442.json"
        )
          .then((res) => res.json())
          .then((data) => {
            map.addSource("point", {
              type: "geojson",
              data,
            });
            map.addLayer({
              id: "point",
              type: "circle",
              source: "point", // reference the data source
              layout: {},
              paint: {
                "circle-color": "#4264fb",
                "circle-radius": 6,
                "circle-stroke-width": 2,
                "circle-stroke-color": "#ffffff",
              },
            });
          });
        map.addSource("china", {
          type: "geojson",
          data: china,
        });
        map.addLayer({
          id: "china",
          type: "fill",
          source: "china", // reference the data source
          minzoom: 0.5,
          maxzoom: 4,
          layout: {},
          paint: {
            "fill-color": "yellow", // blue color fill
            "fill-opacity": 0.3, // 100% opaque
          },
        });
        map.addLayer({
          id: "outline",
          type: "line",
          source: "china",
          minzoom: 0.5,
          maxzoom: 4,
          layout: {},
          paint: {
            "line-color": "orange",
            "line-width": 1,
          },
        });
        map.on("click", "china", (e) => {
          console.log(e.features[0].geometry.coordinates);
        });
      });
      map.on("click", "point", (e) => {
        map.flyTo({
          center: e.features[0].geometry.coordinates,
          essential: true,
          pitch: 20,
          zoom: 10,
        });
      });

      map.on("mouseenter", "point", () => {
        map.getCanvas().style.cursor = "pointer";
        console.log(map);
      });

      map.on("mouseleave", "point", () => {
        map.getCanvas().style.cursor = "";
      });
    },
    flyLayer() {
      const { scene } = this;
      scene.addImage(
        "plane",
        "https://gw.alipayobjects.com/zos/bmw-prod/0ca1668e-38c2-4010-8568-b57cb33839b9.svg"
      );
      scene.on("loaded", () => {
        const data = {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: [
                  [120.41759050057516, 31.562043036368536],
                  [103.827742, 36.067946],
                ],
              },
            },
          ],
        };
        const dotPoint = new PointLayer({
          minZoom: 4,
          maxZoom: 10,
        })
          .source(
            [
              { lng: 120.41759050057516, lat: 31.562043036368536 },
              { lng: 103.827742, lat: 36.067946 },
            ],
            {
              parser: {
                type: "json",
                x: "lng",
                y: "lat",
              },
            }
          )
          .shape("circle")
          .color("#ffed11")
          .animate(true)
          .size(40);
        const flyLine = new LineLayer({
          blend: "normal",
          minZoom: 4,
          maxZoom: 10,
        })
          .source(data)
          .color("#ff6b34")
          .texture("plane")
          .shape("arc")
          .size(15)
          .animate({
            duration: 1,
            interval: 0.2,
            trailLength: 0.05,
          })
          .style({
            textureBlend: "replace",
            lineTexture: true, // 开启线的贴图功能
            iconStep: 10, // 设置贴图纹理的间距
          });

        const flyLine2 = new LineLayer({ minZoom: 4, maxZoom: 10 })
          .source(data)
          .color("#ff6b34")
          .shape("arc")
          .size(1)
          .style({
            lineType: "dash",
            dashArray: [5, 5],
            opacity: 0.5,
          });
        scene.addLayer(dotPoint);
        scene.addLayer(flyLine2);
        scene.addLayer(flyLine);
      });
    },
    click() {
      this.scene.map.stop();
      // console.log(this.scene.getCenter());
      this.scene.setZoomAndCenter(
        17.3,
        [120.41759050057516, 31.562043036368536]
      );
    },
    botonText() {
      if (this.kk) return;
      this.kk = true;
      const bntText2 = new PointLayer({
        name: "txt",
        maxZoom: 17.5,
        minZoom: 15,
      })
        .source(
          [
            {
              j: 120.463856,
              w: 31.45597,
              m: "宝通科技办公楼",
            },
          ],
          {
            parser: {
              type: "json",
              x: "j",
              y: "w",
            },
          }
        )
        .shape("m", "text")
        .size(16)
        .color("yellow")
        .style({
          textAnchor: "center", // 文本相对锚点的位置 center|left|right|top|bottom|top-left
          textOffset: [0, 0], // 文本相对锚点的偏移量 [水平, 垂直]
          spacing: 2, // 字符间距
          padding: [1, 1], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
          stroke: "red", // 描边颜色
          strokeWidth: 1.2, // 描边宽度
          strokeOpacity: 1.0,
          raisingHeight: 10,
          heightfixed: true,
        });
      this.scene.addLayer(bntText2);

      const bntText = new PointLayer({
        name: "txt",
        maxZoom: 17.5,
        minZoom: 15,
      })
        .source(
          [
            {
              j: 120.46331,
              w: 31.45812,
              m: "百年通皮带生产区",
            },
          ],
          {
            parser: {
              type: "json",
              x: "j",
              y: "w",
            },
          }
        )
        .shape("m", "text")
        .size(16)
        .color("yellow")
        .style({
          textAnchor: "center", // 文本相对锚点的位置 center|left|right|top|bottom|top-left
          textOffset: [0, 0], // 文本相对锚点的偏移量 [水平, 垂直]
          spacing: 2, // 字符间距
          padding: [1, 1], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
          stroke: "red", // 描边颜色
          strokeWidth: 1.2, // 描边宽度
          strokeOpacity: 1.0,
          raisingHeight: 10,
          heightfixed: true,
        });
      this.scene.addLayer(bntText);
      bntText.on("click", () => {
        window.open("http://10.12.14.12:88/");
      });

      const pointLayer = new PointLayer({
        name: "txt",
        maxZoom: 17.5,
        minZoom: 15,
      })
        .source(
          [
            {
              j: 120.41759050057516,
              w: 31.562043036368536,
              m: "宝通科技(文鑫控股)",
            },
          ],
          {
            parser: {
              type: "json",
              x: "j",
              y: "w",
            },
          }
        )
        .shape("m", "text")
        .size(16)
        .color("yellow")
        .style({
          textAnchor: "center", // 文本相对锚点的位置 center|left|right|top|bottom|top-left
          textOffset: [0, 10], // 文本相对锚点的偏移量 [水平, 垂直]
          spacing: 2, // 字符间距
          padding: [1, 1], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
          stroke: "red", // 描边颜色
          strokeWidth: 1.2, // 描边宽度
          strokeOpacity: 1.0,
          raisingHeight: 800,
          heightfixed: true,
        })
        .animate({
          enable: true,
        });

      pointLayer.on("click", () => {
        // window.open("");
        this.open = true;
        // this.scene.map.easeTo({ padding: { right: 320 } });
      });
      this.scene.addLayer(pointLayer);
    },

    rotate() {
      const { map } = this.scene;
      const secondsPerRevolution = 120;
      const maxSpinZoom = 5;
      const slowSpinZoom = 3;
      const zoom = map.getZoom();
      if (this.spinEnabled && !this.userInteracting && zoom < maxSpinZoom) {
        let distancePerSecond = 360 / secondsPerRevolution;
        if (zoom > slowSpinZoom) {
          const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
          distancePerSecond *= zoomDif;
        }
        const center = map.getCenter();
        center.lng -= distancePerSecond * 0.015;
        map.easeTo({ center, duration: 10, easing: (n) => n });
      }
    },

    close() {
      this.open = false;
      // this.scene.map.easeTo({ padding: { right: 0 } });
      // this.scene.map.flyTo({
      //   center: [-74.5, 40],
      //   pitch: 20,
      //   zoom: 0.6,
      // });
      this.scene.setZoomAndCenter(0.55, [-74.5, 40]);
    },
  },
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.mapboxgl-map {
  /* filter: hue-rotate(169deg); */
}
#map {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}
.plan {
  background: rgba(255, 255, 255, 0.2);
  position: absolute;
  top: 0;
  left: 0;
  font-size: 12px;
  color: #c6dfff;
}
.plan div {
  padding: 5px 10px;
  cursor: pointer;
}
.plan div:hover {
  background: #4d96f6;
}
.side {
  position: absolute;
  top: 0;
  right: -320px;
  background: rgba(255, 255, 255, 0.5);
  padding: 10px;
  height: calc(100vh - 20px);
  width: 300px;
  transition: all 500ms cubic-bezier(0.39, 0.575, 0.565, 1);
  z-index: 9999;
}
.side.open {
  right: 0;
}
.lng {
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 5px;
  background: rgba(255, 255, 255, 0.2);
  font-size: 12px;
}
.l7-marker-container {
  display: none;
}
</style>
