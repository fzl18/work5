<template>
  <div class="app-container">
    <bt-page :title="$route.meta.title" :show-drawer="true">
      <template #drawer>
        <el-form
          ref="searchQuery"
          :model="searchQuery"
          label-position="top"
          size="mini"
        >
          <el-form-item label="流程名称">
            <el-input v-model="searchQuery.flowGroupName"></el-input>
          </el-form-item>
          <el-form-item label="组件名">
            <el-input v-model="searchQuery.flowName"></el-input>
          </el-form-item>
          <el-form-item label="日志等级">
            <el-select v-model="searchQuery.level" placeholder="" clearable>
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <BtDatepicker
            ref="timeSearch"
            v-model="searchQuery.searchTime"
          ></BtDatepicker>
          <div class="bt-search_btn">
            <el-button class="" type="primary" @click="handleSearch">
              查询
            </el-button>
            <el-button class="" type="success" @click="handleReset">
              重置
            </el-button>
          </div>
        </el-form>
      </template>
      <bt-title title="流程错误日志"></bt-title>

      <el-table :data="list">
        <el-table-column prop="createTime" label="创建时间">
          <template #default="{ row }">
            {{
              row.createTime
                ? dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss')
                : ''
            }}
          </template>
        </el-table-column>
        <el-table-column prop="levelName" label="日志等级" />
        <!-- <el-table-column prop="port" label="端口" /> -->
        <el-table-column prop="flowGroupName" label="流程名称" />
        <el-table-column prop="flowName" label="组件名" />
        <el-table-column prop="errorInfo" label="错误信息" />
        <el-table-column fixed="right" label="操作" width="100">
          <template #default="{ row }">
            <bt-dropdown :show-split="false">
              <bt-dropdown-menu>
                <bt-dropdown-item @click="watchData(row)">
                  <remix-icon
                    class-name="menu-icon"
                    icon-class="data-view"
                    style="margin-right: 5px"
                    is-svg
                  ></remix-icon>
                  数据
                </bt-dropdown-item>
              </bt-dropdown-menu>
            </bt-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <bt-pagination
        :total="total"
        :page.sync="searchQuery.pageNum"
        :limit.sync="searchQuery.pageSize"
        @pagination="getList"
      ></bt-pagination>
    </bt-page>
    <el-dialog title="详情" :visible.sync="logDetailDialog.visible">
      <div>
        <!-- <el-input
          v-model="logDetailDialog.content"
          type="textarea"
          :rows="10"
          placeholder=""
        ></el-input> -->
        <vue-json-pretty
          :data="
            logDetailDialog.content && logDetailDialog.content !== ''
              ? JSON.parse(logDetailDialog.content)
              : null
          "
        />
      </div>
      <div slot="footer">
        <el-button @click="logDetailDialog.visible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { getLogList } from '@/api/log'
  import getTypes, { TypeName } from '@/utils/getTypes'
  import { getDefaultTime } from '@/utils/index'
  // import { getDeviceList, deleteDevice } from '@/api/device'
  import VueJsonPretty from 'vue-json-pretty'
  import 'vue-json-pretty/lib/styles.css'
  export default {
    name: 'Device',
    components: {
      VueJsonPretty,
    },
    data() {
      return {
        searchQuery: {
          level: '',
          flowGroupName: '',
          flowName: '',
          searchTime: getDefaultTime(),
          pageNum: 1,
          pageSize: 20,
        },
        total: 0,
        list: [],
        options: [],
        currentTab: 0,
        logDetailDialog: {
          visible: false,
          content: '',
        },
      }
    },
    async created() {
      this.options = await getTypes(TypeName.LEVELTYPE)
      this.getList()
    },
    methods: {
      getList() {
        const searchQuery = {
          level: this.searchQuery.level,
          pageNum: this.searchQuery.pageNum,
          pageSize: this.searchQuery.pageSize,
          startTime: this.dayjs(
            this.searchQuery.searchTime.startTime
          ).valueOf(),
          endTime: this.dayjs(this.searchQuery.searchTime.endTime).valueOf(),
          flowGroupName: this.searchQuery.flowGroupName,
          flowName: this.searchQuery.flowName,
        }
        getLogList(searchQuery).then((res) => {
          this.list = res.data.records || []
          this.total = res.data.total || 0
        })
      },
      handleSearch() {
        this.searchQuery.pageNum = 1
        this.getList()
      },
      handleReset() {
        this.searchQuery.level = ''
        this.searchQuery.searchTime = getDefaultTime()
        this.searchQuery.flowGroupName = ''
        this.searchQuery.flowName = ''
        this.handleSearch()
      },
      watchData(row) {
        this.logDetailDialog = {
          visible: true,
          content: row.outputInfo,
        }
      },
    },
  }
</script>
