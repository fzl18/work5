<template>
  <el-dialog
    :title="$translateTitle('产品详情')"
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
      <el-form-item class="span2" :label="$translateTitle('物料编码')">
        <div class="form-i form-view">
          {{ form.code ? form.code : '-' }}
        </div>
      </el-form-item>
      <el-form-item class="span2" :label="$translateTitle('物料名称')">
        <div class="form-i form-view">
          {{ form.name ? form.name : '-' }}
        </div>
      </el-form-item>
      <el-form-item class="span2" :label="$translateTitle('规格型号')">
        <div class="form-i form-view">
          {{ form.specific ? form.specific : '-' }}
        </div>
      </el-form-item>
      <el-form-item class="span2" :label="$translateTitle('物料属性')">
        <div class="form-i form-view">
          {{ form.propertyName ? form.propertyName : '-' }}
        </div>
      </el-form-item>
      <el-form-item class="span2" :label="$translateTitle('库存单位编码')">
        <div class="form-i form-view">
          {{ form.inventoryUnit ? form.inventoryUnit : '-' }}
        </div>
      </el-form-item>
      <el-form-item class="span2" :label="$translateTitle('辅助单位编码')">
        <div class="form-i form-view">
          {{ form.suppleUnit ? form.suppleUnit : '-' }}
        </div>
      </el-form-item>
      <el-form-item class="span2" :label="$translateTitle('启用批次')">
        <div class="form-i form-view">
          {{ form.enableBatch ? form.enableBatch : '-' }}
        </div>
      </el-form-item>
      <el-form-item class="span2" :label="$translateTitle('启用辅助')">
        <div class="form-i form-view">
          {{ form.enableSupple ? form.enableSupple : '-' }}
        </div>
      </el-form-item>
      <el-form-item class="span2" :label="$translateTitle('保质天数')">
        <div class="form-i form-view">
          {{ form.shelfLife ? form.shelfLife : '-' }}
        </div>
      </el-form-item>
      <el-form-item class="span2" :label="$translateTitle('最少库存')">
        <div class="form-i form-view">
          {{ form.minInventory ? form.minInventory : '-' }}
        </div>
      </el-form-item>
      <el-form-item class="span2" :label="$translateTitle('安全库存')">
        <div class="form-i form-view">
          {{ form.safeInventory ? form.safeInventory : '-' }}
        </div>
      </el-form-item>
      <el-form-item class="span2" :label="$translateTitle('最大库存')">
        <div class="form-i form-view">
          {{ form.maxInventory ? form.maxInventory : '-' }}
        </div>
      </el-form-item>
      <el-form-item class="span2" :label="$translateTitle('是否免检')">
        <div class="form-i form-view">
          {{ form.exemptCheck ? '是' : '否' }}
        </div>
      </el-form-item>
      <el-form-item class="span2" :label="$translateTitle('入库超产比例')">
        <div class="form-i form-view">
          {{ form.inOverProportion ? form.inOverProportion : '-' }}
        </div>
      </el-form-item>
      <el-form-item class="span2" :label="$translateTitle('是否超发')">
        <div class="form-i form-view">
          {{ form.outExceed ? '是' : '否' }}
        </div>
      </el-form-item>
      <el-form-item class="span2" :label="$translateTitle('创建人')">
        <div class="form-i form-view">
          {{ form.createBy ? form.createBy : '-' }}
        </div>
      </el-form-item>
      <el-form-item class="span2" :label="$translateTitle('创建时间')">
        <div class="form-i form-view">
          {{ form.createTime ? form.createTime : '-' }}
        </div>
      </el-form-item>
      <el-form-item class="span2" :label="$translateTitle('更新人')">
        <div class="form-i form-view">
          {{ form.updateBy ? form.updateBy : '-' }}
        </div>
      </el-form-item>
      <el-form-item class="span2" :label="$translateTitle('更新时间')">
        <div class="form-i form-view">
          {{ form.updateTime ? form.updateTime : '-' }}
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
  import { getProductById } from '../api'
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
          let data = await getProductById({
            materialName: this.row.code,
          })
          this.form = data
          // this.form = JSON.parse(JSON.stringify(this.row))
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
