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
          添加用户
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

    <el-table
      ref="tableSort"
      v-loading="listLoading"
      :data="list"
      style="width: 100%"
      :header-cell-style="{ background: '#adb7c0' }"
      stripe
      border
    >
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
          <!-- <el-tooltip content="查看" placement="top">
            <el-button type="text" @click="handleDetial(row)">
              <remix-icon
                icon-class="eye-fill"
                :style="{ fontSize: '18px', color: '#999' }"
              ></remix-icon>
            </el-button>
          </el-tooltip> -->
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
      :tit="'用户管理'"
      type="apply"
      @confirm="confirm"
    ></table-edit>
  </div>
</template>

<script>
  import _ from 'lodash'
  // import { doDelete, getList } from '@/api/table'
  import TableEdit from './userEdit.vue'
  import { userIndex, userEdit, userDel, userGroupList, userAdd } from './api'
  import dayjs from 'dayjs'

  export default {
    name: 'User',
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
            label: '姓名',
            prop: 'nickname',
          },
          {
            label: '角色',
            prop: 'groups_text',
            minWidth: '160',
          },

          {
            label: '电话',
            width: 'auto',
            prop: 'telephone',
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
        userIndex({
          datatype: 1,
          filter: JSON.stringify({}),
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
      handleDetial(row) {
        this.$refs['view'].show(row)
      },
      handleEdit(row) {
        this.$refs['edit'].showEdit(row)
      },
      confirm(data) {
        if (data.id) {
          userEdit(data).then((res) => {
            this.$baseMessage('编辑成功！', 'success')
            this.$refs.edit.close()
          })
        } else {
          userAdd(data).then((res) => {
            this.$baseMessage('添加成功！', 'success')
            this.$refs.edit.close()
          })
        }
        this.getList()
      },
      handleDelete(row) {
        if (row.user_id) {
          this.$baseConfirm('你确定要删除吗？', null, async () => {
            await userDel({ id: row.user_id })
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
        applyList({
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
