<template>
  <div class="custom-table-container">
    <!-- <core-query-form>
      <core-query-form-top-panel>
        <el-form
          ref="form"
          :inline="true"
          :model="queryForm"
          label-width="80px"
          @submit.native.prevent
        >
          <el-form-item label="标题">
            <el-input v-model="queryForm.title" placeholder="标题"></el-input>
          </el-form-item>
          <el-form-item label="XXX">
            <el-input placeholder="XXX"></el-input>
          </el-form-item>
          <el-form-item label="XXX">
            <el-input placeholder="XXX"></el-input>
          </el-form-item>
          <el-form-item label="XXX">
            <el-input placeholder="XXX"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-search"
              native-type="submit"
              type="primary"
              @click="handleQuery"
            >
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </core-query-form-top-panel>
      <core-query-form-left-panel>
        <el-button icon="el-icon-plus" type="primary" @click="handleAdd">
          添加
        </el-button>
        <el-button icon="el-icon-delete" type="danger" @click="handleDelete">
          删除
        </el-button>
      </core-query-form-left-panel>
      <core-query-form-right-panel>
        <el-popover popper-class="custom-table-checkbox" trigger="hover">
          <el-checkbox-group v-model="checkList">
            <el-checkbox
              v-for="(item, index) in columns"
              :key="index"
              :label="item.label"
            ></el-checkbox>
          </el-checkbox-group>
          <el-button slot="reference">
            <remix-icon icon-class="settings-line"></remix-icon>
          </el-button>
        </el-popover>
      </core-query-form-right-panel>
    </core-query-form> -->

    <el-table
      ref="tableSort"
      v-loading="listLoading"
      :data="list"
      @selection-change="setSelectRows"
    >
      <!-- <el-table-column
        align="center"
        type="selection"
        width="55"
      ></el-table-column> -->
      <el-table-column
        v-for="(item, index) in columns"
        :key="index"
        align="center"
        :label="item.label"
        :width="item.width"
      >
        <template #default="{ $index, row }">
          <span v-if="item.label === '序号'">{{ $index + 1 }}</span>
          <span v-else-if="item.label === '评级'">
            <el-rate v-model="row.rate" disabled></el-rate>
          </span>
          <span v-else-if="item.label === '头像'">
            <el-image :preview-src-list="imageList" :src="row.img"></el-image>
          </span>
          <span v-else>{{ row[item.prop] }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="操作"
        show-overflow-tooltip
        width="85"
      >
        <template #default="{ row }">
          <el-button type="text" @click="handleEdit(row)">编辑</el-button>
          <el-button type="text" @click="handleDelete(row)">删除</el-button>
          <el-button type="text" @click="handleDelete(row)">审核</el-button>
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
    <table-edit ref="edit"></table-edit>
  </div>
</template>

<script>
  import _ from 'lodash'
  import { doDelete, getList } from '@/api/table'
  import TableEdit from './components/TableEdit'

  export default {
    name: 'CustomTable',
    components: {
      TableEdit,
    },
    data() {
      return {
        checkList: [
          '序号',
          '收货单位（客户）',
          '作者',
          '评级',
          '头像',
          '点击量',
          '时间',
          '时间',
          '时间',
        ],
        columns: [
          {
            order: 1,
            label: '序号',
            width: '95',
            prop: '',
          },
          {
            order: 2,
            label: '收货单位（客户）',
            width: 'auto',
            prop: 'title',
          },
          {
            order: 3,
            label: '批号',
            width: 'auto',
            prop: 'author',
          },
          {
            order: 4,
            label: '货物名称',
            width: 'goodsName',
            prop: 'rate',
          },
          {
            order: 5,
            label: '规格',
            width: 'specifications',
            prop: 'img',
          },
          {
            order: 6,
            label: '重量',
            width: 'weight',
            prop: 'pageViews',
          },
          {
            order: 7,
            label: '单位(KG/T)',
            width: 'auto',
            prop: 'datetime',
          },
          {
            order: 8,
            label: '单价',
            width: 'price',
            prop: 'datetime',
          },
          {
            order: 9,
            label: '金额',
            width: 'total',
            prop: 'datetime',
          },
        ],
        list: [],
        imageList: [],
        listLoading: false,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
        queryForm: {
          pageNo: 1,
          pageSize: 10,
          title: '',
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
      //防止三级以上路由时多次走created
      // if (this.$route.name === this.$options.name) this.fetchData()
    },
    methods: {
      setSelectRows(val) {
        this.selectRows = val
      },
      handleAdd() {
        this.$refs['edit'].showEdit()
      },
      handleEdit(row) {
        this.$refs['edit'].showEdit(row)
      },
      handleDelete(row) {
        if (row.id) {
          this.$baseConfirm('你确定要删除当前项吗', null, async () => {
            const { msg } = await doDelete({ ids: row.id })
            this.$baseMessage(msg, 'success')
            await this.fetchData()
          })
        } else {
          if (this.selectRows.length > 0) {
            const ids = this.selectRows.map((item) => item.id).join()
            this.$baseConfirm('你确定要删除选中项吗', null, async () => {
              const { msg } = await doDelete({ ids: ids })
              this.$baseMessage(msg, 'success')
              await this.fetchData()
            })
          } else {
            this.$baseMessage('未选中任何行', 'error')
            return false
          }
        }
      },
      handleSizeChange(val) {
        this.queryForm.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryForm.pageNo = val
        this.fetchData()
      },
      handleQuery() {
        this.queryForm.pageNo = 1
        this.fetchData()
      },
      async fetchData() {
        this.listLoading = true
        const { data, totalCount } = await getList(this.queryForm)
        this.list = data
        const imageList = []
        data.forEach((item) => {
          imageList.push(item.img)
        })
        this.imageList = imageList
        this.total = totalCount
        this.listLoading = false
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
  }
</style>
<style lang="scss">
  .custom-table-checkbox {
    .el-checkbox {
      display: block !important;
      margin: 0 0 $base-padding/4 0;
    }
  }
</style>
