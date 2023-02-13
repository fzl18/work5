<template>
  <div class="app-container">
    <bt-page :title="$route.meta.title" :show-drawer="true">
      <template #option>
        <el-button type="primary" size="mini" @click="addFLow">
          新增流程
        </el-button>
      </template>
      <template slot="drawer">
        <el-form
          ref="searchQuery"
          :model="searchQuery"
          label-position="top"
          size="mini"
        >
          <el-form-item label="流程名称">
            <el-input v-model="searchQuery.flowGroupName" clearable></el-input>
          </el-form-item>
          <el-form-item label="流程状态">
            <el-select v-model="searchQuery.isRun" clearable>
              <el-option value="0" label="启用中"></el-option>
              <el-option value="1" label="已禁用"></el-option>
            </el-select>
          </el-form-item>

          <div class="bt-search_btn">
            <el-button class="" type="primary" @click="search">查询</el-button>
            <el-button class="" type="success" @click="handleReset">
              重置
            </el-button>
          </div>
        </el-form>
      </template>

      <bt-title title="全部文件">
        <!-- <el-dropdown @command="handleCommand">
          <span v-if="currentOrder" class="el-dropdown-link">
            {{ currentOrder.title }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="(item, index) in orderList"
              :key="index"
              :command="item"
            >
              {{ item.title }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown> -->
      </bt-title>
      <div class="flow-list">
        <div v-for="(item, index) in list" :key="index" class="flow-item-wrap">
          <flow-item :source-data="item" @update="getList"></flow-item>
        </div>
      </div>
      <bt-pagination
        :total="total"
        :page.sync="searchQuery.pageNum"
        :limit.sync="searchQuery.pageSize"
        @pagination="getList"
      ></bt-pagination>
    </bt-page>
  </div>
</template>
<script>
  import flowItem from './components/flowItem.vue'
  import { getFlowList, saveFlow } from '@/api/flow'
  export default {
    name: 'FLowList',
    components: {
      flowItem,
    },
    data() {
      return {
        searchQuery: {
          pageNum: 1,
          pageSize: 20,
          flowGroupName: '',
          isRun: '',
        },
        total: 0,
        list: [],
        orderList: [
          { title: '更新时间', value: 'updateTime' },
          { title: '创建时间', value: 'createTime' },
        ],
        currentOrder: null,
      }
    },
    async created() {
      this.getList()
      this.currentOrder = { ...this.orderList[0] }
    },
    methods: {
      async getList() {
        const { data } = await getFlowList(this.searchQuery)

        this.list = data.records || []
        this.total = data.total || 0
      },
      search() {
        this.searchQuery.pageNum = 1
        this.getList()
      },
      handleReset() {
        this.searchQuery.flowGroupName = ''
        this.searchQuery.isRun = ''
        this.search()
      },
      handleCommand(command) {
        console.log(command)
        this.currentOrder = { ...command }
        // switch (command) {
        //   default:

        //     return
        // }
      },

      addFLow() {
        this.$prompt('流程名称', '提示', {
          title: '新建流程',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPlaceholder: '请输入流程名称',
          inputPattern: /\S/,
          inputErrorMessage: '流程名称不能为空',
          center: true,
        }).then(async ({ value }) => {
          const postData = {
            flowGroupName: value,
          }
          const { data } = await saveFlow(postData)

          this.$nextTick(() => {
            this.$message.success('创建成功！')
            this.$router.push('/flow/index/' + data)
          })
        })
      },
    },
  }
</script>
<style lang="scss" scoped>
  .flow-list {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  .flow-item-wrap {
    width: 25%;
    flex: 1 1 25%px;
    // min-width: 200px;
    max-width: 400px;
    padding: 10px;
    &:nth-child(4n + 1) {
      padding-left: 0;
    }
    &:nth-child(4n + 4) {
      padding-right: 0;
    }
  }
</style>
