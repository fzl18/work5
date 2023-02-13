<template>
  <div class="right-panel-body">
    <auto-form
      ref="autoForm"
      v-model="formData"
      :form-header="formHeader"
      :show-footer="false"
      :readonly="readonly"
    ></auto-form>

    <div class="tabs">
      <div
        class="tab-item"
        :class="{ active: tabIndex === 0 }"
        @click="tabIndex = 0"
      >
        协议配置
      </div>
      <!-- <div class="tab-item" @click="tabIndex = 1">字段映射</div> -->
    </div>

    <auto-form
      v-show="tabIndex === 0"
      ref="subForm"
      v-model="subFormData"
      :form-header="subFormHeader"
      :show-footer="false"
      :readonly="readonly"
    ></auto-form>
  </div>
</template>
<script>
  import getTypes, { TypeName } from '@/utils/getTypes'
  import { isRequired, isUrl } from '@/utils/formValidatorHelper'
  import { getVideo, updateVideo } from '@/api/output'
  import { dataToFormData, formDataToPostData } from '@/utils/autoForm'
  export default {
    name: 'OutputVideoSteam',
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
          group2: {
            title: '',
            hidden: true,
          },
        },

        formData: {
          nodeName: {
            code: 'nodeName', //前端的key,这个id必须和作为id的key保持一致,方便映射时作为指针值
            apiCode: 'nodeName', //后端的key
            title: '组件名称', //字段的label
            value: '', //字段的值
            type: 'text', //字段的类型,目前支持 input,number(使用input+正则验证模拟),select,checkbox,empty(表示占位符,不做任何逻辑处理)
            span: 24, //自定义一行的占位size,例如独占一行使用,使用规则同el-col的span属性
            groupId: 'group1', //属于哪个分组,
          },
        },
        subFormHeader: {
          group1: {
            title: '',
          },
        },
        subFormData: {
          // uploadToBitplat: {
          //   code: 'uploadToBitplat',
          //   apiCode: 'isBitplat',
          //   title: '',
          //   label: '上传至BitPlat',
          //   value: '',
          //   type: 'checkbox',
          //   span: 24,
          //   groupId: 'group1',
          // },
          url: {
            code: 'url',
            apiCode: 'url',
            title: 'Url',
            value: '',
            type: 'text',
            rules: [isRequired()],
            span: 24,
            required: true,
            groupId: 'group1',
          },
          // deviceId: {
          //   code: 'deviceId',
          //   apiCode: 'deviceId',
          //   title: '设备id',
          //   value: '',
          //   type: 'text',
          //   span: 24,
          //   required: true,
          //   groupId: 'group1',
          // },
        },
        tabIndex: 0,
        isRequired: isRequired(),
      }
    },

    async created() {
      // console.log('create', this.currentNode)
      this.getData()
    },
    methods: {
      async getData() {
        this.$emit('loading', true)
        const { data } = await getVideo(this.currentNode.id)
        this.id = data.id
        this.formData.nodeName.value =
          data.name || this.currentNode.attrs.text.text

        this.subFormData = dataToFormData(data, this.subFormData)

        this.$nextTick(() => {
          this.$emit('loading', false)
        })
      },
      async submit() {
        if (this.loading) {
          return false
        }
        let valid, subFormValid
        try {
          valid = await this.$refs['autoForm'].save()
          subFormValid = await this.$refs['subForm'].save()

          // pointFormValid = await this.$refs['subForm'].save()
          // console.log('subFormValid', subFormValid)
          if (valid && subFormValid) {
            const postData = {
              id: this.id,
              name: this.formData.nodeName.value,
              flowId: this.currentNode.id,
              ...formDataToPostData(this.subFormData),
            }

            await updateVideo(postData)
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

    .remix-icon {
      margin-left: 10px;
      color: #006fae;
      font-size: 24px;
    }

    .tabs {
      height: 50px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      border-bottom: 1px solid #dbdbdb;
      margin-bottom: 20px;
      .tab-item {
        font-size: 14px;
        color: #818182;
        cursor: pointer;
        &.active {
          color: #006fae;
        }
        & + .tab-item {
          margin-left: 38px;
        }
      }
    }
    .headers-item + .headers-item {
      margin-top: 10px;
    }
  }
</style>
