<template>
  <div class="home">
    <div class="user">
      <div class="userInfo">
        <div class="pic">
          <van-icon name="user-o" :size="30" color="#aaa" />
        </div>
        <div class="intro">
          <div class="name">
            {{ userInfo.userName }}
            <!--  <span>{{ "UI设计师" }}</span> -->
          </div>
          <div class="company">{{ userInfo.primaryUnitName }}</div>
        </div>
      </div>
    </div>

    <div class="content">
      <van-cell class="link" is-link @click="gotoUrl('/myPlayList')">
        <template #title>
          <van-icon name="video-o" color="#9437fa" :size="26" />
          <span class="custom-title">历史播放</span>
        </template>
      </van-cell>
      <van-cell class="link" is-link @click="gotoUrl('/myFavorites')">
        <template #title>
          <van-icon name="star" color="#1989fa" :size="26" />
          <span class="custom-title">收藏夹</span>
        </template>
      </van-cell>
      <van-cell class="link" is-link @click="gotoUrl('/myLike')">
        <template #title>
          <van-icon name="good-job-o" color="#3DC0D9" :size="26" />
          <span class="custom-title">我的点赞</span>
        </template>
      </van-cell>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { getUserInfo } from "./api";
import { Cell, CellGroup, Icon } from "vant";
Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(Icon);

export default {
  name: "Home",
  components: {},
  methods: {
    handleVideoType(type) {
      this.curType = type;
    },
    gotoUrl(url) {
      this.$router.push(`${url}`);
    },
  },
  mounted() {
    getUserInfo().then((res) => {
      this.userInfo = res;
    });
  },
  data() {
    return {
      curType: "single",
      loading: false,
      finished: false,
      refreshing: false,
      userInfo: { userName: null, primaryUnitName: null },
      // List: [
      //   {
      //     name: "数据可视化",
      //     info: "企业文化是企业的核心灵魂，也是影响企业成败的关键...",
      //     date: "2022-12-12",
      //   },
      // ],
    };
  },
};
</script>

<style scoped>
.user {
  font-size: 14px;
  background: linear-gradient(to bottom, #2668b4, transparent);
  background-size: cover;
  position: relative;
  left: -12px;
  top: 0;
  width: calc(100% + 24px);
  height: 240px;
}
.user .userInfo {
  position: absolute;
  bottom: 120px;
  left: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.user .userInfo .pic {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #fff;
  margin-right: 15px;
  line-height: 60px;
}
.user .userInfo .intro {
  text-align: left;
}
.user .userInfo .intro .name {
  font-weight: bold;
  font-size: 16px;
}
.user .userInfo .intro .name span {
  font-size: 14px;
  font-weight: normal;
  margin-left: 10px;
}
.user .userInfo .intro .company {
  color: #606061;
  line-height: 30px;
}
.content {
  padding: 12px 0;
  font-size: 14px;
  position: relative;
  top: -70px;
  text-align: left;
}
.content .link {
  border-radius: 8px;
  padding: 20px 15px;
  margin-bottom: 20px;
}
.content .link i {
  margin: 0 10px;
  position: relative;
  top: 3px;
}
.content .link:first-child i {
  top: 5px;
}
</style>
