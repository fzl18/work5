<template>
  <div class="videoList">
    <div class="banner">
      <i class="el-icon-arrow-left" @click="$router.back()"></i>
      {{ '系列' }}视频 | {{ video.name }}
    </div>
    <div class="videoDetail">
      <div class="videoBox">
        <div class="player">
          <div class="videoPlayerBox">
            <Btplayer
              ref="btplayer"
              :video-url="video.url"
              :speed="speed"
              :pop-win="popWin"
              :quality="video.resolutionList"
            />
          </div>
          <div class="tag">
            <div>
              <span @click="handleFavorite">
                <remix-icon
                  :icon-class="video.userFavoriteId ? 'star-fill' : 'star-line'"
                ></remix-icon>
                收藏
              </span>
              <span @click="handleLike">
                <remix-icon
                  :icon-class="
                    video.userLikeId ? 'thumb-up-fill' : 'thumb-up-line'
                  "
                ></remix-icon>
                点赞
              </span>
            </div>
            <div>
              <span>播放次：{{ video.playCount }}</span>
              <span>收藏数：{{ video.favoriteCount }}</span>
              <span>点赞数：{{ video.likeCount }}</span>
            </div>
          </div>
        </div>
        <div class="list">
          <div class="tit">目录</div>
          <el-scrollbar style="height: 520px">
            <div
              v-for="(item, index) in video.videoContent"
              :key="'video' + index"
              :class="['item', curPlayVideo == item.id ? 'cur' : '']"
              @click="handlePlay(item.id)"
            >
              <div v-if="curPlayVideo == item.id" class="animation">
                <img src="@/assets/images/animation.gif" alt="" />
              </div>
              <div class="index">视频{{ index + 1 }}</div>
              <div class="name">{{ item.name }}</div>
            </div>
          </el-scrollbar>
        </div>
      </div>
      <div class="title">
        <div class="name">{{ video.name }}</div>
        <div class="date">
          <span>发布人：{{ video.publishName }}</span>
          <span>发布时间：{{ video.publishTime }}</span>
        </div>
      </div>
      <div class="info">
        <div class="tit">介绍</div>
        <div class="text">
          {{ video.info }}
        </div>
      </div>
      <div class="classList">
        <div class="tit">课程目录</div>
        <div
          v-for="(item, index) in video.videoContent"
          :key="'video' + index"
          :class="['item', curPlayVideo == item.id ? 'cur' : '']"
        >
          <div class="index">视频{{ index + 1 }}</div>
          <div class="name" @click="handlePlay(item.id)">
            {{ item.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { postUserVideoLog } from '../api/index'
  import {
    getUserVideoOne,
    postUserFavorite,
    postUserLike,
    delUserFavorite,
    delUserLike,
  } from '../api'
  export default {
    data() {
      return {
        video: {
          name: '',
          userFavoriteId: 0,
          userLikeId: 0,
          videoInfo: '',
          videoList: [],
          resolutionList: [],
        },
        curPlayVideo: null,
        speed: true,
        popWin: true,
      }
    },
    watch: {
      '$route.query.id'(val) {
        console.log(val)
        this.getDetail()
      },
    },
    mounted() {
      this.getDetail()
    },
    methods: {
      getDetail() {
        getUserVideoOne(this.$route.query.id).then((res) => {
          // res.url =
          //   res.id == 1
          //     ? 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4'
          //     : // 'http://vjs.zencdn.net/v/oceans.mp4'
          //       'https://api.dogecloud.com/player/get.mp4?vcode=5ac682e6f8231991&userId=17&ext=.mp4'
          this.video = res
          let url = res.resolutionList[0].url
          let pass = false
          res.resolutionList.forEach((item) => {
            if (item.default) {
              url = item.url
              pass = true
            }
          })
          if (!pass) {
            res.resolutionList[0].default = true
          }
          res.url = url
          this.speed = res.doubleSpeed == '1' ? true : false
          this.popWin = !!res.popUpWindow
          if (res.type == 0) {
            res.videoContent = []
            res.videoContent.push({ name: res.name, id: res.id })
            this.curPlayVideo = res.videoContent[0].id
          } else {
            if (!this.curPlayVideo) {
              this.curPlayVideo = res.videoContent[0].id
            }
          }
          postUserVideoLog({ videoId: res.id })
          console.log(res.type)
        })
      },
      handlePlay(id) {
        this.curPlayVideo = id
        this.$router.push(`/system/videoDetail?id=${id}`)
      },
      handleLike() {
        if (this.video.userLikeId) {
          delUserLike({ idList: this.video.userLikeId }).then((res) => {
            if (res) {
              this.video.userLikeId = 0
              this.video.likeCount--
              this.$baseMessage('操作成功！', 'success')
            }
          })
        } else {
          postUserLike({ videoId: this.video.id }).then((res) => {
            if (res) {
              getUserVideoOne(this.$route.query.id).then((res) => {
                this.video.userLikeId = res.userLikeId
                this.video.likeCount++
                this.$baseMessage('操作成功！', 'success')
              })
            }
          })
        }
      },
      handleFavorite() {
        if (this.video.userFavoriteId) {
          delUserFavorite({ idList: this.video.userFavoriteId }).then((res) => {
            if (res) {
              this.video.userFavoriteId = 0
              this.video.favoriteCount--
              this.$baseMessage('操作成功！', 'success')
            }
          })
        } else {
          postUserFavorite({ videoId: this.video.id }).then((res) => {
            if (res) {
              getUserVideoOne(this.$route.query.id).then((res) => {
                this.video.userFavoriteId = res.userFavoriteId
                this.video.favoriteCount++
                this.$baseMessage('操作成功！', 'success')
              })
            }
          })
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .videoList {
    .banner {
      display: none;
      align-items: center;
      font-size: 16px;
      font-weight: 500;
      border-bottom: 1px solid #bfc1c5;
      // margin-bottom: 35px;
      padding-bottom: 15px;
      font-weight: 600;
      i {
        font-size: 26px;
        margin-right: 10px;
        cursor: pointer;
      }
    }
    .videoDetail {
      .videoBox {
        background-color: #232d3b;
        height: 640px;
        width: 104.5%;
        box-sizing: border-box;
        display: flex;
        position: relative;
        top: -20px;
        left: -30px;
        .player {
          width: 100%;
          display: flex;
          flex-direction: column;
          // align-items: center;
          justify-content: space-between;
          .videoPlayerBox {
            display: flex;
            justify-content: center;
            align-items: center;
            height: calc(100% - 53px);
            width: 100%;
            background: #000;
          }
          .tag {
            display: flex;
            justify-content: space-between;
            color: #94979a;
            font-size: 16px;
            margin: 15px 0;
            padding-left: 30px;
            div {
              &:first-child {
                span {
                  cursor: pointer;
                }
              }
            }
            span {
              margin: 0 20px;
              i {
                font-size: 20px;
                color: #4b91f8;
              }
            }
          }
        }
        .list {
          width: 34%;
          padding: 20px 0;
          padding-right: 0;
          .tit {
            color: #fff;
            font-size: 26px;
            margin-left: 20px;
            padding-bottom: 20px;
          }
          .item {
            padding: 25px 10px 25px 20px;
            font-weight: 500;
            cursor: pointer;
            position: relative;
            .index {
              color: #94979a;
              font-size: 14px;
            }
            .name {
              margin-top: 10px;
              color: #fff;
              font-size: 16px;
            }
            .animation {
              position: absolute;
              top: 13px;
              right: 13px;
              img {
                width: 18px;
              }
            }
            &.cur {
              background: #1f2833;
              position: relative;

              &::before {
                position: absolute;
                content: '正在播放';
                width: 100px;
                height: 32px;
                // text-align: center;
                padding-left: 20px;
                color: #fff;
                line-height: 32px;
                background: #4b91f8;
                border-radius: 20px 0 0 20px;
                right: 0;
                top: 8px;
                font-size: 14px;
              }
              .index {
                color: #4b91f8;
              }
              .name {
                color: #4b91f8;
              }
            }
          }
        }
      }
      .title {
        margin: 40px 0;
        .name {
          font-size: 24px;
          margin-bottom: 10px;
        }
        .date {
          font-size: 14px;
          color: #94979a;
          span {
            margin-right: 50px;
          }
        }
      }
      .info {
        font-size: 14px;
        .tit {
          font-size: 26px;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #d3d9e5;
          position: relative;
          padding-left: 20px;
          font-weight: 600;
          &::after {
            content: '';
            width: 40px;
            height: 5px;
            background: #4b91f8;
            position: absolute;
            bottom: -3px;
            left: 25px;
            border-radius: 4px;
          }
        }
        .text {
          padding-left: 10px;
          font-size: 16px;
          line-height: 24px;
          color: #94979a;
          margin: 50px 0;
        }
      }
      .classList {
        .tit {
          font-size: 22px;
          font-weight: 600;
          margin-bottom: 20px;
        }
        .item {
          padding: 20px 0;
          margin-bottom: 20px;
          border-bottom: 1px dashed #bfc1c5;
          &:hover {
            color: #005ae0;
          }
          &:visited {
            color: #94979a;
          }
          &.cur {
            color: #005ae0;
          }
          .index {
            font-size: 16px;
            margin-bottom: 15px;
          }
          .name {
            cursor: pointer;
            font-size: 20px;
            font-weight: 600;
            display: inline-block;
          }
        }
      }
    }
  }
</style>
