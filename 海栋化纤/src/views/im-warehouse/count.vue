<template>
  <div class="custom-table-container">
    <core-query-form class="queryForm">
      <core-query-form-top-panel>
        <el-form
          ref="form"
          :inline="true"
          :model="queryForm"
          label-width="80px"
          @submit.native.prevent
        >
          <el-form-item label="" prop="number">
            <el-input v-model="queryForm.number" placeholder="">
              <el-select
                slot="prepend"
                v-model="queryForm.type"
                placeholder="请选择"
                style="width: 110px"
                disabled
              >
                <el-option
                  v-for="(item, index) in typeOption"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-input>
          </el-form-item>
          <!-- <el-form-item>
            
          </el-form-item> -->
          <el-form-item label="供应商" prop="company">
            <el-input v-model="queryForm.company" placeholder=""></el-input>
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
          <!-- <el-form-item label="货物名称" prop="itemname">
            <el-input
              v-model="queryForm.itemname"
              placeholder="货物名称"
            ></el-input>
          </el-form-item> -->
          <!-- <el-form-item label="金额" prop="amount">
            <el-input v-model="queryForm.amount" placeholder="金额"></el-input>
          </el-form-item> -->
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
      <!-- <core-query-form-left-panel>
        <el-button
          icon="el-icon-plus"
          type="success"
          size="big"
          @click="handleAdd"
        >
          添加
        </el-button>
        <el-button icon="el-icon-delete" type="danger" @click="handleDelete">
          删除
        </el-button>
      </core-query-form-left-panel> -->
      <!-- <core-query-form-right-panel>
      </core-query-form-right-panel> -->
    </core-query-form>
    <!-- <div class="tabs">
      <div :class="!active ? 'cur' : ''" @click="handleTabs(0)">待开出库单</div>
      <div :class="active ? 'cur' : ''" @click="handleTabs(1)">已开出库单</div>
    </div> -->
    <el-table
      v-if="show"
      ref="tableSort"
      v-loading="listLoading"
      :data="list"
      style="width: 100%"
      :header-cell-style="{ background: '#adb7c0' }"
      :summary-method="getSummaries"
      stripe
      border
    >
      <el-table-column type="expand">
        <template #default="{ row }">
          <!-- <el-row class="expandInfo goods">
            <el-col :span="18" :offset="3" class="title">货物信息</el-col>
            <el-col :span="18" :offset="3" class="tbody">
              <el-descriptions class="" :column="4" size="medium" border>
                <el-descriptions-item>
                  <template slot="label">
                    规格
                  </template>
                  {{ row.format }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    重量
                  </template>
                  {{ row.weight }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    单位
                  </template>
                  {{ row.unit }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    单价
                  </template>
                  {{ row.price }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    件数
                  </template>
                  {{ row.nums }}
                </el-descriptions-item>
              </el-descriptions>
            </el-col>
          </el-row> -->
          <el-row class="expandInfo status">
            <el-col :span="18" :offset="3" class="title">状态信息</el-col>
            <el-col :span="18" :offset="3" class="tbody">
              <el-descriptions class="" :column="4" size="medium" border>
                <el-descriptions-item>
                  <template slot="label">审核</template>
                  <el-tag :type="row.status ? 'success' : 'warning'">
                    {{ row.status ? '已审核' : '未审核' }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">出库单</template>
                  <el-tag :type="row.out_status ? 'success' : 'warning'">
                    {{ row.out_status ? '已开具' : '未开具' }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">送货单</template>
                  <el-tag :type="row.deliv_status ? 'success' : 'warning'">
                    {{ row.deliv_status ? '已开具' : '未开具' }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <!-- <i class="el-icon-office-building"></i> -->
                    出门证
                  </template>
                  <el-tag :type="row.pp_status ? 'success' : 'warning'">
                    {{ row.pp_status ? '已开具' : '未开具' }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <!-- <i class="el-icon-office-building"></i> -->
                    退货单
                  </template>
                  <el-tag :type="row.rtn_status ? 'success' : 'warning'">
                    {{ row.rtn_status ? '已开具' : '未开具' }}
                  </el-tag>
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
        align="center"
        label="操作"
        show-overflow-tooltip
        :min-width="80"
      >
        <template #default="{ row }">
          <!-- <el-tooltip v-if="!active" content="开具出库单" placement="top">
            <el-button type="text" @click="handleEdit(row)">
              <remix-icon
                icon-class="pages-line"
                :style="{ fontSize: '18px', color: '#3399d4' }"
              ></remix-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip v-if="active" content="删除" placement="top">
            <el-button type="text" @click="handleDelete(row)">
              <remix-icon
                icon-class="delete-bin-6-line"
                :style="{ fontSize: '18px', color: '#d4483d' }"
              ></remix-icon>
            </el-button>
          </el-tooltip> -->
          <el-tooltip content="查看" placement="top">
            <el-button type="text" @click="handleDetail(row)">
              <remix-icon
                icon-class="eye-fill"
                :style="{ fontSize: '18px', color: '#999' }"
              ></remix-icon>
            </el-button>
          </el-tooltip>
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
      :tit="'送货申请单'"
      type="fahuo"
      @confirm="confirm"
    ></table-edit>
    <PrintTemp ref="view" tit="单证详情" type="view"></PrintTemp>
  </div>
</template>

<script>
  import _ from 'lodash'
  import TableEdit from './edit.vue'
  import PrintTemp from './printTemp.vue'
  import { busoutboundEdit, importAll } from './api'
  import dayjs from 'dayjs'

  export default {
    name: 'CustomTable',
    components: {
      TableEdit,
      PrintTemp,
    },
    data() {
      return {
        show: false,
        columns: [
          {
            label: '序号',
            width: '80',
            prop: '',
          },
          // {
          //   label: '批号',
          //   prop: 'batchnum',
          // },
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
          date: [],
          type: 'number',
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
        typeOption: [
          { label: '入库单号', value: 'number' },
          { label: '出库单', value: 'out_number' },
          { label: '送货单', value: 'deliv_number' },
          { label: '出门证', value: 'pp_number' },
          { label: '退货申请单', value: 'rtn_number' },
        ],
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
        // console.log(this.queryForm.type)
        let val = ''
        let time = ''
        if (!this.queryForm.number) {
          switch (this.queryForm.type) {
            case 'number':
              val = 'RK'
              time = 'create_time'
              break
            case 'out_number':
              val = 'CK'
              time = 'out_time'
              break
            case 'deliv_number':
              val = 'HDCF'
              time = 'deliv_time'
              break
            case 'pp_number':
              val = 'CM'
              time = 'pp_time'
              break
            case 'rtn_number':
              val = 'TH'
              time = 'rtn_time'
              break
            default:
              break
          }
        }
        importAll({
          datatype: 1,
          filter: JSON.stringify({
            company: this.queryForm.company,
            [this.queryForm.type]: this.queryForm.number || val,
            // number: this.queryForm.batchnum,
            // deliv_number: this.queryForm.itemname,
            // pp_number: this.queryForm.amount,
            [time]: this.queryForm.date.length
              ? `${Math.floor(this.queryForm.date[0] / 1000)},${Math.floor(
                  this.queryForm.date[1] / 1000
                )}`
              : '',
          }),
          op: JSON.stringify({
            company: 'LIKE',
            [this.queryForm.type]: 'LIKE',
            [time]: 'BETWEEN',
            // amount: 'LIKE',
          }),
          offset: (this.queryForm.pageNo - 1) * this.queryForm.pageSize,
          limit: this.queryForm.pageSize,
        }).then((res) => {
          this.list = res.rows
          this.total = res.total
          this.listLoading = false
        })
      },
      handleAdd() {
        this.$refs['edit'].showEdit()
      },
      handleEdit(row) {
        this.$refs['edit'].showEdit(row)
      },
      confirm(data) {
        if (data.id) {
          busoutboundEdit({ ...data, out_status: 1 }).then((res) => {
            this.$baseMessage('开具成功！', 'success')
          })
        }
        this.getList()
      },
      handleDelete(row) {
        if (row.id) {
          this.$baseConfirm('你确定要删除当前项吗', null, async () => {
            await busoutboundEdit({ ...row, out_status: 0 })
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

      handleDetail(row) {
        this.$refs['view'].show(row)
      },

      handleQuery() {
        this.show = true
        this.columns = [
          {
            label: '序号',
            width: '80',
            prop: '',
          },
          {
            label: '单号',
            prop: this.queryForm.type,
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
        ]
        this.getList()
      },
      getSummaries(param) {
        const { columns, data } = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计'
            return
          }
          const values = data.map((item) => Number(item[column.property]))
          if (!values.every((value) => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            sums[index] += ' 元'
          } else {
            sums[index] = ''
          }
        })
        return sums
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
    .queryForm {
      // background: #ebf0f3;
      padding-top: 20px;
      margin-bottom: 20px;
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
