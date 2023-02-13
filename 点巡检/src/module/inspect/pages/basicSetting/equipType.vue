<template>
  <split-pane :min-percent="20" :default-percent="22" split="vertical">
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
          :data="treeList"
          node-key="id"
          :indent="0"
          default-expand-all
          :expand-on-click-node="false"
          :props="defaultProps"
          :filter-node-method="filterNode"
          @node-click="nodeClicked"
        >
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <span
              :style="`font-size: ${16 - node.level + 1}px`"
              :class="node.isCurrent ? 'cur' : ''"
            >
              <i :class="data.typeFlag == 1 ? 'ri-git-commit-fill' : 'ri-node-tree'" />
              {{ node.label }}
            </span>
          </span>
        </el-tree>
      </div>
    </template>
    <template slot="paneR">
      <component :is="isComponent" @getTree="getTree" />
    </template>
  </split-pane>
</template>
<script>
import { createNamespacedHelpers } from 'vuex'
import equipTypeDetail from './component/equipTypeDetail.vue'
import equipTypeForm from './component/equipTypeForm.vue'
import SplitPane from '@/components/SplitPane';

const { mapState, mapGetters, mapMutations, mapActions } = createNamespacedHelpers(
  'inspectBasicSettingEquipType'
)

export default {
  components: {
    SplitPane,
    equipTypeDetail,
    equipTypeForm,
  },
  data () {
    return {
      filterText: '',
      // treeData: [],
      defaultProps: {
        children: 'children',
        label: 'kindName',
      },
      search: {
        page: 1,
        pageSize: 10,
      },
      total: 0,
      list: [],
    }
  },
  computed: {
    ...mapState({
      isComponent: 'isComponent',
      treeData: 'treeData',
      treeNodeSelected: 'treeNodeSelected',
      editing: 'editing',
      detailedId: 'detailedId'
    }),
    treeList: function () {
      return [{
        kindName: '设备分类列表',
        parentKindId: '',
        children: this.treeData
      }]
    }
  },
  watch: {
    filterText (val) {
      this.$refs.eleTree.filter(val)
    }
    // treeNodeSelectedId: {
    //   handler: function () {
    //     this.getConveyorStructure()
    //   },
    //   immediate: true,
    // },
  },
  created () {
    this.setIsComponent('equipTypeDetail')
    // this.setTreeNodeSelected({})
    this.fetchTreeData()
    // this.getTree()
  },
  methods: {
    ...mapMutations(['setIsComponent', 'setTreeWhole', 'setTreeNodeSelected', 'SET_DETAILED_ID']),
    ...mapActions(['fetchDetailedEquipTypeInfo', 'fetchTreeData']),
    async getTree () {
      await this.fetchTreeData()
      console.log('设置dangqiDDDDDDDDan', this.detailedId)
      if (this.detailedId) {
        console.log('设置dangqian', this.detailedId)
        this.$nextTick(() => {
          this.$refs.eleTree.setCurrentKey(this.detailedId)
        })
      }
    },
    filterNode (value, data) {
      if (!value) return true
      return data.kindName.toLowerCase().indexOf(value.toLowerCase()) !== -1
    },
    nodeClicked (data, node) {
      if (data) {
        console.log(data, node)
        this.SET_DETAILED_ID(data.id || '')
        this.setTreeNodeSelected(data) // For delete logic, mute delete action if node has children (Noting else)
        data.id && this.fetchDetailedEquipTypeInfo({ id: data.id })
      }
      // this.getConveyorStructure()
      if (this.editing) {
        this.setIsComponent('equipTypeForm')
      } else {
        this.setIsComponent('equipTypeDetail')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/module/inspect/css/base.scss';
  @import '@/module/inspect/css/btTree.scss';
</style>
