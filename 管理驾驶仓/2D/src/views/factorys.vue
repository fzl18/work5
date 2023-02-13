<template>
  <Transitions ref="transition" :isShow="isShow">
    <div class="area" :style="{ transform: `scale(${zoomlevel})` }">
      <div :is="factoryName"></div>
    </div>
    <Popup :visible.sync="visible">
      <div slot="head" class="header">
        <div class="left">
          <div class="item">
            <div class="tit">运行时间</div>
            <div class="value">
              <span class="icon"><img src="@/assets/img/1.png" alt=""/></span>
              <span class="data">
                <em class="num">{{
                  openLineInfo.totalRunningTime
                    ? Math.floor(openLineInfo.totalRunningTime / 60)
                    : 0
                }}</em
                >h
                <!-- <em class="num">{{
                  openLineInfo.totalRunningTime
                    ? Math.floor(openLineInfo.totalRunningTime % 60)
                    : 0
                }}</em>
                m -->
              </span>
            </div>
          </div>
          <div class="item">
            <div class="tit">运行距离</div>
            <div class="value">
              <span class="icon"><img src="@/assets/img/2.png" alt=""/></span>
              <span class="data">
                <em class="num">{{
                  Math.round(openLineInfo.totalRunningDistance * 100) / 100 || 0
                }}</em>
                KM
              </span>
            </div>
          </div>
          <div class="item">
            <div class="tit">运行状态</div>
            <div class="value">
              <span class="icon"><img src="@/assets/img/3.png" alt=""/></span>
              <span class="data">
                <em>{{ status }}</em>
              </span>
            </div>
          </div>
          <div class="item">
            <div class="tit">30天异常报警</div>
            <div class="value">
              <span class="icon"><img src="@/assets/img/4.png" alt=""/></span>
              <span class="data">
                <em>{{ openLineInfo.errorNums }}</em>
              </span>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="item">
            <div class="name">公司</div>
            <div class="data">
              <em>{{ openLineInfo.companyName }}</em>
            </div>
          </div>
          <div class="item">
            <div class="name">厂区</div>
            <div class="data">
              <em>{{ openLineInfo.unitName }}</em>
            </div>
          </div>
          <div class="item">
            <div class="name">作业区</div>
            <div class="data">
              <em>{{ openLineInfo.devWorkName }}</em>
            </div>
          </div>
          <div class="item">
            <div class="name">负责人</div>
            <div class="data">
              <em>{{ openLineInfo.lineAdmin }}</em>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="body"></div> -->
      <div class="body">
        <Loading v-if="loading"></Loading>
        <div class="left" v-if="!loading">
          <div class="tit">{{ openLineInfo.coveryLineName }}</div>
          <div class="line">
            <!-- <img src="@/assets/img/line.png" alt="" /> -->
            <div class="view">
              <!-- <span class="btn" @click="view(openLineInfo.id)">3D</span> -->
            </div>
            <div class="pic" v-if="!openLineInfo.lineStatus">
              <!-- <img src="@/assets/img/skin/blackgold/line_pic.png" alt="" /> -->
              <div class="arrow">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div class="arrow">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
          <div
            class="module"
            v-if="openLineInfo.moduleList && openLineInfo.moduleList.length"
          >
            <div
              v-for="(item, index) in openLineInfo.moduleList"
              :key="index"
              :class="[
                'item',
                curModule == index ? 'hover' : '',
                statusName(item.moduleStatus),
              ]"
              @mouseover="handleOver(item, index)"
            >
              <div class="pics">
                <div class="pic" :class="item.moduleType"></div>
              </div>
              <div class="name">{{ item.moduleName }}</div>
              <div class="status">
                <span>{{ statusText(item.moduleStatus) }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="right" v-if="!loading">
          <div v-if="openLineInfo.moduleList && openLineInfo.moduleList.length">
            <div class="tit">
              {{ openLineInfo.moduleList[curModule].moduleName }}
            </div>

            <div
              class="view"
              v-if="openLineInfo.moduleList[curModule].moduleType !== 'zs'"
            >
              <img
                src="@/assets/img/pic2.jpg"
                alt=""
                v-if="openLineInfo.moduleList[curModule].moduleType == 'wd'"
              />
              <img
                src="@/assets/img/pic1.jpg"
                alt=""
                v-if="openLineInfo.moduleList[curModule].moduleType == 'belt'"
              />
            </div>
            <div class="view" v-if="curType == 'zs'">
              <!-- v-if="openLineInfo.moduleList[curModule].moduleType == 'zs'" -->
              <!-- <iframe
                frameborder="0"
                :src="item.videoUrl"
                :alt="index"
                v-for="(item, index) in openLineInfo.moduleList[curModule]
                  .deviceInfo"
                :key="index"
                width="100%"
                height="25%"
              ></iframe> -->
              <!-- <video
                v-if="openLineInfo.moduleList[curModule].moduleType == 'zs'"
                v-for="(item, index) in videoList"
                controls
                width="100%"
                :key="index"
              >
                <source :src="item" />
              </video> -->
              <div class="videolist">
                <div>
                  <video id="video" v-if="video1" controls autoplay></video>
                  <img
                    v-if="!video1"
                    src="@/assets/img/skin/blackgold/novideo.png"
                  />
                </div>
                <div>
                  <video id="video2" v-if="video2" controls autoplay></video>
                  <img
                    v-if="!video2"
                    src="@/assets/img/skin/blackgold/novideo.png"
                  />
                </div>
              </div>
            </div>
            <div class="status">
              运行状态：{{
                statusText(openLineInfo.moduleList[curModule].moduleStatus)
              }}
            </div>
            <div
              class="info"
              v-if="openLineInfo.moduleList[curModule].moduleType == 'zs'"
            >
              <div class="item">RFID编码：{{ moduleInfo.code }}</div>
              <div class="item">
                撕裂点与RFID相对位置：
                {{ moduleInfo.location }}{{ moduleInfo.itemUnit }}
              </div>
              <div class="item">
                RFID位于输送线点位：
                {{ moduleInfo.position }}
              </div>
              <div class="item">
                撕裂点位于输送线点位：{{ moduleInfo.location
                }}{{ moduleInfo.itemUnit }}
              </div>
            </div>
            <div
              class="info"
              v-if="openLineInfo.moduleList[curModule].moduleType == 'wd'"
            >
              <div
                class="cw"
                v-if="
                  openLineInfo.moduleList[curModule].deviceRegedInfoDtos[0]
                    .deviceModel == '温度数据采集器'
                "
              >
                <div v-for="(item, index) in temperatureList" :key="index">
                  <div class="val">{{ item.value }} <span>℃</span></div>
                  <!-- <div class="name">{{ index + 1 }}、{{ item.name }}</div> -->
                  <div class="name">{{ index + 1 }}、{{ keys[index] }}</div>
                  <div class="name">采集时间：{{ item.ts }}</div>
                </div>
              </div>
              <div
                class="item"
                style="background: #49453e;padding:0.1rem;margin-top:0.2rem"
              >
                温度报警历史记录：
              </div>
              <div
                v-for="(item, index) in openLineInfo.moduleList[curModule]
                  .alarmHistoryThree"
                :key="index"
              >
                --{{ item.alarmTime }} {{ item.alarmDesc }} 温度{{
                  item.alarmValue
                }}℃
              </div>
            </div>
            <div
              class="info"
              v-if="openLineInfo.moduleList[curModule].moduleType == 'belt'"
            >
              <div class="item">生产厂家：{{ moduleInfo.manufacturer }}</div>
              <div class="item">输送物料：{{ moduleInfo.materials }}</div>
              <div class="item">读卡器位置：</div>
              <div class="item">当前RFID： {{ moduleInfo.rfid }}</div>
              <div class="item">RFID位置：{{ moduleInfo.position }}</div>
              <div class="item">运行速度：{{ moduleInfo.speed }}</div>
              <div class="item">输送带故障历史记录：</div>
              <div
                v-for="(item, index) in openLineInfo.moduleList[curModule]
                  .alarmHistoryThree"
                :key="index"
              >
                --{{ item.alarmTime }} {{ item.alarmDesc }}
              </div>
            </div>
          </div>
        </div>
        <div class="prev" @click="handleLine('prev')"></div>
        <div class="next" @click="handleLine('next')"></div>
      </div>
    </Popup>
  </Transitions>
</template>

<script>
import Transitions from "./components/transition.vue";
import Popup from "./components/popup";
import XinCheng from "./factorys/xincheng.vue";
import { getLineVisual, getVideoUrl, getLiveStream } from "./api/monitorLine";
import Loading from "./components/loading.vue";
import { formatTime } from "@/utils";
import flvjs from "flv.js";
export default {
  components: {
    Transitions,
    Popup,
    XinCheng,
    Loading,
  },
  data() {
    return {
      visible: false,
      loading: true,
      factoryName: this.$store.state.curFactory || "XinCheng",
      openLineInfo: {
        moduleList: [],
      },
      curModule: 0,
      curType: "",
      videoList: [],
      keys: [],
      linesList: [],
      lineIndex: null,
      video1: null,
      video2: null,
    };
  },
  mounted() {
    // this.openLine("524d90bc356545768264c04ae9e86000");
  },
  computed: {
    moduleInfo() {
      let moduleInfo = {};
      this.openLineInfo.moduleList[this.curModule].params.map((item) => {
        if (item.itemType) {
          moduleInfo[item.itemType] = item.itemValue;
          if (item.itemUnit) {
            moduleInfo.itemUnit = item.itemUnit;
          }
        } else {
          moduleInfo.code = item.epcNo;
          moduleInfo.speed = item.speed;
          moduleInfo.position = item.position;
        }
      });
      return moduleInfo;
    },
    zoomlevel() {
      return this.$store.state.zoomlevel;
    },
    isShow() {
      return this.$store.state.curObjLevel == 4;
    },
    status() {
      let statusText = "";
      switch (this.openLineInfo.lineStatus) {
        case 0:
          statusText = "运行中";
          break;
        case 1:
          statusText = "警告";
          break;
        case 2:
          statusText = "异常";
          break;
        default:
          break;
      }

      return statusText;
    },
  },
  watch: {
    visible(val) {
      if (!val) {
        this.curModule = 0;
      }
    },
  },
  methods: {
    init() {},
    view(id) {
      this.visible = false;
      this.$router.push(`/3dview?id=${id}`);
    },
    openLine(lineId, ind, linesList) {
      this.loading = true;
      if (ind) {
        this.lineIndex = ind;
        this.linesList = linesList;
      }
      this.openLineInfo = {};
      getLineVisual(lineId).then((res) => {
        if (res.success) {
          this.openLineInfo = res.data || {};
          this.videoList = [];
          this.temperatureList = [];
          this.openLineInfo.moduleList.forEach((data, index) => {
            if (index == 0) {
              this.curType = data.moduleType;
            }
            // if (data.moduleType == "zs") {
            data.deviceInfo.forEach((v) => {
              if (v.videoUrl) {
                this.videoList.push(v.videoUrl);
              }
            });
            data.deviceRegedInfoDtos.forEach((val) => {
              if (
                val.iotParams &&
                data.moduleType == "wd" &&
                val.deviceModel == "温度数据采集器"
              ) {
                let keys = Object.keys(val.iotParams);
                this.keys = keys;
                if (keys.length) {
                  keys.map((v) => {
                    this.temperatureList.push({
                      value: val.iotParams[v][0].value,
                      ts: formatTime(val.iotParams[v][0].ts),
                      name: val.moduleName,
                    });
                  });
                  // console.log(this.temperatureList);
                }
              }
              // if (val.videoUrl) {
              //   this.videoList.push(val.videoUrl);
              // }
            });
            // }
          });
          this.loading = false;
        } else {
          this.loading = false;
          this.visible = false;
          window.alert(`Code:${res.errorCode}:${res.errorMsg}`);
        }
      });
      this.visible = true;
    },
    statusText(status) {
      if (status == 0) {
        return "正常";
      }
      if (status == 1) {
        return "警告";
      }
      if (status == 2) {
        return "异常";
      }
    },
    statusName(status) {
      if (status == 0) {
        return "info";
      }
      if (status == 1) {
        return "warn";
      }
      if (status == 2) {
        return "error";
      }
    },
    videoPlay(id, position) {
      if (flvjs.isSupported()) {
        getLiveStream(id).then((res) => {
          if (!res.data) {
            return;
          }
          if (!position) {
            let videoElement = document.getElementById("video");
            let flvPlayer = flvjs.createPlayer(
              {
                type: "flv",
                // isLive: true,
                url: `/live/${id}.flv`,
              }
              // {
              //   // enableWorker: true,
              //   enableStashBuffer: false,
              //   isLive: true,
              //   // lazyLoad: false,
              // }
            );

            flvPlayer.attachMediaElement(videoElement);
            flvPlayer.load();
            flvPlayer.play();
          }
          if (position) {
            let video2Element = document.getElementById("video2");
            let flvPlayer2 = flvjs.createPlayer(
              {
                type: "flv",
                // isLive: true,
                url: `/live/${id}.flv`,
                // hasAudio: false, // 关闭声音
                // cors: true, // 开启跨域访问
                // duration: 0,
                // currentTime: 0,
              }
              // {
              //   autoCleanupSourceBuffer: true, //对SourceBuffer进行自动清理
              //   autoCleanupMaxBackwardDuration: 12, //    当向后缓冲区持续时间超过此值（以秒为单位）时，请对SourceBuffer进行自动清理
              //   autoCleanupMinBackwardDuration: 8, //指示进行自动清除时为反向缓冲区保留的持续时间（以秒为单位）。
              //   enableStashBuffer: false, //关闭IO隐藏缓冲区
              //   isLive: true,
              //   lazyLoad: false,
              // }
            );
            flvPlayer2.attachMediaElement(video2Element);
            flvPlayer2.load();
            flvPlayer2.play();
          }
        });
      }
    },
    handleOver(val, index) {
      if (index == this.curModule) {
        return;
      }
      this.curType = val.moduleType;
      this.curModule = index;
      if (val.moduleType == "zs") {
        if (val.deviceRegedInfoDtos.length) {
          val.deviceRegedInfoDtos.forEach((item, index) => {
            if (item.deviceModel == "可见光成像仪") {
              this.video1 = item.liveParams ? item.deviceCode : null;
            }
            if (item.deviceModel == "红外热成像仪") {
              this.video2 = item.liveParams ? item.deviceCode : null;
            }
          });
          if (this.video1) {
            this.videoPlay(this.video1);
          }
          if (this.video2) {
            this.videoPlay(this.video2, 1);
          }
        }
      }
    },
    handleLine(type) {
      this.curModule = 0;
      if (this.lineIndex !== null && this.linesList.length) {
        if (type == "next") {
          this.lineIndex++;
          if (this.lineIndex > this.linesList.length - 1) {
            this.lineIndex = 0;
          }
        } else if (type == "prev") {
          this.lineIndex--;
          if (this.lineIndex < 0) {
            this.lineIndex = this.linesList.length - 1;
          }
        }
        this.openLine(this.linesList[this.lineIndex].lineId);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.area {
  transition: transform 0.5s;
  transform-origin: center;
  position: relative;
}
.header {
  display: flex;
  font-size: 12px;
  .left {
    width: 65%;
    display: flex;
    justify-content: space-evenly;
    .item {
      .tit {
        background: #8e7c62;
        padding: 0.12rem;
        width: 1.8rem;
        text-align: center;
        margin-bottom: 0.3rem;
      }
      .value {
        display: flex;
        align-items: center;
        .icon {
          margin-right: 0.1rem;
        }
        em {
          font-size: 0.3rem;
          font-style: normal;
          font-weight: bold;
          margin: 0 0.05rem;
          &.num {
            font-size: 0.35rem;
          }
        }
      }
    }
  }
  .right {
    width: 35%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 1.4rem;
    .item {
      position: relative;
      &::after {
        content: "";
        position: absolute;
        top: -24%;
        left: -26%;
        height: 155%;
        width: 1px;
        background: rgb(179, 172, 149);
        transform: skewX(-20deg);
      }
      .name {
        color: #b8a080;
        padding-bottom: 0.15rem;
      }
      .data {
        em {
          font-size: 0.22rem;
          font-style: normal;
          font-weight: bold;
        }
      }
    }
  }
}
.body {
  display: flex;
  overflow: hidden;
  height: 100%;
  background: url("../assets/img/skin/blackgold/line_pic.png") center no-repeat;
  background-size: 100% 100%;
  > .left .line .pic {
    position: relative;
    height: 100%;
    width: 100%;
    pointer-events: none;
    img {
      // width: 100%;
      height: 100%;
    }
    .arrow {
      position: absolute;
      top: -220px;
      left: 30px;
      transform: scale(1.1) rotate(-6deg);
      animation: flash 3s linear infinite;
      animation-delay: 1.5s;
      &:nth-child(2) {
        top: 115px;
        left: 600px;
        transform: scale(1.3) rotate(-9deg);
        animation-delay: 0ms;
      }
      span {
        position: relative;
        display: block;
        width: 204px;
        height: 135px;
        background: url("../assets/img/skin/blackgold/arrow.png");
        filter: drop-shadow(2px 4px 6px #000);
        animation: flash 1500ms linear infinite;
        &:nth-child(1) {
          transform: scale(0.3);
          top: 30px;
          left: 30px;
          animation-delay: 900ms;
        }
        &:nth-child(2) {
          transform: scale(0.35);
          top: -60px;
          left: 80px;
          animation-delay: 600ms;
        }
        &:nth-child(3) {
          transform: scale(0.4);
          top: -160px;
          left: 130px;
          animation-delay: 300ms;
        }
        &:nth-child(4) {
          transform: scale(0.45);
          top: -250px;
          left: 185px;
          animation-delay: 0ms;
        }
      }
    }
    .view {
      position: absolute;
      top: -30px;
      right: 30px;
      // font-weight: bold;
      font-size: 18px;
      color: rgb(255, 230, 175);
      span {
        display: flex;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: rgba($color: #3b3021, $alpha: 0.7);
        border: 2px solid #8e7c62;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        transition: all 500ms;
        &:hover {
          background: #000;
          color: #fff;
          border-color: #fff;
          border-width: 3px;
          font-size: 22px;
        }
      }
    }
  }
  .left {
    width: 75%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    position: relative;
    .tit {
      position: relative;
      top: -0.5rem;
      border-radius: 0.8rem;
      width: 3.5rem;
      height: 0.9rem;
      background: #8e7c62;
      padding-top: 0.55rem;
      text-align: center;
      font-size: 0.25rem;
      font-weight: bold;
      border: 1px solid #fce6c8;
    }
    .line {
      width: 100%;
      height: 65%;
      display: flex;
      align-items: center;
      position: absolute;
      top: 205px;
      left: 0;
      pointer-events: none;
      img {
        transform: scale(0.7);
      }
      .view {
        position: absolute;
        top: 10px;
        right: 0px;
        // font-weight: bold;
        font-size: 14px;
        color: rgb(255, 230, 175);
        span {
          display: flex;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: rgba($color: #3b3021, $alpha: 0.7);
          border: 2px solid #8e7c62;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          transition: all 500ms;
          &:hover {
            background: #000;
            color: #fff;
            border-color: #fff;
            border-width: 3px;
          }
        }
      }
    }
    .module {
      height: 25%;
      margin-bottom: 0.6rem;
      display: flex;
      justify-content: space-evenly;
      width: 100%;
      .item {
        color: rgb(167, 167, 167);
        .pics {
          height: 1.4rem;
          // width: 1.4rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .name {
          transition: all 500ms;
        }
        div {
          margin: 0.15rem 0;
          text-align: center;
          &.pic {
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            height: 1rem;
            width: 1rem;
            border: 1px solid #fce6c8;
            background: #5d5d5d url("../assets/img/modules.png") no-repeat;
            background-position: 0;
            background-size: 1300%;
            background-position: 0 0;
            transition: all 500ms;
            &.belt {
              // background-position: 0.1425rem /* 9/80 */ -2.775rem /* 158/80 */;
              background-position: -10.54rem -2.415rem;
              background-size: 1200%;
            }
            &.zs {
              background-position: 0.1425rem /* 9/80 */ -2.775rem /* 158/80 */;
            }
            &.wd {
              background-position: -5.585rem -2.715rem;
            }
            &.ms {
              background-position: -8.52rem -2.715rem;
            }
            &.zd {
              background-position: -2.52rem /* 9/80 */ -2.815rem /* 158/80 */;
            }
          }
          &.status {
            span {
              transition: all 500ms;
              display: inline-block;
              background: #5d5d5d;
              padding: 0.05rem 0.1rem;
              border: 1px solid #9c9c9c;
              border-radius: 1rem;
            }
          }
        }
        &.hover {
          .pic {
            border: 5px solid #06c5ff;
            height: 1.4rem;
            width: 1.4rem;
            background-position: 0.1425rem 0.05rem !important;
            background-size: 1100% !important;
            &.belt {
              background-position: -12.292rem 0.31rem !important;
            }
            &.zs {
              background-position: 0.185rem 0.15rem !important;
            }
            &.wd {
              background-position: -5.97rem 0.15rem !important;
            }
            &.ms {
              background-position: -9.184rem 0.15rem !important;
            }
            &.zd {
              background-position: -2.52rem 0.15rem !important;
            }
          }
          .name {
            color: #fff;
          }
          .status {
            span {
              color: #fff;
              border-color: transparent;
              background: #06c5ff;
            }
          }
        }
        &.error {
          &.hover {
            .pic {
              border: 5px solid #ff3806;
            }
            .status {
              span {
                color: #fff;
                border-color: transparent;
                background: #ff3806;
              }
            }
          }
          &:hover {
            .pic {
              border: 5px solid #ff3806;
            }
            .status {
              span {
                color: #fff;
                border-color: transparent;
                background: #ff3806;
              }
            }
          }
        }
        &.warn {
          &:hover {
            .pic {
              border: 5px solid #ffb006;
            }
            .status {
              span {
                color: #fff;
                border-color: transparent;
                background: #ffb006;
              }
            }
          }
        }
      }
    }
  }
  .right {
    margin: 0.1rem;
    background: url("../assets/img/box2.png") no-repeat;
    background-size: cover;
    padding: 0.1rem 0.3rem 0.2rem 0.3rem;
    font-size: 0.1rem;
    width: 25%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 999;
    > div {
      margin-bottom: 0.2rem;
      overflow-y: auto;
      overflow-x: hidden;
      width: 100%;
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
    .tit {
      font-size: 13px;
      margin-top: 0.4rem;
      background: url("../assets/img/textbg.png") center 50% no-repeat;
      background-size: 100%;
      height: 0.3rem;
      width: 100%;
      text-align: center;
      margin-bottom: 0.1rem;
    }
    video {
      margin-bottom: 0.05rem;
    }
    .view {
      img {
        width: 100%;
        margin-bottom: 0.05rem;
        // border: 1px solid #fce6c8;
      }
      .videolist {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        div {
          background: #000;
          min-height: 200px;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          &:nth-child(1) {
            margin-bottom: 10px;
          }
          video {
            width: 100%;
          }
          img {
            width: 200px;
          }
        }
      }
    }
    .status {
      height: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: url("../assets/img/titbg.png") center center no-repeat;
      background-size: 100%;
      margin-bottom: 0.1rem;
      // width: 80%;
    }
    .info {
      width: 100%;
      min-height: 1.5rem;
      div {
        padding: 0.1rem;
        // transform: scale(0.9);
        &.item:nth-child(odd) {
          background: #49453e;
        }
      }
      .cw {
        display: grid;
        grid-row-gap: 1px;
        grid-column-gap: 1px;
        grid-template-columns: repeat(2, 1fr);
        background: #75560f;
        border: 1px solid #75560f;
        padding: 0;
        > div {
          background: #3d3631;
          padding: 0.05rem 0.01rem;
        }
        .val {
          font-size: 20px;
          font-style: italic;
          font-weight: bold;
          max-width: 120px;
          span {
            font-size: 12px;
          }
        }
        .name {
          color: #8d704a;
        }
      }
    }
  }
  .next,
  .prev {
    position: absolute;
    top: 45%;
    background: url("../assets/img/skin/blackgold/arrow_btn.png") no-repeat;
    background-size: 100%;
    width: 40px;
    height: 45px;
    cursor: pointer;
  }
  .prev {
    left: -60px;
    transform: rotate(180deg);
  }
  .next {
    right: -60px;
  }
}

@keyframes flash {
  0% {
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}
</style>
