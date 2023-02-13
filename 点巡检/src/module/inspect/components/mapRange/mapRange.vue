<template>
  <div class="range-map">
    <div class="map-box">
      <el-amap-search-box
        class="search-box"
        :search-option="searchOption"
        :on-search-result="onSearchResult"
      />
      <el-amap
        ref="myMap"
        :events="events"
        :zoom-enable="true"
        :zoom="zoom"
        :center="center"
        class="amap-box"
        :vid="'amap-vue'"
      >
        <el-amap-marker vid="marker" :position="center" />
        <el-amap-circle
          :center="center"
          :radius="tempRadius"
          stroke-color="#aeaeae"
          fill-color="#aeaeae"
          fill-opacity="0.3"
        />
      </el-amap>
    </div>
    <div class="text-box">
      <p>{{ translateTitle('第一步:地图点击活动范围中心位置') }}</p>
      <p>{{ translateTitle('第二步:设置活动范围半径') }}</p>
      <el-input
        v-model="point"
        style="display: none"
        disabled
        :placeholder="translateTitle('请获取经纬度')"
      />
      <div class="sel">
        <span>{{ translateTitle('长度半径M') }}:</span>
        <el-input-number
          v-model="tempRadius"
          :placeholder="translateTitle('请选择半径')"
          :step="500"
          :min="0"
          step-strictly
        />
      </div>
      <el-button class="conBtn" @click="confirmFn">
        {{ translateTitle('确定') }}
      </el-button>
      <el-button class="resetBtn" @click="clearCircle">
        {{ translateTitle('移除范围') }}
      </el-button>
      <el-button class="cancelBtn" @click="cancelFn">
        {{ translateTitle('取消') }}
      </el-button>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import VueAMap from 'vue-amap'
  Vue.use(VueAMap)
  VueAMap.initAMapApiLoader({
    key: '819cfe78c219b08dbeaa9b74fa9bc170',
    plugin: [
      'AMap.Autocomplete',
      'AMap.PlaceSearch',
      'AMap.Scale',
      'AMap.OverView',
      'AMap.ToolBar',
      'AMap.MapType',
      'AMap.PolyEditor',
      'AMap.CircleEditor',
    ],
    // 默认高德 sdk 版本为 1.4.4
    v: '1.4.4',
  })
  let amapManager = new VueAMap.AMapManager()
  import { translateTitle } from '../../i18n'
  export default {
    props: {
      limitCoordinate: {
        type: String,
        default: '',
      },
      limitRadius: {
        type: Number,
        default: 0,
      },
    },

    data() {
      let that = this
      return {
        searchOption: {
          city: '', //搜索范围
          citylimit: false, //限制搜索范围
          //city: "", citylimit: false, // 不限制搜索范围搜索，比如想全国搜索
        },
        lng: 0,
        lat: 0,
        zoom: 12,
        center: [116.408414, 39.903963],
        tempRadius: '',
        events: {
          click(e) {
            let { lng, lat } = e.lnglat
            that.center = [lng, lat]
          },
        },
      }
    },
    computed: {
      point() {
        return this.center.join(',')
      },
    },
    created() {
      if (this.limitCoordinate) {
        this.center = this.limitCoordinate.split(',')
      }
      if (this.limitRadius) {
        this.tempRadius = this.limitRadius
      }
    },
    mounted() {
      let par = document.getElementsByClassName('search-box-wrapper')[0]
      par.firstChild.setAttribute('placeholder', '您可以在这里输入要搜索的地址')
    },
    methods: {
      onSearchResult(pois) {
        if (pois.length > 0) {
          let { lng, lat, name, location } = pois[0]
          this.center = [lng, lat]
        }
      },
      translateTitle,
      clearCircle() {
        this.tempRadius = ''
      },
      confirmFn() {
        this.$emit('mapData', {
          limitCoordinate: this.point,
          limitRadius: this.tempRadius,
        })
        this.resetData()
      },
      cancelFn() {
        this.resetData()
        this.$emit('mapCancel')
      },
      resetData() {
        this.center = this.$options.data().center
        this.tempRadius = this.$options.data().tempRadius
        this.zoom = this.$options.data().zoom
      },
    },
  }
</script>

<style lang="scss" scoped>
  .range-map {
    height: 90vh;
    position: relative;
    .search-box {
      position: absolute;
      top: 10px;
      left: 20px;
    }
    .map-box {
      height: 100%;
    }
    .text-box {
      padding: 10px;
      background: #f9f9f9;
      position: absolute;
      top: 0;
      right: 0;
      .sel {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
      }
      .resetBtn {
        background: #30c782;
        border-color: #30c782;
        color: #fff;
      }
      .conBtn {
        background: #307ec7;
        border-color: #307ec7;
        color: #fff;
      }
      .cancelBtn {
        background: #bcbcbc;
        border-color: #bcbcbc;
        color: #fff;
      }
    }
  }
</style>
