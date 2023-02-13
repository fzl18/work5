<template>
  <div>
    <iframe class="container-frame" :src="src" frameborder="0" />
  </div>
</template>

<script>
  import { proxyURL } from '@/config/'
  proxyURL
  export default {
    name: 'ContainerFrame',
    props: {
      src: {
        type: String,
        required: false,
        default: `${proxyURL}/api/doc.html`,
      },
    },
  }
</script>

<style lang="scss" scoped>
  .container-frame {
    position: absolute;
    top: 0px;
    left: 0px;
    height: 100%;
    width: 100%;
  }
  .app-main-container .app-main-height {
    min-height: calc(100vh - 60px - 55px - 0px - 56px);
  }
</style>
