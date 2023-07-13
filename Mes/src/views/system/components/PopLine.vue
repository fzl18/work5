<template>
  <el-dialog
    :title="$translateTitle('部门设置')"
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
        class="span4"
        prop="depUnitName"
        :label="$translateTitle('上级部门')"
      >
        <div class="form-i form-view">
          {{ form.depUnitName ? form.depUnitName : '-' }}
        </div>
      </el-form-item>
      <el-form-item
        class="span2"
        prop="sectionCode"
        :label="$translateTitle('产线编码')"
        :rules="[{ required: true, message: $translateTitle($cws.w105) }]"
      >
        <el-input
          v-model="form.sectionCode"
          class="form-i"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item
        class="span2"
        prop="sectionName"
        :label="$translateTitle('产线名称')"
        :rules="[{ required: true, message: $translateTitle($cws.w105) }]"
      >
        <el-input
          v-model="form.sectionName"
          class="form-i"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item
        class="span2"
        prop="sectionTag"
        :label="$translateTitle('产线类型')"
        :rules="[{ required: true, message: $translateTitle($cws.w105) }]"
      >
        <el-select v-model="form.sectionTag" class="form-i" clearable>
          <el-option
            v-for="item in tagOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        class="span2"
        prop="remark"
        :label="$translateTitle('备注')"
      >
        <el-input
          v-model="form.remark"
          class="form-i"
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
  import { getLineById, saveLine } from '../api'
  import { mapGetters } from 'vuex'
  export default {
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
      node: {
        type: Object,
      },
    },
    data() {
      return {
        form: {
          depUnitCode: null, //产线工段id
          depUnionCode: null, //产线工段编码
          depUnitName: null, //产线工段名称
          depUnitPath: null, //产线工段路径
          sectionCode: null, //产线编码
          sectionName: null, //产线名称
          sectionTag: null, //产线类型
          remark: null, //备注
        },
        // tagOptions: options, //类型选项
      }
    },
    computed: {
      ...mapGetters({
        dictionary: 'coreDictionary/dictionary',
      }),
      tagOptions() {
        return this.dictionary
          .filter((item) => item.dictCategory == 'SECTION_TYPE')
          .map((item) => {
            return { value: item.dictCode, label: item.dictName }
          })
      },
    },
    // async mounted() {
    //   console.log(this.node)
    //   if (this.node && this.node.unitType == 'CX') {
    //     let line = await getLineById({id: this.node.unitCode})
    //     console.log(line)
    //   } else {
    //     this.form.depUnitCode = this.node.unitCode
    //     this.form.depUnionCode = this.node.unionCode
    //     this.form.depUnitName = this.node.unitName
    //   }
    // },
    methods: {
      async handleOpen() {
        if (this.$refs.form) {
          this.$refs.form.resetFields()
        }
        if (this.node && this.node.unitType == 'CX') {
          let line = await getLineById({ id: this.node.unitCode })
          this.form = line
          let pNode = this.node.parentNode.data
          if (line.depUnionCode == pNode.unionCode) {
            this.$set(this.form, 'depUnitCode', pNode.unitCode)
            this.$set(this.form, 'depUnionCode', pNode.unionCode)
            this.$set(this.form, 'depUnitName', pNode.unitName)
            this.$set(this.form, 'depUnitPath', pNode.unitPath)
          }
        } else {
          this.form = {
            depUnitCode: null, //产线工段id
            depUnionCode: null, //产线工段编码
            depUnitName: null, //产线工段名称
            depUnitPath: null, //产线工段路径
            sectionCode: null, //产线编码
            sectionName: null, //产线名称
            sectionTag: null, //产线类型
            remark: null, //备注
          }
          this.form.depUnitCode = this.node.unitCode
          this.form.depUnionCode = this.node.unionCode
          this.form.depUnitName = this.node.unitName
          this.form.depUnitPath = this.node.unitPath
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
                await saveLine(this.form)
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
