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
        xAxis: [],
        seriesData: [],
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
        const xAxis = [],
          seriesData = [];
        if (newData.data) {
          newData.data.map((item, index) => {
            // xAxis.push(item.moduleName);
            if (index < 10) {
              seriesData.push({
                value: item.count,
                name: item.name,
              });
            }
          });
          this.cdata.xAxis = xAxis;
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
