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
  import { getIot, updateIot } from '@/api/platform'
  import { dataToFormData, formDataToPostData } from '@/utils/autoForm'
  export default {
    name: 'PlatformIot',
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
        formHeader: {
          group1: {
            title: '',
          },
          group2: {
            title: '',
          },
          point: {
            title: '',
          },
        },
        id: null,
        formData: {
          deviceName: {
            code: 'deviceName', //前端的key,这个id必须和作为id的key保持一致,方便映射时作为指针值
            apiCode: 'name', //后端的key
            title: '平台名称', //字段的label
            value: '', //字段的值
            type: 'text', //字段的类型,目前支持 input,number(使用input+正则验证模拟),select,checkbox,empty(表示占位符,不做任何逻辑处理)
            span: 24, //自定义一行的占位size,例如独占一行使用,使用规则同el-col的span属性
            required: true,
            groupId: 'group1', //属于哪个分组,
          },
          bitplatUsername: {
            code: 'bitplatUsername',
            apiCode: 'bitplatUsername',
            title: 'Bitplat用户名',
            value: '',
            type: 'text',
            span: 24,
            required: true,
            groupId: 'group2',
          },
          attributeName: {
            code: 'attributeName', //前端的key,这个id必须和作为id的key保持一致,方便映射时作为指针值
            apiCode: 'attributes', //后端的key
            title: '属性名称', //字段的label
            value: '', //字段的值
            type: 'text', //字段的类型,目前支持 input,number(使用input+正则验证模拟),select,checkbox,empty(表示占位符,不做任何逻辑处理)
            span: 24, //自定义一行的占位size,例如独占一行使用,使用规则同el-col的span属性
            required: true,
            groupId: 'group2', //属于哪个分组,
          },
          dataType: {
            code: 'dataType',
            apiCode: 'dataType',
            title: '数据类型',
            value: '',
            options: [],
            type: 'select',
            span: 24,
            required: false,
            groupId: 'group2',
          },
        },
      }
    },

    async created() {
      const dataTypes = await getTypes(TypeName.DATATYPE)
      this.$set(this.formData.dataType, 'options', dataTypes)

      this.getData()
    },
    methods: {
      async getData() {
        this.$emit('loading', true)
        const { data } = await getIot(this.currentNode.id)
        this.id = data.id
        this.formData.deviceName.value =
          data.name || this.currentNode.attrs.text.text
        this.formData = dataToFormData(data, this.formData)
        this.$emit('loading', false)
      },
      async submit() {
        if (this.loading) {
          return false
        }

        let valid
        try {
          valid = await this.$refs['autoForm'].save()

          if (valid) {
            this.$emit('loading', true)
            // console.log('submit', this.formData)
            this.$emit('updateNodeName', {
              node: this.currentNode,
              name: this.formData.deviceName.value,
            })

            const postData = {
              flowId: this.currentNode.id,
              id: this.id,
              ...formDataToPostData(this.formData),
            }
            await updateIot(postData)
              .then(() => {
                this.$message.success('更新成功!')
                this.$emit('loading', false)
                this.$emit('updateNodeName', {
                  node: this.currentNode,
                  name: this.formData.deviceName.value,
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
          // console.error(error)
        }
      },
      cancel() {
        // console.log('cancel')
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
