<template>
  <div class="gauge">
    <Chart :cdata="cdata" />
  </div>
</template>

<script>
import Chart from "./chart.vue";
export default {
  data() {
    return {
      cdata: {
        val: [
          {
            value: 11,
            name: "已完成",
            itemStyle: {
              color: "#999",
            },
          },
          {
            value: 12,
            name: "执行中",
            itemStyle: {
              color: "blue",
            },
          },
          {
            value: 12,
            name: "待执行",
            itemStyle: {
              color: "orange",
            },
          },
          {
            value: 77,
            name: "已漏检",
            itemStyle: {
              color: "#666",
            },
          },
        ],
      },
    };
  },
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    Chart,
  },
  watch: {
    data: {
      handler(newData) {
        // console.log(newData);
        const {
          checkCompletePercentage,
          checkExecutionPercentage,
          waitExecutePercentage,
          omitPercentage,
        } = newData;
        this.cdata.val[0].value = checkCompletePercentage;
        this.cdata.val[1].value = checkExecutionPercentage;
        this.cdata.val[2].value = waitExecutePercentage;
        this.cdata.val[3].value = omitPercentage;
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.gauge {
  position: relative;
}
</style>
