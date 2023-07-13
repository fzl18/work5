<template>
  <el-dropdown v-if="showLanguage" @command="handleCommand">
    <!-- <remix-icon aria-disabled="" icon-class="translate"></remix-icon> -->
    <span class="language-dropdown">
      <remix-icon icon-class="earth-fill" style="font-size: 20px"></remix-icon>
      <div class="language-text">
        {{ getLanguageText }}
        <remix-icon icon-class="arrow-down-s-line"></remix-icon>
      </div>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="zh-CN">中文简体</el-dropdown-item>
      <el-dropdown-item command="en-US">English</el-dropdown-item>
      <el-dropdown-item command="th-THA">Thai</el-dropdown-item>
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
        language: 'coreSettings/language',
      }),
      getLanguageText() {
        let temp = null
        switch (this.language) {
          case 'zh-CN':
            temp = '中文简体'
            break
          case 'en-US':
            temp = 'English'
            break
          case 'th-THA':
            temp = 'Thai'
            break
          default:
            temp = '-'
            break
        }
        return temp
      },
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
<style lang="scss" scoped>
  .language-dropdown {
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: center;
    justify-items: center;

    .language-text {
      position: relative;
      display: flex;
      align-content: center;
      align-items: center;
      height: 40px;
      margin-left: 6px;
      line-height: 40px;
      color: #141429;
      cursor: pointer;

      [class*='ri-'] {
        margin-left: 0 !important;
      }
    }
  }
</style>
