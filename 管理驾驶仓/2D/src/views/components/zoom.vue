<template>
  <div class="zoom">
    <!-- <div>
      <el-button
        type="text"
        icon="el-icon-zoom-in"
        @click="zoom('in')"
      ></el-button>
    </div>
    <div>
      <el-button
        type="text"
        icon="el-icon-zoom-out"
        @click="zoom('out')"
      ></el-button>
    </div> -->

    <div v-if="$store.state.curObjLevel == 4">
      <el-button
        type="text"
        :icon="
          $store.state.autoPlay ? 'el-icon-video-pause' : 'el-icon-video-play'
        "
        @click="toggle"
      ></el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Zoom",
  data() {
    return {
      objLevel: ["world", "province", "citys", "factorys"],
    };
  },
  mounted() {},

  methods: {
    zoom(type) {
      const obj = this.$root.$children[0].$children[0].$refs[
        this.objLevel[this.$store.state.curObjLevel]
      ];
      if (type == "in" && this.$store.state.zoomlevel <= 2) {
        this.$store.state.zoomlevel += 0.2;
      } else if (this.$store.state.zoomlevel > 0.4) {
        this.$store.state.zoomlevel -= 0.2;
      }
    },
    toggle() {
      this.$store.state.autoPlay = !this.$store.state.autoPlay;
    },
  },
};
</script>

<style lang="scss" scoped>
.zoom {
  // border: 1px solid rgb(248, 170, 0);
  // border-radius: 4px;
  background: rgba($color: #003aa7, $alpha: 1);
  position: relative;
  // &::after {
  //   content: "";
  //   position: absolute;
  //   width: 100%;
  //   height: 1px;
  //   top: 48%;
  //   background: #999;
  // }
  > div {
    border-bottom: 1px solid rgba($color: #727272, $alpha: 1);
    &:last-child {
      border: none;
    }
  }
  .el-button {
    padding: 3px;
  }
  .el-button--text {
    color: rgb(255, 255, 255);
    font-size: 20px;
    font-weight: bold;
  }
}
</style>
