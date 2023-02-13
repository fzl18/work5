<template>
  <div class="home">
    <div class="banner" @click="gotoUrl('/videoList')">
      <img src="../assets/banner.png" width="100%" alt="" />
      <div class="text">
        <div>宝通视频门户</div>
        <div>全方位视频系列在线观看</div>
        <div>带你看世界更多精彩</div>
      </div>
    </div>

    <div ref="container" class="content">
      <van-sticky class="sticky" container="container">
        <div class="header">
          <div class="title">
            <span class="hot">HOT</span>
            <span
              :class="curType == 'single' ? 'cur' : ''"
              @click="handleVideoType('single')"
              >视频</span
            >
            <span> | </span
            ><span
              :class="curType == 'group' ? 'cur' : ''"
              @click="handleVideoType('group')"
              >系列</span
            >
          </div>
          <div class="btn" @click="gotoUrl('/videoList')">全部</div>
        </div>
      </van-sticky>
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          :finished-text="videoList.length < 6 ? '' : '———— 底都露出来了！————'"
          @load="getList"
          class="list"
          :immediate-check="false"
        >
          <div
            class="item"
            v-for="(item, index) in videoList"
            :key="index"
            @click="gotoUrl('/videoDetail', item)"
          >
            <div class="pic">
              <img :src="item.cover" alt="" width="100%" />
              <div class="tip" v-if="item.type != 0">系列</div>
            </div>
            <div class="info">
              <div class="tit van-ellipsis">{{ item.name }}</div>
              <div class="intro van-multi-ellipsis--l2">{{ item.info }}</div>
              <div class="date">
                {{ dayjs(item.publishTime).format("YYYY-MM-DD") }}
                <span>点赞数：{{ item.likeCount }}</span>
              </div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import dayjs from "dayjs";
import { List, PullRefresh, Sticky } from "vant";
import { getUserVideo } from "./api";
Vue.use(List);
Vue.use(PullRefresh);
Vue.use(Sticky);

export default {
  name: "Home",
  components: {},
  mounted() {
    this.getList();
  },

  methods: {
    dayjs,
    handleVideoType(type) {
      this.curType = type;
      this.videoList = [];
      this.currentPage = 1;
      this.getList();
    },
    gotoUrl(url, data) {
      if (data) {
        this.$router.push(`${url}?id=${data.id}`);
      } else {
        this.$router.push(`${url}`);
      }
    },
    getList() {
      if (this.refreshing) {
        this.videoList = [];
        this.currentPage = 1;
        this.refreshing = false;
      }
      getUserVideo({
        type: this.curType == "single" ? 0 : 1,
        size: this.pageSize,
        current: this.currentPage,
      }).then((res) => {
        this.videoList.push(...res.records);
        this.loading = false;
        this.finished = true;
        this.refreshing = false;
      });
    },
    onRefresh() {
      this.finished = false;
      this.loading = true;
      this.getList();
    },
  },
  data() {
    return {
      curType: "single",
      loading: false,
      finished: false,
      refreshing: false,
      videoList: [],
      currentPage: 1,
      pageSize: 20,
    };
  },
};
</script>

<style scoped>
.banner {
  position: relative;
  margin-bottom: 10px;
}
.banner .text {
  position: absolute;
  top: 45px;
  right: 40px;
  color: #fff;
  text-align: left;
}
.banner .text div:nth-child(1) {
  font-weight: bold;
  font-size: 16px;
}
.banner .text div:nth-child(2) {
  font-size: 12px;
  opacity: 0.6;
  margin: 5px 0;
}
.banner .text div:nth-child(3) {
  font-size: 12px;
  padding: 3px 6px;
  border-radius: 20px;
  text-align: center;
  background: linear-gradient(to right, #3d71fc, #6125ee);
}
.content {
  padding: 12px;
  background: #fff;
  border-radius: 6px;
  font-size: 14px;
}
.content .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 5px 0 20px 0;
  background: #fff;
}
.content .header .title .hot {
  font-weight: bold;
  color: #d33c29;
}
.content .header .title span {
  margin-right: 10px;
}
.content .header .title span.cur {
  font-size: 16px;
  font-weight: bold;
  color: black;
}
.content .header .btn {
  color: #2668b4;
}
.content .list {
  /* height: 60vh; */
}
.content .list .item {
  display: flex;
  margin-bottom: 20px;
}
.content .list .item:last-child {
  margin-bottom: 10px;
}
.content .list .pic {
  width: 140px;
  height: 76px;
  border-radius: 6px;
  background: #92adcc;
  margin-right: 12px;
  position: relative;
  overflow: hidden;
}
.content .list .pic .tip {
  position: absolute;
  top: 0;
  right: 0;
  padding: 2px 6px;
  border-radius: 0 6px 0 6px;
  background: linear-gradient(to right, #6dd4ad, #3340be);
  color: #fff;
  font-size: 10px;
}
.content .list .info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  text-align: left;
  width: calc(100% - 160px);
}
.content .list .info .tit {
  color: #101010;
  font-weight: bold;
  width: 100%;
}
.content .list .info .intro {
  font-size: 12px;
  color: #bbbbbb;
  line-height: 18px;
}
.content .list .info .date {
  font-size: 10px;
  color: #a1a1a1;
  width: 100%;
}
.content .list .info .date span {
  float: right;
}

.van-sticky--fixed .header {
  padding: 15px;
  position: relative;
  top: -10px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
}
</style>
