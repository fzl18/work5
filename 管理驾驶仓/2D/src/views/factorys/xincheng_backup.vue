<template>
  <div class="container">
    <img
      src="@/assets/img/skin/blackgold/factorys/xinchen.png"
      draggable="false"
      alt=""
    />
    <svg class="lines" style="filter:blur(3px)">
      <path
        v-for="(item, index) in linesList"
        :key="index"
        :d="
          `M${item.lineLeft0} ${item.lineTop0} L${item.lineLeft1} ${item.lineTop1}`
        "
        stroke-linecap="round"
        stroke="#34acee"
        stroke-width="5"
        :class="['line', item.lineStatus]"
      />
    </svg>
    <svg class="lines">
      <defs>
        <pattern
          id="img1"
          patternUnits="userSpaceOnUse"
          width="100"
          height="100"
        >
          <image
            xlink:href="@/assets/img/skin/blackgold/pipe.png"
            x="0"
            y="0"
            width="6"
            height="9"
          />
        </pattern>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="lightblue" stop-opacity="1"></stop>
          <stop offset="50%" stop-color="orange" stop-opacity="1"></stop>
          <stop offset="100%" stop-color="lightblue" stop-opacity="1"></stop>
        </linearGradient>
        <radialGradient id="grad2" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stop-color="#09fa12" stop-opacity="1" />
          <stop offset="50%" stop-color="#09fa12" stop-opacity="0.8" />
          <stop offset="100%" stop-color="#09fa12" stop-opacity="0" />
        </radialGradient>
        <filter id="fxx" x="0" y="0" width="200%" height="200%">
          <feOffset result="offOut" in="SourceGraphic" dx="0" dy="0" />
          <feGaussianBlur result="blurOut" in="offOut" stdDeviation="5" />
          <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
        </filter>
      </defs>
      <path
        v-for="(item, ind) in linesList"
        :key="ind"
        :d="
          `M${item.lineLeft0} ${item.lineTop0} L${item.lineLeft1} ${item.lineTop1}`
        "
        stroke-linecap="round"
        stroke="url()"
        stroke-width="5"
        :class="['line', item.lineStatus, index == ind ? 'hover' : '']"
        @mouseover="
          (e) => {
            handleMouseOver(e, ind);
          }
        "
        @mouseout="
          tipShow = false;
          autoPlay();
        "
        @click="
          $root.$children[0].$children[0].$refs.factorys.openLine(item.lineId)
        "
      />
    </svg>
    <div
      class="eff"
      v-show="tipShow && linesList[index].lineStatus == null"
      :style="path"
    ></div>
    <div class="lines over">
      <div
        class="tipBox"
        v-show="tipShow"
        :style="{ left: tipLeft, top: tipTop }"
      >
        <div class="name">
          <!-- <img src="@/assets/img/ico-line.png" alt="" /> -->
          {{ linesList[index].lineName }}
        </div>
        <div class="status">
          <em>{{ linesList[index].lineLength }}</em
          >米
          <span>{{
            linesList[index].lineStatus == "ERROR"
              ? "异常"
              : linesList[index].lineStatus == "WARN"
              ? "警告"
              : "运行正常"
          }}</span>
        </div>
        <div
          class="decorator"
          :style="
            `display:${linesList[index].lineStatus == null ? 'block' : 'none'}`
          "
        >
          <svg>
            <path
              d="M10 10,L10 10 160 10"
              stroke-linecap="round"
              stroke="#1bdfff"
              stroke-width="1.5"
              class="line"
            ></path>
          </svg>
          <div class="eff2"></div>
        </div>
        <div class="runTime">
          累计运行时间 <em>{{ Math.floor(linesList[index].lineTime / 60) }}</em
          >h <em>{{ linesList[index].lineTime % 60 }}</em
          >m
        </div>
        <div class="runDistance">
          累计运行距离 <em>{{ linesList[index].lineMileage }}</em
          >km
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { coordinate } from "../api/monitorLine";
export default {
  data() {
    return {
      name: "xincheng",
      tipShow: false,
      tipLeft: "",
      tipTop: "",
      index: 0,
      linesList: [],
      coordinate,
      timer: null,
    };
  },
  computed: {
    path() {
      const line = this.linesList[this.index];
      return `offset-path: path('M${line.lineLeft0} ${line.lineTop0} L${line.lineLeft1} ${line.lineTop1}')`;
    },
  },
  mounted() {
    coordinate().then((res) => {
      if (res.success) {
        // res.data.map((item, index) => {
        //   item.lineTop0 = index * 100;
        //   item.lineTop1 = index * 200;
        //   item.lineLeft0 = index * 300;
        //   item.lineLeft1 = index * 100;
        // });
        this.linesList = res.data;
        this.$store.state.autoPlay = true;
      }
    });
  },
  methods: {
    tip(e, index) {
      this.tipShow = true;
      this.index = index;
      this.tipTop = e.offsetY - 160 + "px";
      this.tipLeft = e.offsetX - 0 + "px";
    },
    handleMouseOver(e, ind) {
      clearInterval(this.timer);
      this.tip(e, ind);
    },

    autoPlay() {
      if (this.$store.state.autoPlay) {
        this.timer = setInterval(() => {
          this.index++;
          if (this.index < this.linesList.length) {
            this.tipTop = this.linesList[this.index].lineTop1 - 160 + "px";
            this.tipLeft = this.linesList[this.index].lineLeft1 + "px";
          } else {
            this.index = 0;
            this.tipTop = this.linesList[this.index].lineTop1 - 160 + "px";
            this.tipLeft = this.linesList[this.index].lineLeft1 + "px";
          }
          this.tipShow = true;
        }, 5000);
      }
    },
  },
  watch: {
    "$store.state.curObjLevel"(val) {
      if (val == 3) {
        this.$store.state.autoPlay = true;
        this.autoPlay();
      } else {
        clearInterval(this.timer);
        this.$store.state.autoPlay = false;
      }
    },
    "$store.state.autoPlay"(val) {
      if (val && this.$store.state.curObjLevel == 3) {
        this.autoPlay();
      } else {
        this.tipShow = false;
        clearInterval(this.timer);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  left: 0;
  top: 0;
  svg {
    path {
      stroke-linecap: round;
    }
  }
  .eff {
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 1.3rem;
    height: 0.28rem;
    background: url("../../assets/img/eff.png") no-repeat;
    background-size: 100% 100%;
    filter: brightness(2);
    animation: move 5s linear infinite;
  }
  .lines {
    overflow: hidden;
    width: 18rem;
    height: 12rem;
    position: absolute;
    left: 0;
    top: 0;
    &.over {
      pointer-events: none;
      overflow: inherit;
      z-index: 9999;
    }
    .line {
      cursor: pointer;
      &.ERROR {
        stroke: red;
        &.hover {
          stroke: red !important;
        }
      }
      &.WARN {
        stroke: rgb(253, 215, 0);
        &.hover {
          stroke: rgb(253, 215, 0) !important;
        }
      }
      &.hover {
        stroke: #09fa12;
        // stroke: url(#grad1);
        // stroke-dasharray: 1000;
        // stroke-dashoffset: 1000;
        // -webkit-animation: dash 5s linear infinite;
        // animation: dash 5s linear infinite;
      }
    }
  }
  .tipBox {
    pointer-events: none;
    width: 3.6rem /* 246/80 */;
    height: 2.6rem /* 199/80 */;
    background: url("../../assets/img/skin/blackgold/box_bg.png") no-repeat;
    background-size: 100% 100%;
    position: absolute;
    left: 536px;
    top: 255px;
    padding: 0.3rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    em {
      font-style: normal;
      font-weight: bold;
      font-size: 18px;
      margin: 0 0.06rem;
    }
    .name {
      font-size: 15px;
      font-weight: bold;
      display: flex;
      align-items: center;
      img {
        margin-right: 0.1rem;
      }
    }
    .decorator {
      height: 0.2rem;
      width: 100%;
      position: relative;
      svg {
        filter: blur(0.8px) brightness(2.5);
      }
      .eff2 {
        pointer-events: none;
        position: absolute;
        top: 0;
        left: 0;
        width: 0.8rem;
        height: 0.15rem;
        background: url("../../assets/img/eff.png") no-repeat;
        background-size: 130% 100%;
        filter: brightness(1.5) hue-rotate(96deg) blur(2px);
        animation: move2 1s linear infinite;
        offset-path: path("M10 10,L10 10 180 10");
      }
    }
    .status {
      text-align: center;
      em {
        font-size: 16px;
      }
      span {
        font-size: 15px;
        font-weight: bold;
        margin-left: 0.2rem;
      }
    }
    .runTime {
    }
  }
}
@keyframes dash {
  to {
    stroke-dashoffset: 0;
  }
}
@keyframes move {
  0% {
    offset-distance: 5%;
  }
  100% {
    offset-distance: 95%;
  }
}
@keyframes move2 {
  0% {
    offset-distance: 5%;
  }
  100% {
    offset-distance: 78%;
  }
}
</style>
