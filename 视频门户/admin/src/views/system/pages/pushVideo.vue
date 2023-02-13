<template>
  <div id="basic" class="app-container anchor_demo">
    <bt-page :title="$route.meta.title">
      <el-tabs v-model="activeName" @tab-click="handleTab">
        <el-tab-pane
          :label="`视频`"
          name="single"
          :disabled="edit"
        ></el-tab-pane>
        <el-tab-pane
          :label="`系列`"
          name="group"
          :disabled="edit"
        ></el-tab-pane>
      </el-tabs>
      <div v-if="activeName == 'single'" class="videoForm">
        <el-form ref="ruleForm" :model="singleVideo" label-position="top">
          <el-row :gutter="50" class="row">
            <el-col :span="12">
              <!-- <div class="tit">视频名称</div> -->
              <el-form-item
                label="视频名称"
                prop="name"
                :rules="[{ required: true, message: '视频名称不能为空' }]"
              >
                <el-input v-model="singleVideo.name"></el-input>
              </el-form-item>
              <!-- <div class="tit" >视频封面</div> -->
              <el-form-item label="视频封面" prop="cover">
                <el-row :gutter="30">
                  <el-col :span="12">
                    <div v-if="singleVideo.cover">
                      <img
                        :src="imgUrl || singleVideo.cover"
                        alt=""
                        width="100%"
                        height="100%"
                      />
                    </div>
                    <div
                      v-if="!singleVideo.cover"
                      class="upload"
                      @click="handlePicUpload"
                    >
                      <i class="el-icon-plus"></i>
                      <span>上传文件</span>
                      <bt-uploader
                        ref="picUploader"
                        client-code="vportal"
                        single-file
                        :accept="['.png', '.jpg', '.jpeg']"
                        @finish="handleFinish"
                      ></bt-uploader>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <p>允许上传图片的格式为jpg、jpeg、gif、png</p>
                    <p>建议尺寸大小：640 x 360</p>
                    <el-button
                      v-if="singleVideo.cover"
                      type="primary"
                      @click="singleVideo.cover = ''"
                    >
                      更换封面
                    </el-button>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <!-- <div class="tit">简介</div> -->
              <el-form-item
                label="简介"
                prop="info"
                :rules="[{ required: true, message: '简介不能为空' }]"
              >
                <el-input
                  v-model="singleVideo.info"
                  type="textarea"
                  :autosize="{ minRows: 10 }"
                  maxlength="400"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <div class="line"></div>
            </el-col>
            <el-col :span="12">
              <!-- <div class="tit">视频</div> -->
              <el-form-item
                label="视频"
                prop="videoContent"
                :rules="[{ required: true, message: '视频不能为空' }]"
              >
                <el-row :gutter="30">
                  <el-col
                    v-for="item in singleVideo.videoContent"
                    :key="item.id"
                    :span="8"
                  >
                    <!-- <img
                      :src="imgUrl || singleVideo.cover"
                      width="100%"
                      height="100%"
                    /> -->
                    <div class="itemPic">
                      <i class="el-icon-video-camera"></i>
                    </div>
                    <el-button
                      type="danger"
                      @click="singleVideo.videoContent = []"
                    >
                      删除
                    </el-button>
                  </el-col>
                  <el-col v-if="!singleVideo.videoContent.length" :span="8">
                    <div class="upload" @click="handleVideoUpload">
                      <i class="el-icon-plus"></i>
                      <span>上传文件</span>
                      <bt-uploader
                        ref="videoUploader"
                        client-code="vportal"
                        :single-file="activeName == 'single'"
                        :accept="['.mp4', 'ogg', 'webm']"
                        @finish="handleFinish"
                      ></bt-uploader>
                    </div>
                  </el-col>
                </el-row>
              </el-form-item>
              <div>
                <p>视频格式包括：MP4、WebM、Ogg，视频大小限制在600M内。</p>
                <p>
                  视频上传后需要进行切片、转码服务，请耐心等待转码完成后即可播放。
                </p>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="block">
                <!-- <div class="tit">分类</div> -->

                <el-form-item
                  label="分类"
                  prop="categoryIds"
                  :rules="[{ required: true, message: '分类不能为空' }]"
                >
                  <el-input
                    v-model="singleVideo.categoryText"
                    placeholder="请选择"
                    suffix-icon="el-icon-arrow-down"
                    style="width: 220px"
                    @focus="
                      show = true
                      checkedKeys = singleVideo.categoryIds.split(',')
                    "
                  ></el-input>
                </el-form-item>
              </div>

              <div class="block">
                <div class="tit">倍速播放</div>
                <el-checkbox v-model="singleVideo.doubleSpeed">
                  是否支持
                </el-checkbox>
              </div>
              <div class="block">
                <div class="tit">
                  可见范围
                  <span>（团队/公司/组织内成员）</span>
                </div>
                <el-cascader
                  v-model="singleVideo.units"
                  :options="userOptions"
                  :props="cascaderProps"
                  collapse-tags
                  clearable
                  :show-all-levels="false"
                ></el-cascader>
              </div>
              <div class="block">
                <div class="tit">发布时间</div>
                <div style="margin-bottom: 10px">
                  <el-checkbox v-model="singleVideo.regular">
                    是否定时
                  </el-checkbox>
                </div>
                <div v-show="singleVideo.regular">
                  <el-date-picker
                    v-model="singleVideo.effectiveTime"
                    type="datetime"
                    placeholder="选择日期时间"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  ></el-date-picker>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div v-if="activeName == 'group'" class="videoForm">
        <!-- <el-form :model="ruleForm" :rules="rules" ref="ruleForm"></el-form> -->
        <el-form ref="ruleForm2" :model="groupVideo" label-position="top">
          <el-row :gutter="50" class="row">
            <el-col :span="12">
              <!-- <div class="tit">视频名称</div> -->
              <el-form-item
                label="视频名称"
                prop="name"
                :rules="[{ required: true, message: '视频名称不能为空' }]"
              >
                <el-input v-model="groupVideo.name"></el-input>
              </el-form-item>
              <!-- <div class="tit" style="margin-top: 20px">视频封面</div> -->
              <el-form-item label="视频封面" prop="cover">
                <el-row :gutter="30">
                  <el-col :span="12">
                    <div
                      v-if="!groupVideo.cover"
                      class="upload"
                      @click="handlePicUpload"
                    >
                      <i class="el-icon-plus"></i>
                      <span>上传文件</span>
                      <bt-uploader
                        ref="picUploader"
                        client-code="vportal"
                        single-file
                        :accept="['.png', '.jpg', '.jpeg']"
                        @finish="handleFinish"
                      ></bt-uploader>
                    </div>
                    <div v-if="groupVideo.cover">
                      <img
                        :src="imgUrl || groupVideo.cover"
                        alt=""
                        width="100%"
                        height="100%"
                      />
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <p>允许上传图片的格式为jpg、jpeg、gif、png</p>
                    <p>建议尺寸大小：640 x 360</p>
                    <el-button
                      v-if="groupVideo.cover"
                      type="primary"
                      @click="groupVideo.cover = ''"
                    >
                      更换封面
                    </el-button>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <!-- <div class="tit">简介</div> -->
              <el-form-item
                label="简介"
                prop="info"
                :rules="[{ required: true, message: '简介不能为空' }]"
              >
                <el-input
                  v-model="groupVideo.info"
                  type="textarea"
                  :autosize="{ minRows: 10 }"
                  maxlength="400"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <div class="line"></div>
            </el-col>
            <el-col :span="12">
              <!-- <div class="tit">视频</div> -->
              <el-form-item
                label="视频"
                prop="videoContent"
                :rules="[{ required: true, message: '视频不能为空' }]"
              >
                <el-row :gutter="30">
                  <el-col
                    v-for="(item, index) in groupVideo.videoContent"
                    :key="item.id"
                    :span="8"
                  >
                    <!-- <img
                      :src="imgUrl || groupVideo.cover"
                      width="100%"
                      height="100%"
                    /> -->
                    <div class="itemPic">
                      <i class="el-icon-video-camera"></i>
                    </div>
                    <div>
                      名称:
                      <el-input v-model="item.name"></el-input>
                    </div>
                    <div>
                      排序:
                      <el-input v-model="item.sort"></el-input>
                      <el-button type="danger" @click="handleDel(index)">
                        删除
                      </el-button>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div class="upload" @click="handleVideoUpload">
                      <i class="el-icon-plus"></i>
                      <span>上传文件</span>
                      <bt-uploader
                        ref="videoUploader"
                        client-code="vportal"
                        :accept="['.mp4', 'webm', 'ogg']"
                        @finish="handleFinish"
                      ></bt-uploader>
                    </div>
                  </el-col>
                </el-row>
              </el-form-item>
              <div>
                <p>视频格式包括：MP4、WebM、Ogg，视频大小限制在600M内</p>
                <p>
                  视频上传后需要进行切片、转码服务，请耐心等待转码完成后即可播放。
                </p>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="block">
                <!-- <div class="tit">分类</div> -->
                <el-form-item
                  label="分类"
                  prop="categoryIds"
                  :rules="[{ required: true, message: '分类不能为空' }]"
                >
                  <el-input
                    v-model="groupVideo.categoryText"
                    placeholder="请选择"
                    suffix-icon="el-icon-arrow-down"
                    style="width: 220px"
                    @focus="
                      show = true
                      checkedKeys = groupVideo.categoryIds.split(',')
                    "
                  ></el-input>
                </el-form-item>
              </div>

              <div class="block">
                <div class="tit">倍速播放</div>
                <el-checkbox v-model="groupVideo.doubleSpeed">
                  是否支持
                </el-checkbox>
              </div>
              <div class="block">
                <div class="tit">
                  可见范围
                  <span>（团队/公司/组织内成员）</span>
                </div>
                <el-cascader
                  v-model="groupVideo.units"
                  :options="userOptions"
                  :props="cascaderProps"
                  collapse-tags
                  clearable
                  :show-all-levels="false"
                ></el-cascader>
              </div>
              <div class="block">
                <div class="tit">发布时间</div>
                <div style="margin-bottom: 10px">
                  <el-checkbox v-model="groupVideo.regular">
                    是否定时
                  </el-checkbox>
                </div>
                <div v-show="groupVideo.regular">
                  <el-date-picker
                    v-model="groupVideo.effectiveTime"
                    type="datetime"
                    placeholder="选择日期时间"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  ></el-date-picker>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div class="submit">
        <el-button
          type="primary"
          size="medium"
          style="width: 120px"
          @click="save(true)"
        >
          发布
        </el-button>
        <el-button type="primary" plain size="medium" @click="save(false)">
          保存(不发布)
        </el-button>
        <el-button
          style="width: 120px"
          type="info"
          size="medium"
          @click="$router.go(-1)"
        >
          取消
        </el-button>
      </div>
    </bt-page>
    <el-dialog :title="`选择分类`" :visible.sync="show">
      <div style="text-align: center">
        <CategoryTree
          ref="CategoryTree"
          :select="true"
          :show-button="showButton"
          :checked-keys="checkedKeys"
        />
        <div class="footer">
          <div class="button">
            <div>
              <span v-if="showButton">
                <el-button size="medium" @click="cancalGroup">取消</el-button>
                <el-button type="primary" size="medium" @click="saveCategory">
                  保存排序
                </el-button>
              </span>
              <span v-else>
                <el-button type="primary" size="medium" @click="editGroup">
                  管理分类
                </el-button>
              </span>
            </div>
            <div style="margin-left: 30px">
              <el-button type="text" size="medium" @click="foldAll">
                全部折叠
              </el-button>
              <el-divider direction="vertical"></el-divider>
              <el-button type="text" size="medium" @click="openAll">
                全部展开
              </el-button>
            </div>
          </div>
          <div>
            <el-button
              v-if="!showButton"
              type="primary"
              size="medium"
              @click="selectOK"
            >
              确认
            </el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import dayjs from 'dayjs'
  import {
    postVideo,
    getOnelVideo,
    putVideo,
    getSysUnit,
    getVideoCategory,
    getVideoSelectByVkey,
  } from '../api'
  import { downloadURL } from '@/components/BtUploader/js/common'
  import CategoryTree from '../components/CategoryTree.vue'
  export default {
    components: {
      CategoryTree,
    },
    data() {
      return {
        edit: false,
        singleVideo: {
          cover: '',
          name: '',
          info: '',
          videoUrl: '',
          categoryIds: [],
          categoryText: '',
          doubleSpeed: false,
          auth: '',
          regular: false,
          effectiveTime: null,
          videoContent: [],
          units: [],
        },
        groupVideo: {
          cover: '',
          name: '',
          info: '',
          videoContent: [],
          categoryIds: [],
          categoryText: '',
          doubleSpeed: false,
          auth: '',
          regular: false,
          effectiveTime: null,
          units: [],
        },
        activeName: 'single',
        show: false,
        showButton: false,
        checkedKeys: [],
        pickerOptions: {
          disabledDate: (time) => {
            return dayjs(time).isBefore(dayjs().add(-1, 'day'))
          },
        },
        userOptions: [],
        category: [],
        imgUrl: '',
        cascaderProps: {
          multiple: true,
          value: 'unitCode',
          label: 'unitShortName',
          // checkStrictly: true,
          emitPath: false,
        },
      }
    },
    watch: {
      '$route.query.id'(val) {
        if (val) {
          this.getDetail(val)
        }
      },
    },
    created() {
      this.getSysUnitList()
      getVideoCategory().then((res) => {
        this.category = res.records
      })
    },
    mounted() {
      if (this.$route.query.id) {
        this.edit = true
        this.init()
      } else {
        this.edit = false
        getVideoSelectByVkey({ vkey: 'PLAYBACK_SETTINGS_PC' }).then((res) => {
          const setting = JSON.parse(res.value)
          this[`singleVideo`].doubleSpeed = setting.doubleSpeed == 1
          this[`groupVideo`].doubleSpeed = setting.doubleSpeed == 1
        })
      }
    },
    methods: {
      getSysUnitList() {
        let code = process.env.VUE_APP_TOPUNITCODE || 'D66m3sjl'
        getSysUnit(code).then((res) => {
          const data = this.clearNode(res.data)
          this.userOptions = data
        })
      },
      clearNode(data) {
        data.forEach((val) => {
          if (val.children && !val.children.length) {
            delete val.children
          } else if (val.children) {
            this.clearNode(val.children)
          }
        })
        return data
      },
      init() {
        getOnelVideo(this.$route.query.id).then((res) => {
          if (res.type === '1') {
            this.activeName = 'group'
            this.groupVideo = res
            const ossId = JSON.parse(res.ossId)
            if (ossId.length) {
              this.groupVideo.videoContent = []
              ossId.forEach((item) => {
                this.groupVideo.videoContent.push({
                  name: item.name,
                  sort: item.sort,
                  ossId: item.ossId,
                  // cover: res.cover,
                })
              })
            }
          } else {
            this.activeName = 'single'
            this.singleVideo = res
            const ossId = JSON.parse(res.ossId)
            this.singleVideo.videoContent = []
            this.singleVideo.videoContent.push({
              name: ossId[0].name,
              // sort: item.sort,
              ossId: ossId[0].ossId,
            })
          }
          const categoryIds = res.categoryIds.split(',')
          const text = []
          categoryIds.forEach((item) => {
            this.category.forEach((val) => {
              if (val.id == item) {
                text.push(val.name)
              }
            })
          })
          this[`${this.activeName}Video`].categoryText = text.join()
          this[`${this.activeName}Video`].regular = res.effectiveType == '1'
          this[`${this.activeName}Video`].doubleSpeed = res.doubleSpeed == '1'
          if (res.dataScope) {
            this[`${this.activeName}Video`].units = res.dataScope.split(',')
          }
        })
      },
      getDetail() {
        getOnelVideo(this.$route.query.id).then((res) => {
          return res
        })
      },
      handleTab(val) {},
      handlePicUpload() {
        this.$refs.picUploader.handleUploadClick()
      },
      handleVideoUpload() {
        // if (this[`${this.activeName}Video`].cover) {
        this.$refs.videoUploader.handleUploadClick()
        // } else {
        //   this.$baseMessage('请先上传视频封面', 'error')
        // }
      },
      handleDel(index) {
        this.groupVideo.videoContent.splice(index, 1)
        console.log(this.groupVideo.videoContent)
      },
      cancalGroup() {
        this.showButton = false
        this.$refs.CategoryTree.cancalGroup()
      },
      saveCategory() {
        this.showButton = false
        this.$refs.CategoryTree.saveCategory()
      },
      editGroup() {
        this.showButton = true
        this.$refs.CategoryTree.editGroup()
      },
      foldAll() {
        this.$refs.CategoryTree.foldAll()
      },
      openAll() {
        this.$refs.CategoryTree.openAll()
      },
      handleFinish(res) {
        console.log(res)
        if (res.success) {
          const isVideo = res.data.fileMimeType.includes('video')
          const isImage = res.data.fileMimeType.includes('image')
          if (isImage) {
            if (this.activeName == 'single') {
              this.singleVideo.cover = res.data.id
              downloadURL(res.data.id, 'vportal').then((data) => {
                console.log(data)
                this.imgUrl = data
              })
            } else {
              this.groupVideo.cover = res.data.id
              downloadURL(res.data.id, 'vportal').then((data) => {
                console.log(data)
                this.imgUrl = data
              })
            }
          }
          if (isVideo) {
            if (this.activeName == 'single') {
              this.singleVideo.videoContent.push({
                name: res.data.fileOrigName,
                // cover: this.imgUrl || this.singleVideo.cover,
                ossId: res.data.id,
              })
            } else {
              this.groupVideo.videoContent.push({
                name: res.data.fileOrigName,
                // cover: this.imgUrl || this.groupVideo.cover,
                ossId: res.data.id,
                sort: 0,
              })
            }
          }
        }
        console.log(res)
      },
      selectOK() {
        this.show = false
        const keys = this.$refs.CategoryTree.getCheckedKeys()
        const nodes = this.$refs.CategoryTree.getCheckedNodes()
        console.log(nodes)
        // if (nodes.length) {
        const text = []
        nodes.forEach((item) => {
          text.push(item.label)
        })
        this[`${this.activeName}Video`].categoryText = text.join()
        // }
        this[`${this.activeName}Video`].categoryIds = keys.join()
        console.log(keys)
      },
      submit() {
        const data = {
          categoryIds: 'string',
          cover: 'string',
          dataScope: 'string',
          doubleSpeed: 'string',
          effectiveTime: '2022-12-26T03:18:37.148Z',
          id: 0,
          info: 'string',
          name: 'string',
          ossId: 'string',
          publishName: 'string',
          status: '00', //00草稿，01启用，02停用
          type: 'string',
          videoContent: [{}],
        }
      },
      save(status) {
        if (this.edit) {
          this.$refs[
            this.activeName == 'single' ? 'ruleForm' : 'ruleForm2'
          ].validate((valid) => {
            if (valid) {
              putVideo({
                ...this[`${this.activeName}Video`],
                videoContent: undefined,
                status: status ? '01' : '00',
                cover: this.imgUrl
                  ? this[`${this.activeName}Video`].cover
                  : this[`${this.activeName}Video`].cover
                  ? undefined
                  : '',
                ossId: JSON.stringify(
                  this[`${this.activeName}Video`].videoContent
                ),
                doubleSpeed: this[`${this.activeName}Video`].doubleSpeed
                  ? '1'
                  : '0',
                effectiveTime: this[`${this.activeName}Video`].regular
                  ? this[`${this.activeName}Video`].effectiveTime
                  : '',
                dataScope: this[`${this.activeName}Video`].units
                  ? this[`${this.activeName}Video`].units.join()
                  : '',
              }).then((res) => {
                if (res) {
                  this.$baseMessage('操作成功！', 'success')
                  this.$router.go(-1)
                }
              })
            }
          })
          return
        }

        if (this.activeName == 'single') {
          this.$refs['ruleForm'].validate((valid) => {
            if (valid) {
              postVideo({
                ...this.singleVideo,
                videoContent: [],
                type: '0',
                status: status ? '01' : '00',
                ossId: JSON.stringify(
                  this[`${this.activeName}Video`].videoContent
                ),
                doubleSpeed: this[`${this.activeName}Video`].doubleSpeed
                  ? '1'
                  : '0',
                effectiveTime: this[`${this.activeName}Video`].regular
                  ? this[`${this.activeName}Video`].effectiveTime
                  : '',
                dataScope: this[`${this.activeName}Video`].units
                  ? this[`${this.activeName}Video`].units.join()
                  : '',
              }).then((res) => {
                if (res) {
                  this.$baseMessage('操作成功！', 'success')
                  this.$router.go(-1)
                }
              })
            } else {
              console.log('error submit!!')
              return false
            }
          })
        } else {
          this.$refs['ruleForm2'].validate((valid) => {
            if (valid) {
              postVideo({
                ...this.groupVideo,
                type: '1',
                status: status ? '01' : '00',
                ossId: JSON.stringify(
                  this[`${this.activeName}Video`].videoContent
                ),
                doubleSpeed: this[`${this.activeName}Video`].doubleSpeed
                  ? '1'
                  : '0',
                effectiveTime: this[`${this.activeName}Video`].regular
                  ? this[`${this.activeName}Video`].effectiveTime
                  : '',
                dataScope: this[`${this.activeName}Video`].units
                  ? this[`${this.activeName}Video`].units.join()
                  : '',
              }).then((res) => {
                if (res) {
                  this.$baseMessage('操作成功！', 'success')
                  this.$router.go(-1)
                }
              })
            }
          })
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  section {
    margin-bottom: 10px;
    .el-col {
      height: 36px;

      span {
        font-size: 13px;
        color: rgb(101, 101, 101);
      }
    }
  }
  .videoForm {
    background: #fff;
    // overflow: hidden;
    .tit {
      color: #7c7c7d;
      line-height: 30px;
      font-size: 12px;
      // font-weight: bold;
    }
    .row {
      display: block;
      width: 100%;
      p {
        color: #c2c7cd;
      }
    }
    .upload {
      border: 1px dashed #b3b3b3;
      color: #b3b3b3;
      padding: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 120px;
      cursor: pointer;
      line-height: 30px;
    }
    .line {
      height: 1px;
      border-top: 1px dotted rgb(176, 176, 176);
      margin: 40px 0 30px 0;
    }
    .block {
      margin: 20px 0;
    }
    .itemPic {
      background: #3b3b51;
      border-radius: 4px;
      width: 100%;
      height: 120px;
      display: flex;
      justify-content: center;
      align-items: center;
      i {
        font-size: 50px;
        color: #fff;
      }
    }
  }
  .submit {
    margin: 80px 0 30px 0;
    display: flex;
    justify-content: space-evenly;
    width: 50%;
  }
  .footer {
    border-top: 1px solid #e7e7e7;
    margin-top: 30px;
    padding-top: 10px;
    display: flex;
    justify-content: space-between;
    .button {
      width: 80%;
      display: flex;
      // justify-content: space-between;
      align-items: center;
    }
  }
</style>
