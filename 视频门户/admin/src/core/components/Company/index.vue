<template>
  <div>
    <span class="avatar-dropdown">
      <remix-icon
        icon-class="building-2-fill"
        style="font-size: 20px"
      ></remix-icon>
      <div class="user-company">
        {{ (userInfo && userInfo.topUnitName) || '宝通智能物联网科技公司' }}
      </div>
    </span>
  </div>
</template>

<script>
  import { translateTitle } from '@/utils/i18n'
  import { mapGetters } from 'vuex'

  export default {
    name: 'Company',
    computed: {
      ...mapGetters({
        avatar: 'coreUser/avatar',
        userInfo: 'coreUser/userInfo',
      }),
    },
    methods: {
      translateTitle,
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

    .user-company {
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
