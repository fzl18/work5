import _cloneDeep from 'lodash/cloneDeep'

/**
 * @description 设备接入的信息表单数据保存
 */

const state = { detailInfo: null, pointInfo: null }
const getters = {
  detailInfo: (state) => state.detailInfo,
  pointInfo: (state) => state.pointInfo,
}
const mutations = {
  updateDetailInfo(state, detailInfo) {
    state.detailInfo = _cloneDeep(detailInfo)
  },
  clearDetailInfo(state) {
    state.detailInfo = null
  },
  updatePointInfo(state, pointInfo) {
    state.pointInfo = _cloneDeep(pointInfo)
  },
  clearPointInfo(state) {
    state.pointInfo = null
  },
}
const actions = {
  updateDetailInfo({ commit }, detailInfo) {
    commit('updateDetailInfo', detailInfo)
  },
  clearDetailInfo({ commit }) {
    commit('clearDetailInfo')
  },
  updatePointInfo({ commit }, detailInfo) {
    commit('updatePointInfo', detailInfo)
  },
  clearPointInfo({ commit }) {
    commit('clearPointInfo')
  },
}
export default { state, getters, mutations, actions }
