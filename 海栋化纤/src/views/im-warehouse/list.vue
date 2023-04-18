<template>
  <div class="custom-table-container">
    <core-query-form>
      <core-query-form-top-panel>
        <el-button
          icon="el-icon-plus"
          type="success"
          size="big"
          @click="handleAdd"
        >
          新建
        </el-button>
        <!-- <el-form
          ref="form"
          :inline="true"
          :model="queryForm"
          label-width="80px"
          @submit.native.prevent
        >
          <el-form-item label="单号" prop="number">
            <el-input v-model="queryForm.number" placeholder="单号"></el-input>
          </el-form-item>
          <el-form-item label="收货单位" prop="company">
            <el-input
              v-model="queryForm.company"
              placeholder="（客户）"
            ></el-input>
          </el-form-item>
          <el-form-item label="货物名称" prop="itemname">
            <el-input
              v-model="queryForm.itemname"
              placeholder="货物名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="金额" prop="amount">
            <el-input v-model="queryForm.amount" placeholder="金额"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-search"
              native-type="submit"
              type="primary"
              @click="handleQuery('form')"
            >
              查询
            </el-button>
          </el-form-item>
        </el-form> -->
      </core-query-form-top-panel>
    </core-query-form>
    <!-- 
    <div class="tabs">
      <div :class="!active ? 'cur' : ''" @click="handleTabs(0)">待审核</div>
      <div :class="active ? 'cur' : ''" @click="handleTabs(1)">已审核</div>
    </div> -->
    <el-table
      ref="tableSort"
      v-loading="listLoading"
      :data="list"
      style="width: 100%"
      :header-cell-style="{ background: '#adb7c0' }"
      stripe
      border
    >
      <el-table-column type="expand">
        <template #default="{ row }">
          <el-row class="expandInfo goods">
            <el-col :span="20" :offset="2" class="title">货物信息</el-col>
            <el-col :span="20" :offset="2" class="tbody">
              <el-descriptions
                v-for="(item, index) in row.goodsList"
                :key="index"
                class=""
                :column="6"
                size="medium"
                border
              >
                <el-descriptions-item>
                  <template slot="label">
                    <!-- <i class="el-icon-office-building"></i> -->
                    货物名称
                  </template>
                  {{ item.itemname }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <!-- <i class="el-icon-office-building"></i> -->
                    规格
                  </template>
                  {{ item.format }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <!-- <i class="el-icon-office-building"></i> -->
                    批号
                  </template>
                  {{ item.batchnum }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <!-- <i class="el-icon-office-building"></i> -->
                    重量
                  </template>
                  {{ item.weight }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <!-- <i class="el-icon-office-building"></i> -->
                    单位
                  </template>
                  {{ item.unit }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <!-- <i class="el-icon-office-building"></i> -->
                    单价
                  </template>
                  {{ item.price }}
                </el-descriptions-item>
              </el-descriptions>
            </el-col>
          </el-row>
          <el-row v-if="false" class="expandInfo status">
            <el-col :span="18" :offset="3" class="title">状态信息</el-col>
            <el-col :span="18" :offset="3" class="tbody">
              <el-descriptions class="" :column="4" size="medium" border>
                <el-descriptions-item>
                  <template slot="label">
                    <!-- <i class="el-icon-office-building"></i> -->
                    审核
                  </template>
                  <el-tag type="warning">{{ '未审核' }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <!-- <i class="el-icon-office-building"></i> -->
                    出库单
                  </template>
                  <el-tag type="success">{{ '已开具' }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <!-- <i class="el-icon-office-building"></i> -->
                    送货单
                  </template>
                  <el-tag type="success">{{ '已开具' }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <!-- <i class="el-icon-office-building"></i> -->
                    出门证
                  </template>
                  <el-tag type="success">{{ '已开具' }}</el-tag>
                </el-descriptions-item>
              </el-descriptions>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column
        v-for="(item, index) in columns"
        v-show="item.show"
        :key="index"
        align="center"
        :label="item.label"
        :min-width="item.minWidth"
        :width="item.width"
      >
        <template #default="{ $index, row }">
          <span v-if="item.label === '序号'">
            {{ (queryForm.pageNo - 1) * queryForm.pageSize + $index + 1 }}
          </span>
          <span v-if="item.label === '时间'">
            {{ dayjs(row[item.prop]).format('YYYY-MM-DD') }}
          </span>
          <span v-else>{{ row[item.prop] }}</span>
        </template>
      </el-table-column>

      <el-table-column
        v-if="active"
        align="center"
        label="操作"
        show-overflow-tooltip
        :min-width="130"
      >
        <template #default="{ row }">
          <el-tooltip content="查看" placement="top">
            <el-button type="text" @click="handleDetial(row)">
              <remix-icon
                icon-class="eye-fill"
                :style="{ fontSize: '18px', color: '#999' }"
              ></remix-icon>
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        v-if="!active"
        align="center"
        label="操作"
        show-overflow-tooltip
        :min-width="130"
      >
        <template #default="{ row }">
          <el-tooltip content="查看" placement="top">
            <el-button type="text" @click="handleDetial(row)">
              <remix-icon
                icon-class="eye-fill"
                :style="{ fontSize: '18px', color: '#999' }"
              ></remix-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip content="编辑" placement="top">
            <el-button type="text" @click="handleEdit(row)">
              <remix-icon
                icon-class="edit-2-fill"
                :style="{ fontSize: '18px', color: '#3399d4' }"
              ></remix-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button type="text" @click="handleDelete(row)">
              <remix-icon
                icon-class="delete-bin-6-line"
                :style="{ fontSize: '18px', color: '#d4483d' }"
              ></remix-icon>
            </el-button>
          </el-tooltip>
          <!-- <el-tooltip content="审核" placement="top">
            <el-button type="text" @click="handleDelete(row)">
              <remix-icon
                icon-class="auction-line"
                :style="{ fontSize: '18px', color: '#d4a45b' }"
              ></remix-icon>
            </el-button>
          </el-tooltip> -->
          <!-- <el-tooltip content="开出库单" placement="top">
            <el-button type="text" @click="handleDelete(row)">
              <remix-icon
                icon-class="pages-line"
                :style="{ fontSize: '18px', color: '#004ed4' }"
              ></remix-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip content="开送货单" placement="top">
            <el-button type="text" @click="handleDelete(row)">
              <remix-icon
                icon-class="truck-line"
                :style="{ fontSize: '18px', color: '#60d453' }"
              ></remix-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip content="开出门证" placement="top">
            <el-button type="text" @click="handleDelete(row)">
              <remix-icon
                icon-class="book-read-line"
                :style="{ fontSize: '18px', color: '#d411ce' }"
              ></remix-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip content="打印" placement="top">
            <el-button type="text" @click="handlePrint(row)">
              <remix-icon
                icon-class="printer-line"
                :style="{ fontSize: '18px', color: '#333' }"
              ></remix-icon>
            </el-button>
          </el-tooltip> -->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="queryForm.pageNo"
      :layout="layout"
      :page-size="queryForm.pageSize"
      :total="total"
      background
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    ></el-pagination>
    <table-edit
      ref="edit"
      :is-edit="true"
      :tit="'入库单'"
      type="import"
      @confirm="confirm"
    ></table-edit>
    <PrintTemp ref="view" tit="入库单" type="view"></PrintTemp>
  </div>
</template>

<script>
  import _ from 'lodash'
  // import { doDelete, getList } from '@/api/table'
  import TableEdit from './edit.vue'
  import PrintTemp from './printTemp.vue'
  import { importList, importAdd, importEdit, importDel } from './api'
  import dayjs from 'dayjs'

  export default {
    name: 'CustomTable',
    components: {
      TableEdit,
      PrintTemp,
    },
    data() {
      return {
        active: 0,
        columns: [
          {
            label: '序号',
            width: '50',
            prop: '',
          },
          {
            label: '单号',
            prop: 'number',
          },
          {
            label: '供应商',
            prop: 'company',
            minWidth: '160',
          },

          {
            label: '货物名称',
            width: 'auto',
            prop: 'itemname',
          },
          {
            label: '规格',
            width: 'auto',
            prop: 'format',
          },
          // {
          //   label: '重量',
          //   width: 'auto',
          //   prop: 'weight',
          // },
          // {
          //   label: '单位(KG/T)',
          //   width: '120',
          //   prop: 'unit',
          // },
          // {
          //   label: '单价',
          //   width: 'auto',
          //   prop: 'price',
          // },
          // {
          //   label: '金额',
          //   width: 'auto',
          //   prop: 'amount',
          // },
          {
            label: '时间',
            width: 'auto',
            prop: 'update_time',
          },
        ],
        list: [
          {
            lotNumber: '批号de-32343',
            customName: '牛XX的客户',
            unit: '元',
            weight: '42KG',
            goodsName: '货物名称',
            specifications: '323 x 843',
            total: 1221,
            price: 5895,
          },
        ],
        listLoading: false,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
        queryForm: {
          pageNo: 1,
          pageSize: 10,
          amount: '',
          batchnum: '',
          itemname: '',
          company: '',
        },
      }
    },
    computed: {
      finallyColumns() {
        let finallyArray = []
        this.checkList.forEach((checkItem) => {
          finallyArray.push(
            this.columns.filter((item) => item.label === checkItem)[0]
          )
        })
        return finallyArray
      },
    },
    created() {
      this.getList()
      //防止三级以上路由时多次走created
      // if (this.$route.name === this.$options.name) this.fetchData()
    },
    methods: {
      dayjs,
      getList() {
        this.listLoading = true
        importList({
          datatype: 1,
          filter: JSON.stringify({ status: this.active }),
          offset: (this.queryForm.pageNo - 1) * this.queryForm.pageSize,
          limit: this.queryForm.pageSize,
        }).then((res) => {
          this.list = res.rows
          this.total = res.total
          this.listLoading = false
        })
      },
      handleAdd() {
        let form = {
          company: '',
          goodsList: [
            {
              itemname: '',
              format: '',
              weight: 0,
              price: 0,
              amount: 0,
              unit: '',
              nums: 0,
              batchnum: '',
              remark: '',
            },
          ],
        }
        this.$refs['edit'].showEdit(form)
      },
      handleDetial(row) {
        this.$refs['view'].show(row)
      },
      handleEdit(row) {
        this.$refs['edit'].showEdit(row)
      },
      confirm(data) {
        if (data.id) {
          importEdit(data).then((res) => {
            this.$baseMessage('编辑成功！', 'success')
            this.$refs.edit.close()
          })
        } else {
          importAdd(data).then((res) => {
            this.$baseMessage('添加成功！', 'success')
            this.$refs.edit.close()
          })
        }
        this.getList()
      },
      handleDelete(row) {
        if (row.id) {
          this.$baseConfirm('你确定要删除当前项吗', null, async () => {
            await importDel({ id: row.id })
            this.$baseMessage('删除成功！', 'success')
            await this.getList()
          })
        }
      },
      handleSizeChange(val) {
        this.queryForm.pageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.queryForm.pageNo = val
        this.getList()
      },

      handlePrint(row) {},
      handleTabs(active) {
        this.active = active
        this.queryForm.pageNo = 1
        this.getList()
      },
      handleQuery() {
        this.listLoading = true
        importList({
          datatype: 1,
          filter: JSON.stringify({ status: this.active }),
          offset: (this.queryForm.pageNo - 1) * this.queryForm.pageSize,
          limit: this.queryForm.pageSize,
        }).then((res) => {
          this.list = res.rows
          this.total = res.total
          this.listLoading = false
        })
      },
    },
  }
</script>
<style lang="scss" scoped>
  .custom-table-container {
    ::v-deep {
      i {
        cursor: pointer;
      }
    }
    .tabs {
      display: flex;
      justify-content: center;
      > div {
        margin: 0 0 20px 0;
        background: #ddd;
        padding: 12px 50px;
        cursor: pointer;
        &.cur {
          background: rgb(0, 127, 232);
          color: #fff;
        }
        &:nth-child(1) {
          border-radius: 4px 0 0 4px;
        }
        &:nth-child(2) {
          border-radius: 0 4px 4px 0;
        }
      }
    }
    .expandInfo {
      .title {
        font-size: 15px;
        padding: 5px 10px;
        margin-top: 10px;
        background: rgb(228, 235, 239);
        font-weight: bold;
        border-radius: 10px 10px 0 0;
      }
    }
  }
</style>
