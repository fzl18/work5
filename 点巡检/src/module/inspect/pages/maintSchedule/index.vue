<template>
  <div class="app-container">
    <bt-page :title="title">
      <template slot="option">
        <bt-dropdown :show-arrow="true">
          {{ $translateTitle('操作') }}
          <bt-dropdown-menu>
            <bt-dropdown-item @click.native="handleGAdd">
              新增工单
            </bt-dropdown-item>
          </bt-dropdown-menu>
        </bt-dropdown>
      </template>
      <template slot="sections">
        <bt-section :show-drawer="false">
          <div class="sch__panel">
            <div class="sch__calendar">
              <v-calendar :attributes1="calAttrs" @today-items="handleSetOrderList" @reload="queryWorkOrderInCalPNL" />
            </div>
            <div class="sch__detailed">
              <div class="detailed__head">
                <span v-if="comp==='OrderList'" :title="`${clickDate ? clickDate + '工单' : '当月工单列表'}`">
                  {{ clickDate ? clickDate + '工单' : '当月工单列表' }}
                </span>
                <span v-else-if="comp==='OrderDetail'">{{ detailedInfo.workorderName }}</span>
                <el-button
                  v-if="clickDate || comp==='OrderDetail'"
                  type="default" class="indicator" icon="el-icon-s-operation"
                  @click="handleSetView('OrderList',true)"
                >
                  当月列表
                </el-button>
              </div>
              <div class="detailed__body">
                <component :is="comp" :list="!clickDate?curMonthList:listsShow" @update="handleSetView" />
              </div>
            </div>
          </div>
        </bt-section>
      </template>
    </bt-page>
  </div>
</template>

<script>
import VCalendar from '@/module/inspect/pages/maintSchedule/component/BCalendar';
import OrderList from './component/OrderList'
import OrderDetail from './component/OrderDetail'
import { createNamespacedHelpers } from 'vuex';

const CLS_MAP = {
  1: 'ready',
  2: 'abnormal',
  3: 'infix',
  4: 'finished'
}
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
const { mapState, mapActions } = createNamespacedHelpers('inspectMaintScheduleIndex')

export default {
  name: "Index",
  components: {
    VCalendar,
    OrderList,
    OrderDetail
  },
  data () {
    return {
      title: '排班列表',
      CLS_MAP,
      comp: 'OrderList',
      listsShow: [],
      clickDate: '',
      queryForm: {
        pageNum: 1,
        pageSize: 1000,
        workorderType: ''
      }
      // calAttrs: []
    }
  },
  computed: {
    ...mapState(['baseDataList', 'calAttrs', 'curMonthList', 'detailedInfo'])
  },
  mounted () {
    this.pageInit()
  },
  methods: {
    ...mapActions(['fetchingWorkOrderByFilters']),
    async pageInit () {
      const date = new Date()
      // this.clickDate = `${ date.getFullYear() }-${ (date.getMonth() + 1).toString().padStart(2, '0') }-${ date.getDate().toString().padStart(2, '0') }`
      let curMonth = `${ date.getFullYear() }-${ (date.getMonth() + 1).toString().padStart(2, '0') }`
      const params = {
        month: curMonth
      }
      await this.queryWorkOrderInCalPNL(params)
      this.handleSetView('OrderList', true)
    },
    queryWorkOrderInCalPNL (params) {
      let filters = { ...this.queryForm, ...params }
      this.fetchingWorkOrderByFilters(filters)
    },
    // SET LIST
    handleSetOrderList ({ date, list }) {
      if (this.comp !== 'OrderList') {
        this.comp = 'OrderList'
      }
      this.clickDate = date
      this.listsShow = list
    },
    handleSetView (viewName, all = false) {
      console.log('初始化设置列表', viewName, all, this.curMonthList)
      this.comp = viewName
      if (viewName === 'OrderList' && all) {
        this.handleSetOrderList({ date: '', list: this.curMonthList })
      }
    },
    handleGAdd () {
      this.$router.push({ path: 'workOrderAdd', query: { form: 'calendar' } })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "@/module/inspect/css/schedule.scss";
</style>
