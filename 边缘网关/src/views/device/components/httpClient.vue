<template>
  <div class="tcp-container">
    <div class="bt-column__header">
      <div class="header">
        <div class="subtitle">协议配置</div>
      </div>
      <div class="line"></div>
    </div>

    <auto-form
      ref="autoForm"
      v-model="formData"
      v-loading="loading"
      :form-header="formHeader"
      :show-footer="false"
    >
      <!-- <template #connectTest="slotProps">
        <el-button type="default" style="width: 100%">
          {{ slotProps.data.title }}
        </el-button>
      </template> -->
      <template #customerHeaders>
        <div class="headers-list">
          <div
            v-for="(item, index) in formData.customerHeaders.value"
            :key="index"
            class="headers-item"
          >
            <div class="headers-item-left">
              <div class="headers-item-title">字段名</div>
              <div class="headers-item-content">
                <el-form-item
                  :rules="[isRequired, isKeyName]"
                  :prop="`groupHeaders.children.customerHeaders.value.${index}.title`"
                >
                  <el-input v-model="item.title"></el-input>
                </el-form-item>
              </div>
            </div>
            <div class="headers-item-middle">：</div>
            <div class="headers-item-right">
              <div class="headers-item-title">
                字段值

                <i
                  v-if="index === formData.customerHeaders.value.length - 1"
                  class="icon-button ri-add-box-fill"
                  @click="addHeaders"
                ></i>
                <i
                  v-else
                  class="icon-button ri-checkbox-indeterminate-fill"
                  @click="removeHeaders(index)"
                ></i>
              </div>
              <div class="headers-item-content">
                <el-form-item required>
                  <el-input v-model="item.value"></el-input>
                </el-form-item>
              </div>
            </div>
          </div>
        </div>
      </template>
    </auto-form>

    <el-row class="m-t-30">
      <el-col>
        <el-button type="default" size="mini" @click="$emit('goPrevStep')">
          上一步
        </el-button>
        <el-button type="primary" size="mini" @click="$emit('goNextStep')">
          下一步
        </el-button>

        <el-button size="mini" type="info" @click="$emit('cancel')">
          取消
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import _cloneDeep from 'lodash/cloneDeep'
  import getTypes, { TypeName } from '@/utils/getTypes'
  import { mapGetters } from 'vuex'
  import { dataToFormData } from '@/utils/autoForm'
  import {
    isFloatNumber,
    isKeyName,
    isRequired,
  } from '@/utils/formValidatorHelper'

  export default {
    name: 'HttpClient',
    inject: {
      orginData: {
        from: 'orginData',
      },
    },
    data() {
      return {
        formHeader: {
          group1: {
            title: '接口设置',
          },
          groupsub1: {
            title: '',
          },
          groupsub2: {
            title: '',
          },
          group2: {
            title: '用户认证',
          },
          group3: {
            title: '',
          },
          groupHeaders: {
            title: 'Http Headers',
          },
        },
        /**
         * formData的基本结构
         * [key]:{ //key作为id使用
         *  code: 'remoteIP',//前端的key,这个id必须和作为id的key保持一致,方便映射时作为指针值
         *  apiCode:'remoteIP', //后端的key
            title: '远程地址',//字段的label
            value: '', //字段的值
            type: 'text', //字段的类型,目前支持 input,number(使用input+正则验证模拟),select,checkbox,empty(表示占位符,不做任何逻辑处理)
            rules: [],//el-form的自定义验证rules规则
            options:[],下拉单的options
            sort:true//使用自定义slot代替内容
             span: 24,//自定义一行的占位size,例如独占一行使用,使用规则同el-col的span属性
             groupId:''属于哪个分组,
         * }
         */
        formData: {
          host: {
            code: 'host',
            apiCode: 'ipAddress',
            title: 'Host',
            value: '',
            type: 'text',
            required: true,
            groupId: 'group1',
          },
          ssl: {
            code: 'ssl',
            apiCode: 'isSsl',
            title: 'SSL认证',
            value: '',
            type: 'checkbox',
            groupId: 'group1',
          },
          deviceValue: {
            code: 'deviceValue',
            apiCode: 'deviceValue',
            title: '设备名称的Key值',
            value: '',
            type: 'text', //占位符
            required: true,
            rules: [isKeyName()],
            groupId: 'group1',
          },
          deviceType: {
            code: 'deviceType',
            apiCode: 'deviceType',
            title: '设备类型的Key值',
            value: '',
            type: 'text', //占位符
            required: true,
            rules: [isKeyName()],
            groupId: 'group1',
          },
          endpoint: {
            code: 'endpoint',
            apiCode: 'endpoint',
            title: 'Endpoint',
            value: '',
            type: 'text',
            required: true,
            groupId: 'groupsub1',
          },
          enableRedirect: {
            code: 'enableRedirect',
            apiCode: 'isRedirect',
            title: '允许重定向',
            value: '',
            type: 'checkbox',
            groupId: 'groupsub1',
          },
          methods: {
            code: 'methods',
            apiCode: 'method',
            title: 'Method',
            value: '',
            type: 'select',
            options: [],
            required: true,
            groupId: 'groupsub1',
          },
          loopTime: {
            code: 'loopTime',
            apiCode: 'pollTime',
            title: '轮询设置（ms）',
            placeholder: '请输入时间',
            value: '',
            type: 'number',
            required: true,
            rules: [{ type: 'number', min: 1000, message: '最小值1000' }],
            groupId: 'groupsub2',
          },

          timeout: {
            code: 'timeout',
            apiCode: 'timeout',
            title: '超时（s）',
            placeholder: '请输入超时时间',
            value: '',
            type: 'float',
            required: true,
            groupId: 'groupsub2',
          },

          authType: {
            code: 'authType',
            apiCode: 'authType',
            title: '认证方式',
            value: '',
            type: 'select',
            options: [],
            required: true,
            groupId: 'group2',
          },
          userName: {
            code: 'userName',
            apiCode: 'userName',
            title: '用户名',
            value: '',
            type: 'text',
            required: true,
            groupId: 'group3',
          },
          password: {
            code: 'password',
            apiCode: 'password',
            title: '密码',
            value: '',
            type: 'password',
            required: true,
            groupId: 'group3',
          },
          customerHeaders: {
            code: 'customerHeaders',
            apiCode: 'httpHeader',
            type: 'custom',
            value: [{ title: '', value: '' }],
            valueFrom: (val) => {
              if (val && val !== '') {
                const _val = JSON.parse(val)
                if (
                  _val &&
                  Object.prototype.toString.call(_val) === '[object Object]'
                ) {
                  const arr = []
                  for (let key in _val) {
                    arr.push({ title: key, value: _val[key] })
                  }
                  return arr
                } else {
                  return [{ title: '', value: '' }]
                }
              } else {
                return [{ title: '', value: '' }]
              }
            },
            valueTo: (val) => {
              if (val && val.length) {
                const data = {}
                val.forEach((item) => {
                  data[item.title] = item.value
                })
                return JSON.stringify(data)
              } else return null
            },
            groupId: 'groupHeaders',
            span: 24,
          },
        },
        timer: null,
        loading: true,
        isKeyName: isKeyName(),
        isRequired: isRequired(),
      }
    },
    computed: {
      ...mapGetters('devicesInfo', ['detailInfo']),
    },
    watch: {
      formData: {
        deep: true,
        handler: function (newVal) {
          if (this.timer) {
            clearTimeout(this.timer)
            this.timer = null
          }
          this.timer = setTimeout(() => {
            if (this.loading) {
              return false
            }
            this.$store.dispatch('devicesInfo/updateDetailInfo', { ...newVal })
          }, 200)
        },
      },
      'formData.authType.value': function (newVal) {
        if (newVal === 'anonymous') {
          this.formHeader.group3.hidden = true
          this.formData.userName.value = ''
          this.formData.password.value = ''
        } else {
          this.formHeader.group3.hidden = false
        }
      },
    },
    async created() {
      const authTypes = await getTypes(TypeName.AUTHTYPES)
      this.$set(this.formData.authType, 'options', authTypes)
      const methodTypes = await getTypes(TypeName.METHODTYPE)
      // console.log(this.formData.methods, methodTypes)
      this.$set(this.formData.methods, 'options', methodTypes)

      this.getData()
    },
    methods: {
      addHeaders() {
        this.$set(
          this.formData.customerHeaders,
          'value',
          this.formData.customerHeaders.value.concat({
            title: '',
            value: '',
          })
        )
      },
      removeHeaders(index) {
        if (this.formData.customerHeaders.value.length <= 1) {
          return
        }
        this.formData.customerHeaders.value.splice(index, 1)
      },
      getData() {
        this.loading = false
        const formData = this.detailInfo

        if (formData) {
          for (let key in this.formData) {
            console.log(key, this.formData[key].value, formData[key].value)
            this.formData[key].value = formData[key].value
          }

          // this.formData = _cloneDeep(formData)
        } else if (this.orginData) {
          const { sourceData } = this.orginData
          if (!sourceData) return
          this.formData = dataToFormData(sourceData, this.formData)
        }
      },
      async submit() {
        // let customFormFlag = await this.$refs['customForm'].validate()
        let autoFormFlag = await this.$refs['autoForm'].submit()
        if (autoFormFlag) {
          return this.formData
        }
      },
    },
  }
</script>
<style lang="scss" scoped>
  .headers {
    &-list {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
    }
    &-item {
      flex: 0 0 22.5%;
      width: 22.5%;
      margin-right: 2.5%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 30px 0;
      &:nth-child(4n + 4) {
        margin-right: 0;
      }
    }

    &-item-left {
      width: calc(50% - 16px);
      flex: 1 1 calc(50% - 16px);
    }
    &-item-middle {
      width: 20px;
      margin: 32px 6px 0;
      text-align: center;
    }
    &-item-right {
      width: calc(50% - 16px);
      flex: 1 1 calc(50% - 16px);
    }
    &-item-title {
      height: 28px;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    &-item-content {
      & .el-form-item {
        margin-bottom: 0;
      }
    }
  }
</style>
