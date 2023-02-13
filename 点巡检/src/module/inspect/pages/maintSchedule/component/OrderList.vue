<template>
  <div class="lists">
    <div
      v-for="i in list" :key="i.workorderNo" :class="['list__item',CLS_MAP[i.workorderStatus]]"
      @click.prevent="handleDetailView(i)"
    >
      {{ i.workorderName + i.workorderNo }}
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

const CLS_MAP = {
  '3': 'ready',
  '5': 'abnormal',
  '4': 'infix',
  '6': 'finished'
}
const { mapState, mapMutations } = createNamespacedHelpers('inspectMaintScheduleIndex')
export default {
  name: "OrderList",
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      CLS_MAP
    }
  },
  methods: {
    ...mapMutations(['SET_DETAIL']),
    handleDetailView (detail) {
      console.log('设置详情', detail)
      this.SET_DETAIL(detail)
      this.$emit('update', 'OrderDetail')
      // SET Detail
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "@/module/inspect/css/schedule.scss";
</style>
