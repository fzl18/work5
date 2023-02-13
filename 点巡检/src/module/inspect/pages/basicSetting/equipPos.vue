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
          :props="customProps"
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
      <component :is="isComponent" ref="equip" @getTree="getTree" />
    </template>
  </split-pane>
</template>
<script>
import { createNamespacedHelpers } from 'vuex'
// import Api from '@/module/onlineMonitoring/api/typeManage'
import equipPosDetail from './component/equipPosDetail.vue'
import equipPosForm from './component/equipPosForm.vue'
import SplitPane from '@/components/SplitPane';

const { mapState, mapGetters, mapMutations, mapActions } = createNamespacedHelpers(
  'inspectBasicSettingEquipPos'
)

export default {
  name: 'EquipPos',
  components: {
    SplitPane,
    equipPosDetail,
    equipPosForm
  },
  data () {
    return {
      filterText: '',
      customProps: {
        children: 'children',
        label: 'equipmentName',
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
    ...mapState(['isComponent', 'treeNodeSelected', 'treeData', 'detailedId', 'editing']),
    treeList: function () {
      return [{
        equipmentName: '设备列表',
        parentKindId: '',
        children: this.treeData
      }]
    }
  },
  watch: {
    filterText (val) {
      this.$refs.eleTree.filter(val)
    },
    // treeNodeSelectedId: {
    //   handler: function () {
    //     this.getConveyorStructure()
    //   },
    //   immediate: true,
    // },
  },
  created () {
    this.setIsComponent('equipPosDetail')
    this.setTreeNodeSelected({})
    this.fetchTreeData()
  },
  destroyed () {
    this.setTreeNodeSelected({})
    this.SET_DETAILED_ID('')
    this.SET_DETAILED_INFO({})
  },
  methods: {
    ...mapMutations(['setIsComponent', 'setTreeWhole', 'setTreeNodeSelected', 'SET_DETAILED_ID', 'SET_DETAILED_INFO']),
    ...mapActions(['fetchTreeData', 'fetchDetailedEquipInfo']),
    async getTree () {
      await this.fetchTreeData()
      this.$nextTick(() => {
        this.$refs.eleTree.setCurrentKey(this.detailedId)
      })
      // Api.getTypeTrees({
      //   data: {},
      //   params: { kindId: 'kindconveyor' },
      // }).then((res) => {
      //   const data = [
      //     {
      //       children: res.data,
      //       kindName: '输送机分类列表',
      //       parentKind: '',
      //     },
      //   ]
      //   this.treeData = data
      //   this.setTreeWhole(res.data)
      //   if (this.treeNodeSelectedId) {
      //     this.$nextTick(() => {
      //       this.$refs.eleTree.setCurrentKey(this.treeNodeSelectedId)
      //       this.$nextTick(() => {
      //         this.$refs.eleTree.$el.querySelector('.is-current').click()
      //       })
      //     })
      //   }
      // })
    },
    filterNode (value, data) {
      if (!value) return true
      return data.equipmentName.toLowerCase().indexOf(value.toLowerCase()) !== -1
    },
    async nodeClicked (data) {
      if (data) {
        console.log('点击节点', data.id)
        this.setTreeNodeSelected(data) // For delete logic, mute delete action if node has children (Noting else)
        if (data.id) {
          await this.fetchDetailedEquipInfo({ id: data.id })
          this.SET_DETAILED_ID(data.id)
        } else {
          console.log('没有id')
          this.SET_DETAILED_ID('')
          this.SET_DETAILED_INFO({})
        }
      }
      // this.getConveyorStructure()
      if (this.editing && data.id) {
        this.setIsComponent('equipPosForm')
      } else {
        this.setIsComponent('equipPosDetail')
        this.$nextTick(() => {
          this.$refs.equip.describeGepJson()
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/module/inspect/css/base.scss';
  @import '@/module/inspect/css/btTree.scss';
</style>
