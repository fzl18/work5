<template>
  <div>
    <svg viewBox="0 0 1229 1000">
      <filter id="displacementFilter">
        <feTurbulence
          type="turbulence"
          :baseFrequency="baseFrequency"
          numOctaves="1"
          result="turbulence"
          seed="53"
        />
        <feDisplacementMap
          in2="turbulence"
          in="SourceGraphic"
          scale="50"
          xChannelSelector="R"
          yChannelSelector="B"
        />
      </filter>
      <image
        id="blueMoon"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        xlink:href="@/assets/img/skin/blackgold/sea.png"
        filter="url(#displacementFilter)"
      ></image>
    </svg>
  </div>
</template>

<script>
var frames = 0;
var rad = Math.PI / 180;
var bfx = 0.007;
var bfy = 0.0021;
export default {
  data() {
    return {
      baseFrequency: "0.01 .1",
    };
  },
  mounted() {
    this.AnimateBaseFrequency();
  },
  methods: {
    AnimateBaseFrequency() {
      frames += 0.0015;
      bfx += 0.00001 * Math.cos(frames * rad);
      bfy += 0.00005 * Math.sin(frames * rad);
      this.baseFrequency = `${bfx} ${bfy}`;
      window.requestAnimationFrame(this.AnimateBaseFrequency);
    },
  },
};
</script>

<style lang="scss" scoped>
svg {
  width: 1300px;
}
</style>
