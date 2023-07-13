<template>
  <el-dialog
    v-if="employee"
    :title="$translateTitle('详情')"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :before-close="close"
    width="600px"
  >
    <el-form
      ref="form"
      class="form form-detail"
      :model="employee"
      label-position=""
    >
      <el-form-item
        class="span2"
        prop="code"
        :label="$translateTitle('物料编码')"
      >
        <div class="form-i form-view">
          {{ employee.code || '-' }}
        </div>
      </el-form-item>
      <el-form-item
        class="span2"
        prop="safeInventory"
        :label="$translateTitle('安全库存')"
      >
        <div class="form-i form-view">
          {{ employee.safeInventory || '-' }}
        </div>
      </el-form-item>
      <el-form-item
        class="span2"
        prop="name"
        :label="$translateTitle('物料名称')"
      >
        <div class="form-i form-view">
          {{ employee.name || '-' }}
        </div>
      </el-form-item>
      <el-form-item
        class="span2"
        prop="maxInventory"
        :label="$translateTitle('最大库存')"
      >
        <div class="form-i form-view">
          {{ employee.maxInventory || '-' }}
        </div>
      </el-form-item>
      <el-form-item
        class="span2"
        prop="specific"
        :label="$translateTitle('规格型号')"
      >
        <div class="form-i form-view">
          {{ employee.specific || '-' }}
        </div>
      </el-form-item>
      <el-form-item
        class="span2"
        prop="exemptCheck"
        :label="$translateTitle('是否免检')"
      >
        <div class="form-i form-view">
          {{ employee.exemptCheck ? $translateTitle('是') : '-' }}
        </div>
      </el-form-item>
      <el-form-item
        class="span2"
        prop="propertyLocalVal"
        :label="$translateTitle('物料属性')"
      >
        <div class="form-i form-view">
          {{ employee.propertyLocalVal || '-' }}
        </div>
      </el-form-item>
      <el-form-item
        class="span2"
        prop="inOverProportion"
        :label="$translateTitle('入库超产比例')"
      >
        <div class="form-i form-view">
          {{ employee.inOverProportion || '-' }}
        </div>
      </el-form-item>
      <el-form-item
        class="span2"
        prop="inventoryUnit"
        :label="$translateTitle('库存单位编码')"
      >
        <div class="form-i form-view">
          {{ employee.inventoryUnit || '-' }}
        </div>
      </el-form-item>
      <el-form-item
        class="span2"
        prop="outExceed"
        :label="$translateTitle('是否超发')"
      >
        <div class="form-i form-view">
          {{ employee.outExceed ? $translateTitle('是') : '-' }}
        </div>
      </el-form-item>
      <el-form-item
        class="span2"
        prop="updateDate"
        :label="$translateTitle('辅助单位编码')"
      >
        <div class="form-i form-view">
          {{ employee.updateDate || '-' }}
        </div>
      </el-form-item>
      <el-form-item
        class="span2"
        prop="createBy"
        :label="$translateTitle('创建人')"
      >
        <div class="form-i form-view">
          {{ employee.createBy || '-' }}
        </div>
      </el-form-item>
      <el-form-item
        class="span2"
        prop="enableBatch"
        :label="$translateTitle('启用批次')"
      >
        <div class="form-i form-view">
          {{ employee.enableBatch ? $translateTitle('是') : '-' }}
        </div>
      </el-form-item>
      <el-form-item
        class="span2"
        prop="createTime"
        :label="$translateTitle('创建时间')"
      >
        <div class="form-i form-view">
          {{ employee.createTime || '-' }}
        </div>
      </el-form-item>
      <el-form-item
        class="span2"
        prop="enableSupple"
        :label="$translateTitle('启用辅助')"
      >
        <div class="form-i form-view">
          {{ employee.enableSupple ? $translateTitle('是') : '-' }}
        </div>
      </el-form-item>
      <el-form-item
        class="span2"
        prop="updateBy"
        :label="$translateTitle('更新人')"
      >
        <div class="form-i form-view">
          {{ employee.updateBy || '-' }}
        </div>
      </el-form-item>
      <el-form-item
        class="span2"
        prop="shelfLife"
        :label="$translateTitle('保质天数')"
      >
        <div class="form-i form-view">
          {{ employee.shelfLife || '-' }}
        </div>
      </el-form-item>
      <el-form-item
        class="span2"
        prop="updateTime"
        :label="$translateTitle('更新时间')"
      >
        <div class="form-i form-view">
          {{ employee.updateTime || '-' }}
        </div>
      </el-form-item>
      <el-form-item
        class="span2"
        prop="minInventory"
        :label="$translateTitle('最少库存')"
      >
        <div class="form-i form-view">
          {{ employee.minInventory || '-' }}
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
        default: () => {},
      },
    },
    data() {
      return {
        form: {},
      }
    },
    methods: {
      close() {
        this.$emit('update:visible', false)
      },
    },
  }
</script>

<style lang="scss" scoped></style>
