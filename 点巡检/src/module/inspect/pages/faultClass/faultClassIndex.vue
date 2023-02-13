<template>
  <SplitPane :min-percent="20" :default-percent="22" split="vertical">
    <template slot="paneL">
      <div class="btTree">
        <div class="tree-search">
          <el-form>
            <el-input
              v-model="filterText"
              placeholder="输入关键字过滤"
              suffix-icon="el-icon-search"
            />
          </el-form>
        </div>
        <el-tree
          ref="eleTree"
          :data="treeData"
          :indent="0"
          default-expand-all
          :props="defaultProps"
          :filter-node-method="filterNode"
          @node-click="nodeClicked"
        >
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <span
              :style="`font-size: ${16 - node.level + 1}px`"
              :class="node.isCurrent ? 'cur' : ''"
            >
              <i
                :class="
                  data.typeFlag == 1 ? 'ri-git-commit-fill' : 'ri-node-tree'
                "
              />
              {{ node.label }}
            </span>
          </span>
        </el-tree>
      </div>
    </template>
    <template slot="paneR">
      <component :is="isComponent" @getTree="getTree" />
    </template>
  </SplitPane>
</template>
<script>
  import route from './menuRoute'
  import Authority from './menuRoute/authority'
  import Api from '../../api/faultClass'
  import { createNamespacedHelpers } from 'vuex'
  import BtPagePlus from './bt-page-plus.vue'
  import diversityPurposeItem from './components/diversity-purpose-item'
  import IsDetail from './is-detail'

  const { mapState, mapActions, mapMutations, mapGetters } =
    createNamespacedHelpers('inspectFaultClassPageData')

  export default {
    components: {
      ...Authority,
      IsDetail,
      diversityPurposeItem,
      BtPagePlus,
    },
    data() {
      return {
        filterText: '',
        show: false,
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: '',
        },
        data: route,
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'label',
        },
        search: {
          page: 1,
          pageSize: 10,
        },
        total: 0,
        list: [],
        clickData: {},
      }
    },
    computed: {
      ...mapGetters({
        isComponent: 'isComponent',
      }),
    },
    watch: {
      filterText(val) {
        this.$refs.eleTree.filter(val)
      },
    },
    async created() {
      this.setIsComponent('FaultClassAddFirstClass')
      await this.getTree()
    },
    methods: {
      filterData(data) {
        data.forEach((item, index) => {
          if (item.typeFlag === 1) {
            data.splice(index, 1)
          } else {
            if (item.children) {
              this.filterData(item.children)
            }
          }
        })
      },
      recursiveFilter(arr, type) {
        let data = arr
          .filter((item) => item.typeFlag == type)
          .map((item) => {
            item = Object.assign({}, item)
            if (item.children) {
              //递归循环
              item.children = this.recursiveFilter(item.children, type)
            }
            return item
          })
        return data
      },
      getTree() {
        Api.getClassTree({
          data: {},
          params: {},
        }).then((res) => {
          const data = [
            {
              children: res.data,
              label: '故障代码管理',
              firstFlag: '00',
            },
          ]
          //过滤掉层级类型为0的物料，只保留物料分类
          // let showdata = this.recursiveFilter(data, 0)
          this.treeData = data
          // this.$store.dispatch(
          //   'inspectFaultClassPageData/getTreeData',
          //   res.data[0]
          // )
          if (!this.$store.state.inspectFaultClassPageData.clickTreeData) {
            this.$store.dispatch('inspectFaultClassPageData/getTreeData', {})
          }

          res.data.forEach((item) => {
            if (item.children) {
              item.value = item.id
              this.hasChidren(item.children)
            } else {
              item.value = item.id
            }
          })
          this.$store.dispatch(
            'inspectFaultClassPageData/setTreeData',
            res.data
          )
        })
      },
      filterNode(value, data) {
        if (!value) return true
        return data.label.toLowerCase().indexOf(value.toLowerCase()) !== -1
      },
      hasChidren(val) {
        val.forEach((item) => {
          if (item.children) {
            item.value = item.id
            this.hasChidren(item.children)
          } else {
            item.value = item.id
          }
        })
      },
      ...mapMutations(['setIsComponent']),
      nodeClicked(data) {
        if (data) {
          if (!data.firstFlag) {
            this.$store.dispatch('inspectFaultClassPageData/getTreeData', data)
            this.setIsComponent('FaultClass')
          }
          if (data.firstFlag === '00') {
            this.$store.dispatch('inspectFaultClassPageData/getTreeData', {})
            this.setIsComponent('FaultClassAddFirstClass')
          }
        } else {
          this.setIsComponent('')
        }
      },
      getList() {},
      del(val) {
        Api.deleteFault({
          params: {
            id: val.id,
          },
        }).then((res) => {
          if (res.code === '200') {
            this.serach()
          }
        })
      },
      createType(type, val) {
        if (type === 'edit') {
          this.$router.push({
            path: '@/module/inspect/pages/faultClass/components/faultClassAdd',
            query: { data: this.clickData, type: type },
          })
        } else if (type === 'add') {
          this.$router.push({
            path: '@/module/inspect/pages/faultClass/components/faultClassAdd',
            query: { data: this.clickData, type: type },
          })
        } else if (type === 'editTable') {
          this.$router.push({
            path: '@/module/inspect/pages/faultClass/components/faultClassAdd',
            query: { data: val, type: type },
          })
        }
      },
      async serach() {
        await Api.getFaultInfoList({
          params: {
            current: this.search.page,
            size: this.search.pageSize,
          },
          data: {
            id: this.clickData.id,
          },
        }).then((res) => {
          this.list = res.data.records
          this.total = res.data.total
        })
        await Api.getFaultInfo({
          data: {},
          params: {
            id: this.clickData.id,
          },
        }).then((res) => {
          this.form = res.data
        })
      },
      handleNodeClick(data) {},
    },
  }
</script>
<style lang="scss" scoped>
  .tree-container {
    position: relative;
    .page-left {
      position: absolute;
      width: 300px;
      height: calc(100vh - 50px);
      background-color: #fff;
    }
    .page-right {
      margin-left: 315px;
    }
  }
</style>

<style lang="scss" scoped>
  .btTree {
    background-color: #fff;
    .tree-search {
      padding: 15px 20px;
    }
  }
  .btTree ::v-deep {
    .el-tree > .el-tree-node:after {
      border-top: none;
    }
    .el-tree-node {
      position: relative;
      padding-left: 16px;
      &:focus > .el-tree-node__content {
        background-color: #fff;
      }
    }
    .el-tree-node__content {
      height: 48px;
      &:hover {
        background: #fff;
      }
    }
    .is-focusable {
      background-color: #fff;
    }
    //节点有间隙，隐藏掉展开按钮就好了,如果觉得空隙没事可以删掉
    .el-tree-node__expand-icon.is-leaf {
      // display: none;
      // padding: 0;
    }
    .el-tree-node__children {
      padding-left: 16px;
    }

    .el-tree-node :last-child:before {
      height: 38px;
    }

    .el-tree > .el-tree-node:before {
      border-left: none;
    }

    .el-tree > .el-tree-node:after {
      border-top: none;
    }

    .el-tree-node:before {
      content: '';
      left: 4px;
      position: absolute;
      right: auto;
      border-width: 1px;
    }

    .el-tree-node:after {
      content: '';
      left: 4px;
      position: absolute;
      right: auto;
      border-width: 1px;
    }

    .el-tree-node:before {
      border-left: 1px solid #bdc7d5;
      bottom: 0px;
      height: 100%;
      top: -14px;
      width: 1px;
    }

    .el-tree-node:after {
      border-top: 1px solid #bdc7d5;
      height: 20px;
      top: 23px;
      width: 18px;
    }
    .custom-tree-node {
      color: #070505;
      .cur {
        color: #0090ef;
      }
    }
  }
  .app-main-container .app-main-height[data-v-63f8cfea] {
    padding: 0 15px 15px 15px;
  }
</style>
