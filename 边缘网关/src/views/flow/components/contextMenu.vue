<template>
  <div class="context-menu-container">
    <div @click="doDelete">
      <i class="el-icon-delete"></i>
      删除
    </div>
  </div>
</template>
<script>
  import { deleteNode } from '@/api/flow'
  export default {
    inject: ['getGraph', 'getNode'],
    props: {
      top: {
        type: Number,
        default: -10000,
      },
      left: {
        type: Number,
        default: -10000,
      },
    },
    data() {
      return {
        currentCellId: null,
        cellData: null,
        cellType: null,
      }
    },
    mounted() {
      const self = this
      const node = this.getNode()

      const { currentCellId, cellData, cellType } = node.getData() //所有外部数据,都通过data透传
      self.currentCellId = currentCellId
      self.cellData = cellData
      self.cellType = cellType
    },
    methods: {
      /**
       * * 节点(node)和边(edge)的删除业务不一样,由于只有node存在数据库中:
       * * 删除node必须调用后端接口
       * * 删除边在视图中直接删除即可
       * * 节点和边删除后需要走一次全局保存
       */
      doDelete() {
        // const node = this.getNode() //这个node是右键菜单本身的node
        const graph = this.getGraph()
        console.log('delete', this.cellData, this.currentCellId)
        if (this.cellType === 'node') {
          this.$confirm(`确认删除节点${this.cellData.attrs.text.text}吗?`, {
            title: '警告',
            type: 'warning',
            center: true,
          }).then(async () => {
            await deleteNode(this.currentCellId)
            this.$message.success('删除成功！')
            graph.removeCell(this.currentCellId)
          })
        } else if (this.cellType === 'edge') {
          this.$confirm(`确认删除边吗?`, {
            title: '警告',
            type: 'warning',
            center: true,
          }).then(async () => {
            graph.removeCell(this.currentCellId)
            this.$message.success('删除成功！')
          })
        }

        // graph.removeCell(this.currentCellId)

        // graph.on(
        //   'node:mousedown',
        //   () => {
        //     console.log('delete2')
        //   },
        //   true
        // )
      },
    },
  }
</script>
<style lang="scss" scoped>
  .context-menu-container {
    position: relative;
    width: 84px;
    height: 40px;
    line-height: 40px;
    border-radius: 4px;
    color: #487ec2;
    background-color: #fff;
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.2);
    .el-icon-delete {
      margin-right: 7px;
    }
    &::before {
      content: '';
      position: absolute;
      bottom: -17px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border: 10px solid #fff;
      border-bottom-color: transparent;
      border-left-color: transparent;
      border-right-color: transparent;
    }
  }
</style>
