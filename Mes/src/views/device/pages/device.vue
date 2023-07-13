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
          <el-form-item :label="$translateTitle('设备编码')">
            <el-input v-model="queryForm.code" clearable></el-input>
          </el-form-item>
          <el-form-item :label="$translateTitle('设备名称')">
            <el-input v-model="queryForm.name" clearable></el-input>
          </el-form-item>
          <el-form-item :label="$translateTitle('所属部门')">
            <el-input v-model="queryForm.department" clearable></el-input>
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
          :label="$translateTitle('设备编号')"
          min-width="100"
        />
        <el-table-column
          prop="name"
          :label="$translateTitle('设备名称')"
          min-width="150"
        />
        <el-table-column
          prop="deviceModel"
          :label="$translateTitle('设备型号')"
          min-width="100"
        />
        <el-table-column
          prop="deviceType"
          :label="$translateTitle('设备类型')"
          min-width="100"
        />
        <el-table-column
          prop="brand"
          :label="$translateTitle('设备品牌名称')"
          min-width="150"
        />
        <el-table-column
          prop="department"
          :label="$translateTitle('所属部门')"
          min-width="100"
        />
        <el-table-column
          prop="installRegion"
          :label="$translateTitle('安装区域')"
          min-width="100"
        />
        <el-table-column
          prop="important"
          :label="$translateTitle('是否重要设备')"
          min-width="100"
        >
          <template #default="{ row }">
            <span>{{ row.important ? '是' : '否' }}</span>
          </template>
        </el-table-column>
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
    <PopDevice
      :visible.sync="visibleDevice"
      :row="currentRow"
      @refresh="querySearch"
    />
  </div>
</template>
<script>
  import PopDevice from '../components/PopDevice.vue'
  import { getDeviceList, delDevice } from '../api'
  import { mapGetters } from 'vuex'
  export default {
    name: 'Device',
    components: {
      PopDevice,
    },
    data() {
      return {
        //列表
        list: [],
        //搜索字段
        queryForm: {
          code: '', //设备编码
          name: '', //设备名称
          department: '', //所属部门
          unitUnionCode: '', //所属公司统一编码
        },
        //分页字段
        search: {
          page: 1,
          pageSize: 10,
        },
        total: 0,
        currentRow: null,
        visibleDevice: false,
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
        let data = await getDeviceList({
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
          code: '', //设备编码
          name: '', //设备名称
          department: '', //所属部门
          unitUnionCode: '', //所属公司统一编码
        }
      },
      indexMethod(index) {
        return (this.search.page - 1) * this.search.pageSize + (index + 1)
      },
      handleSelectionChange(selection) {
        this.selection = selection
      },
      add() {
        this.currentRow = null
        this.visibleDevice = true
      },
      edit(row) {
        this.currentRow = row
        this.visibleDevice = true
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
              delDevice({ ids })
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
