<template>
  <el-dialog
    :title="$translateTitle('人员设置')"
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
        prop="sectionId"
        :label="$translateTitle('产线')"
        :rules="[{ required: true, message: $translateTitle($cws.w105) }]"
      >
        <el-select v-model="form.sectionId" class="form-i" clearable>
          <el-option
            v-for="item in lineOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
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
  import { getLineByDept, saveLineUser } from '../api'
  export default {
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
      node: {
        type: Object,
      },
      selection: {
        type: Array,
      },
    },
    data() {
      return {
        depCode: null,
        form: {
          sectionId: null, //产线id
        },
        lineOptions: [], //产线选项
      }
    },
    methods: {
      async handleOpen() {
        if (this.$refs.form) {
          this.$refs.form.resetFields()
        }
        if (this.node && this.node.unitType == 'CX') {
          this.depCode = this.node.parentNode.data.unionCode
        } else {
          this.depCode = this.node.unionCode
        }
        let data = await getLineByDept({ depCode: this.depCode })
        if (Array.isArray(data)) {
          this.lineOptions = data.map((item) => {
            item.label = item.sectionName
            item.value = item.sectionId
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
                let userList = this.selection.map((item) => {
                  return {
                    depUnionCode: this.depCode,
                    sectionId: this.form.sectionId,
                    stuffId: item.stuffId,
                    stuffCode: item.stuffCode,
                    stuffName: item.stuffName,
                    stuffPhone: item.phoneNumber,
                  }
                })
                await saveLineUser(userList)
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
