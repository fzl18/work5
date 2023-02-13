<template>
  <el-dropdown @command="handleCommand">
    <span class="avatar-dropdown">
      <!-- <img :src="avatar" alt="" class="user-avatar" /> -->
      <!-- <remix-icon
        icon-class="account-circle-fill"
        style="font-size: 26px"
      ></remix-icon> -->
      <i class="ri-user-2-fill" style="font-size: 18px"></i>
      <div class="user-name">
        <!-- {{ $store.state.coreCommon.userinfo.primaryUnitName || '管理员' }} - -->
        {{ $store.state.coreCommon.userinfo.userName || '管理员' }}
        <remix-icon icon-class="arrow-down-s-line"></remix-icon>
      </div>
    </span>

    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="changepwd" @click="changepwd">
        <remix-icon icon-class="logout-circle-r-line"></remix-icon>
        {{ translateTitle('修改密码') }}
      </el-dropdown-item>

      <el-dropdown-item command="logout" @click="logout">
        <remix-icon icon-class="logout-circle-r-line"></remix-icon>
        {{ translateTitle('退出登录') }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
  import { translateTitle } from '@/utils/i18n'
  import { mapGetters } from 'vuex'
  import api from '@/core/api/common'

  export default {
    name: 'Avatar',
    computed: {
      ...mapGetters({
        avatar: 'coreUser/avatar',
      }),
    },
    methods: {
      translateTitle,
      handleCommand(command) {
        switch (command) {
          case 'logout':
            this.logout()
            break
          case 'changepwd':
            this.changepwd()
            break
          case 'personalCenter':
            this.personalCenter()
            break
        }
      },
      personalCenter() {
        this.$router.push('/personalCenter/personalCenter')
      },
      async logout() {
        let href = window.location.href
        // await this.$store.dispatch('coreUser/logout')
        const url = `${api.logout}?redirectUrl=${href}`
        window.location.href = url
      },
      // 修改密码
      changepwd() {
        this.$router.push('/agencySystem/changepwd')
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
      color: #fff;
      cursor: pointer;

      [class*='ri-'] {
        margin-left: 0 !important;
      }
    }
  }
</style>
