<template>
  <el-dropdown v-if="showLanguage" @command="handleCommand">
    <!-- <remix-icon aria-disabled="" icon-class="translate"></remix-icon> -->
    <i class="ri-earth-fill" style="font-size: 18px"></i>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="zh-CN">中文简体</el-dropdown-item>
      <el-dropdown-item command="en-US">English</el-dropdown-item>
      <el-dropdown-item command="es-CL">Español</el-dropdown-item>
      <!-- zh_CN、en_US、es_CL、 -->
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
        showLanguage: 'coreSettings/showLanguage',
      }),
    },
    methods: {
      ...mapActions({
        changeLanguage: 'coreSettings/changeLanguage',
      }),
      handleCommand(command) {
        console.log(command, 'command')
        console.log(this.$route.meta.title, 'this.$route.meta.title')
        this.changeLanguage(command)
        this.$i18n.locale = command
        document.title = getPageTitle(this.$route.meta.title)
      },
    },
  }
</script>
