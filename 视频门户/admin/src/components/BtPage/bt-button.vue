<template>
  <div class="bt-button__container">
    <div :class="[superSmallClass]">
      <el-button
        :size="buttonSize"
        :type="type"
        :plain="plain"
        :round="round"
        :circle="circle"
        :loading="loading"
        :disabled="disabled"
        :icon="icon"
        :autofocus="autofocus"
        :native-type="nativeType"
        @click="_click"
      >
        <slot></slot>
      </el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'BtButton',

    props: {
      size: {
        type: String,
        default: 'mini',
      },
      type: {
        type: String,
        default: '',
      },
      plain: {
        type: Boolean,
        default: false,
      },
      round: {
        type: Boolean,
        default: false,
      },
      circle: {
        type: Boolean,
        default: false,
      },
      loading: {
        type: Boolean,
        default: false,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      icon: {
        type: String,
        default: '',
      },
      autofocus: {
        type: Boolean,
        default: false,
      },
      nativeType: {
        type: String,
        default: 'button',
      },
      //custom
      supersmall: {
        type: Boolean,
        default: false,
      },
    },

    data() {
      return {}
    },
    computed: {
      buttonSize() {
        return this.supersmall ? 'mini' : this.size
      },
      superSmallClass() {
        return this.supersmall ? 'supersmall' : ''
      },
    },
    methods: {
      _click() {
        this.$emit('click')
      },
    },
  }
</script>
<style lang="scss">
  .bt-button__container {
    display: inline-block;
    & + & {
      margin-left: 10px;
    }
    .supersmall {
      .el-button--mini {
        padding: 2px;
      }
    }
  }
</style>
