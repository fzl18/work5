import { getDictionary } from '@/core/api/dictionary'

const state = {
  dictionary: [],
}
const getters = {
  dictionary: (state) => state.dictionary,
}
const mutations = {
  setDictionary(state, dictionary) {
    state.dictionary = dictionary
  },
}
const actions = {
  async setDictionary({ commit }) {
    const dictionary = await getDictionary({ dictCategory: '' })
    let dictionaryList = []
    if (Array.isArray(dictionary)) {
      dictionaryList = dictionary.map((item) => {
        item.value = item.dictCode
        item.label = item.dictName
        return item
      })
    }
    commit('setDictionary', dictionaryList)
    return
    const dictionaryObj = {}
    if (Array.isArray(dictionary)) {
      dictionary.forEach((item) => {
        dictionaryObj[item.code] = item.list
      })
    }
    commit('setDictionary', dictionaryObj)
  },
}
export default { state, getters, mutations, actions }
