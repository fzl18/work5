<template>
  <div class="pic-single-upload">
    <div v-if="view" class="avatar-uploader view">
      <template v-if="value">
        <img v-if="fileType == 'image'" :src="picSrc" class="avatar" alt="">
        <img
          v-else-if="fileType == '3D'"
          :src="three_d"
          class="avatar pointer"
          alt=""
          @click.stop="visible = true"
        >
        <el-dialog
          v-if="fileType == '3D'"
          title="3D模型"
          :visible.sync="visible"
          :close-on-click-modal="true"
          :width="size.w + 40 + 'px'"
          top="10vh"
        >
          <bt-3d-viewer
            :url="picSrc"
            :size="size"
            :style="{ width: size.w + 'px', height: size.h + 'px' }"
          />
        </el-dialog>
      </template>
      <i v-else class="el-icon-picture-outline avatar-uploader-icon" />
    </div>
    <label v-else>
      <div class="avatar-uploader">
        <template v-if="value">
          <img v-if="fileType === 'image'" :src="picSrc" class="avatar" alt="">
          <img v-else-if="fileType === '3D'" :src="three_d" class="avatar" alt="">
        </template>
        <i v-else class="el-icon-plus avatar-uploader-icon" />
      </div>
      <bt-uploader
        class="hidden-uploader"
        :value="fileIds"
        :client-code="clientCode"
        :accept="accept"
        single-file
        @input="handleInput"
      />
    </label>
  </div>
</template>

<script>
import three_d from '@/assets/images/inspect/phd_model.png'
import request2 from '@/utils/request2'

const requestRoot = request2()

export default {
  name: 'PicSingleUpload',
  props: {
    value: {
      type: String,
      default: '',
    },
    fileType: {
      type: String,
      default: 'image',
    },
    view: {
      type: Boolean,
      default: false,
    },
    size: {
      type: Object,
      default: () => {
        return {
          w: 600,
          h: 400,
        }
      },
    },
  },
  data () {
    return {
      ids: [],
      picSrc: '',
      clientCode: 'basic-parameter',
      three_d,
      visible: false,
      // accept: ['.png', '.jpg', '.jpeg', '.gif', '.bmp'],
    }
  },
  computed: {
    fileIds () {
      if (this.value) {
        return [this.value]
      } else {
        return []
      }
    },
    accept () {
      switch (this.fileType) {
        case 'image':
          return ['.png', '.jpg', '.jpeg', '.gif', '.bmp']
        case '3D':
          return ['.gltf']
        default:
          return []
      }
    },
  },
  watch: {
    value: {
      handler: function (val) {
        this.getPicSrcById(val)
      },
      immediate: true,
    },
  },
  mounted () {},
  methods: {
    handleInput (arr) {
      if (arr && arr[0]) {
        this.$emit('input', arr[0])
      } else {
        this.$emit('input', '')
      }
    },
    getPicSrcById (id) {
      if (!id) {
        this.picSrc = ''
        return
      }
      requestRoot({
        url: '/filebase/api/index/downloadPic',
        method: 'GET',
        responseType: 'blob',
        params: { id },
      })
      .then((res) => {
        // let fr = new FileReader()
        // fr.onload = (e) => {
        //   this.picSrc = e.target.result
        // }
        // fr.readAsDataURL(res)
        this.picSrc = window.URL.createObjectURL(res)
      })
      .catch(() => {
        console.log('this RERRRPR---------------')
        this.picSrc = ''
      })
    },
  },
}
</script>

<style lang="scss" scoped>
  .pic-single-upload {
    display: flex;

    .avatar-uploader {
      border: 1px dashed #d9d9d9;
      cursor: pointer;
      width: 100px;
      height: 100px;
      display: flex;
      justify-content: center;
      align-items: center;

      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
      }

      .avatar {
        width: 100%;
        height: 100%;
        display: block;
      }
    }

    .view {
      border: none;
      cursor: default;
    }

    .pointer {
      cursor: pointer;
    }

    & ::v-deep {
      .hidden-uploader {
        .upload-btn {
          display: none;
        }
      }
    }
  }
</style>
