<template>
  <div ref="videoPlayer" class="videoPlayer">
    <div id="videoPlayer" ref="player"></div>
    <div v-show="popWin" ref="overlayer" class="overlayer" @click="handle">
      {{ !on ? '弹窗' : '恢复' }}
    </div>
    <div v-show="speed" ref="speed" class="dplayer-quality">
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
    </div>
    <div v-show="quality.length" ref="quality" class="dplayer-quality">
      <button class="dplayer-icon dplayer-quality-icon">清晰度</button>
      <div class="dplayer-quality-mask">
        <div class="dplayer-quality-list item">
          <div
            v-for="(item, index) in quality"
            :key="index"
            class="dplayer-quality-item"
            @click="handleSwitchVideo(item.url)"
          >
            {{ item.resolution }} {{ item.default ? '(默认)' : null }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import btPlayer from 'dplayer'
  // import watermark from 'watermark-dom'
  export default {
    name: 'BtPlayer',
    components: {},
    props: {
      videoUrl: {
        type: String,
        default: '',
      },
      videoId: {
        type: [String, Number],
        default: null,
      },
      quality: {
        type: Array,
        default: () => [],
      },
      wOpt: {
        type: Object,
        default: () => {},
      },
      vOpt: {
        type: Object,
        default: () => {},
      },
      speed: {
        type: Boolean,
        default: false,
      },
      popWin: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        btPlayer: null,
        on: false,
        defaultVideoOption: {
          theme: '#0ff',
          screenshot: false,
          playbackSpeed: [
            { name: '0.5', speed: 0.5 },
            { name: '0.75', speed: 0.75 },
            { name: '正常', speed: 1 },
            { name: '1.5', speed: 1.5 },
            { name: '2X', speed: 2 },
          ],
          hotkey: false,
          video: {
            url: '',
            // quality: this.quality,
          },
        },
        defaultWarterMark: {
          watermark_txt: '宝通科技',
          watermark_color: '#fff', //水印字体颜色
          watermark_fontsize: '18px', //水印字体大小
          watermark_alpha: 0.2,
          watermark_x: 0, //水印起始位置x轴坐标
          watermark_y: 0, //水印起始位置Y轴坐标
          watermark_x_space: 60, //水印x轴间隔
          watermark_y_space: 30, //水印y轴间隔
          watermark_parent_node: 'videoPlayer',
        },
      }
    },
    watch: {
      videoUrl(val) {
        // console.log(val)
        this.btPlayer.switchVideo({
          url: val,
        })
        this.btPlayer.play()
        this.btPlayer.notice('开始播放')
      },
      quality(val) {
        console.log(val)
      },
    },
    mounted() {
      this.init()
      console.log(this.speed, this.popWin)
    },
    methods: {
      init() {
        const player = this.$refs.player
        const videoPlayer = new btPlayer({
          container: player,
          ...this.defaultVideoOption,
          ...this.vOpt,
        })
        console.log(this.defaultVideoOption)
        this.video = player.querySelector('video')
        // this.video.controlsList = "nodownload";
        // this.video.playsinline = " true";
        // this.video.xWebkitAirplay = "true";
        // this.video.x5Playsinline = "true";
        // this.video.webkitPlaysinline = "true";
        // this.video.x5-video-player-type = "h5";
        // this.video.x5VideoPlayerFullscreen = "true";
        // this.video.setAttribute("x5-video-player-type", "h5-page");
        this.video.removeAttribute('playsinline')
        this.video.removeAttribute('webkit-playsinline')
        this.btPlayer = videoPlayer
        videoPlayer.notice = function () {
          return false
        }
        videoPlayer.speed(1)
        videoPlayer.on('ended', () => {
          // videoPlayer.seek(0)
          // videoPlayer.play()
        })
        const menu = player.querySelector('.dplayer-menu')
        const setting = player.querySelector('.dplayer-setting')
        const controller = player.querySelector('.dplayer-icons-right')
        controller.prepend(this.$refs.speed)
        controller.prepend(this.$refs.quality)
        controller.append(this.$refs.overlayer)
        menu.remove()
        setting.remove()
        player.oncontextmenu = function () {
          return false
        }
        player.addEventListener('leavepictureinpicture', () => {
          this.on = false
        })
        // watermark.init({ ...this.defaultWarterMark, ...this.wOpt })
      },
      handle() {
        const { video } = this
        if (this.on) {
          document.exitPictureInPicture()
        } else {
          video.requestPictureInPicture()
        }
        this.on = !this.on
      },
      speedHandle(speed) {
        this.btPlayer.speed(speed)
      },
      handleSwitchVideo(url) {
        this.btPlayer.switchVideo({
          url: url,
        })
        this.btPlayer.play()
        this.btPlayer.notice('开始播放')
      },
    },
  }
</script>

<style>
  #videoPlayer,
  .videoPlayer {
    height: calc(100%);
    width: 100%;
  }
  /* .dplayer-controller {
    display: none;
  } */
  .dplayer-menu > .dplayer-menu-item:last-child {
    display: none !important;
  }
  .overlayer,
  .speed {
    color: #fff;
    height: 100%;
    /* position: absolute;
  left: 300px;
  top: 10px; */
    cursor: pointer;
    display: inline-block;
    font-size: 14px;
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
    /* width: 40px !important; */
    left: 0px;
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
</style>
