<template>
  <el-upload
    action=""
    :http-request="handleHttpRequest"
    :show-file-list="false"
  >
    <bt-button type="primary">上传</bt-button>
  </el-upload>
</template>

<script>
  const MaxSize = 300 * 1024 * 1024 //300M
  const chunkSize = 2 * 1024 * 1024 //分片大小2M
  import { uploadFile, uploadFileChunk, mergeFileChunk } from '../api'
  import SparkMD5 from 'spark-md5'
  export default {
    props: {
      file: {
        type: Object,
        default() {
          return {}
        },
      },
    },
    data() {
      return {
        fileMD5: null,
      }
    },
    methods: {
      async handleHttpRequest(params) {
        const file = params.file
        if (file && file.size > MaxSize) {
          this.$baseMessage(this.$translateTitle(this.$cws.w112), 'warning')
          return
        }
        await this.computeMD5(file)
        console.log('MD5: ' + this.fileMD5)
        let chunks = Math.ceil(file.size / chunkSize)
        let currentChunk = 0
        for (currentChunk = 0; currentChunk < chunks; currentChunk++) {
          uploadBatch(this.fileMD5)
        }
        let $this = this
        function uploadBatch(fileMD5) {
          let start = currentChunk * chunkSize
          let end =
            start + chunkSize >= file.size ? file.size : start + chunkSize
          let fileChunk = file.slice(start, end)
          let currentChunkSize = end - start
          const formData = new FormData()
          formData.append('filename', file.name) //文件名
          formData.append('totalSize', file.size) //总大小
          formData.append('chunkSize', chunkSize) //分块大小
          formData.append('totalChunks', chunks) //总块数
          formData.append('chunkNumber', currentChunk + 1) //当前文件块，从1开始
          formData.append('currentChunkSize', currentChunkSize) //当前分块大小
          formData.append('identifier', fileMD5) //文件标识
          formData.append('file', fileChunk) //当前分块文件
          uploadFileChunk(formData).then(async (res) => {
            if (res.success && res.data) {
              $this.$baseMessage(
                $this.$translateTitle(
                  `上传分片：${res.data.multipartFileParam.chunkNumber}/${res.data.multipartFileParam.totalChunks}`
                ),
                'success'
              )
              if (res.data.needMerge) {
                $this.$baseMessage($this.$translateTitle('合并文件'), 'success')
                let res2 = await mergeFileChunk(res.data.multipartFileParam)
                if (res2.success && res2.data) {
                  $this.$baseMessage(
                    $this.$translateTitle('合并成功'),
                    'success'
                  )
                  $this.$emit('update:file', res2.data)
                  return
                }
              }
            } else {
              $this.$baseMessage(
                $this.$translateTitle($this.$cws.w111),
                'error'
              )
            }
          })
        }
        // return
        // const formData = new FormData()
        // formData.append('file', file)
        // uploadFile(formData).then((res) => {
        //   if (res && res.success) {
        //     this.$baseMessage(this.$translateTitle(this.$cws.w110), 'success')
        //     this.$emit('update:file', res.data)
        //   } else {
        //     this.$baseMessage(this.$translateTitle(this.$cws.w111), 'error')
        //   }
        // })
      },
      computeMD5(file) {
        return new Promise((resolve, reject) => {
          let spark = new SparkMD5.ArrayBuffer()
          let fileReader = new FileReader()
          fileReader.readAsArrayBuffer(file)
          fileReader.onload = (e) => {
            console.info('read file success')
            spark.append(e.target.result) // Append array buffer
            this.fileMD5 = spark.end()
            resolve()
          }
          fileReader.onerror = () => {
            console.warn('read file fail')
            reject()
          }
        })
      },
    },
  }
</script>
