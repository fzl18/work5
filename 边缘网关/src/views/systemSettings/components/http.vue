<template>
  <div class="tcp-container">
    <div class="bt-column__header">
      <div class="header">
        <div class="subtitle">主题设置</div>
      </div>
      <div class="line"></div>
    </div>

    <auto-form
      ref="autoForm"
      v-model="formData"
      :form-header="formHeader"
      :show-footer="false"
    >
      <!-- <template #connectTest="slotProps">
        <el-button type="default" style="width: 100%">
          {{ slotProps.data.title }}
        </el-button>
      </template> -->
      <template #group5>
        <el-button type="primary" size="mini" @click="editDataType">
          数据格式配置
        </el-button>
      </template>
    </auto-form>
    <el-row class="m-t-30">
      <el-col>
        <el-button type="primary" size="mini" @click="save">保存设置</el-button>
      </el-col>
    </el-row>
    <maintain-http
      v-if="maintainHttpVisible"
      v-model="maintainHttpVisible"
      @update="getData"
    ></maintain-http>
  </div>
</template>
<script>
  import _cloneDeep from 'lodash/cloneDeep'
  import getTypes, { TypeName } from '@/utils/getTypes'
  import { isIP } from '@/utils/formValidatorHelper'
  import maintainHttp from './maintainHttp'
  import { getHttpServer, saveHttpServer } from '@/api/http'
  import { formDataToPostData, dataToFormData } from '@/utils/autoForm'

  export default {
    name: 'Http',
    components: {
      maintainHttp,
    },
    provide: function () {
      return {
        sourceData: this.sourceData,
      }
    },
    data() {
      return {
        sourceData: { id: null, orginData: null },
        formHeader: {
          group1: {
            title: '通讯参数',
          },
          group2: {
            title: '结点配置',
          },
          group3: {
            title: '',
          },
          group4: {
            title: '',
          },
          group5: {
            title: '',
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
          hostname: {
            code: 'hostname',
            apiCode: 'ipAddress',
            title: 'Host Name',
            value: '',
            type: 'text',
            rules: [isIP],
            required: true,
            groupId: 'group1',
          },
          port: {
            code: 'port',
            apiCode: 'port',
            title: '端口号',
            value: '',
            type: 'number',
            required: true,
            groupId: 'group1',
          },
          url: {
            code: 'url',
            apiCode: 'methodValue',
            title: '结点',
            value: '',
            type: 'text',
            required: true,
            groupId: 'group2',
          },
          method: {
            code: 'method',
            apiCode: 'methodType',
            title: 'Method',
            value: '',
            type: 'select',
            options: [],
            required: true,
            groupId: 'group2',
          },
          authType: {
            code: 'authType',
            apiCode: 'authType',
            title: '认证方式',
            value: '',
            type: 'select',
            options: [],
            required: true,
            groupId: 'group3',
          },
          userName: {
            code: 'userName',
            apiCode: 'userName',
            title: '用户名',
            value: '',
            type: 'text',
            required: true,
            groupId: 'group4',
          },
          password: {
            code: 'password',
            apiCode: 'password',
            title: '密码',
            value: '',
            type: 'password',
            required: true,
            groupId: 'group4',
          },
        },
        maintainHttpVisible: false,
      }
    },
    watch: {
      'formData.authType.value': function (newVal) {
        if (newVal === 'anonymous') {
          this.formHeader.group4.hidden = true
          this.formData.userName.value = ''
          this.formData.password.value = ''
        } else {
          this.formHeader.group4.hidden = false
        }
      },
    },
    async created() {
      const authTypes = await getTypes(TypeName.AUTHTYPES)
      this.$set(this.formData.authType, 'options', authTypes)
      const methodTypes = await getTypes(TypeName.METHODTYPE)
      this.$set(this.formData.method, 'options', methodTypes)
      this.getData()
    },
    methods: {
      async getData() {
        const { data } = await getHttpServer()
        this.sourceData.id = data.id
        this.sourceData.orginData = { ...data }

        this.formData = dataToFormData(data, this.formData)

        this.$forceUpdate()
      },

      save() {
        this.$refs['autoForm'].submit().then(async () => {
          const postData = {
            id: this.sourceData.id,
            ...formDataToPostData(this.formData),
          }

          await saveHttpServer(postData)
          this.$message.success('更新成功！')
        })
      },
      editDataType() {
        this.$nextTick(() => {
          this.maintainHttpVisible = true
        })
      },
    },
  }
</script>
<style lang="scss" scoped>
  .topic {
    &-list {
      max-width: 600px;
    }
    &-list-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      & + & {
        margin-top: 20px;
      }
    }
    &-list-title {
      flex: 1 1 400px;
    }
  }
</style>
