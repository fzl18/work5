<template>
  <div>
    <Chart :cdata="cdata" />
  </div>
</template>

<script>
  import Chart from './chart.vue'
  export default {
    components: {
      Chart,
    },
    props: {
      data: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        cdata: {
          xAxis: [],
          seriesData: [],
        },
      }
    },
    watch: {
      data: {
        handler(newData) {
          const xAxis = [],
            seriesData = []
          if (newData) {
            newData.map((item, index) => {
              // xAxis.push(item.moduleName);
              seriesData.push({
                value: item.number,
                name: item.name,
              })
            })
            this.cdata.xAxis = xAxis
            this.cdata.seriesData = seriesData
          }
        },
        immediate: true,
        deep: true,
      },
    },
    mounted() {},
    methods: {},
  }
</script>

<style lang="scss" scoped></style>
