<template>
  <div :class="['bt-collapse', borderClass]">
    <div class="bt-collapse-head">
      <span class="header-icon" @click="collapse = !collapse">
        <i
          class="el-icon-arrow-up arrow"
          :style="{ transform: rotateStyle }"
        ></i>
      </span>
      <span class="header-title">
        <slot name="title"></slot>
      </span>
      <span class="header-operate" @click="handleDelete()">
        <i class="el-icon-delete"></i>
      </span>
    </div>
    <collapseTransition>
      <div v-if="collapse">
        <div class="bt-collapse-main">
          <slot></slot>
        </div>
      </div>
    </collapseTransition>
  </div>
</template>

<script>
  import CollapseTransition from './collapse'
  export default {
    name: 'BtCollapse',
    components: {
      CollapseTransition,
    },
    filters: {},
    props: {
      isCollapse: {
        type: Boolean,
        default: true,
      },
      border: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        collapse: this.isCollapse,
      }
    },
    computed: {
      borderClass() {
        return this.border ? 'border' : ''
      },
      rotateStyle() {
        return this.collapse ? '' : 'rotate(180deg)'
      },
    },
    watch: {},
    created() {},
    mounted() {},
    methods: {
      handleDelete() {
        this.$emit('minus')
      },
    },
  }
</script>

<style scoped lang="scss">
  .bt-collapse {
    color: #fff;
    margin: 10px 0;
  }
  .border {
    border: 1px solid #e5e4e5;
  }
  .bt-collapse-head {
    border-radius: 3px;
    color: #fff;
    font-size: 12px;
    caret-color: transparent;
    background-color: #aeb7bf;
    line-height: 32px;
    // margin-left: -1px;
    padding: 0 10px;
    .header-icon {
      cursor: pointer;
      .arrow {
        transition: all 0.2s;
      }
    }
    .header-title {
      padding: 0 10px;
      user-select: none;
      display: inline-block;
    }
    .header-operate {
      float: right;
      cursor: pointer;
    }
  }
  .bt-collapse-main {
    padding: 10px 20px;
    color: #000;
  }
</style>
