<template>
  <div>
    <Transition :isShow="earthIsShow">
      <div class="bg earthbg">
        <div class="stars-wrapper">
          <svg
            class="extras"
            width="100%"
            height="100%"
            preserveAspectRatio="none"
          >
            <defs>
              <radialGradient id="comet-gradient" cx="0" cy=".5" r="0.5">
                <stop offset="0%" stop-color="rgba(255,255,255,.8)"></stop>
                <stop offset="100%" stop-color="rgba(255,255,255,0)"></stop>
              </radialGradient>
            </defs>
            <!-- <g transform="rotate(-135)">
              <ellipse
                class="comet comet-a"
                fill="url(#comet-gradient)"
                cx="0"
                cy="0"
                rx="150"
                ry="2"
              ></ellipse>
            </g> -->
            <g transform="rotate(20)">
              <ellipse
                class="comet comet-b"
                fill="url(#comet-gradient)"
                cx="100%"
                cy="0"
                rx="150"
                ry="2"
              ></ellipse>
            </g>
            <g transform="rotate(300)">
              <ellipse
                class="comet comet-c"
                fill="url(#comet-gradient)"
                cx="40%"
                cy="100%"
                rx="150"
                ry="2"
              ></ellipse>
            </g>
          </svg>
        </div>
      </div>
    </Transition>
    <Transition :isShow="cityIsShow">
      <div class="bg citybg"></div>
    </Transition>
    <Transition :isShow="factoryIsShow">
      <div class="bg factorybg"></div>
    </Transition>
  </div>
</template>

<script>
import Transition from "./transition.vue";
export default {
  components: {
    Transition,
  },
  data() {
    return {};
  },
  computed: {
    cityIsShow() {
      return (
        this.$store.state.curObjLevel == 1 || this.$store.state.curObjLevel == 2
      );
    },
    factoryIsShow() {
      return this.$store.state.curObjLevel == 3;
    },
    earthIsShow() {
      return this.$store.state.curObjLevel == 0;
    },
  },
};
</script>

<style lang="scss" scoped>
.bg {
  position: fixed;
  z-index: 59;
  left: 0;
  top: 0;
  height: 1080px;
  width: 100%;
  &.earthbg {
    background: url("../../assets/img/BG.png") no-repeat;
    background-size: 100% 100%;
    background-position: center bottom;
  }
  &.citybg {
    background: url("../../assets/img/citybg.png");
    background-size: 100% 100%;
  }
  &.factorybg {
    background: url("../../assets/img/factoryBg.png");
    background-size: 100% 100%;
  }

  .stars-wrapper {
    position: relative;
    pointer-events: none;
    width: 100%;
    height: 1080px;
    opacity: 0.6;
    background: -webkit-gradient(
      linear,
      left top,
      left bottom,
      from(#000000),
      color-stop(#383a1f),
      to(#4a442f)
    );
    background: linear-gradient(#000000, #383127, #3b3b2f);
    overflow: hidden;
  }

  .comet {
    -webkit-transform-origin: center center;
    transform-origin: center center;
    -webkit-animation: comet 10s linear infinite;
    animation: comet 10s linear infinite;
  }

  .comet-b {
    -webkit-animation-delay: -3.3s;
    animation-delay: -3.3s;
  }

  .comet-c {
    -webkit-animation-delay: -5s;
    animation-delay: -5s;
  }
}
@-webkit-keyframes comet {
  0%,
  40% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  60%,
  100% {
    -webkit-transform: translateX(-100vmax);
    transform: translateX(-100vmax);
    opacity: 0;
  }
}
@keyframes comet {
  0%,
  40% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  60%,
  100% {
    -webkit-transform: translateX(-100vmax);
    transform: translateX(-100vmax);
    opacity: 0;
  }
}
@-webkit-keyframes twinkle {
  25% {
    opacity: 0;
  }
}
@keyframes twinkle {
  25% {
    opacity: 0;
  }
}
</style>
