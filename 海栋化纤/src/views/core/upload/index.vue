<template>
  <div class="upload-container">
    <el-divider content-position="left">演示环境可能无法模拟上传</el-divider>
    <core-upload
      ref="coreUpload"
      :limit="50"
      :size="2"
      name="file"
      url="/upload"
    ></core-upload>
    <el-button type="primary" @click="handleShow({ key: 'value' })">
      模拟上传
    </el-button>
  </div>
</template>

<script>
  import CoreUpload from '@/extra/CoreUpload'

  export default {
    name: 'Upload',
    components: {
      CoreUpload,
    },
    data() {
      return {}
    },
    methods: {
      handleShow(data) {
        this.$refs['coreUpload'].handleShow(data)
      },
    },
  }
</script>
