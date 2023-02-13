import { detailedEquipTypeInfo, listEquipTypeTree } from '@/module/inspect/api/basicSetting/equipType';

const sortsMap = ['小', '中', '大', '3D']
/**
 * @description 设备类别
 */
const state = {
  isComponent: '',
  operationType: '',
  treeData: [],
  editing: '',
  detailedId: '',
  detailedInfo: {},
  treeWhole: [],
  treeNodeSelected: {},
}
const getters = {
  treeNodeSelectedId (state) {
    return state.treeNodeSelected.id || ''
  },
}
const mutations = {
  setIsComponent (state, payload) {
    state.isComponent = payload
  },
  setOperationType (state, payload) {
    state.operationType = payload
  },
  setEditing (state, payload) {
    state.editing = payload
  },
  setTreeWhole (state, payload) {
    state.treeWhole = payload
  },
  setTreeNodeSelected (state, payload) {
    state.treeNodeSelected = payload
  },
  'SET_TREE_DATA' (state, tree) {
    state.treeData = tree
  },
  SET_DETAILED_ID (state, id) {
    state.detailedId = id
  },
  SET_DETAILED_INFO (state, payload) {
    state.detailedInfo = payload
  }
}
const actions = {
  async fetchDetailedEquipTypeInfo ({ commit }, params) {
    const { data } = await detailedEquipTypeInfo(params)
    if (data) {
      if (data.equipmentInstanceKindGraphList) {
        let arr = data.equipmentInstanceKindGraphList
        arr.sort(function (a, b) {
          return sortsMap.indexOf(a.graphType || '3D') - sortsMap.indexOf(b.graphType || '3D')
        })
      } else {
        data.equipmentInstanceKindGraphList = [
          { graphUrl: '', graphType: '小', graphName: '' },
          { graphUrl: '', graphType: '中', graphName: '' },
          { graphUrl: '', graphType: '大', graphName: '' },
          { graphUrl: '', graphType: '3D', graphName: '' }
        ]
      }
      commit('SET_DETAILED_INFO', data)
    }
  },
  async fetchTreeData ({ commit }) {
    const { data } = await listEquipTypeTree()
    if (data) {
      commit('SET_TREE_DATA', data)
    }
  }
}
export default { state, getters, mutations, actions }
