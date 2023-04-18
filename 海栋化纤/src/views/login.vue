<template>
  <div class="login">
    <div class="login-weaper">
      <div class="login-left">
        <!-- <div class="login-time">{{ time.txt }}</div> -->
        <div class="login-left-box">
          <div>
            <div class="logo">
              <!-- <img :src="logo" /> -->
            </div>
            <!-- <h2 class="title">登录</h2> -->
            <div class="msg">
              <div class="msg-author">
                <span>{{ quotations.name }}</span>
                <span>{{ quotations.comeFrom }}</span>
              </div>
              <div class="msg-txt">{{ quotations.content }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="login-right">
        <div class="login-main">
          <h4 class="login-title">江苏海栋化纤有限公司</h4>
          <el-form
            ref="ruleForm"
            class="el-form login-form"
            :model="ruleForm"
            :rules="rules"
          >
            <el-form-item style="margin-left: 0px" prop="name">
              <el-input
                ref="name"
                v-model="ruleForm.name"
                type="text"
                placeholder="用户名"
                prefix-icon="el-icon-user"
                clearable
                autocomplete="off"
                @keyup.enter.native.stop="submitForm('ruleForm')"
              >
                >
              </el-input>
            </el-form-item>
            <el-form-item style="margin-left: 0px" prop="password">
              <el-input
                ref="password"
                v-model="ruleForm.password"
                :type="isView ? 'type' : 'password'"
                placeholder="密码"
                prefix-icon="el-icon-lock"
                clearable
                autocomplete="off"
                @keyup.enter.native.stop="submitForm('ruleForm')"
              ></el-input>
            </el-form-item>
            <el-form-item style="margin-left: 0px" prop="code">
              <div class="el-row" span="24">
                <div class="el-col el-col-16">
                  <el-input
                    ref="code"
                    v-model="ruleForm.code"
                    type="text"
                    maxlength="4"
                    placeholder="请输入验证码"
                    prefix-icon="el-icon-position"
                    clearable
                    autocomplete="off"
                    @keyup.enter.native.stop="submitForm('ruleForm')"
                  ></el-input>
                </div>
                <div class="el-col el-col-8">
                  <div class="login-code">
                    <span class="login-code-img" @click="onLoginCodeClick">
                      {{ loginCode }}
                    </span>
                  </div>
                </div>
              </div>
            </el-form-item>
            <el-form-item style="margin: 40px 0px 0">
              <el-button
                type="primary"
                class="login-submit"
                :loading="submit.loading"
                @click="submitForm('ruleForm')"
              >
                <span>{{ submit.loadingTxt }}</span>
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  export default {
    name: 'Login',
    data() {
      // 用户名验证
      const validatename = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入用户名'))
          this.inputFocus(0)
        } else {
          callback()
          this.inputFocus(1)
        }
      }
      // 密码验证
      const validatePassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          callback()
          this.inputFocus(2)
        }
      }
      // 验证码验证
      const validateCode = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入验证码'))
        } else if (value !== this.loginCode) {
          callback(new Error('验证码输入错误'))
        } else {
          callback()
        }
      }
      return {
        // classicQuotationsList,
        quotations: {},
        // logo: require('@/assets/images/login/mainLogoLeft.svg'),
        isView: false,
        submit: {
          loading: false,
          loadingTxt: '登录',
        },
        ruleForm: {
          name: '',
          password: '',
          code: '',
        },
        rules: {
          name: [{ validator: validatename, trigger: 'blur' }],
          password: [{ validator: validatePassword, trigger: 'blur' }],
          code: [{ validator: validateCode, trigger: 'blur' }],
        },

        loginCode: null,
      }
    },
    computed: {},

    destroyed() {},
    mounted() {
      this.init()
    },
    methods: {
      // 初始化 `用户名input` 获取焦点，初始化 `验证码`
      init() {
        this.$refs['name'].focus()
        this.onLoginCodeClick()
      },
      // 初始化 `验证码`
      onLoginCodeClick() {
        this.loginCode = Math.random().toString(36).substr(-4)
      },
      // 登录按钮点击
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$store.dispatch('user/login', this.ruleForm).then(() => {
              this.$router.push('/')
            })
          } else {
            return false
          }
        })
      },
      // 获取 `input` 焦点函数
      inputFocus(type) {
        switch (Number.parseInt(type)) {
          case 0:
            this.inputFocusRefs('name') // 用户名
            break
          case 1:
            this.inputFocusRefs('password') // 密码
            break
          case 2:
            this.inputFocusRefs('code') // 验证码
            break
        }
      },
      // 获取 `input` 焦点与默认选中文字
      inputFocusRefs(resfName) {
        this.$refs[resfName].focus()
        this.$refs[resfName].select()
      },
    },
  }
</script>

<style scoped lang="scss">
  .login {
    height: 100vh;
    width: 100%;
    overflow: hidden;
    display: flex;
    position: relative;
    background-image: linear-gradient(
      -180deg,
      rgb(23, 114, 224),
      rgb(255, 255, 255)
    );
    // background: url('../assets/login_images/loginbg.jpg') no-repeat;
    background-size: cover;
    .vue-particles {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(
        ellipse at top left,
        rgba(105, 155, 200, 1) 0%,
        rgba(181, 197, 216, 1) 57%
      );
    }
    .login-weaper {
      margin: auto;
      height: 500px;
      display: flex;
      box-sizing: border-box;
      position: relative;
      z-index: 1;
      border: none;
      box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
      .login-left {
        width: 500px;
        padding: 20px;
        font-size: 16px;
        color: #fff;
        position: relative;
        // background-color: rgba(0, 153, 255, 0.6);
        background: url('../assets/login_images/loginbg.jpg') no-repeat;
        background-size: cover;
        filter: hue-rotate(20deg);
        display: flex;
        flex-direction: column;
        .login-time {
          width: 100%;
          color: #fff;
          opacity: 0.9;
          font-size: 14px;
          overflow: hidden;
        }
        .login-left-box {
          flex: 1;
          overflow: hidden;
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          padding: 80px 45px;
          .logo {
            height: 45px;
            display: inline-block;
            font-size: 35px;
            img {
              width: 100%;
            }
          }
          .title {
            color: #fff;
            font-weight: 300;
            letter-spacing: 2px;
            font-size: 16px;
          }
          .msg {
            color: #fff;
            font-size: 13px;
            margin-top: 35px;
            .msg-author {
              opacity: 0.6;
              span:last-of-type {
                margin-left: 15px;
              }
            }
            .msg-txt {
              margin-top: 15px;
              line-height: 22px;
            }
          }
        }
      }
      .login-right {
        width: 500px;
        padding: 20px;
        position: relative;
        align-items: center;
        display: flex;
        background-color: rgba(255, 255, 255, 1);
        .login-main {
          margin: 0 auto;
          width: 70%;
          .login-title {
            color: #333;
            margin-bottom: 40px;
            font-weight: 500;
            font-size: 22px;
            text-align: center;
            letter-spacing: 4px;
          }
          .login-form {
            margin: 10px 0;
            i {
              color: #333;
            }
            .el-form-item {
              margin-bottom: 20px !important;
              .login-code {
                display: flex;
                align-items: center;
                justify-content: space-around;
                margin: 0 0 0 10px;
                .login-code-img {
                  // margin-top: 2px;
                  width: 100px;
                  height: 32px;
                  background-color: #fdfdfd;
                  border: 1px solid #dcdfe6;
                  color: #333;
                  font-size: 14px;
                  font-weight: 700;
                  letter-spacing: 5px;
                  line-height: 32px;
                  text-indent: 5px;
                  text-align: center;
                  cursor: pointer;
                  position: relative;
                  z-index: 9999;
                  transition: all ease 0.2s;
                  &:hover {
                    border-color: #c0c4cc;
                    transition: all ease 0.2s;
                  }
                }
              }
              .login-submit {
                width: 100%;
                height: 45px;
                letter-spacing: 2px;
                font-weight: 300;
              }
            }
          }
          .login-menu {
            margin-top: 30px;
            width: 100%;
            text-align: left;
            a {
              color: #999;
              font-size: 12px;
              margin: 0 8px;
              text-decoration: none;
              &:hover {
                color: #1e9fff;
                text-decoration: underline;
              }
            }
          }
        }
      }
    }
    @media screen and (max-width: 1000px) {
      .login-left {
        display: none !important;
      }
    }
  }
</style>
