<template>
  <el-dialog
    :title="$translateTitle('生产节拍信息')"
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
        prop="materialId"
        :label="$translateTitle('产品')"
        :rules="[{ required: true, message: $translateTitle($cws.w105) }]"
      >
        <el-select
          v-model="form.materialId"
          class="form-i"
          clearable
          filterable
          remote
          :remote-method="remoteMethod1"
        >
          <el-option
            v-for="item in productOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        class="span4"
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
          :remote-method="remoteMethod2"
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
        class="span4"
        prop="standardTime"
        :label="$translateTitle('标准工时(M)')"
        :rules="[{ required: true, message: $translateTitle($cws.w105) }]"
      >
        <el-input-number
          v-model="form.standardTime"
          class="form-i"
          :controls="false"
          :precision="2"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item
        class="span4"
        prop="factorTime"
        :label="$translateTitle('连板系数(M)')"
        :rules="[{ required: true, message: $translateTitle($cws.w105) }]"
      >
        <el-input-number
          v-model="form.factorTime"
          class="form-i"
          :controls="false"
          :precision="2"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item
        class="span4"
        prop="loadTime"
        :label="$translateTitle('上料时间(M)')"
        :rules="[{ required: true, message: $translateTitle($cws.w105) }]"
      >
        <el-input-number
          v-model="form.loadTime"
          class="form-i"
          :controls="false"
          :precision="2"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item
        class="span4"
        prop="preTime"
        :label="$translateTitle('前置时间(M)')"
        :rules="[{ required: true, message: $translateTitle($cws.w105) }]"
      >
        <el-input-number
          v-model="form.preTime"
          class="form-i"
          :controls="false"
          :precision="2"
          :min="0"
        ></el-input-number>
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
  import {
    getProductList,
    getLineList,
    getRhythmById,
    addRhythm,
    editRhythm,
  } from '../api'
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
          materialId: null, //产品id
          sectionId: null, //产线id
          standardTime: null, //标准工时(M)
          factorTime: null, //连板系数(M)
          loadTime: null, //上料时间(M)
          preTime: null, //前置时间(M)
        },
        productOptions: [], //产品选项
        lineOptions: [], //产线选项
      }
    },
    methods: {
      async handleOpen() {
        if (this.row) {
          //编辑
          let data = await getRhythmById({
            id: this.row.id,
            enrichMaterial: true,
            enrichSection: true,
          })
          this.form = data
          this.remoteMethod1('', this.form.materialId)
        } else {
          //新增
          this.form = {
            materialId: null, //产品id
            sectionId: null, //产线id
            standardTime: null, //标准工时(M)
            factorTime: null, //连板系数(M)
            loadTime: null, //上料时间(M)
            preTime: null, //前置时间(M)
          }
          if (this.$refs.form) {
            this.$refs.form.resetFields()
          }
          this.remoteMethod1()
        }
        this.remoteMethod2('', this.form.sectionId)
      },
      async remoteMethod1(materialName = '', materialId = null) {
        let data = await getProductList({
          materialName,
          materialId,
          filterProduct: true,
        })
        if (data && Array.isArray(data.objList)) {
          this.productOptions = data.objList.map((item) => {
            item.value = item.id
            item.label = `${item.name}(${item.code})`
            return item
          })
        } else {
          this.productOptions = []
        }
      },
      async remoteMethod2(sectionName = '', sectionId = '') {
        let data = await getLineList({ sectionName, sectionId })
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
                if (this.form.id) {
                  await editRhythm(this.form)
                } else {
                  await addRhythm(this.form)
                }
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
