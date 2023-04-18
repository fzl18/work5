<template>
  <div class="custom-table-container">
    <div class="tabs">
      <div :class="!active ? 'cur' : ''" @click="handleTabs(0)">
        待审核物流单
      </div>
      <div :class="active ? 'cur' : ''" @click="handleTabs(1)">
        已审核物流单
      </div>
    </div>
    <el-table
      ref="tableSort"
      v-loading="listLoading"
      :data="list"
      style="width: 100%"
      :header-cell-style="{ background: '#adb7c0' }"
      stripe
      border
    >
      <!-- <el-table-column type="expand">
        <template #default="{ row }">
          <el-row class="expandInfo goods">
            <el-col :span="20" :offset="2" class="title">审核信息</el-col>
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
                  <template slot="label">实际运费</template>
                  {{ item.itemname }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">运费差额</template>
                  {{ item.format }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">发票日期</template>
                  {{ item.batchnum }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">发票号</template>
                  {{ item.weight }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">回单情况</template>
                  {{ item.unit }}
                </el-descriptions-item>
              </el-descriptions>
            </el-col>
          </el-row>
          <el-row v-if="false" class="expandInfo status">
            <el-col :span="18" :offset="3" class="title">状态信息</el-col>
            <el-col :span="18" :offset="3" class="tbody">
              <el-descriptions class="" :column="4" size="medium" border>
                <el-descriptions-item>
                  <template slot="label">审核</template>
                  <el-tag type="warning">{{ '未审核' }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">出库单</template>
                  <el-tag type="success">{{ '已开具' }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">送货单</template>
                  <el-tag type="success">{{ '已开具' }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">出门证</template>
                  <el-tag type="success">{{ '已开具' }}</el-tag>
                </el-descriptions-item>
              </el-descriptions>
            </el-col>
          </el-row>
        </template>
      </el-table-column> -->

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
        align="center"
        label="操作"
        show-overflow-tooltip
        :min-width="80"
      >
        <template #default="{ row }">
          <div
            style="display: flex; align-items: center; justify-content: center"
          >
            <!-- <el-divider direction="vertical"></el-divider> -->
            <el-tooltip v-if="!active" content="审核" placement="top">
              <el-button type="text" @click="handleEdit(row)">
                <remix-icon
                  icon-class="auction-fill"
                  :style="{ fontSize: '18px', color: 'rgb(244 191 2)' }"
                ></remix-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip v-if="active" content="编辑" placement="top">
              <el-button type="text" @click="handleEdit(row)">
                <remix-icon
                  icon-class="edit-2-fill"
                  :style="{ fontSize: '18px', color: '#3399d4' }"
                ></remix-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip v-if="active" content="重置" placement="top">
              <el-button type="text" @click="handleDelete(row)">
                <remix-icon
                  icon-class="delete-back-2-line"
                  :style="{ fontSize: '18px', color: 'red' }"
                ></remix-icon>
              </el-button>
            </el-tooltip>
            <!-- <el-tooltip v-if="active" content="查看" placement="top">
              <el-button type="text" @click="handleDetail(row)">
                <remix-icon
                  icon-class="eye-fill"
                  :style="{ fontSize: '18px', color: '#999' }"
                ></remix-icon>
              </el-button>
            </el-tooltip> -->
          </div>
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
    <table-edit ref="edit" type="review" @confirm="confirm"></table-edit>
  </div>
</template>

<script>
  import TableEdit from './edit.vue'
  import { applyAll, checkEdit, buslogisticsEdit, buslogisticsDel } from './api'
  import dayjs from 'dayjs'
  export default {
    name: 'CustomTable',
    components: {
      TableEdit,
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
            label: '运输单号',
            prop: 'log_number',
          },
          {
            label: '收货单位（客户）',
            prop: 'company',
            minWidth: '160',
          },

          {
            label: '收货地址',
            width: 'auto',
            prop: 'log_shipaddress',
          },
          {
            label: '车型',
            width: 'auto',
            prop: 'log_cmodel',
          },
          {
            label: '重量',
            width: 'auto',
            prop: 'log_weight',
          },
          {
            label: '运输公司',
            width: '120',
            prop: 'log_compy',
          },
          {
            label: '运费',
            width: 'auto',
            prop: 'log_freight',
          },
          // {
          //   label: '金额',
          //   width: 'auto',
          //   prop: 'amount',
          // },
          // {
          //   label: '审核时间',
          //   width: 'auto',
          //   prop: 'update_time',
          // },
        ],
        list: [],
        listLoading: false,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
        queryForm: {
          pageNo: 1,
          pageSize: 10,
        },
      }
    },
    computed: {
      // finallyColumns() {
      //   let finallyArray = []
      //   this.checkList.forEach((checkItem) => {
      //     finallyArray.push(
      //       this.columns.filter((item) => item.label === checkItem)[0]
      //     )
      //   })
      //   return finallyArray
      // },
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
        applyAll({
          datatype: 1,
          filter: JSON.stringify(
            this.active == 0
              ? { log_status: 0, status: 1, log_number: 'WL' }
              : { log_status: 1 }
          ),
          op: JSON.stringify({
            // rtn_uid: '<>',
            log_number: 'LIKE',
          }),
          offset: (this.queryForm.pageNo - 1) * this.queryForm.pageSize,
          limit: this.queryForm.pageSize,
        }).then((res) => {
          res.rows.map((item) => {
            // item.status = !!item.status
            // item.rtn_status = !!item.rtn_status
            if (item.logList.length) {
              item.log_cmodel = item.logList[0].cmodel
              item.log_weight = item.logList[0].weight
              item.log_freight = item.logList[0].freight
              item.log_compy = item.logList[0].compy
              item.log_shipaddress = item.logList[0].shipaddress
            }
          })
          this.list = res.rows
          this.total = res.total
          this.listLoading = false
        })
      },
      handleAdd() {
        this.$refs['edit'].show()
      },
      handleEdit(row) {
        this.$refs['edit'].show(row)
      },
      confirm(data) {
        if (data.id) {
          data.log_status = 1
          data.logList[0].idate = data.logList[0].idate / 1000
          buslogisticsEdit(data).then((res) => {
            if (res) {
              this.$refs.edit.close()
              this.getList()
              this.$baseMessage('编辑成功！', 'success')
            }
          })
        }
      },
      handleDelete(row) {
        if (row.id) {
          this.$baseConfirm('你确定要重置当前项吗', null, async () => {
            await buslogisticsDel({ id: row.id })
            this.$baseMessage('重置成功！', 'success')
            this.getList()
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
      handleDetail(row) {
        this.$refs['view'].show(row)
      },
      handleCheck(row) {
        if (this.active) {
          checkEdit({
            ...row,
            rtn_status: row.rtn_status ? 1 : 0,
            // status: row.status ? 1 : 0,
          }).then((res) => {
            this.$baseMessage('审核成功！', 'success')
            this.getList()
          })
        } else {
          checkEdit({
            ...row,
            status: row.status ? 1 : 0,
            // rtn_status: row.rtn_status ? 1 : 0,
          }).then((res) => {
            this.$baseMessage('审核成功！', 'success')
            this.getList()
          })
        }
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
