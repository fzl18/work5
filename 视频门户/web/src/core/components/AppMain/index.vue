<template>
  <div v-if="routerView" class="app-main-container">
    <header :class="['header', home ? 'home' : '']">
      <div class="container">
        <div class="logo" @click="gotoUrl('/')">
          <img src="@/assets/images/logo.svg" width="160" alt="" />
        </div>
        <div class="info">
          <div v-show="!isSearch" class="button">
            <span
              v-show="!home"
              style="padding-right: 20px"
              @click="gotoUrl('/')"
            >
              首页
            </span>
            <el-popover
              v-model="hVisable"
              placement="bottom-start"
              width="300"
              trigger="click"
              @show="getList('log')"
            >
              <div class="bbox">
                <div class="tit">
                  最近记录
                  <a
                    href="javasrcipt:;"
                    @click="
                      gotoUrl('/history')
                      hVisable = false
                    "
                  >
                    更早
                  </a>
                </div>
                <el-scrollbar style="height: 220px">
                  <div
                    v-for="(item, index) in historyList"
                    :key="'history' + index"
                    class="list"
                    @click="handleDetail(item.id)"
                  >
                    <div class="pic">
                      <img :src="item.cover" width="100%" />
                      <div v-if="item.type != 0" class="tag">系列</div>
                    </div>
                    <div class="context">
                      <div class="title" alt="item.name">{{ item.name }}</div>
                      <div class="date">
                        {{ dayjs(item.createTime).format('YYYY-MM-DD') }}
                      </div>
                    </div>
                  </div>
                </el-scrollbar>
              </div>
              <span slot="reference">历史记录</span>
            </el-popover>
            <el-popover
              v-model="fVisable"
              placement="bottom"
              width="300"
              trigger="click"
              @show="getList('favorite')"
            >
              <div class="bbox">
                <div class="tit">
                  收藏记录
                  <a
                    href="javasrcipt:;"
                    @click="
                      gotoUrl('/myFavorites')
                      fVisable = false
                    "
                  >
                    更多
                  </a>
                </div>
                <el-scrollbar style="height: 220px">
                  <div
                    v-for="(item, index) in favoritesList"
                    :key="'favorites' + index"
                    class="list"
                    @click="handleDetail(item.id)"
                  >
                    <div class="pic">
                      <img :src="item.cover" width="100%" />
                      <div v-if="item.type != 0" class="tag">系列</div>
                    </div>
                    <div class="context">
                      <div class="title" alt="item.name">{{ item.name }}</div>
                      <div class="date">
                        {{ dayjs(item.createTime).format('YYYY-MM-DD') }}
                      </div>
                    </div>
                  </div>
                </el-scrollbar>
              </div>
              <span slot="reference">我的收藏</span>
            </el-popover>
            <el-popover
              v-model="lVisable"
              placement="bottom-end"
              width="300"
              trigger="click"
              @show="getList('like')"
            >
              <div class="bbox">
                <div class="tit">
                  点赞记录
                  <a
                    href="javasrcipt:;"
                    @click="
                      gotoUrl('/myLike')
                      lVisable = false
                    "
                  >
                    更多
                  </a>
                </div>
                <el-scrollbar style="height: 220px">
                  <div
                    v-for="(item, index) in likesList"
                    :key="'likes' + index"
                    class="list"
                    @click="handleDetail(item.id)"
                  >
                    <div class="pic">
                      <img :src="item.cover" width="100%" />
                      <div v-if="item.type != 0" class="tag">系列</div>
                    </div>
                    <div class="context">
                      <div class="title" alt="item.name">{{ item.name }}</div>
                      <div class="date">
                        {{ dayjs(item.createTime).format('YYYY-MM-DD') }}
                      </div>
                    </div>
                  </div>
                </el-scrollbar>
              </div>
              <span slot="reference">我的点赞</span>
            </el-popover>
          </div>
          <div
            :class="['search', isSearch ? 'check' : '']"
            @click.prevent="isSearch = true"
          >
            <el-input
              v-show="isSearch"
              v-model="searchWords"
              placeholder="请输入搜索词"
              class="input"
              @change="search"
            ></el-input>
            <i class="el-icon-search" @click="search"></i>
          </div>
          <span v-show="isSearch" class="cancal" @click="isSearch = false">
            取消
          </span>
          <div class="user">
            <el-popover placement="bottom-end" width="200" trigger="hover">
              <div class="userInfo">
                <div class="name">
                  {{ userName || '' }}
                  <!-- <span>UI设计师</span> -->
                </div>
                <div class="company">{{ userInfo.primaryUnitName }}</div>
                <div class="exit" @click="logout">
                  <span>退出</span>
                  <remix-icon icon-class="logout-box-r-line"></remix-icon>
                </div>
              </div>
              <div slot="reference">
                <span class="face"><i class="el-icon-s-custom"></i></span>
                <span class="name">{{ userName || '' }}</span>
              </div>
            </el-popover>
          </div>
        </div>
      </div>
      <div v-show="home" class="container home">
        <div class="ad">
          <div>宝通视频门户</div>
          <div>全方位视频系列在线观看</div>
          <div @click="gotoUrl('/videoList')">带你看世界更多精彩</div>
        </div>
        <div class="categorybox">
          <div v-for="(item, index) in category" :key="index" class="item">
            <div
              class="tit"
              @click="gotoUrl(`/videoList?categoryId=${item.id}`)"
            >
              {{ item.label }}
            </div>
            <div class="sub">
              <span
                v-for="(data, ind) in item.children"
                :key="'sub' + ind"
                @click="gotoUrl(`/videoList?categoryId=${data.id}`)"
              >
                {{ data.label }}
              </span>
            </div>
          </div>
          <div class="item" style="width: 60px">
            <div class="tit" @click="gotoUrl('/videoList')">
              <remix-icon icon-class="apps-line" class="more"></remix-icon>
              <!-- <i class="el-icon-menu" style="font-size: 30px"></i> -->
            </div>
            <div class="sub"></div>
          </div>
        </div>
      </div>
    </header>
    <div class="container">
      <transition mode="out-in" name="fade-transform">
        <keep-alive :include="cachedRoutes" :max="keepAliveMaxNum">
          <div
            :class="[
              'body',
              home ? 'home' : '',
              $route.name == 'videoDetail' ? 'noborder' : '',
            ]"
          >
            <router-view
              :key="$route.path"
              class="app-main-height"
            ></router-view>
          </div>
        </keep-alive>
      </transition>
    </div>
    <footer class="footer-copyright">
      <remix-icon icon-class="copyright-line"></remix-icon>
      CopyRight {{ fullYear }} {{ title }} powerBy {{ copyright }}
    </footer>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { copyright, keepAliveMaxNum, title } from '@/config'
  import dayjs from 'dayjs'
  import {
    getVideoCategory,
    getUserLike,
    getUserFavorite,
    getUserVideoLog,
  } from '@/views/system/api'

  export default {
    name: 'AppMain',
    data() {
      return {
        show: false,
        fullYear: new Date().getFullYear(),
        copyright,
        title,
        keepAliveMaxNum,
        routerView: true,
        isSearch: false,
        searchWords: '',
        home: false,
        category: [],
        hVisable: false,
        fVisable: false,
        lVisable: false,
        likesList: [],
        favoritesList: [],
        historyList: [],
      }
    },
    computed: {
      ...mapGetters({
        visitedRoutes: 'coreTabsBar/visitedRoutes',
        device: 'coreSettings/device',
        loginName: 'coreUser/loginName',
        userName: 'coreUser/userName',
        userInfo: 'coreUser/userInfo',
      }),
      cachedRoutes() {
        return this.visitedRoutes
          .filter((item) => !item.meta.noKeepAlive)
          .flatMap((item) => item.matched)
      },
    },
    watch: {
      $route: {
        handler(val) {
          if (val.name == 'Index') {
            this.getCategory()
          }
          if ('mobile' === this.device) {
            this.$store.dispatch('coreSettings/foldSideBar')
          }
          this.home = val.name === 'Index'
        },
        immediate: true,
      },
    },
    created() {
      //重载所有路由
      this.$baseEventBus.$on('reload-routerview', () => {
        this.routerView = false
        this.$nextTick(() => {
          this.routerView = true
        })
      })
    },
    mounted() {
      this.getList()
    },
    methods: {
      dayjs,
      getList(type) {
        if (type) {
          switch (type) {
            case 'like':
              getUserLike().then((res) => {
                this.likesList = res.records
              })
              break
            case 'favorite':
              getUserFavorite().then((res) => {
                this.favoritesList = res.records
              })
              break
            case 'log':
              getUserVideoLog().then((res) => {
                this.historyList = res.records
              })
              break

            default:
              break
          }
        } else {
          getUserLike().then((res) => {
            this.likesList = res.records
          })
          getUserFavorite().then((res) => {
            this.favoritesList = res.records
          })
          getUserVideoLog().then((res) => {
            this.historyList = res.records
          })
        }
      },
      getCategory() {
        getVideoCategory().then((res) => {
          let data = []
          let arr = []
          if (res.records.length) {
            res.records.map((item) => {
              if (item.parentId) {
                arr.forEach((val) => {
                  if (item.parentId == val.id) {
                    val.children.push({
                      id: item.id,
                      label: item.name,
                      children: [],
                    })
                  }
                })
              } else {
                arr.push({
                  id: item.id,
                  label: item.name,
                  children: [],
                })
              }
            })
            data = arr
            this.defaultList = JSON.parse(JSON.stringify(data))
            this.loopChange(data)
          }
          this.category = data.splice(0, 4)
          this.category.map((item) => {
            item.children = item.children.splice(0, 4)
          })
        })
      },
      search() {
        if (!this.isSearch) {
          return
        }
        if (this.searchWords) {
          console.log(this.searchWords)
          this.gotoUrl(`/videoSearch?key=${this.searchWords}`)
          setTimeout(() => {
            this.isSearch = false
            this.searchWords = ''
          }, 10)
        } else {
          this.$message({ type: 'error', message: '请输入要搜索的关键词' })
        }
      },
      gotoUrl(route) {
        this.$router.push(`/system${route}`)
      },
      handleDetail(id) {
        this.fVisable = false
        this.hVisable = false
        this.lVisable = false
        this.gotoUrl(`/videoDetail?id=${id}`)
      },

      loopChange(data) {
        data.forEach((item) => {
          item.isEdit = false
          if (item.children && item.children.length) {
            this.loopChange(item.children)
          }
        })
      },
      async logout() {
        await this.$store.dispatch('coreUser/logout')
      },
    },
  }
</script>

<style lang="scss" scoped>
  $maxWidth: 1400px;
  .app-main-container {
    font-family: Arial, Helvetica, sans-serif;
    width: 100%;
    overflow: hidden;
    .header {
      display: flex;
      // justify-content: center;
      align-items: center;
      flex-direction: column;
      background: url('../../../assets/images/banner_2.png') top center
        no-repeat;
      // background-size: cover;
      color: #fff;
      &.home {
        background: url('../../../assets/images/banner_1.png') top center
          no-repeat;
        height: 398px;
        margin-bottom: 70px;
      }
      .container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 70px;
        width: 100%;
        max-width: $maxWidth;
        .logo {
          cursor: pointer;
          filter: brightness(200);
          img {
            filter: brightness(300) hue-rotate(45deg);
          }
        }
        &.home {
          position: relative;
          height: 300px;
          &::after {
            content: '';
            width: 150%;
            height: 1px;
            background: rgba(255, 255, 255, 0.2);
            position: absolute;
            top: 0px;
            left: -25%;
          }

          .ad {
            position: absolute;
            top: 70px;
            right: 40%;
            div {
              &:nth-child(1) {
                font-size: 30px;
              }
              &:nth-child(2) {
                font-size: 18px;
                margin: 15px 0;
              }
              &:nth-child(3) {
                border-radius: 20px;
                padding: 7px 20px;
                cursor: pointer;
                text-align: center;
                font-size: 15px;
                background: linear-gradient(
                  to right,
                  rgb(60 115 253),
                  rgb(97 37 238)
                );
              }
            }
          }
          .categorybox {
            position: absolute;
            bottom: -76px;
            left: 0;
            border-radius: 4px;
            background: #fff;
            width: 100%;
            box-shadow: 0 2px 8px rgba(34, 34, 34, 0.27);
            color: #000;
            height: 100px;
            padding: 15px 20px;
            display: flex;
            justify-content: space-around;
            align-items: center;
            .item {
              width: 23%;
              margin: 1%;
              .tit {
                font-size: 18px;
                font-weight: 600;
                margin-bottom: 10px;
                cursor: pointer;
              }
              .more {
                font-size: 26px;
                background: #2476f1;
                font-weight: 100;
                border-radius: 8px;
                padding: 8px;
                color: #fff;
              }
              .sub {
                color: rgb(96, 96, 96);
                font-size: 14px;
                span {
                  margin-right: 5px;
                  cursor: pointer;
                  &::after {
                    content: ' /';
                  }
                  &:last-child {
                    &::after {
                      content: '';
                    }
                  }
                }
              }
            }
          }
        }
        .info {
          display: flex;
          align-items: center;
          font-size: 14px;
          .button {
            span {
              display: inline-block;
              margin-right: 20px;
              border-right: 1px solid rgba(255, 255, 255, 0.2);
              cursor: pointer;
              &:last-child {
                border: none;
                padding-right: 0;
              }
            }
          }
          .search {
            cursor: pointer;
            border-radius: 4px;
            background: #2c61ba;
            padding: 6px 2px;
            margin-right: 10px;
            display: flex;
            align-items: center;
            transition: all 150ms;
            width: 28px;
            &.check {
              padding: 4px 10px;
              border-radius: 20px;
              background: rgba(44, 96, 186, 0.351);
              width: 320px;
              transition: all 500ms;
            }
            .input {
              margin: 0 10px 0 0;
              input {
                height: 26px !important;
                line-height: 26px !important;
              }
            }
            i {
              margin: 0 5px;
            }
          }
          .cancal {
            cursor: pointer;
          }
          .user {
            margin-left: 20px;
            cursor: pointer;

            .face {
              display: inline-block;
              text-align: center;
              line-height: 28px;
              width: 28px;
              height: 28px;
              border-radius: 50%;
              background: linear-gradient(#215ac4, #0a2142);
              border: 1px solid #7aaada;
              font-size: 18px;
            }
            .name {
              margin-left: 10px;
              position: relative;
              top: -2px;
            }
          }
        }
      }
    }
    .app-main-height {
      // min-height: $base-app-main-height;
    }
    .container {
      // width: 100%;
      display: flex;
      justify-content: center;
      .body {
        width: 100%;
        max-width: $maxWidth;
        min-height: calc(100vh - 170px);
        border-top: 3.5px solid #2476f1;
        margin-top: 20px;
        background: #fff;
        padding: 20px 30px;
        &.noborder {
          border: none;
        }
        &.home {
          border-top: none;
          margin-top: 0px;
          background: none;
          padding: 0;
        }
      }
    }
    .footer-copyright {
      display: flex;
      align-items: center;
      justify-content: center;
      background: #1c253f;
      color: #fff;
      height: 48px;
      margin-top: 30px;
      i {
        margin: 0 5px;
      }
    }
  }
  .bbox {
    .tit {
      font-size: 16px;
      font-weight: 700;
      color: #000;
      margin-bottom: 15px;
      a {
        font-size: 12px;
        float: right;
        line-height: 22px;
      }
    }
    .list {
      display: flex;
      margin-bottom: 15px;
      cursor: pointer;
      &:last-child {
        margin-bottom: 5px;
      }
      .pic {
        margin-right: 15px;
        width: 106px;
        height: 60px;
        background: #7aaada;
        border-radius: 8px;
        position: relative;
        overflow: hidden;
        img {
          // background-size: 100% 100%;
          width: 100%;
          height: 100%;
        }
        .tag {
          position: absolute;
          right: 0;
          top: 0;
          color: #fff;
          padding: 1px 4px;
          background: linear-gradient(to right bottom, #29dfa8, #3233c6);
          border-radius: 0 6px 0 6px;
        }
      }
      .context {
        width: calc(100% - 121px);
      }
      .title {
        color: #000;
        font-weight: 700;
        margin: 8px 0;
        font-size: 13px;
        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
      }
      .date {
        color: rgb(148, 148, 148);
      }
    }
  }
  .userInfo {
    font-size: 14px;
    font-weight: 500;
    .name {
      color: #2476f1;
      font-weight: 700;

      span {
        margin-left: 15px;
        color: rgb(120, 120, 120);
      }
    }
    .company {
      margin: 10px 0;
      padding-bottom: 10px;
      border-bottom: 1px dashed rgb(182, 182, 182);
    }
    .exit {
      cursor: pointer;
      span {
        margin-right: 5px;
      }
    }
  }
</style>
