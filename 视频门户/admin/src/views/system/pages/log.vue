<template>
  <div class="app-container">
    <bt-page :title="$route.meta.title" :subtitle="$route.meta.title">
      <el-table
        :data="list"
        stripe
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="createName" label="创建者" />
        <el-table-column prop="type" label="操作类型" />
        <el-table-column prop="module" label="模块名" />
        <el-table-column prop="requestMethod" label="请求方法类型" />
        <el-table-column prop="requestUrl" label="请求地址" width="300">
          <template #default="{ row }">
            <span>{{ row.requestUrl }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="costTime" label="操作执行时间">
          <template #default="{ row }">
            <span>{{ row.costTime }} ms</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="60">
          <template #default="{ row }">
            <bt-dropdown :show-split="false">
              <bt-dropdown-menu>
                <bt-dropdown-item @click="handleDetail(row)">
                  <i class="el-icon-info"></i>
                  详情
                </bt-dropdown-item>
              </bt-dropdown-menu>
            </bt-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <bt-pagination
        :total="total"
        :page.sync="search.page"
        :limit.sync="search.pageSize"
        show-page-sizes
        @pageSizeChange="pageSizeChange"
        @pagination="getList"
      ></bt-pagination>
    </bt-page>
    <el-dialog :visible.sync="dialogVisible" :title="`日志详情`">
      <div class="logDetail">{{ logDetail }}</div>
    </el-dialog>
  </div>
</template>

<script>
  import { getSysLog } from '../api'
  import dayjs from 'dayjs'
  export default {
    data() {
      return {
        search: {
          page: 1,
          pageSize: 10,
        },
        total: 10,
        ruleForm: {
          extraScore: null,
          lucre: null,
          normalClose: '',
        },
        list: [
          {
            id: 1,
            companyName: '宝通1',
            clientName: '应用1',
            sceneCode: 'TEMP_MONITOR_001',
            sceneName: '输送带温度监控',
            accessType: '邮件',
            templateName: '消息模板001',
            effectiveTime: '2020-11-26',
            invalidTime: '2020-12-26',
            status: 1,
          },
        ],

        dialogVisible: false,
        disabled: false,
        logDetail: null,
      }
    },
    created() {
      this.getList()
    },
    mounted() {},
    methods: {
      handleSearch() {
        this.getList()
      },
      getList() {
        getSysLog({
          current: this.search.page,
          size: this.search.pageSize,
        }).then((res) => {
          this.list = res.records
          this.total = res.total
          console.log(res)
        })
      },
      pageSizeChange(page) {
        this.search.page = page.page
        this.search.pageSize = page.limit
        this.getList()
      },

      handleDetail(data) {
        console.log(data)
        this.dialogVisible = true
        this.logDetail = data.jsonResult
      },

      indexMethod(index) {
        return (this.search.page - 1) * this.search.pageSize + (index + 1)
      },
    },
  }
</script>

<style lang="scss" scoped>
  .logDetail {
    padding: 20px;
    box-shadow: 0 0 4px rgba($color: #919191, $alpha: 0.5);
    background: #fff;
    color: #919191;
    position: relative;
    min-height: 400px;
    &::before {
      content: '';
      width: 56px;
      height: 3px;
      background: #2668b4;
      position: absolute;
      top: -32px;
      left: 0px;
    }
  }
</style>
