<template>
  <div class="app-container">
    <bt-page ref="btPage" :show-drawer="true" class="my-bt-page">
      <template slot="drawer">
        <el-form :model="queryForm" label-position="top">
          <el-form-item :label="$translateTitle('工号/姓名/手机号')">
            <el-input v-model="queryForm.userName" clearable></el-input>
          </el-form-item>
          <el-button class="bt-search_btn" type="primary" @click="querySearch">
            {{ $translateTitle($cws.w006) }}
          </el-button>
          <el-button
            class="bt-search_btn clear"
            type="success"
            @click="queryReset"
          >
            {{ $translateTitle($cws.w007) }}
          </el-button>
        </el-form>
      </template>
      <div class="my-header">
        <div class="header">
          <div class="title">{{ $translateTitle('人员信息') }}</div>
          <div class="btns">
            <div
              class="my-search bt-button__container"
              @click="handleOpenDrawer"
            >
              <remix-icon
                icon-class="bt-filter"
                class="remix-icon"
                is-svg
              ></remix-icon>
            </div>
            <bt-button type="primary" :disabled="!isLastDept" @click="add">
              {{ $translateTitle('绑定产线') }}
            </bt-button>
            <bt-button type="primary" :disabled="!isLine" @click="edit">
              {{ $translateTitle($cws.w004) }}
            </bt-button>
            <bt-button type="primary" :disabled="!isLine" @click="del">
              {{ $translateTitle($cws.w003) }}
            </bt-button>
          </div>
        </div>
        <div class="line"></div>
      </div>
      <el-table
        ref="myTable"
        :data="list"
        stripe
        fit
        highlight-current-row
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
        @row-click="handleRowClick"
      >
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column
          type="index"
          :index="indexMethod"
          align="center"
          :label="$translateTitle('序号')"
        />
        <el-table-column
          prop="stuffName"
          :label="$translateTitle('人员姓名')"
          min-width="100"
        />
        <el-table-column
          prop="stuffCode"
          :label="$translateTitle('工号')"
          min-width="120"
        />
        <el-table-column
          prop="depName"
          :label="$translateTitle('部门')"
          min-width="150"
        />
        <el-table-column
          prop="sectionName"
          :label="$translateTitle('产线名称')"
          min-width="150"
        />
        <el-table-column
          prop="phoneNumber"
          :label="$translateTitle('手机号')"
          min-width="100"
        />
        <el-table-column
          fixed="right"
          :label="$translateTitle($cws.w001)"
          :width="60"
          align="center"
        >
          <template #default="{ row }">
            <bt-dropdown :show-split="false">
              <bt-dropdown-menu>
                <bt-dropdown-item @click="view(row)">
                  <i class="el-icon-view"></i>
                  {{ $translateTitle($cws.w005) }}
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
        @pageSizeChange="querySearch"
        @pagination="getList"
      ></bt-pagination>
    </bt-page>
    <PopEmployee
      :visible.sync="visibleEmployee"
      :node="node"
      :selection="selection"
      @refresh="getList"
    />
    <PopDetail :visible.sync="visibleDetail" :employee="currentEmployee" />
  </div>
</template>

<script>
  import PopEmployee from '../components/PopEmployee.vue'
  import PopDetail from '../components/PopDetail.vue'
  import { getUserList, delLineUser } from '../api'
  export default {
    components: {
      PopEmployee,
      PopDetail,
    },
    props: {
      node: {
        type: Object,
      },
    },
    data() {
      return {
        //列表
        list: [],
        //搜索字段
        queryForm: {
          userName: '', //工号或姓名
        },
        //分页字段
        search: {
          page: 1,
          pageSize: 10,
        },
        total: 0,
        selection: [],
        currentEmployee: null,
        visibleEmployee: false,
        visibleDetail: false,
      }
    },
    computed: {
      isLastDept() {
        if (!this.node) {
          return false
        }
        if (this.node.unitType == 'CX') {
          return false
        }
        if (
          this.node.children &&
          Array.isArray(this.node.children) &&
          this.node.children.some((item) => item.unitType != 'CX')
        ) {
          return false
        }
        return true
      },
      isLine() {
        if (!this.node) {
          return false
        }
        return this.node.unitType == 'CX'
      },
    },
    watch: {
      node: {
        handler: function () {
          this.getList()
        },
      },
    },
    mounted() {
      this.getList()
    },
    methods: {
      async getList() {
        if (this.node && this.node.unitCode) {
          let data = await getUserList({
            currentPage: this.search.page,
            pageSize: this.search.pageSize,
            unitCode: this.node.unitCode,
            ...this.queryForm,
          })
          if (data) {
            this.list = data.objList
            this.search.page = data.pageDesc.pageNo
            this.search.pageSize = data.pageDesc.pageSize
            this.total = data.pageDesc.totalRows
          } else {
            this.list = []
            this.total = 0
          }
        }
      },
      //打开条件查询
      handleOpenDrawer() {
        this.$refs.btPage.handleOpenDrawer()
      },
      //条件查询
      querySearch() {
        this.search.page = 1
        this.getList()
      },
      //条件重置
      queryReset() {
        this.queryForm = {
          badge: '', //工号
          cpTitle: '', //公司
          dpTitle: '', //部门
          stayStartDate: '', //住宿开始时间
          stayEndDate: '', //住宿结束时间
        }
      },
      indexMethod(index) {
        return (this.search.page - 1) * this.search.pageSize + (index + 1)
      },
      handleSelectionChange(selection) {
        // console.log(selection)
        this.selection = selection
      },
      handleRowClick(row) {
        this.$refs.myTable.toggleRowSelection(row, true)
      },
      add() {
        if (Array.isArray(this.selection) && this.selection.length > 0) {
          this.visibleEmployee = true
        } else {
          this.$msg({
            type: 'warning',
            message: this.$translateTitle(this.$cws.w109),
          })
        }
      },
      edit() {
        if (Array.isArray(this.selection) && this.selection.length > 0) {
          this.visibleEmployee = true
        } else {
          this.$msg({
            type: 'warning',
            message: this.$translateTitle(this.$cws.w109),
          })
        }
      },
      del() {
        if (Array.isArray(this.selection) && this.selection.length > 0) {
          this.$confirm(this.$translateTitle(this.$cws.w101), {
            title: this.$translateTitle(this.$cws.w010),
            type: 'warning',
            center: true,
          })
            .then(() => {
              let ids = this.selection.map((item) => item.relationId).join(',')
              delLineUser({ ids })
              this.$msg({
                type: 'success',
                message: this.$translateTitle(this.$cws.w103),
              })
              this.getList()
            })
            .catch(() => {})
        } else {
          this.$msg({
            type: 'warning',
            message: this.$translateTitle(this.$cws.w109),
          })
        }
      },
      view(row) {
        this.currentEmployee = row
        this.visibleDetail = true
      },
    },
  }
</script>

<style lang="scss" scoped>
  ::v-deep .my-bt-page {
    .bt-page__head {
      display: none;
    }
    .bt-page__body {
      padding: 15px !important;
      margin: 0;
      .bt-column__body {
        height: auto !important;
        .my-header {
          margin-bottom: 20px;
          .header {
            height: 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .title {
              font-size: 16px;
            }
            .btns {
              display: flex;
              .my-search {
                display: inline-flex;
                justify-content: center;
                align-items: center;
                font-size: 16px;
                width: 28px;
                height: 28px;
                border-radius: 5px;
                background-color: $base-color-default;
                cursor: pointer;
              }
            }
          }
          .line {
            width: 100%;
            height: 1px;
            background-color: #e5e5e5;
            position: relative;
            &::before {
              content: '';
              width: 33px;
              height: 2px;
              background-color: $base-color-default;
              position: absolute;
              left: 0;
              bottom: 0;
            }
          }
        }
      }
    }
  }
</style>
