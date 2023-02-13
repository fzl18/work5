<template>
  <div>
    <Echart
      :options="options"
      id="centreLeft1Chart"
      :height="'300px'"
      width="100%"
    ></Echart>
  </div>
</template>

<script>
import Echart from "@/common/echart";
export default {
  data() {
    return {
      options: {},
    };
  },
  components: {
    Echart,
  },
  props: {
    cdata: {
      type: Object,
      default: () => ({}),
    },
  },
  watch: {
    cdata: {
      handler(newData) {
        this.options = {
          tooltip: {
            trigger: "axis",
            axisPointer: {
              // Use axis to trigger tooltip
              type: "shadow", // 'shadow' as default; can also be 'line' or 'shadow'
            },
          },
          grid: {
            left: "1%",
            right: "5%",
            top: "8%",
            bottom: "5%",
            containLabel: true,
          },
          legend: {
            itemWidth: 10,
            itemHeight: 10,
            top: 0,
            textStyle: {
              fontSize: 12,
            },
            data: [
              { name: "已修复", icon: "circle" },
              { name: "未修复", icon: "circle" },
            ],
          },
          xAxis: {
            type: "value",
            axisLine: {
              show: true,
              lineStyle: {
                // type: "dashed",
                color: "#5C4313",
              },
            },
            axisLabel: {
              fontSize: 12,
              color: "#ccc",
            },
            // splitLine: {
            //   show: true,
            //   lineStyle: {
            //     type: "dashed",
            //     color: "#5C4313",
            //   },
            // },

            // data: newData.seriesData,
          },
          yAxis: {
            type: "category",
            data: newData.yAxis,
            // data: ["Mon", "Tue", "Wed", "Thu"],
            axisLine: {
              show: true,
              lineStyle: {
                // type: "dashed",
                color: "#5C4313",
              },
            },
            axisLabel: {
              fontSize: 13,
              color: "#ccc",
            },
            splitLine: {
              show: false,
              lineStyle: {
                type: "dashed",
                color: "#5C4313",
              },
            },
          },
          barMaxWidth: 15,
          // series: [
          //   {
          //     data: newData.seriesData,
          //     type: "bar",
          //     showBackground: true,
          //     color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 1, [
          //       { offset: 0, color: "#1F180C" },
          //       { offset: 0.3, color: "#B39857" },
          //       { offset: 1, color: "#EED986" },
          //     ]),
          //     backgroundStyle: {
          //       color: "rgba(180, 180, 180, 0.2)",
          //     },
          //     itemStyle: {
          //       decal: {
          //         symbol: "rect",
          //         symbolSize: 3,
          //         color: "rgba(0, 0, 0, 1)",
          //         dashArrayX: [1, 5],
          //         dashArrayY: [0.5],
          //       },
          //     },
          //     label: {
          //       show: true,
          //       position: "right",
          //       color: "#fff",
          //     },
          //   },
          // ],
          series: [
            {
              name: "已修复",
              type: "bar",
              stack: "total",
              itemStyle: {
                color: new this.$echarts.graphic.LinearGradient(1, 0, 0, 0, [
                  { offset: 1, color: "rgba(204, 174, 98, 0.1)" },
                  { offset: 0, color: "#ccae62" },
                ]),
              },
              label: {
                // show: true,
              },
              emphasis: {
                focus: "self",
              },
              data: newData.seriesData.completeNum,
            },
            {
              name: "未修复",
              type: "bar",
              stack: "total",
              itemStyle: {
                color: new this.$echarts.graphic.LinearGradient(1, 0, 0, 0, [
                  { offset: 1, color: "rgba(3, 137, 234, 0.1)" },
                  { offset: 0, color: "#0389EA" },
                ]),
              },
              label: {
                // show: true,
              },
              emphasis: {
                focus: "self",
              },
              data: newData.seriesData.noCompleteNum,
            },
          ],
        };
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped></style>
