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
        <el-button type="primary" size="mini" @click="submit">完成</el-button>

        <el-button size="mini" type="info" @click="$emit('cancel')">
          取消
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import _cloneDeep from 'lodash/cloneDeep'
  import { mapGetters } from 'vuex'
  import getTypes, { TypeName } from '@/utils/getTypes'
  import { dataToFormData } from '@/utils/autoForm'
  export default {
    name: 'RtspRtmp',
    inject: {
      orginData: {
        from: 'orginData',
      },
    },
    data() {
      return {
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
        formHeader: {
          group1: {
            title: '拉流参数',
          },
        },
        formData: {
          deviceType: {
            code: 'deviceType',
            apiCode: 'deviceType',
            title: '设备类型',
            value: '',
            type: 'text', //占位符
            required: true,
            groupId: 'group1',
          },
          viewType: {
            code: 'viewType',
            apiCode: 'viewType',
            title: '视频源类型',
            value: '',
            type: 'select',
            options: [],
            required: true,
          },
          url: {
            code: 'url',
            apiCode: 'url',
            title: 'Url',
            value: '',
            type: 'text',
            options: [],
            required: true,
          },
          // port: {
          //   code: 'port',
          //   apiCode: 'port',
          //   title: '端口号',
          //   value: '',
          //   type: 'number',
          //   required: true,
          //   groupId: 'group1',
          // },
          // userName: {
          //   code: 'userName',
          //   apiCode: 'userName',
          //   title: '用户名',
          //   value: '',
          //   type: 'text',
          //   required: true,
          //   groupId: 'group1',
          // },
          // password: {
          //   code: 'password',
          //   apiCode: 'password',
          //   title: '密码',
          //   value: '',
          //   type: 'password',
          //   required: true,
          //   groupId: 'group1',
          // },
          // channelNumber: {
          //   code: 'channelNumber',
          //   apiCode: 'channelNumber',
          //   title: '通道号',
          //   value: '',
          //   type: 'number',
          //   required: true,
          //   groupId: 'group1',
          // },
          // codestreamType: {
          //   code: 'codestreamType',
          //   apiCode: 'codestreamType',
          //   title: '码流类型',
          //   value: '',
          //   type: 'number',
          //   required: true,
          //   groupId: 'group1',
          // },
          // idleTimeout: {
          //   code: 'idleTimeout',
          //   apiCode: 'idleTimeout',
          //   title: '空闲超时',
          //   value: '',
          //   type: 'number',
          //   required: true,
          //   groupId: 'group1',
          // },
          // heartbeat: {
          //   code: 'heartbeat',
          //   apiCode: 'heartbeat',
          //   title: '心跳间隔',
          //   value: '',
          //   type: 'number',
          //   required: true,
          //   groupId: 'group1',
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
      const viewTypes = await getTypes(TypeName.VIEWTYPE)
      this.$set(this.formData.viewType, 'options', viewTypes)
      this.getData()
    },
    methods: {
      getData() {
        this.loading = false
        const formData = this.detailInfo
        // console.log('getData', this.orginData, this.detailInfo)
        if (formData) {
          this.formData = _cloneDeep(formData)
        } else if (this.orginData) {
          const { sourceData } = this.orginData
          // console.log(sourceData)
          if (!sourceData) return

          this.formData = dataToFormData(sourceData, this.formData)

          this.$forceUpdate()
        }
      },
      submit() {
        return this.$refs['autoForm'].submit().then(() => {
          this.$emit('submit', this.formData)
        })
      },
    },
  }
</script>
