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

    <el-form ref="headerForm" :model="headerForm" label-position="top">
      <el-form-item label="Http Headers"></el-form-item>
      <div
        v-for="(item, index) in headerForm.headers"
        :key="index"
        class="headers-item flex-parent start"
      >
        <el-form-item
          required
          :prop="`headers.${index}.title`"
          :rules="[isRequired, isKeyName]"
          style="margin-bottom: 0"
        >
          <el-input
            v-model="item.title"
            placeholder="字段名"
            :disabled="readonly"
          ></el-input>
        </el-form-item>
        <div class="headers-item-middle m-l-5 m-r-5">：</div>
        <el-form-item
          required
          :prop="`headers.${index}.value`"
          :rules="isRequired"
          style="margin-bottom: 0"
        >
          <el-input
            v-model="item.value"
            placeholder="值"
            :disabled="readonly"
          ></el-input>
        </el-form-item>
        <template v-if="!readonly">
          <i
            v-if="index === headerForm.headers.length - 1"
            class="icon-button ri-add-box-fill m-l-5"
            @click="addHeaders"
          ></i>
          <i
            v-else
            class="icon-button ri-checkbox-indeterminate-fill m-l-5"
            @click="removeHeaders(index)"
          ></i>
        </template>
      </div>
    </el-form>
  </div>
</template>
<script>
  import getTypes, { TypeName } from '@/utils/getTypes'
  import { isIP } from '@/utils/validate'
  import {
    isRequired,
    isKeyName,
    isFloatNumber,
  } from '@/utils/formValidatorHelper'
  import { getHttp, updateHttp } from '@/api/output'
  import { dataToFormData, formDataToPostData } from '@/utils/autoForm'
  export default {
    name: 'OutputHttp',
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
          group2: {
            title: '',
            hidden: true,
          },
        },
        subFormData: {
          url: {
            code: 'url',
            apiCode: 'url',
            title: 'Url',
            value: '',
            type: 'text',
            span: 24,
            required: true,
            groupId: 'group1',
          },
          timeout: {
            code: 'timeout',
            apiCode: 'timeout',
            title: '超时时间（ms）',
            value: '',
            type: 'number',
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
            apiCode: 'username',
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
        },
        headerForm: {
          headers: [{ title: '', value: '' }],
        },
        tabIndex: 0,
        isRequired: isRequired(),
        isKeyName: isKeyName(),
      }
    },
    watch: {
      'subFormData.authType.value': function (newVal) {
        if (newVal === 'anonymous') {
          this.subFormHeader.group2.hidden = true
          this.subFormData.userName.value = ''
          this.subFormData.password.value = ''
        } else {
          this.subFormHeader.group2.hidden = false
        }
      },
    },
    async created() {
      this.getData()
      const authTypes = await getTypes(TypeName.AUTHTYPES)
      this.$set(this.subFormData.authType, 'options', authTypes)
    },
    methods: {
      addHeaders() {
        this.$set(
          this.headerForm,
          'headers',
          this.headerForm.headers.concat({
            title: '',
            value: '',
          })
        )
      },
      removeHeaders(index) {
        if (this.headerForm.headers.length <= 1) {
          return
        }
        this.headerForm.headers.splice(index, 1)
      },
      async getData() {
        this.$emit('loading', true)
        const { data } = await getHttp(this.currentNode.id)
        this.id = data.id
        this.formData.nodeName.value =
          data.name || this.currentNode.attrs.text.text

        this.subFormData = dataToFormData(data, this.subFormData)
        const headers = data.httpHeard ? JSON.parse(data.httpHeard) : null
        const headersList = []
        if (headers && Object.keys(headers).length) {
          for (let key in headers) {
            headersList.push({ title: key, value: headers[key] })
          }
          this.headerForm.headers = [...headersList]
        }
        this.$nextTick(() => {
          this.$emit('loading', false)
        })
      },
      async submit() {
        if (this.loading) {
          return false
        }
        let valid, subFormValid, headerFormValid
        try {
          valid = await this.$refs['autoForm'].save()
          subFormValid = await this.$refs['subForm'].save()
          headerFormValid = await this.$refs['headerForm'].validate()
          // pointFormValid = await this.$refs['subForm'].save()
          // console.log('subFormValid', subFormValid)
          if (valid && subFormValid && headerFormValid) {
            this.$emit('loading', true)
            // console.log('submit', this.formData)

            let headers = {}
            if (this.headerForm.headers.length) {
              this.headerForm.headers.forEach((item) => {
                headers[item.title] = item.value
              })
            } else {
              headers = null
            }

            const postData = {
              id: this.id,
              name: this.formData.nodeName.value,
              flowId: this.currentNode.id,
              ...formDataToPostData(this.subFormData),
              httpHeard: JSON.stringify(headers),
            }

            await updateHttp(postData)
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
