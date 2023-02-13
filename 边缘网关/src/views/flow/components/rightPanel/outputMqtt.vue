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
      ref="mqttForm"
      v-model="mqttFormData"
      :form-header="mqttFormHeader"
      :show-footer="false"
      :readonly="readonly"
    ></auto-form>
    <!-- <auto-form
      v-show="tabIndex === 1"
      ref="pointForm"
      v-model="pointForm"
      :show-footer="false"
    ></auto-form> -->
  </div>
</template>
<script>
  import getTypes, { TypeName } from '@/utils/getTypes'
  import { isIP } from '@/utils/validate'
  import { getMqtt, updateMqtt } from '@/api/output'
  import { dataToFormData, formDataToPostData } from '@/utils/autoForm'
  export default {
    name: 'OutputMqtt',
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
        mqttFormHeader: {
          group0: {
            title: '',
          },
          groupBitplat: {
            title: '',
            hidden: true,
          },
          group1: {
            title: '',
          },
          group2: {
            title: '',
            hidden: true,
          },
          group3: {
            title: '',
            hidden: true,
          },
          group4: {
            title: '',
            hidden: true,
          },
        },
        mqttFormData: {
          uploadToBitplat: {
            code: 'uploadToBitplat',
            apiCode: 'isBitplat',
            title: '',
            label: '上传至BitPlat',
            value: '',
            valueFrom: (value) => value == 0, //字段值的转换函数
            valueTo: (value) => (value ? 0 : 1),
            type: 'checkbox',
            span: 24,
            required: true,
            groupId: 'group0',
          },
          bitplatUsername: {
            code: 'bitplatUsername',
            apiCode: 'bitplatUsername',
            title: 'Bitplat用户名',
            value: '',
            type: 'text',
            span: 24,
            required: true,
            groupId: 'groupBitplat',
          },
          brokerAddress: {
            code: 'brokerAddress',
            apiCode: 'brokerAddress',
            title: 'Broker Address',
            value: '',
            type: 'text',
            rules: [isIP],
            span: 24,
            required: true,
            groupId: 'group1',
          },
          port: {
            code: 'port',
            apiCode: 'port',
            title: '端口号',
            value: '',
            type: 'number',
            span: 24,
            required: true,
            groupId: 'group1',
          },
          clientId: {
            code: 'clientId',
            apiCode: 'clientId',
            title: 'Client ID',
            value: '',
            type: 'text',
            span: 24,
            required: true,
            groupId: 'group1',
          },
          theme: {
            code: 'theme',
            apiCode: 'topic',
            title: '主题名称',
            value: '',
            type: 'text',
            span: 24,
            required: true,
            groupId: 'group1',
          },
          authType: {
            code: 'authType',
            apiCode: 'authType',
            title: '认证方式',
            value: '',
            type: 'select',
            options: [],
            span: 24,
            required: true,
            groupId: 'group1',
          },
          userName: {
            code: 'userName',
            apiCode: 'userName',
            title: '用户名',
            value: '',
            type: 'text',
            span: 24,
            required: true,
            groupId: 'group2',
          },
          password: {
            code: 'password',
            apiCode: 'password',
            title: '密码',
            value: '',
            type: 'password',
            span: 24,
            required: true,
            groupId: 'group2',
          },
          securityType: {
            code: 'securityType',
            apiCode: 'safeType',
            title: '安全类型',
            value: '',
            type: 'select',
            options: [],
            span: 24,
            required: true,
            groupId: 'group3',
          },
          accessToken: {
            code: 'accessToken',
            apiCode: 'accessToken',
            title: 'Accesstoken',
            value: '',
            type: 'text',
            span: 24,
            required: true,
            groupId: 'group4',
          },
          cacert: {
            code: 'cacert',
            apiCode: 'cacert',
            title: 'Cacert',
            value: '',
            type: 'text',
            span: 24,
            required: true,
            groupId: 'group4',
          },
        },
        pointForm: {},
        tabIndex: 0,
        id: null,
      }
    },
    watch: {
      'mqttFormData.authType.value': function (newVal) {
        // if (this.loading) {
        //   return
        // }
        console.log(newVal)
        if (newVal === 'anonymous') {
          this.mqttFormHeader.group2.hidden = true
          this.mqttFormHeader.group3.hidden = true
          this.mqttFormHeader.group4.hidden = true
          this.mqttFormData.userName.value = ''
          this.mqttFormData.password.value = ''
        } else {
          this.mqttFormHeader.group2.hidden = false
          this.mqttFormHeader.group3.hidden = false
          this.mqttFormHeader.group4.hidden = false
        }
        this.$forceUpdate()
      },
      'mqttFormData.securityType.value': function (newVal) {
        // if (this.loading) {
        //   return
        // }
        if (newVal === 'None') {
          this.mqttFormHeader.group4.hidden = true
          this.mqttFormData.accessToken.value = ''
          this.mqttFormData.cacert.value = ''
        } else {
          this.mqttFormHeader.group4.hidden = false
        }
      },
      'mqttFormData.uploadToBitplat.value': function (newVal) {
        if (newVal === true) {
          this.mqttFormHeader.groupBitplat.hidden = false
          this.mqttFormHeader.group1.hidden = true
          this.mqttFormHeader.group2.hidden = true
          this.mqttFormHeader.group3.hidden = true
          this.mqttFormHeader.group4.hidden = true
        } else {
          this.mqttFormHeader.groupBitplat.hidden = true
          this.mqttFormHeader.group1.hidden = false
          this.mqttFormHeader.group2.hidden = false
          this.mqttFormHeader.group3.hidden = false
          this.mqttFormHeader.group4.hidden = false
          this.mqttFormData.bitplatUsername.value = ''
        }
      },
    },
    async created() {
      this.getData()
      const authTypes = await getTypes(TypeName.AUTHTYPES)
      this.$set(this.mqttFormData.authType, 'options', authTypes)
      const safeTypes = await getTypes(TypeName.SAFETYPE)
      this.$set(this.mqttFormData.securityType, 'options', safeTypes)
      // console.log('create', this.currentNode)
    },
    methods: {
      async getData() {
        this.$emit('loading', true)
        const { data } = await getMqtt(this.currentNode.id)
        this.id = data.id
        this.formData.nodeName.value =
          data.name || this.currentNode.attrs.text.text

        this.mqttFormData = dataToFormData(data, this.mqttFormData)
        this.$nextTick(() => {
          this.$emit('loading', false)
        })
      },
      async submit() {
        if (this.loading) {
          return false
        }
        let valid, mqttFormValid
        valid = await this.$refs['autoForm'].save()
        mqttFormValid = await this.$refs['mqttForm'].save()

        try {
          // pointFormValid = await this.$refs['mqttForm'].save()
          console.log('mqttFormValid', mqttFormValid)
          if (valid && mqttFormValid) {
            this.$emit('loading', true)
            // console.log('submit', this.formData)

            const postData = {
              id: this.id,
              name: this.formData.nodeName.value,
              flowId: this.currentNode.id,
              ...formDataToPostData(this.mqttFormData),
            }

            await updateMqtt(postData)
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
          console.log(error)
          this.$emit('loading', false)
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
  }
</style>
