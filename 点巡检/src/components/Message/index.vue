<template>
  <transition name="el-message-fade" @after-leave="handleAfterLeave">
    <div
      v-show="visible"
      :class="[
        'el-message',
        type && !iconClass ? `el-message--${type}` : '',
        showClose ? 'is-closable' : '',
        customClass,
      ]"
      :style="positionStyle"
      role="alert"
      @mouseenter="clearTimer"
      @mouseleave="startTimer"
    >
      <i v-if="iconClass" :class="iconClass" />
      <i v-else :class="typeClass" />
      <slot>
        <p v-if="!dangerouslyUseHTMLString" class="el-message__content">
          {{ message }}
        </p>
        <p v-else class="el-message__content" v-html="message" />
      </slot>
      <i
        v-if="showClose"
        class="el-message__closeBtn el-icon-close"
        @click="close"
      />
    </div>
  </transition>
</template>

<script>
  const typeMap = {
    success: 'success',
    warning: 'warning',
    error: 'error',
  }
  export default {
    name: 'App',
    data() {
      return {
        visible: false,
        message: '',
        duration: 3000,
        type: 'success',
        iconClass: '',
        customClass: '',
        onClose: null,
        showClose: true,
        closed: false,
        verticalOffset: 55,
        width: '100%',
        timer: null,
        dangerouslyUseHTMLString: false,
      }
    },
    computed: {
      typeClass() {
        let typeClass = ''
        if (this.type && !this.iconClass) {
          switch (this.type) {
            case 'success':
              typeClass = 'bt-message__icon el-icon-circle-check'
              break
            case 'warning':
              typeClass = 'bt-message__icon el-icon-warning-outline'
              break
            case 'error':
              typeClass = 'bt-message__icon el-icon-circle-close'
              break
          }
        }
        return typeClass
      },
      positionStyle() {
        return {
          top: `${this.verticalOffset}px`,
          width: `${this.width}px`,
        }
      },
    },

    watch: {
      closed(newVal) {
        if (newVal) {
          this.visible = false
        }
      },
    },
    mounted() {
      this.startTimer()
      document.addEventListener('keydown', this.keydown)
    },
    beforeDestroy() {
      document.removeEventListener('keydown', this.keydown)
    },

    methods: {
      handleAfterLeave() {
        this.$destroy(true)
        this.$el.parentNode.removeChild(this.$el)
      },

      close() {
        this.closed = true
        if (typeof this.onClose === 'function') {
          this.onClose(this)
        }
      },

      clearTimer() {
        clearTimeout(this.timer)
      },

      startTimer() {
        if (this.duration > 0) {
          this.timer = setTimeout(() => {
            if (!this.closed) {
              this.close()
            }
          }, this.duration)
        }
      },
      keydown(e) {
        if (e.keyCode === 27) {
          // esc关闭消息
          if (!this.closed) {
            this.close()
          }
        }
      },
    },
  }
</script>
<style lang="scss" scoped>
  .el-message {
    .el-message__content {
      color: #989898;
      margin-left: 20px;
      font-size: 12px;
    }
  }
  .el-message--success {
    background-color: #eafbf5;
    border-color: #64eca3;
    .bt-message__icon {
      color: #64eca3;
    }
  }
  .el-message--warning {
    background-color: #fdf9f0;
    border-color: #facd89;
    .bt-message__icon {
      color: #facd89;
    }
  }
  .el-message--error {
    background-color: #fff1f1;
    border-color: #f3acac;
    .bt-message__icon {
      color: #f3acac;
    }
  }
</style>
