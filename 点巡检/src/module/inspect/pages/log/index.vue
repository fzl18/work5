<template>
  <el-main class="si">
    <bt-page :title="$route.meta.title" icon-bg-color="#FF866A" :show-drawer="true">
      <!--      <el-card class="box-card si-title" shadow="hover">-->
      <!--        <el-row slot="header" class="z-card-header">-->
      <!--          <el-row class="z-c-in">-->
      <!--            <el-col class="left">-->
      <!--              <i class="el-icon-document-copy" />-->
      <!--              <span>{{ translateTitle('用户操作日志') }}</span>-->
      <!--            </el-col>-->
      <!--            <el-col class="right">-->
      <!--              <div class="icon-sm" @click="dialog = true">-->
      <!--                <remix-icon-->
      <!--                  icon-class="bt-filter"-->
      <!--                  class="remix-icon"-->
      <!--                  is-svg-->
      <!--                />-->
      <!--              </div>-->
      <!--            </el-col>-->
      <!--          </el-row>-->
      <!--        </el-row>-->
      <!--      </el-card>-->

      <zTable
        ref="zTable"
        :table-data="tableData"
        :cols="cols"
        :total="pageConfig.total"
        :each-page-size="pageConfig.eachPageSize"
        :current-page="pageConfig.currentPage"
        :show-handle="false"
        :show-index="true"
        @pageChange="pageChange"
      />

      <template slot="drawer">
        <el-form class="si-title-body">
          <el-form-item :label="translateTitle('业务类型')">
            <el-select v-model="searchInfo.actionModule" placeholder="" clearable>
              <el-option
                v-for="(item, index) in moduleList"
                :key="index"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="translateTitle('用户名')">
            <el-input v-model="searchInfo.name" />
          </el-form-item>
          <el-form-item :label="translateTitle('时间')">
            <el-date-picker
              v-model="searchInfo.createdTime"
              style="width: 100%"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-button class="bt-search_btn" type="primary" @click="doSearch">查询</el-button>
          <el-button class="common-search__reset" type="default" @click="doRest">重置</el-button>
        </el-form>
      </template>

      <!--      <zDrawer-->
      <!--        :visible="dialog"-->
      <!--        @closeDrawer="handleClose"-->
      <!--        @doSearch="doSearch"-->
      <!--        @doRest="doRest"-->
      <!--      >-->
      <!--      </zDrawer>-->
    </bt-page>
  </el-main>
</template>

<script>
import { translateTitle } from '../../i18n'
import { getAllModule, getOperationLogs } from '../../api/log'
import zTable from '../../components/zTable'

export default {
  components: { zTable },
  data () {
    return {
      tableData: [],
      pageConfig: {
        total: 0,
        eachPageSize: 10,
        currentPage: 1,
      },
      moduleList: [],
      searchInfo: {
        actionModule: '',
        createdTime: '',
        name: '',
      },
      cols: [
        {
          label: '记录时间',
          prop: 'createdTime',
          width: '150',
          showOverflowTooltip: true,
        },
        {
          label: '用户名',
          prop: 'name',
          width: '180',
          showOverflowTooltip: true,
        },
        {
          label: '业务类型',
          prop: 'actionModule',
          width: '180',
          showOverflowTooltip: true,
        },
        {
          label: '消息',
          prop: 'logDetails',
          showOverflowTooltip: true,
        },
      ],
      dialog: false,
    }
  },
  created () {
    this.requestData(1, this.pageConfig.eachPageSize)
    getAllModule().then((res) => {
      let { data } = res
      this.moduleList = data
    })
  },
  methods: {
    translateTitle,
    requestData (pageNum, pageSize) {
      getOperationLogs({ ...this.searchInfo, pageNum, pageSize }).then(
        (res) => {
          let {
            data: { result },
          } = res
          this.tableData = result
          this.pageConfig.currentPage = res.data.pageNum
          this.pageConfig.total = res.data.total
          this.$refs.zTable.closeLoading()
        }
      )
    },
    doSearch () {
      this.requestData(1, this.pageConfig.eachPageSize)
      this.handleClose()
    },
    doRest () {
      this.searchInfo = {}
      this.requestData(1, this.eachPageSize)
      this.handleClose()
    },
    pSizeChange (val) {
      this.pageConfig.eachPageSize = val
      this.pageConfig.currentPage = 1
      this.requestData(1, this.pageConfig.eachPageSize)
    },
    pageChange (val) {
      this.pageConfig.currentPage = val
      this.requestData(val, this.pageConfig.eachPageSize)
    },
    doReset () {
      this.searchInfo = this.$options.data().searchInfo
    },
    handleClose () {
      this.dialog = false
      // this.doReset();
    },
  },
}
</script>
<style scoped lang="scss">
  @import '../../css/base';
</style>
