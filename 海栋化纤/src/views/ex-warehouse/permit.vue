<template>
  <div class="custom-table-container">
    <div class="tabs">
      <div :class="!active ? 'cur' : ''" @click="handleTabs(0)">待开出门证</div>
      <div :class="active ? 'cur' : ''" @click="handleTabs(1)">已开出门证</div>
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
                  <template slot="label">重量</template>
                  {{ row.weight }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">单位</template>
                  {{ row.unit }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    单价
                  </template>
                  {{ row.price }}
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
        :min-width="120"
      >
        <template #default="{ row }">
          <el-tooltip v-if="!active" content="开具出门证" placement="top">
            <el-button type="text" @click="handleEdit(row)">
              <remix-icon
                icon-class="book-read-line"
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
          </el-tooltip>
          <el-tooltip v-if="active" content="打印" placement="top">
            <el-button type="text" @click="handlePrint(row)">
              <remix-icon
                icon-class="printer-line"
                :style="{ fontSize: '18px', color: '#333' }"
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
      type="permit"
      :tit="'出门证'"
      @confirm="confirm"
    ></table-edit>
    <print-temp ref="print" type="permit"></print-temp>
  </div>
</template>

<script>
  import _ from 'lodash'
  import TableEdit from './edit.vue'
  import PrintTemp from './printTemp.vue'
  import { busppEdit, applyAll } from './api'
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
          {
            label: '重量',
            width: 'auto',
            prop: 'weight',
          },
          {
            label: '单位(KG/T)',
            width: '120',
            prop: 'unit',
          },
          // {
          //   label: '单价',
          //   width: 'auto',
          //   prop: 'price',
          // },
          {
            label: '件数',
            width: 'auto',
            prop: 'nums',
          },
          {
            label: '时间',
            width: 'auto',
            prop: 'update_time',
          },
        ],
        list: [{}],
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

    created() {
      this.getList()

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
              status: 1,
              out_status: 1,
              deliv_status: 1,
              pp_status: 1,
            }),
            offset: (this.queryForm.pageNo - 1) * this.queryForm.pageSize,
            limit: this.queryForm.pageSize,
          }).then((res) => {
            res.rows.map(
              (item) => (item.pp_time = dayjs(item.pp_time * 1000).format())
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
              pp_status: 0,
            }),
            offset: (this.queryForm.pageNo - 1) * this.queryForm.pageSize,
            limit: this.queryForm.pageSize,
          }).then((res) => {
            res.rows.map(
              (item) => (item.pp_time = dayjs(item.pp_time * 1000).format())
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
          busppEdit({ ...data, pp_status: 1 }).then((res) => {
            if (res) {
              this.$baseMessage('开具成功！', 'success')
              this.$refs.edit.close()
            }
          })
        }
        this.getList()
      },
      handleDelete(row) {
        if (row.id) {
          this.$baseConfirm('你确定要删除当前项吗', null, async () => {
            await busppEdit({ ...row, pp_status: 0 })
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

      handlePrint(row) {
        this.$refs.print.show(row)
      },
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
            label: '单号',
            prop: this.active == 1 ? 'pp_number' : 'number',
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
          {
            label: '重量',
            width: 'auto',
            prop: 'weight',
          },
          {
            label: '单位(KG/T)',
            width: '120',
            prop: 'unit',
          },
          // {
          //   label: '单价',
          //   width: 'auto',
          //   prop: 'price',
          // },
          {
            label: '件数',
            width: 'auto',
            prop: 'nums',
          },
          {
            label: '时间',
            width: 'auto',
            prop: this.active == 1 ? 'pp_time' : 'update_time',
          },
        ]
        this.getList()
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
