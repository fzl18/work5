<template>
  <el-dialog
    :title="$translateTitle('供应商详情')"
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
      <el-form-item class="span2" :label="$translateTitle('供应商编码')">
        <div class="form-i form-view">
          {{ form.code ? form.code : '-' }}
        </div>
      </el-form-item>
      <el-form-item class="span2" :label="$translateTitle('供应商名称')">
        <div class="form-i form-view">
          {{ form.name ? form.name : '-' }}
        </div>
      </el-form-item>
      <el-form-item class="span2" :label="$translateTitle('供应商简称')">
        <div class="form-i form-view">
          {{ form.shortName ? form.shortName : '-' }}
        </div>
      </el-form-item>
      <el-form-item class="span2" :label="$translateTitle('国家')">
        <div class="form-i form-view">
          {{ form.country ? form.country : '-' }}
        </div>
      </el-form-item>
      <el-form-item class="span2" :label="$translateTitle('省份')">
        <div class="form-i form-view">
          {{ form.province ? form.province : '-' }}
        </div>
      </el-form-item>
      <el-form-item class="span2" :label="$translateTitle('地址')">
        <div class="form-i form-view">
          {{ form.abbr ? form.abbr : '-' }}
        </div>
      </el-form-item>
      <el-form-item class="span4" :label="$translateTitle('备注')">
        <div class="form-i form-view">
          {{ form.remark ? form.remark : '-' }}
        </div>
      </el-form-item>
      <el-form-item
        v-if="form.contacts"
        class="span4"
        :label="$translateTitle('联系人')"
      >
        <el-table :data="form.contacts" stripe fit border style="width: 100%">
          <el-table-column
            prop="code"
            :label="$translateTitle('编码')"
            min-width="100"
          />
          <el-table-column
            prop="name"
            :label="$translateTitle('名称')"
            min-width="150"
          />
          <el-table-column
            prop="contactNumber"
            :label="$translateTitle('电话')"
            min-width="150"
          />
          <el-table-column
            prop="addr"
            :label="$translateTitle('地址')"
            min-width="200"
            show-overflow-tooltip
          />
        </el-table>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
  import { getPurveyorById, getContactList } from '../api'
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
        form: {},
      }
    },
    methods: {
      async handleOpen() {
        if (this.row) {
          // 详情
          let data = await getPurveyorById({ id: this.row.id })
          let data2 = await getContactList({
            currentPage: 1,
            pageSize: 999,
            relationType: 'supplier',
            id: this.row.id,
          })
          if (data2 && Array.isArray(data2.objList)) {
            data.contacts = data2.objList
          } else {
            data.contacts = []
          }
          this.form = data
        } else {
          this.form = {}
        }
      },
      close() {
        this.$emit('update:visible', false)
      },
    },
  }
</script>

<style lang="scss" scoped></style>
