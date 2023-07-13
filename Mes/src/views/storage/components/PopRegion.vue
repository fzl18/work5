<template>
  <el-dialog
    :title="$translateTitle('库区信息')"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :before-close="close"
    width="400px"
    @open="handleOpen"
  >
    <el-form
      ref="form"
      class="form form-detail"
      :model="form"
      label-position="top"
    >
      <el-form-item
        class="span4"
        prop="storageCode"
        :label="$translateTitle('仓库')"
        :rules="[{ required: true, message: $translateTitle($cws.w105) }]"
      >
        <el-select
          v-model="form.storageCode"
          class="form-i"
          clearable
          filterable
          remote
          :remote-method="remoteMethod"
        >
          <el-option
            v-for="item in storageOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        class="span4"
        prop="code"
        :label="$translateTitle('库区编码')"
        :rules="[{ required: true, message: $translateTitle($cws.w105) }]"
      >
        <el-input v-model="form.code" class="form-i" clearable></el-input>
      </el-form-item>
      <el-form-item
        class="span4"
        prop="name"
        :label="$translateTitle('库区名称')"
        :rules="[{ required: true, message: $translateTitle($cws.w105) }]"
      >
        <el-input v-model="form.name" class="form-i" clearable></el-input>
      </el-form-item>
      <el-form-item
        class="span4"
        prop="remark"
        :label="$translateTitle('备注')"
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
  import { getStorageList, saveRegion } from '../api'
  export default {
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
          storageCode: null, //仓库编码
          code: null, //库区编码
          name: null, //库区名称
          remark: null, //备注
        },
        storageOptions: [], //仓库选项
      }
    },
    methods: {
      async handleOpen() {
        if (this.row) {
          //编辑
          this.form = JSON.parse(JSON.stringify(this.row))
        } else {
          //新增
          let storageCode = this.form.storageCode
          this.form = {
            storageCode: null, //仓库编码
            code: null, //库区编码
            name: null, //库区名称
            remark: null, //备注
          }
          this.form.storageCode = storageCode
          if (this.$refs.form) {
            this.$refs.form.resetFields()
          }
        }
        this.remoteMethod(this.form.storageCode)
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
                await saveRegion(this.form)
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
