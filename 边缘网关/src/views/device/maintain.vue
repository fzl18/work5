<template>
  <div class="app-container">
    <bt-page :title="$route.meta.title">
      <div v-if="step < 3" class="bt-column__header">
        <div class="header">
          <div class="subtitle">基础设置</div>
        </div>
        <div class="line"></div>
      </div>
      <el-form
        v-if="step < 3"
        ref="baseForm"
        label-position="top"
        :model="baseForm"
        :rules="baseFormRules"
      >
        <el-row :gutter="100">
          <el-col :span="8">
            <el-form-item label="名称" prop="name">
              <el-input
                v-model="baseForm.name"
                placeholder="设备名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="协议" prop="agreementType">
              <el-select
                v-model="baseForm.agreementType"
                placeholder="请选择协议"
                :disabled="!!id"
              >
                <el-option
                  v-for="option in agreementTypeOptions"
                  :key="option.value"
                  :value="option.value"
                  :label="option.label"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              v-if="
                transformAgreement(baseForm.agreementType) !==
                AgreementType.RTSP_RTMP_ARG
              "
              label="断网续传"
            >
              <el-checkbox v-model="baseForm.isReupload">是否选择</el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="描述" prop="description">
              <el-input
                v-model="baseForm.description"
                type="textarea"
                :rows="4"
                placeholder="请输入需要描述的信息"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- step 2 协议配置 -->
      <component
        :is="currentAgreementComponent.type"
        v-if="step === 2 && currentAgreementComponent.stepCount > 1"
        ref="dynamicForm"
        @goPrevStep="goPrevStep"
        @goNextStep="goNextStep"
        @submit="submit"
        @cancel="cancel"
      ></component>

      <!-- step 3 采集点配置 -->
      <component
        :is="pointType"
        v-if="step === 3 && currentAgreementComponent.stepCount > 2"
        ref="pointForm"
        @submit="submit"
        @goPrevStep="goPrevStep"
        @cancel="cancel"
      ></component>

      <el-row v-if="step === 1" class="m-t-30">
        <el-col>
          <el-button
            v-if="currentAgreementComponent.stepCount > 1"
            type="default"
            size="mini"
            @click="goNextStep"
          >
            下一步
          </el-button>
          <el-button v-else type="default" size="mini" @click="submit">
            完成
          </el-button>

          <el-button size="mini" type="info" @click="cancel">取消</el-button>
        </el-col>
      </el-row>
    </bt-page>
  </div>
</template>
<script>
  import ModbusTcp from './components/modbusTcp'
  import ModbusRtu from './components/modbusRtu.vue'
  import HttpClient from './components/httpClient.vue'
  import Mqtt from './components/mqtt'
  import ModbusPoint from './components/modbusPoint.vue'
  import JsonPoint from './components/jsonPoint.vue'
  import RtspRtmp from './components/rtspRtmp.vue'
  import getTypes, { TypeName, getTypeLabelbyValue } from '@/utils/getTypes'
  import { transformAgreement, AgreementType } from '@/utils/agreementMapping'
  import {
    validateModbus,
    saveModbus,
    getModbusById,
    saveMqttDevice,
    getMqttById,
    getHttpServerById,
    saveHttpServer,
    saveRtspRtmpServer,
    getRtspRtmpById,
    getModbusRtuById,
    saveModbusRtu,
    getHttpClientById,
    saveHttpClient,
  } from '@/api/device'
  import { mapGetters } from 'vuex'
  import { formDataToPostData } from '@/utils/autoForm'
  import { isEnglishOrNumberOrSymbol } from '@/utils/formValidatorHelper'
  import { getHttpRest, saveHttpRest } from '@/api/http'
  export default {
    //注意注册时名称需要与is传值一致
    components: {
      Mqtt,
      ModbusTcp,
      ModbusPoint,
      RtspRtmp,
      ModbusRtu,
      HttpClient,
      JsonPoint,
    },
    provide: function () {
      return {
        orginData: this,
      }
    },
    beforeRouteLeave(to, from, next) {
      this.$store.dispatch('devicesInfo/clearDetailInfo')
      this.$store.dispatch('devicesInfo/clearPointInfo')
      next()
    },
    data() {
      return {
        id: null,
        baseForm: {
          name: '', //名称
          agreementType: '', //协议
          isReupload: null, //断网续传
          description: '',
        },
        sourceData: null,
        baseFormRules: {
          name: [
            { required: true, message: `名称不能为空` },
            { max: 20, message: `最长20个字` },
            isEnglishOrNumberOrSymbol(),
          ], //名称
          agreementType: [{ required: true, message: `协议不能为空` }], //协议
          isReupload: null, //断网续传
          description: [
            { required: true, message: `描述不能为空` },
            { max: 500, message: `描述最长500个字` },
          ],
        },
        /**
         * !测试数据,注意清除
         */
        agreementTypeOptions: [],
        step: 1, //一共三步 1.基础配置 2.协议配置 3.采集点配置,
        pointType: '', //ModbusPoint
        loading: false,
        AgreementType,
      }
    },
    computed: {
      ...mapGetters('devicesInfo', ['detailInfo', 'pointInfo']),
      currentAgreementComponent: function () {
        const type = transformAgreement(this.baseForm.agreementType)
        let stepCount = 1 //总配置步骤数
        if ([AgreementType.HTTP_SERVER_ARG].indexOf(type) >= 0) {
          stepCount = 1
        } else if ([AgreementType.RTSP_RTMP_ARG].indexOf(type) >= 0) {
          stepCount = 2
        } else {
          stepCount = 3
        }
        return { type: type, stepCount: stepCount }
      },
    },
    watch: {
      'baseForm.agreementType': function (newType) {
        if (!this.loading) {
          this.$store.dispatch('devicesInfo/clearDetailInfo')
          this.$store.dispatch('devicesInfo/clearPointInfo')
          this.sourceData = null
          this.step = 1
        }
      },
    },
    async created() {
      this.agreementTypeOptions = [].concat(await getTypes(TypeName.ARGEE))

      this.getData()
    },
    methods: {
      transformAgreement,
      /**
       * !需要判断当前模块类型,部分协议逻辑不相同!
       */
      async submit() {
        this.$refs['baseForm'] && (await this.$refs['baseForm'].validate())

        let continueFlag = false
        let hasPoint = true
        let postData
        let apiList = []

        //基础数据注入
        const baseForm = this.baseForm
        postData = {
          deviceInfo: baseForm.description,
          deviceName: baseForm.name,
          isContinuation: baseForm.isReupload ? 1 : 0,
          dictionaryName: baseForm.agreementType,
          dictionaryDescribe: getTypeLabelbyValue(
            this.agreementTypeOptions,
            baseForm.agreementType
          ),
        }

        // 如果是编辑模式,注入id
        if (this.id) {
          postData.deviceId = this.id
        }

        //注入第二个表单的数据
        postData = Object.assign(
          {},
          postData,
          formDataToPostData(this.detailInfo)
        )
        console.log('postData', postData)
        // return false

        //以下开始是协议自定义内容 start

        // modbus/tcp
        if (
          this.currentAgreementComponent.type === AgreementType.MODBUS_TCP_ARG
        ) {
          if (this.pointInfo.length) {
            postData.points = [].concat(this.pointInfo)
          } else {
            hasPoint = false
          }

          apiList = [validateModbus, saveModbus]
        }
        // rtu
        else if (
          this.currentAgreementComponent.type === AgreementType.MODBUS_RTU_ARG
        ) {
          if (this.pointInfo.length) {
            postData.points = [].concat(this.pointInfo)
          } else {
            hasPoint = false
          }
          apiList = [saveModbusRtu]
        }

        // mqtt
        else if (
          this.currentAgreementComponent.type === AgreementType.MQTT_ARG
        ) {
          postData.topicUrl = getTypeLabelbyValue(
            this.detailInfo.theme.options,
            this.detailInfo.theme.value
          )

          apiList = [saveMqttDevice]
        }

        // http server
        else if (
          this.currentAgreementComponent.type === AgreementType.HTTP_SERVER_ARG
        ) {
          apiList = [saveHttpRest]
        }

        // rtsp
        else if (
          this.currentAgreementComponent.type === AgreementType.RTSP_RTMP_ARG
        ) {
          apiList = [saveRtspRtmpServer]
        } else if (
          this.currentAgreementComponent.type === AgreementType.HTTP_CLIENT_ARG
        ) {
          if (this.pointInfo.length) {
            postData.points = [].concat(this.pointInfo)
          } else {
            hasPoint = false
          }
          apiList = [saveHttpClient]
        }

        //以下开始是协议自定义内容 end

        if (!hasPoint) {
          this.$message.error(`请添加采集点`)
          return
        }

        continueFlag = await apiList[0](postData)
          .then((res) => {
            return res
          })
          .catch(async (error) => {
            if (apiList[1])
              return await this.$confirm(`${error.msg},是否要继续保存`, {
                title: '警告',
                type: 'warning',
                center: true,
              })
            // else this.$message.error(error.msg)
          })

        if (continueFlag) {
          let result = continueFlag
          if (apiList[1]) {
            result = await apiList[1](postData)
          }

          if (result.code === 200) {
            this.$message.success(`${this.id ? '更新' : '新增'}设备成功`)
            this.$router.go(-1)
          } else {
            this.$message.error(result.msg)
          }
        }
      },
      /**
       * !需要判断当前模块类型
       * todo 所有point组件都需要实现addNew方法
       */

      goPrevStep() {
        this.step = this.step > 1 ? this.step - 1 : this.step
      },
      goNextStep() {
        const that = this
        if (this.step === 1) {
          this.$refs['baseForm'].validate((valid) => {
            if (valid) {
              this.step = 2
            }
          })
        } else if (this.step === 2) {
          this.$refs['dynamicForm'].submit().then((formData) => {
            // console.log('3', that.currentAgreementComponent)

            if (
              [
                AgreementType.MODBUS_TCP_ARG,
                AgreementType.MODBUS_RTU_ARG,
              ].indexOf(that.currentAgreementComponent.type) >= 0
            ) {
              that.pointType = 'ModbusPoint'
            } else if (
              [AgreementType.HTTP_CLIENT_ARG].indexOf(
                that.currentAgreementComponent.type
              ) >= 0
            ) {
              that.pointType = 'JsonPoint'
            }
            that.step = 3
          })
        }

        // todo 最后一步,验证连通性测试,如果失败,提示是否提交,如果确认提交则强制提交数据
      },
      cancel() {
        this.$confirm(`你所做的操作将不会被保存,确认退出吗?`, {
          title: '警告',
          type: 'warning',
          center: true,
        }).then(() => {
          this.$router.go(-1)
        })
      },
      async getData() {
        this.loading = true
        let API = null
        if (this.$route.params && this.$route.params.id) {
          this.id = this.$route.params.id
          if (
            transformAgreement(this.$route.query.type) ===
            AgreementType.MODBUS_TCP_ARG
          ) {
            API = getModbusById
          } else if (
            transformAgreement(this.$route.query.type) ===
            AgreementType.MQTT_ARG
          ) {
            API = getMqttById
          } else if (
            transformAgreement(this.$route.query.type) ===
            AgreementType.HTTP_SERVER_ARG
          ) {
            API = getHttpRest
          } else if (
            transformAgreement(this.$route.query.type) ===
            AgreementType.RTSP_RTMP_ARG
          ) {
            API = getRtspRtmpById
          } else if (
            transformAgreement(this.$route.query.type) ===
            AgreementType.MODBUS_RTU_ARG
          ) {
            API = getModbusRtuById
          } else if (
            transformAgreement(this.$route.query.type) ===
            AgreementType.HTTP_CLIENT_ARG
          ) {
            API = getHttpClientById
          }
          const { data } = await API(this.id)
          this.baseForm.name = data.deviceName
          this.baseForm.isReupload = data.isContinuation === 1
          this.baseForm.agreementType = data.dictionaryName
          this.baseForm.description = data.deviceInfo
          this.sourceData = data
        }
        this.$nextTick(() => {
          this.loading = false
        })
      },
    },
  }
</script>
<style lang="scss" scoped></style>
