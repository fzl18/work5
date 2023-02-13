import { listWorkOrderByFilters } from '@/module/inspect/api/maintSchedule';

const BG_MAP = {
  3: {
    'label': '待维修',
    'cls': 'ready-gradient'
  },
  4: {
    'label': '维修中',
    'cls': 'infix-gradient'
  },
  5: {
    'label': '待验收',
    'cls': 'abnormal-gradient'
  },
  6: {
    'label': '已完成',
    'cls': 'finished-gradient'
  }
}

function c (base) {
  let sourceData = JSON.parse(JSON.stringify(base))
  let targetAttrs = []
  let curAllList = []
  if (sourceData && Object.keys(sourceData).length) {
    let counter = 1
    Reflect.ownKeys(sourceData).forEach((key) => {
      let array = sourceData[key]
      if (array instanceof Array) {
        curAllList = [...curAllList, ...array]
        array.reduce((pre, cur) => {
          const format = {
            key: counter,
            customData: {
              title: cur.workorderName + cur.workorderNo || '',
              class: `${ BG_MAP[cur.workorderStatus].cls || '' } text-white`,
            },
            dates: new Date(key.toString())
          }
          targetAttrs.push(format)
          counter++
        }, targetAttrs)
      }
    })
  }
  console.log('计算出结果', targetAttrs)
  return [targetAttrs, curAllList]
}

const state = {
  baseDataList: {},
  dataLoaded: false,
  calAttrs: [],
  curMonthList: [],
  detailedInfo: {}
}

const getters = {}
const mutations = {
  'SET_DATA_LIST' (state, list) {
    state.baseDataList = list
  },
  'SET_DATA_STATUS' (state, status) {
    state.dataLoaded = status
  },
  'SET_ITEMS' (state, list) {
    state.calAttrs = list
  },
  'SET_CUR_MONTH' (state, list) {
    state.curMonthList = list
  },
  'SET_DETAIL' (state, info) {
    console.log('设置想i去那个', info)
    state.detailedInfo = info
  }
}
const actions = {
  fetchingWorkOrderByFilters ({ commit }, filters) {
    listWorkOrderByFilters(filters).then(res => {
      if (res.success) {
        if (res.data) {
          const d = c(res.data)
          commit('SET_DATA_LIST', res.data)
          commit('SET_ITEMS', d[0])
          commit('SET_CUR_MONTH', d[1])
        }
      }
    })
  }
}
export default { state, getters, mutations, actions }
