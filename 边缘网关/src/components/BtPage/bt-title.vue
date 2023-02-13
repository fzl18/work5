<template>
  <div class="bt-title__container">
    <div class="title-head">
      <div
        v-if="Object.prototype.toString.call(title) === '[object String]'"
        :class="['title', titleClass]"
      >
        {{ title }}
      </div>
      <template
        v-if="Object.prototype.toString.call(title) === '[object Array]'"
      >
        <div class="title-list">
          <div
            v-for="(t, index) in title"
            ref="title"
            :key="t"
            :class="['title', titleClass, { actived: current === index }]"
            @click="$emit('change', index)"
          >
            {{ t }}
          </div>
        </div>
      </template>

      <div class="title-head_right"><slot></slot></div>
    </div>
    <div v-if="showLine" class="line">
      <span
        class="line-block"
        :style="`transform: translateX(${currentOffsetLeft}px)`"
      ></span>
    </div>
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
    model: {
      prop: 'current',
      event: 'change',
    },
    props: {
      title: {
        type: [String, Array],
        default: () => null,
      },

      showLine: {
        type: Boolean,
        default: true,
      },

      size: {
        type: String,
        default: 'small',
      },
      current: {
        type: Number,
        default: 0,
      },
      fixed: {
        type: Number,
        default: 30,
      },
    },
    data() {
      return {
        currentOffsetLeft: 0,
      }
    },
    computed: {
      titleClass() {
        let { size } = this
        return size && sizeTypes[size] ? sizeTypes[size] : ''
      },
    },
    watch: {
      current: function () {
        this.currentOffsetLeft =
          this.$refs['title'][this.current].offsetLeft - this.fixed
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
    .title-list {
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .title {
        cursor: pointer;
      }

      .title + .title {
        margin-left: 20px;
      }
    }

    .line {
      width: 100%;
      height: 1px;
      background-color: #e5e5e5;
      position: relative;
      margin-bottom: 20px;
      .line-block {
        display: block;
        width: 33px;
        height: 2px;
        background-color: #307fc7;
        position: absolute;
        left: 0;
        bottom: 0;
        transition: transform 0.5s ease-in-out;
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
