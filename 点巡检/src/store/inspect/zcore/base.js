const state = {
  equipmentRepairFlag: false,
  equipmentRepairInfo: null,
  workOrderStatus: '',
}

const getters = {
  equipmentRepairFlag: (state) => state.equipmentRepairFlag,
  equipmentRepairInfo: (state) => state.equipmentRepairInfo,
  workOrderStatus: (state) => state.workOrderStatus,
}

const mutations = {
  setRepairFlag(state, flag) {
    state.equipmentRepairFlag = flag
  },
  setEqtRepairInfo(state, info) {
    state.equipmentRepairInfo = info
  },
  setWorkOrderStatus(state, status) {
    state.workOrderStatus = status
  },
}

const actions = {
  _setRepairFlag({ commit }, flag) {
    commit('setRepairFlag', flag)
  },
  _setEqtRepairInfo({ commit }, info) {
    commit('setEqtRepairInfo', info)
  },
  _setWorkOrderStatus({ commit }, info) {
    commit('setWorkOrderStatus', info)
  },
}
export default { state, getters, mutations, actions }
