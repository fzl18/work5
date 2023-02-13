<template>
  <div class="app-container">
    <bt-page title="故障代码编辑" subtitle="故障代码基本信息">
      <div class="bt-page__body">
        <div class="bt-column__body">
          <div class="el-box">
            <div style="margin-left: 35%">
              <el-form
                ref="form"
                :label-position="'top'"
                :model="form"
                :rules="addRules"
                label-width="80px"
                class="form-data"
              >
                <el-row class="edit-row">
                  <el-col :span="10">
                    <diversityPurposeItem
                      prop-items="faultNo"
                      :value.sync="form.faultNo"
                      label="故障代码"
                    />
                  </el-col>
                </el-row>
                <el-row class="edit-row">
                  <el-col :span="10">
                    <el-form-item
                      v-if="
                        $store.state.inspectFaultClassPageData.clickTreeData
                          .parentClassId != ''
                      "
                      label="上级故障代码"
                      prop="parentClassId"
                    >
                      <!-- <el-cascader
                        v-model="form.parentClassId"
                        :props="propData"
                        :options="options"
                        clearable
                        style="width: 380px"
                        @change="cascaderChange"
                      ></el-cascader> -->
                      <el-cascader
                        v-model="form.parentClassId"
                        :props="propData"
                        :options="options"
                        :show-all-levels="true"
                        style="width: 380px"
                        @change="cascaderChange"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="10">
                    <diversityPurposeItem
                      prop-items="faultName"
                      :value.sync="form.faultName"
                      label="故障代码名称"
                    />
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="10">
                    <diversityPurposeItem
                      prop-items="reason"
                      :value.sync="form.reason"
                      :is-textarea="true"
                      label="故障原因"
                    />
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="10">
                    <diversityPurposeItem
                      prop-items="resolvent"
                      :value.sync="form.resolvent"
                      :is-textarea="true"
                      label="解决方法"
                    />
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="10">
                    <label>文档:</label>
                    <div style="display: flex">
                      <el-upload
                        class="avatar-uploader"
                        :action="actionUrl"
                        :http-request="uploadfile"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                        :on-remove="removeFile"
                      >
                        <img
                          v-if="form.resolventFile && form.fileType === 'img'"
                          :src="
                            form.resolventFile.indexOf('http') >= 0
                              ? form.resolventFile
                              : form.resolventFileAll
                          "
                          class="avatar"
                        >

                        <video
                          v-if="form.resolventFile && form.fileType === 'video'"
                          :src="
                            form.resolventFile.indexOf('http') >= 0
                              ? form.resolventFile
                              : form.resolventFileAll
                          "
                          class="avatar"
                          controls="controls"
                        >
                          您的浏览器不支持视频播放
                        </video>

                        <img
                          v-if="form.resolventFile && form.fileType === 'pdf'"
                          src="@/assets/images/inspect/file_pdf.png"
                          class="avatar"
                        >
                        <img
                          v-if="form.resolventFile && form.fileType === 'word'"
                          src="@/assets/images/inspect/file_word.png"
                          class="avatar"
                        >

                        <el-button size="small" type="primary">
                          上传图片/PDF/Word/视频
                        </el-button>
                      </el-upload>
                    </div>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="10">
                    <el-form-item label="所需工种">
                      <el-select
                        v-model="form.repairWorkerTypeName"
                        style="width: 100%"
                        @change="workerTypeSelectChange($event)"
                      >
                        <el-option
                          v-for="item in repairWorkerTypes"
                          :key="item.value"
                          :label="item.label"
                          :value="item"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="10">
                    <el-form-item label="工种等级">
                      <el-select
                        v-model="form.repairJobGradeName"
                        style="width: 100%"
                        @change="jobGradeSelectChange($event)"
                      >
                        <el-option
                          v-for="item in repairJobGrades"
                          :key="item.value"
                          :label="item.label"
                          :value="item"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="10">
                    <el-form-item label="所需工具">
                      <el-select
                        v-model="form.repairTools"
                        style="width: 100%"
                        multiple
                        filterable
                        placeholder="可输入工具名称进行查询"
                      >
                        <el-option
                          v-for="item in tools"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="10">
                    <diversityPurposeItem
                      prop-items="sort"
                      :value.sync="form.sort"
                      label="展示顺序"
                    />
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </div>
          <div class="edit-bottom-row bt-page__body" style="height: 60px">
            <el-button
              class="cancle"
              style="float: right; margin-left: 10px"
              @click="cancel"
            >
              取消
            </el-button>
            <el-button
              v-hasPermission="'DXJ-GZDM-edit'"
              type="primary"
              style="float: right"
              @click="onSubmit"
            >
              保存
            </el-button>
          </div>
        </div>
      </div>
    </bt-page>
  </div>
</template>

<script>
import Api from '../../../api/faultClass'
import diversityPurposeItem from './diversity-purpose-item.vue'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapActions, mapMutations, mapGetters } =
  createNamespacedHelpers('inspectFaultClassPageData')
import { blurInteger, numberRange2 } from '../../preventMaintain/validate'
export default {
  name: 'FaultClassEdit',
  allowAccess: true,
  components: {
    diversityPurposeItem,
  },
  data() {
    return {
      actionUrl: ``,
      fileList: [],
      fileType: '',
      propData: {
        label: 'label',
        value: 'id',
        children: 'children',
        emitPath: false,
        checkStrictly: true,
      },
      repairWorkerTypes: [],
      repairJobGrades: [],
      tools: [],
      addRules: {
        faultNo: [
          {
            required: true,
            message: '请输入故障代码',
            trigger: 'blur',
          },
          {
            max: 50,
            message: '故障代码长度应小于等于50',
            trigger: 'blur',
          },
        ],
        faultName: [
          {
            required: true,
            message: '请输入故障代码名称',
            trigger: 'blur',
          },
          {
            max: 100,
            message: '故障代码名称长度应小于等于100',
            trigger: 'blur',
          },
        ],
        parentClassId: [
          {
            required: true,
            message: '请选择上级故障代码',
            trigger: 'change',
          },
        ],
      },
      form: {
        sort: 0,
        faultNo: '',
        faultName: '',
        resolventFile: '',
        parentClassId: '',
        id: '',
      },
      options: [],
      isCascaderChangeValue: false, // 级联选择器值发生改变
      parentClassId2: '',
    }
  },
  computed: {
    isTreeData() {
      return this.$store.state.inspectFaultClassPageData.treeData
    },
  },
  watch: {
    isTreeData(val) {
      this.options = val
    },
  },
  async mounted() {
    let data1 = {
      params: {
        catalogCode: 'REPAIR_WORKER_TYPE',
      },
    }
    this.$api.getDailyCheckDictionary(data1).then((res) => {
      if (res.code === 0) {
        res.data.forEach((item) => {
          item.value = item.dataCode
          item.label = item.dataValue
          this.repairWorkerTypes.push(item)
        })
      }
    })

    let data2 = {
      params: {
        catalogCode: 'JOB_GRADE',
      },
    }
    this.$api.getDailyCheckDictionary(data2).then((res) => {
      if (res.code === 0) {
        res.data.forEach((item) => {
          item.value = item.dataCode
          item.label = item.dataValue
          this.repairJobGrades.push(item)
        })
      }
    })

    let data3 = {
      params: {
        catalogCode: 'TOOL',
      },
    }
    this.$api.getDailyCheckDictionary(data3).then((res) => {
      if (res.code === 0) {
        res.data.forEach((item) => {
          item.value = item.dataCode
          item.label = item.dataValue
          this.tools.push(item)
        })
      }
    })

    this.options = JSON.parse(
      JSON.stringify(this.$store.state.inspectFaultClassPageData.treeData)
    )
    await Api.getFaultInfo({
      data: {},
      params: {
        id: this.$store.state.inspectFaultClassPageData.clickTreeData.id,
      },
    }).then((res) => {
      if (res.success === 1) {
        // console.log(res, '数据....')
        this.form = res.data
        this.parentClassId2 = this.form.parentClassId
      }
    })
    Api.getClassTree({ params: {} }).then((res) => {
      // console.log(res, '上级分类....')
      if (res.success === 1) {
        this.options = res.data
      }
    })
  },
  methods: {
    workerTypeSelectChange(event) {
      this.form.repairWorkerType = event.dataCode
      this.form.repairWorkerTypeName = event.dataValue
    },
    jobGradeSelectChange(event) {
      this.form.repairJobGrade = event.dataCode
      this.form.repairJobGradeName = event.dataValue
    },
    // 编辑上级分类
    cascaderChange(val) {
      if (val) {
        this.isCascaderChangeValue = true
      }
    },
    onSubmit() {
      if (this.isCascaderChangeValue == true) {
        this.$confirm('上级分类已经发生更改, 是否确定更新?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true,
        })
          .then(() => {
            this.$refs.form.validate((valid) => {
              if (valid) {
                /*  const data = {
                    faultNo: this.form.faultNo,
                    faultName: this.form.faultName,
                    resolventFile: this.form.resolventFile,
                    parentClassId: this.form.parentClassId,
                    reason: this.form.reason,
                    resolvent: this.form.resolvent,
                    repairWorkerType: this.form.repairWorkerType,
                    repairJobGrade: this.form.repairJobGrade,
                    repairTool: this.form.repairTool,
                    sort: this.form.sort,
                    id: this.form.id,
                  }*/
                this.form.repairToolName = ''
                this.form.repairToolNames = []
                if (this.form.repairTools && this.form.repairTools.length > 0) {
                  this.form.repairTools.forEach((item) => {
                    var index = this.tools.findIndex((t) => t.dataCode === item)
                    if (index > -1) {
                      let indexTool = this.tools[index]
                      this.form.repairToolNames.push(indexTool.dataValue)
                    }
                  })
                  this.form.repairToolName = this.form.repairToolNames.join(';')
                }

                Api.updateFaultInfo({ data: this.form }).then((res) => {
                  if (res.success === 1) {
                    this.$msg.success('修改成功')
                    this.$store.state.inspectFaultClassPageData.clickTreeData =
                      this.form
                    // this.$store.state.inspectFaultClassPageData.clickTreeData.faultNo =
                    //   data.faultNo
                    this.$store.state.inspectFaultClassPageData.clickTreeData.label =
                      this.form.faultName
                    this.$emit('getTree')
                    this.setIsComponent('FaultClass')
                  } else {
                    this.$msg.error(res.errorMsg ? res.errorMsg : '修改失败')
                  }
                })
              }
            })
          })
          .catch(() => {
            this.form.parentClassId = this.parentClassId2
            this.$message({
              type: 'info',
              message: '已取消了修改',
            })
          })
      } else {
        this.$refs.form.validate((valid) => {
          if (valid) {
            /* const data = {
                faultNo: this.form.faultNo,
                faultName: this.form.faultName,
                resolventFile: this.form.resolventFile,
                parentClassId: this.form.parentClassId,
                reason: this.form.reason,
                resolvent: this.form.resolvent,
                repairWorkerType: this.form.repairWorkerType,
                repairJobGrade: this.form.repairJobGrade,
                repairTool: this.form.repairTool,
                sort: this.form.sort,
                id: this.form.id,
              }*/
            this.form.repairToolName = ''
            this.form.repairToolNames = []
            if (this.form.repairTools && this.form.repairTools.length > 0) {
              this.form.repairTools.forEach((item) => {
                var index = this.tools.findIndex((t) => t.dataCode === item)
                if (index > -1) {
                  let indexTool = this.tools[index]
                  this.form.repairToolNames.push(indexTool.dataValue)
                }
              })
              this.form.repairToolName = this.form.repairToolNames.join(';')
            }
            Api.updateFaultInfo({ data: this.form }).then((res) => {
              if (res.success === 1) {
                this.$msg.success('修改成功')
                this.$store.state.inspectFaultClassPageData.clickTreeData =
                  this.form
                // this.$store.state.inspectFaultClassPageData.clickTreeData.faultNo =
                //   data.faultNo
                this.$store.state.inspectFaultClassPageData.clickTreeData.label =
                  this.form.faultName
                this.$emit('getTree')
                this.setIsComponent('FaultClass')
              } else {
                this.$msg.error('修改失败')
              }
            })
          }
        })
      }
      return
    },
    ...mapMutations(['setIsComponent']),
    cancel() {
      if (
        this.$store.state.inspectFaultClassPageData.clickTreeData
          .nextKindType === '1'
      ) {
        this.setIsComponent('FaultClassViewClass')
      } else {
        this.setIsComponent('FaultClass')
      }
    },
    getList() {},
    handleClick() {},
    // 上传
    uploadfile(o) {
      var that = this
      var params = new FormData()
      params.set('file', o.file)
      Api.uploadFile(params, 'public').then((res) => {
        // this.fileMap.set(o.file.uid, res.data.id)
        // this.$emit('addSn', res.data.sn)
        if (res.success === 1 && res.data) {
          that.form.resolventFile = res.data.path
          that.form.resolventFileAll = res.data.pathAll
          that.form.fileType = this.fileType
          this.$forceUpdate()
        }
      })
    },
    handleAvatarSuccess(res, file) {},
    beforeAvatarUpload(file) {
      const images = ['image/jpeg', 'image/png', 'image/jpg']
      const videos = [
        'video/mp4',
        'video/ogg',
        'video/flv',
        'video/avi',
        'video/wmv',
        'video/rmvb',
      ]
      const pdfs = ['application/pdf']
      const words = [
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
      ]
      if (images.concat(videos, pdfs, words).indexOf(file.type) == -1) {
        this.$message.error('请上传正确的图片/PDF/Word/视频格式')
        return false
      }
      if (!this.checkFile(images, file, 5, 'img')) return false
      if (!this.checkFile(videos, file, 10, 'video')) return false
      if (!this.checkFile(pdfs, file, 5, 'pdf')) return false
      if (!this.checkFile(words, file, 5, 'word')) return false
    },
    checkFile(fileTypes, file, limtSize, fileType) {
      const isLtSize = file.size / 1024 / 1024 < limtSize
      if (fileTypes.indexOf(file.type) !== -1) {
        if (!isLtSize) {
          this.$message.error(`上传文件大小不能超过 ${limtSize}MB!`)
          return false
        } else {
          this.fileType = fileType
        }
      }
      return true
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      )
    },
    removeFile(files, fileList) {
      this.form.resolventFile = ''
      this.$forceUpdate()
    },
  },
}
</script>

<style lang="scss" scoped>
::v-deep(.el-form-item__content) {
  width: 380px;
}
.avatar-uploader {
  border: 1px dashed #d9d9d9;
  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
}
</style>
<style lang="scss"></style>
