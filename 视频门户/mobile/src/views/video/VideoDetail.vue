<template>
  <div>
    <div class="home">
      <div class="pic">
        <!-- <img :src="videoInfo.cover" alt="" /> -->
        <videoPlayer
          :videoUrl="videoUrl"
          :videoList="videoList"
          :qualityList="qualityList"
          :speed="speed"
          :screen="screen"
          @switchVideo="switchVideo"
          ref="videoPlayer"
        />
      </div>
      <div class="content">
        <div class="title">
          <div class="name">{{ videoInfo.name }}</div>
          <div class="subtit">
            <span>播放数：{{ videoInfo.playCount }}</span>
            <span>点赞数：{{ videoInfo.likeCount }}</span>
            <span>收藏数：{{ videoInfo.favoriteCount }}</span>
          </div>
        </div>
        <div class="intro">
          <div class="tab">简介</div>
          <div class="text">
            {{ videoInfo.info }}
          </div>
        </div>
        <div class="author">
          <span>发布人: {{ videoInfo.publishName }}</span>
          <span>发布时间: {{ videoInfo.publishTime }}</span>
        </div>

        <div class="intro">
          <div class="tab">选集</div>
        </div>
        <div class="videoList" v-if="videoList.length">
          <div class="item" v-for="(item, index) in videoList" :key="item.id">
            <div class="pic" @click="onPlay(item)">
              <img :src="videoInfo.cover" alt="" />
            </div>
            <div class="info">
              <div>视频{{ index + 1 }}</div>
              <div>{{ item.name }}</div>
            </div>
          </div>
        </div>
      </div>
      <van-goods-action>
        <!-- <van-goods-action-icon
          :icon="videoInfo.userLikeId ? 'good-job' : 'good-job-o'"
          text="点赞"
          color="#2668B4"
          @click="onClickIcon('like')"
          class="like"
        />
        <van-goods-action-icon
          :icon="videoInfo.userFavoriteId ? 'star' : 'star-o'"
          text="收藏"
          color="#2668B4"
          @click="onClickIcon('fav')"
          class="like"
        /> -->
        <div class="button">
          <van-button plain type="info" @click="onClickIcon('like')">
            <van-icon
              :name="videoInfo.userLikeId ? `good-job` : `good-job-o`"
            />
            {{ videoInfo.userLikeId ? "已" : null }}点赞</van-button
          >
        </div>
        <div class="button">
          <van-button plain type="info" @click="onClickIcon('fav')"
            ><van-icon :name="videoInfo.userFavoriteId ? `star` : `star-o`" />
            {{ videoInfo.userFavoriteId ? "已" : null }}收藏</van-button
          >
        </div>
        <!-- <van-goods-action-button
          type="danger"
          text="开始观看"
          @click="onPlay('')"
          color="#2A76F8"
        /> -->
      </van-goods-action>
    </div>
    <!-- <Player v-if="playerShow" :videoId="videoId" ref="player" @back="back" /> -->
  </div>
</template>

<script>
import Vue from "vue";
import {
  GoodsAction,
  GoodsActionIcon,
  GoodsActionButton,
  Toast,
  Button,
  Icon,
} from "vant";
import {
  getUserVideoOne,
  delUserLike,
  postUserLike,
  delUserFavorite,
  postUserFavorite,
  postUserVideoLog,
} from "../api";
// import Player from "./Player.vue";
import videoPlayer from "../../components/videoPlayer";

Vue.use(GoodsAction);
Vue.use(GoodsActionButton);
Vue.use(GoodsActionIcon);
Vue.use(Button);
Vue.use(Icon);
Vue.use(Toast);

export default {
  name: "Home",
  components: { videoPlayer },
  mounted() {
    this.getVideoInfo();
  },
  methods: {
    getVideoInfo(id) {
      const data = id || this.$route.query.id;
      postUserVideoLog({ videoId: data });
      getUserVideoOne(data).then((res) => {
        if (!id) this.videoInfo = res;
        this.videoList = res.videoContent;
        this.speed = res.doubleSpeed == "1";
        this.videoUrl = res.resolutionList[0].url;
        this.screen = res.resolutionList[0].screen;
        res.resolutionList.forEach((item) => {
          if (item.default) {
            this.videoUrl = item.url;
            this.screen = item.screen;
          }
        });
        if (res.type && !res.videoContent.length) {
          this.videoList.push({
            name: res.name,
            url: res.url,
            id: res.id,
          });
        }
        this.qualityList = res.resolutionList;
      });
    },
    // gotoUrl(url) {
    //   this.$router.push(`${url}`);
    // },
    onClickIcon(type) {
      if (type == "like") {
        if (this.videoInfo.userLikeId) {
          delUserLike({ idList: this.videoInfo.userLikeId }).then((res) => {
            if (res) {
              this.videoInfo.userLikeId = 0;
              this.videoInfo.likeCount--;
              Toast({ message: "操作成功！", position: "bottom" });
            }
          });
        } else {
          postUserLike({ videoId: this.videoInfo.id }).then((res) => {
            if (res) {
              getUserVideoOne(this.$route.query.id).then((res) => {
                this.videoInfo.userLikeId = res.userLikeId;
                this.videoInfo.likeCount++;
                Toast({ message: "操作成功！", position: "bottom" });
              });
            }
          });
        }
      } else {
        if (this.videoInfo.userFavoriteId) {
          delUserFavorite({ idList: this.videoInfo.userFavoriteId }).then(
            (res) => {
              if (res) {
                this.videoInfo.userFavoriteId = 0;
                this.videoInfo.favoriteCount--;
                Toast({ message: "操作成功！", position: "bottom" });
              }
            }
          );
        } else {
          postUserFavorite({ videoId: this.videoInfo.id }).then((res) => {
            if (res) {
              getUserVideoOne(this.$route.query.id).then((res) => {
                this.videoInfo.userFavoriteId = res.userFavoriteId;
                this.videoInfo.favoriteCount++;
                Toast({ message: "操作成功！", position: "bottom" });
              });
            }
          });
        }
      }
    },
    onPlay(data) {
      postUserVideoLog({ videoId: data ? data.id : this.videoInfo.id });
      this.videoId = data ? data.id : this.videoInfo.videoContent[0].id;
      this.getVideoInfo(this.videoId);
      // this.playerShow = true;
      // this.$router.push({
      //   name: "VideoPlayer",
      //   params: {
      //     // url: data ? data.url : this.videoInfo.url,
      //     // info: this.videoInfo,
      //     // list: this.videoList,
      //     videoId: data ? data.id : this.videoInfo.videoContent[0].id,
      //   },
      // });
    },
    // back() {
    //   this.playerShow = false;
    // },
    switchVideo(id) {
      this.getVideoInfo(id);
    },
  },
  beforeDestroy() {
    this.$refs.videoPlayer.btPlayer.fullScreen.cancel("web");
  },
  watch: {
    "$route.query.id"() {
      this.getVideoInfo();
    },
  },
  data() {
    return {
      videoInfo: {
        userFavoriteId: 0,
        userLikeId: 0,
      },
      videoList: [],
      playerShow: false,
      videoId: null,
      videoUrl: null,
      qualityList: [],
      speed: false,
      screen: null,
    };
  },
};
</script>

<style scoped>
.pic {
  font-size: 14px;
  background: #000;
  position: relative;
  left: -12px;
  top: 0;
  width: calc(100% + 24px);
  height: 210px;
  display: flex;
  justify-content: center;
  align-items: center;
}
/* .home > .pic::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.05) 30%,
    rgba(0, 0, 0, 0.8)
  );
} */
.pic img {
  width: 100%;
  height: 100%;
}
.content {
  padding: 12px;
  font-size: 14px;
  position: relative;
  top: 12px;
  text-align: left;
  background: #fff;
  border-radius: 6px;
  min-height: calc(100vh - 328px);
}
.content .title .name {
  font-size: 20px;
  font-weight: bold;
}
.content .title .subtit {
  font-size: 12px;
  color: #606061;
}
.content .title .subtit span {
  margin-right: 20px;
  line-height: 28px;
}
.content .intro {
  margin-top: 20px;
  position: relative;
}
.content .intro .tab {
  font-size: 16px;
  /* color: #2668b4; */
  font-weight: 600;
  /* margin-bottom: 10px; */
  /* padding: 6px 0; */
  /* padding-bottom: 10px; */
  /* border-bottom: 3px solid #2668b4; */
  display: inline-block;
  position: relative;
  z-index: 99;
}
/* .content .intro::after {
  content: "";
  width: 100%;
  height: 1px;
  background: #bbbbbb;
  position: absolute;
  top: 32px;
  left: 0;
} */
.content .intro .text {
  margin: 10px 0;
}
.content .author {
  color: #a1a1a1;
  font-size: 12px;
  position: relative;
  margin-bottom: 30px;
}
.content .author::after {
  content: "";
  width: 100%;
  height: 1px;
  background: #eeeeee;
  position: absolute;
  top: 32px;
  left: 0;
}
.content .author span {
  margin-right: 20px;
}
.content .videoList {
  margin-top: 10px;
}
.content .videoList .item {
  display: flex;
  margin-bottom: 10px;
}
.content .videoList .item .pic {
  width: 100px;
  height: 56px;
  border-radius: 6px;
  margin-left: 10px;
  background: #a1a1a1;
}
.content .videoList .item .info div:nth-child(1) {
  color: #bbbbbb;
  font-size: 12px;
  line-height: 28px;
}
.content .videoList .item .info div:nth-child(2) {
  color: #101010;
  font-weight: 600;
}
.van-goods-action .button {
  font-size: 14px;
  width: 38%;
}
.van-goods-action .button button {
  border-radius: 30px;
  height: 30px;
  width: 70%;
  color: #2668b4;
  border-color: #2668b4;
}
.van-goods-action .button i {
  font-size: 18px;
}
</style>
