<template>
  <div>
    <Echart
      id="centreLeft1Chart"
      :options="options"
      :height="'500px'"
      width="500px"
    ></Echart>
  </div>
</template>

<script>
  import Echart from '@/components/Echart'
  export default {
    components: {
      Echart,
    },
    props: {
      cdata: {
        type: Object,
        default: () => ({}),
      },
    },
    data() {
      return {
        options: {},
      }
    },
    watch: {
      cdata: {
        handler(newData) {
          this.options = {
            tooltip: {
              trigger: 'axis',
            },
            grid: {
              left: '0%',
              right: '0%',
              top: '20%',
              bottom: '15%',
              // containLabel: true,
            },
            legend: {
              data: this.cdata.legend,
            },
            xAxis: [
              {
                type: 'category',
                axisLabel: { rotate: 60 },
                // data: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
                data: this.cdata.xAxis,
              },
            ],
            yAxis: [
              {
                type: 'value',
              },
            ],
            // series: [
            //   {
            //     name: '11',
            //     // data: newData.seriesData,
            //     data: [
            //       2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0,
            //       6.4, 3.3,
            //     ],
            //     type: 'bar',
            //   },
            //   {
            //     name: '12',
            //     // data: newData.seriesData,
            //     data: [
            //       2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0,
            //       6.4, 3.3,
            //     ],
            //     type: 'bar',
            //   },
            // ],
            series: this.cdata.seriesData,
          }
        },
        immediate: true,
        deep: true,
      },
    },
  }
</script>

<style lang="scss" scoped></style>
