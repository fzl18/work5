<template>
  <div id="index">
    <Container class="bg" ref="container">
      <div v-if="loading" style="width:1800px;height:980px;">
        <Loading>Loading...</Loading>
      </div>
      <div v-else class="host-body">
        <Topheader ref="head" :class="['animation', header]" />
        <div class="frame">
          <div class="left" :class="['animation2', leftbox, calcHeight]">
            <div class="box">
              <template v-for="item in $store.state.leftChartsItem">
                <div :class="item" v-if="$store.state[`${item}On`]" :key="item">
                  <div class="tit">
                    <div class="name">{{ getChartTitle(item) }}</div>
                    <div class="btn">
                      <span
                        @click="handleMonth('+', searchDate.isBefore(today))"
                        v-if="showType(item) !== 1"
                      ></span>
                      <span
                        @click="
                          handleMonth(
                            '-',
                            searchDate.isAfter(today.subtract(6, 'M'))
                          )
                        "
                        v-if="showType(item) !== 1"
                      ></span>
                    </div>
                  </div>
                  <div
                    :is="item"
                    :data="getChartData(item)"
                    v-if="showType(item) === 2 || showType(item) === 1"
                  />

                  <div class="context" v-if="showType(item) === 3">
                    <div :is="item" :data="getChartData(item)" />
                    <img src="@/assets/img/hu.png" alt="" />
                    <div class="info">
                      <div>已完成工单:{{ chart5Data.workOrderComplete }}</div>
                      <div>待验收工单:{{ chart5Data.workOrderUnaccepted }}</div>
                      <div>超时未完成:{{ chart5Data.workOrderTimeout }}</div>
                    </div>
                  </div>

                  <div class="context" v-if="showType(item) === 4">
                    <div :is="item" :data="getChartData(item)" />
                    <div class="info">
                      <div>
                        首次成功维修:{{ chart6Data.maintainFirstSuccessCnt }}%
                      </div>
                      <div>
                        维修后复现:{{ chart6Data.maintainRecurrentCnt }}%
                      </div>
                      <div>未完成维修:{{ chart6Data.maintainNotCnt }}</div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
          <div
            class="mid"
            :style="{ height: $store.state.isFullscreen ? '786px' : '696px' }"
          >
            <div class="horn tl"></div>
            <div class="horn tr"></div>
            <div class="horn bl"></div>
            <div class="horn br"></div>
            <div class="box">
              <Effect class="sea" v-if="$store.state.curObjLevel !== 4" />
              <div class="map" :class="['animation4', mapbox]">
                <World ref="world" />
                <Country ref="country" />
                <Province ref="province" />
                <Citys ref="citys" />
                <Factorys ref="factorys" />
              </div>
            </div>
            <!-- <div
              class="earth"
              v-show="$store.state.curObjLevel == 0"
              :style="
                $store.state.curProvince
                  ? 'animation:none;transform: scale(0.1);right: 5%;top: -20%;'
                  : ''
              "
            >
              <img src="@/assets/img/bigball.png" alt="" />
            </div> -->

            <div>
              <Nav ref="nav" />
            </div>
            <div class="newbar">
              <News ref="news" :data="newsData" />
            </div>
          </div>

          <div class="right" :class="['animation3', rightbox, calcHeight]">
            <DateTime />
            <div class="box">
              <template v-for="item in $store.state.rightChartsItem">
                <div :class="item" v-if="$store.state[`${item}On`]" :key="item">
                  <div class="tit">
                    <div class="name">{{ getChartTitle(item) }}</div>
                    <div class="btn">
                      <span
                        @click="handleMonth('+', searchDate.isBefore(today))"
                        v-show="showType(item) !== 1"
                      ></span>
                      <span
                        @click="
                          handleMonth(
                            '-',
                            searchDate.isAfter(today.subtract(6, 'M'))
                          )
                        "
                        v-show="showType(item) !== 1"
                      ></span>
                    </div>
                  </div>
                  <div
                    :is="item"
                    :data="getChartData(item)"
                    v-if="showType(item) === 2 || showType(item) === 1"
                  />

                  <div class="context" v-if="showType(item) === 3">
                    <div :is="item" :data="getChartData(item)" />
                    <img src="@/assets/img/hu.png" alt="" />
                    <div class="info">
                      <div>已完成工单:{{ chart5Data.workOrderComplete }}</div>
                      <div>待验收工单:{{ chart5Data.workOrderUnaccepted }}</div>
                      <div>超时未完成:{{ chart5Data.workOrderTimeout }}</div>
                    </div>
                  </div>

                  <div class="context" v-if="showType(item) === 4">
                    <div :is="item" :data="getChartData(item)" />
                    <div class="info">
                      <div>
                        首次修复率:{{ chart6Data.maintainFirstSuccessCnt }}%
                      </div>
                      <div>
                        维修后复现:{{ chart6Data.maintainRecurrentCnt }}
                      </div>
                      <div>未完成维修:{{ chart6Data.maintainNotCnt }}</div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
            <Zoom ref="zoom" class="zoom" />
          </div>
        </div>
        <!-- <Background /> -->
      </div>
    </Container>
  </div>
</template>

<script>
import Container from "./components/container";
import Topheader from "./components/topheader";
import Zoom from "./components/zoom";
import Nav from "./components/nav";
import News from "./components/news";
import Background from "./components/background";
import DateTime from "./components/dateTime";
import Loading from "./components/loading";
import Effect from "./components/effect";
import Draggable from "vuedraggable";
import chart1 from "../components/echart/chart1";
import chart2 from "../components/echart/chart2";
import chart3 from "../components/echart/chart3";
import chart4 from "../components/echart/chart4";
import chart5 from "../components/echart/chart5";
import chart6 from "../components/echart/chart6";
import chart7 from "../components/echart/chart7";
import World from "./world.vue";
import Country from "./country.vue";
import Factorys from "./factorys.vue";
import Province from "./province.vue";
import Citys from "./citys.vue";
import MarqueeLeft from "./components/marqueeLeft.vue";
import dayjs from "dayjs";
import {
  dailycheck, // 今日设备点检情况
  equipmentMaintain, // 本月设备故障维修率
  equipmentWarning, // 本月设备监测预警统计
  inspectioncheck, // 今日设备巡检情况
  inspectionLineTask, // 本月输送线巡检任务统计
  inspectionTask, // 本月巡检任务执行趋势
  workOrder, // 本月工单按时完成率
  query,
} from "./api/charts";
import {
  cardSumary, // 输送线卡片模式日周月汇总
  lineInfo, // 输送线滚动信息
} from "./api/monitorLine";

export default {
  data() {
    return {
      loading: true,
      chart1Data: {},
      chart2Data: {},
      chart3Data: {},
      chart4Data: {},
      chart5Data: {},
      chart6Data: {},
      chart7Data: {},
      newsData: [],
      paramsData: {},
      header: "",
      leftbox: "",
      rightbox: "",
      mapbox: "",
      mapShow: false,
      searchDate: dayjs(),
      today: dayjs(),
    };
  },
  components: {
    Loading,
    Container,
    Topheader,
    Zoom,
    DateTime,
    Draggable,
    Nav,
    News,
    chart1,
    chart2,
    chart3,
    chart4,
    chart5,
    chart6,
    chart7,
    Factorys,
    World,
    Province,
    Citys,
    Country,
    Loading,
    Effect,
    Background,
    MarqueeLeft,
  },
  computed: {
    calcHeight() {
      return this.$store.state.isFullscreen ? "fh" : "sh";
    },
  },
  mounted() {
    this.cancelLoading();
    query(this.$store.state.userinfo.userCode).then((res) => {
      if (res.data) {
        const { chartListLeft, chartListRight } = res.data;
        const left = chartListLeft.split(",");
        const right = chartListRight.split(",");
        const leftItem = [],
          rightItem = [];
        left.forEach((item) => {
          leftItem.push(item.split("|")[0]);
          this.$store.state[`${item.split("|")[0]}On`] =
            item.split("|")[1] * 1 == 1;
        });
        right.forEach((item) => {
          rightItem.push(item.split("|")[0]);
          this.$store.state[`${item.split("|")[0]}On`] =
            item.split("|")[1] * 1 == 1;
        });
        this.$store.state.leftChartsItem = leftItem;
        this.$store.state.rightChartsItem = rightItem;
      }
    });

    setTimeout(() => {
      this.header = "header";
    }, 1000);
    setTimeout(() => {
      this.leftbox = "leftbox";
    }, 2000);
    setTimeout(() => {
      this.rightbox = "rightbox";
      this.mapShow = true;
    }, 2000);
    setTimeout(() => {
      this.mapbox = "mapbox";
    }, 1000);
  },
  watch: {
    "$store.state.curObjLevel"(val) {
      this.getChartsData(true);
    },
  },
  methods: {
    getChartsData(init) {
      let date = this.searchDate.format("YYYY-MM");
      if (init) {
        cardSumary().then((res) => {
          if (res.success) {
            this.$store.state.paramsData = res.data;
          }
        });
        lineInfo().then((res) => {
          if (res.success) {
            this.newsData = res.data;
          }
        });
        dailycheck().then((res) => {
          if (res.success) {
            this.chart1Data = res.data;
          }
        });
        inspectioncheck().then((res) => {
          if (res.success) {
            this.chart2Data = res.data;
          }
        });
      }

      equipmentMaintain(date).then((res) => {
        if (res.success) {
          this.chart6Data = res.data || {};
        }
      });
      equipmentWarning(date).then((res) => {
        if (res.success) {
          this.chart7Data = { data: res.data };
        }
      });

      inspectionLineTask(date).then((res) => {
        if (res.success) {
          this.chart4Data = { data: res.data };
        }
      });
      inspectionTask(date).then((res) => {
        if (res.success) {
          this.chart3Data = { data: res.data };
        }
      });
      workOrder(date).then((res) => {
        if (res.success) {
          this.chart5Data = res.data || {};
        }
      });
    },
    cancelLoading() {
      setTimeout(() => {
        this.loading = false;
      }, 500);
    },
    getChartData(item) {
      return this[item + "Data"];
    },
    getChartTitle(item) {
      switch (item) {
        case "chart1":
          return "今日设备点检情况";
          break;
        case "chart2":
          return "今日设备巡检情况";
          break;
        case "chart3":
          return `${this.searchDate.format("MM")}月巡检任务执行趋势`;
          break;
        case "chart4":
          return `${this.searchDate.format("MM")}月输送线巡检任务统计`;
          break;
        case "chart5":
          return `${this.searchDate.format("MM")}月工单按时完成率`;
          break;
        case "chart6":
          return `${this.searchDate.format("MM")}月设备故障维修率`;
          break;
        case "chart7":
          return `${this.searchDate.format("MM")}月设备监测预警统计`;
          break;

        default:
          break;
      }
    },
    showType(item) {
      switch (item) {
        case "chart1":
          return 1;
          break;
        case "chart2":
          return 1;
          break;
        case "chart3":
          return 2;
          break;
        case "chart4":
          return 2;
          break;
        case "chart5":
          return 3;
          break;
        case "chart6":
          return 4;
          break;
        case "chart7":
          return 2;
          break;

        default:
          break;
      }
    },
    handleMonth(symbol, pass) {
      if (pass) {
        if (symbol === "-") {
          this.searchDate = this.searchDate.subtract(1, "M");
        } else {
          this.searchDate = this.searchDate.add(1, "M");
        }
        this.getChartsData();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/index.scss";
#index {
  .frame {
    margin-top: 30px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    .params {
      position: absolute;
      top: 100px;
    }
    .left,
    .right {
      transform: scale(1.2);
      &.fh {
        height: 820px;
      }
      &.sh {
        height: 740px;
      }
      display: flex;
      // justify-content: space-between;
      flex-direction: column;
      position: relative;
      z-index: 999;
      background: rgba(0, 0, 0, 0.3);
      .box {
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        transition: all 1s;
        &::-webkit-scrollbar {
          width: 3px;
        }
        &:hover {
          &::-webkit-scrollbar {
            width: 3px;
            background-color: rgba(39, 33, 5, 0.3);
            border-radius: 20px;
          }
          &::-webkit-scrollbar-thumb {
            background-color: rgba(194, 168, 55, 0.1);
            border-radius: 20px;
          }
        }
      }
    }
    .left {
      min-width: 4.05rem /* 404/80 */;
      background: none;
      transform-origin: 0 0;
      margin-top: -6px;
      &.fh {
        height: 810px;
      }
      &.sh {
        height: 730px;
      }
    }
    .right {
      transform-origin: right 0;
      width: 280px;
      position: relative;
      top: -15px;

      .zoom {
        position: absolute;
        top: 14px;
        right: 293px;
      }
    }
    .chart1,
    .chart2,
    .chart3,
    .chart4,
    .chart5,
    .chart6,
    .chart7 {
      min-height: 150px !important;
      margin-bottom: 10px;
      .tit {
        background: url("../assets/img/skin/blackgold/title_bg.png") no-repeat;
        background-size: 100% 60%;
        margin-bottom: 15px;
        font-size: 14px /* 13/80 */;
        position: relative;
        padding-left: 25px;
        height: 20px;
        font-weight: 600;
        color: #ddd;
        display: flex;
        // &::before {
        //   content: "";
        //   width: 0.15rem;
        //   height: 0.15rem;
        //   background: #ab9065;
        //   position: absolute;
        //   top: 20%;
        //   left: 0;
        // }
        &.icon {
          background: none;
          // padding-left: 0.4rem;
          // &::before {
          //   content: "";
          //   width: 0.3rem;
          //   height: 0.3rem;
          //   background: url("../assets/img/icon.png") no-repeat;
          //   background-size: 90%;
          //   position: absolute;
          //   top: -10%;
          //   left: 0;
          // }
        }
        .btn {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          top: -1px;
          span {
            cursor: pointer;
            display: inline-block;
            position: absolute;
            left: 5px;
            top: 0px;
            &:hover {
              &::after {
                border-bottom-color: #ffb835;
              }
            }
            &::after {
              content: "";
              border: 5px solid transparent;
              border-bottom: 4px solid rgba(255, 255, 255, 0.7);
              position: absolute;
              top: -3px;
              left: 0;
            }
            &:nth-child(2) {
              top: 10px;
              left: 5px;
              &::after {
                content: "";
                border: 5px solid transparent;
                border-top: 4px solid rgba(255, 255, 255, 0.7);
                position: absolute;
                top: 0;
                left: 0;
              }
              &:hover {
                &::after {
                  border-top-color: #ffb835;
                }
              }
            }
          }
        }
      }
      .context {
        display: flex;
        align-items: center;
        .info {
          transform: scale(0.92);
          div {
            background: url("../assets/img/s-box.png") no-repeat;
            background-size: 100% 100%;
            padding: 10px 15px;
            margin: 10px 0;
          }
        }
      }
    }
    .chart1,
    .chart2,
    .chart5,
    .chart6 {
      background: url("../assets/img/skin/blackgold/title2_bg.png") no-repeat;
      background-size: 100% 100%;

      .tit {
        padding: 5px 0 0 10px;
        background: none;
      }
      // position: relative;
      // right: 0.5rem;
    }
    .chart5 {
      .tit {
        padding-top: 10px;
      }
      .context {
        height: 160px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        position: relative;
        img {
          position: absolute;
          bottom: 12px;
          left: 8px;
          width: 140px;
        }
      }
    }
    .chart6 {
      .tit {
        padding-top: 8px;
      }
    }
    .chart5,
    .chart6 {
      .info {
        position: relative;
        top: -10px;
      }
    }
    .mid {
      position: relative;
      right: 2px;
      // height: 700px;
      .horn {
        position: absolute;
        width: 25px;
        height: 25px;
        overflow: hidden;
        left: -1px;
        top: -1px;
        z-index: 999;
        &.tr {
          right: -1px;
          transform: rotate(90deg);
          left: inherit;
        }
        &.bl {
          transform: rotate(-90deg);
          top: inherit;
          bottom: -1px;
        }
        &.br {
          right: -1px;
          transform: rotate(180deg);
          left: inherit;
          top: inherit;
          bottom: -1px;
        }
        &::before {
          position: absolute;
          left: 0;
          top: 0;
          content: "";
          width: 3px;
          height: 10px;
          background: #583f11;
        }
        &::after {
          position: absolute;
          left: 0;
          top: 0;
          content: "";
          width: 10px;
          height: 3px;
          background: #583f11;
        }
      }
      .box {
        height: 100%;
        overflow: hidden;
        position: relative;
        border: 1px solid #4c3612;
        width: 1220px;
        // width: 100%;
        top: 0; // 13%;
        left: 0; // 26%;
        z-index: 99;
        .sea {
          position: absolute;
          top: -50px;
          left: -50px;
        }
        .earth {
          position: absolute;
          animation: move 6s ease-in-out forwards;
          img {
            transform: scale(0.7);
          }
        }
        .map {
          // position: fixed;
          // left: 0;
          // top: 0; // 13%;
          // width: 100%;
          // height: 1080px;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }
      }

      .newbar {
        width: 1165px;
        overflow: hidden;
        height: 40px;
        position: relative;
        left: 30px;
      }
    }
  }
  .animation {
    top: -1rem;
    opacity: 0;
    transition: all 2s ease;
  }
  .header {
    opacity: 1;
    top: 0;
  }
  .animation2 {
    left: -3rem;
    opacity: 0;
    transition: all 2s ease;
  }
  .leftbox {
    opacity: 1;
    left: 0;
  }
  .animation3 {
    right: -3rem;
    opacity: 0;
    transition: all 2s ease;
  }
  .rightbox {
    opacity: 1;
    right: 0;
  }
  .animation4 {
    bottom: -3rem;
    opacity: 0;
    transition: all 2s ease;
  }
  .mapbox {
    opacity: 1;
    bottom: 0;
  }
}

@keyframes move {
  0% {
    transform: scale(0.05);
    right: 35%;
    top: 10%;
  }
  40% {
    transform: scale(1);
    right: 35%;
    top: 10%;
  }
  50% {
    transform: scale(1);
    right: 35%;
    top: 10%;
  }
  100% {
    transform: scale(0.1);
    right: 5%;
    top: -20%;
  }
}

// @media only screen and (min-width: 1930px) {
//   #index .frame .mid {
//     left: 25%;
//   }
// }
// @media only screen and (max-width: 1900px) {
//   #index .frame .mid {
//     left: 15%;
//   }
// }
// @media only screen and (min-width: 3860px) {
//   #index .frame .mid {
//     left: 35%;
//   }
// }
</style>
