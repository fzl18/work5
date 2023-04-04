<template>
  <div class="flow-component">
    <img
      v-if="configData.image"
      class="flow-component-img"
      :src="configData.image"
      alt=""
    />
  </div>
</template>
<script>
  export default {
    name: 'FlowComponent',
    inject: ['getGraph', 'getNode'],
    data() {
      return {
        configData: {},
      }
    },
    mounted() {
      const node = this.getNode()
      // console.log('created', node)
      const { data } = node.toJSON()
      this.configData = data
      console.log('created', this.configData)
    },
  }
</script>
<style lang="scss" scoped>
  .flow-component {
    width: 64px;
    height: 64px;
    background-color: #fff;
    position: relative;
    // border: 2px solid #ececec;
    // &:hover,
    // &:active {
    //   border: 2px solid #448ee8;
    // }
    // border-radius: 4px;
    &-img {
      position: absolute;
      width: 34px;
      height: 34px;
      top: 50%;
      left: 50%;
      margin-top: -17px;
      margin-left: -17px;
      object-fit: contain;
    }
  }
</style>
