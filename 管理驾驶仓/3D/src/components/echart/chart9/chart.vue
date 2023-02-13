<template>
  <div>
    <Echart
      :options="options"
      id="centreLeft1Chart"
      :height="'270px'"
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
            trigger: "item",
            formatter: "{b} : {d}%",
          },
          series: [
            {
              data: newData.seriesData,
              // data: [
              //   { value: 40, name: "rose 1" },
              //   { value: 38, name: "rose 2" },
              //   { value: 32, name: "rose 3" },
              //   { value: 30, name: "rose 4" },
              //   { value: 28, name: "rose 5" },
              // ],
              type: "pie",
              radius: [0, 80],
              center: ["50%", "50%"],
              // roseType: "area",

              label: {
                color: "#ccc",
                // formatter: "{b}\n {d}%",
                formatter: ["{a|{b}}", "{b|{d}%}"].join("\n"),
                rich: {
                  a: {
                    fontSize: 13,
                    color: "#cea75a",
                  },

                  b: {
                    fontSize: 15,
                    // fontFamily: "Microsoft YaHei",
                    borderColor: "#ccc",
                  },
                },
                // position: "inside",
                // fontWeight: "bold",
                fontSize: 14,
              },
              labelLine: {
                show: false,
                // showAbove: true,
              },
              labelLayout(params) {
                return {
                  // x: params.rect.x + 110,
                  // y: params.rect.y + params.rect.height / 2,
                  // verticalAlign: "middle",
                  // align: "left",
                  // fontSize: Math.max(params.rect.width / 5, 5),
                };
              },
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
