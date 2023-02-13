<template>
  <div class="videoList">
    <div class="banner">
      <i class="el-icon-arrow-left" @click="$router.back()"></i>
      <span
        @click="
          gotoUrl(`/videoList`)
          curCategoryId = null
        "
      >
        全部分类
      </span>
    </div>
    <div class="listBox">
      <div class="cate">
        <div
          v-for="(item, index) in category"
          :key="index"
          :class="['item', hasClass(item) ? 'cur' : '']"
        >
          <div
            :class="['title', curCategoryId == item.id ? 'cur' : '']"
            @click="
              gotoUrl(`/videoList?categoryId=${item.id}`)
              curCategoryId = item.id
            "
          >
            {{ item.label }}
          </div>
          <div class="sub">
            <span
              v-for="(data, ind) in item.children"
              :key="'sub' + ind"
              :class="[curCategoryId == data.id ? 'cur' : '']"
              @click="
                gotoUrl(`/videoList?categoryId=${data.id}`)
                curCategoryId = data.id
              "
            >
              {{ data.label }}
            </span>
          </div>
        </div>
      </div>

      <div class="list">
        <div class="filter">
          <div>
            <span
              :class="filter.sortType == 'publish_time' ? 'cur' : ''"
              @click="handleSort('publish_time')"
            >
              发布时间
              <i
                v-show="!filter.sort"
                class="el-icon-sort-down"
                @click="handleSort(false)"
              ></i>
              <i
                v-show="filter.sort"
                class="el-icon-sort-up"
                @click="handleSort(true)"
              ></i>
            </span>
            <span
              :class="filter.sortType == 'like_count' ? 'cur' : ''"
              @click="handleSort('like_count')"
            >
              点赞数
              <i
                v-show="!filter.sort"
                class="el-icon-sort-down"
                @click="handleSort(false)"
              ></i>
              <i
                v-show="filter.sort"
                class="el-icon-sort-up"
                @click="handleSort(true)"
              ></i>
            </span>
            <span
              :class="filter.sortType == 'play_count' ? 'cur' : ''"
              @click="handleSort('play_count')"
            >
              播放数
              <i
                v-show="!filter.sort"
                class="el-icon-sort-down"
                @click="handleSort(false)"
              ></i>
              <i
                v-show="filter.sort"
                class="el-icon-sort-up"
                @click="handleSort(true)"
              ></i>
            </span>
            <span
              :class="filter.sortType == 'favorite_count' ? 'cur' : ''"
              @click="handleSort('favorite_count')"
            >
              收藏数
              <i
                v-show="!filter.sort"
                class="el-icon-sort-down"
                @click="handleSort(false)"
              ></i>
              <i
                v-show="filter.sort"
                class="el-icon-sort-up"
                @click="handleSort(true)"
              ></i>
            </span>
          </div>
          <div class="checkbox">
            <el-checkbox v-model="filter.single" :disabled="!filter.group">
              视频
            </el-checkbox>
            <el-checkbox v-model="filter.group" :disabled="!filter.single">
              系列
            </el-checkbox>
          </div>
        </div>
        <div class="videos">
          <div
            v-for="(item, index) in list"
            :key="index"
            class="item"
            @click="gotoUrl(`/videoDetail?id=${item.id}`)"
          >
            <div class="pic">
              <img :src="item.cover" :alt="item.name" />
              <div v-if="item.type == 1" class="tag">系列</div>
            </div>
            <div class="title">{{ item.name }}</div>
            <div class="info">
              <div class="date">
                {{ dayjs(item.publishTime).format('YYYY-MM-DD') }}
              </div>
              <div class="like">点赞数：{{ item.likeCount }}</div>
            </div>
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
    </div>
  </div>
</template>

<script>
  import { getVideoCategory, getUserVideo } from '@/views/system/api'
  import dayjs from 'dayjs'
  export default {
    data() {
      return {
        category: [],
        curCategoryId: null,
        search: {
          page: 1,
          pageSize: 12,
        },
        filter: {
          sortType: 'like_count',
          sort: false,
          single: true,
          group: true,
        },
        total: 12,
        list: [
          { name: '如何对企业文化进行修订-新', date: '2022–09-12', like: 56 },
          { name: '如何对企业文化进行修订-新', date: '2022–09-12', like: 56 },
          { name: '如何对企业文化进行修订-新', date: '2022–09-12', like: 56 },
          { name: '如何对企业文化进行修订-新', date: '2022–09-12', like: 56 },
          { name: '如何对企业文化进行修订-新', date: '2022–09-12', like: 56 },
          { name: '如何对企业文化进行修订-新', date: '2022–09-12', like: 56 },
          { name: '如何对企业文化进行修订-新', date: '2022–09-12', like: 56 },
          { name: '如何对企业文化进行修订-新', date: '2022–09-12', like: 56 },
          { name: '如何对企业文化进行修订-新', date: '2022–09-12', like: 56 },
          { name: '如何对企业文化进行修订-新', date: '2022–09-12', like: 56 },
          { name: '如何对企业文化进行修订-新', date: '2022–09-12', like: 56 },
          { name: '如何对企业文化进行修订-新', date: '2022–09-12', like: 56 },
        ],
      }
    },

    watch: {
      $route(val) {
        if (val.query.categoryId) {
          this.curCategoryId = val.query.categoryId
        }
        this.getList()
      },
      'filter.single'(val) {
        this.getList()
      },
      'filter.group'(val) {
        this.getList()
      },
    },
    mounted() {
      if (this.$route.query.categoryId) {
        this.curCategoryId = this.$route.query.categoryId
      }
      this.getCategory()

      const { type } = this.$route.query
      if (type && type == 'single') {
        this.filter.single = true
        this.filter.group = false
      }
      if (type && type == 'group') {
        this.filter.single = false
        this.filter.group = true
      }
      this.getList()
    },
    methods: {
      dayjs,
      getList() {
        const { categoryId } = this.$route.query
        const { single, group } = this.filter
        let type = undefined
        if (single && group) {
          type = undefined
        } else if (single && !group) {
          type = 0
        } else if (!single && group) {
          type = 1
        }
        console.log(single, group, type)
        getUserVideo({
          current: this.search.page,
          size: this.search.pageSize,
          categoryIds: categoryId,
          type: type,
          ['orders[0].asc']: this.filter.sort,
          ['orders[0].column']: this.filter.sortType,
        }).then((res) => {
          this.list = res.records
          this.search.page = res.current
          this.total = res.total
        })
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

          this.category = data
        })
      },
      gotoUrl(route) {
        this.$router.push(`/system${route}`)
      },
      pageSizeChange(page) {
        this.search.page = page.page
        this.search.pageSize = page.limit
        this.getList()
      },
      loopChange(data) {
        data.forEach((item) => {
          item.isEdit = false
          if (item.children && item.children.length) {
            this.loopChange(item.children)
          }
        })
      },
      handleSort(type) {
        if (this.filter.sortType == type) {
          this.filter.sort = !this.filter.sort
        } else {
          this.filter.sortType = type
          this.filter.sort = false
        }
        this.getList()
      },
      hasClass(val) {
        let has = false
        if (val.id == this.curCategoryId) {
          has = true
        }
        if (val.children && val.children.length) {
          val.children.forEach((item) => {
            if (item.id == this.curCategoryId) {
              has = true
            }
          })
        }
        return has
      },
    },
  }
</script>

<style lang="scss" scoped>
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
      span {
        cursor: pointer;
      }
      i {
        font-size: 26px;
        margin-right: 10px;
        cursor: pointer;
      }
    }
    .listBox {
      display: flex;
      .cate {
        width: 330px;
        margin-left: -30px;
        .item {
          padding: 15px 30px;
          margin-bottom: 30px;
          &.cur,
          &:hover {
            background: #f5f5f5;
          }
          .title {
            font-size: 20px;
            margin-bottom: 15px;
            display: inline-block;
            cursor: pointer;
            font-weight: 500;
            &.cur {
              color: #005ae0;
              font-weight: bold;
            }
          }
          .sub {
            span {
              margin-right: 13px;
              margin-bottom: 13px;
              display: inline-block;
              font-size: 14px;
              color: #94979a;
              cursor: pointer;
              font-weight: 500;
              &.cur,
              &:hover {
                color: #005ae0;
                font-weight: bold;
              }
            }
          }
        }
      }
      .list {
        border-left: 1px solid #bfc1c5;
        padding-left: 40px;
        width: 100%;
        .filter {
          border-radius: 6px;
          background-color: #f5f5f5;
          padding: 15px 25px;
          font-size: 14px;
          display: flex;
          justify-content: space-between;
          .checkbox {
            transform: scale(1.15);
            .el-checkbox__label {
              font-weight: bold !important;
            }
          }
          span {
            margin-right: 60px;
            cursor: pointer;
            font-weight: 700;
            color: rgb(95, 95, 95);
            user-select: none;
            i {
              color: #a5a5a5;
              margin-left: 5px;
              display: none;
            }
            &.cur {
              color: #005ae0;
              i {
                color: #005ae0;
                display: inline-block;
              }
            }
          }
        }
        .videos {
          min-height: 450px;
          margin-top: 20px;
          display: grid;
          grid-template-columns: repeat(3, 31%);
          column-gap: 35px;
          row-gap: 30px;
          // width: calc(100% - 300px);
          .item {
            width: 100%;
            // margin-bottom: 25px;
            cursor: pointer;
            .pic {
              // width: 330px;
              width: 100%;
              height: 180px;
              border-radius: 6px;
              background: #95b3d1;
              margin-bottom: 15px;
              position: relative;
              overflow: hidden;
              img {
                width: 100%;
                height: 100%;
              }
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
            }
            .title {
              font-size: 16px;
              margin-bottom: 6px;
              font-weight: bold;
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
        .pagebar {
          margin: 70px 0 30px 0;
        }
      }
    }
  }
</style>
