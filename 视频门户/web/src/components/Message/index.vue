<template>
  <transition name="el-fade-in-linear" @after-leave="handleAfterLeave">
    <div
      v-show="visible"
      :class="[
        'bt-message',
        type && !iconClass ? `bt-message--${type}` : '',
        showClose ? 'is-closable' : '',
        customClass,
      ]"
      :style="positionStyle"
      role="alert"
      @mouseenter="clearTimer"
      @mouseleave="startTimer"
    >
      <i v-if="iconClass" :class="iconClass"></i>
      <i v-else :class="typeClass"></i>
      <slot>
        <p v-if="!dangerouslyUseHTMLString" class="bt-message__content">
          {{ message }}
        </p>
        <p v-else class="bt-message__content" v-html="message"></p>
      </slot>
      <i
        v-if="showClose"
        class="bt-message__closeBtn el-icon-close"
        @click="close"
      ></i>
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
  .bt-message {
    min-width: 500px;
    box-sizing: border-box;
    border-radius: 4px;
    border: 1px solid #ebeef5;
    position: fixed;
    right: 15px;
    top: 20px;
    background-color: #edf2fc;
    transition: opacity 0.3s, transform 0.4s, top 0.4s;
    overflow: hidden;
    padding: 0 20px;
    display: flex;
    align-items: center;
    .el-icon-circle-check {
      color: #64eca3;
    }
    .el-icon-warning-outline {
      color: #facd89;
    }
    .el-icon-circle-close {
      color: #f3acac;
    }
    .bt-message__closeBtn {
      position: absolute;
      top: 50%;
      right: 15px;
      transform: translateY(-50%);
      cursor: pointer;
      color: #c0c4cc;
      font-size: 16px;
    }
  }
  .bt-message__icon {
    margin-right: 20px;
  }
  .bt-message--success {
    background-color: #eafbf5;
    border: 1px solid #64eca3;
    .el-message__content {
      color: #64eca3;
    }
  }
  .bt-message--warning {
    background-color: #fdf9f0;
    border: 1px solid #facd89;
    .el-message__content {
      color: #facd89;
    }
  }
  .bt-message--error {
    background-color: #fff1f1;
    border: 1px solid #f3acac;
    .el-message__content {
      color: #f3acac;
    }
  }
</style>
