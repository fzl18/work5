<template>
  <div class="app-container">
    <bt-page :title="$route.meta.title" subtitle="">
      <el-tabs v-model="activeName" @tab-click="handleTab">
        <el-tab-pane :label="`视频转换`" name="video"></el-tab-pane>
        <el-tab-pane :label="`转换设置`" name="setting"></el-tab-pane>
        <el-tab-pane :label="`转换日志`" name="log"></el-tab-pane>
      </el-tabs>

      <!-- 视频转换 -->
      <div v-if="activeName === 'video'" class="option">
        <el-table
          :data="list"
          stripe
          fit
          highlight-current-row
          style="width: 100%"
        >
          <!-- <el-table-column type="selection" width="55"></el-table-column> -->
          <!-- <el-table-column
            type="index"
            :index="indexMethod"
            label="序号"
            width="50"
            align="center"
          /> -->
          <el-table-column prop="cover" label="封面" width="150">
            <template #default="{ row }">
              <img :src="row.cover" width="100%" />
            </template>
          </el-table-column>
          <el-table-column prop="videoTopName" label="名称" />
          <el-table-column prop="videoName" label="转换名称" />
          <!-- <el-table-column prop="delayReason" label="分类" /> -->
          <el-table-column prop="createName" label="创建人" />
          <el-table-column prop="createTime" label="创建时间" />
          <el-table-column fixed="right" label="操作" width="60">
            <template #default="{ row }">
              <bt-dropdown :show-split="false">
                <bt-dropdown-menu>
                  <bt-dropdown-item v-if="true" @click="handlePlay(row)">
                    <i class="el-icon-video-play"></i>
                    播放
                  </bt-dropdown-item>
                </bt-dropdown-menu>
              </bt-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <bt-pagination
          :total="total"
          :page.sync="search.page"
          :limit.sync="search.pageSize"
          show-page-sizes
          @pageSizeChange="pageSizeChange"
          @pagination="getList"
        ></bt-pagination>
      </div>

      <!-- 转换设置 -->
      <div v-if="activeName === 'setting'" class="option">
        <div class="item">
          <div class="tit">支持分辨率转换的视频格式</div>
          <div class="cont">
            <el-checkbox-group v-model="pcOpt.formatListAllVal">
              <el-checkbox
                v-for="(item, index) in pcOpt.formatListAll"
                :key="index"
                :label="item"
              ></el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <div class="item">
          <!-- <div class="tit">格式自动转换原格式</div> -->
          <div class="cont">
            <!-- <el-checkbox-group v-model="pcOpt.formatListVal">
              <el-checkbox
                v-for="(item, index) in pcOpt.formatList"
                :key="index"
                :label="item"
              ></el-checkbox>
            </el-checkbox-group> -->

            <ul class="tip">
              <li>注：</li>
              <li>
                除支持分辨率转换的视频格式外，可以通过视频格式转换工具转换后进行上传视频。
              </li>
              <li>
                例如：格式工厂
                <a
                  href="http://www.pcfreetime.com/formatfactory/CN/download.html"
                  target="_blank"
                >
                  http://www.pcfreetime.com/formatfactory/CN/download.html
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div class="item">
          <div class="tit">视频转分辨率</div>
          <div class="cont">
            <div>
              <el-select v-model="pcOpt.videoSize" placeholder="请选择">
                <el-option
                  v-for="item in pcOpt.videoSizeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                  <span style="float: left">{{ item.label }}</span>
                  <!-- <span style="float: right; color: #8492a6; font-size: 12px">
                    {{ item.format }}
                  </span> -->
                </el-option>
              </el-select>
              <ul class="tip">
                <li>注：</li>
                <li>宽度固定：超清1920p，高清1280p，标清960p</li>
                <li>高度固定：超清1080p、高清720p、标清540p</li>
              </ul>
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
      </div>

      <!-- 转换日志 -->
      <div v-if="activeName == 'log'" class="option">
        <el-table
          :data="list"
          stripe
          fit
          highlight-current-row
          style="width: 100%"
        >
          <!-- <el-table-column
            type="index"
            :index="indexMethod"
            label="序号"
            width="50"
            align="center"
          /> -->
          <el-table-column prop="createTime" label="创建时间" />
          <el-table-column prop="videoName" label="名称" />
          <el-table-column prop="oldScale" label="原分辨率" />
          <el-table-column prop="newScale" label="新分辨率" />
          <!-- <el-table-column prop="oldFormat" label="原格式" />
          <el-table-column prop="newFormat" label="新格式" /> -->
          <el-table-column fixed="right" label="操作" width="60">
            <template #default="{ row }">
              <bt-dropdown :show-split="false">
                <bt-dropdown-menu>
                  <bt-dropdown-item v-if="true" @click="handleDetail(row)">
                    <i class="el-icon-view"></i>
                    查看
                  </bt-dropdown-item>
                </bt-dropdown-menu>
              </bt-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <bt-pagination
          v-show="activeName !== 'setting'"
          :total="total"
          :page.sync="search.page"
          :limit.sync="search.pageSize"
          show-page-sizes
          @pageSizeChange="pageSizeChange"
          @pagination="getList"
        ></bt-pagination>
      </div>
    </bt-page>

    <el-dialog :title="`日志详情`" :visible.sync="dialogVisible">
      <div class="logDetail">{{ logDetail }}</div>
    </el-dialog>
    <el-dialog title="视频" :visible.sync="videoVisible" width="60%">
      <div>
        <Btplayer
          v-if="videoVisible"
          :video-url="videoUrl"
          :video-list="videoList"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getvideoLog,
    getVideoLogDetail,
    getVideoSelectByVkey,
    putVideoSettings,
  } from '../api'
  import dayjs from 'dayjs'
  import Btplayer from '../components/videoPlayer'
  export default {
    components: {
      Btplayer,
    },
    data() {
      return {
        activeName: 'video',
        dialogVisible: false,
        videoVisible: false,
        list: [],
        pcOpt: {
          formatListVal: [],
          formatListAllVal: [],
          formatList: ['MP4', 'WebM', 'Ogg'],
          formatListAll: ['MP4', 'WebM', 'Ogg'],
          videoSize: null,
          videoSizeList: [
            { label: '高度固定', value: 0, format: '1080P' },
            { label: '宽度固定', value: 1, format: '720P' },
          ],
          isWindow: false,
          isSpeed: false,
        },
        mobileOpt: {
          formatListVal: [],
          formatList: ['3GP', 'MP4', 'AVI'],
          videoSize: null,
          videoSizeList: [
            { label: '标清', value: 1, format: '720P' },
            { label: '高清', value: 2, format: '1080P' },
            { label: '超清', value: 3, format: '1920P' },
            { label: '4K', value: 4, format: '2480P' },
          ],
          isWindow: false,
          isSpeed: false,
        },
        search: {
          page: 1,
          pageSize: 10,
        },
        total: 10,
        logDetail: '',
        setting: {},
        curVideo: {},
        videoList: [],
        videoUrl: '',
      }
    },
    created() {
      this.getList()
    },
    mounted() {},
    methods: {
      handleSearch() {
        this.getList()
      },
      getList() {
        getvideoLog({
          current: this.search.page,
          size: this.search.pageSize,
        }).then((res) => {
          this.list = res.records
          this.total = res.total
        })
      },
      pageSizeChange(page) {
        this.search.page = page.page
        this.search.pageSize = page.limit
        this.getList()
      },

      handleDetail(data) {
        this.logDetail = data.jsonResult
        this.dialogVisible = true
      },
      handlePlay(data) {
        this.videoVisible = true
        getVideoLogDetail(data.id).then((res) => {
          console.log(res)
          this.videoUrl = res.resolutionList[0].url
        })
        // let url = data.resolutionList[0].url
        // let pass = false
        // data.resolutionList.forEach((item) => {
        //   if (item.default) {
        //     url = item.url
        //     pass = true
        //   }
        // })
        // if (!pass) {
        //   data.resolutionList[0].default = true
        // }
        // this.curVideo = data

        // this.videoList = data.resolutionList
      },
      handleTab(tab) {
        // this.resetForm('searchForm')
        if (tab.name == 'setting') {
          getVideoSelectByVkey({ vkey: 'CONVERTER_SETTINGS' }).then((res) => {
            if (res && res.value) {
              this.setting = res
              const setting = JSON.parse(res.value)
              this.pcOpt.videoSize = setting.converterVideoResolution
              this.pcOpt.formatListVal = setting.converterVideoFormats
              this.pcOpt.formatListAllVal = setting.converterVideoFormatsAll
            }
          })
        } else {
          this.search.page = 1
          this.getList()
        }
      },
      indexMethod(index) {
        return (this.search.page - 1) * this.search.pageSize + (index + 1)
      },

      saveTrans() {
        putVideoSettings({
          ...this.setting,
          value: JSON.stringify({
            converterVideoResolution: this.pcOpt.videoSize,
            converterVideoFormats: this.pcOpt.formatListVal,
            converterVideoFormatsAll: this.pcOpt.formatListAllVal,
          }),
        }).then((res) => {
          console.log(res)
          if (res) {
            this.$baseMessage('操作成功', 'success')
          }
        })
      },

      submitForm() {
        this.$refs['ruleForm'].validate(async (valid) => {
          if (valid) {
          }
        })
      },
      resetForm(type) {
        // console.log(type, this.$refs[type])
        this.$refs[type].resetFields()
        if (type == 'searchForm') {
        }
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
        // font-size: 12px;
      }
      .cont {
        .subTit {
          margin: 10px 0 10px 0;
        }
        .tip {
          margin-top: 20px;
          color: rgb(122, 122, 122);
          li {
            line-height: 20px;
          }
        }
      }
    }
  }
  .logDetail {
    padding: 20px;
    box-shadow: 0 0 4px rgba($color: #919191, $alpha: 0.5);
    background: #fff;
    color: #919191;
    position: relative;
    min-height: 400px;
    &::before {
      content: '';
      width: 56px;
      height: 3px;
      background: #2668b4;
      position: absolute;
      top: -32px;
      left: 0px;
    }
  }
</style>
