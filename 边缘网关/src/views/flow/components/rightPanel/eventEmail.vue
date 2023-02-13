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
  import { getEmail, updateEmail } from '@/api/event'
  import { dataToFormData, formDataToPostData } from '@/utils/autoForm'
  import {
    isRequired,
    isUrl,
    isEmail,
    isEmailList,
  } from '@/utils/formValidatorHelper'
  export default {
    name: 'EventEmail',
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
          // serverAddress: {
          //   code: 'serverAddress', //前端的key,这个id必须和作为id的key保持一致,方便映射时作为指针值
          //   apiCode: 'address', //后端的key
          //   title: '服务器地址', //字段的label
          //   value: '', //字段的值
          //   type: 'text', //字段的类型,目前支持 input,number(使用input+正则验证模拟),select,checkbox,empty(表示占位符,不做任何逻辑处理)
          //   span: 24, //自定义一行的占位size,例如独占一行使用,使用规则同el-col的span属性
          //   required: true,
          //   groupId: 'group1', //属于哪个分组,
          // },
          email: {
            code: 'email', //前端的key,这个id必须和作为id的key保持一致,方便映射时作为指针值
            apiCode: 'emailName', //后端的key
            title: '主题', //字段的label
            value: '', //字段的值
            type: 'text', //字段的类型,目前支持 input,number(使用input+正则验证模拟),select,checkbox,empty(表示占位符,不做任何逻辑处理)
            span: 24, //自定义一行的占位size,例如独占一行使用,使用规则同el-col的span属性
            required: true,
            groupId: 'group1', //属于哪个分组,
          },
          // password: {
          //   code: 'password', //前端的key,这个id必须和作为id的key保持一致,方便映射时作为指针值
          //   apiCode: 'password', //后端的key
          //   title: '邮箱密码', //字段的label
          //   value: '', //字段的值
          //   type: 'text', //字段的类型,目前支持 input,number(使用input+正则验证模拟),select,checkbox,empty(表示占位符,不做任何逻辑处理)
          //   span: 24, //自定义一行的占位size,例如独占一行使用,使用规则同el-col的span属性
          //   required: true,
          //   groupId: 'group1', //属于哪个分组,
          // },
          addressee: {
            code: 'addressee', //前端的key,这个id必须和作为id的key保持一致,方便映射时作为指针值
            apiCode: 'addressee', //后端的key
            title: '收件人', //字段的label
            placeholder: '多个收件人以分号隔开',
            value: '', //字段的值
            type: 'text', //字段的类型,目前支持 input,number(使用input+正则验证模拟),select,checkbox,empty(表示占位符,不做任何逻辑处理)
            span: 24, //自定义一行的占位size,例如独占一行使用,使用规则同el-col的span属性
            rules: [isEmailList()],
            required: true,
            groupId: 'group1', //属于哪个分组,
          },
          cc: {
            code: 'cc', //前端的key,这个id必须和作为id的key保持一致,方便映射时作为指针值
            apiCode: 'cc', //后端的key
            title: '抄送人', //字段的label
            placeholder: '多个抄送人以分号隔开',
            value: '', //字段的值
            type: 'text', //字段的类型,目前支持 input,number(使用input+正则验证模拟),select,checkbox,empty(表示占位符,不做任何逻辑处理)
            span: 24, //自定义一行的占位size,例如独占一行使用,使用规则同el-col的span属性
            rules: [isEmailList()],
            groupId: 'group1', //属于哪个分组,
          },
          content: {
            code: 'content', //前端的key,这个id必须和作为id的key保持一致,方便映射时作为指针值
            apiCode: 'emailInfo', //后端的key
            title: '邮件内容', //字段的label
            value: '', //字段的值
            type: 'textarea', //字段的类型,目前支持 input,number(使用input+正则验证模拟),select,checkbox,empty(表示占位符,不做任何逻辑处理)
            rows: 8,
            span: 24, //自定义一行的占位size,例如独占一行使用,使用规则同el-col的span属性
            required: true,
            groupId: 'group1', //属于哪个分组,
          },
        },
        tabIndex: 0,
      }
    },

    async created() {
      this.getData()
    },
    methods: {
      async getData() {
        this.$emit('loading', true)
        const { data } = await getEmail(this.currentNode.id)
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

            await updateEmail(postData)
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
