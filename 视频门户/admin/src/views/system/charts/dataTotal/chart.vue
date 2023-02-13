<template>
  <div>
    <Echart
      id="centreLeft1Chart"
      :options="options"
      :height="'450px'"
      width="450px"
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
              trigger: 'item',
              formatter: '{b} : {d}%',
            },
            grid: {
              // left: "0%",
              // right: "10%",
              // top: "0%",
              // bottom: "5%",
              // containLabel: true,
            },
            series: [
              {
                data: newData.seriesData,
                // data: [
                //   { value: 40, name: 'rose 1' },
                //   { value: 38, name: 'rose 2' },
                //   { value: 32, name: 'rose 3' },
                //   { value: 30, name: 'rose 4' },
                //   { value: 28, name: 'rose 5' },
                //   { value: 26, name: 'rose 6' },
                //   { value: 22, name: 'rose 7' },
                //   { value: 18, name: 'rose 8' },
                // ],
                type: 'pie',
                radius: [0, 130],
                center: ['50%', '50%'],
                // roseType: 'radius',
                itemStyle: {
                  borderRadius: 2,
                },
                label: {
                  color: '#ccc',
                  // formatter: "{b}\n {d}%",
                  formatter: ['{a|{b}}', '{b|{d}%}'].join('\n'),
                  rich: {
                    a: {
                      fontSize: 13,
                      color: '#0099bb',
                    },

                    b: {
                      fontSize: 14,
                      // fontFamily: "Microsoft YaHei",
                      borderColor: '#ccc',
                    },
                  },
                  // position: "inside",
                  // fontWeight: "bold",
                  fontSize: 14,
                },
                labelLine: {
                  // show: false,
                  // showAbove: true,
                },
                labelLayout(params) {
                  return {
                    // x: params.rect.x + 110,
                    // y: params.rect.y + params.rect.height / 2,
                    verticalAlign: 'middle',
                    align: 'center',
                    // fontSize: Math.max(params.rect.width / 5, 5),
                  }
                },
              },
            ],
          }
        },
        immediate: true,
        deep: true,
      },
    },
  }
</script>

<style lang="scss" scoped></style>
