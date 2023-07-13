<template>
  <div class="bg">
    <img :src="require('@/static/indexLo.png')" alt="" class="pic" />
  </div>
</template>
<style scoped>
  .bg {
    background: url('~@/static/indexBg.png') no-repeat;
    background-size: 100% 100%;
  }
  .pic {
    position: absolute;
    top: 20%;
    left: 30%;
    height: 186px;
    width: 677px;
  }
</style>
