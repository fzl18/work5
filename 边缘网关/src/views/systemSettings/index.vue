<template>
  <div class="app-container">
    <bt-page :title="$route.meta.title">
      <bt-title
        v-model="currentTab"
        :title="['系统性能', '参数配置', 'MQTT服务', 'REST服务']"
      ></bt-title>
      <div v-if="currentTab === 0" class="gateway">
        <div class="gateway-info">
          <!-- <div class="gateway-info-pic">
            <img src="" alt="" />
          </div> -->

          <div class="gateway-info-detail">
            <el-row :gutter="20">
              <el-col :span="8">
                <div class="gateway-detail-title">性能</div>
                <div class="gateway-detail-content">{{ baseInfo.cpu }}</div>
              </el-col>
              <el-col :span="8">
                <div class="gateway-detail-title">内存总量</div>
                <div class="gateway-detail-content">
                  {{ baseInfo.memoryTotal }}
                </div>
              </el-col>
              <el-col :span="8">
                <div class="gateway-detail-title">当前剩余内存量</div>
                <div class="gateway-detail-content">
                  {{ baseInfo.memoryFree }}
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20" class="m-t-20">
              <el-col :span="24">
                <div class="gateway-detail-title">协议</div>
                <div class="gateway-detail-content">
                  {{ baseInfo.argee }}
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <div v-if="currentTab === 1">
        <!-- 暂时隐藏重启功能 edit by jay -->
        <!-- <p>重启网关并重新加载配置文件。</p>
        <bt-button class="m-t-30" type="primary" @click="reboot()">
          重启网关
        </bt-button>
        <bt-divider class="m-t-30 m-b-30"></bt-divider> -->
        <auto-form
          ref="autoForm"
          v-model="formData"
          :form-header="formHeader"
          :show-footer="false"
        >
          <template #sync>
            <el-button
              type="primary"
              size="mini"
              class="m-t-30"
              @click="doSync"
            >
              立即同步
            </el-button>
          </template>
        </auto-form>
        <div class="m-t-30">
          <el-button type="primary" size="mini" @click="submit">保存</el-button>
          <el-button type="info" size="mini" @click="reset">重置</el-button>
        </div>
      </div>
      <mqtt v-if="currentTab === 2" />
      <http v-if="currentTab === 3" />
    </bt-page>
  </div>
</template>
<script>
  import {
    getGateWaySetting,
    syncTime,
    updateGateWaySetting,
    getGateWayInfo,
    reboot,
  } from '@/api/gateway'
  import Mqtt from './components/mqtt.vue'
  import Http from './components/http.vue'
  import { formDataToPostData, dataToFormData } from '@/utils/autoForm'
  export default {
    components: {
      Mqtt,
      Http,
    },
    data() {
      return {
        baseInfo: {
          cpu: '',
          memoryTotal: '',
          memoryFree: '',
          argee: '',
        },
        id: null,
        currentTab: 0,
        formHeader: {
          group1: {
            title: '',
          },
          group2: {
            title: '',
          },
        },
        formData: {
          NTPEnable: {
            code: 'NTPEnable',
            apiCode: 'isNtp',
            title: 'NTP参数设置',
            label: '启用NTP',
            value: '',
            type: 'checkbox',
            options: [],
            required: true,
            groupId: 'group1',
          },
          sync: {
            slot: true,
            code: 'sync',
            type: 'empty',
            groupId: 'group1',
          },
          serverAddress: {
            code: 'serverAddress',
            apiCode: 'ipAddress',
            title: '服务器地址',
            value: '',
            type: 'text',
            required: true,
            groupId: 'group2',
          },
        },
      }
    },
    created() {
      this.getBaseInfo()
      this.getData()
    },
    methods: {
      async getBaseInfo() {
        const { data } = await getGateWayInfo()
        this.baseInfo = { ...data }
      },
      async getData() {
        const { data } = await getGateWaySetting()
        this.id = data.id
        this.formData = dataToFormData(data, this.formData)
      },
      async submit() {
        const postData = formDataToPostData(this.formData)
        postData.id = this.id
        await updateGateWaySetting(postData)
        this.$message.success('更新成功')
      },
      reset() {
        this.formData.NTPEnable.value = ''
        this.formData.serverAddress.value = ''
        this.$forceUpdate()
        this.submit()
      },
      async doSync() {
        syncTime().then(() => {
          this.$message.success('同步成功')
        })
      },
      reboot() {
        this.$confirm('确定重启网关吗?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true,
        })
          .then(() => {
            this.doReboot()
          })
          .catch(() => {})
      },
      doReboot() {
        reboot().then((res) => {
          if (res.errmsg) this.$message(res.errmsg)
          else this.$message.success('重启成功')
        })
      },
    },
  }
</script>
<style lang="scss" scoped>
  .gateway {
    &-info {
      display: flex;
      justify-content: flex-start;
    }

    &-info-pic {
      width: 436px;
      height: 300px;
      display: block;
      background-color: #f0f0f0;
      img {
        width: 100%;
        height: 100%;
      }
    }
    &-info-detail {
      width: 100%;
      margin-left: 0px;
      font-size: 14px;
    }
    &-detail-title {
      color: #7c7c7d;
    }
    &-detail-content {
      color: #aeb7bf;
    }
    &-detail-title + &-detail-content {
      margin-top: 16px;
    }

    &-detail-content + &-detail-title {
      margin-top: 26px;
    }
  }
</style>
