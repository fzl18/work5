/**
 * @description 模型管理系统的状态管理，如无必要请勿修改
 */
const state = {
  userinfo: {},
  userPowers: '',
  dictionary: [],
  allUnits: [],
  unitUsers: [],
  allUser: [],
}
const getters = {
  userinfo: (state) => state.userinfo,
  userPowers: (state) => state.userPowers,
  dictionary: (state) => state.dictionary,
  allUnits: (state) => state.allUnits,
  unitUsers: (state) => state.unitUsers,
  allUser: (state) => state.allUser,
}
const mutations = {
  setUserinfo(state, pyload) {
    state.userinfo = pyload
  },
  setUserPowers(state, pyload) {
    state.userPowers = pyload
  },
  setDictionary(state, pyload) {
    state.dictionary = pyload
  },
  setAllUnits(state, pyload) {
    state.allUnits = pyload
  },
  setUnitUsers(state, pyload) {
    state.unitUsers = pyload
  },
  setAllUser(state, pyload) {
    state.allUser = pyload
  },
}
const actions = {
  setUserinfo({ commit }, pyload) {
    commit('setUserinfo', pyload)
  },
  setUserPowers({ commit }, pyload) {
    commit('setUserPowers', pyload)
  },
  setDictionary({ commit }, pyload) {
    commit('setDictionary', pyload)
  },
  setAllUnits({ commit }, pyload) {
    commit('setAllUnits', pyload)
  },
  setUnitUsers({ commit }, pyload) {
    commit('setUnitUsers', pyload)
  },
  setAllUser({ commit }, pyload) {
    commit('setAllUser', pyload)
  },
}
export default { state, getters, mutations, actions }
