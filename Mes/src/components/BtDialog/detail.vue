<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :before-close="close"
    :width="width"
    :fullscreen="fullscreen"
    class="vxe-table--ignore-clear"
    @open="open"
  >
    <slot />
    <!-- <span slot="footer" class="dialog-footer">
      <bt-button type="primary" @click="submitForm">
        {{ $translateTitle($cws.w008) }}
      </bt-button>
      <bt-button @click="close">
        {{ $translateTitle($cws.w009) }}
      </bt-button>
    </span> -->
  </el-dialog>
</template>

<script>
  export default {
    name: 'BtDialog',
    props: {
      data: {
        type: Object,
        default: () => {},
      },
      title: {
        type: String,
        default: '',
      },
      width: {
        type: String,
        default: '500px',
      },
      fullscreen: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        visible: false,
      }
    },
    methods: {
      open() {
        this.visible = true
      },
      close() {
        this.visible = false
        this.$emit('close')
      },
    },
  }
</script>

<style lang="scss" scoped></style>
