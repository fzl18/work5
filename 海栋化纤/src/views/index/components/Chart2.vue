<template>
  <el-card class="chart2" shadow="hover">
    <div slot="header">
      <span>
        <remix-icon icon-class="line-chart-line"></remix-icon>
        统计数
      </span>
      <el-tag class="card-header-tag" type="warning">周</el-tag>
    </div>
    <core-chart
      :autoresize="true"
      :options="options"
      theme="core-echarts-theme"
    />
    <div class="bottom">
      <span>
        统计数:
        <core-count
          :decimals="countConfig.decimals"
          :duration="countConfig.duration"
          :end-val="countConfig.endVal"
          :prefix="countConfig.prefix"
          :separator="countConfig.separator"
          :start-val="countConfig.startVal"
          :suffix="countConfig.suffix"
        />
      </span>
    </div>
  </el-card>
</template>
<script>
  import _ from 'lodash'
  import CoreChart from '@/extra/coreCharts'
  import CoreCount from '@/extra/coreCount'

  export default {
    components: {
      CoreChart,
      CoreCount,
    },
    data() {
      return {
        timer: 0,
        countConfig: {
          startVal: 0,
          endVal: _.random(1000, 20000),
          decimals: 0,
          prefix: '',
          suffix: '',
          separator: ',',
          duration: 8000,
        },
        //授权数
        options: {
          grid: {
            top: '4%',
            left: '2%',
            right: '4%',
            bottom: '0%',
            containLabel: true,
          },
          xAxis: [
            {
              type: 'category',
              /*boundaryGap: false,*/
              data: ['0时', '4时', '8时', '12时', '16时', '20时', '24时'],
              axisTick: {
                alignWithLabel: true,
              },
            },
          ],
          yAxis: [
            {
              type: 'value',
            },
          ],
          series: [
            {
              name: '授权数',
              type: 'bar',
              barWidth: '60%',
              data: [10, 52, 20, 33, 39, 33, 22],
            },
          ],
        },
      }
    },
  }
</script>
