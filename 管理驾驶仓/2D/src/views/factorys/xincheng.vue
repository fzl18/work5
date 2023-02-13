<template>
  <div class="container">
    <div class="picbig">
      <img
        src="@/assets/img/skin/blackgold/factorys/xinchen_big.png"
        draggable="false"
        alt=""
      />
    </div>

    <img
      src="@/assets/img/skin/blackgold/factorys/xinchen.png"
      draggable="false"
      alt=""
    />
    <div class="lineBox">
      <div
        v-for="(item, ind) in linesList"
        :key="ind"
        :class="['line', item.lineStatus, index == ind ? 'hover' : '']"
        :style="
          `left:${item.lineLeft0}px;top:${item.lineTop0}px;transform: rotate(${item.rotate}deg);width:${item.width}px;`
        "
        @mouseover="handleMouseOver(ind)"
        @mouseout="
          tipShow = false;
          autoPlay();
        "
        @click="
          $root.$children[0].$children[0].$refs.factorys.openLine(
            item.lineId,
            ind,
            linesList
          )
        "
      >
        <div class="border"></div>
        <div
          class="name"
          :style="`transform: rotate(${item.rotate >= 100 ? 180 : 0}deg)`"
        >
          {{ item.lineName }}
        </div>
      </div>

      <div
        class="tipBox"
        v-if="tipShow"
        :style="{ left: tipLeft, top: tipTop }"
      >
        <div class="name">
          <img src="@/assets/img/skin/blackgold/fan.png" alt="" class="fan" />
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
          <!-- <svg>
            <path
              d="M10 10,L10 10 160 10"
              stroke-linecap="round"
              stroke="#1bdfff"
              stroke-width="1.5"
              class="line"
            ></path>
          </svg> -->
          <!-- <div class="eff2"></div> -->
        </div>
        <div class="runTime">
          运行时间 <em>{{ Math.floor(linesList[index].lineTime / 60) }}</em
          >h
          <!-- <em>{{ Math.floor(linesList[index].lineTime % 60) }}</em>m -->
        </div>
        <div class="runDistance">
          运行距离 <em>{{ Math.floor(linesList[index].lineMileage) }}</em
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
  computed: {},
  mounted() {
    // this.autoPlay();
    coordinate().then((res) => {
      if (res.success) {
        res.data.map((item, index) => {
          let val = this.getAngleByPoint(
            { x: item.lineLeft0, y: item.lineTop0 },
            { x: item.lineLeft1, y: item.lineTop1 }
          );
          item.width = Math.floor(val.width);
          item.rotate = val.angle;
          // console.log(item.rotate, item.lineName, "\n ");
          this.linesList = res.data.filter(
            (val) =>
              val.lineLeft0 && val.lineLeft1 && val.lineTop0 && val.lineTop1
          );
          if (this.linesList && this.linesList.length) {
            this.$store.state.autoPlay = true;
          }
        });
        // console.log(this.linesList);
      }
    });
  },
  destroyed() {
    clearInterval(this.timer);
  },
  methods: {
    tip(index) {
      this.tipShow = true;
      this.index = index;
      let curLine = this.linesList[index];
      let { x, y } = this.getAngleByPoint(
        { x: curLine.lineLeft0, y: curLine.lineTop0 },
        { x: curLine.lineLeft1, y: curLine.lineTop1 }
      );
      this.tipLeft = curLine.lineLeft1 - x / 2 + "px";
      if (curLine.lineTop1 - y / 2 > 160) {
        this.tipTop = curLine.lineTop1 - y / 2 - 160 + "px";
      } else {
        this.tipTop = 0 + "px";
      }
    },
    handleMouseOver(ind) {
      clearInterval(this.timer);
      this.tip(ind);
    },
    getAngleByPoint(fir, sec) {
      let x = sec.x - fir.x,
        y = sec.y - fir.y,
        width = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
      if (x == 0 && y == 0) {
        return 0;
      }
      let angle = (Math.atan2(y, x) * 180) / Math.PI;
      return {
        angle,
        width,
        x,
        y,
      };
    },
    autoPlay() {
      if (this.$store.state.autoPlay) {
        this.timer = setInterval(() => {
          this.index++;
          if (this.index < this.linesList.length) {
            this.tip(this.index);
          } else {
            this.index = 0;
            this.tip(this.index);
          }
          this.tipShow = true;
        }, 5000);
      }
    },
  },
  watch: {
    // "$store.state.curObjLevel"(val) {
    //   if (val == 4) {
    //     this.$store.state.autoPlay = true;
    //     this.autoPlay();
    //   } else {
    //     clearInterval(this.timer);
    //     this.$store.state.autoPlay = false;
    //   }
    // },
    "$store.state.autoPlay"(val) {
      if (val && this.$store.state.curObjLevel == 4) {
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
  > img {
    position: absolute;
    top: 0;
    left: 0;
  }
  .picbig {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 99;
    animation: intro 4s ease-in-out forwards;
    pointer-events: none;
  }
  .lineBox {
    position: absolute;
    top: 0;
    left: 0;
    // width: 100%;
    // height: 100%;
    .line {
      position: absolute;
      transform-origin: 0 0;
      text-align: center;
      height: 11px;
      border: 1px solid #159bff;
      background: rgba(0, 152, 253, 0.3);
      // overflow: hidden;
      &::before,
      &::after {
        content: "";
        background: url("../../assets/img/skin/blackgold/line_icon.png")
          no-repeat;
        background-size: 100% 100%;
        position: absolute;
        width: 17px;
        height: 15px;
        top: -3px;
      }
      &::before {
        left: -15px;
      }
      &::after {
        right: -15px;
      }
      .border {
        &::before {
          // border-top-color: #fff;
          animation: move3 18s linear infinite;
        }
      }
      &.hover {
        cursor: pointer;
        .name {
          background: #fff;
          color: #000;
        }
        .border {
          &::before {
            border-top-color: #fff;
            // animation: move3 18s linear infinite;
          }
        }
        background: rgba(0, 152, 253, 1);
        filter: drop-shadow(0 0 8px rgba(0, 152, 253, 1)) contrast(2);
      }
      .border {
        // border-top: 2px dashed #159bff;
        position: relative;
        width: 100%;
        height: 5px;
        // top: 4px;
        // left: 0;
        overflow: hidden;
        &::before {
          content: "";
          width: 200%;
          height: 1px;
          position: absolute;
          border-top: 2px dashed #159bff;
          top: 4px;
          left: 0;
          transform: translateX(-50%);
        }
      }
      .name {
        display: inline-block;
        margin: 0px auto;
        background: #1694ff;
        padding: 2px 5px;
        position: relative;
        top: -10px;
      }
      &.WARN {
        filter: hue-rotate(190deg) !important;
        animation-play-state: paused;
        &.hover {
          filter: drop-shadow(0 0 8px rgba(0, 152, 253, 1)) hue-rotate(190deg)
            contrast(1) !important;
        }
      }
      &.ERROR {
        animation-play-state: paused;
        filter: hue-rotate(160deg) !important;
        &.hover {
          filter: drop-shadow(0 0 8px rgba(0, 152, 253, 1)) hue-rotate(160deg)
            contrast(2) !important;
        }
      }
    }
  }
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
      margin-left: 10px;
      img {
        margin-right: 0.1rem;
        animation: rotate 2s linear infinite;
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
      text-align: left;
      padding-left: 10px;
      em {
        font-size: 16px;
      }
      span {
        font-size: 15px;
        font-weight: bold;
        margin-left: 0.2rem;
      }
    }
    .runTime,
    .runDistance {
      padding-left: 10px;
      white-space: nowrap;
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
@keyframes move3 {
  to {
    transform: translateX(0%);
  }
}
@keyframes rotate {
  to {
    transform: rotate(360deg);
  }
}
@keyframes intro {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  20% {
    transform: scale(1);
    opacity: 1;
  }
  40% {
    transform: scale(1.6);
    top: 0;
    left: 0;
    opacity: 1;
  }
  90% {
    transform: scale(2);
    top: -80px;
    left: -50px;
    opacity: 1;
  }
  100% {
    transform: scale(5);
    opacity: 0;
  }
}
</style>
