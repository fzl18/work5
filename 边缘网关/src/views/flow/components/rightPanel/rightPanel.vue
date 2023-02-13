<template>
  <transition
    name="el-drawer-fade"
    @after-enter="afterEnter"
    @after-leave="afterLeave"
  >
    <div
      v-show="visible"
      v-loading="loading"
      class="right-panel-container"
      @click.self="handleClose"
    >
      <div class="right-panel" :class="visible && 'open'">
        <div class="right-panel-header">
          {{ title }}
          <el-button type="text" @click="$emit('change', false)">
            <i class="el-icon-close"></i>
          </el-button>
        </div>
        <div class="right-panel-body">
          <slot></slot>
        </div>

        <div class="right-panel-footer">
          <el-button
            v-if="!readonly"
            size="mini"
            type="primary"
            @click="submit"
          >
            确定
          </el-button>
          <el-button v-if="!readonly" size="mini" type="info" @click="cancel">
            取消
          </el-button>
          <el-button v-if="readonly" size="mini" type="info" @click="cancel">
            返回
          </el-button>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
  export default {
    name: 'RightPanel',
    model: {
      prop: 'visible',
      event: 'change',
    },
    props: {
      loading: {
        type: Boolean,
        default: false,
      },
      readonly: {
        type: Boolean,
        default: false,
      },
      visible: {
        type: Boolean,
        default: false,
      },
      title: {
        type: String,
        default: '',
      },
    },
    methods: {
      async handleClose() {
        if (this.readonly) {
          this.$emit('change', false)
        } else {
          const confirm = await this.$confirm(
            `你所做的更改将不会保存,确认关闭吗,?`,
            {
              title: '警告',
              type: 'warning',
              center: true,
            }
          )
          confirm && this.$emit('change', false)
        }
      },
      submit() {
        this.$emit('submit')
      },
      cancel() {
        this.$emit('cancel')
        this.$emit('change', false)
      },
      afterEnter() {
        this.$emit('open')
      },
      afterLeave() {
        this.$emit('close')
      },
    },
  }
</script>
<style lang="scss" scoped>
  .right-panel-container {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
    background-color: transparent;
  }

  .right-panel-header {
    padding: 5px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    color: #101010;
    border-bottom: 1px solid #dbdbdb;

    .el-icon-close {
      font-size: 24px;
      color: #101010;
    }
  }

  .right-panel {
    width: 340px;
    height: 100%;
    background-color: #f7f7f7;
    position: absolute;
    right: 0px;
    top: 0;
    bottom: 0;

    animation: rtl-drawer-out 0.3s;
    &.open {
      animation: rtl-drawer-in 0.3s 1ms;
    }
  }
  .right-panel-body {
    height: calc(100% - 55px - 55px);
  }
  .right-panel-footer {
    padding: 0 20px;
    height: 55px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  @keyframes rtl-drawer-in {
    0% {
      transform: translate(100%, 0);
    }

    100% {
      transform: translate(0, 0);
    }
  }

  @keyframes rtl-drawer-out {
    0% {
      transform: translate(0, 0);
    }

    100% {
      transform: translate(100%, 0);
    }
  }
</style>
