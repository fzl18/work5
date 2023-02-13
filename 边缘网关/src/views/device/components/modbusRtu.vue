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
  import { isFloatNumber } from '@/utils/formValidatorHelper'

  export default {
    name: 'ModbusRtu',
    inject: {
      orginData: {
        from: 'orginData',
      },
    },
    data() {
      return {
        formHeader: {
          group1: {
            title: '通讯设置',
          },
          group2: {
            title: '顺序设置',
          },
          group3: {
            title: '重试设置',
          },
          group4: {
            title: '时间设置',
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
          port: {
            code: 'port',
            apiCode: 'port',
            title: '通讯端口',
            value: '',
            type: 'text',
            required: true,

            groupId: 'group1',
          },
          bps: {
            code: 'bps',
            apiCode: 'bps',
            title: '波特率',
            value: '',
            type: 'select',
            required: true,
            parseValueTo: 'number',
            groupId: 'group1',
          },
          dataBit: {
            code: 'dataBit',
            apiCode: 'dataBit',
            title: '数据位',
            value: '',
            type: 'select',
            required: true,
            parseValueTo: 'number',
            groupId: 'group1',
          },
          stopBit: {
            code: 'stopBit',
            apiCode: 'stpBit',
            title: '停止位',
            value: '',
            parseValueTo: 'number',
            type: 'select',
            required: true,
            groupId: 'group1',
          },
          checkBit: {
            code: 'checkBit',
            apiCode: 'checkBit',
            title: '校验位',
            value: '',
            type: 'select',
            required: true,
            groupId: 'group1',
          },
          fromAddress: {
            code: 'fromAddress',
            apiCode: 'slaveAddress',
            title: '从站地址',
            value: '',
            type: 'number',
            required: true,
            groupId: 'group1',
          },

          deviceType: {
            code: 'deviceType',
            apiCode: 'deviceType',
            title: '设备类型',
            value: '',
            type: 'text', //占位符
            required: true,
            rules: [],
            groupId: 'group1',
          },

          bitSort: {
            code: 'bitSort',
            apiCode: 'endian',
            title: '字节序',
            value: '',
            type: 'select',
            required: true,
            options: [],
            rules: [],
            groupId: 'group2',
          },
          chatSort: {
            code: 'chatSort',
            apiCode: 'wordOrder',
            title: '字序',
            value: '',
            type: 'select',
            options: [],
            required: true,
            rules: [],
            groupId: 'group2',
          },
          isRetry: {
            code: 'isRetry',
            apiCode: 'isRetry',
            title: '是否重试',
            value: null,
            type: 'checkbox',

            rules: [],
            groupId: 'group3',
          },
          isEmptyRetry: {
            code: 'isEmptyRetry',
            apiCode: 'isEmptyRetry',
            title: '为空重试',
            value: null,
            type: 'checkbox',

            rules: [],
            groupId: 'group3',
          },
          isInvalidRetry: {
            code: 'isInvalidRetry',
            apiCode: 'invalidRetry',
            title: '无效重试',
            value: null,
            type: 'checkbox',

            rules: [],
            groupId: 'group3',
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
            groupId: 'group4',
          },
          connectPendingTime: {
            code: 'connectPendingTime',
            apiCode: 'interTryTime',
            title: '连接尝试时间（ms）',
            placeholder: '请输入时间',
            value: '',
            type: 'number',
            required: true,
            rules: [],
            groupId: 'group4',
          },
          invalidPendingTime: {
            code: 'invalidPendingTime',
            apiCode: 'failTryTime',
            title: '尝试失败等待时间（ms）',
            placeholder: '请输入时间',
            value: '',
            type: 'number',
            required: true,
            rules: [],
            groupId: 'group4',
          },
          connectPendingLimit: {
            code: 'connectPendingLimit',
            apiCode: 'interTryCount',
            title: '连接尝试次数',
            placeholder: '请输入次数',
            value: '',
            type: 'number',
            required: true,
            rules: [],
            groupId: 'group4',
          },
          timeout: {
            code: 'timeout',
            apiCode: 'timeout',
            title: '超时（s）',
            placeholder: '请输入超时时间',
            value: '',
            type: 'float',
            required: true,
            groupId: 'group4',
          },
          // 主动连通测试已经取消,点最终完成按钮通过接口校验连通性
          // connectTest: {
          //   code: 'connectTest',
          //   title: '数据测试连通',
          //   value: '',
          //   sort: true,
          //   required: true,
          //   groupId: 'group4',
          //   span: 8,
          // },
        },
        timer: null,
        loading: true,
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
            this.$store.dispatch('devicesInfo/updateDetailInfo', newVal)
          }, 200)
        },
      },
    },
    async created() {
      const bitSorts = await getTypes(TypeName.BYTECOUNT)
      const chatSorts = await getTypes(TypeName.BYTESORT)
      const bpsTypes = await getTypes(TypeName.BPSTYPE)
      const byteSizeTypes = await getTypes(TypeName.BYTESIZE)
      const stopTypes = await getTypes(TypeName.STOPBITS)
      const checkTypes = await getTypes(TypeName.CHECKTYPE)
      this.$set(this.formData.bitSort, 'options', bitSorts)
      this.$set(this.formData.chatSort, 'options', chatSorts)
      this.$set(this.formData.bps, 'options', bpsTypes)
      this.$set(this.formData.dataBit, 'options', byteSizeTypes)
      this.$set(this.formData.stopBit, 'options', stopTypes)
      this.$set(this.formData.checkBit, 'options', checkTypes)

      this.getData()
    },
    methods: {
      getData() {
        this.loading = false
        const formData = this.detailInfo
        console.log('getData', this.orginData, this.detailInfo)
        if (formData) {
          this.formData = _cloneDeep(formData)
        } else if (this.orginData) {
          const { sourceData } = this.orginData
          if (!sourceData) return
          this.formData = dataToFormData(sourceData, this.formData)

          this.$forceUpdate()
        }
      },
      submit() {
        return this.$refs['autoForm'].submit().then(() => {
          return this.formData
        })
      },
    },
  }
</script>
