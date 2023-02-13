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

  import { getTopicList } from '@/api/topic'

  export default {
    name: 'Mqtt',
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
        formData: {
          theme: {
            code: 'theme',
            apiCode: 'topicId',
            title: '主题',
            value: '',
            type: 'select',
            options: [],
            required: true,
          },
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
      const { data } = await getTopicList()
      this.$set(
        this.formData.theme,
        'options',
        data.map((t) => {
          return {
            label: t.topicUrl,
            value: t.id,
            ...t,
          }
        })
      )
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

          for (let key in this.formData) {
            this.formData[key].value = sourceData[this.formData[key].apiCode]
          }
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
