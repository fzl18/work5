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
          :data="treeData"
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
      <component :is="isComponent" ref="area" @getTree="getTree" />
    </template>
  </split-pane>
</template>
<script>
import { createNamespacedHelpers } from 'vuex'
// import Api from '@/module/onlineMonitoring/api/typeManage'
import areaDetail from './component/areaDetail'
import areaForm from './component/areaForm'
import SplitPane from '@/components/SplitPane'
import { listAreaTree } from '@/module/inspect/api/basicSetting/area'

const { mapState, mapGetters, mapMutations, mapActions } = createNamespacedHelpers('inspectBasicSettingArea')
export default {
  components: {
    SplitPane,
    areaForm,
    areaDetail,
  },
  data () {
    return {
      filterText: '',
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'areaName',
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
    ...mapState(['isComponent', 'editing', 'treeNodeSelected', 'detailedId'])
  },
  watch: {
    filterText (val) {
      this.$refs.eleTree.filter(val)
    },
  },
  created () {
    this.setIsComponent('areaDetail')
    // this.setTreeNodeSelected({})
    this.getTree()
  },
  methods: {
    ...mapMutations(['setIsComponent', 'setTreeWhole', 'setTreeNodeSelected', 'SET_DETAILED_ID', 'SET_DETAILED_INFO']),
    ...mapActions(['fetchDetailedAreaInfo']),
    getTree () {
      listAreaTree().then(res => {
        this.treeData = [{
          areaName: '区域列表',
          parentKind: '',
          children: res.data
        }]
        if (this.detailedId) {
          this.$nextTick(() => {
            this.$refs.eleTree.setCurrentKey(this.detailedId)
          })
        }
      })
    },
    filterNode (value, data) {
      if (!value) return true
      return data.areaName.toLowerCase().indexOf(value.toLowerCase()) !== -1
    },
    async nodeClicked (data) {
      if (data) {
        // tool.formatGraphList(data.monitorGraphList, data.kindId + data.id)
        if (data.id) {
          await this.fetchDetailedAreaInfo({ id: data.id })
          this.SET_DETAILED_ID(data.id)
        } else {
          this.SET_DETAILED_ID('')
          this.SET_DETAILED_INFO({})
        }
      }
      if (this.editing && data.id) {
        this.setIsComponent('areaForm')
      } else {
        this.setIsComponent('areaDetail')
        this.$nextTick(() => {
          this.$refs.area.describeGeoJson()
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '@/module/inspect/css/base.scss';
  @import '@/module/inspect/css/btTree.scss';
</style>
