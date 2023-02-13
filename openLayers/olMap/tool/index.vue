<template>
  <div class="tool">
    <div class="bar">
      <div v-if="false" class="item">
        <el-radio-group v-model="tile" border size="mini" @change="changeTile">
          <el-radio-button
            v-for="(item, index) in baseTile"
            :key="index"
            :label="item.value"
          >
            {{ item.name }}
          </el-radio-button>
        </el-radio-group>
      </div>
      <div class="item search">
        <el-autocomplete
          v-model="keyWord"
          prefix-icon="el-icon-search"
          size="mini"
          value-key="name"
          :fetch-suggestions="search"
          placeholder="请输入搜索区域"
          clearable
          trigger-on-focus
          @select="handleSelect"
        ></el-autocomplete>
        <!-- <el-button size="mini" type="ghost" @click="search">搜索</el-button> -->
      </div>
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
            <i class="el-icon-full-screen"></i>
          </el-tooltip>
        </el-tag>
        <el-tag
          v-show="pageType == 'area'"
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
            <i class="el-icon-link"></i>
          </el-tooltip>
        </el-tag>
        <el-tag
          v-show="pageType == 'area'"
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
            <i class="el-icon-map-location"></i>
          </el-tooltip>
        </el-tag>
      </div>
      <div class="item">
        <el-button type="success" size="mini" @click="saveHandler">
          保存
        </el-button>
      </div>
    </div>
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
    mounted() {},
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
          zoom: 13,
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
    },
  }
</script>

<style lang="scss" scoped>
  .el-tag {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin: 0 !important;
    cursor: pointer;
    height: 28px !important;
    border-radius: 0;
  }
  .tool {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 999;
    .bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 115%;
      i {
        font-size: 16px;
      }
    }
  }
</style>
