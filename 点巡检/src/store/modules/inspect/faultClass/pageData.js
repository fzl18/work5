/**
 * @description 模型管理系统的状态管理，如无必要请勿修改
 */
const state = {
  clickTreeData: '',
  path: '',
  tableData: [],
  isComponent: '',
  updataData: [],
  searchTableModalData: {},
  treeData: [],
}
const getters = {
  clickTreeData: (state) => state.clickTreeData,
  setPath: (state) => state.path,
  tableData: (state) => state.tableData,
  isComponent: (state) => state.isComponent,
  updataData: (state) => state.updataData,
}
const mutations = {
  getTreeData(state, pyload) {
    state.clickTreeData = pyload
  },
  setPath(state, pyload) {
    state.path = pyload
  },
  setTableData(state, pyload) {
    state.tableData = pyload
  },
  setIsComponent(state, pyload) {
    state.isComponent = pyload
  },
  setupdataData(state, pyload) {
    state.updataData = pyload
  },
  setModalData(state, pyload) {
    state.searchTableModalData = pyload
  },
  setTreeData(state, pyload) {
    state.treeData = pyload
  },
}
const actions = {
  getTreeData({ commit }, pyload) {
    commit('getTreeData', pyload)
  },
  setPath({ commit }, pyload) {
    commit('setPath', pyload)
  },
  setTableData({ commit }, pyload) {
    commit('setTableData', pyload)
  },
  setIsComponent({ commit }, pyload) {
    commit('setIsComponent', pyload)
  },
  setupdataData({ commit }, pyload) {
    commit('setupdataData', pyload)
  },
  setModalData({ commit }, pyload) {
    commit('setModalData', pyload)
  },
  setTreeData({ commit }, pyload) {
    commit('setTreeData', pyload)
  },
}
export default { state, getters, mutations, actions }
