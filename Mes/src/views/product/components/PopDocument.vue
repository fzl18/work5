<template>
  <el-dialog
    :title="$translateTitle('新增产品图档')"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :before-close="close"
    width="600px"
    @open="handleOpen"
  >
    <el-form
      ref="form"
      class="form form-detail"
      :model="form"
      label-position="top"
    >
      <el-form-item class="span2" :label="$translateTitle('产品料号')">
        <div class="form-i form-view">
          {{ form.itemCode ? form.itemCode : '-' }}
        </div>
      </el-form-item>
      <el-form-item
        class="span2"
        prop="name"
        :label="$translateTitle('图档名称')"
        :rules="[{ required: true, message: $translateTitle($cws.w105) }]"
      >
        <el-input v-model="form.name" class="form-i" clearable></el-input>
      </el-form-item>
      <el-form-item
        class="span2"
        prop="version"
        :label="$translateTitle('图档版本')"
        :rules="[{ required: true, message: $translateTitle($cws.w105) }]"
      >
        <el-input v-model="form.version" class="form-i" clearable></el-input>
      </el-form-item>
      <el-form-item
        class="span2"
        prop="fileType"
        :label="$translateTitle('文件类型')"
        :rules="[{ required: true, message: $translateTitle($cws.w105) }]"
      >
        <el-select v-model="form.fileType" class="form-i" clearable>
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        class="span4"
        prop="fileName"
        :label="$translateTitle('文件（文件小于300M）')"
        :rules="[{ required: true, message: $translateTitle($cws.w105) }]"
      >
        <el-input
          v-model="form.fileName"
          clearable
          disabled
          style="width: calc(100% - 66px)"
        ></el-input>
        <UploadFile
          :file.sync="file"
          style="display: inline-block; margin-left: 6px"
        />
      </el-form-item>
      <el-form-item
        class="span4"
        prop="remark"
        :label="$translateTitle('图档描述')"
      >
        <el-input
          v-model="form.remark"
          class="form-i"
          clearable
          type="textarea"
          :rows="3"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <bt-button type="primary" @click="submitForm">
        {{ $translateTitle($cws.w008) }}
      </bt-button>
      <bt-button @click="close">
        {{ $translateTitle($cws.w009) }}
      </bt-button>
    </span>
  </el-dialog>
</template>

<script>
  import { addDocument } from '../api'
  import UploadFile from './UploadFile.vue'
  import { mapGetters } from 'vuex'
  export default {
    components: {
      UploadFile,
    },
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
      row: {
        type: Object,
      },
    },
    data() {
      return {
        form: {
          itemCode: this.$route.query.itemCode, //产品料号
          name: null, //图档名称
          version: null, //图档版本
          fileId: null, //文件id
          fileType: null, //文件类型
          fileName: null, //文件名称
          fileSrc: null, //文件路径
          remark: null, //图档描述
        },
        file: null,
      }
    },
    watch: {
      file: {
        handler: function (val) {
          this.form.fileId = val.id
          this.form.fileName = val.fileOrigName
          this.form.fileSrc = val.filePath
        },
      },
    },
    computed: {
      ...mapGetters({
        dictionary: 'coreDictionary/dictionary',
      }),
      typeOptions() {
        return this.dictionary
          .filter((item) => item.dictCategory == 'FILE_TYPE')
          .map((item) => {
            return { value: item.dictCode, label: item.dictName }
          })
      },
    },
    methods: {
      async handleOpen() {
        this.form = {
          itemCode: this.$route.query.itemCode, //产品料号
          name: null, //图档名称
          version: null, //图档版本
          fileType: null, //文件类型
          fileName: null, //文件名称
          fileSrc: null, //文件路径
          remark: null, //图档描述
        }
        if (this.$refs.form) {
          this.$refs.form.resetFields()
        }
        // this.remoteMethod(this.form.storageCode)
      },
      async remoteMethod(storageName = '') {
        let data = await getStorageList({ storageName })
        if (data && Array.isArray(data.objList)) {
          this.storageOptions = data.objList.map((item) => {
            item.value = item.code
            item.label = `${item.name}(${item.code})`
            return item
          })
        } else {
          this.storageOptions = []
        }
      },
      submitForm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.$confirm(this.$translateTitle(this.$cws.w101), {
              title: this.$translateTitle(this.$cws.w010),
              type: 'warning',
              center: true,
            })
              .then(async () => {
                await addDocument(this.form)
                this.$msg({
                  type: 'success',
                  message: this.$translateTitle(this.$cws.w103),
                })
                this.$emit('refresh')
                this.close()
              })
              .catch(() => {})
          }
        })
      },
      close() {
        this.$emit('update:visible', false)
      },
    },
  }
</script>

<style lang="scss" scoped></style>
