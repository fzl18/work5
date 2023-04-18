<template>
  <div>
    <el-dropdown @command="handleCommand">
      <span class="avatar-dropdown">
        <!-- <img :src="avatar" alt="" class="user-avatar" /> -->
        <remix-icon
          icon-class="account-circle-fill"
          style="font-size: 30px"
        ></remix-icon>
        <div class="user-name">
          {{ cname }}
          <remix-icon icon-class="arrow-down-s-line"></remix-icon>
        </div>
      </span>

      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="changePW">
          <remix-icon icon-class="lock-2-line"></remix-icon>
          {{ translateTitle('修改密码') }}
        </el-dropdown-item>
        <el-dropdown-item command="logout">
          <remix-icon icon-class="logout-circle-r-line"></remix-icon>
          {{ translateTitle('退出登录') }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <el-dialog
      title="修改密码"
      :visible="dialogVisible"
      width="300px"
      append-to-body
      @close="close('formUser')"
    >
      <div>
        <el-form
          ref="formUser"
          label-position="right"
          label-width="80px"
          :model="formUser"
        >
          <el-form-item
            label="原密码"
            prop="oldpwd"
            :rules="[
              {
                required: true,
                message: '不能为空',
                trigger: 'blur',
              },
            ]"
          >
            <el-input v-model="formUser.oldpwd"></el-input>
          </el-form-item>
          <el-form-item
            label="新密码"
            prop="password"
            :rules="[
              {
                required: true,
                message: '不能为空',
                trigger: 'blur',
              },
            ]"
          >
            <el-input v-model="formUser.password"></el-input>
          </el-form-item>
          <el-form-item
            label="确认密码"
            prop="confirm_pwd"
            :rules="[
              {
                required: true,
                message: '不能为空',
                trigger: 'blur',
              },
            ]"
          >
            <el-input v-model="formUser.confirm_pwd"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close('formUser')">取 消</el-button>
        <el-button type="primary" @click="changePW('formUser')">
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { translateTitle } from '@/utils/i18n'
  import { mapGetters } from 'vuex'
  import { recordRoute } from '@/config'
  import { userPwd } from '@/views/ex-warehouse/api'
  export default {
    name: 'Avatar',
    data() {
      return {
        dialogVisible: false,
        name: null,
        formUser: {
          oldpwd: null,
          password: null,
          confirm_pwd: null,
        },
      }
    },
    computed: {
      ...mapGetters({
        avatar: 'user/avatar',
        username: 'user/username',
      }),
      cname() {
        return this.username || window.localStorage.name
      },
    },
    methods: {
      translateTitle,
      handleCommand(command) {
        switch (command) {
          case 'logout':
            this.logout()
            break
          case 'personalCenter':
            this.personalCenter()
            break
          case 'changePW':
            this.dialogVisible = true
            break
        }
      },
      personalCenter() {
        this.$router.push('/personalCenter/personalCenter')
      },
      changePW(type) {
        this.$refs[type].validate(async (valid) => {
          if (valid) {
            if (this.formUser.password !== this.formUser.confirm_pwd) {
              this.$baseMessage('确认密码不一致！', 'error')
              return
            } else {
              userPwd(this.formUser).then((res) => {
                if (res) {
                  this.close('formUser')
                  this.logout()
                }
              })
            }
          }
        })
      },
      resetForm(type) {
        this.$refs[type].resetFields()
      },
      close(type) {
        this.$refs[type].resetFields()
        this.dialogVisible = false
      },
      async logout() {
        await this.$store.dispatch('user/logout')
        // if (recordRoute) {
        //   const fullPath = this.$route.fullPath
        //   await this.$router.push(`/login?redirect=${fullPath}`)
        // } else {
        // await this.$router.push('/')
        // }
      },
    },
  }
</script>
<style lang="scss" scoped>
  .avatar-dropdown {
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: center;
    justify-items: center;

    .user-avatar {
      width: 40px;
      height: 40px;
      margin-left: 15px;
      cursor: pointer;
      border-radius: 50%;
    }

    .user-name {
      position: relative;
      display: flex;
      align-content: center;
      align-items: center;
      height: 40px;
      margin-left: 6px;
      line-height: 40px;
      cursor: pointer;

      [class*='ri-'] {
        margin-left: 0 !important;
      }
    }
  }
</style>
