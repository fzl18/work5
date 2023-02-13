<template>
  <div :class="['bt-box__container', `bt-box-${center}}`]" :title="title">
    <div class="main">
      <slot />
    </div>
  </div>
</template>
<script>
  export default {
    name: 'BtBox',
    props: {
      title: {
        type: String,
        default: '',
      },
      center: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {}
    },
    computed: {
      titleClass() {
        return ''
      },
    },
  }
</script>
<style lang="scss" scoped>
  .bt-box__container {
    position: relative;
    border: 1px solid #e5e5e5;
    border-radius: 4px;
    margin-top: 36px;
    .main {
      padding: 30px 10px;
    }
    &::before {
      content: attr(title);
      position: absolute;
      left: 12px;
      transform: translateY(-50%);
      -webkit-transform: translateY(-50%);
      padding: 0 10px;
      background-color: #fff;
    }
  }
</style>
