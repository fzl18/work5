<template>
  <div class="app-container">
    <bt-page :title="$route.meta.title" :show-drawer="true">
      <template slot="option">
        <bt-button type="default" icon="el-icon-plus" @click="addNewDevice">
          新增设备
        </bt-button>
      </template>
      <template slot="drawer">
        <el-form
          ref="searchQuery"
          :model="searchQuery"
          label-position="top"
          size="mini"
        >
          <el-form-item label="设备名称">
            <el-input v-model="searchQuery.deviceName" clearable></el-input>
          </el-form-item>
          <el-form-item label="协议类型">
            <el-select v-model="searchQuery.dictionaryName" placeholder="">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
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
        <el-table-column prop="createTime" label="创建时间" width="150">
          <template #default="{ row }">
            {{
              row.createTime
                ? dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss')
                : ''
            }}
          </template>
        </el-table-column>
        <el-table-column prop="deviceName" label="设备名称" width="180" />
        <el-table-column
          prop="deviceInfo"
          label="设备描述"
          :show-overflow-tooltip="true"
        />
        <!-- <el-table-column prop="port" label="端口" /> -->
        <el-table-column
          prop="dictionaryDescribe"
          label="协议类型"
          width="150px"
        />
        <el-table-column fixed="right" label="操作" width="100">
          <template #default="{ row }">
            <bt-dropdown :show-split="false">
              <bt-dropdown-menu>
                <bt-dropdown-item @click="doEdit(row)">
                  <remix-icon
                    class-name="menu-icon"
                    icon-class="edit-line"
                  ></remix-icon>
                  编辑
                </bt-dropdown-item>
                <bt-dropdown-item @click="doDelete(row)">
                  <remix-icon
                    class-name="menu-icon"
                    icon-class="delete-bin-7-line"
                  ></remix-icon>
                  删除
                </bt-dropdown-item>
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
  </div>
</template>

<script>
  import getTypes, { TypeName } from '@/utils/getTypes'
  import { getDeviceList, deleteDevice } from '@/api/device'
  export default {
    name: 'Device',
    data() {
      return {
        searchQuery: {
          pageNum: 1,
          pageSize: 20,
          deviceName: '',
          dictionaryName: '',
        },
        total: 0,
        list: [],
        options: [],
      }
    },
    async created() {
      this.options = await getTypes(TypeName.ARGEE)
      this.getList()
    },
    methods: {
      addNewDevice() {
        this.$router.push('/device/maintain')
      },
      async initBasic() {
        this.options = await deviceTypes()
      },

      getList() {
        getDeviceList(this.searchQuery).then((res) => {
          this.list = res.data.records || []
          this.total = res.data.total || 0
        })
      },
      search() {
        this.searchQuery.pageNum = 1
        this.getList()
      },
      handleReset() {
        this.searchQuery.deviceName = ''
        this.searchQuery.dictionaryName = ''
        this.search()
      },
      doEdit(row) {
        this.$router.push({
          path: '/device/maintain/' + row.id,
          query: {
            type: row.dictionaryName,
          },
        })
      },
      doDelete(row) {
        this.$confirm(`确认删除设备${row.deviceName}吗?`, {
          title: '警告',
          type: 'warning',
          center: true,
        }).then(async () => {
          await deleteDevice(row.id)
          this.getList()
          this.$message.success('删除成功！')
        })
      },
      watchData(row) {
        this.$router.push({
          path: '/device/watch/' + row.id,
          query: {
            type: row.dictionaryName,
          },
        })
      },
    },
  }
</script>
