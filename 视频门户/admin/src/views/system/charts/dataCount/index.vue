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
          if (newData) {
            let legend = []
            if (newData[0].finish === null) {
              legend = [{ name: '积分', data: [] }]
            } else {
              legend = [
                { name: '提交建议数量', data: [] },
                { name: '采纳建议数量', data: [] },
                { name: '完成建议数量', data: [] },
                { name: '当月完成', data: [] },
              ]
            }
            const seriesData = []
            const xAxis = []
            const legendName = []

            newData.map((item, index) => {
              xAxis.push(item.name)
              legend[0].data.push(item.submit)
              if (newData[0].finish !== null) {
                legend[1].data.push(item.approve)
                legend[2].data.push(item.finish)
                legend[3].data.push(item.monthlyFinish)
              }
              // seriesData.push({
              //   type: 'bar',
              //   name: legend[index],
              //   data: [item.submit, item.approve, item.finish],
              // })
            })
            legend.map((item) => {
              seriesData.push({
                type: 'bar',
                name: item.name,
                data: item.data,
              })
              legendName.push(item.name)
            })
            this.cdata.xAxis = xAxis
            this.cdata.seriesData = seriesData
            this.cdata.legend = legendName
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
