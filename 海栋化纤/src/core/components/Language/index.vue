<template>
  <el-dropdown v-if="showLanguage" @command="handleCommand">
    <remix-icon aria-disabled="" icon-class="translate"></remix-icon>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="zh">中文简体</el-dropdown-item>
      <el-dropdown-item command="en">English</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import getPageTitle from '@/utils/pageTitle'

  export default {
    name: 'Language',
    computed: {
      ...mapGetters({
        showLanguage: 'settings/showLanguage',
      }),
    },
    methods: {
      ...mapActions({
        changeLanguage: 'settings/changeLanguage',
      }),
      handleCommand(command) {
        this.changeLanguage(command)
        this.$i18n.locale = command
        document.title = getPageTitle(this.$route.meta.title)
      },
    },
  }
</script>
