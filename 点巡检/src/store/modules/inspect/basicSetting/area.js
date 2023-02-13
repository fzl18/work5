import { detailedAreaInfo } from '@/module/inspect/api/basicSetting/area';

/**
 * @description 在线监测系统基础管理的状态管理，如无必要请勿修改
 */
const state = {
  isComponent: '',
  operationType: '',
  editing: '',
  treeWhole: [],
  detailedInfo: {},
  detailedId: '',
  treeNodeSelected: {}, // selected data
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
  SET_DETAILED_ID (state, id) {
    state.detailedId = id
  },
  SET_DETAILED_INFO (state, payload) {
    state.detailedInfo = payload
  }
}
const actions = {
  async fetchDetailedAreaInfo ({ commit }, params) {
    const { data } = await detailedAreaInfo(params)
    if (data) {
      commit('SET_DETAILED_INFO', data)
    }
  }
}
export default { state, getters, mutations, actions }
