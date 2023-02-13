<template>
  <div class="home">
    <div class="search">
      <van-field
        v-model="searchKey"
        placeholder="请输入搜索内容"
        right-icon="search"
        class="text"
        clearable
        @click-right-icon="search"
      />
    </div>
    <div ref="container" class="content">
      <van-sticky class="sticky" container="container">
        <div class="header">
          <div class="title">
            <van-tabs
              animated
              swipeable
              title-active-color="#2668b4"
              color="#2668b4"
              @click="handleTabs"
            >
              <van-tab
                v-for="item in categorys"
                :key="item.id"
                :title="item.label"
              >
                <span
                  v-for="data in item.children"
                  :class="['subTit', currentCategoryId == data.id ? 'cur' : '']"
                  :key="data.id"
                  @click="handleCategory(data.id)"
                >
                  {{ data.label }}
                </span>
              </van-tab>
            </van-tabs>
          </div>
        </div>
      </van-sticky>
      <van-empty v-if="!videoList.length" description="暂无数据" />
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
              <div v-if="item.type != 0" class="tip">系列</div>
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
import { List, PullRefresh, Sticky, Field, Tab, Tabs, Empty } from "vant";
import { getUserVideo, getVideoCategory } from "./api";
Vue.use(List);
Vue.use(PullRefresh);
Vue.use(Sticky);
Vue.use(Field);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(Empty);

export default {
  name: "Home",
  components: {},
  mounted() {
    this.getCategory();
    this.getList();
  },
  watch: {
    currentCategoryId(val) {
      console.log(val);
      this.getList();
    },
  },
  methods: {
    dayjs,
    getCategory() {
      getVideoCategory().then((res) => {
        let data = [];
        let arr = [];
        if (res.records.length) {
          res.records.map((item) => {
            if (item.parentId) {
              arr.forEach((val) => {
                if (item.parentId == val.id) {
                  val.children.push({
                    id: item.id,
                    label: item.name,
                    children: [],
                  });
                }
              });
            } else {
              arr.push({
                id: item.id,
                label: item.name,
                children: [],
              });
            }
          });

          data = arr;
          this.defaultList = JSON.parse(JSON.stringify(data));
          // this.loopChange(data)
        }
        this.categorys = data;
        this.categorys.unshift({ label: "全部分类", id: undefined });
      });
    },
    handleTabs(index) {
      this.handleCategory(this.categorys[index].id);
    },
    handleCategory(id) {
      this.videoList = [];
      this.currentPage = 1;
      this.currentCategoryId = id;
    },
    handleVideoType(type) {
      this.curType = type;
    },
    gotoUrl(url, data) {
      this.$router.push(`${url}?id=${data.id}`);
    },
    getList(isSearch) {
      if (isSearch) {
        this.videoList = [];
        this.currentPage = 1;
      }
      if (this.refreshing) {
        this.videoList = [];
        this.currentPage = 1;
        this.refreshing = false;
      }
      getUserVideo({
        // type: this.curType == "single" ? 0 : 1,
        categoryIds: this.currentCategoryId,
        info: isSearch ? this.searchKey : undefined,
        current: this.currentPage,
      }).then((res) => {
        this.videoList.push(...res.records);
        this.loading = false;
        this.refreshing = false;
        this.currentPage++;
        if (res.total <= this.videoList.length) {
          this.finished = true;
        }
      });
    },
    search() {
      this.getList(true);
    },
    onRefresh() {
      this.finished = false;
      this.loading = true;
      this.getList();
    },
  },
  data() {
    return {
      categorys: [],
      currentCategoryId: undefined,
      searchKey: "",
      // curType: "single",
      loading: false,
      finished: false,
      refreshing: false,
      videoList: [],
      currentPage: 1,
    };
  },
};
</script>

<style scoped>
.search {
  padding: 12px;
  background: #fff;
  border-radius: 6px;
  font-size: 14px;
  margin-bottom: 10px;
}
.search .text {
  background: #f6f6f7;
  border-radius: 6px;
}
.content {
  padding: 12px;
  background: #fff;
  border-radius: 6px;
  font-size: 14px;
}
.content .header {
  /* display: flex;
  justify-content: space-between;
  align-items: center; */
  margin: 5px 0 20px 0;
  background: #fff;
}
.content .header .title .subTit {
  padding: 3px 10px;
  background: #f6f6f7;
  border-radius: 10px;
  display: inline-block;
  margin-bottom: 10px;
}

.content .header .title .subTit.cur {
  background: #2668b4;
  color: #fff;
  font-weight: normal;
  font-size: 14px;
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
.van-tab__pane,
.van-tab__pane-wrapper {
  text-align: left;
  margin-top: 10px;
  margin-bottom: 3px;
}
</style>
