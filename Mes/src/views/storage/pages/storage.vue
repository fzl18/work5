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
          <el-form-item :label="$translateTitle('仓库编码/仓库名称')">
            <el-input v-model="queryForm.storageName" clearable></el-input>
          </el-form-item>
          <el-form-item prop="storageType" :label="$translateTitle('仓库类型')">
            <el-select v-model="queryForm.storageType" clearable>
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
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
      >
        <!-- <el-table-column type="selection" width="40"></el-table-column> -->
        <el-table-column
          type="index"
          :index="indexMethod"
          align="center"
          :label="$translateTitle('序号')"
        />
        <el-table-column
          prop="code"
          :label="$translateTitle('仓库编号')"
          min-width="100"
        />
        <el-table-column
          prop="name"
          :label="$translateTitle('仓库名称')"
          min-width="150"
        />
        <el-table-column
          prop="propertyLocalVal"
          :label="$translateTitle('仓库属性')"
          min-width="100"
        />
        <el-table-column
          prop="typeLocalVal"
          :label="$translateTitle('仓库类型')"
          min-width="100"
        />
        <el-table-column
          prop="remark"
          :label="$translateTitle('仓库描述')"
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
                <bt-dropdown-item @click="edit(row)">
                  <i class="el-icon-edit"></i>
                  {{ $translateTitle($cws.w004) }}
                </bt-dropdown-item>
                <!-- <bt-dropdown-item @click="view(row)">
                  <i class="el-icon-view"></i>
                  {{ $translateTitle($cws.w005) }}
                </bt-dropdown-item> -->
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
    <!-- <PopStorage
      :visible.sync="visibleStorage"
      :row="currentRow"
      :isEdit="isEdit"
      @refresh="querySearch"
    /> -->
    <PopStorage
      :visible.sync="visibleStorage"
      :row="currentRow"
      @refresh="querySearch"
    />
  </div>
</template>
<script>
  import PopStorage from '../components/PopStorage.vue'
  import { getStorageList } from '../api'
  import { mapGetters } from 'vuex'
  export default {
    name: 'Storage',
    components: {
      PopStorage,
    },
    data() {
      return {
        //列表
        list: [],
        //搜索字段
        queryForm: {
          storageName: '', //仓库编码或者仓库名称
          storageType: '', //仓库类型
          unitUnionCode: '', //所属公司统一编码
        },
        //分页字段
        search: {
          page: 1,
          pageSize: 10,
        },
        total: 0,
        currentRow: null,
        // isEdit: false,
        visibleStorage: false,
      }
    },
    computed: {
      ...mapGetters({
        userInfo: 'coreUser/userInfo',
        dictionary: 'coreDictionary/dictionary',
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
      typeOptions() {
        return this.dictionary.filter((item) => item.dictCategory == 'lx')
      },
    },
    mounted() {
      this.getList()
    },
    methods: {
      async getList() {
        let data = await getStorageList({
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
      edit(row) {
        this.currentRow = row
        // this.isEdit = true
        this.visibleStorage = true
      },
      view(row) {
        this.currentRow = row
        // this.isEdit = false
        this.visibleStorage = true
      },
    },
  }
</script>

<style lang="scss" scoped>
  ::v-deep .my-bt-page {
    .bt-page__body {
      // padding: 15px !important;
      // margin: 0;
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
