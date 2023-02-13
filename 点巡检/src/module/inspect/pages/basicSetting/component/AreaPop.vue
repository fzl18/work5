<template>
  <el-dialog :title="`设置区域`" width="70%" top="10vh" :visible.sync="isShow" :before-close="handleClose">
    <bt-map
      height="520px" :datas="dd" :symbol="symbol" :tool-show="!isView" edit
      @save="handleReceiveJSON"
    />
  </el-dialog>
</template>

<script>
import BtMap from '@/module/inspect/pages/map'

export default {
  name: "AreaPop",
  components: {
    BtMap
  },
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    isView: {
      type: Boolean,
      default: false
    },
    symbol: {
      type: String,
      default: ''
    },
    dd: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {}
  },
  computed: {
    areaJson () {
      return this.dd.length === 0
    }
  },
  mounted () {
  },
  methods: {
    handleClose (keep = false) {
      this.$emit('close', keep)
    },
    handleReceiveJSON (json) {
      console.log('绘制的数据', json)
      this.$emit('postdata', json)
      this.handleClose()
    }
  }
}
</script>

<style scoped>

</style>
