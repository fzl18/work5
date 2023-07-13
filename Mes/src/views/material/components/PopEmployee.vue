<template>
  <el-dialog
    v-if="node"
    :title="$translateTitle('物料信息设置')"
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
      label-position="right"
      label-width="80px"
    >
      <el-form-item
        class="span2"
        prop="code"
        :label="$translateTitle('物料编码')"
      >
        <span>{{ form.code }}</span>
      </el-form-item>
      <el-form-item
        class="span2"
        prop="name"
        :label="$translateTitle('物料名称')"
      >
        <span>{{ form.name }}</span>
      </el-form-item>
      <el-form-item
        class="span2"
        prop="exemptCheck"
        :label="$translateTitle('是否免检')"
        :rules="[{ required: true, message: $translateTitle($cws.w105) }]"
      >
        <el-select v-model="form.exemptCheck" class="form-i" clearable>
          <el-option
            v-for="item in [
              { label: $translateTitle('否'), value: 0 },
              { label: $translateTitle('是'), value: 1 },
            ]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        class="span2"
        prop="outExceed"
        :label="$translateTitle('是否超发')"
        :rules="[{ required: true, message: $translateTitle($cws.w105) }]"
      >
        <el-select v-model="form.outExceed" class="form-i" clearable>
          <el-option
            v-for="item in [
              { label: $translateTitle('否'), value: false },
              { label: $translateTitle('是'), value: true },
            ]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        class="span4"
        prop="remark"
        :label="$translateTitle('备注')"
      >
        <el-input v-model="form.remark" type="textarea" :rows="4" />
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
  import { updateMt } from '../api'
  export default {
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
      node: {
        type: Object,
        default: () => {},
      },
      selection: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        depCode: null,
        form: {
          name: '',
          code: '',
          exemptCheck: null,
          outExceed: null,
          remark: null,
        },
        lineOptions: [], //产线选项
      }
    },
    watch: {
      node(val) {
        this.form.name = val.name
        this.form.code = val.code
        this.form.exemptCheck = val.exemptCheck
        this.form.outExceed = val.outExceed
        this.form.remark = val.remark
      },
    },
    methods: {
      async handleOpen() {
        if (this.$refs.form) {
          this.$refs.form.resetFields()
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
                await updateMt({
                  ...this.form,
                  materialCode: this.node.code,
                  materialId: this.node.id,
                })
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
