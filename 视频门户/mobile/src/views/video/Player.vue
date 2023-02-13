<template>
  <div class="base">
    <videoPlayer
      :videoUrl="videoUrl"
      :videoList="videoList"
      :qualityList="qualityList"
      :speed="speed"
      @switchVideo="switchVideo"
      ref="videoPlayer"
    />
    <!-- <div class="back">
      <div @click="back"><van-icon name="arrow-left" /> 返回</div>
    </div> -->
  </div>
</template>

<script>
import videoPlayer from "../../components/videoPlayer";
import { getUserVideoOne } from "../api";
import Vue from "vue";
import { Icon } from "vant";
Vue.use(Icon);
export default {
  data() {
    return {
      videoUrl: "",
      videoList: [],
      qualityList: [],
      speed: false,
    };
  },
  props: {
    videoId: {
      type: Number,
      default: 0,
      require: true,
    },
  },
  components: {
    videoPlayer,
  },
  mounted() {
    // const { videoId } = this.$route.params;
    this.init(this.videoId);
  },
  beforeDestroy() {
    this.$refs.videoPlayer.btPlayer.fullScreen.cancel("web");
  },
  methods: {
    init(videoId) {
      getUserVideoOne(videoId).then((res) => {
        console.log(res);
        this.videoInfo = res;
        this.videoList = res.videoContent;
        if (res.type == "0") {
          this.videoList = [];
        }
        let url = res.resolutionList[0].url;
        let pass = false;
        res.resolutionList.forEach((item) => {
          if (item.default) {
            url = item.url;
            pass = true;
          }
        });
        if (!pass) {
          res.resolutionList[0].default = true;
        }
        res.url = url;
        this.videoUrl = url;
        this.speed = res.doubleSpeed == "1" ? true : false;
        this.qualityList = res.resolutionList;
        // if (res.type && !res.videoContent.length) {
        //   this.videoList.push({
        //     name: res.name,
        //     url: res.url,
        //     id: res.id,
        //   });
        // }
      });
    },
    switchVideo(id) {
      this.init(id);
    },
    back() {
      this.$refs.videoPlayer.btPlayer.fullScreen.cancel("web");
      this.$emit("back");
    },
  },
};
</script>

<style scoped>
.base {
  position: relative;
}
.base .back {
  position: absolute;
  top: 0;
  left: 0;
  width: calc(100vw - 40px);
  height: 50px;
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0));
  font-size: 12px;
  color: #fff;
  text-align: left;
  padding: 10px;
  z-index: 9999999;
}
</style>
