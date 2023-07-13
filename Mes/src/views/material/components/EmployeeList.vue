<template>
  <div class="app-container">
    <bt-page ref="btPage" :show-drawer="true" class="my-bt-page">
      <template slot="drawer">
        <el-form :model="queryForm" label-position="top">
          <el-form-item :label="$translateTitle('公司')">
            <el-select v-model="queryForm.unitUnionCode" clearable>
              <el-option
                v-for="item in unitOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$translateTitle('物料编码/物料名称')">
            <el-input v-model="queryForm.materialName" clearable></el-input>
          </el-form-item>
          <el-form-item :label="$translateTitle('类别')">
            <el-input v-model="queryForm.mtype" clearable></el-input>
          </el-form-item>
          <el-form-item :label="$translateTitle('属性')">
            <el-input v-model="queryForm.mproperty" clearable></el-input>
          </el-form-item>
          <el-form-item :label="$translateTitle('型号')">
            <el-input v-model="queryForm.mspecific" clearable></el-input>
          </el-form-item>
          <el-form-item :label="$translateTitle('是否免检	')">
            <el-input v-model="queryForm.exemptCheck" clearable></el-input>
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
            <!-- <bt-button type="primary" :disabled="!isLastDept" @click="add">
              {{ $translateTitle($cws.w002) }}
            </bt-button> -->
            <bt-button
              v-if="selection.length == 1"
              type="primary"
              @click="edit"
            >
              {{ $translateTitle($cws.w004) }}
            </bt-button>
            <!-- <bt-button type="primary" :disabled="!isLine" @click="del">
              {{ $translateTitle($cws.w003) }}
            </bt-button> -->
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
        style="width: 150%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="40"></el-table-column>
        <!-- <el-table-column
          type="index"
          :index="indexMethod"
          align="center"
          :label="$translateTitle('序号')"
        /> -->
        <el-table-column
          prop="code"
          :label="$translateTitle('物料编码')"
          min-width="150"
        />
        <el-table-column
          prop="name"
          :label="$translateTitle('物料名称')"
          min-width="120"
        />
        <el-table-column
          prop="specific"
          :label="$translateTitle('规格型号')"
          min-width="150"
        />
        <el-table-column
          prop="propertyLocalVal"
          :label="$translateTitle('物料属性')"
          min-width="150"
        />
        <el-table-column
          prop="typeName"
          :label="$translateTitle('物料类别')"
          min-width="100"
        />
        <el-table-column
          prop="inventoryUnit"
          :label="$translateTitle('基本单位')"
          min-width="100"
        />
        <el-table-column
          prop="enableBatch"
          :label="$translateTitle('启用批次')"
          min-width="100"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.enableBatch ? '是' : '否' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="enableSupple"
          :label="$translateTitle('启用辅助')"
          min-width="100"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.enableSupple ? '是' : '否' }}</span>
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
      :node="editItem"
      :refresh="getList"
    />
    <PopDetail :visible.sync="visibleDetail" :employee="currentEmployee" />
  </div>
</template>

<script>
  import PopEmployee from '../components/PopEmployee.vue'
  import PopDetail from '../components/PopDetail.vue'
  import { getMtList } from '../api'
  import { mapGetters } from 'vuex'
  export default {
    components: {
      PopEmployee,
      PopDetail,
    },
    props: {
      node: {
        type: Object,
        default: () => {},
      },
    },
    data() {
      return {
        //列表
        list: [],
        //搜索字段
        queryForm: {
          unitUnionCode: null,
          exemptCheck: '',
          mspecific: '',
          mtype: '',
          mproperty: '',
          materialName: '',
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
        editItem: null,
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
        // if (this.node) {
        let data = await getMtList({
          currentPage: this.search.page,
          pageSize: this.search.pageSize,
          materialGroup: this.node ? this.node.dataId : '',
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
        // }
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
      // add() {
      //   if (Array.isArray(this.selection) && this.selection.length > 0) {
      //     this.visibleEmployee = true
      //   } else {
      //     this.$msg({
      //       type: 'warning',
      //       message: this.$translateTitle(this.$cws.w109),
      //     })
      //   }
      // },
      edit() {
        if (Array.isArray(this.selection) && this.selection.length > 0) {
          this.visibleEmployee = true
          this.editItem = this.selection[0]
        } else {
          this.$msg({
            type: 'warning',
            message: this.$translateTitle(this.$cws.w109),
          })
        }
      },
      // del() {
      //   if (Array.isArray(this.selection) && this.selection.length > 0) {
      //     this.$confirm(this.$translateTitle(this.$cws.w101), {
      //       title: this.$translateTitle(this.$cws.w010),
      //       type: 'warning',
      //       center: true,
      //     })
      //       .then(() => {
      //         let ids = this.selection.map((item) => item.relationId).join(',')
      //         delLineUser({ ids })
      //         this.$msg({
      //           type: 'success',
      //           message: this.$translateTitle(this.$cws.w103),
      //         })
      //         this.getList()
      //       })
      //       .catch(() => {})
      //   } else {
      //     this.$msg({
      //       type: 'warning',
      //       message: this.$translateTitle(this.$cws.w109),
      //     })
      //   }
      // },
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
