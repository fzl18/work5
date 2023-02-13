<template>
  <div class="tool">
    <div v-show="!mobile" class="bar">
      <!-- <div class="item">
        <el-radio-group v-model="tile" border size="mini" @change="changeTile">
          <el-radio-button
            v-for="(item, index) in baseTile"
            :key="index"
            :label="item.value"
          >
            {{ item.name }}
          </el-radio-button>
        </el-radio-group>
      </div> -->
      <div class="item search">
        <el-autocomplete
          v-show="pageType == 'area'"
          v-model="keyWord"
          prefix-icon="el-icon-search"
          size="mini"
          value-key="name"
          :fetch-suggestions="search"
          placeholder="请输入搜索区域"
          clearable
          trigger-on-focus
          class="input"
          @select="handleSelect"
        />
        <div v-show="visible" class="item">
          <el-tag
            v-show="pageType == 'area'"
            :type="drawType == 'Polygon' ? '' : 'info'"
            :effect="drawType == 'Polygon' ? 'dark' : null"
            @click="changeDrawType('Polygon')"
          >
            <el-tooltip
              class="item"
              effect="dark"
              content="标注厂区"
              placement="bottom"
            >
              <!-- <i class="el-icon-full-screen" /> -->
              <img src="@/assets/img/area.png" alt="">
            </el-tooltip>
          </el-tag>
          <el-tag
            v-show="pageType == 'line'"
            :type="drawType == 'LineString' ? '' : 'info'"
            :effect="drawType == 'LineString' ? 'dark' : null"
            @click="changeDrawType('LineString')"
          >
            <el-tooltip
              class="item"
              effect="dark"
              content="标注输送机"
              placement="bottom"
            >
              <!-- <i class="el-icon-link" /> -->
              <img src="@/assets/img/line.png" alt="">
            </el-tooltip>
          </el-tag>
          <el-tag
            v-show="pageType == 'point'"
            :type="drawType == 'Point' ? '' : 'info'"
            :effect="drawType == 'Point' ? 'dark' : null"
            @click="changeDrawType('Point')"
          >
            <el-tooltip
              class="item"
              effect="dark"
              content="标注巡检点"
              placement="bottom"
            >
              <!-- <i class="el-icon-map-location" /> -->
              <img src="@/assets/img/point.png" alt="">
            </el-tooltip>
          </el-tag>
        </div>
      </div>

      <div class="item">
        <el-button type="primary" size="mini" @click="saveHandler">
          保存
        </el-button>
      </div>
    </div>
    <!-- <div v-if="mobile" class="sideButtom">
      <el-tag
        :type="drawType == 'Polygon' ? '' : 'info'"
        :effect="drawType == 'Polygon' ? 'dark' : null"
        @click="location"
      >
        <i class="el-icon-place" />
      </el-tag>
    </div> -->
  </div>
</template>

<script>
import config from '../config'

export default {
  name: 'VTool',
  inject: ['VMap'],
  props: {
    drawType: {
      type: String,
      default: null,
    },
    pageType: {
      type: String,
      default: null,
    },
    visible: {
      type: Boolean,
      default: true,
    },
    mobile: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      tile: 'TD_IMG',
      keyWord: null,
      edit: false,
      searchList: [],
      baseTile: [
        {
          name: '平面',
          value: 'TD',
        },
        {
          name: '卫星',
          value: 'TD_IMG',
        },
      ],
    }
  },
  computed: {
    map() {
      return this.VMap
    },
  },
  mounted() {
    console.log(this.mobile)
  },
  beforeDestroy() {},
  methods: {
    changeTile() {
      this.$emit('changeTile', this.tile)
    },
    panTo(position) {
      this.map.panTo({
        zoom: 13,
        center: position,
      })
    },
    flyTo(position) {
      this.map.flyTo({
        zoom: 17,
        flyZoom: 10,
        center: position,
      })
    },
    editHandler() {
      this.edit = !this.edit
      this.changeDrawType()
    },
    saveHandler() {
      this.$emit('saveHandler', this.map)
    },
    search(queryString, cb) {
      if (queryString) {
        fetch(
          `${config.TD_MAP_SEARCH_URL}?postStr={"keyWord":"${this.keyWord}","level":15,"mapBound":"116.02524,39.83833,116.65592,39.99185","queryType":1,"start":0,"count":5}&type=query&tk=${config.TD_MAP_KEY}`
        )
          .then((res) => {
            return res.json()
          })
          .then((res) => {
            // console.log(res)
            if (res.resultType == 1) {
              this.searchList = []
              res.pois.map((item) => {
                this.searchList.push(item)
              })
            } else if (res.resultType == 3 && res.area) {
              this.searchList = []
              this.searchList.push({
                name: res.keyWord,
                lonlat: res.area.lonlat,
              })
            }
            cb(this.searchList)
          })
      } else {
        cb(this.searchList)
      }
    },
    handleSelect(val) {
      if (val && val.lonlat) {
        let pos = val.lonlat.split(',')
        this.flyTo(pos)
      }
    },
    changeDrawType(val) {
      this.$emit('changeDrawType', val)
    },
    location() {
      this.$emit('location')
    },
  },
}
</script>

<style>
.search .el-input__inner {
  border-radius: 8px !important;
  height: 36px;
  line-height: 36px;
}
</style>
<style lang="scss" scoped>
.el-tag {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  // margin: 5 !important;
  padding: 10px !important;
  cursor: pointer;
  height: 46px !important;
  border-radius: 8px;
  transform: scale(0.75);
  position: relative;
  top: 4px;
}

.tool {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  padding: 0 50px;
  pointer-events: none;
  .bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    .item {
      margin: 20px 5px;
      pointer-events: all;
      button {
        height: 34px;
        border-radius: 8px;
        padding: 2px 16px;
      }
    }
    .search {
      margin: 0 10px 0 13px;
      display: flex;
      align-items: center;
      height: 46px;
      line-height: 46px;
    }
    i {
      font-size: 16px;
    }
  }
  .sideButtom {
    position: absolute;
    top: 5px;
    right: 5px;
    i {
      font-size: 16px;
    }
  }
}
</style>
