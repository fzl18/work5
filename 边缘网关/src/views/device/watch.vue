<template>
  <div class="app-container">
    <bt-page :title="$route.meta.title" :show-drawer="true">
      <template slot="drawer">
        <el-form
          ref="searchQuery"
          :model="searchQuery"
          label-position="top"
          size="mini"
        >
          <el-form-item label="采集点名称">
            <el-input v-model="searchQuery.name" clearable></el-input>
          </el-form-item>

          <div class="bt-search_btn">
            <el-button class="" type="primary" @click="search">查询</el-button>
            <el-button class="" type="success" @click="handleReset">
              重置
            </el-button>
          </div>
        </el-form>
      </template>
      <el-table :data="list">
        <el-table-column prop="ts" label="更新时间">
          <template #default="{ row }">
            {{ row.ts ? dayjs(row.ts).format('YYYY-MM-DD HH:mm:ss') : '' }}
          </template>
        </el-table-column>
        <el-table-column prop="collectionName" label="采集点名称" />
        <!-- <el-table-column prop="port" label="端口" /> -->
        <el-table-column prop="collectionValue" label="值">
          <template #default="{ row }">
            {{
              row && row.hasOwnProperty('collectionValue')
                ? row.collectionValue.toString()
                : ''
            }}
          </template>
        </el-table-column>
      </el-table>
    </bt-page>
  </div>
</template>
<script>
  import store from '@/store'
  import { watchDeviceData } from '@/api/device'

  export default {
    data() {
      return {
        id: null,
        list: [],
        sourceData: [],
        ws: null,
        searchQuery: {
          name: '',
        },
        uuid: null,
        heart: null,
        heartTimer: 1000 * 60 * 4, //websocket心跳包
        timer: 1000 * 5,
        itv: null,
      }
    },
    created() {
      this.id = this.$route.params.id || null
      if (this.id) {
        this.getData()
        this.itv = setInterval(() => {
          this.getData()
        }, this.timer)
      }
      // if (this.id) this.initWs()
      // window.addEventListener('beforeunload', this.destroyWebSocket)
    },
    beforeDestroy() {
      this.itv && clearInterval(this.itv)
      // this.heart = null
      // this.closeWebSocket()
      // window.removeEventListener('beforeunload', this.destroyWebSocket)
    },
    methods: {
      search() {
        if (this.sourceData.length) {
          this.list = this.sourceData.filter(
            (t) => t.collectionName.indexOf(this.searchQuery.name) >= 0
          )
        }
      },
      handleReset() {
        this.searchQuery.name = ''

        this.search()
      },
      getData() {
        let t = `${new Date().getTime()}`
        watchDeviceData(this.id, { t }).then((res) => {
          console.log(res)
          this.handleMessage(res)
        })
      },
      initWs() {
        const that = this
        const webSocketApi =
          window.webSocketApi || process.env.VUE_APP_WEBSOCKETAPI
        let token = store.getters['coreUser/accessToken']
        let uuid = `${this.id}_${new Date().getTime()}`
        this.uuid = uuid
        let ws = new WebSocket(
          `${webSocketApi}/websocket/${uuid}?token=` + token
        )
        this.ws = ws
        ws.onopen = (evt) => {
          console.log('Connection open ...')
          this.heart = setInterval(() => {
            ws.send(uuid)
          }, this.heartTimer)
        }

        ws.onmessage = (evt) => {
          that.handleMessage(evt)
        }

        ws.onclose = (evt) => {
          console.log('Connection closed.', evt)
          this.heart && clearInterval(this.heart)
          this.heart = null
        }
      },
      handleMessage(evt) {
        // console.log('Received Message: ' + evt.data)
        const { data } = evt
        // console.log(data)
        if (data) {
          this.sourceData = data
          if (this.searchQuery.name !== '') {
            this.search()
          } else {
            this.list = data
          }
        } else {
          this.$message.error('链接错误,请重试!')
          this.closeWebSocket()
        }
      },
      closeWebSocket() {
        if (this.ws) {
          console.log('关闭链接')
          this.ws.send('close_' + this.uuid)
          this.ws.close()
          this.ws = null
        }
      },
      destroyWebSocket(event) {
        // event.preventDefault()
        this.closeWebSocket()

        // return (event.returnValue = 'Are you sure you want to exit?')
      },
    },
  }
</script>
