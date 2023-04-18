<template>
  <div class="custom-table-container">
    <div class="tabs">
      <div :class="!active ? 'cur' : ''" @click="handleTabs(0)">
        查找已完成送货单
      </div>
      <div :class="active ? 'cur' : ''" @click="handleTabs(1)">已开退货单</div>
    </div>
    <core-query-form v-if="!active" class="queryForm">
      <core-query-form-top-panel>
        <el-form
          ref="form"
          :inline="true"
          :model="queryForm"
          label-width="80px"
          @submit.native.prevent
        >
          <el-form-item label="送货单号" prop="deliv_number">
            <el-input v-model="queryForm.deliv_number"></el-input>
          </el-form-item>
          <el-form-item label="收货单位" prop="company">
            <el-input
              v-model="queryForm.company"
              placeholder="（客户）"
            ></el-input>
          </el-form-item>
          <el-form-item label="日期" prop="date">
            <el-date-picker
              v-model="queryForm.date"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              format="yyyy 年 MM 月 dd 日"
              value-format="timestamp"
              :default-time="['00:00:00', '23:59:59']"
            ></el-date-picker>
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
        </el-form>
      </core-query-form-top-panel>
    </core-query-form>
    <el-table
      v-if="list.length || active"
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
          <!-- <el-row v-if="active" class="expandInfo goods">
            <el-col :span="18" :offset="3" class="title">退货信息</el-col>
            <el-col :span="18" :offset="3" class="tbody">
              <el-descriptions class="" :column="4" size="medium" border>
                <el-descriptions-item>
                  <template slot="label">
                    回单
                  </template>
                  {{ row.format }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    收货地址
                  </template>
                  {{ row.weight }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    车型
                  </template>
                  {{ row.unit }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    运输公司
                  </template>
                  {{ row.price }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    运费
                  </template>
                  {{ row.price }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    邮寄费
                  </template>
                  {{ row.price }}
                </el-descriptions-item>
              </el-descriptions>
            </el-col>
          </el-row> -->
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
          <el-tooltip v-if="!active" content="开具退货单" placement="top">
            <el-button type="text" @click="handleEdit(row)">
              <remix-icon
                icon-class="share-forward-box-line"
                :style="{ fontSize: '18px', color: '#3399d4' }"
              ></remix-icon>
            </el-button>
          </el-tooltip>
          <!-- <el-tooltip v-if="active" content="打印" placement="top">
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
      v-if="list.length"
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
      :tit="'退货申请单'"
      type="return"
      @confirm="confirm"
    ></table-edit>
    <PrintTemp
      ref="return"
      tit="送货申请单"
      :type="!active ? 'view' : 'return'"
    ></PrintTemp>
  </div>
</template>

<script>
  import _ from 'lodash'
  import TableEdit from './edit.vue'
  import PrintTemp from './printTemp.vue'
  import { busrtnEdit, applyAll } from './api'
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
            label: '送货单号',
            prop: 'deliv_number',
          },
          {
            label: '收货单位（客户）',
            prop: 'company',
            minWidth: '160',
          },

          {
            label: '货物名称',
            width: 'auto',
            prop: 'itemname',
          },
          // {
          //   label: '规格',
          //   width: 'auto',
          //   prop: 'specifications',
          // },
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
        list: [],
        listLoading: false,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
        queryForm: {
          pageNo: 1,
          pageSize: 10,
          company: '',
          deliv_number: '',
        },
        pickerOptions: {
          shortcuts: [
            {
              text: '最近一周',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                picker.$emit('pick', [start, end])
              },
            },
            {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                picker.$emit('pick', [start, end])
              },
            },
            {
              text: '最近三个月',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                picker.$emit('pick', [start, end])
              },
            },
          ],
        },
      }
    },

    created() {
      // this.getList()
      //防止三级以上路由时多次走created
      // if (this.$route.name === this.$options.name) this.fetchData()
    },
    methods: {
      dayjs,
      getList() {
        this.listLoading = true
        if (this.active) {
          applyAll({
            datatype: 1,
            filter: JSON.stringify({
              pp_status: 1,
              rtn_uid: 0,
            }),
            op: JSON.stringify({
              rtn_uid: '<>',
            }),
            offset: (this.queryForm.pageNo - 1) * this.queryForm.pageSize,
            limit: this.queryForm.pageSize,
          }).then((res) => {
            res.rows.map(
              (item) => (item.rtn_time = dayjs(item.rtn_time * 1000).format())
            )
            this.list = res.rows
            this.total = res.total
            this.listLoading = false
          })
        } else {
          applyAll({
            datatype: 1,
            filter: JSON.stringify({
              status: 1,
              out_status: 1,
              deliv_status: 1,
              company: this.queryForm.company,
              deliv_number: this.queryForm.deliv_number,
              deliv_time: this.queryForm.date
                ? `${Math.floor(this.queryForm.date[0] / 1000)},${Math.floor(
                    this.queryForm.date[1] / 1000
                  )}`
                : '',
              // ...this.queryForm,
              pp_status: 1,
              rtn_status: 0,
            }),
            op: JSON.stringify({
              deliv_time: 'BETWEEN',
              company: 'LIKE',
              deliv_number: 'LIKE',
            }),
            offset: (this.queryForm.pageNo - 1) * this.queryForm.pageSize,
            limit: this.queryForm.pageSize,
          }).then((res) => {
            res.rows.map(
              (item) => (item.rtn_time = dayjs(item.rtn_time * 1000).format())
            )
            this.list = res.rows
            this.total = res.total
            this.listLoading = false
          })
        }
      },
      handleAdd() {
        this.$refs['edit'].showEdit()
      },
      handleEdit(row) {
        this.$refs['edit'].showEdit(row)
      },
      confirm(data) {
        if (data.id) {
          busrtnEdit({ ...data, rtn_status: 0 }).then((res) => {
            if (res) {
              this.$refs.edit.close()
              this.$baseMessage('开具成功！', 'success')
            }
          })
        }
        this.getList()
      },
      handleDelete(row) {
        if (row.id) {
          this.$baseConfirm('你确定要删除当前项吗', null, async () => {
            await busrtnEdit({ ...row, rtn_status: 0 })
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
        this.columns = [
          {
            label: '序号',
            width: '50',
            prop: '',
          },
          {
            label: active ? '退货单号' : '送货单号',
            prop: active ? 'rtn_number' : 'deliv_number',
          },
          {
            label: '收货单位（客户）',
            prop: 'company',
            minWidth: '160',
          },

          {
            label: '货物名称',
            width: 'auto',
            prop: 'itemname',
          },
          {
            label: '金额',
            width: 'auto',
            prop: 'amount',
          },
          {
            label: '时间',
            width: 'auto',
            prop: 'update_time',
          },
        ]
        if (active) {
          this.getList()
        } else {
          this.list = []
          // this.handleQuery()
        }
      },
      handleQuery() {
        this.getList()
      },
      handleDetial(row) {
        this.$refs['return'].show(row)
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
