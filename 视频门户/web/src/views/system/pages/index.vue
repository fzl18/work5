<template>
  <div class="videoIndex">
    <div class="hot">
      <div class="title">
        <img src="@/assets/images/title_1.png" alt="" />
        <span @click="gotoUrl('/videoList?type=single')">更多 >></span>
      </div>
      <div class="list">
        <div
          v-for="(item, index) in singleList"
          :key="'sigle' + index"
          class="item"
          @click="gotoUrl(`/videoDetail?id=${item.id}`)"
        >
          <div class="pic">
            <img :src="item.cover" alt="" />
            <!-- <span class="tip">系列</span> -->
          </div>
          <span class="detail">详情 >></span>
          <div class="tit">{{ item.name }}</div>
          <div class="dsc">
            {{ item.info }}
          </div>
          <div class="tag">
            <div>{{ dayjs(item.publishTime).format('YYYY-MM-DD') }}</div>
            <div>点赞数：{{ item.likeCount }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="hot">
      <div class="title">
        <img src="@/assets/images/title_2.png" alt="" />
        <span @click="gotoUrl('/videoList?type=group')">更多 >></span>
      </div>
      <div class="list">
        <div
          v-for="(item, index) in groupList"
          :key="'group' + index"
          class="item"
          @click="gotoUrl(`/videoDetail?id=${item.id}`)"
        >
          <div class="pic">
            <img :src="item.cover" alt="" />
            <span class="tip">系列</span>
          </div>
          <span class="detail">详情 >></span>
          <div class="tit">{{ item.name }}</div>
          <div class="dsc">
            {{ item.info }}
          </div>
          <div class="tag">
            <div>{{ dayjs(item.publishTime).format('YYYY-MM-DD') }}</div>
            <div>点赞数：{{ item.likeCount }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { getUserVideo } from '../api'
  import dayjs from 'dayjs'
  export default {
    data() {
      return {
        singleList: [
          {
            name: '知识分享：苹果IOS手机系统全解析',
            des: '通过本课程的学习，您将了解风险分级管理体系建设及隐患排查治理体系建设，并能理解二者的关系…',
            date: '2022-11-12',
            likes: 43,
          },
          {
            name: '知识分享：苹果IOS手机系统全解析',
            des: '通过本课程的学习，您将了解风险分级管理体系建设及隐患排查治理体系建设，并能理解二者的关系…',
            date: '2022-11-12',
            likes: 43,
          },
          {
            name: '知识分享：苹果IOS手机系统全解析',
            des: '通过本课程的学习，您将了解风险分级管理体系建设及隐患排查治理体系建设，并能理解二者的关系…',
            date: '2022-11-12',
            likes: 43,
          },
          {
            name: '知识分享：苹果IOS手机系统全解析',
            des: '通过本课程的学习，您将了解风险分级管理体系建设及隐患排查治理体系建设，并能理解二者的关系…',
            date: '2022-11-12',
            likes: 43,
          },
          {
            name: '知识分享：苹果IOS手机系统全解析',
            des: '通过本课程的学习，您将了解风险分级管理体系建设及隐患排查治理体系建设，并能理解二者的关系…',
            date: '2022-11-12',
            likes: 43,
          },
          {
            name: '知识分享：苹果IOS手机系统全解析',
            des: '通过本课程的学习，您将了解风险分级管理体系建设及隐患排查治理体系建设，并能理解二者的关系…',
            date: '2022-11-12',
            likes: 43,
          },
        ],
        groupList: [
          {
            name: '知识分享：苹果IOS手机系统全解析',
            des: '通过本课程的学习，您将了解风险分级管理体系建设及隐患排查治理体系建设，并能理解二者的关系…',
            date: '2022-11-12',
            likes: 43,
          },
          {
            name: '知识分享：苹果IOS手机系统全解析',
            des: '通过本课程的学习，您将了解风险分级管理体系建设及隐患排查治理体系建设，并能理解二者的关系…',
            date: '2022-11-12',
            likes: 43,
          },
          {
            name: '知识分享：苹果IOS手机系统全解析',
            des: '通过本课程的学习，您将了解风险分级管理体系建设及隐患排查治理体系建设，并能理解二者的关系…',
            date: '2022-11-12',
            likes: 43,
          },
          {
            name: '知识分享：苹果IOS手机系统全解析',
            des: '通过本课程的学习，您将了解风险分级管理体系建设及隐患排查治理体系建设，并能理解二者的关系…',
            date: '2022-11-12',
            likes: 43,
          },
          {
            name: '知识分享：苹果IOS手机系统全解析',
            des: '通过本课程的学习，您将了解风险分级管理体系建设及隐患排查治理体系建设，并能理解二者的关系…',
            date: '2022-11-12',
            likes: 43,
          },
        ],
      }
    },
    created() {
      this.getList()
    },
    mounted() {},
    methods: {
      dayjs,
      gotoUrl(route) {
        this.$router.push(`/system${route}`)
      },
      getList() {
        getUserVideo({
          type: 0,
          size: 12,
        }).then((res) => {
          this.singleList = res.records
        })
        getUserVideo({
          type: 1,
          size: 12,
        }).then((res) => {
          this.groupList = res.records
        })
      },
      pageSizeChange(page) {
        this.search.page = page.page
        this.search.pageSize = page.limit
        this.getList()
      },

      // handleDel(data) {
      //   this.$confirm('确定删除吗?', '警告', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning',
      //     center: true,
      //     callback: (action) => {
      //       if (action == 'confirm') {
      //         data.id
      //       }
      //     },
      //   })
      // },
      handleDetail(data) {
        this.$router.push(`demoPages/?id=${data.id} `)
      },
    },
  }
</script>

<style lang="scss" scoped>
  .videoIndex {
    .hot {
      margin-bottom: 40px;
      position: relative;
      &::before {
        content: '';
        position: absolute;
        left: -293px;
        width: 263px;
        height: 75px;
        top: -10px;
        background: url('../../../assets/images/dont.png') no-repeat;
      }
      &:last-child {
        padding-top: 30px;
        &::before {
          content: '';
          background: #fff;
          width: 200%;
          height: 108%;
          position: absolute;
          top: 10px;
          left: -50%;
        }
      }
      .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 20px 0 0px 0;
        position: relative;
        z-index: 99;
        img {
          width: 260px;
        }
        span {
          border-radius: 20px;
          border: 1px solid #accbf7;
          color: #2476f1;
          padding: 5px 8px;
          cursor: pointer;
        }
      }
      .list {
        display: grid;
        grid-template-columns: repeat(4, 23.8%);
        column-gap: 20px;
        row-gap: 10px;
        .item {
          position: relative;
          cursor: pointer;
          background: url('../../../assets/images/bg_piece.png') 0 80px
            no-repeat;
          background-size: 100% 75%;
          padding: 30px;
          width: 346px;
          box-sizing: border-box;
          .pic {
            width: 233px;
            height: 135px;
            border-radius: 6px;
            background: #000;
            position: relative;
            overflow: hidden;
            img {
              width: 100%;
              height: 100%;
            }
            .tip {
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
          .tit {
            font-size: 16px;
            margin: 10px 0;
            font-weight: 600;
          }
          .detail {
            position: absolute;
            right: 20px;
            top: 140px;
            background: rgb(242, 242, 242);
            border-radius: 20px;
            padding: 6px 8px;
          }
          .dsc {
            color: rgb(156, 156, 156);
            line-height: 20px;
            font-size: 14px;
            height: 70px;
          }
          .tag {
            display: flex;
            justify-content: space-between;
            margin-top: 15px;
            color: rgb(187, 187, 187);
          }
        }
      }
    }
  }
</style>
