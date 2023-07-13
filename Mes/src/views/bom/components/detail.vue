<template>
  <el-dialog
    :title="$translateTitle('物料清单详情')"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :before-close="close"
    width="80%"
    :fullscreen="false"
    class="vxe-table--ignore-clear"
    @open="handleOpen"
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
  import {} from '../api'
  export default {
    name: 'Detail',
    props: {
      data: {
        type: Object,
        default: () => {},
      },
    },
    data() {
      return {
        visible: false,
      }
    },
    methods: {
      handleOpen() {},
      close() {
        this.visible = false
      },
    },
  }
</script>

<style lang="scss" scoped></style>
