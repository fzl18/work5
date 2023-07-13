<template>
  <el-dialog
    :title="$translateTitle('人员详情')"
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
      <el-form-item
        class="span2"
        prop="stuffName"
        :label="$translateTitle('姓名')"
      >
        <div class="form-i form-view">
          {{ form.stuffName ? form.stuffName : '-' }}
        </div>
      </el-form-item>
      <el-form-item
        class="span2"
        prop="stuffCode"
        :label="$translateTitle('工号')"
      >
        <div class="form-i form-view">
          {{ form.stuffCode ? form.stuffCode : '-' }}
        </div>
      </el-form-item>
      <el-form-item
        class="span2"
        prop="depName"
        :label="$translateTitle('部门')"
      >
        <div class="form-i form-view">
          {{ form.depName ? form.depName : '-' }}
        </div>
      </el-form-item>
      <el-form-item
        class="span2"
        prop="sectionName"
        :label="$translateTitle('产线')"
      >
        <div class="form-i form-view">
          {{ form.sectionName ? form.sectionName : '-' }}
        </div>
      </el-form-item>
      <el-form-item
        class="span2"
        prop="regMail"
        :label="$translateTitle('邮箱')"
      >
        <div class="form-i form-view">
          {{ form.regMail ? form.regMail : '-' }}
        </div>
      </el-form-item>
      <el-form-item
        class="span2"
        prop="phoneNumber"
        :label="$translateTitle('电话')"
      >
        <div class="form-i form-view">
          {{ form.phoneNumber ? form.phoneNumber : '-' }}
        </div>
      </el-form-item>
      <el-form-item
        class="span2"
        prop="station"
        :label="$translateTitle('岗位')"
      >
        <div class="form-i form-view">
          {{ form.station ? form.station : '-' }}
        </div>
      </el-form-item>
      <el-form-item
        class="span2"
        prop="creator"
        :label="$translateTitle('创建人')"
      >
        <div class="form-i form-view">
          {{ form.creator ? form.creator : '-' }}
        </div>
      </el-form-item>
      <el-form-item
        class="span2"
        prop="createDate"
        :label="$translateTitle('创建时间')"
      >
        <div class="form-i form-view">
          {{ form.createDate ? form.createDate : '-' }}
        </div>
      </el-form-item>
      <el-form-item
        class="span2"
        prop="updator"
        :label="$translateTitle('更新人')"
      >
        <div class="form-i form-view">
          {{ form.updator ? form.updator : '-' }}
        </div>
      </el-form-item>
      <el-form-item
        class="span2"
        prop="updateDate"
        :label="$translateTitle('更新时间')"
      >
        <div class="form-i form-view">
          {{ form.updateDate ? form.updateDate : '-' }}
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
  import { getUserDetail } from '../api'
  export default {
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
      employee: {
        type: Object,
      },
    },
    data() {
      return {
        form: {},
      }
    },
    methods: {
      async handleOpen() {
        if (this.employee.stuffCode) {
          this.form = await getUserDetail({ userName: this.employee.stuffCode })
        }
      },
      close() {
        this.$emit('update:visible', false)
      },
    },
  }
</script>

<style lang="scss" scoped></style>
