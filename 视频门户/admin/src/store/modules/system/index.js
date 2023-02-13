/**
 * @description 字典
 */
// import { getIndexDictionary } from '@/views/system/api'
const state = { dictionary: [] }
const getters = {
  errorLogs: (state) => state.errorLogs,
  dictionary: (state) => state.dictionary,
}
const mutations = {
  addErrorLog(state, errorLog) {
    state.errorLogs.push(errorLog)
  },
  clearErrorLog: (state) => {
    state.errorLogs.splice(0)
  },
  setDictionary(state, payload) {
    state.dictionary = payload
  },
}
const actions = {
  addErrorLog({ commit }, errorLog) {
    commit('addErrorLog', errorLog)
  },
  clearErrorLog({ commit }) {
    commit('clearErrorLog')
  },
  // async getDictionary({ commit }) {
  //   const dictionary = await getIndexDictionary()
  //   commit('setDictionary', dictionary)
  // },
}
export default { state, getters, mutations, actions }
