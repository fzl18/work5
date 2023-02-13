<template>
  <div :class="className">
    <div v-if="isEdit">
      <el-col v-if="isfile">
        <h5>{{ translatedTitle }}</h5>
        <div class="upload-pic">
          <el-upload
            ref="upload"
            :action="actionUrl"
            list-type="picture-card"
            multiple
            :file-list="fileList2"
            :http-request="uploadfiles"
            :on-change="handleFileChange"
            :on-preview="handlePictureCardPreview"
            :on-success="handleSuccess"
            :on-remove="handleFileRemove"
          >
            <i class="el-icon-plus" />
          </el-upload>
          <el-dialog
            :title="showPicTitle"
            :close-on-click-modal="false"
            :visible.sync="dialogVisible"
          >
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </div>
      </el-col>

      <el-form-item
        v-if="!isfile"
        class="form-item"
        :label="translatedTitle"
        :prop="propItems"
      >
        <el-cascader
          v-if="isApplyOrg"
          v-model="passValue"
          style="width: 100%"
          :props="propData"
          :show-all-levels="true"
          :options="$store.state.coreCommon.allUnits"
          @change="changeApplyOrgSelect"
        />
        <!-- 级联选择器 -->
        <el-popover
          v-if="isSupplierUnit"
          v-model="isShow"
          placement="bottom-start"
          trigger="click"
        >
          <div class="choosed">
            <span>{{ currentChoose }}</span>
            <el-button
              type="primary"
              size="mini"
              :disabled="!choosed.length"
              @click="handleChoose"
            >
              确认
            </el-button>
          </div>
          <el-cascader-panel
            ref="cascaderPanel"
            v-model="choosed"
            :options="optionsData"
            style="border: none"
            @change="cascaderChange"
            @expand-change="expandChange"
          />
          <el-input
            slot="reference"
            v-model="passValue"
            suffix-icon="el-icon-circle-plus"
          />
        </el-popover>
        <!-- 普通的 -->
        <el-input
          v-if="
            isEdit &&
              !isDateTimePicker &&
              !isDatePicker &&
              !isSupplierUnit &&
              !isSelect &&
              !idReadOnly &&
              !isTextarea &&
              !isApplyOrg
          "
          v-model="passValue"
          :type="isNum"
          :placeholder="'请输入' + translatedTitle"
          v-bind="$attrs"
          @focus="openModal"
        />

        <!-- 日期选择器 -->
        <el-date-picker
          v-if="isDateTimePicker"
          v-model="passValue"
          :disabled="isDisabled"
          type="datetime"
          format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间"
        />

        <!-- 日期选择器 -->
        <el-date-picker
          v-if="isDatePicker"
          v-model="passValue"
          :disabled="isDisabled"
          type="date"
          placeholder="选择日期时间"
          @change="datepickerchange"
        />

        <!-- 下拉框 -->
        <el-select v-if="isSelect" v-model="passValue" style="width: 100%">
          <el-option
            v-for="item in optionData"
            :key="item.detailId"
            :label="item.label"
            :value="item.value"
          />
        </el-select>

        <!-- 编辑页面 -->
        <div v-if="idReadOnly">{{ passValue }}</div>

        <!-- 文本域 -->
        <el-input
          v-if="isTextarea"
          v-model="passValue"
          :rows="5"
          type="textarea"
          :placeholder="placeholder"
        />
      </el-form-item>
    </div>

    <div v-if="!isEdit">
      <div v-if="!isfile">{{ translatedTitle }}：{{ passValue }}</div>

      <div v-if="isfile">
        <el-col class="accessory" :span="24">
          <div class="accessory-label">{{ translatedTitle }}:</div>
          <div class="img-box">
            <img :src="img">
            <img :src="img">
            <img :src="img">
            <img :src="img">
            <img :src="img">
            <img :src="img">
            <img :src="img">
            <img :src="img">
            <img :src="img">
            <img :src="img">
          </div>
        </el-col>
      </div>
    </div>
  </div>
</template>
<script>
import img from './test.jpg'
import { translateTitle } from '@/utils/i18n'
import Api from './common'

export default {
  name: 'DeliveryPurposeItem',
  inheritAttrs: false,
  props: {
    //抽屉标题
    label: {
      type: String,
      default: '',
    },

    isfile: {
      type: Boolean,
      default: false,
    },
    isUploadFile: {
      type: Boolean,
      default: false,
    },
    propItems: {
      type: String,
      default: '',
    },
    value: {
      type: [String, Number, Array, Date],
      default: '',
    },
    setData: {
      type: Function,
      default: Function,
    },
    isDateTimePicker: {
      type: Boolean, // 时间选择器
    },
    isDatePicker: {
      type: Boolean, // 时间选择器
    },
    isNum: {
      type: String, // 输入框为number
      default: '',
    },
    isSupplierUnit: {
      // 级联选择器
      type: Boolean,
    },
    isSelect: {
      // 下拉框
      type: Boolean,
    },
    optionData: {
      type: Array,
      default: Array,
    },
    idReadOnly: {
      type: Boolean, // 编辑页面展示数据
    },
    isTextarea: {
      type: Boolean, // 文本域输入框
    },
    optionsData: {
      type: Array,
      default: Array,
    },
    getStatus: {
      type: Function,
      default: Function,
    },
    fileList2: {
      type: Array,
      default: Array,
    },
    sn: {
      type: String,
      default: '',
    },
    isDisabled: {
      type: Boolean,
    },
    isApplyOrg: {
      type: Boolean,
    },
    placeholder: {
      type: String,
      default: ''
    },
  },
  data () {
    return {
      propData: {
        label: 'unitName',
        value: 'id',
        children: 'children',
        emitPath: false,
        checkStrictly: true,
      },
      img: img,
      isEdit: true,
      passValue: null,
      className: [],
      translatedTitle: '',
      propItem: null,
      currentChoose: '', // 级联选择器
      isShow: false,
      choosed: [],
      actionUrl: ``,
      datas: {},
      length: 0,
      fileList: [],
      dialogImageUrl: '', // 图片预览弹框
      dialogVisible: false,
      disabled: false,
      showPicTitle: '',
      fileList3: [],
      picSn: '',
    }
  },
  computed: {},
  watch: {
    value () {
      // console.log(this.value, '===this.value==this.value')
      this.passValue = this.value
    },
    passValue () {
      this.$emit('update:value', this.passValue)
    },
    // 监听级联选择器显示事件
    isShow (val) {
      if (val) {
        console.log('调用申请部门接口函数')
      }
    },
  },
  created () {
    let boolean = this.recursionItem(this)

    if (!boolean) {
      this.isEdit = true
      this.className = ['edit-diversity-item']
    } else {
      this.isEdit = false
      this.className = ['']
    }
  },
  mounted () {
    if (this.sn) {
      this.picSn = this.sn
    } else {
      this.picSn = this.generateUUID()
    }
    // console.log(this.moneyType, 'moneyType....')
    this.passValue = this.value
    this.propItem = this.propItems
    this.translatedTitle = this.translateTitle(this.label)
  },
  methods: {
    changeApplyOrgSelect (val) {
      this.$emit('change', val)
    },
    translateTitle,
    recursionItem (instance) {
      if (instance.$parent) {
        if (instance.$parent.$options._componentTag == 'IsDetail') {
          return true
        } else {
          return this.recursionItem(instance.$parent)
        }
      } else {
        return false
      }
    },
    //随机生成sn
    generateUUID () {
      var d = new Date().getTime()
      let date = d
      if (
        window.performance &&
        typeof window.performance.now === 'function'
      ) {
        d += performance.now() //use high-precision timer if available
      }
      var uuid = 'xxxxx4xxxyxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0
        d = Math.floor(d / 16)
        return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16)
      })
      return uuid + date
    },
    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    handleFileChange () {
      //判断上传文件数量
      this.fileList = []
      this.length = document.querySelector(
        'input[type=file].el-upload__input'
      ).files.length
      if (this.length > 0) {
        Array.from(
          document.querySelector('input[type=file].el-upload__input').files
        ).forEach((file) => {
          if (this.fileList.indexOf(file.name) == -1) {
            this.fileList.push(file)
          }
        })
      }
      return false
    },
    // 文件上传
    async uploadfiles (content) {
      console.log(content)
      let that = this
      let formData = new FormData()
      if (this.fileList.length > 0) {
        this.fileList.forEach((file) => {
          // let newFile = new File([file], encodeURIComponent(file.name))
          formData.append(`files`, file) // formData.append(`file`, file);
        })
      }
      if (this.length > 0) {
        return await Api.uploadFile(formData, this.picSn).then((res) => {
          if (res.code === '200') {
            res.data.forEach((item) => {
              // this.fileList.push({
              //   name: item.fileName,
              //   url: item.serverUrl + item.filePath,
              //   id: item.id,
              // })
              item.name = item.fileName
              item.url = item.serverUrl + item.filePath
            })
            // that.fileList2 = res.data // 方便删除
            // this.$emit('sn', res.data[0].sn)
          }
        })
      }
    },
    // 文件列表移除文件时的钩子函数
    handleFileRemove (file, fileList) {
      let that = this
      let params = {
        id: file.id,
      }
      Api.deleteFile(params).then((res) => {
        if (res.code === '200') {
          this.$msg({
            type: 'success',
            message: '文件删除成功',
          })
        }
      })
      // console.log('文件列表移除文件时的钩子')
    },
    // 文件上传成功时的钩子函数
    handleSuccess (res, file, fileList) {
      console.log(fileList)
      this.processFileList(fileList)
    },
    // 自定义处理filelist
    processFileList (fileList) {
      fileList.forEach((item) => {
        if (!item.url && item.response) {
          const response = item.response
          item.url = response.url
        }
      })
    },
    // 查看已上传图片
    handlePictureCardPreview (file) {
      this.showPicTitle = file.name
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 下载已上传的图片
    handleDownload (file) {
      console.log(file)
    },
    // 级联选择器
    handleChoose () {
      this.isShow = false
      const currentChooseArr = this.currentChoose.split(' > ')
      var val = currentChooseArr[currentChooseArr.length - 1]
      this.passValue = val
      this.choosed = []
      this.currentChoose = ''
      this.$emit('setData', val)
    },
    cascaderChange (val) {
      // console.log(val, 'cascaderChange')
      this.currentChoose = ''
      this.currentChoose = val.join(' > ')
    },
    datepickerchange (val) {
      this.$emit('change', val)
    },
    expandChange (row, expandedRows) {
      console.log(row, expandedRows, 'expandChange')
      this.currentChoose = ''
      this.currentChoose = item.join(' > ')
    },
    openModal () {
      this.$emit('getStatus')
    },
  },
}
</script>
<style lang="scss">
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }

  // 级联选择器
  .choosed {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e4e7ed;
    padding: 0 0 10px 10px;

    span {
      color: cornflowerblue;
      font-weight: bold;
      margin-left: 30px;
    }
  }

  // 下拉框
  .el-form-item__content .el-select .el-select--small {
    width: 100%;
  }
</style>
