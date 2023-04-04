<template>
  <div class="app-container">
    <div class="login-panel">
      <div class="logo">
        <img src="@/assets/images/login/logo.png" alt="" srcset="" />
        <div class="logo-title">欢迎使用边缘网关</div>
      </div>
      <div class="login-form-wrap">
        <div class="login-input-wrap">
          <input
            v-model.trim="loginForm.username"
            type="text"
            class="login-form-input"
            placeholder="请输入账号"
            @keypress.enter="login"
          />
          <span class="focus-line"></span>
        </div>
        <div class="login-input-wrap">
          <input
            v-model.trim="loginForm.password"
            type="password"
            class="login-form-input"
            placeholder="请输入密码"
            @keypress.enter="login"
          />
          <span class="focus-line"></span>
        </div>

        <div class="login-button" @click="login">登录</div>
      </div>

      <!-- <el-form ref="loginForm" :model="loginForm" label-position="left">
        <el-form-item v-if="loginForm.errorMessage !== ''">
          <div class="error-message">
            <span class="error-icon">
              <i class="ri-error-warning-line"></i>
            </span>
            <span class="error-message-content">
              {{ loginForm.errorMessage }}
            </span>
          </div>
        </el-form-item>
        <el-form-item label="账号">

          <el-input v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="login">
            登录
          </el-button>
        </el-form-item>
      </el-form> -->
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        loginForm: {
          username: '',
          password: '',
          errorMessage: '',
        },
      }
    },
    methods: {
      login() {
        let flag = false
        if (this.loginForm.username === '') {
          this.$message.error('请输入账号')
          return false
        }
        if (this.loginForm.password === '') {
          this.$message.error('请输入密码')
          return false
        }

        this.$store.dispatch('coreUser/login', this.loginForm).then((data) => {
          console.log('登录成功', data)
          if (this.$route.query && this.$route.query.refUrl) {
            window.location.replace(
              decodeURIComponent(this.$route.query.refUrl)
            )
          } else {
            this.$router.replace('/')
          }
        })
        // .catch((error) => {
        //   console.log(error)
        //   // this.$message.error(error.msg)
        // })
      },
    },
  }
</script>
<style lang="scss" scoped>
  .app-container {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url(~@/assets/images/login/bg.png);
    background-repeat: no-repeat;
    background-size: 19.8rem 10.24rem;
    background-position: center center;
    background-color: #edf0f1;
  }
  .login-panel {
    width: 4.82rem;
    height: 4.13rem;
    padding: 0.34rem;
    border-radius: 0.11rem;
    background: linear-gradient(
        129.27deg,
        rgba(56, 114, 197, 0) 0.15%,
        rgba(132, 132, 132, 0.16) 100%
      ),
      #ffffff;
    box-shadow: 0rem 0.09rem 0.1456rem 0.0144rem rgba(54, 59, 67, 0.1);
  }
  .logo {
    margin-top: 0.22rem;
    text-align: left;
    img {
      width: 1.34rem;
      height: 0.23rem;
    }
    .logo-title {
      margin-top: 0.15rem;
      font-size: 0.24rem;
      color: #1760c3;
    }
  }

  .login-form-wrap {
    margin-top: 0.55rem;
  }

  .error-icon {
    margin-right: 10px;
  }

  .error-message {
    color: #ff9999;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .login-input-wrap {
    width: 100%;
    height: 0.4rem;
    position: relative;

    & + .login-input-wrap {
      margin-top: 0.27rem;
    }

    .login-form-input {
      width: 100%;
      border: 0 none;
      background-color: #f3f3f3;
      padding: 0.1rem 0.2rem;
      line-height: 0.2rem;
      outline: none;

      border-top-left-radius: 0.04rem;
      border-top-right-radius: 0.04rem;
      position: relative;
      box-shadow: inset 0.01rem 0.034rem 0.002rem 0.004rem
        rgba(232, 232, 232, 1);
      font-size: 0.16rem;
    }
    .focus-line {
      width: 100%;
      height: 0.002rem;
      left: 0;
      right: 0;
      bottom: 0rem;

      position: absolute;
      background-color: #f3f3f3;
    }

    .login-form-input:focus + .focus-line {
      background-color: #3061bc;
    }
  }

  .login-button {
    width: 100%;
    height: 0.42rem;
    line-height: 0.42rem;
    margin-top: 0.49rem;
    border-radius: 0.04rem;
    background: linear-gradient(
        90deg,
        rgba(43, 85, 181, 1) 0%,
        rgba(58, 118, 199, 1) 100%
      ),
      #2868b4;
    color: #fff;
    text-align: center;
    font-size: 0.2rem;
    cursor: pointer;
    user-select: none;
    &:hover {
      filter: brightness(1.1);
    }
    &:active {
      box-shadow: inset 1px 3px 2px 4px rgba(0, 0, 0, 0.1);
    }
  }
</style>
