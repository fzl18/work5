<template>
  <el-dropdown @command="handleCommand">
    <span class="avatar-dropdown">
      <!-- <img :src="avatar" alt="" class="user-avatar" /> -->
      <remix-icon icon-class="user-3-fill" style="font-size: 20px"></remix-icon>
      <!-- <i class="ri-user-2-fill" style="font-size: 18px"></i> -->
      <div class="user-name">
        <!-- {{ $store.state.coreCommon.userinfo.primaryUnitName || '管理员' }} - -->
        <!-- {{ $store.state.coreUser.userName || '管理员' }} -->
        {{ userName || '管理员' }}
        <remix-icon icon-class="arrow-down-s-line"></remix-icon>
      </div>
    </span>

    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="logout" @click="logout">
        <remix-icon icon-class="logout-circle-r-line"></remix-icon>
        {{ $translateTitle('退出登录') }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'Avatar',
    computed: {
      ...mapGetters({
        avatar: 'coreUser/avatar',
        userName: 'coreUser/userName',
      }),
    },
    methods: {
      handleCommand(command) {
        switch (command) {
          case 'logout':
            this.logout()
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
        await this.$store.dispatch('coreUser/logout')
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
