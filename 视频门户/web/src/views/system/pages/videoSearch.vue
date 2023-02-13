<template>
  <div class="videoList">
    <div class="banner">
      <i class="el-icon-arrow-left" @click="$router.back()"></i>
      <span v-html="typeText"></span>
    </div>
    <div class="listBox">
      <div v-if="type !== 'history'" class="list">
        <div v-show="false" class="empty">
          <img src="@/assets/images/error/empty.jpg" alt="" width="140" />
        </div>
        <div v-show="true" class="videos">
          <div
            v-for="(item, index) in list"
            :key="index"
            class="item"
            @click="handleDetail(item.id)"
          >
            <div class="pic">
              <img :src="item.cover" alt="" width="100%" height="100%" />
              <div v-if="item.type != 0" class="tag">系列</div>
              <div
                v-show="type != 'videoSearch'"
                class="del"
                @click.stop="handleDel(item)"
              >
                <i class="el-icon-delete"></i>
              </div>
            </div>
            <div class="title">{{ item.name }}</div>
            <!-- <div class="info">
              <div class="date">{{ item.date }}</div>
              <div class="like">点赞数：{{ item.like }}</div>
            </div> -->
          </div>
        </div>
        <bt-pagination
          :total="total"
          :page.sync="search.page"
          :limit.sync="search.pageSize"
          class="pagebar"
          @pageSizeChange="pageSizeChange"
          @pagination="getList"
        ></bt-pagination>
      </div>

      <div v-if="type == 'history'" class="list">
        <div v-show="false" class="empty">
          <img src="@/assets/images/error/empty.jpg" alt="" width="140" />
        </div>
        <div class="week">最近一周</div>
        <div v-show="true" class="videos" style="min-height: auto">
          <div
            v-for="(item, index) in list"
            :key="index"
            class="item"
            @click="handleDetail(item.id)"
          >
            <div class="date">{{ item.date }}</div>
            <div class="pic">
              <img :src="item.cover" alt="" width="100%" height="100%" />
              <div v-if="item.type != 0" class="tag">系列</div>
              <div class="del" @click.stop="handleDel(item)">
                <i class="el-icon-delete"></i>
              </div>
            </div>
            <div class="title">{{ item.name }}</div>
          </div>
        </div>
        <bt-pagination
          :total="total"
          :page.sync="search.page"
          :limit.sync="search.pageSize"
          class="pagebar"
          @pageSizeChange="pageSizeChange"
          @pagination="getHistoryList('week')"
        ></bt-pagination>

        <div class="week" style="margin: 40px 0 20px 0">最近一月</div>
        <div v-show="true" class="videos">
          <div
            v-for="(item, index) in list2"
            :key="index"
            class="item"
            @click="handleDetail(item.id)"
          >
            <div class="date">{{ item.date }}</div>
            <div class="pic">
              <img :src="item.cover" alt="" width="100%" height="100%" />
              <div v-if="item.type != 0" class="tag">系列</div>
              <div class="del" @click.stop="handleDel(item)">
                <i class="el-icon-delete"></i>
              </div>
            </div>
            <div class="title">{{ item.name }}</div>
          </div>
        </div>
        <bt-pagination
          :total="total2"
          :page.sync="search2.page"
          :limit.sync="search2.pageSize"
          class="pagebar"
          @pageSizeChange="pageSizeChange2"
          @pagination="getHistoryList('month')"
        ></bt-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    getUserVideo,
    getUserLike,
    delUserLike,
    getUserFavorite,
    delUserFavorite,
    getUserVideoLog,
    delUserVideoLog,
  } from '@/views/system/api'
  import dayjs from 'dayjs'
  export default {
    data() {
      return {
        typeText: '',
        type: null,
        list: [
          { name: '如何对企业文化进行修订-新', like: 53, date: '2022–09-12' },
        ],
        search: {
          page: 1,
          pageSize: 12,
        },
        total: 10,
        list2: [
          { name: '如何对企业文化进行修订-新', like: 53, date: '2022–09-12' },
        ],
        search2: {
          page: 1,
          pageSize: 12,
        },
        total2: 10,
      }
    },
    watch: {
      $route(val) {
        this.getList()
      },
    },
    mounted() {
      this.getList()
    },
    methods: {
      getList() {
        const { name, query } = this.$route
        this.type = name
        switch (name) {
          case 'myLike':
            this.typeText = '我的点赞'
            getUserLike({
              current: this.search.page,
              size: this.search.pageSize,
            }).then((res) => {
              this.list = res.records
              this.search.page = res.current
              this.total = res.total
            })
            break
          case 'myFavorites':
            this.typeText = '我的收藏'
            getUserFavorite({
              current: this.search.page,
              size: this.search.pageSize,
            }).then((res) => {
              this.list = res.records
              this.search.page = res.current
              this.total = res.total
            })
            break
          case 'history':
            this.typeText = '历史记录'
            this.getHistoryList('week')
            this.getHistoryList('month')
            break
          case 'videoSearch':
            getUserVideo({
              info: query.key,
              current: this.search.page,
              size: this.search.pageSize,
            }).then((res) => {
              this.list = res.records
              this.typeText = `关键词 "${query.key}" : 已为您找到"<span style='color:red'>${res.total}</span>"条结果`
              this.search.page = res.current
              this.total = res.total
            })
            break
          default:
            break
        }
      },
      getHistoryList(type) {
        if (type == 'week') {
          getUserVideoLog({
            startTime: dayjs().add(-7, 'day').format('YYYY-MM-DD HH:mm:ss'),
            endTime: `${dayjs().format('YYYY-MM-DD')} 23:59:59`,
            current: this.search.page,
            size: this.search.pageSize,
          }).then((res) => {
            console.log(res)
            this.list = res.records
            this.total = res.total
            this.search.page = res.current
          })
        }
        if (type == 'month') {
          getUserVideoLog({
            startTime: dayjs().add(-1, 'month').format('YYYY-MM-DD HH:mm:ss'),
            endTime: `${dayjs().add(-7, 'day').format('YYYY-MM-DD')} 23:59:59`,
            current: this.search2.page,
            size: this.search2.pageSize,
          }).then((res) => {
            console.log(res)
            this.list2 = res.records
            this.total2 = res.total
            this.search2.page = res.current
          })
        }
      },
      gotoUrl(route) {
        this.$router.push(`/system${route}`)
      },
      handleDetail(id) {
        this.gotoUrl(`/videoDetail?id=${id}`)
      },
      handleDel(item) {
        const { name, query } = this.$route
        this.type = name
        switch (name) {
          case 'myLike':
            this.typeText = '我的点赞'
            delUserLike({ idList: item.parentId }).then((res) => {
              if (res) {
                this.getList()
                this.$baseMessage('删除成功！', 'success')
              }
            })
            break
          case 'myFavorites':
            this.typeText = '我的收藏'
            delUserFavorite({ idList: item.parentId }).then((res) => {
              if (res) {
                this.getList()
                this.$baseMessage('删除成功！', 'success')
              }
            })
            break
          case 'history':
            this.typeText = '历史记录'
            delUserVideoLog({ idList: item.parentId }).then((res) => {
              if (res) {
                this.getHistoryList('week')
                this.getHistoryList('month')
                this.$baseMessage('删除成功！', 'success')
              }
            })
            break

          default:
            break
        }
      },
      pageSizeChange(page) {
        this.search.page = page.page
        this.search.pageSize = page.limit
        this.getList()
      },
      pageSizeChange2(page) {
        this.search.page = page.page
        this.search.pageSize = page.limit
        this.getList()
      },
    },
  }
</script>

<style lang="scss" scoped>
  .pagebar {
  }
  .videoList {
    .banner {
      display: flex;
      align-items: center;
      font-size: 16px;
      font-weight: 500;
      border-bottom: 1px solid #bfc1c5;
      margin-bottom: 35px;
      padding-bottom: 15px;
      font-weight: 600;
      i {
        font-size: 26px;
        margin-right: 10px;
        cursor: pointer;
      }
    }
    .listBox {
      .list {
        width: 100%;
        .week {
          margin: 20px 0;
          font-size: 20px;
          font-weight: bold;
        }
        .empty {
          display: flex;
          justify-content: center;
          align-items: center;
          height: calc(100vh - 290px);
        }
        .videos {
          min-height: 450px;
          margin-top: 20px;
          display: grid;
          grid-template-columns: repeat(4, 23%);
          column-gap: 35px;
          row-gap: 30px;
          .item {
            // width: 300px;
            // margin-bottom: 25px;
            cursor: pointer;
            .date {
              color: #94979a;
              margin-bottom: 10px;
            }
            .pic {
              width: 310px;
              height: 170px;
              border-radius: 6px;
              background: #95b3d1;
              margin-bottom: 15px;
              position: relative;
              overflow: hidden;
              .tag {
                position: absolute;
                top: 0;
                right: 0;
                padding: 6px 12px;
                background: linear-gradient(to right bottom, #29dfa8, #3233c6);
                border-radius: 0 6px 0 6px;
                color: #fff;
                font-weight: 500;
              }
              .del {
                position: absolute;
                right: 0;
                bottom: -30px;
                padding: 5px 10px;
                border-radius: 4px;
                background: rgba($color: #000000, $alpha: 0.3);
                color: #fff;
                font-size: 18px;
                transition: all 500ms;
                z-index: 99;
                &:hover {
                  color: rgb(255, 222, 145);
                }
              }
              &:hover {
                .del {
                  bottom: 0px;
                }
              }
            }
            .title {
              font-size: 16px;
              margin-bottom: 6px;
            }
            .info {
              display: flex;
              justify-content: space-between;
              color: #94979a;
              font-size: 12px;
              .date {
              }
              .line {
              }
            }
          }
        }
      }
    }
  }
</style>
