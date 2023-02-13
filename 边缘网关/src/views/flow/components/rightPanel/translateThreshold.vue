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
  import { getThreshold, updateThreshold } from '@/api/translate'
  import { dataToFormData, formDataToPostData } from '@/utils/autoForm'

  export default {
    name: 'TranslateThreshold',
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
          rangeMin: {
            code: 'rangeMin', //前端的key,这个id必须和作为id的key保持一致,方便映射时作为指针值
            apiCode: 'thresholdLowerLimit', //后端的key
            title: '报警下限', //字段的label
            value: '', //字段的值
            type: 'text', //字段的类型,目前支持 input,number(使用input+正则验证模拟),select,checkbox,empty(表示占位符,不做任何逻辑处理)
            required: true,
            span: 24, //自定义一行的占位size,例如独占一行使用,使用规则同el-col的span属性
            groupId: 'group1', //属于哪个分组,
          },
          rangeMax: {
            code: 'rangeMax', //前端的key,这个id必须和作为id的key保持一致,方便映射时作为指针值
            apiCode: 'thresholdTopLimit', //后端的key
            title: '报警上限', //字段的label
            value: '', //字段的值
            type: 'text', //字段的类型,目前支持 input,number(使用input+正则验证模拟),select,checkbox,empty(表示占位符,不做任何逻辑处理)
            required: true,
            span: 24, //自定义一行的占位size,例如独占一行使用,使用规则同el-col的span属性
            groupId: 'group1', //属于哪个分组,
          },
        },
      }
    },

    created() {
      // console.log('create', this.currentNode)
      this.getData()
    },
    methods: {
      async getData() {
        this.$emit('loading', true)
        // todo 4
        const { data } = await getThreshold(this.currentNode.id)
        this.id = data.id
        this.formData.nodeName.value =
          data.name || this.currentNode.attrs.text.text

        this.formData = dataToFormData(data, this.formData)

        this.$emit('loading', false)
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

            updateThreshold(postData)
              .then(() => {
                this.$message.success('更新成功!')
                this.$emit('updateNodeName', {
                  node: this.currentNode,
                  name: this.formData.nodeName.value,
                })
                this.$emit('loading', false)
                this.$emit('success')
                this.$emit('close')
              })
              .catch(() => {
                this.$emit('loading', false)
              })
          }
        } catch (error) {
          console.log(error)
        }

        // console.log('submit', this.formData)
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

    .remix-icon {
      margin-left: 10px;
      color: #006fae;
      font-size: 24px;
    }
  }
</style>
