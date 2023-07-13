<template>
  <div :class="classes"></div>
</template>

<script>
  export default {
    name: 'Resizer',
    props: {
      split: {
        validator(value) {
          return ['vertical', 'horizontal'].indexOf(value) >= 0
        },
        required: true,
      },
      className: { type: String, default: '' },
    },
    computed: {
      classes() {
        const classes = ['splitter-pane-resizer', this.split, this.className]
        return classes.join(' ')
      },
    },
  }
</script>

<style scoped>
  .splitter-pane-resizer {
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    background: #000;
    position: absolute;
    opacity: 0.1;
    z-index: 1;
    -moz-background-clip: padding;
    -webkit-background-clip: padding;
    background-clip: padding-box;
  }

  .splitter-pane-resizer.horizontal {
    height: 10px;
    margin: -5px 0;
    border-top: 5px solid rgba(255, 255, 255, 0);
    border-bottom: 5px solid rgba(255, 255, 255, 0);
    cursor: row-resize;
    width: 100%;
  }

  .splitter-pane-resizer.vertical {
    width: 10px;
    height: calc(100% - 45px);
    margin-left: -5px;
    border-left: 5px solid rgba(255, 255, 255, 0);
    border-right: 5px solid rgba(255, 255, 255, 0);
    cursor: col-resize;
    top: 45px;
  }
</style>
