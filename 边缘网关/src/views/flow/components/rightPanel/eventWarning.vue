<template>
  <div class="right-panel-body">
    <auto-form
      ref="autoForm"
      v-model="formData"
      :form-header="formHeader"
      :show-footer="false"
      :readonly="readonly"
    ></auto-form>
  </div>
</template>
<script>
  import getTypes, { TypeName } from '@/utils/getTypes'
  import { isRequired, isUrl, isEmailList } from '@/utils/formValidatorHelper'
  import { getWarning, updateWarning } from '@/api/event'
  import { dataToFormData, formDataToPostData } from '@/utils/autoForm'
  export default {
    name: 'EventWarning',
    props: {
      readonly: {
        type: Boolean,
        default: false,
      },
      loading: {
        type: Boolean,
        default: false,
      },
      currentNode: {
        type: Object,
        default: () => null,
      },
    },

    data() {
      return {
        id: null,
        formHeader: {
          group1: {
            title: '',
          },
        },
        formData: {
          nodeName: {
            code: 'nodeName', //前端的key,这个id必须和作为id的key保持一致,方便映射时作为指针值
            apiCode: 'name', //后端的key
            title: '组件名称', //字段的label
            value: '', //字段的值
            type: 'text', //字段的类型,目前支持 input,number(使用input+正则验证模拟),select,checkbox,empty(表示占位符,不做任何逻辑处理)
            span: 24, //自定义一行的占位size,例如独占一行使用,使用规则同el-col的span属性
            required: true,
            groupId: 'group1', //属于哪个分组,
          },
          warningCode: {
            code: 'warningCode', //前端的key,这个id必须和作为id的key保持一致,方便映射时作为指针值
            apiCode: 'warnNo', //后端的key
            title: '报警编号', //字段的label
            value: '', //字段的值
            type: 'text', //字段的类型,目前支持 input,number(使用input+正则验证模拟),select,checkbox,empty(表示占位符,不做任何逻辑处理)
            span: 24, //自定义一行的占位size,例如独占一行使用,使用规则同el-col的span属性
            required: true,
            groupId: 'group1', //属于哪个分组,
          },
          bitplatUsername: {
            code: 'bitplatUsername', //前端的key,这个id必须和作为id的key保持一致,方便映射时作为指针值
            apiCode: 'bitplatUsername', //后端的key
            title: '用户名', //字段的label
            value: '', //字段的值
            type: 'text', //字段的类型,目前支持 input,number(使用input+正则验证模拟),select,checkbox,empty(表示占位符,不做任何逻辑处理)
            span: 24, //自定义一行的占位size,例如独占一行使用,使用规则同el-col的span属性
            required: true,
            groupId: 'group1', //属于哪个分组,
          },
          warningType: {
            code: 'warningType', //前端的key,这个id必须和作为id的key保持一致,方便映射时作为指针值
            apiCode: 'warnType', //后端的key
            title: '报警类型', //字段的label
            value: '', //字段的值
            type: 'text', //字段的类型,目前支持 input,number(使用input+正则验证模拟),select,checkbox,empty(表示占位符,不做任何逻辑处理)
            span: 24, //自定义一行的占位size,例如独占一行使用,使用规则同el-col的span属性
            required: true,
            groupId: 'group1', //属于哪个分组,
          },
          warningContent: {
            code: 'warningContent', //前端的key,这个id必须和作为id的key保持一致,方便映射时作为指针值
            apiCode: 'warnInfo', //后端的key
            title: '报警内容', //字段的label
            value: '', //字段的值
            type: 'text', //字段的类型,目前支持 input,number(使用input+正则验证模拟),select,checkbox,empty(表示占位符,不做任何逻辑处理)
            span: 24, //自定义一行的占位size,例如独占一行使用,使用规则同el-col的span属性
            required: true,
            groupId: 'group1', //属于哪个分组,
          },
          warningLevel: {
            code: 'warningLevel', //前端的key,这个id必须和作为id的key保持一致,方便映射时作为指针值
            apiCode: 'warnLevel', //后端的key
            title: '报警等级', //字段的label
            value: '', //字段的值
            valueFrom: (value) => (value ? value.toString() : ''),
            options: [],
            type: 'select', //字段的类型,目前支持 input,number(使用input+正则验证模拟),select,checkbox,empty(表示占位符,不做任何逻辑处理)
            span: 24, //自定义一行的占位size,例如独占一行使用,使用规则同el-col的span属性
            required: true,
            groupId: 'group1', //属于哪个分组,
          },
          // isActived: {
          //   code: 'isActived', //前端的key,这个id必须和作为id的key保持一致,方便映射时作为指针值
          //   apiCode: 'isHour', //后端的key
          //   title: '', //字段的label
          //   value: '', //字段的值
          //   valueFrom: (value) => value == 0, //字段值的转换函数
          //   valueTo: (value) => (value ? 0 : 1),
          //   label: '是否激活',
          //   type: 'checkbox', //字段的类型,目前支持 input,number(使用input+正则验证模拟),select,checkbox,empty(表示占位符,不做任何逻辑处理)
          //   span: 12, //自定义一行的占位size,例如独占一行使用,使用规则同el-col的span属性
          //   groupId: 'group1', //属于哪个分组,
          // },
          // isConfirm: {
          //   code: 'isConfirm', //前端的key,这个id必须和作为id的key保持一致,方便映射时作为指针值
          //   apiCode: 'isOk', //后端的key
          //   title: '', //字段的label
          //   value: '', //字段的值
          //   valueFrom: (value) => value == 0, //字段值的转换函数
          //   valueTo: (value) => (value ? 0 : 1),
          //   label: '是否确认',
          //   type: 'checkbox', //字段的类型,目前支持 input,number(使用input+正则验证模拟),select,checkbox,empty(表示占位符,不做任何逻辑处理)
          //   span: 12, //自定义一行的占位size,例如独占一行使用,使用规则同el-col的span属性
          //   groupId: 'group1', //属于哪个分组,
          // },
        },
        tabIndex: 0,
      }
    },

    async created() {
      const warningLevelTypes = await getTypes(TypeName.WARNTYPE)
      this.$set(this.formData.warningLevel, 'options', warningLevelTypes)
      this.getData()
    },
    methods: {
      async getData() {
        this.$emit('loading', true)
        const { data } = await getWarning(this.currentNode.id)
        this.id = data.id
        this.formData.nodeName.value =
          data.name || this.currentNode.attrs.text.text

        this.formData = dataToFormData(data, this.formData)

        this.$nextTick(() => {
          this.$emit('loading', false)
        })
      },
      async submit() {
        let valid
        try {
          valid = await this.$refs['autoForm'].save()

          if (valid) {
            const postData = {
              id: this.id,
              flowId: this.currentNode.id,
              ...formDataToPostData(this.formData),
            }

            await updateWarning(postData)
              .then(() => {
                this.$message.success('更新成功!')
                this.$emit('loading', false)
                this.$emit('updateNodeName', {
                  node: this.currentNode,
                  name: this.formData.nodeName.value,
                })
                this.$emit('success')
                this.$emit('close')
              })
              .catch(() => {
                this.$emit('loading', false)
              })
          }
        } catch (error) {
          this.$emit('loading', false)
          console.log(error)
        }
      },
      cancel() {
        console.log('cancel')
      },
    },
  }
</script>
<style lang="scss" scoped>
  .right-panel-body {
    padding: 20px;
    height: 100%;
    overflow-y: auto;
  }
</style>
