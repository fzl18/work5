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
      <template #group3>
        <div class="topic-list">
          <div class="topic-list-row">
            <div class="topic-list-title">主题名称</div>
            <div class="topic-list-content">
              <el-button type="text" @click="createTopic">新增主题</el-button>
            </div>
          </div>
          <div
            v-for="topic in topicList"
            :key="topic.id"
            class="topic-list-row"
          >
            <div class="topic-list-title">{{ topic.topicUrl }}</div>
            <div class="topic-item-content">
              <el-button type="primary" size="mini" @click="editTopic(topic)">
                <i class="el-icon-s-tools"></i>
              </el-button>
              <el-button type="danger" size="mini" @click="deleteTopic(topic)">
                <i class="el-icon-minus"></i>
              </el-button>
            </div>
          </div>
        </div>
      </template>
    </auto-form>
    <el-row class="m-t-30">
      <el-col>
        <el-button type="primary" size="mini" @click="save">保存设置</el-button>
      </el-col>
    </el-row>
    <maintain-topic
      v-if="maintainTopicVisible"
      v-model="maintainTopicVisible"
      :topic-id="maintainTopicId"
      @update="getTopicList"
    ></maintain-topic>
  </div>
</template>
<script>
  import _cloneDeep from 'lodash/cloneDeep'
  import getTypes, { TypeName } from '@/utils/getTypes'
  import { isIP } from '@/utils/formValidatorHelper'
  import maintainTopic from './maintainTopic.vue'
  import {
    deleteTopic,
    getMqttServer,
    getTopicListByMqttId,
    saveMqttServer,
    saveTopic,
  } from '@/api/topic'
  import { formDataToPostData, dataToFormData } from '@/utils/autoForm'

  export default {
    name: 'Mqtt',
    components: {
      maintainTopic,
    },
    provide: function () {
      return {
        mqtt: this.mqtt,
      }
    },
    data() {
      return {
        mqtt: { id: null },
        formHeader: {
          group1: {
            title: '通讯设置',
          },
          group2: {
            title: '认证方式',
          },
          group3: {
            title: '订阅主题',
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
          brokerAddress: {
            code: 'brokerAddress',
            apiCode: 'brokerAddress',
            title: 'Broker Address',
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
          clientId: {
            code: 'clientId',
            apiCode: 'clientId',
            title: 'Client ID',
            value: '',
            type: 'text',
            required: true,
            groupId: 'group1',
          },
          authType: {
            code: 'authType',
            apiCode: 'authType',
            title: '加密方式',
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
            groupId: 'group2',
          },
          password: {
            code: 'password',
            apiCode: 'password',
            title: '密码',
            value: '',
            type: 'password',
            required: true,
            groupId: 'group2',
          },
        },
        topicList: [],
        maintainTopicVisible: false,
        maintainTopicId: null,
      }
    },
    watch: {
      'formData.authType.value': function (newVal) {
        if (newVal === 'anonymous') {
          this.formData.userName.hidden = true
          this.formData.userName.value = ''
          this.formData.password.hidden = true
          this.formData.password.value = ''
        } else {
          this.formData.userName.hidden = false
          this.formData.password.hidden = false
        }
      },
    },
    async created() {
      const authTypes = await getTypes(TypeName.AUTHTYPES)
      this.$set(this.formData.authType, 'options', authTypes)

      this.getData()
    },
    methods: {
      async getData() {
        const { data } = await getMqttServer()
        this.mqtt.id = data.id

        this.formData = dataToFormData(data, this.formData)

        this.$forceUpdate()
        this.$nextTick(() => {
          this.getTopicList()
        })
      },
      async getTopicList() {
        const result = await getTopicListByMqttId(this.mqtt.id)
        this.topicList = result.data || []
      },
      save() {
        this.$refs['autoForm'].submit().then(async () => {
          const postData = {
            id: this.mqtt.id,
            ...formDataToPostData(this.formData),
          }

          await saveMqttServer(postData)
          this.$message.success('更新成功！')
        })
      },
      createTopic() {
        this.$prompt('请输入主题URL', '提示', {
          title: '提示',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPlaceholder: '请输入主题URL',
          inputPattern: /\S/,
          inputErrorMessage: '主题URL不能为空',
          center: true,
        }).then(async ({ value }) => {
          const postData = {
            mqttId: this.mqtt.id,
            topicUrl: value,
            deviceValue: '',
            deviceType: '',
          }
          const { data } = await saveTopic(postData)
          this.$message.success('创建成功！')

          this.maintainTopicId = data

          this.$nextTick(() => {
            this.maintainTopicVisible = true
            this.getTopicList()
          })
        })
      },
      editTopic(row) {
        this.maintainTopicId = row.id
        this.$nextTick(() => {
          this.maintainTopicVisible = true
        })
      },
      async deleteTopic(row) {
        const flag = await this.$confirm(
          `确定删除主题${row.topicUrl}?`,
          '警告',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true,
          }
        )
        if (flag) {
          await deleteTopic(row.id)
          this.$message.success('删除成功！')
          this.getTopicList()
        }
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
