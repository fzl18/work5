<template>
  <div>
    <Chart :cdata="cdata" />
  </div>
</template>

<script>
import Chart from "./chart.vue";
export default {
  data() {
    return {
      cdata: {
        yAxis: [],
        seriesData: {},
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
        console.log(newData);
        const yAxis = [],
          seriesData = {
            completeNum: [],
            noCompleteNum: [],
          };
        if (newData.data) {
          newData.data.map((item) => {
            yAxis.push(item.conveyorName);
            seriesData.completeNum.push(item.completeNum);
            seriesData.noCompleteNum.push(item.noCompleteNum);
          });
          this.cdata.yAxis = yAxis;
          this.cdata.seriesData = seriesData;
        }
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped></style>
