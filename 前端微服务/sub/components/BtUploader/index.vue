<template>
  <div class="bt-uploader-container">
    <button type="button" class="upload-btn" @click="handleUploadClick">
      文件上传 ({{ ids.length }})
    </button>
    <uploader
      v-show="show"
      id="uploader"
      ref="uploader"
      :options="options"
      :file-status-text="statusText"
      class="uploader"
      @file-added="onFileAdded"
      @file-removed="onFileRemoved"
      @file-success="onFileSuccess"
    >
      <uploader-unsupport />
      <div class="bt-uploader-header">
        <div>
          <uploader-btn id="upload" ref="uploadBtn" :attrs="attrs">
            选择文件
          </uploader-btn>
          <span class="uploadMessage">{{ uploadStatus }}（{{ number }}）</span>
        </div>
        <div>
          <span class="close" @click.stop.prevent="handleClose"></span>
        </div>
      </div>
      <ul class="bt-uploader-list">
        <li class="bt-uploader-name">文件名</li>
        <li class="bt-uploader-size">大小</li>
        <li class="bt-uploader-meta"></li>
        <li class="bt-uploader-status">状态</li>
        <li class="bt-uploader-actions">操作</li>
      </ul>
      <div class="innerList">
        <ul class="bt-uploaded-filelist">
          <li v-for="file in uploadedFileList" :key="file.id">
            <div class="bt-uploaded-name">
              <i
                class="uploader-file-icon"
                :icon="getFileCategory(file.fileOrigName)"
              ></i>
              {{ file.fileOrigName }}
            </div>
            <div class="bt-uploaded-size">{{ file.size }}</div>
            <div class="bt-uploaded-meta"></div>
            <div class="bt-uploaded-status"></div>
            <div class="bt-uploaded-actions">
              <span class="uploaded-file-download" @click="download(file)">
                ️
              </span>
              <a
                class="uploaded-file-preview"
                :href="previewUrl(file)"
                target="_blank"
              ></a>
              <span class="uploaded-file-del" @click="del(file)"></span>
            </div>
          </li>
        </ul>
        <uploader-list>
          <div slot-scope="props" class="file-panel">
            <ul class="file-list">
              <li v-for="file in props.fileList" :key="file.id">
                <uploader-file
                  ref="files"
                  :class="'file_' + file.id"
                  :file="file"
                  :list="true"
                ></uploader-file>
              </li>
            </ul>
          </div>
        </uploader-list>
      </div>
    </uploader>
  </div>
</template>

<script>
  import Vue from 'vue'
  import uploader from 'vue-simple-uploader'
  Vue.use(uploader)
  import SparkMD5 from 'spark-md5'
  import { UPLOADER_API, ACCEPT_CONFIG } from './js/config'
  import { merge, getFileList, download } from './js/common'
  export default {
    name: 'BtUploader',
    props: {
      value: {
        type: Array,
        default() {
          return []
        },
      },
      clientCode: {
        type: String,
        default() {
          return ''
        },
      },
      singleFile: {
        type: Boolean,
        default() {
          return false
        },
      },
      accept: {
        type: Array,
        default() {
          return [
            ...ACCEPT_CONFIG.image,
            ...ACCEPT_CONFIG.video,
            ...ACCEPT_CONFIG.document,
          ]
        },
      },
    },
    data() {
      return {
        show: false,
        uploadedFileList: [],
        ids: [],
        uploadingNumber: 0,
        attrs: {
          accept: this.accept,
        },
        options: {
          target: UPLOADER_API.simpleUploadURL,
          testChunks: false, // 不校验
          chunkSize: '2048000',
          singleFile: this.singleFile, //是否单文件上传
        },
        statusText: {
          success: '上传成功',
          error: '上传失败',
          uploading: '上传中',
          paused: '暂停中',
          waiting: '等待中',
        },
      }
    },
    computed: {
      uploader() {
        return this.$refs.uploader.uploader
      },
      uploadStatus() {
        const message = {
          pedding: '正在上传',
          complete: '已上传',
        }
        return this.uploadingNumber > 0 ? message.pedding : message.complete
      },
      number() {
        return this.uploadingNumber > 0
          ? `${this.uploadedFileList.length}/${
              this.uploadingNumber + this.uploadedFileList.length
            }`
          : this.uploadedFileList.length
      },
    },
    watch: {
      uploadedFileList(val) {
        this.ids = val.map((item) => item.id)
        this.$emit('onFilelist', this.uploadedFileList)
        this.$emit('input', this.ids)
      },
      value: {
        handler: function (val) {
          this.initUploadedList(val)
        },
      },
    },
    methods: {
      initUploadedList(nativeIds) {
        if (nativeIds.length > 0 && !this.checkSameArr(nativeIds, this.ids)) {
          getFileList({ ids: nativeIds.join(',') }, this.clientCode)
            .then((res) => {
              if (res.status == 200) {
                this.uploadedFileList = res.data.data.dataList
              }
            })
            .catch(() => {})
        }
      },
      handleUploadClick() {
        //验证是否有clientCode
        if (!this.clientCode || this.clientCode == '') {
          console.error('未传入clientCode')
          this.$emit('onError', { message: '未传入clientCode' })
          return
        }
        this.show = true
      },
      handleClose() {
        if (this.uploadingNumber > 0) {
          if (confirm('还有未上传的文件，确定要退出吗？')) {
            this.show = false
          }
        } else {
          this.show = false
        }
      },
      download(file) {
        download(file.id, file.fileOrigName, this.clientCode)
      },
      previewUrl(file) {
        return UPLOADER_API.simplePreviewURL + file.id
      },
      del(file) {
        this.uploadedFileList.splice(file, 1)
      },
      onFileAdded(file) {
        this.uploadingNumber += 1
        this.computeMD5(file)
      },
      onFileRemoved() {
        this.uploadingNumber -= 1
      },

      onFileSuccess(rootFile, file, response, chunk) {
        const res = JSON.parse(response)
        if (res.success != 1) {
          // 文件状态设为“失败”
          return
        }
        // 如果服务端返回需要合并
        if (res.data.needMerge) {
          // 文件状态设为“合并中”
          this.statusSet(file.id, '合并中', 'success')
          merge(res.data.multipartFileParam, this.clientCode)
            .then((res) => {
              // 文件合并成功
              if (res.status == 200) {
                let result = res.data
                this.uploadedFileList.push(result.data)
                this.statusRemove(file, true)
              }
            })
            .catch((e) => {
              this.statusRemove(file)
            })
        } else {
          console.log('上传成功')
        }
      },

      computeMD5(file) {
        const fileReader = new FileReader()
        const time = new Date().getTime()
        const blobSlice =
          File.prototype.slice ||
          File.prototype.mozSlice ||
          File.prototype.webkitSlice
        let currentChunk = 0
        const chunkSize = this.options.chunkSize
        const chunks = Math.ceil(file.size / chunkSize)
        const spark = new SparkMD5.ArrayBuffer()
        file.pause()
        loadNext()
        fileReader.onload = (e) => {
          spark.append(e.target.result)
          if (currentChunk < chunks) {
            currentChunk++
            loadNext()
            // 实时展示MD5的计算进度
            this.$nextTick(() => {
              // 文件状态设为"计算MD5"
              this.statusSet(
                file.id,
                `校验中（${((currentChunk / chunks) * 100).toFixed(0)}%）`
              )
            })
          } else {
            const md5 = spark.end()
            this.computeMD5Success(md5, file)
            console.log(
              `MD5计算完毕：${file.name} \nMD5：${md5} \n分片：${chunks} 大小:${
                file.size
              } 用时：${new Date().getTime() - time} ms`
            )
          }
        }
        fileReader.onerror = function () {
          this.error(`文件${file.name}读取出错，请检查该文件`)
          file.cancel()
        }
        function loadNext() {
          const start = currentChunk * chunkSize
          const end =
            start + chunkSize >= file.size ? file.size : start + chunkSize
          fileReader.readAsArrayBuffer(blobSlice.call(file.file, start, end))
        }
      },
      computeMD5Success(md5, file) {
        // 将自定义参数直接加载uploader实例的opts上
        Object.assign(this.uploader.opts, {
          headers: { ...{ 'cnt-current-client-code': this.clientCode } },
        })
        file.uniqueIdentifier = md5
        file.resume()
        this.statusRemove(file)
      },
      statusSet(id, message, status = 'pend') {
        let bgcolor = ''
        switch (status) {
          case 'pend':
            bgcolor = '#fff'
            break
          case 'success':
            bgcolor = '#e2eeff'
            break
          case 'error':
            bgcolor = '#ffe0e0'
            break
        }
        this.$nextTick(() => {
          let fileDom = document
            .getElementsByClassName(`file_${id}`)[0]
            .getElementsByClassName('uploader-file-status')[0]
          let statusDom = fileDom.getElementsByClassName('bt-status')[0]
          if (!statusDom) {
            let dom = document.createElement('div')
            dom.className = 'bt-status'
            dom.innerText = message
            dom.style.backgroundColor = bgcolor
            fileDom.appendChild(dom)
          } else {
            statusDom.innerText = message
            statusDom.style.display = 'block'
            statusDom.style.backgroundColor = bgcolor
          }
          //隐藏暂停按钮
          let resume = document
            .getElementsByClassName(`file_${id}`)[0]
            .getElementsByClassName('uploader-file-resume')[0]
          resume.style.display = 'none'
        })
      },
      // 移除自定义状态
      statusRemove(file, removeFile = false) {
        this.$nextTick(() => {
          let statusDom = document
            .getElementsByClassName(`file_${file.id}`)[0]
            .getElementsByClassName('uploader-file-status')[0]
            .getElementsByClassName('bt-status')[0]
          if (statusDom) {
            statusDom.style.display = 'none'
          }
          let resume = document
            .getElementsByClassName(`file_${file.id}`)[0]
            .getElementsByClassName('uploader-file-resume')[0]
          if (resume.style.display == 'none') {
            resume.removeAttribute('style')
          }
          if (removeFile) {
            file.removeFile(file)
            this.onFileRemoved()
          }
        })
      },

      getFileCategory(fileName) {
        let extension = fileName.substring(fileName.lastIndexOf('.') + 1)
        let type = ''
        const typeMap = ACCEPT_CONFIG
        Object.keys(typeMap).forEach((_type) => {
          const extensions = typeMap[_type]
          if (extensions.indexOf('.' + extension) > -1) {
            type = _type
          }
        })
        return type
      },

      checkSameArr(arr1, arr2) {
        return JSON.stringify(arr1) == JSON.stringify(arr2)
      },
    },
  }
</script>

<style lang="scss" scoped>
  .bt-uploader-container {
    font-size: 12px;
    .upload-btn {
      padding: 9px 15px;
      font-size: 12px;
      border-radius: 3px;
      color: #fff;
      background-color: #409eff;
      border-color: #409eff;
      display: inline-block;
      line-height: 1;
      white-space: nowrap;
      cursor: pointer;
      border: none;
    }
    ul {
      margin: 0;
      padding: 0;
    }
    .uploader {
      position: fixed;
      z-index: 99999;
      bottom: 0;
      right: 10px;
      width: 600px;
      height: 400px;
      border: 1px solid #e2e2e2;
      background: #fff;
      border-radius: 7px 7px 0 0;
      box-shadow: 0 0 10px rgb(0 0 0 / 20%);
      animation: myfirst 0.3s ease-in-out;
    }
    .bt-uploader-header {
      padding: 10px;
      border-bottom: 1px solid #cdcdcd;
      display: flex;
      justify-content: space-between;
      align-items: center;
      #upload {
        font-size: 12px;
        border-radius: 4px;
        background-color: rgb(48, 126, 199);
        border: none;
        color: #fff;
      }
      .uploadMessage {
        display: inline-block;
        padding: 0 36px;
        color: #919191;
        font-size: 13px;
      }
      .close {
        display: inline-block;
        font-size: 24px;
        color: #989898;
        cursor: pointer;
        &::before {
          content: '×';
        }
      }
    }
    .innerList {
      height: 300px;
      margin-bottom: 10px;
      overflow-x: hidden;
      overflow-y: auto;
      &::-webkit-scrollbar {
        /*滚动条整体样式*/
        width: 4px;
        /*高宽分别对应横竖滚动条的尺寸*/
        height: 4px;
        scrollbar-arrow-color: red;
      }
      &::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 5px;
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: rgba(0, 0, 0, 0.2);
        scrollbar-arrow-color: red;
      }
      &::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 0;
        background: rgba(0, 0, 0, 0.1);
      }
    }

    .file-panel {
      .file-list {
        position: relative;
        // height: 240px;
        overflow-x: hidden;
        overflow-y: auto;
        background-color: #fff;
        > li {
          background-color: #fff;
          list-style: none;
          color: #858892;
        }
      }
    }
    .bt-uploader-list {
      display: flex;
      width: 100%;
      border-bottom: 1px solid #cdcdcd;
      li {
        list-style: none;
        padding: 15px 10px;
      }
      .bt-uploader-name {
        width: 45%;
      }
      .bt-uploader-size {
        width: 13%;
      }
      .bt-uploader-meta {
        width: 3%;
      }
      .bt-uploader-status {
        width: 24%;
      }
      .bt-uploader-actions {
        width: 15%;
      }
    }
    // 已上传的文件
    .bt-uploaded-filelist {
      li {
        list-style: none;
        // padding: 15px 10px;
        display: flex;
        height: 49px;
        line-height: 49px;
        overflow: hidden;
        border-bottom: 1px solid #cdcdcd;
      }
      .bt-uploaded-name {
        width: 45%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        text-indent: 14px;
      }
      .bt-uploaded-size {
        width: 13%;
        text-indent: 10px;
      }
      .bt-uploaded-meta {
        width: 3%;
      }
      .bt-uploaded-status {
        width: 24%;
        text-indent: 20px;
        position: relative;
        &::after {
          content: '';
          position: absolute;
          top: calc(50% - 10px);
          left: 15px;
          width: 20px;
          height: 20px;
          background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAABkCAYAAAD0ZHJ6AAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAAJcEhZcwAACxMAAAsTAQCanBgAAARkSURBVGje7ZnfS1NRHMAH4ptPkvQSuAdBkCxD8FUQJMEULUgzy1KyyPVQ4JMiiP4Bvg6EwUQQfMmwhwRDshwaKUjDVCgoSdDNHkzTJZ6+Z37Purve8+PeTb2TM/ggu+ew89l33x8H9BBCPG7GowXTJej3+wnDvEm0JuLC04+EYWftVAUv+fiCvDUdQR1BHUEdQR3BTIygvixoQS14XgTtthLVdpNWwXRLqvQ724LplFRtyrYF0yVpFLQrKRVMh6RZ0I6kkmCqklaCqpKZH0FX56Crq9jVfdDVk0RfFrSgFsxkQVmLcdKCVrKySCrryhPEyYShhzOcrFtG0EoilfHHk1CRU5rF6ZjNZhlVOW6RnMSVyyilKies4pO41diVy8wIujoHXV3FGdMHXTtJKLFYTLhZtq4vC1rwXApCZTIqgR6g1PBMCO9DL3bMMSqBHqDU8EyISDAHiGKvWwcCQG2KgjlAFCDAOhAAap0K5gKLphk8mqJgLrCIgoxRJ4J5wKpJ7gAoMkn5EBXBPGDVJHcAFJmkfIhQcAql1oBpTvTol9gG9pm4RHAKpdaAaU706JfYBvaZuJVgPQrt4sFlnOh5MC/p3lmJYD0K7eLBZZzoeTAv6d5ZnuAYHjpgEOnk5F0ufhG6v1ggOIaHDhhEOjl5l4tfhO4vthLcwAMrFNvLJO5vEwhu4IEViu1lEve3WQmyoihQFBzG/V0CQVYUBYqCw7i/SxTBcpsRbFeIYLnNCLZbCY5b5KAnxRwct8hBj9McZFVMW0ihRNBuFdMWUigRlFaxuQ9WWYjRMTiIe5z0wSoLMToGB3GPsA9aTZIJoB+nRgBnM1tzOkkmgH6cGgGczWzNpzqLx3n/aULJJgezeNw07oxQySbVywKjBOgFRnDs+VEsx8FlgVEC9AIjOPb8KJYjvSzoG7UW1IJaUAtqQS14toLNM5fN5APdwBJA8G83Pk/aK/rgzVvXzeQD3cASQPBvNz5P2ssTzAaGUIrHEO6zI5gNDKEUjyHcxxWkh4Ylcowwk1QQpIeGJXKMMJO0EgwqyjGCioJBJvDrxRMSuVOTJEXfbz1/bHwWtBL0yoQehK6RucgE+bGzanzulQh6E3IgQV+xpc8kcrfuSO7eTfJ3ZYmQw0Oy9azVKOk1C/bJ5D5F38YPeLfx0rjWJxHsS0SqsSYuxySjj5qO5Oj7xQWy2VBtFOwzCy6ryH3YfE3uh64Y1xckgstJPydEjkkeHv07Iy4Xaao15+KCWTBx6M/db+T9xivSErqaJDdzXI6yLRE8Vgg0coex/SPJvT0SbWu0KpZtbgSpCH3NRt7I5OxHkObc6heU+/M/J5vrpBFM5GBLqCQux14COXs5CNXK5OjPGm1tSMrJSOMNYQ4mVTGV/L6zTL7+DovkbFUxbSW0Wo05l8hJWsU+cRWfSh+Mt5Lb1ck/J1TvVsdDaR/MiEni+llsdZuZp62EViu+96bpNjNPWwmtVnzvFd5m9IVVC54x/wA7gNvqFG9vXQAAAABJRU5ErkJggg==')
            no-repeat 0 0;
          background-position-y: -78px;
        }
      }
      .bt-uploaded-actions {
        width: 15%;
      }
      .bt-uploaded-actions > span,
      a {
        display: none;
        float: left;
        width: 16px;
        height: 16px;
        margin-top: 16px;
        margin-right: 10px;
        cursor: pointer;
        background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAABkCAYAAAD0ZHJ6AAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAAJcEhZcwAACxMAAAsTAQCanBgAAARkSURBVGje7ZnfS1NRHMAH4ptPkvQSuAdBkCxD8FUQJMEULUgzy1KyyPVQ4JMiiP4Bvg6EwUQQfMmwhwRDshwaKUjDVCgoSdDNHkzTJZ6+Z37Purve8+PeTb2TM/ggu+ew89l33x8H9BBCPG7GowXTJej3+wnDvEm0JuLC04+EYWftVAUv+fiCvDUdQR1BHUEdQR3BTIygvixoQS14XgTtthLVdpNWwXRLqvQ724LplFRtyrYF0yVpFLQrKRVMh6RZ0I6kkmCqklaCqpKZH0FX56Crq9jVfdDVk0RfFrSgFsxkQVmLcdKCVrKySCrryhPEyYShhzOcrFtG0EoilfHHk1CRU5rF6ZjNZhlVOW6RnMSVyyilKies4pO41diVy8wIujoHXV3FGdMHXTtJKLFYTLhZtq4vC1rwXApCZTIqgR6g1PBMCO9DL3bMMSqBHqDU8EyISDAHiGKvWwcCQG2KgjlAFCDAOhAAap0K5gKLphk8mqJgLrCIgoxRJ4J5wKpJ7gAoMkn5EBXBPGDVJHcAFJmkfIhQcAql1oBpTvTol9gG9pm4RHAKpdaAaU706JfYBvaZuJVgPQrt4sFlnOh5MC/p3lmJYD0K7eLBZZzoeTAv6d5ZnuAYHjpgEOnk5F0ufhG6v1ggOIaHDhhEOjl5l4tfhO4vthLcwAMrFNvLJO5vEwhu4IEViu1lEve3WQmyoihQFBzG/V0CQVYUBYqCw7i/SxTBcpsRbFeIYLnNCLZbCY5b5KAnxRwct8hBj9McZFVMW0ihRNBuFdMWUigRlFaxuQ9WWYjRMTiIe5z0wSoLMToGB3GPsA9aTZIJoB+nRgBnM1tzOkkmgH6cGgGczWzNpzqLx3n/aULJJgezeNw07oxQySbVywKjBOgFRnDs+VEsx8FlgVEC9AIjOPb8KJYjvSzoG7UW1IJaUAtqQS14toLNM5fN5APdwBJA8G83Pk/aK/rgzVvXzeQD3cASQPBvNz5P2ssTzAaGUIrHEO6zI5gNDKEUjyHcxxWkh4Ylcowwk1QQpIeGJXKMMJO0EgwqyjGCioJBJvDrxRMSuVOTJEXfbz1/bHwWtBL0yoQehK6RucgE+bGzanzulQh6E3IgQV+xpc8kcrfuSO7eTfJ3ZYmQw0Oy9azVKOk1C/bJ5D5F38YPeLfx0rjWJxHsS0SqsSYuxySjj5qO5Oj7xQWy2VBtFOwzCy6ryH3YfE3uh64Y1xckgstJPydEjkkeHv07Iy4Xaao15+KCWTBx6M/db+T9xivSErqaJDdzXI6yLRE8Vgg0coex/SPJvT0SbWu0KpZtbgSpCH3NRt7I5OxHkObc6heU+/M/J5vrpBFM5GBLqCQux14COXs5CNXK5OjPGm1tSMrJSOMNYQ4mVTGV/L6zTL7+DovkbFUxbSW0Wo05l8hJWsU+cRWfSh+Mt5Lb1ck/J1TvVsdDaR/MiEni+llsdZuZp62EViu+96bpNjNPWwmtVnzvFd5m9IVVC54x/wA7gNvqFG9vXQAAAABJRU5ErkJggg==')
          no-repeat 0 0;
      }
      .bt-uploaded-actions .uploaded-file-download {
        display: block;
        background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAMFJREFUWEftlNsNwjAMRd1kMRgCVrAyBWKKyCvQIWCxpKgSSHy0iR8V7Yfz2/TeoxPZA+x8hp37wQHEBohoaj0bIooyRZfnYgdwA27grwaI6AEAF+O6HhHxupbR3QNGiGb5DNUF+CwfjYluORtAAcEqFwEIINjlYgAGhKhcBdCAEJerARYgVOUmgB8IaM15b4ewxrAXYvnuAKsGcs6nEMLTovf7b631nFJ6LWUdGyDGeNvCQCnlLjawRTEnw6fADbwB551kITDHT40AAAAASUVORK5CYII=')
          no-repeat 0 0;
        background-size: 100% 100%;
      }
      .bt-uploaded-actions .uploaded-file-preview {
        display: block;
        background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAedJREFUWEftls9LlEEYx7/P7kJ76GhCVBdF8FYgHetQJtQtxB+EhLEwz3taSv0zMmVh2XnmogiCFUKngiQPdi4i6JLoQZAOevOyHtpHXtmNd23fcdXDeNiBubzzfZ7nM8/7zDNDCDwocHx0ADoZOFcGKpXKDSLqjyeAmqr+IqJNZv5z1qJuG8A5N1yr1SaJ6A6AmymBdlT1ZyaTWTTGrLYDcyqAc25SVV8AuN+Ow4Rmg4gWjDGLPrtUgHK5fDWbzS4R0dMzBj4p/5DL5Z4XCoWDVn5aAojIdQBLAAY9wfcB7AL4C+AWgGtpWiJaV9WJVjXyH4C1to+IlgHc9QQfZeb3yXURmQbw2mPzjYieGWN+JzVNAKVS6Uo+n19T1Xtpjpj52EZEXgIYqus+M/N8/bt6MvG1Wq0+KhaLhw1NE4BzblZVpzy7mGHmWWvtFyJ6kNSp6noURQ9FZATAOw/EG2NMnK3j8Q/AWjtGRCue4HvM3F3f+VyK7lWcCRHZA9CV5ktVx6MoetsEICJbAHo8AN+ZeUBEPgJ4nKL7xMxPROQHgNseX9vM3Hu5AIL/gjgdQYswBgh+DGOIoI2oUbVBW3EDIuhllDy/wa7jk00k2IOkVTcL8iTztNULLZ36JLuQ9zaMOwCdDBwBYUEQMGoc5RkAAAAASUVORK5CYII=')
          no-repeat 0 0;
        background-size: 100% 100%;
      }
      .bt-uploaded-actions .uploaded-file-del {
        display: block;
        background-position-y: -34px;
      }
      .uploader-file-icon {
        width: 24px;
        height: 24px;
        display: inline-block;
        vertical-align: top;
        margin-top: 13px;
        margin-right: 8px;
      }
    }
    ::v-deep(.uploader-file-status) {
      text-indent: 0;
    }
    ::v-deep(.uploader-file-meta) {
      width: 3%;
    }
    ::v-deep(.uploader-file-actions) {
      width: 15%;
    }
    ::v-deep(.bt-status) {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: 99;
    }
    ::v-deep(.uploader-file-icon) {
      &:before {
        content: '' !important;
      }

      &[icon='image'] {
        background: url(./images/image-icon.png);
      }
      &[icon='video'] {
        background: url(./images/video-icon.png);
      }
      &[icon='document'] {
        background: url(./images/text-icon.png);
      }
    }
  }
  @-webkit-keyframes myfirst /* Safari and Chrome */ {
    0% {
      height: 0px;
    }
    100% {
      height: 400px;
    }
  }
</style>
