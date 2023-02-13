<template>
  <div class="bt-divider" :class="position">
    <div
      class="bt-divider-title"
      :class="position"
      :style="{ backgroundColor }"
    >
      {{ title }}
    </div>
    <div
      class="bt-divider-line"
      :style="`border-bottom-style:${borderStyle};border-bottom-color:${borderColor}`"
    ></div>
  </div>
</template>
<script>
  export default {
    name: 'BtDivider',
    props: {
      title: {
        type: String,
        default: null,
      },
      position: {
        //文字的位置,左:left 中:middle 右:right
        type: String,
        default: 'left',
      },
      backgroundColor: {
        type: String,
        default: '#fff',
      },
      borderStyle: {
        type: String,
        default: 'dashed',
      },
      borderColor: {
        type: String,
        default: '#bbbbbb',
      },
    },
  }
</script>
<style lang="scss" scoped>
  .bt-divider {
    width: 100%;
    padding: 0px 0;
    position: relative;
    display: flex;
    justify-content: flex-start;
    &.left {
      justify-content: flex-start;
    }
    &.middle {
      justify-content: center;
    }
    &.right {
      justify-content: flex-end;
    }
  }

  .bt-divider-title {
    position: relative;
    z-index: 2;
    font-size: 14px;
    color: #006fae;
    background-color: #fff;
    padding: 1px 0;

    &.left {
      padding-right: 18px;
    }
    &.middle {
      padding-left: 18px;
      padding-right: 18px;
    }
    &.right {
      padding-left: 18px;
    }
  }
  .bt-divider-line {
    position: absolute;
    bottom: 3px;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 1px;
    border-bottom: 1px dashed #bbbbbb;
  }
</style>
