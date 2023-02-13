<template>
  <div>
    <el-upload
      ref="zUpload"
      :disabled="onlyRead"
      :class="{
        disabled: fileList.length >= limit || onlyRead,
        'scheduling-upload': type === 'file',
      }"
      :multiple="multiple"
      :limit="limit"
      :accept="
        type == 'img'
          ? 'image/png,image/jpg,image/jpeg'
          : ' .xlsx, .doc, .docx, .xls,'
      "
      action="#"
      :http-request="fileUpload"
      :list-type="type == 'img' ? 'picture-card' : ''"
      :on-exceed="fileExceed"
      :on-change="handleFileListChange"
      :on-remove="handleFileRemove"
      :file-list="fileList"
      :auto-upload="true"
    >
      <el-button v-if="type == 'file'" size="small" type="primary">
        {{ translateTitle(fileBtnStr) }}
      </el-button>
      <template v-if="onlyRead && type == 'file'">
        <p v-for="list in fileList" :key="list.id" style="margin-bottom: 5px">
          <a
            :title="translateTitle('点击下载')"
            :href="list.url"
            :download="list.name"
          >
            {{ list.name }}
          </a>
        </p>
      </template>
      <i v-if="type == 'img'" slot="default" class="el-icon-plus" />
      <!-- <div v-if="type == 'img'" slot="tip" class="el-upload__tip">
        {{ translateTitle('点击图片框') }}
      </div>-->
      <div v-if="type == 'img'" slot="file" slot-scope="{ file }">
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <i class="el-icon-zoom-in" />
          </span>
          <span
            v-if="false"
            class="el-upload-list__item-delete"
            @click="handleDownload(file)"
          >
            <i class="el-icon-download" />
          </span>
          <span
            v-if="!onlyRead"
            class="el-upload-list__item-delete"
            @click="handleFileRemove(file)"
          >
            <i class="el-icon-delete" />
          </span>
        </span>
      </div>
    </el-upload>
    <!-- 显示大图 -->
    <el-dialog
      :title="translateTitle('查看大图')"
      :close-on-click-modal="false"
      :visible.sync="uploadImgFlag"
    >
      <img width="100%" :src="uploadImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
  import { translateTitle } from '../i18n'
  import {
    uploadImgApi,
    schedulingExcelImport,
  } from '@/module/inspect/api/upload'
  export default {
    props: {
      onlyRead: {
        type: Boolean,
        required: true,
      },
      //img | file
      type: {
        required: true,
        type: String,
      },
      fileBtnStr: {
        type: String,
        default: '点击上传文件',
      },
      limit: {
        type: [String, Number],
        required: true,
      },
      multiple: {
        type: Boolean,
        default: true,
      },
      fileList: {
        type: Array,
        default: () => [],
      },
      //path
      dirObj: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        uploadImgFlag: false,
        uploadImageUrl: '',
      }
    },
    methods: {
      translateTitle,
      //超出上限
      fileExceed: function (files, fileList) {
        this.$msg({
          message: this.translateTitle('当前限制选择数量为') + this.limit,
          type: 'warning',
          // duration:0
        })
      },
      //修改
      handleFileListChange(file, fileList) {
        console.log(file, fileList)
        this.$emit('handleUpload', { type: 'change', fileList })
      },
      //删除
      handleFileRemove(file) {
        console.log(file)
        let fileList = this.$refs.zUpload.uploadFiles
        let index = fileList.findIndex((fileItem) => {
          return fileItem.uid === file.uid
        })
        this.$emit('handleUpload', { type: 'del', index })
      },
      //图片预览
      handlePictureCardPreview(file) {
        this.uploadImageUrl = file.url
        this.uploadImgFlag = true
      },
      //上传
      fileUpload(obj) {
        console.log(obj)
        let fd = new FormData()
        fd.append('file', obj.file)
        //传入排班workDir 参数 fd.append("workDir","equip");
        fd.append(this.dirObj.dir, this.dirObj.name)
        if (this.type === 'img') {
          uploadImgApi(fd).then((res) => {
            if (res.success == 1) {
              let { data } = res
              console.log(data)
              this.$emit('handleUpload', { type: 'id', id: data.fileUploadId })
            }
          })
        }
        if (this.type === 'file') {
          let title = fd.get('file').name.split('.')[0]
          schedulingExcelImport({ title }, fd)
            .then((res) => {
              if (res.success == 1) {
                // this.$refs.zUpload.clearFiles()
                this.$emit('handleUpload', { type: 'id' })
              }
            })
            .catch((e) => this.$refs.zUpload.clearFiles())
        }
      },
    },
  }
</script>

<style lang="scss">
  //隐藏上传框
  .disabled .el-upload--picture-card {
    display: none;
  }
</style>
<style lang="less" scoped></style>
