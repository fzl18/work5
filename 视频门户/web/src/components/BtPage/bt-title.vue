<template>
  <div class="bt-title__container">
    <div class="title-head">
      <div :class="['title', titleClass]">{{ title }}</div>
      <div class="title-head_right"><slot></slot></div>
    </div>
    <div v-if="showLine" class="line"></div>
  </div>
</template>
<script>
  let sizeTypes = {
    large: 'large',
    small: 'small',
    mini: 'mini',
  }
  export default {
    name: 'BtTitle',
    props: {
      title: {
        type: String,
        default: '',
      },

      showLine: {
        type: Boolean,
        default: true,
      },

      size: {
        type: String,
        default: 'small',
      },
    },
    computed: {
      titleClass() {
        let { size } = this
        return size && sizeTypes[size] ? sizeTypes[size] : ''
      },
    },
  }
</script>
<style lang="scss" scoped>
  .bt-title__container {
    .title-head {
      display: -webkit-flex;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      .large {
        font-size: 18px;
        line-height: 26px;
      }
      .small {
        font-size: 14px;
        line-height: 22px;
      }
      .mini {
        font-size: 12px;
        line-height: 20px;
      }
    }

    .line {
      width: 100%;
      height: 1px;
      background-color: #e5e5e5;
      position: relative;
      margin-bottom: 20px;
      &::before {
        content: '';
        width: 33px;
        height: 2px;
        background-color: #307fc7;
        position: absolute;
        left: 0;
        bottom: 0;
      }
    }
    .title-head_right {
      display: flex;
      display: -webkit-flex;
      & > * {
        margin: 0 8px;
      }
    }
  }
</style>
<style lang="scss">
  .title-head_right {
    .el-input-group__append,
    .el-input-group__prepend {
      background-color: $base-color-blue;
      padding: 0 12px;
      color: #fff;
      font-size: 14px;
    }
  }
</style>
