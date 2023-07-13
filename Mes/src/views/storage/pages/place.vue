<template>
  <div class="app-container">
    <bt-page
      ref="btPage"
      :title="$translateTitle($route.meta.title)"
      class="my-bt-page"
    >
      <template slot="drawer">
        <el-form :model="queryForm" label-position="top">
          <el-form-item prop="unitUnionCode" :label="$translateTitle('公司')">
            <el-select v-model="queryForm.unitUnionCode" clearable>
              <el-option
                v-for="item in unitOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$translateTitle('仓库编码/名称')">
            <el-input v-model="queryForm.storage" clearable></el-input>
          </el-form-item>
          <el-form-item :label="$translateTitle('库区编码/名称')">
            <el-input v-model="queryForm.region" clearable></el-input>
          </el-form-item>
          <el-form-item :label="$translateTitle('库位编码/名称')">
            <el-input v-model="queryForm.station" clearable></el-input>
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
          prop="code"
          :label="$translateTitle('库位编号')"
          min-width="100"
        />
        <el-table-column
          prop="name"
          :label="$translateTitle('库位名称')"
          min-width="150"
        />
        <el-table-column
          prop="regionCode"
          :label="$translateTitle('库区编号')"
          min-width="100"
        />
        <el-table-column
          prop="regionName"
          :label="$translateTitle('库区名称')"
          min-width="150"
        />
        <el-table-column
          prop="storageCode"
          :label="$translateTitle('所属仓库编号')"
          min-width="100"
        />
        <el-table-column
          prop="storageName"
          :label="$translateTitle('所属仓库名称')"
          min-width="150"
        />
        <el-table-column
          prop="createBy"
          :label="$translateTitle('创建人')"
          min-width="120"
        />
        <el-table-column
          prop="createTime"
          :label="$translateTitle('创建时间')"
          min-width="150"
        />
        <el-table-column
          prop="updateBy"
          :label="$translateTitle('更新人')"
          min-width="120"
        />
        <el-table-column
          prop="updateTime"
          :label="$translateTitle('更新时间')"
          min-width="150"
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
                <bt-dropdown-item @click="edit(row)">
                  <i class="el-icon-edit"></i>
                  {{ $translateTitle($cws.w004) }}
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
    <PopPlace
      :visible.sync="visiblePlace"
      :row="currentRow"
      @refresh="querySearch"
    />
  </div>
</template>
<script>
  import PopPlace from '../components/PopPlace.vue'
  import { getPlaceList, delPlace } from '../api'
  import { mapGetters } from 'vuex'
  export default {
    name: 'Place',
    components: {
      PopPlace,
    },
    data() {
      return {
        //列表
        list: [],
        //搜索字段
        queryForm: {
          storage: '', //仓库编码或者仓库名称
          region: '', //库区编码或者库区名称
          station: '', //库位编码或者库位名称
          unitUnionCode: '', //所属公司统一编码
        },
        //分页字段
        search: {
          page: 1,
          pageSize: 10,
        },
        total: 0,
        selection: [],
        currentRow: null,
        visiblePlace: false,
      }
    },
    computed: {
      ...mapGetters({
        userInfo: 'coreUser/userInfo',
      }),
      unitOptions() {
        if (this.userInfo && Array.isArray(this.userInfo.userUnits)) {
          return this.userInfo.userUnits.map((item) => {
            item.value = item.unionCode
            item.label = item.unitName
            return item
          })
        } else {
          return []
        }
      },
    },
    mounted() {
      this.getList()
    },
    methods: {
      async getList() {
        let data = await getPlaceList({
          currentPage: this.search.page,
          pageSize: this.search.pageSize,
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
      add() {
        this.currentRow = null
        this.visiblePlace = true
      },
      edit(row) {
        this.currentRow = row
        this.visiblePlace = true
      },
      del() {
        if (Array.isArray(this.selection) && this.selection.length > 0) {
          this.$confirm(this.$translateTitle(this.$cws.w101), {
            title: this.$translateTitle(this.$cws.w010),
            type: 'warning',
            center: true,
          })
            .then(() => {
              let ids = this.selection.map((item) => item.id).join(',')
              delPlace({ ids })
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
