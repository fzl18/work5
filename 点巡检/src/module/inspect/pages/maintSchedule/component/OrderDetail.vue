<template>
  <div class="detailed">
    <div class="detailed-block">
      <div class="block-title"><i class="el-icon-s-tools" />设备信息</div>
      <div class="block-body">
        <div class="block-row">
          <span>设备编码：</span>
          <p>{{ detailedInfo.equipmentNo || '--' }}</p>
        </div>
        <div class="block-row">
          <span>设备名称：</span>
          <p>{{ detailedInfo.equipmentName || '--' }}</p>
        </div>
        <div class="block-row">
          <span>所属输送机：</span>
          <p>{{ detailedInfo.conveyorName || '--' }}</p>
        </div>
      </div>
    </div>
    <div class="detailed-block">
      <div class="block-title"><i class="el-icon-s-order" />工单信息</div>
      <div class="block-body">
        <div class="block-row">
          <span>预计执行时间：</span>
          <p>{{ detailedInfo.presetTime }}</p>
        </div>
        <div class="block-row">
          <span>状态优先级：</span>
          <p>{{ detailedInfo.priority }}</p>
        </div>
        <div class="block-row">
          <span>故障描述：</span>
          <p>{{ detailedInfo.troubleDesc }}</p>
        </div>
      </div>
    </div>
    <div class="detailed_link">
      <div class="man">
        <img src="@/assets/images/inspect/icon_user.png" alt>
        执行人：{{ detailedInfo.actionUserName || '' }}
      </div>
      <div class="ind" @click="handleGOrderDetail">进入工单详情页 <i class="el-icon-arrow-right" /></div>
    </div>
    <!--    <div class="detailed_action">-->
    <!--      <el-button type="default" class="audit">审批</el-button>-->
    <!--      <el-button type="default" class="acceptance">验收</el-button>-->
    <!--      <el-button type="default" class="agency">代办</el-button>-->
    <!--    </div>-->
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

const { mapState, mapMutations } = createNamespacedHelpers('inspectMaintScheduleIndex')
const CLS_MAP = {
  1: 'ready',
  2: 'abnormal',
  3: 'infix',
  4: 'finished'
}
export default {
  name: "OrderDetail",
  data () {
    return {
      CLS_MAP
    }
  },
  computed: {
    ...mapState(['detailedInfo'])
  },
  beforeDestroy () {
    this.SET_DETAIL({})
  },
  methods: {
    ...mapMutations(['SET_DETAIL']),
    handleGOrderDetail () {
      this.$router.push({
        path: 'workOrderAdd',
        query: {
          params: JSON.stringify({
            isEdit: true,
            onlyRead: true,
            data: this.detailedInfo,
          }),
        },
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "@/module/inspect/css/schedule.scss";
</style>
