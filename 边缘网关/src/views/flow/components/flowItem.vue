<template>
  <div class="flow-item">
    <div class="flow-item-title">
      <div class="flow-title-content">
        {{ sourceData.flowGroupName }}
      </div>

      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          <i class="el-icon-s-tools remix-icon"></i>
          <!-- <remix-icon icon-class="menu-line" class="remix-icon"></remix-icon> -->
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="(item, index) in commandList"
            :key="index"
            :command="item"
          >
            <remix-icon :icon-class="item.icon"></remix-icon>
            {{ item.title }}
          </el-dropdown-item>

          <el-dropdown-item
            v-if="sourceData.isRun === 0"
            :command="{ value: 'disable' }"
          >
            <remix-icon icon-class="lock-line"></remix-icon>
            禁用流程
          </el-dropdown-item>
          <el-dropdown-item v-else :command="{ value: 'enable' }">
            <remix-icon icon-class="lock-unlock-line"></remix-icon>
            启用流程
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="flow-item-subtitle">
      <span class="flow-title-time">
        创建于
        {{
          sourceData.createTime
            ? dayjs(sourceData.createTime).format('YYYY-MM-DD HH:mm:ss')
            : ''
        }}
      </span>

      <span
        class="flow-title-status"
        :class="{ active: sourceData.isRun == 0 }"
      >
        {{ sourceData.isRun == 0 ? '启用中' : '未启用' }}
      </span>
    </div>

    <div class="screen-shot">
      <img
        v-if="sourceData.flowGroupIcon && sourceData.flowGroupIcon !== ''"
        :src="imgBaseURL + sourceData.flowGroupIcon"
        alt=""
      />
      <p v-else class="no-image">暂无图片</p>
    </div>
  </div>
</template>
<script>
  import { saveFlow, deleteFlow, toggleFlowStatus } from '@/api/flow'
  export default {
    name: 'FlowItem',
    props: {
      sourceData: {
        type: Object,
        default: () => {
          return {
            createTime: null,
            creater: null,
            flowGroupIcon: null,
            flowGroupName: null,
            id: null,
            isDel: null,
            isRun: null,
            updateTime: null,
            updater: null,
          }
        },
      },
    },
    data() {
      return {
        commandList: [
          { title: '编辑', value: 'edit', icon: 'edit-line' },
          { title: '重命名', value: 'rename', icon: 'layout-3-line' },
          { title: '删除', value: 'delete', icon: 'delete-bin-7-line' },
          // { title: '创建副本', value: 'copy', icon: 'file-line' },
        ],
        imgBaseURL: window.imgBaseURL || process.env.VUE_APP_IMG_BASE_URL,
      }
    },
    methods: {
      async enable(record) {
        await toggleFlowStatus({
          id: record.id,
          isRun: 0,
        })
        this.$message.success('启用成功！')
        this.$emit('update')
      },
      async disable(record) {
        await toggleFlowStatus({
          id: record.id,
          isRun: 1,
        })
        this.$message.success('禁用成功！')
        this.$emit('update')
      },
      handleCommand(command) {
        this[command.value] && this[command.value](this.sourceData)
      },
      rename(record) {
        this.$prompt('请输入流程名称', '提示', {
          title: '重命名',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: record.flowGroupName,
          inputPattern: /\S/,
          inputErrorMessage: '流程名称不能为空',
          center: true,
        }).then(async ({ value }) => {
          const postData = {
            id: record.id,
            flowGroupName: value,
          }
          await saveFlow(postData)

          this.$nextTick(() => {
            this.$message.success('更新成功！')
            this.$emit('update')
          })
        })
      },
      copy() {},
      delete(record) {
        this.$confirm(`确认删除流程${record.flowGroupName}吗?`, {
          title: '警告',
          type: 'warning',
          center: true,
        }).then(async () => {
          await deleteFlow(record.id)
          this.$message.success('删除成功！')
          this.$emit('update')
        })
      },
      edit(record) {
        // console.log('edit')
        this.$router.push({
          path: '/flow/index/' + record.id,
        })
      },
    },
  }
</script>
<style lang="scss" scoped>
  .flow {
    &-item {
      box-shadow: 0px 2px 6px 0px rgba(72, 126, 194, 0);
      border: 2px solid #ccd5db;
      padding-bottom: 10px;

      .remix-icon {
        color: #818182;
        font-size: 16px;
      }
      &-title {
        padding: 10px 10px 0;
        font-size: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      &-subtitle {
        padding: 10px 10px 0;
        // margin-top: 10px;
        color: #818182;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .screen-shot {
        padding: 0 10px;
        width: 100%;
        height: 160px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-top: 2px solid #ccd5db;

        margin-top: 10px;
        img {
          margin-top: 10px;
          width: 100%;
          max-height: 150px;
        }
        .no-image {
          text-align: center;
          color: #828283;
        }
      }
    }

    &-title-content {
      width: calc(100% - 26px);
      flex: 1 1 calc(100% - 26px);
      margin-right: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &-title-status {
      width: 50px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      margin-left: 5px;
      border-radius: 2px;
      font-size: 12px;
      background-color: #f7f7f7;
      color: #a6aeb8;
      border: 1px solid #ccd5db;
      &.active {
        background-color: #effaf6;
        color: #2bc481;
        border: 1px solid #2bc481;
      }
    }
  }
</style>
