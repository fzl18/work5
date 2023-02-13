//*_*客户年度趋势
let customerYearTrendSet = {
  grid: {
    x: 100,
    y: 80,
    x2: 0,
    y2: 60,
    borderWidth: 1,
  },
  tooltip: {
    show: true,
  },
  xAxis: {
    // data: [],
    data: ["2016", "2017", "2018", "2019", "2020", "2021"],
    axisLabel: {
      textStyle: {
        color: "#fff",
        fontSize: 14,
      },
    },
    axisTick: {
      show: false,
    },
    axisLine: {
      show: false,
    },
  },
  yAxis: {
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      textStyle: {
        color: "#ffffff",
        fontSize: 14,
      },
    },
    splitLine: {
      // gird 区域中的分割线
      show: true, // 是否显示
      lineStyle: {
        color: "#5f512c",
        width: 1,
        type: "dashed",
      },
    },
  },
  // dataZoom: [
  //     {
  //         type: 'inside'
  //     }
  // ],
  series: [
    //柱状样式
    {
      type: "bar",
      barWidth: 15,
      itemStyle: {
        //颜色渐变
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "#9ac4f1" },
          // { offset: 0.5, color: '#2D65D5' },
          { offset: 1, color: "#168dfd" },
        ]),
        barBorderRadius: [15, 15, 15, 15],
      },
      //鼠标移入效果
      emphasis: {
        itemStyle: {
          color: "#188df0",
        },
      },
      data: [430000000, 610000000, 780000000, 590000000, 700000000, 800000000],
      // data: []
    },
  ],
};

//*_*国外客户占比趋势
let foreignCustomerTrendSet = {
  grid: {
    x: 100,
    y: 80,
    x2: 0,
    y2: 60,
    borderWidth: 1,
  },
  xAxis: {
    data: ["2016", "2017", "2018", "2019", "2020", "2021"],
    axisLabel: {
      textStyle: {
        color: "#fff",
        fontSize: 14,
      },
    },
    axisTick: {
      show: false,
    },
    axisLine: {
      show: false,
    },
  },
  yAxis: {
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      textStyle: {
        color: "#ffffff",
        fontSize: 14,
      },
    },
    splitLine: {
      // gird 区域中的分割线
      show: true, // 是否显示
      lineStyle: {
        color: "#5f512c",
        width: 1,
        type: "dashed",
      },
    },
  },
  barMaxWidth: 13,
  series: [
    {
      type: "bar",
      color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
        { offset: 0, color: "#ead281" },
        { offset: 0.8, color: "#ead281" },
        { offset: 1, color: "rgba(234,210,129,0.2)" },
      ]),
      itemStyle: {
        decal: {
          symbol: "rect",
          symbolSize: 2,
          color: "rgba(0, 0, 0, 1)",
          dashArrayY: [1, 4],
          dashArrayX: [1],
        },
      },
      data: [430000000, 610000000, 780000000, 590000000, 700000000, 800000000],
    },
  ],
};

//*_*客户行业分布
let customerIndustrySet = {
  series: [
    {
      type: "pie",
      radius: ["40%", "55%"],
      center: ["50%", "50%"],
      label: {
        // show: false
        formatter(val) {
          console.log(val);
        },
      },
      itemStyle: {
        // color: {
        //     type: 'linear',
        //     x: 0,
        //     y: 0.2113248654051872,
        //     x2: 1,
        //     y2: 0.7886751345948129,
        //     colorStops: [
        //         {
        //             offset: 1, color: '#3d7073' // 0% 处的颜色
        //         },
        //         {
        //             offset: 0, color: 'rgba(61,112,115,0)' // 100% 处的颜色
        //         }
        //     ],
        //     global: false // 缺省为 false
        // },
        color: "#3d7073",
        borderRadius: 20,
      },
      data: [
        {
          value: 35,
          name: "矿产开采",
          itemStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0.2113248654051872,
              x2: 1,
              y2: 0.7886751345948129,
              colorStops: [
                {
                  offset: 1,
                  color: "#3d7073", // 0% 处的颜色
                },
                {
                  offset: 0,
                  color: "rgba(61,112,115,0)", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
        },
        {
          value: 18,
          name: "火力发电",
          itemStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0.2113248654051872,
              x2: 1,
              y2: 0.7886751345948129,
              colorStops: [
                {
                  offset: 1,
                  color: "#3d7073", // 0% 处的颜色
                },
                {
                  offset: 0,
                  color: "rgba(61,112,115,0)", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
        },
        {
          value: 13,
          name: "建材水泥",
        },
        {
          value: 22,
          name: "钢铁冶炼",
        },
        {
          value: 12,
          name: "港口码头",
        },
      ],
      // roundCap: 1 //可选项为1和2，不填则采用原有拼接方式
    },
    {
      type: "pie",
      radius: ["60%", "70%"],
      center: ["50%", "50%"],
      label: {
        // 文字
        fontWeight: 12,
        fontFamily: "SegoeUI",
        alignTo: "labelLine",
        padding: [0, 0],
        formatter: ["{a|{b}}", "{b|{d}%}"].join("\n"),
        rich: {
          a: {
            color: "#ffffff",
            width: 1,
            align: "left",
            padding: [25, 0, 5, 0],
          },
          b: {
            color: "#f0c85c",
            align: "left",
            padding: [5, 0, 0, 0],
            textShadowColor: "rgba(240, 200, 92, 1)",
            textShadowBlur: 20,
          },
        },
      },
      labelLine: {
        // 引导线
        length2: 60,
        lineStyle: {
          color: "#65562e",
          width: 1,
        },
      },
      itemStyle: {
        borderWidth: 7,
        borderColor: "#121212",
        borderRadius: 10,
      },
      color: ["#83f9f8", "#027ad0", "#027ad0", "#027ad0", "#83f9f8"],
      data: [
        {
          value: 35,
          name: "矿产开采",
        },
        {
          value: 18,
          name: "火力发电",
        },
        {
          value: 13,
          name: "建材水泥",
        },
        {
          value: 22,
          name: "钢铁冶炼",
        },
        {
          value: 12,
          name: "港口码头",
        },
      ],
      // roundCap: 1 //可选项为1和2，不填则采用原有拼接方式
    },
  ],
};

//*_*地图
const planePath =
  "path://M.6,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705";
// const star = "path://M512 736.853333L775.68 896l-69.973333-299.946667L938.666667 394.24l-306.773334-26.453333L512 85.333333 392.106667 367.786667 85.333333 394.24l232.533334 201.813333L248.32 896 512 736.853333z"
const star = "image://assets/star.png";
const mapBranch =
  "data:image/png;base64,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";
const mapDistributor =
  "data:image/png;base64,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";
const tacked =
  "image://data:image/png;base64,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";
let mapChartSet = {
  backgroundColor: "#121212", //地图背景色
  visualMap: {
    left: "right",
    bottom: 100,
    min: 0,
    max: 1000,
    itemWidth: 36,
    itemHeight: 204,
    seriesIndex: [0],
    inRange: {
      color: ["#876118", "#dfc273"],
      // symbol: 'arrow',
      // symbolSize: '100'
    },
    align: "left",
    text: [],
    textStyle: {
      color: "#fff",
    },
    calculable: true,
    // borderColor: '#fff',
    // borderWidth: 1,
    handleStyle: {
      opacity: 0,
    },
  },
  geo: {
    map: "world",
    roam: false,
    emphasis: {
      label: {
        show: false,
      },
      itemStyle: {
        areaColor: "#9e9884",
      },
    },
    label: {
      show: false,
    },
    itemStyle: {
      normal: {
        areaColor: "#6a665b",
        borderColor: "#6a665b",
      },
      emphasis: {
        areaColor: "#0b1c2d",
      },
    },
  },
  series: [],
};
function setMapSeries(data) {
  let seriesArr = [
    {
      type: "map",
      map: "world",
      roam: false,
      textFixed: {
        Alaska: [20, -20],
      },
      itemStyle: {
        normal: {
          areaColor: "#6a665b",
          borderColor: "#6a665b",
        },
        emphasis: {
          areaColor: "#0b1c2d",
        },
      },
      data: [
        { name: "China", value: 200 },
        { name: "Mongolia", value: 20 },
      ],
    },
    //红星
    {
      name: "",
      type: "scatter",
      coordinateSystem: "geo",
      showAllSymbol: true,
      symbol: "diamond",
      symbol: star,
      symbolSize: 35.5,
      label: {
        normal: {},
      },
      itemStyle: {
        normal: {
          color: "#F62157", //标志颜色
        },
      },
      zlevel: 6,
      data: [
        {
          name: "China",
          value: [116.352963, 40.409079, 100],
        },
      ],
    },
    //飞行线条
    {
      type: "lines",
      zlevel: 1,
      effect: {
        show: true, //启用飞行效果
        period: 10, //飞行速度 6
        trailLength: 0.9, //飞行线的拖尾 .7
        color: "#fffc13", //飞行拖拽的颜色
        symbolSize: 3, //飞行线的宽度 3
      },
      lineStyle: {
        normal: {
          color: "#ab9e80",
          width: 0,
          curveness: -0.2, //飞行线的弯曲程度
        },
      },
      data: convertMapData(data),
    },
    //线条
    // {
    //     type: 'lines',
    //     zlevel: 2,
    //     effect: {
    //         show: true,
    //         period: 6,
    //         trailLength: 0,
    //         symbol: planePath,
    //         color: '#fffc13',
    //         symbolSize: 15
    //     },
    //     //飞行线底线的样式
    //     lineStyle: {
    //         normal: {
    //             color: '#fffce3',
    //             width: 1,
    //             opacity: 0.8,
    //             curveness: 0.2 //飞行线底线的弯曲程度
    //         }
    //     },
    //     data: convertMapData(data)
    // },
    //点(涟漪效果)
    {
      type: "effectScatter",
      coordinateSystem: "geo",
      zlevel: 2,
      rippleEffect: {
        scale: 5,
        brushType: "stroke",
        // brushType: 'fill'
      },
      label: {
        show: false,
      },
      // symbolSize: 15,
      symbolSize: [10, 5],
      itemStyle: {
        color: "#c0a158",
        shadowColor: "rgba(192,161,88, 0.5)",
        shadowBlur: 10,
      },
      data: data.map(function (dataItem) {
        return geoCoordMap[dataItem.name];
      }),
    },
    //图钉及tip
    {
      type: "scatter",
      coordinateSystem: "geo",
      itemStyle: {
        color: "#977328",
      },
      symbol: tacked, //图钉
      symbolSize: [46, 58],
      symbolOffset: [0, -13],
      z: 9999,
      label: {
        normal: {
          show: true,
          position: "insideTop",
          distance: -25,
          backgroundColor: "#2a2823",
          borderRadius: 5,
          padding: 0,
          rich: {
            //纯文字
            t1: {
              color: "#fff",
              padding: [10, 15, 6, 15],
            },
            //有图标的文字
            t2: {
              color: "#fff",
              padding: [0, 8, -5, 0],
            },
            //分销商
            mapBranch: {
              width: 30,
              height: 30,
              backgroundColor: { image: mapBranch },
            },
            //分销机构
            mapDistributor: {
              width: 30,
              height: 30,
              backgroundColor: { image: mapDistributor },
            },
          },
          formatter: function (params) {
            let d = params.data.data;
            let branch = d.isBranch ? "{mapBranch|}" : "";
            let distributor = d.isDistributor ? "{mapDistributor|}" : "";
            let t =
              !d.isBranch && !d.isDistributor
                ? `{t1|${d.types}}`
                : `{t2|${d.types}}`;
            return branch + distributor + t;
          },
        },
      },
      data: data.map(function (dataItem) {
        return {
          name: dataItem.name,
          value: geoCoordMap[dataItem.name],
          data: dataItem.data,
        };
      }),
    },
  ];
  return seriesArr;
}
/***
 * 地图线条起始值
 */
function convertMapData(data) {
  let res = [];
  for (let i = 0; i < data.length; i++) {
    let dataItem = data[i];
    let toCoord = geoCoordMap[dataItem.name];
    if (toCoord) {
      res.push([
        {
          //from
          coord: geoCoordMap["China"],
        },
        {
          coord: toCoord,
        },
      ]);
    }
  }
  return res;
}

//*_* 五大洲雷达

let continentRadarSet = {
  title: {
    show: true,
    text: "全球客户分布数量",
    top: "bottom",
    left: "center",
    textStyle: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "normal",
    },
  },
  radar: {
    radius: "72%", //大小
    nameGap: 1, // 图中工艺等字距离图的距离
    center: ["50%", "55%"], // 图的位置
    name: {
      padding: 10,
      rich: {
        n: {
          color: "rgba(255, 255, 255, 0.5)",
          fontSize: 14,
          align: "center",
        },
        v: {
          color: "#f0c85c",
          fontSize: 18,
          padding: [8, 0, 0, 0],
          align: "center",
        },
      },
      formatter: function (name, indicator) {
        return `{n|${name}}` + `\n{v|${indicator.value}}`;
      },
    },
    indicator: [
      { name: "亚洲", max: "1000", value: 682 },
      { name: "大洋洲", max: "100", value: 20 },
      { name: "非洲", max: "100", value: 32 },
      { name: "美洲", max: "100", value: 11 },
      { name: "欧洲", max: "100", value: 16 },
    ],
    axisLine: {
      lineStyle: {
        color: "#3F3228",
      },
    },
    splitArea: {
      show: false,
    },
    splitLine: {
      show: true,
      lineStyle: {
        width: 1,
        color: "#3F3228", // 设置网格的颜色
      },
    },
  },

  series: [
    {
      type: "radar",
      symbol: "angle",
      itemStyle: {
        normal: {
          areaStyle: { type: "default" },
        },
      },
      data: [
        {
          symbol: "circle",
          symbolSize: 5,
          value: [682, 20, 32, 11, 16],
          areaStyle: { color: "rgba(190,154,82, 0.4)" },
          itemStyle: {
            normal: {
              borderWidth: 1,
              color: "RGBA(190,154,82, 1)",
              borderColor: "rgba(190,154,82, 1)",
            },
          },
          lineStyle: {
            color: "rgba(190,154,82, 1)",
            width: 1,
          },
        },
      ],
    },
  ],
};

//*_*签约订单量年度趋势
let contractOrderTrendSet = {
  grid: {
    x: 50,
    y: 50,
    x2: 0,
    y2: 60,
    borderWidth: 1,
  },
  tooltip: {
    show: true,
  },
  xAxis: {
    type: "category",
    axisLabel: {
      textStyle: {
        color: "#fff",
      },
    },
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    splitLine: {
      show: false,
    },
    data: ["2017年", "2018年", "2019年", "2020年", "2021年"],
  },
  yAxis: {
    type: "value",
    interval: 50,
    axisLabel: {
      showMinLabel: false,
      showMaxLabel: false,
      verticalAlign: "top",
      lineHeight: 30,
      textStyle: {
        color: "#fff",
      },
      formatter(d) {
        return d + "笔";
      },
    },
    axisTick: {
      show: false,
    },
    splitLine: {
      show: false,
    },
    splitArea: {
      show: true,
      areaStyle: {
        color: ["rgba(62,58,57,0.3)", "#121212"],
      },
    },
  },
  series: [
    {
      type: "bar",
      barWidth: 30,
      itemStyle: {
        //颜色渐变
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "rgba(250, 179, 41, 0.6)" },
          { offset: 1, color: "rgba(75, 75, 75, 0.1)" },
        ]),
      },
      data: [152, 123, 118, 125, 146],
    },
    {
      type: "line",
      symbol: "circle",
      symbolSize: 14,
      label: {
        show: true,
        color: "rgba(231,185,100,0.4)",
        fontSize: 21,
      },
      itemStyle: {
        color: "#e7b964",
      },
      areaStyle: {
        color: "rgba(211,172,95,0.2)",
        origin: "start",
      },
      data: [152, 123, 118, 125, 146],
    },
  ],
};

//*_*国内外销量趋势
let homeAndAbroadSalesTrendSet = {
  grid: {
    x: 50,
    y: 50,
    x2: 10,
    y2: 60,
    borderWidth: 1,
  },
  legend: {
    top: 20,
    left: "right",
    textStyle: {
      color: "#fff",
    },
    icon: "rect",
    data: ["国内", "国外"],
    itemWidth: 20,
    itemHeight: 1,
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    axisTick: {
      show: false,
    },
    axisLabel: {
      textStyle: {
        color: "#fff",
      },
    },
    axisLine: {
      symbol: ["none", "triangle"],
      lineStyle: {
        color: "#3e3621",
      },
    },
    data: ["", "2017年", "2017年", "2017年", "2017年", "2017年", ""],
  },
  yAxis: {
    type: "value",
    interval: 500,
    axisLabel: {
      textStyle: {
        color: "#fff",
      },
    },
    axisLine: {
      show: true,
      symbol: ["none", "triangle"],
      lineStyle: {
        color: "#3e3621",
      },
    },
    splitLine: {
      lineStyle: {
        color: "#3e3621",
      },
    },
  },
  series: [
    {
      name: "国内",
      data: [200, 1200, 1081, 1800, 1450, 2000, 200],
      type: "line",
      symbol: "none",
      lineStyle: {
        color: "#83f9f8",
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "rgba(131,249,248, 0.6)" },
          { offset: 0.6, color: "rgba(131,249,248, 0.3)" },
          { offset: 1, color: "rgba(75, 75, 75, 0)" },
        ]),
      },
    },
    {
      name: "国外",
      data: [200, 1000, 881, 1400, 1050, 1208, 200],
      type: "line",
      symbol: "none",
      lineStyle: {
        color: "#1688db",
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "rgba(22,136,219, 0.8)" },
          { offset: 0.6, color: "rgba(22,136,219, 0.3)" },
          { offset: 1, color: "rgba(22,136,219, 0)" },
        ]),
      },
    },
  ],
};

//*_*新特产品销量趋势
let newProductsalesTrendSet = {
  grid: {
    x: 50,
    y: 50,
    x2: 18,
    y2: 60,
    borderWidth: 1,
  },
  xAxis: {
    type: "category",
    axisTick: {
      show: false,
    },
    axisLabel: {
      textStyle: {
        color: "#fff",
      },
    },
    axisLine: {
      symbol: ["none", "triangle"],
      symbolOffset: [0, 8],
      lineStyle: {
        color: "#3e3621",
      },
    },
    data: [
      "钢网带",
      "钢网带",
      "钢网带",
      "钢网带",
      "钢网带",
      "钢网带",
      "钢网带",
    ],
  },
  yAxis: {
    type: "value",
    splitNumber: 3,
    axisLabel: {
      textStyle: {
        color: "#fff",
      },
    },
    axisLine: {
      show: true,
      symbol: ["none", "triangle"],
      symbolOffset: [0, 8],
      lineStyle: {
        color: "#3e3621",
      },
    },
    splitLine: {
      lineStyle: {
        color: "#3e3621",
      },
    },
  },
  series: [
    {
      type: "bar",
      showBackground: true,
      barWidth: 35,
      backgroundStyle: {
        color: "#4c473e",
        opacity: 0.33,
      },
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 1, color: "#282724" },
          { offset: 0, color: "#c9a45b" },
        ]),
      },
      data: [60, 190, 155, 140, 110, 180, 124],
    },
  ],
};

//*_*新特产品销量占比趋势
let newProductsalesProportionTrendSet = {
  grid: {
    x: 50,
    y: 50,
    x2: 18,
    y2: 60,
    borderWidth: 1,
  },
  legend: {
    top: 20,
    textStyle: {
      color: "#fff",
    },
    data: [
      { name: "普通产品", itemStyle: { color: "#c9a45b" } },
      { name: "新特产品", itemStyle: { color: "#0079d6" } },
    ],
    itemWidth: 12,
    itemHeight: 12,
  },
  xAxis: {
    type: "category",
    axisTick: {
      show: false,
    },
    axisLabel: {
      textStyle: {
        color: "#fff",
      },
    },
    axisLine: {
      symbol: ["none", "triangle"],
      symbolOffset: [0, 8],
      lineStyle: {
        color: "#3e3621",
      },
    },
    data: ["2017年", "2018年", "2019年", "2020年", "2021年"],
  },
  yAxis: {
    type: "value",
    splitNumber: 3,
    axisLabel: {
      textStyle: {
        color: "#fff",
      },
    },
    axisLine: {
      show: true,
      symbol: ["none", "triangle"],
      symbolOffset: [0, 8],
      lineStyle: {
        color: "#3e3621",
      },
    },
    splitLine: {
      lineStyle: {
        color: "#3e3621",
      },
    },
  },
  series: [
    {
      name: "新特产品",
      type: "bar",
      barWidth: 35,
      stack: "product",
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 1, color: "#1d1d1d" },
          { offset: 0, color: "#0079d6" },
        ]),
      },
      data: [220, 182, 191, 234, 290],
    },
    {
      name: "普通产品",
      type: "bar",
      barWidth: 35,
      stack: "product",
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 1, color: "#1d1d1d" },
          { offset: 0, color: "#c9a45b" },
        ]),
      },
      data: [120, 132, 101, 134, 90],
    },
  ],
};

//*_*本年度发货产品排名及占比
let yearProductRankAndProportionSet = {
  legend: {
    top: 25,
    textStyle: {
      color: "#fff",
    },
    data: [
      { name: "2020年", icon: "circle", itemStyle: { color: "#D3AC5F" } },
      { name: "2021年", icon: "circle", itemStyle: { color: "#0078d5" } },
    ],
  },
  grid: {
    x: 50,
    y: 50,
    x2: 25,
    y2: 60,
    borderWidth: 1,
  },
  xAxis: {
    type: "value",
    axisTick: {
      show: false,
    },
    axisLine: {
      show: false,
    },
    splitLine: {
      show: false,
    },
    axisLabel: {
      textStyle: {
        color: "#fff",
      },
    },
    boundaryGap: [0, 0.01],
  },
  yAxis: {
    type: "category",
    axisTick: {
      show: false,
    },
    axisLine: {
      show: false,
    },
    axisLabel: {
      textStyle: {
        color: "#fff",
      },
    },
    data: ["特种带", "耐磨", "抗痒性", "耐热", "阻燃", "耐高温"],
  },
  series: [
    {
      name: "2021年",
      type: "bar",
      barWidth: 4,
      barGap: "400%",
      itemStyle: {
        color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
          { offset: 1, color: "#121212" },
          { offset: 0, color: "#D3AC5F" },
        ]),
      },
      data: [45000, 50000, 80000, 130000, 150000, 250000],
    },
    {
      name: "2020年",
      type: "bar",
      barWidth: 4,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
          { offset: 1, color: "#121212" },
          { offset: 0, color: "#0078d5" },
        ]),
      },
      data: [50000, 60000, 100000, 140000, 150000, 280000],
    },
    //原点
    {
      type: "pictorialBar",
      symbol:
        "image://data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjRweCIgaGVpZ2h0PSIyNHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+6buE6Imy5ZyG54K5PC90aXRsZT4KICAgIDxnIGlkPSLpu4ToibLlnIbngrkiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSLnvJbnu4QiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuODc1MDAwLCAwLjg1OTUwMCkiPgogICAgICAgICAgICA8cGF0aCBkPSJNMTEuMTI1LDAgQzE3LjI2OSwwIDIyLjI1LDQuOTg4IDIyLjI1LDExLjE0MSBDMjIuMjUsMTcuMjkzIDE3LjI2OSwyMi4yODEgMTEuMTI1LDIyLjI4MSBDNC45ODEsMjIuMjgxIDAsMTcuMjkzIDAsMTEuMTQxIEMwLDQuOTg4IDQuOTgxLDAgMTEuMTI1LDAgWiIgaWQ9Iui3r+W+hCIgZmlsbD0iI0ZGQzc1RiIgb3BhY2l0eT0iMC4xNDkiPjwvcGF0aD4KICAgICAgICAgICAgPHBhdGggZD0iTTExLjEwOSw2LjE4OCBDMTMuODQ1LDYuMTg4IDE2LjA2Myw4LjQwNSAxNi4wNjMsMTEuMTQxIEMxNi4wNjMsMTMuODc2IDEzLjg0NSwxNi4wOTQgMTEuMTA5LDE2LjA5NCBDOC4zNzQsMTYuMDk0IDYuMTU2LDEzLjg3NiA2LjE1NiwxMS4xNDEgQzYuMTU2LDguNDA1IDguMzc0LDYuMTg4IDExLjEwOSw2LjE4OCBaIiBpZD0i6Lev5b6EIiBmaWxsPSIjRkZENzFGIj48L3BhdGg+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=",
      symbolSize: [20, 20],
      symbolOffset: [10, -10],
      z: 12,
      data: yearProductRankAndProportionSymbolData([
        45000, 50000, 80000, 130000, 150000, 250000,
      ]),
    },
    {
      type: "pictorialBar",
      symbol:
        "image://data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjRweCIgaGVpZ2h0PSIyNHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+6JOd6Imy5ZyG54K5PC90aXRsZT4KICAgIDxnIGlkPSLok53oibLlnIbngrkiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSLnvJbnu4QiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuODc1MDAwLCAwLjg1OTUwMCkiIGZpbGw9IiMwMDkxRjYiPgogICAgICAgICAgICA8cGF0aCBkPSJNMTEuMTI1LDAgQzE3LjI2OSwwIDIyLjI1LDQuOTg4IDIyLjI1LDExLjE0MSBDMjIuMjUsMTcuMjkzIDE3LjI2OSwyMi4yODEgMTEuMTI1LDIyLjI4MSBDNC45ODEsMjIuMjgxIDAsMTcuMjkzIDAsMTEuMTQxIEMwLDQuOTg4IDQuOTgxLDAgMTEuMTI1LDAgWiIgaWQ9Iui3r+W+hCIgb3BhY2l0eT0iMC4xNDkiPjwvcGF0aD4KICAgICAgICAgICAgPHBhdGggZD0iTTExLjEwOSw2LjE4OCBDMTMuODQ1LDYuMTg4IDE2LjA2Miw4LjQwNSAxNi4wNjIsMTEuMTQxIEMxNi4wNjIsMTMuODc2IDEzLjg0NSwxNi4wOTQgMTEuMTA5LDE2LjA5NCBDOC4zNzQsMTYuMDk0IDYuMTU2LDEzLjg3NiA2LjE1NiwxMS4xNDEgQzYuMTU2LDguNDA1IDguMzc0LDYuMTg4IDExLjEwOSw2LjE4OCBaIiBpZD0i6Lev5b6EIj48L3BhdGg+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=",
      symbolSize: [20, 20],
      symbolOffset: [10, 10],
      z: 12,
      data: yearProductRankAndProportionSymbolData([
        50000, 60000, 100000, 140000, 150000, 280000,
      ]),
    },
  ],
};
function yearProductRankAndProportionSymbolData(data) {
  let arr = [];
  for (var i = 0; i < data.length; i++) {
    arr.push({
      value: data[i],
      symbolPosition: "end",
    });
  }
  return arr;
}

//*_*历年营收趋势
function yearsRevenueTrendSet(
  xData = ["2015", "2016", "2017", "2018", "2019", "2020"],
  yData = [200, 100, 200, 200, 100, 123]
) {
  return {
    grid: {
      x: 90,
      y: 100,
      x2: 60,
      y2: 60,
      borderWidth: 1,
    },
    xAxis: {
      name: "年份",
      nameTextStyle: {
        color: "#fff",
        fontSize: 14,
        lineHeight: 46,
      },
      data: xData,
      show: true,
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisLabel: {
        interval: 0,
        textStyle: {
          color: "#fff",
          fontSize: 14,
        },
        margin: 20, //刻度标签与轴线之间的距离。
      },
    },
    yAxis: {
      name: "营收（万元）",
      nameTextStyle: {
        color: "#fff",
        fontSize: 14,
        align: "right",
        lineHeight: 46,
      },
      splitLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: "#1b3b49",
        },
      },
      axisLabel: {
        textStyle: {
          color: "#fff",
          fontSize: 14,
        },
      },
    },
    series: [
      //下面的原片
      {
        name: "",
        type: "pictorialBar",
        symbolSize: [19, 5],
        symbolOffset: [0, 3],
        z: 12,
        itemStyle: {
          opacity: 1,
          color: function (params) {
            var a = params.name.slice(0, 2);
            return new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                {
                  offset: 0,
                  color: "#12B9DB", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#6F8EF2", // 100% 处的颜色
                },
              ],
              false
            );
          },
        },
        data: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
      },
      //下半截柱状图
      {
        name: "2020",
        type: "bar",
        barWidth: 19,
        barGap: "-100%",
        itemStyle: {
          //lenged文本
          opacity: 0.7,
          color: function (params) {
            var a = params.name.slice(0, 2);

            return new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                {
                  offset: 0,
                  color: "#12B9DB", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#6F8EF2", // 100% 处的颜色
                },
              ],
              false
            );
          },
        },
        data: yData,
      },
      {
        name: "",
        type: "pictorialBar",
        symbolSize: [19, 5],
        symbolOffset: [0, -3],
        z: 12,
        itemStyle: {
          opacity: 1,
          color: function (params) {
            var a = params.name.slice(0, 2);
            return new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                {
                  offset: 0,
                  color: "#12B9DB", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#6F8EF2", // 100% 处的颜色
                },
              ],
              false
            );
          },
        },
        symbolPosition: "end",
        data: yData,
      },
    ],
  };
}

//*_*碳排放月度趋势
let carbonEmissionsTrendSet = {
  grid: {
    x: 50,
    y: 60,
    x2: 0,
    y2: 30,
    borderWidth: 1,
  },
  legend: {
    top: 20,
    textStyle: {
      color: "#fff",
    },
    data: [
      {
        name: "2020年",
        icon: "circle",
        itemStyle: { color: "#047fd7", borderWidth: 0 },
      },
      {
        name: "2021年",
        icon: "circle",
        itemStyle: { color: "#b88841", borderWidth: 0 },
      },
    ],
  },
  xAxis: [
    {
      type: "category",
      data: [
        "1月",
        "2月",
        "3月",
        "4月",
        "5月",
        "6月",
        "7月",
        "8月",
        "9月",
        "10月",
        "11月",
        "12月",
      ],
      axisTick: {
        show: false,
      },
      axisLabel: {
        textStyle: {
          color: "rgba(255,255,255,0.5)",
          fontSize: 14,
        },
      },
      axisLine: {
        lineStyle: {
          color: "#302a1c",
        },
      },
    },
  ],
  yAxis: [
    {
      type: "value",
      name: "碳排放量（吨）",
      nameTextStyle: {
        color: "rgba(255,255,255,0.5)",
      },
      // interval: 50,
      axisTick: {
        show: false,
      },
      axisLabel: {
        textStyle: {
          color: "rgba(255,255,255,0.5)",
          fontSize: 14,
        },
      },
      axisLine: {
        lineStyle: {
          color: "#302a1c",
        },
      },
      splitLine: {
        lineStyle: {
          type: "dashed",
          color: "#423922",
        },
      },
    },
  ],
  series: [
    {
      type: "bar",
      data: [250, 490, 70, 232, 256, 767, 135],
      z: 1,
      barWidth: 10,
      barGap: "50%",
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "rgba(0,145,246,1)" },
          { offset: 1, color: "rgba(34, 68, 172,0.3)" },
        ]),
      },
    },
    {
      type: "bar",
      data: [260, 590, 90, 264, 287, 707, 175, 182, 487, 188, 60, 230],
      z: 1,
      barWidth: 10,
      itemStyle: {
        //颜色渐变
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "rgba(211,172,95,1)" },
          { offset: 1, color: "rgba(124, 87, 15, 0.35)" },
        ]),
      },
    },
    {
      name: "2020年",
      xAxisIndex: 1,
      type: "line",
      symbol: "circle",
      symbolSize: 5,
      itemStyle: {
        color: "#047fd7",
        borderWidth: 2,
        borderColor: "#fff",
      },
      lineStyle: {
        color: "#047fd7",
      },
      data: [250, 490, 70, 232, 256, 767, 135],
    },
    {
      name: "2021年",
      xAxisIndex: 1,
      type: "line",
      symbol: "circle",
      symbolSize: 5,
      itemStyle: {
        color: "#b88841",
        borderWidth: 2,
        borderColor: "#fff",
      },
      lineStyle: {
        color: "#b88841",
      },
      data: [260, 590, 90, 264, 287, 707, 175, 182, 487, 188, 60, 230],
    },
  ],
};

//*_*仪表盘
/**
 *
 * @param {*} data1 主持修订 / 省级重点
 * @param {*} data2 参与修订 / 国家重点
 * @returns
 */
function dashboardSet(
  data1 = { name: "主持修订", value: 6 },
  data2 = { name: "参与修订", value: 4 }
) {
  let perData1 = (data1.value / (data1.value + data2.value)).toFixed(2);
  let perData2 = (data2.value / (data1.value + data2.value)).toFixed(2);
  var colorLeftAlpha = ["#6b501c", "#121212"];
  return {
    series: [
      // 内侧刻度
      {
        type: "gauge",
        radius: "145%", // 位置
        center: ["50%", "90%"],
        min: 0,
        max: 100,
        startAngle: 180,
        endAngle: 0,
        zlevel: 1,
        axisLine: {
          show: true,
          lineStyle: {
            // 轴线样式
            width: 60, // 宽度
            color: [
              [
                perData1,
                new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  {
                    offset: 0,
                    color: colorLeftAlpha[0],
                  },
                  {
                    offset: 1,
                    color: colorLeftAlpha[1],
                  },
                ]),
              ],
            ], // 颜色
          },
        },
        axisTick: {
          // 刻度
          show: false,
        },
        splitLine: {
          // 分割线
          show: false,
        },
        axisLabel: {
          // 刻度标签
          show: false,
        },
        pointer: {
          // 仪表盘指针
          show: false,
        },
        detail: {
          // 仪表盘详情
          show: false,
        },
      },
      {
        type: "gauge",
        radius: "145%", // 位置
        center: ["50%", "90%"],
        min: 0,
        max: 100,
        startAngle: 0,
        endAngle: 180,
        clockwise: false,
        zlevel: 10,
        axisLine: {
          show: true,
          lineStyle: {
            // 轴线样式
            width: 60, // 宽度
            color: [
              [
                perData2,
                new echarts.graphic.LinearGradient(0, 1, 1, 1, [
                  {
                    offset: 0,
                    color: "rgba(255,255,255,0.8)",
                  },
                  {
                    offset: 0.3,
                    color: "rgba(255,255,255,0.4)",
                  },
                  {
                    offset: 1,
                    color: "rgba(255,255,255,0)",
                  },
                ]),
              ],
            ], // 颜色
          },
        },
        axisTick: {
          // 刻度
          show: false,
        },
        splitLine: {
          // 分割线
          show: false,
        },
        axisLabel: {
          // 刻度标签
          show: false,
        },
        pointer: {
          // 仪表盘指针
          show: false,
        },
        detail: {
          // 仪表盘详情
          show: false,
        },
      },
      //中间的小圆
      {
        type: "gauge",
        radius: "55%", // 位置
        center: ["50%", "90%"],
        min: 0,
        max: 100,
        startAngle: 180,
        endAngle: 0,
        axisLine: {
          show: true,
          lineStyle: {
            // 轴线样式
            width: 120, // 宽度
            color: [
              [
                1,
                new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: colorLeftAlpha[0],
                  },
                  {
                    offset: 1,
                    color: colorLeftAlpha[1],
                  },
                ]),
              ],
            ], // 颜色
          },
        },
        axisTick: {
          // 刻度
          show: false,
        },
        splitLine: {
          // 分割线
          show: false,
        },
        axisLabel: {
          // 刻度标签
          show: false,
        },
        pointer: {
          // 仪表盘指针
          show: false,
        },
        detail: {
          // 仪表盘详情
          show: false,
        },
      },
      //左半部分
      {
        type: "pie",
        radius: "145%",
        center: ["50%", "90%"],
        startAngle: 0,
        clockwise: false,
        itemStyle: {
          color: "rgba(0,0,0,0)",
        },
        label: {
          color: "#fff",
          formatter(value) {
            return `{a|${value.name}}{b|${value.data.count}}`;
          },
          rich: {
            //标题
            a: {
              color: "rgba(255,255,255,0.5)",
              fontSize: 16,
            },
            //值
            b: {
              fontSize: 30,
              padding: [0, 0, 0, 10],
              color: "#ffffff",
            },
          },
        },
        labelLine: {
          lineStyle: {
            color: "#6b5b30",
          },
        },
        //设置引导线和文字位置
        labelLayout: {
          x: "130",
          y: "20",
          width: 200,
          labelLinePoints: [
            [25, 20],
            [10, 40],
            [10, 60],
            [120, 60],
          ],
        },
        data: [
          {
            value: perData2,
            name: data2.name,
            count: data2.value,
            labelLine: { show: false },
            label: { show: false },
          },
          { value: perData1, name: data1.name, count: data1.value },
          {
            value: 1,
            name: "t",
            labelLine: { show: false },
            label: { show: false },
          },
        ],
        zlevel: 0,
      },
      {
        type: "pie",
        radius: "145%",
        center: ["50%", "90%"],
        startAngle: 0,
        clockwise: false,
        itemStyle: {
          color: "rgba(0,0,0,0)",
        },
        label: {
          color: "#fff",
          formatter(value) {
            return `{a|${value.name}}{b|${value.data.count}}`;
          },
          rich: {
            //标题
            a: {
              color: "rgba(255,255,255,0.5)",
              fontSize: 16,
            },
            //值
            b: {
              fontSize: 30,
              padding: [0, 0, 0, 10],
              color: "#ffffff",
            },
          },
        },
        labelLine: {
          lineStyle: {
            color: "#6b5b30",
          },
        },
        //设置引导线和文字位置
        labelLayout: {
          x: "255",
          y: "20",
          width: 200,
          labelLinePoints: [
            [360, 20],
            [380, 40],
            [380, 60],
            [280, 60],
          ],
        },
        data: [
          { value: perData2, name: data2.name, count: data2.value },
          {
            value: perData1,
            name: data1.name,
            count: data1.value,
            labelLine: { show: false },
            label: { show: false },
          },
          {
            value: 1,
            name: "t",
            labelLine: { show: false },
            label: { show: false },
          },
        ],
        zlevel: 0,
      },
      getTickLine(168, 5),
      getTickLine(152, 5),
      getTickLine(136, 4),
      getTickLine(118, 4),
      getTickLine(102, 3),
    ],
  };
  function getTickLine(radius, splitNumber) {
    return {
      name: "",
      type: "gauge",
      detail: false,
      splitNumber: splitNumber, //刻度数量
      radius: `${radius}%`, //图表尺寸
      center: ["50%", "90%"],
      startAngle: 178, //开始刻度的角度
      endAngle: 2, //结束刻度的角度
      zlevel: 2,
      axisLine: {
        show: false,
      },
      axisTick: {
        show: true,
        lineStyle: {
          // color: '#6d5227',
          color: "#715528",
          width: 4,
        },
        length: 1,
        splitNumber: 10,
      },
      splitLine: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
    };
  }
}

//*_*研发改进玫瑰图
function improvementSet() {
  return {
    grid: {
      left: -100,
      top: 50,
      bottom: 10,
      right: 10,
      containLabel: true,
    },
    polar: {},
    angleAxis: {
      interval: 1,
      type: "category",
      data: [],
      z: 10,
      axisLine: {
        show: false,
        lineStyle: {
          color: "#0B4A6B",
          width: 1,
          type: "solid",
        },
      },
      axisLabel: {
        interval: 0,
        show: true,
        color: "#0B4A6B",
        margin: 8,
        fontSize: 16,
      },
    },
    radiusAxis: {
      min: 20,
      max: 120,
      interval: 20,
      axisLine: {
        show: false,
        lineStyle: {
          color: "#0B3E5E",
          width: 1,
          type: "solid",
        },
      },
      axisLabel: {
        formatter: "{value} %",
        show: false,
        padding: [0, 0, 20, 0],
        color: "#0B3E5E",
        fontSize: 16,
      },
      splitLine: {
        lineStyle: {
          color: "#07385e",
          width: 2,
          type: "dashed",
        },
      },
    },
    calculable: true,
    series: [
      {
        stack: "a",
        type: "pie",
        radius: "80%",
        roseType: "area",
        zlevel: 10,
        startAngle: 120,
        label: {
          normal: {
            formatter: ["{b|{b}}", "{d|{c}}"].join("\n"),
            rich: {
              b: {
                color: "#fff",
                fontSize: 14,
                lineHeight: 20,
              },
              d: {
                fontSize: 40,
                color: "#83f9f8",
                align: "center",
                lineHeight: 60,
              },
            },
          },
        },
        labelLine: {
          normal: {
            show: true,
            length: 5,
            length2: 15,
            lineStyle: {
              color: "#0096b1",
            },
          },
          emphasis: {
            show: false,
          },
        },
        data: [
          {
            value: 3,
            name: "产品改进",
            itemStyle: {
              borderColor: "rgba(131,249,248,1)",
              borderWidth: 2,
              shadowBlur: 20,
              shadowColor: "rgba(131,249,248,1)",
              shadowOffsetx: 25,
              shadowOffsety: 20,
              color: "rgba(131,249,248,0.1)",
            },
          },
          {
            value: 2,
            name: "项目改进",
            itemStyle: {
              borderColor: "rgba(238,217,134,1)",
              borderWidth: 2,
              shadowBlur: 20,
              shadowColor: "rgba(238,217,134,1)",
              shadowOffsetx: 25,
              shadowOffsety: 20,
              color: "rgba(238,217,134,0.1)",
            },
          },
        ],
      },
    ],
  };
}

//*_*产品认证/奖项年度统计
let productYearCountSet = {
  grid: {
    x: 50,
    y: 65,
    x2: 18,
    y2: 45,
    borderWidth: 1,
  },
  xAxis: {
    type: "category",
    axisTick: {
      show: false,
    },
    axisLabel: {
      textStyle: {
        color: "rgba(255,255,255,0.5)",
      },
    },
    axisLine: {
      symbolOffset: [0, 8],
      lineStyle: {
        color: "#3e3621",
      },
    },
    data: ["2017", "2018", "2019", "2020", "2021"],
  },
  yAxis: {
    name: "数量（项）",
    nameTextStyle: {
      color: "rgba(255,255,255,0.5)",
    },
    type: "value",
    splitNumber: 3,
    axisLabel: {
      textStyle: {
        color: "rgba(255,255,255,0.5)",
      },
    },
    axisLine: {
      show: true,
      symbolOffset: [0, 8],
      lineStyle: {
        color: "#3e3621",
      },
    },
    splitLine: {
      show: false,
    },
  },
  series: [
    {
      type: "bar",
      barWidth: 40,
      backgroundStyle: {
        color: "#4c473e",
        opacity: 0.33,
      },
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 1, color: "rgba(124, 87, 15, 0.2)" },
          { offset: 0, color: "#a97d3d" },
        ]),
      },
      data: [3, 2, 1, 1, 2],
    },
    {
      type: "line",
      symbol:
        "image://data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjRweCIgaGVpZ2h0PSIyNHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+6buE6Imy5ZyG54K5PC90aXRsZT4KICAgIDxnIGlkPSLpu4ToibLlnIbngrkiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSLnvJbnu4QiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuODc1MDAwLCAwLjg1OTUwMCkiPgogICAgICAgICAgICA8cGF0aCBkPSJNMTEuMTI1LDAgQzE3LjI2OSwwIDIyLjI1LDQuOTg4IDIyLjI1LDExLjE0MSBDMjIuMjUsMTcuMjkzIDE3LjI2OSwyMi4yODEgMTEuMTI1LDIyLjI4MSBDNC45ODEsMjIuMjgxIDAsMTcuMjkzIDAsMTEuMTQxIEMwLDQuOTg4IDQuOTgxLDAgMTEuMTI1LDAgWiIgaWQ9Iui3r+W+hCIgZmlsbD0iI0ZGQzc1RiIgb3BhY2l0eT0iMC4xNDkiPjwvcGF0aD4KICAgICAgICAgICAgPHBhdGggZD0iTTExLjEwOSw2LjE4OCBDMTMuODQ1LDYuMTg4IDE2LjA2Myw4LjQwNSAxNi4wNjMsMTEuMTQxIEMxNi4wNjMsMTMuODc2IDEzLjg0NSwxNi4wOTQgMTEuMTA5LDE2LjA5NCBDOC4zNzQsMTYuMDk0IDYuMTU2LDEzLjg3NiA2LjE1NiwxMS4xNDEgQzYuMTU2LDguNDA1IDguMzc0LDYuMTg4IDExLjEwOSw2LjE4OCBaIiBpZD0i6Lev5b6EIiBmaWxsPSIjRkZENzFGIj48L3BhdGg+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=",
      symbolSize: [40, 40],
      label: {
        show: true,
        color: "#ffd71f",
        fontSize: 20,
      },
      itemStyle: {
        color: "#e7b964",
      },
      data: [3, 2, 1, 1, 2],
    },
  ],
};

//*_*改进项目年度统计
let improvementProjectYearCount = {
  grid: {
    x: 50,
    y: 65,
    x2: 18,
    y2: 45,
    borderWidth: 1,
  },
  legend: {
    left: "right",
    itemGap: 60,
    top: 25,
    textStyle: {
      color: "rgba(255,255,255,0.5)",
    },
    data: ["产品改进", "工艺改进"],
  },
  xAxis: [
    {
      type: "value",
      axisTick: {
        show: true,
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: "#38311f",
        },
      },
      axisLabel: {
        color: "rgba(255,255,255,0.5)",
      },
      splitLine: {
        show: false,
      },
    },
  ],
  yAxis: [
    {
      type: "category",
      axisTick: {
        show: false,
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: "#38311f",
        },
      },
      axisLine: {
        lineStyle: {
          width: 4,
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 1,
                color: "#fead51", // 0% 处的颜色
              },
              {
                offset: 0,
                color: "#18fdfe", // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        },
      },
      axisLabel: {
        color: "rgba(255,255,255,0.5)",
      },
      data: ["2017", "2018", "2019", "2020", "2021"],
    },
  ],
  series: [
    {
      name: "工艺改进",
      type: "bar",
      stack: "总量",
      barWidth: 10,
      emphasis: {
        focus: "series",
      },
      itemStyle: {
        borderRadius: [0, 10, 10, 0],
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [
            {
              offset: 1,
              color: "#997136", // 0% 处的颜色
            },
            {
              offset: 0.3,
              color: "rgba(153,113,54,0.6)", // 0% 处的颜色
            },
            {
              offset: 0,
              color: "rgba(153,113,54,0.05)", // 100% 处的颜色
            },
          ],
          global: false, // 缺省为 false
        },
      },
      data: [3, 2, 2.6, 2.8, 1],
    },
    {
      name: "产品改进",
      type: "bar",
      barWidth: 10,
      stack: "总量",
      emphasis: {
        focus: "series",
      },
      itemStyle: {
        borderRadius: [10, 0, 0, 10],
        color: {
          type: "linear",
          x: 1,
          y: 0,
          x2: 0,
          y2: 0,
          colorStops: [
            {
              offset: 1,
              color: "#0365a0", // 0% 处的颜色
            },
            {
              offset: 0.3,
              color: "rgba(3,101,160,0.6)", // 0% 处的颜色
            },
            {
              offset: 0,
              color: "rgba(3,101,160,0.05)", // 100% 处的颜色
            },
          ],
          global: false, // 缺省为 false
        },
      },
      data: [-3, -2, -2.6, -2.8, -1],
    },
  ],
};

//*_*客户服务比例图
function customerServcePercentSet(rate = 50, title = "") {
  return {
    title: [
      {
        text: title,
        x: "center",
        top: "56%",
        textStyle: {
          color: "#fff",
          fontSize: 14,
          fontWeight: "100",
        },
      },
      {
        text: rate + "%",
        x: "center",
        top: "26%",
        textStyle: {
          fontSize: "40",
          color: "#fff",
          fontStyle: "italic",
          fontFamily: "Lato",
          foontWeight: "600",
        },
      },
    ],
    polar: {
      radius: ["88%", "100%"],
      center: ["50%", "50%"],
    },
    angleAxis: {
      max: 100,
      show: false,
    },
    radiusAxis: {
      type: "category",
      show: true,
      axisLabel: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    },
    series: [
      {
        name: "",
        type: "bar",
        roundCap: true,
        barWidth: 60,
        showBackground: true,
        backgroundStyle: {
          // color: 'rgba(66, 66, 66, .3)',
          color: "#3e3522",
        },
        data: [rate],
        coordinateSystem: "polar",

        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
              {
                offset: 0,
                color: "#805b13",
              },
              {
                offset: 1,
                color: "#c39c50",
              },
            ]),
          },
        },
      },
    ],
  };
}

//*_*客户满意度趋势&客户准时交付率年度趋势
function customerSatisfactionTrendSet(
  xData = ["2016", "2017", "2018", "2019", "2020"],
  yData = [80, 70, 78, 62, 90]
) {
  return {
    grid: {
      x: 50,
      y: 45,
      x2: 18,
      y2: 50,
      borderWidth: 1,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      axisLabel: {
        color: "rgba(255,255,255,1)",
      },
      axisTick: {
        lineStyle: {
          color: "#38311f",
        },
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: "#38311f",
        },
      },
      axisLine: {
        show: false,
      },
      data: xData,
    },
    yAxis: {
      type: "value",
      axisLabel: {
        color: "rgba(255,255,255,1)",
        formatter(a) {
          return a + "%";
        },
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: "#38311f",
        },
      },
      max: 100,
      axisLine: {
        show: false,
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: "#38311f",
        },
      },
    },
    series: [
      {
        data: yData,
        type: "line",
        symbol: "circle",
        symbolSize: 12,
        itemStyle: {
          color: "#e7b964",
        },
        lineStyle: {
          color: "#e7b964",
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "rgba(211,172,95,0.5)", // 0% 处的颜色
              },
              {
                offset: 1,
                color: "rgba(62,58,57,0.2)", // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        },
      },
    ],
  };
}

//*_*客户服务量年度趋势
function customerServiceVolumeTrendSet(
  xData = ["2016", "2017", "2018", "2019", "2020"],
  yData = [720, 182, 191, 234, 290, 330, 310]
) {
  return {
    grid: {
      x: 100,
      y: 40,
      x2: 18,
      y2: 30,
      borderWidth: 1,
    },
    xAxis: {
      type: "category",
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        fontSize: 14,
        color: "rgba(255,255,255,1)",
      },
      data: xData,
    },
    yAxis: {
      name: "客户服务量（人天）",
      type: "value",
      nameTextStyle: {
        fontSize: 10,
        padding: [0, 45, -20, -50],
        color: "rgba(255,255,255,0.5)",
      },
      splitLine: {
        lineStyle: {
          color: "#304858",
          type: "dashed",
        },
      },
      axisLabel: {
        fontSize: 10,
        color: "rgba(255,255,255,1)",
        showMaxLabel: false,
        margin: 10,
      },
    },
    series: [
      {
        name: "联盟广告",
        type: "bar",
        barWidth: 18,
        itemStyle: {
          color: {
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            type: "linear",
            global: false,
            colorStops: [
              {
                offset: 0,
                color: "rgba(0,145,246,1)",
              },
              {
                offset: 0.6,
                color: "rgba(0,145,246,.7)",
              },
              {
                offset: 1,
                color: "rgba(0,145,246,0.1)",
              },
            ],
          },
        },
        emphasis: {
          focus: "series",
        },
        zlevel: 2,
        data: yData,
      },
      {
        type: "pictorialBar",
        symbolPosition: "end",
        symbol: "rect",
        symbolSize: [18, 5],
        symbolOffset: [0, -5],
        zlevel: 2,
        itemStyle: {
          color: "#8cdafb",
          borderWidth: 1,
          borderColor: "#478eb7",
        },
        data: yData,
      },
      {
        name: "视频广告",
        type: "bar",
        barGap: "-100%",

        barWidth: 18,
        itemStyle: {
          borderWidth: 1,
          borderColor: "#056fbb",
          color: "rgba(5,111,187,0.1)",
        },
        emphasis: {
          focus: "series",
        },
        zlevel: 1,
        data: [880, 880, 880, 880, 880, 880, 880],
      },
    ],
  };
}

//*_*专业经验年限员工分布及占比
function zyjynxygfbzbSet(data) {
  const color = ["#0062c2", "#e7b964", "#5ba7a5", "#a3a3a3"],
    arrName = getArrayValue(data, "name");
  objData = array2obj(data, "name");
  function getArrayValue(array, key) {
    var key = key || "value";
    var res = [];
    if (array) {
      array.forEach(function (t) {
        res.push(t[key]);
      });
    }
    return res;
  }
  function array2obj(array, key) {
    var resObj = {};
    for (var i = 0; i < array.length; i++) {
      resObj[array[i][key]] = array[i];
    }
    return resObj;
  }
  return {
    color: color,
    legend: {
      show: true,
      top: "20%",
      bottom: "53%",
      left: "50%",
      data: arrName,
      width: 100,
      padding: [0, 16],
      itemGap: 15,
      icon: "none",
      formatter: function (name) {
        let index = data.findIndex((item) => item.name == name);
        return (
          "{icon" +
          index +
          "|} {title|" +
          name +
          "} {value|" +
          objData[name].value +
          "} \n {bg|}"
        );
      },

      textStyle: {
        rich: {
          title: {
            fontSize: 12,
            height: 20,
            lineHeight: 20,
            width: 50,
            padding: [0, 10, 0, 15],
            color: "#ffffff",
          },
          value: {
            fontSize: 12,
            height: 20,
            width: 40,
            lineHeight: 20,
            align: "right",
            color: "#f0c85c",
          },
          bg: {
            width: 120,
            height: 0,
            borderWidth: 1,
            borderDashOffset: 20,
            borderColor: "rgba(255, 255, 255, 0.5)",
            borderType: "dashed",
          },
          icon0: {
            width: 2,
            height: 2,
            backgroundColor: "#121212",
            borderRadius: 20,
            borderWidth: 5,
            padding: 1,
            borderColor: color[0],
          },
          icon1: {
            width: 2,
            height: 2,
            backgroundColor: "#121212",
            borderRadius: 20,
            borderWidth: 5,
            padding: 1,
            borderColor: color[1],
          },
          icon2: {
            width: 2,
            height: 2,
            backgroundColor: "#121212",
            borderRadius: 20,
            borderWidth: 5,
            padding: 1,
            borderColor: color[2],
          },
          icon3: {
            width: 2,
            height: 2,
            backgroundColor: "#121212",
            borderRadius: 20,
            borderWidth: 5,
            padding: 1,
            borderColor: color[3],
          },
        },
      },
    },
    series: [
      {
        type: "pie",
        radius: ["10%", "64%"],
        center: ["25%", "50%"],
        roseType: "area",
        label: {
          show: false,
        },
        labelLine: {
          show: false,
        },
        zlevel: 2,
        data: data,
      },
      {
        type: "pie",
        radius: ["0%", "75%"],
        center: ["25%", "50%"],
        itemStyle: {
          color: "rgba(0,139,144,0.1)",
        },
        label: {
          show: false,
        },
        labelLine: {
          show: false,
        },
        zlevel: 1,
        data: [100],
      },
      //虚线
      {
        name: "",
        type: "gauge",
        detail: false,
        splitNumber: 5, //刻度数量
        radius: "100%", //图表尺寸
        center: ["25%", "50%"],
        startAngle: 0, //开始刻度的角度
        endAngle: -360, //结束刻度的角度
        axisLine: {
          show: false,
        },
        axisTick: {
          show: true,
          lineStyle: {
            color: "rgba(0,139,144,0.2)",
            width: 4,
          },
          length: 1,
          splitNumber: 10,
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
      },
    ],
  };
}

//*_*员工岗位分布及占比
function employeePositionsSet(data) {
  arrName = getArrayValue(data, "name");
  arrValue = getArrayValue(data, "value");
  sumValue = eval(arrValue.join("+"));
  objData = array2obj(data, "name");
  optionData = getData(data);
  color = ["#0062c2", "#e7b964", "#5ba7a5", "#a3a3a3"];

  function getArrayValue(array, key) {
    var key = key || "value";
    var res = [];
    if (array) {
      array.forEach(function (t) {
        res.push(t[key]);
      });
    }
    return res;
  }

  function array2obj(array, key) {
    var resObj = {};
    for (var i = 0; i < array.length; i++) {
      resObj[array[i][key]] = array[i];
    }
    return resObj;
  }

  function getData(data) {
    var res = {
      series: [],
      yAxis: [],
    };
    for (let i = 0; i < data.length; i++) {
      res.series.push({
        name: "",
        type: "pie",
        clockWise: false, //顺时加载
        hoverAnimation: false, //鼠标移入变大
        radius: [72 - i * 10 + "%", 68 - i * 10 + "%"],
        center: ["25%", "55%"],
        label: {
          show: false,
        },
        itemStyle: {
          label: {
            show: false,
          },
          labelLine: {
            show: false,
          },
          borderWidth: 5,
        },
        data: [
          {
            value: data[i].value,
            name: data[i].name,
          },
          {
            value: sumValue - data[i].value,
            name: "",
            itemStyle: {
              color: "rgba(0,0,0,0)",
              borderWidth: 0,
            },
            tooltip: {
              show: false,
            },
            hoverAnimation: false,
          },
        ],
      });
      res.series.push({
        name: "",
        type: "pie",
        silent: true,
        z: 1,
        clockWise: false, //顺时加载
        hoverAnimation: false, //鼠标移入变大
        radius: [72 - i * 10 + "%", 68 - i * 10 + "%"],
        center: ["25%", "55%"],
        label: {
          show: false,
        },
        itemStyle: {
          label: {
            show: false,
          },
          labelLine: {
            show: false,
          },
          borderWidth: 5,
        },
        data: [
          {
            value: 7.5,
            itemStyle: {
              color: "#3e3522",
              borderWidth: 0,
            },
            tooltip: {
              show: false,
            },
            hoverAnimation: false,
          },
          {
            value: 2.5,
            name: "",
            itemStyle: {
              color: "rgba(0,0,0,0)",
              borderWidth: 0,
            },
            tooltip: {
              show: false,
            },
            hoverAnimation: false,
          },
        ],
      });
      res.yAxis.push(((data[i].value / sumValue) * 100).toFixed(2) + "%");
    }
    return res;
  }

  return {
    legend: {
      show: true,
      top: "20%",
      bottom: "53%",
      left: "50%",
      data: arrName,
      width: 100,
      padding: [0, 16],
      itemGap: 15,
      icon: "none",
      formatter: function (name) {
        let index = data.findIndex((item) => item.name == name);
        return (
          "{icon" +
          index +
          "|} {title|" +
          name +
          "} {value|" +
          objData[name].value +
          "} \n {bg|}"
        );
      },

      textStyle: {
        rich: {
          title: {
            fontSize: 12,
            height: 20,
            lineHeight: 20,
            width: 50,
            padding: [0, 10, 0, 15],
            color: "#ffffff",
          },
          value: {
            fontSize: 12,
            height: 20,
            width: 40,
            lineHeight: 20,
            align: "right",
            color: "#f0c85c",
          },
          bg: {
            width: 120,
            height: 0,
            borderWidth: 1,
            borderDashOffset: 20,
            borderColor: "rgba(255, 255, 255, 0.5)",
            borderType: "dashed",
          },
          icon0: {
            width: 2,
            height: 2,
            backgroundColor: "#121212",
            borderRadius: 20,
            borderWidth: 5,
            padding: 1,
            borderColor: color[0],
          },
          icon1: {
            width: 2,
            height: 2,
            backgroundColor: "#121212",
            borderRadius: 20,
            borderWidth: 5,
            padding: 1,
            borderColor: color[1],
          },
          icon2: {
            width: 2,
            height: 2,
            backgroundColor: "#121212",
            borderRadius: 20,
            borderWidth: 5,
            padding: 1,
            borderColor: color[2],
          },
          icon3: {
            width: 2,
            height: 2,
            backgroundColor: "#121212",
            borderRadius: 20,
            borderWidth: 5,
            padding: 1,
            borderColor: color[3],
          },
        },
      },
    },
    color: color,
    xAxis: [
      {
        show: false,
      },
    ],
    series: optionData.series,
  };
}

//*_*员工文化程度统计
function StatisticsOfEmployeeEducationLevelSet(
  xData = ["大专以下", "大专", "本科", "硕士", "博士"],
  yData = [0, 0, 0, 0, 0]
) {
  let Data = getData(yData);
  function getData(yData) {
    let count = yData.reduce((a, b) => {
      return Number(a) + Number(b);
    }, 0);
    return yData.map((item) => {
      let c = (item / count).toFixed(2);
      return c > 0.04 ? c : "0.04";
    });
  }
  return {
    grid: [
      {
        x: 0,
        y: 20,
        x2: 10,
        y2: 20,
        borderWidth: 1,
      },
      {
        x: 5,
        y: 20,
        x2: 150,
        y2: 20,
        borderWidth: 1,
      },
    ],
    xAxis: [
      {
        type: "value",
        max: 1,
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
      },
      {
        type: "value",
        gridIndex: 1,
        max: 1,
        axisLabel: {
          show: false,
        },
        splitLine: {
          // gird 区域中的分割线
          show: false, // 是否显示
        },
      },
    ],
    yAxis: [
      {
        type: "category",
        axisLabel: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        inverse: true,
        data: xData,
      },
      {
        type: "category",
        gridIndex: 1,
        axisLabel: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        inverse: true,
        data: xData,
      },
    ],
    series: [
      {
        xAxisIndex: 0,
        yAxisIndex: 0,
        animationDuration: 0,
        type: "bar",
        showBackground: true,
        backgroundStyle: {
          color: "rgba(62,53,34,0.4)",
          borderRadius: [0, 0, 20, 0],
        },
        zlevel: 0,
        itemStyle: {
          color: "rgba(0,0,0,0)",
        },
        label: {
          show: true,
          position: "insideRight",
          padding: [0, 10, 0, 0],
          fontSize: 12,
          formatter(value) {
            return `${value.name}：${value.value}名`;
          },
        },
        data: yData,
      },
      {
        type: "pictorialBar",
        xAxisIndex: 1,
        yAxisIndex: 1,
        symbol: "rect",
        symbolRepeat: "fixed",
        symbolMargin: [2, 0],
        symbolClip: true,
        symbolSize: [4, 10],
        symbolPosition: "start",
        symbolOffset: [5, 0],
        symbolBoundingData: 1,
        data: Data,
        itemStyle: {
          color: "#d5c075",
        },
        z: 10,
      },
      {
        type: "pictorialBar",
        xAxisIndex: 1,
        yAxisIndex: 1,
        itemStyle: {
          normal: {
            color: "#342d20",
          },
        },
        label: {
          normal: {
            show: false,
          },
        },
        animationDuration: 0,
        symbolRepeat: "fixed",
        symbolMargin: [2, 0],
        symbol: "rect",
        symbolSize: [4, 10],
        symbolBoundingData: 1,
        symbolPosition: "start",
        symbolOffset: [5, 0],
        data: Data,
        z: 5,
      },
    ],
  };
}

//*_*专业人才统计
function zyrctjSet(
  yData = ["技术", "销售", "运营", "其他"],
  xData = [14, 70, 269, 25]
) {
  let Data = getData();
  function getData() {
    let count = xData.reduce((a, b) => {
      return Number(a) + Number(b);
    }, 0);
    return xData.map((item) => {
      let c = (item / count).toFixed(2);
      return c > 0.04 ? c : "0.04";
    });
  }
  return {
    grid: {
      x: 50,
      y: 30,
      x2: 100,
      y2: 5,
      borderWidth: 1,
    },
    xAxis: {
      max: 1,
      splitLine: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: [
      {
        type: "category",
        inverse: true,
        data: yData,
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: true,
          fontSize: 14,
          color: "#fff",
        },
      },
    ],
    series: [
      {
        // 内
        type: "bar",
        barWidth: 18,
        legendHoverLink: false,
        silent: true,
        label: {
          show: false,
        },
        itemStyle: {
          color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
            { offset: 0, color: "rgba(0,144,245,1)" },
            { offset: 1, color: "rgba(0,144,245,0.5)" },
          ]),
        },
        data: Data,
        z: 1,
        animationEasing: "elasticOut",
      },
      {
        // 分隔
        type: "pictorialBar",
        itemStyle: {
          normal: {
            color: "#121212",
          },
        },
        symbolRepeat: "fixed",
        symbolMargin: 3,
        symbol: "rect",
        symbolClip: true,
        symbolSize: [3, 21],
        symbolPosition: "start",
        symbolOffset: [1, -1],
        symbolBoundingData: 1,
        data: Data,
        z: 2,
        animationEasing: "elasticOut",
      },
      {
        //外框
        type: "bar",
        barGap: "-120%", // 设置外框粗细
        data: xData,
        barWidth: 25,
        itemStyle: {
          normal: {
            color: "transparent", // 填充色
            barBorderColor: "#023d9e", // 边框色
            barBorderWidth: 1, // 边框宽度
            label: {
              // 标签显示位置
              show: true,
              align: "right",
              fontSize: 20,
              color: "#0079d6",
              padding: [0, -80, 0, 0],
              position: "right",
            },
            shadowColor: "#156dff",
            shadowBlur: 8,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
          },
        },
        z: 0,
      },
    ],
  };
}

//*_*成品百米缺陷率 & 原材料批次合格率趋势
function inspectorSet(
  name,
  year,
  xData = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
  yData = [],
  planData = []
) {
  return {
    grid: {
      x: 50,
      y: 50,
      x2: 0,
      y2: 80,
      borderWidth: 1,
    },
    legend: {
      left: "right",
      top: 20,
      textStyle: {
        color: "#fff",
      },
      data: ["实际量", "计划量"],
      icon: "rect",
      itemWidth: 20,
      itemHeight: 2,
    },
    xAxis: {
      type: "category",
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisLabel: {
        margin: 15,
        color: "#fff",
      },
      data: xData,
    },
    yAxis: {
      name: `${name} / ${year}年`,
      nameTextStyle: {
        fontSize: 10,
        color: "rgba(255,255,255,0.5)",
        padding: [0, 0, 0, 20],
      },
      splitLine: {
        lineStyle: {
          color: "rgba(98,162,205,0.4)",
          type: "dashed",
        },
      },
      axisLabel: {
        margin: 10,
        color: "#fff",
        formatter(val) {
          return val + "%";
        },
      },
      type: "value",
    },
    series: [
      {
        name: "实际量",
        // data: [0.7, 1.15, 1.08, 1.1, 1.13, 1.02, 1.5],
        data: yData,
        type: "line",
        showSymbol: false,
        itemStyle: {
          color: "#fab754",
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(250, 183, 84, 0.3)" },
            { offset: 1, color: "rgba(250, 183, 84, 0.01)" },
          ]),
        },
        zlevel: 1,
        smooth: true,
      },
      {
        name: "计划量",
        // data: [0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6],
        data: planData,
        type: "line",
        showSymbol: false,
        itemStyle: {
          color: "#3386bb",
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(51, 134, 187, 0.3)" },
            { offset: 1, color: "rgba(51, 134, 187, 0.01)" },
          ]),
        },
        zlevel: 0,
        smooth: false,
      },
    ],
  };
}

//*_*电能耗月度趋势 & 硫化OEE月度趋势 & 密炼OEE月度趋势 & 水能耗月度趋势 & 气能耗月度趋势
function operateSet_1(
  name,
  year,
  xData = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
  yData = [],
  planData = []
) {
  return {
    grid: {
      x: 50,
      y: 50,
      x2: 0,
      y2: 26,
      borderWidth: 1,
    },
    legend: {
      left: "right",
      top: 20,
      textStyle: {
        color: "#fff",
      },
      data: ["实际量", "计划量"],
      icon: "rect",
      itemWidth: 20,
      itemHeight: 2,
    },
    xAxis: {
      type: "category",
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisLabel: {
        margin: 15,
        color: "#fff",
      },
      data: xData,
    },
    yAxis: {
      name: `${name} / ${year}年`,
      nameTextStyle: {
        fontSize: 10,
        color: "rgba(255,255,255,0.5)",
        padding: [0, 0, 0, 20],
      },
      splitLine: {
        lineStyle: {
          color: "rgba(98,162,205,0.4)",
          type: "dashed",
        },
      },
      axisLabel: {
        margin: 10,
        color: "#fff",
        formatter(val) {
          return val + "%";
        },
      },
      type: "value",
    },
    series: [
      {
        name: "实际量",
        data: yData,
        type: "bar",
        barWidth: 30,
        showSymbol: false,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#9f7a2f" },
            { offset: 1, color: "rgba(37, 31, 18, 0.8)" },
          ]),
          borderWidth: 1,
          borderColor: "#a88148",
        },
        zlevel: 1,
      },
      {
        name: "计划量",
        data: planData,
        type: "line",
        showSymbol: false,
        itemStyle: {
          color: "#3386bb",
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(51, 134, 187, 0.3)" },
            { offset: 1, color: "rgba(51, 134, 187, 0.01)" },
          ]),
        },
        zlevel: 0,
        smooth: false,
      },
    ],
  };
}

//*_*硫化产量阅读趋势（面积）
function operateSet_2(
  xData = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
  yData1 = [],
  ydata2 = []
) {
  return {
    grid: {
      x: 50,
      y: 50,
      x2: 0,
      y2: 26,
      borderWidth: 1,
    },
    legend: {
      left: "right",
      top: 20,
      textStyle: {
        color: "#fff",
      },
      data: ["2020年", "2021年"],
      icon: "rect",
      itemWidth: 20,
      itemHeight: 2,
    },
    xAxis: {
      type: "category",
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisLabel: {
        margin: 15,
        color: "#fff",
      },
      data: xData,
    },
    yAxis: {
      name: "面积（m²） / 月份",
      nameTextStyle: {
        fontSize: 10,
        color: "rgba(255,255,255,0.5)",
        padding: [0, 0, 0, 20],
      },
      splitLine: {
        lineStyle: {
          color: "rgba(98,162,205,0.4)",
          type: "dashed",
        },
      },
      axisLabel: {
        margin: 10,
        color: "#fff",
        formatter(val) {
          return val + "%";
        },
      },
      type: "value",
    },
    series: [
      {
        name: "2020年",
        data: yData1,
        type: "bar",
        barWidth: 16,
        showSymbol: false,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#9f7a2f" },
            { offset: 1, color: "rgba(37, 31, 18, 0.8)" },
          ]),
          borderWidth: 1,
          borderColor: "#a88148",
        },
      },
      {
        name: "2021年",
        data: ydata2,
        type: "bar",
        barWidth: 16,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#0171cf" },
            { offset: 1, color: "rgba(34, 68, 172, 0.8)" },
          ]),
          borderWidth: 1,
          borderColor: "#0091f6",
        },
      },
    ],
  };
}
