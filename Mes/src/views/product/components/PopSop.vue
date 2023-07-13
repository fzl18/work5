<template>
  <el-dialog
    :title="$translateTitle('新增产品SOP')"
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
        :label="$translateTitle('SOP名称')"
        :rules="[{ required: true, message: $translateTitle($cws.w105) }]"
      >
        <el-input v-model="form.name" class="form-i" clearable></el-input>
      </el-form-item>
      <el-form-item
        class="span2"
        prop="version"
        :label="$translateTitle('SOP版本')"
        :rules="[{ required: true, message: $translateTitle($cws.w105) }]"
      >
        <el-input v-model="form.version" class="form-i" clearable></el-input>
      </el-form-item>
      <el-form-item
        class="span2"
        prop="sectionId"
        :label="$translateTitle('产线')"
        :rules="[{ required: true, message: $translateTitle($cws.w105) }]"
      >
        <el-select
          v-model="form.sectionId"
          class="form-i"
          clearable
          filterable
          remote
          :remote-method="remoteMethod"
        >
          <el-option
            v-for="item in lineOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
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
        :label="$translateTitle('SOP描述')"
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
  import { addSop, getLineList } from '../api'
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
          name: null, //SOP名称
          version: null, //SOP版本
          sectionId: null, //所属产线
          fileId: null, //文件id
          fileType: null, //文件类型
          fileName: null, //文件名称
          fileSrc: null, //文件路径
          remark: null, //SOP描述
        },
        file: null,
        lineOptions: [], //产线选项
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
          name: null, //SOP名称
          version: null, //SOP版本
          sectionId: null, //所属产线
          fileType: null, //文件类型
          fileName: null, //文件名称
          fileSrc: null, //文件路径
          remark: null, //SOP描述
        }
        if (this.$refs.form) {
          this.$refs.form.resetFields()
        }
        this.remoteMethod()
      },
      async remoteMethod(sectionName = '') {
        let data = await getLineList({ sectionName })
        if (Array.isArray(data)) {
          this.lineOptions = data.map((item) => {
            item.value = item.sectionId
            item.label = `${item.sectionName}(${item.sectionCode})`
            return item
          })
        } else {
          this.lineOptions = []
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
                await addSop(this.form)
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
