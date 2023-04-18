<template>
  <div class="custom-table-container">
    <div class="tabs">
      <div :class="!active ? 'cur' : ''" @click="handleTabs(0)">待填物流单</div>
      <div :class="active ? 'cur' : ''" @click="handleTabs(1)">已填物流单</div>
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
          <!-- <span v-if="item.label === '时间'">
            <span>{{ dayjs(row[item.prop]).format('YYYY-MM-DD') }}</span>
          </span> -->
          <span v-if="item.label === '是否审核'">
            <el-tag class="ml-2" :type="row[item.prop] ? 'success' : 'warning'">
              {{ row[item.prop] ? '已审核' : '未审核' }}
            </el-tag>
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
          <el-tooltip v-if="!active" content="填写物流信息" placement="top">
            <el-button type="text" @click="handleEdit(row)">
              <remix-icon
                icon-class="pages-line"
                :style="{ fontSize: '18px', color: '#3399d4' }"
              ></remix-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip
            v-if="active && !row.log_status"
            content="编辑"
            placement="top"
          >
            <el-button type="text" @click="handleEdit(row)">
              <remix-icon
                icon-class="edit-line"
                :style="{ fontSize: '18px' }"
              ></remix-icon>
            </el-button>
          </el-tooltip>
          <!-- <el-tooltip v-if="!active" content="删除" placement="top">
            <el-button
              type="text"
              :disabled="!!row.deliv_status"
              @click="handleDelete(row)"
            >
              <remix-icon
                icon-class="delete-bin-6-line"
                :style="{
                  fontSize: '18px',
                  color: !!row.deliv_status ? '#ddd' : '#d4483d',
                }"
              ></remix-icon>
            </el-button>
          </el-tooltip> -->
          <el-tooltip
            v-if="active && row.log_status"
            content="查看"
            placement="top"
          >
            <el-button type="text" @click="handleEdit(row, 'view')">
              <remix-icon
                icon-class="eye-fill"
                :style="{ fontSize: '18px', color: '#aaa' }"
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
      :tit="'物流信息'"
      :type="log_type"
      @confirm="confirm"
    ></table-edit>
  </div>
</template>

<script>
  import _ from 'lodash'
  import TableEdit from './edit.vue'
  import { applyAll, buslogisticsEdit } from './api'
  import dayjs from 'dayjs'

  export default {
    name: 'CustomTable',
    components: {
      TableEdit,
    },
    data() {
      return {
        active: 0,
        log_type: '',
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
            label: '单位',
            width: '80',
            prop: 'unit',
          },
          // // {
          //   label: '单价',
          //   width: 'auto',
          //   prop: 'price',
          // },
          // {
          //   label: '数量',
          //   width: 'auto',
          //   prop: 'nums',
          // },
          // {
          //   label: '时间',
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
          filter: JSON.stringify({
            // status: 1,
            out_status: 1,
            log_number: 'WL',
          }),
          op: JSON.stringify({
            log_number: this.active ? 'LIKE' : 'NOT LIKE',
          }),
          offset: (this.queryForm.pageNo - 1) * this.queryForm.pageSize,
          limit: this.queryForm.pageSize,
        }).then((res) => {
          res.rows.map((item) => {
            item.update_time = dayjs(item.update_time).format('YYYY-MM-DD')
          })
          this.list = res.rows
          this.total = res.total
          this.listLoading = false
        })
      },
      handleAdd() {
        this.$refs['edit'].show()
      },
      handleEdit(row, type) {
        if (type == 'view') {
          row.actionType = type
          this.log_type = type
        }
        this.$refs['edit'].show(row)
      },
      confirm(data) {
        if (data.id) {
          buslogisticsEdit({ ...data }).then((res) => {
            if (res) {
              this.$baseMessage('编辑成功！', 'success')
              this.getList()
              this.$refs.edit.close()
            }
          })
        }
      },
      handleDelete(row) {
        if (row.id) {
          this.$baseConfirm('你确定要删除当前项吗', null, async () => {
            await buslogisticsDel({ id: row.id })
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
        this.getList()
        if (active) {
          this.columns = [
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
              label: '单位',
              width: '80',
              prop: 'unit',
            },
            // {
            //   label: '单价',
            //   width: 'auto',
            //   prop: 'price',
            // },
            // {
            //   label: '数量',
            //   width: 'auto',
            //   prop: 'nums',
            // },
            // {
            //   label: '时间',
            //   width: 'auto',
            //   prop: 'update_time',
            // },
            {
              label: '是否审核',
              width: 'auto',
              prop: 'log_status',
            },
          ]
        } else {
          this.columns = [
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
              label: '单位',
              width: '80',
              prop: 'unit',
            },
            // // {
            //   label: '单价',
            //   width: 'auto',
            //   prop: 'price',
            // },
            // {
            //   label: '数量',
            //   width: 'auto',
            //   prop: 'nums',
            // },
            // {
            //   label: '时间',
            //   width: 'auto',
            //   prop: 'update_time',
            // },
          ]
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
