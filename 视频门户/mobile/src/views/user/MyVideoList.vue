<template>
  <div class="home">
    <van-sticky
      class="sticky"
      v-show="$route.name == 'MyPlayList'"
      container="container"
    >
      <van-dropdown-menu class="menu" active-color="#2668B4">
        <van-dropdown-item v-model="value" :options="option" />
      </van-dropdown-menu>
    </van-sticky>
    <div ref="container" class="content">
      <van-empty v-if="!videoList.length" description="暂无数据" />
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          :finished-text="videoList.length < 6 ? '' : '———— 底都露出来了！————'"
          @load="getList"
          class="list"
        >
          <van-swipe-cell v-for="(item, index) in videoList" :key="index">
            <div class="item">
              <div class="pic" @click="gotoUrl(`/videoDetail?id=${item.id}`)">
                <img :src="item.cover" alt="" width="100%" />
                <div v-if="item.type != 0" class="tip">系列</div>
              </div>
              <div class="info">
                <div
                  class="tit van-ellipsis"
                  @click="gotoUrl(`/videoDetail?id=${item.id}`)"
                >
                  {{ item.name }}
                </div>
                <div class="intro van-multi-ellipsis--l2">{{ item.info }}</div>
                <div class="date">
                  {{ $route.name == "MyPlayList" ? "播放日期：" : null }}
                  {{ dayjs(item.createTime).format("YYYY-MM-DD") }}
                  <!-- <span>点赞数：{{ item.likeCount }}</span> -->
                </div>
              </div>
            </div>
            <template #right>
              <div class="delete-button">
                <van-icon class="icon" :name="iconName" />
                <van-button
                  square
                  :text="$route.name == 'MyPlayList' ? '删除' : '取消'"
                  color="#bc4040"
                  @click="handleDel(item)"
                />
              </div>
            </template>
          </van-swipe-cell>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import dayjs from "dayjs";
import {
  List,
  PullRefresh,
  Sticky,
  DropdownMenu,
  DropdownItem,
  SwipeCell,
  Button,
  Icon,
  Empty,
} from "vant";
import {
  getUserLike,
  delUserLike,
  getUserFavorite,
  delUserFavorite,
  getUserVideoLog,
  delUserVideoLog,
} from "../api";
Vue.use(List);
Vue.use(PullRefresh);
Vue.use(Sticky);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(SwipeCell);
Vue.use(Button);
Vue.use(Icon);
Vue.use(Empty);

export default {
  name: "Home",
  components: {},
  mounted() {
    this.init();
  },
  watch: {
    value() {
      this.getList();
    },
  },
  methods: {
    dayjs,
    init() {
      const { name } = this.$route;
      switch (name) {
        case "MyLike":
          this.iconName = "good-job";
          break;
        case "MyPlayList":
          this.iconName = "delete";
          break;
        case "MyFavorites":
          this.iconName = "star";
          break;
        default:
          break;
      }
      this.getList();
    },
    getList() {
      const type = this.$route.name;
      console.log(type);
      switch (type) {
        case "MyLike":
          getUserLike({ size: 999 }).then((res) => {
            this.videoList = res.records;
            this.loading = false;
            this.refreshing = false;
            if (res.total == this.videoList.length) {
              this.finished = true;
            }
          });
          break;
        case "MyFavorites":
          getUserFavorite({ size: 999 }).then((res) => {
            this.videoList = res.records;
            this.loading = false;
            this.refreshing = false;
            if (res.total == this.videoList.length) {
              this.finished = true;
            }
          });
          break;
        case "MyPlayList":
          getUserVideoLog({
            size: 999,
            startTime:
              this.value == "week"
                ? dayjs().add(-7, "day").format("YYYY-MM-DD HH:mm:ss")
                : dayjs().add(-1, "month").format("YYYY-MM-DD HH:mm:ss"),
            endTime:
              this.value == "week"
                ? `${dayjs().format("YYYY-MM-DD")} 23:59:59`
                : `${dayjs().add(-7, "day").format("YYYY-MM-DD")} 23:59:59`,
          }).then((res) => {
            this.videoList = res.records;
            this.loading = false;
            this.refreshing = false;
            if (res.total == this.videoList.length) {
              this.finished = true;
            }
          });
          break;
        // case 'videoSearch':
        //   getUserVideo({
        //     info: query.key,
        //   }).then((res) => {
        //     this.list = res.records
        //     this.typeText = `关键词 "${query.key}" : 已为您找到"<span style='color:red'>${res.total}</span>"条结果`
        //     this.search.page = res.current
        //     this.total = res.total
        //   })
        //   break
        default:
          break;
      }
      if (this.refreshing) {
        this.videoList = [];
        this.refreshing = false;
      }
      // getUserVideo({}).then((res) => {
      //   this.videoList = res.records;
      //   this.loading = false;
      //   this.refreshing = false;
      //   if (res.total == this.videoList.length) {
      //     this.finished = true;
      //   }
      // });
    },
    gotoUrl(path) {
      this.$router.push(`${path}`);
    },
    onRefresh() {
      this.finished = false;
      this.loading = true;
      this.getList();
    },
    handleDel(item) {
      const type = this.$route.name;
      switch (type) {
        case "MyLike":
          delUserLike({ idList: item.parentId }).then(() => {
            this.getList();
          });
          break;
        case "MyFavorites":
          delUserFavorite({ idList: item.parentId }).then(() => {
            this.getList();
          });
          break;
        case "MyPlayList":
          delUserVideoLog({ idList: item.parentId }).then(() => {
            this.getList();
          });
          break;
        default:
          break;
      }
    },
  },
  data() {
    return {
      value: "week",
      iconName: null,
      option: [
        { text: "近一周", value: "week" },
        { text: "近一月", value: "month" },
      ],
      // curType: "single",
      loading: false,
      finished: false,
      refreshing: false,
      videoList: [],
    };
  },
};
</script>

<style scoped>
.sticky {
  border-radius: 12px;
  font-size: 14px;
  margin-bottom: 10px;
  text-align: left;
}

.content {
  /* background: #fff; */
  font-size: 14px;
}

.content .list {
  /* height: 60vh; */
}
.content .list .item {
  display: flex;
  margin-bottom: 15px;
  background: #fff;
  padding: 12px;
  border-radius: 6px;
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

.van-swipe-cell__right .delete-button {
  height: 100%;
  background: #bc4040;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
  border-radius: 0 10px 10px 0;
}
.van-swipe-cell__right .delete-button .icon {
  color: #fff;
  font-size: 22px;
}
</style>
