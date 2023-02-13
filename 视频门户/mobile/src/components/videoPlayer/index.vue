<template>
  <div ref="videoPlayer" class="videoPlayer">
    <div id="videoPlayer" ref="player"></div>
    <div
      ref="overlayer"
      class="overlayer"
      :class="fullScreen ? 'font6' : ''"
      @click="showList = true"
      v-show="videoList.length"
    >
      {{ "选集" }}
    </div>
    <div
      ref="speed"
      class="overlayer"
      :class="fullScreen ? 'font6' : ''"
      @click="showSpeedList = true"
      v-show="speed"
    >
      {{ "倍速" }}
    </div>
    <div
      ref="quality"
      class="overlayer"
      :class="fullScreen ? 'font6' : ''"
      @click="showQualityList = true"
      v-show="qualityList.length"
    >
      {{ "清晰度" }}
    </div>
    <div
      ref="qualityList"
      :class="['vlist', showQualityList ? 'show' : '']"
      @click="showQualityList = false"
    >
      <div class="box" style="width: 20%">
        <div
          :class="['van-ellipsis', 'item']"
          v-for="item in qualityList"
          :key="item.resolution"
          @click="switchVideo(item.url)"
          style="text-align: center"
        >
          <span></span>
          <span class="van-ellipsis" :class="fullScreen ? 'font6' : ''"
            >{{ item.resolution }}{{ item.default ? "(默认)" : null }}</span
          >
        </div>
      </div>
    </div>
    <div
      ref="videoList"
      :class="['vlist', showList ? 'show' : '']"
      @click="showList = false"
    >
      <div class="box">
        <div
          :class="[
            'van-ellipsis',
            'item',
            curId == item.id ? 'cur' : '',
            !index && !curId ? 'cur' : '',
          ]"
          v-for="(item, index) in videoList"
          :key="item.id"
          @click="gotoSwitchVideo(item.id)"
        >
          <span :class="fullScreen ? 'font6' : ''">视频{{ index + 1 }}</span>
          <span class="van-ellipsis" :class="fullScreen ? 'font6' : ''">{{
            item.name
          }}</span>
        </div>
      </div>
    </div>
    <div
      ref="speedList"
      :class="['vlist', showSpeedList ? 'show' : '']"
      @click="showSpeedList = false"
    >
      <div class="box" style="width: 20%">
        <div
          :class="['van-ellipsis', 'item']"
          v-for="(item, index) in playbackSpeed"
          :key="index"
          @click="speedHandle(item.speed)"
          style="text-align: center"
        >
          <span></span>
          <span class="van-ellipsis" :class="fullScreen ? 'font6' : ''">{{
            item.name
          }}</span>
        </div>
      </div>
    </div>
    <!-- <div ref="speed" class="dplayer-quality">
      <button class="dplayer-icon dplayer-quality-icon">速度</button>
      <div class="dplayer-quality-mask">
        <div class="dplayer-quality-list item">
          <div
            v-for="(item, index) in (vOpt && vOpt.playbackSpeed) ||
            defaultVideoOption.playbackSpeed"
            :key="index"
            class="dplayer-quality-item"
            @click="speedHandle(item.speed)"
          >
            {{ item.name }}
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import btPlayer from "dplayer";
// import watermark from 'watermark-dom'
export default {
  name: "BtPlayer",
  components: {},
  props: {
    videoUrl: {
      type: String,
      default: "",
    },
    screen: {
      type: Number,
      default: null,
    },
    videoList: {
      type: Array,
      default: () => [],
    },
    qualityList: {
      type: Array,
      default: () => [],
    },
    speed: {
      type: Boolean,
    },
    wOpt: {
      type: Object,
      default: () => {},
    },
    vOpt: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    videoUrl(val) {
      this.btPlayer.switchVideo({
        url: val,
      });
      // this.btPlayer.fullScreen.request("web");
      this.btPlayer.play();
      this.btPlayer.notice("开始播放");
    },
    screen(val) {
      const player = this.$refs.player;
      const controller = player.querySelector(".dplayer-icons-right");
      const dplayerFull = controller.querySelector(".dplayer-full");
      if (val) {
        dplayerFull
          .querySelector(".dplayer-full-in-icon")
          .style.setProperty("display", "block");
      } else {
        dplayerFull
          .querySelector(".dplayer-full-icon")
          .style.setProperty("display", "block");
      }
    },
    // videoList(val) {
    //   console.log(val);
    // },
  },
  destroyed() {
    this.btPlayer.destroy();
  },
  data() {
    return {
      btPlayer: null,
      on: false,
      showList: false,
      showQualityList: false,
      showSpeedList: false,
      curId: null,
      defaultVideoOption: {
        theme: "#0ff",
        screenshot: false,
        playbackSpeed: [
          { name: "0.75", speed: 0.75 },
          { name: "正常", speed: 1 },
          { name: "1.5", speed: 1.5 },
        ],
        hotkey: false,
        video: {
          url: "",
        },
      },
      playbackSpeed: [
        { name: "0.5", speed: 0.5 },
        { name: "0.75", speed: 0.75 },
        { name: "正常", speed: 1 },
        { name: "1.5", speed: 1.5 },
        { name: "2X", speed: 2 },
      ],
      defaultWarterMark: {
        watermark_txt: "宝通科技",
        watermark_color: "#fff", //水印字体颜色
        watermark_fontsize: "18px", //水印字体大小
        watermark_alpha: 0.2,
        watermark_x: 0, //水印起始位置x轴坐标
        watermark_y: 0, //水印起始位置Y轴坐标
        watermark_x_space: 60, //水印x轴间隔
        watermark_y_space: 30, //水印y轴间隔
        watermark_parent_node: "videoPlayer",
      },
      fullScreen: false,
    };
  },
  mounted() {
    this.init();
    this.curId = this.$route.params.videoId;
  },
  methods: {
    init() {
      const player = this.$refs.player;
      const videoPlayer = new btPlayer({
        container: player,
        ...this.defaultVideoOption,
        ...this.vOpt,
      });
      this.video = player.querySelector("video");
      // this.video.controlsList = "nodownload";
      // this.video.playsinline = " true";
      // this.video.xWebkitAirplay = "true";
      // this.video.x5Playsinline = "true";
      // this.video.webkitPlaysinline = "true";
      // this.video.x5-video-player-type = "h5";
      // this.video.x5VideoPlayerFullscreen = "true";
      // this.video.setAttribute("x5-video-player-type", "h5-page");
      // this.video.removeAttribute("playsinline");
      // this.video.removeAttribute("webkit-playsinline");
      this.btPlayer = videoPlayer;
      // videoPlayer.play();
      // videoPlayer.notice("开始播放");
      videoPlayer.notice = function () {
        return false;
      };
      videoPlayer.speed(1);
      videoPlayer.on("ended", () => {
        // videoPlayer.seek(0);
        // videoPlayer.play();
      });
      const menu = player.querySelector(".dplayer-menu");
      const setting = player.querySelector(".dplayer-setting");
      const controller = player.querySelector(".dplayer-icons-right");
      const dplayerFull = controller.querySelector(".dplayer-full");
      // controller.prepend(this.$refs.speed);
      dplayerFull.prepend(this.$refs.quality);
      dplayerFull.prepend(this.$refs.overlayer);
      dplayerFull.prepend(this.$refs.speed);
      player.append(this.$refs.videoList);
      player.append(this.$refs.qualityList);
      player.append(this.$refs.speedList);
      dplayerFull
        .querySelector(".dplayer-full-icon")
        .style.setProperty("display", "none");

      dplayerFull
        .querySelector(".dplayer-full-in-icon")
        .style.setProperty("display", "none");
      menu.remove();
      setting.remove();
      player.oncontextmenu = function () {
        return false;
      };
      this.btPlayer.on("fullscreen", () => {
        this.fullScreen = true;
      });
      this.btPlayer.on("fullscreen_cancel", () => {
        this.fullScreen = false;
      });
      // player.addEventListener("leavepictureinpicture", () => {
      //   this.on = false;
      // });
      // watermark.init({ ...this.defaultWarterMark, ...this.wOpt })
    },
    handle() {},
    speedHandle(speed) {
      this.btPlayer.speed(speed);
    },
    switchVideo(url) {
      this.btPlayer.switchVideo({
        url: url,
      });
      // this.btPlayer.fullScreen.request();
      this.btPlayer.play();
      this.btPlayer.notice("开始播放");
    },
    gotoSwitchVideo(id) {
      // this.btPlayer.switchVideo({
      //   url: url,
      // });
      // this.btPlayer.fullScreen.request();
      // this.btPlayer.play();
      // this.btPlayer.notice("开始播放");
      this.curId = id;
      this.$emit("switchVideo", id);
    },
  },
};
</script>

<style>
#videoPlayer {
  height: 100%;
  width: 100%;
}
.videoPlayer {
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
}
.dplayer-controller {
  /* display: none; */
}
.dplayer-menu > .dplayer-menu-item:last-child {
  display: none !important;
}

.overlayer,
.speed {
  color: #fff;
  /* height: 100%; */
  /* position: absolute;
  left: 300px;
  top: 10px; */
  cursor: pointer;
  display: inline-block;
  font-size: 12px;
  position: relative;
}
.speed:hover ul {
  display: block;
  position: absolute;
  bottom: 30px;
  left: 0;
  background: rgba(0, 0, 0, 0.8);
}
.speed ul {
  display: none;
  padding: 10px;
  width: 50px;
  border-radius: 4px;
  z-index: 9;
}
.speed ul li {
  list-style: none;
  padding: 3px 5px;
  font-size: 12px;
}
.dplayer-quality-list {
  position: relative;
  left: 15px;
}
.dplayer-quality-list.item {
  width: 40px !important;
  left: 20px;
}
/* video::-internal-media-controls-download-button {
  display: none;
}
video::-webkit-media-controls-enclosure {
  overflow: hidden;
}
video::-webkit-media-controls-panel {
  width: calc(100% + 30px);
} */

.vlist {
  font-size: 12px;
  color: #fff;
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.2) 30%,
    rgba(0, 0, 0, 1)
  );
  top: 0;
  left: 0;
  display: none;
}
.vlist.show {
  display: block;
}
.vlist .box {
  background: linear-gradient(to right, rgba(0, 0, 0, 0) 80%, rgba(0, 0, 0, 1));
  height: calc(100% - 10px);
  width: 30%;
  padding: 20px 0;
  overflow-y: auto;
  float: right;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 10px;
}
.vlist .box .item {
  display: flex;
  flex-direction: column;
}

.vlist .box .item.cur {
  color: #71b2ff;
}

.vlist .box .item span:nth-child(1) {
  font-size: 12px;
  color: rgb(167, 167, 167);
  margin-bottom: 5px;
}
.vlist div div {
  text-align: left;
  margin: 5px 0;
}
.overlayer {
  font-size: 12px;
  margin-right: 12px;
}
.font6 {
  font-size: 8px !important;
}
.dplayer-full {
  display: flex !important;
  align-items: center;
}
</style>
