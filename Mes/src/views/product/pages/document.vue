<template>
  <div class="app-container">
    <bt-page
      ref="btPage"
      :title="`${$translateTitle('产品料号')}：${$route.query.itemCode}`"
      class="my-bt-page"
    >
      <template slot="drawer">
        <el-form :model="queryForm" label-position="top">
          <el-form-item :label="$translateTitle('图档名称')">
            <el-input v-model="queryForm.name" clearable></el-input>
          </el-form-item>
          <el-form-item :label="$translateTitle('文件名称')">
            <el-input v-model="queryForm.fileName" clearable></el-input>
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
          <div class="title">{{ $translateTitle($route.meta.title) }}</div>
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
            <bt-button type="primary" @click="add">
              {{ $translateTitle($cws.w002) }}
            </bt-button>
            <bt-button type="primary" @click="del">
              {{ $translateTitle($cws.w003) }}
            </bt-button>
          </div>
        </div>
        <div class="line"></div>
      </div>
      <el-table
        :data="list"
        stripe
        fit
        highlight-current-row
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column
          type="index"
          :index="indexMethod"
          align="center"
          :label="$translateTitle('序号')"
        />
        <el-table-column
          prop="name"
          :label="$translateTitle('图档名称')"
          min-width="150"
        />
        <el-table-column
          prop="version"
          :label="$translateTitle('图档版本')"
          min-width="80"
        />
        <el-table-column
          prop="fileType"
          :label="$translateTitle('文件类型')"
          min-width="100"
        />
        <el-table-column
          prop="fileName"
          :label="$translateTitle('文件名称')"
          min-width="150"
        />
        <el-table-column
          prop="fileSrc"
          :label="$translateTitle('文件')"
          min-width="150"
        />
        <el-table-column
          prop="remark"
          :label="$translateTitle('图档描述')"
          min-width="200"
          show-overflow-tooltip
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
                <bt-dropdown-item @click="download(row)">
                  <i class="el-icon-download"></i>
                  {{ $translateTitle($cws.w011) }}
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
    <PopDocument :visible.sync="visibleDocument" @refresh="querySearch" />
  </div>
</template>
<script>
  import PopDocument from '../components/PopDocument.vue'
  import { getDocumentList, delDocument, getDocumentUrl } from '../api'
  export default {
    name: 'Document',
    components: {
      PopDocument,
    },
    data() {
      return {
        //列表
        list: [],
        //搜索字段
        queryForm: {
          name: '', //图档名称
          fileName: '', //文件名称
        },
        //分页字段
        search: {
          page: 1,
          pageSize: 10,
        },
        total: 0,
        selection: [],
        visibleDocument: false,
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      async getList() {
        let data = await getDocumentList({
          currentPage: this.search.page,
          pageSize: this.search.pageSize,
          itemCode: this.$route.query.itemCode,
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
          name: '', //图档名称
          fileName: '', //文件名称
        }
      },
      indexMethod(index) {
        return (this.search.page - 1) * this.search.pageSize + (index + 1)
      },
      handleSelectionChange(selection) {
        this.selection = selection
      },
      add() {
        this.visibleDocument = true
      },
      del() {
        if (Array.isArray(this.selection) && this.selection.length > 0) {
          this.$confirm(this.$translateTitle(this.$cws.w101), {
            title: this.$translateTitle(this.$cws.w010),
            type: 'warning',
            center: true,
          })
            .then(() => {
              let ids = this.selection.map((item) => item.id)
              delDocument({ ids })
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
      async download(row) {
        let downloadUrl = await getDocumentUrl({ id: row.id })
        if (downloadUrl) {
          const x = new XMLHttpRequest()
          x.open('GET', downloadUrl, true)
          x.responseType = 'blob'
          x.onload = (e) => {
            let url = window.URL.createObjectURL(x.response)
            let a = document.createElement('a')
            a.href = url
            a.download = row.fileName || ''
            a.click()
          }
          x.send()
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  ::v-deep .my-bt-page {
    .bt-page__body {
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
