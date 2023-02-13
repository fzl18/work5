<template>
  <div class="app-container">
    <bt-page :title="$route.meta.title" subtitle="">
      <el-tabs v-model="activeName" @tab-click="handleTab">
        <el-tab-pane :label="`PC设置`" name="pc"></el-tab-pane>
        <el-tab-pane :label="`移动端设置`" name="mobile"></el-tab-pane>
      </el-tabs>
      <div v-if="activeName === 'pc'" class="option">
        <div class="item">
          <div class="tit">支持播放的视频格式</div>
          <div class="cont">
            <el-checkbox-group v-model="pcOpt.formatListVal">
              <el-checkbox
                v-for="(item, index) in pcOpt.formatList"
                :key="index"
                :label="item"
              ></el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <div class="item">
          <div class="tit">视频设置</div>
          <div class="cont">
            <el-row>
              <el-col :span="6">
                <div class="subTit">默认分辨率</div>
                <div>
                  <el-select v-model="pcOpt.videoSize" placeholder="请选择">
                    <el-option
                      v-for="item in pcOpt.videoSizeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                      <span style="float: left">{{ item.label }}</span>
                      <span
                        style="float: right; color: #8492a6; font-size: 12px"
                      >
                        {{ item.format }}
                      </span>
                    </el-option>
                  </el-select>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="subTit">是否弹窗播放</div>
                <div>
                  <el-radio-group v-model="pcOpt.isWindow">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="subTit">是否支持倍速播放</div>
                <div>
                  <el-radio-group v-model="pcOpt.isSpeed">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <div v-if="activeName == 'mobile'" class="option">
        <div class="item">
          <div class="tit">支持播放的视频格式</div>
          <div class="cont">
            <el-checkbox-group v-model="mobileOpt.formatListVal">
              <el-checkbox
                v-for="(item, index) in mobileOpt.formatList"
                :key="index"
                :label="item"
              ></el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <div class="item">
          <div class="tit">视频设置</div>
          <div class="cont">
            <el-row>
              <el-col :span="6">
                <div class="subTit">默认分辨率</div>
                <div>
                  <el-select v-model="mobileOpt.videoSize" placeholder="请选择">
                    <el-option
                      v-for="item in mobileOpt.videoSizeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                      <span style="float: left">{{ item.label }}</span>
                      <span
                        style="float: right; color: #8492a6; font-size: 12px"
                      >
                        {{ item.format }}
                      </span>
                    </el-option>
                  </el-select>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="subTit">是否弹窗播放</div>
                <div>
                  <el-radio-group v-model="mobileOpt.isWindow">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="subTit">是否支持倍速播放</div>
                <div>
                  <el-radio-group v-model="mobileOpt.isSpeed">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <div class="save" style="margin: 100px 0 50px 0">
        <el-button
          type="primary"
          style="width: 90px; margin-right: 30px"
          @click="saveTrans"
        >
          保存
        </el-button>
        <!-- <el-button type="info" style="width: 90px">取消</el-button> -->
      </div>
    </bt-page>
  </div>
</template>

<script>
  import { getVideoSelectByVkey, putVideoSettings } from '../api'
  import dayjs from 'dayjs'
  export default {
    data() {
      return {
        activeName: 'pc',
        setting: {},
        pcOpt: {
          formatListVal: [],
          formatList: ['WebM', 'MP4', 'Ogg'],
          videoSize: null,
          videoSizeList: [
            { label: '超清', value: 1080, format: '1080P' },
            { label: '高清', value: 720, format: '720P' },
            { label: '标清', value: 540, format: '540P' },
          ],
          isWindow: false,
          isSpeed: false,
        },
        mobileOpt: {
          formatListVal: [],
          formatList: ['WebM', 'MP4', 'Ogg'],
          videoSize: null,
          videoSizeList: [
            { label: '超清', value: 1080, format: '1080P' },
            { label: '高清', value: 720, format: '720P' },
            { label: '标清', value: 540, format: '540P' },
          ],
          isWindow: false,
          isSpeed: false,
        },
      }
    },
    created() {
      this.getSetting()
    },
    mounted() {},
    methods: {
      handleSearch() {
        this.getSetting()
      },
      getSetting() {
        getVideoSelectByVkey({
          vkey:
            this.activeName == 'pc'
              ? 'PLAYBACK_SETTINGS_PC'
              : 'PLAYBACK_SETTINGS_APP',
        }).then((res) => {
          this.setting = res
          const setting = JSON.parse(res.value)
          let option = this.activeName == 'pc' ? 'pcOpt' : 'mobileOpt'
          this[option].formatListVal = setting.playbackVideoFormats || []
          this[option].videoSize = setting.defaultResolution
          this[option].isWindow = setting.popUpWindow == 1
          this[option].isSpeed = setting.doubleSpeed == 1
        })
      },

      handleTab() {
        this.getSetting()
      },

      saveTrans() {
        let option = this.activeName == 'pc' ? 'pcOpt' : 'mobileOpt'
        putVideoSettings({
          ...this.setting,
          value: JSON.stringify({
            defaultResolution: this[option].videoSize,
            doubleSpeed: this[option].isSpeed ? 1 : 0,
            playbackVideoFormats: this[option].formatListVal,
            popUpWindow: this[option].isWindow ? 1 : 0,
          }),
        }).then((res) => {
          if (res) {
            this.$baseMessage('操作成功', 'success')
          }
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .bt-search_btn {
    &.clear {
      margin: 0 !important;
    }
    &::before {
      background: none !important;
    }
  }
  .content {
    width: 90%;
    display: inline-block;
  }

  .option {
    .item {
      margin: 20px 0 40px 0;
      .tit {
        font-weight: bold;
        color: #2668b4;
        margin: 10px 0;
        // font-size: 13px;
      }
      .cont {
        .subTit {
          margin: 10px 0 10px 0;
        }
      }
    }
  }
</style>
