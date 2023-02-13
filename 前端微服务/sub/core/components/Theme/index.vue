<template>
  <span v-if="showTheme">
    <el-drawer
      :title="translateTitle('主题配置')"
      :visible.sync="drawerVisible"
      append-to-body
      direction="rtl"
      size="410px"
    >
      <el-scrollbar class="theme-scrollbar">
        <div class="el-drawer__body">
          <el-form ref="form" :model="theme" label-width="90px">
            <el-form-item :label="translateTitle('布局')">
              <el-radio-group v-model="theme.layout">
                <el-radio-button label="gallery">
                  {{ translateTitle('全局') }}
                </el-radio-button>
                <el-radio-button label="comprehensive">
                  {{ translateTitle('综合') }}
                </el-radio-button>
                <el-radio-button label="vertical">
                  {{ translateTitle('纵向') }}
                </el-radio-button>
                <el-radio-button label="horizontal">
                  {{ translateTitle('横向') }}
                </el-radio-button>
                <!-- <el-radio-button label="common">
                  {{ translateTitle('常规') }}
                </el-radio-button> -->
                <el-radio-button label="cloud">
                  {{ translateTitle('宝通') }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="translateTitle('主题')">
              <el-radio-group v-model="theme.themeName" @click="saveTheme">
                <el-radio-button label="default">
                  {{ translateTitle('默认') }}
                </el-radio-button>
                <el-radio-button label="ocean">
                  {{ translateTitle('蓝') }}
                </el-radio-button>
                <el-radio-button label="green">
                  {{ translateTitle('绿') }}
                </el-radio-button>
                <el-radio-button label="glory">
                  {{ translateTitle('金') }}
                </el-radio-button>
                <el-radio-button label="white">
                  {{ translateTitle('白') }}
                </el-radio-button>
                <el-radio-button label="cloud">
                  {{ translateTitle('佛') }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>

            <el-form-item :label="translateTitle('头部')">
              <el-radio-group
                v-model="theme.fixedHeader"
                :disabled="theme.layout === 'common'"
              >
                <el-radio-button :label="true">
                  {{ translateTitle('固定') }}
                </el-radio-button>
                <el-radio-button :label="false">
                  {{ translateTitle('不固定') }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="translateTitle('多标签')">
              <el-radio-group v-model="theme.showTabsBar">
                <el-radio-button :label="true">
                  {{ translateTitle('显示') }}
                </el-radio-button>
                <el-radio-button :label="false">
                  {{ translateTitle('不显示') }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>

            <el-form-item :label="translateTitle('国际化')">
              <el-radio-group v-model="theme.showLanguage">
                <el-radio-button :label="true">
                  {{ translateTitle('显示') }}
                </el-radio-button>
                <el-radio-button :label="false">
                  {{ translateTitle('不显示') }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="translateTitle('进度条')">
              <el-radio-group v-model="theme.showProgressBar">
                <el-radio-button :label="true">
                  {{ translateTitle('显示') }}
                </el-radio-button>
                <el-radio-button :label="false">
                  {{ translateTitle('不显示') }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="translateTitle('全屏')">
              <el-radio-group v-model="theme.showFullScreen">
                <el-radio-button :label="true">
                  {{ translateTitle('显示') }}
                </el-radio-button>
                <el-radio-button :label="false">
                  {{ translateTitle('不显示') }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button @click="setDefaultTheme">
                {{ translateTitle('恢复默认') }}
              </el-button>
              <el-button type="primary" @click="saveTheme">
                {{ translateTitle('保存') }}
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-scrollbar>
    </el-drawer>
  </span>
</template>

<script>
  import { translateTitle } from '@/utils/i18n'
  import { mapActions, mapGetters } from 'vuex'
  import {
    fixedHeader as defaultHeader,
    layout as defaultLayout,
    showFullScreen as defaultShowFullScreen,
    showLanguage as defaultShowLanguage,
    showNotice as defaultShowNotice,
    showProgressBar as defaultShowProgressBar,
    showRefresh as defaultShowRefresh,
    showSearch as defaultShowSearch,
    showTabsBar as defaultShowTabsBar,
  } from '@/config'

  export default {
    name: 'Theme',
    data() {
      return {
        drawerVisible: false,
        theme: {
          themeName: '',
          layout: '',
          fixedHeader: '',
          showLanguage: '',
          showProgressBar: '',
          showRefresh: '',
          showSearch: '',
          showTabsBar: '',
          showNotice: '',
          showFullScreen: '',
        },
      }
    },
    computed: {
      ...mapGetters({
        themeName: 'coreSettings/themeName',
        layout: 'coreSettings/layout',
        fixedHeader: 'coreSettings/fixedHeader',
        showLanguage: 'coreSettings/showLanguage',
        showProgressBar: 'coreSettings/showProgressBar',
        showRefresh: 'coreSettings/showRefresh',
        showSearch: 'coreSettings/showSearch',
        showTabsBar: 'coreSettings/showTabsBar',
        showNotice: 'coreSettings/showNotice',
        showFullScreen: 'coreSettings/showFullScreen',
        showTheme: 'coreSettings/showTheme',
      }),
    },
    created() {
      this.$baseEventBus.$on('random-theme', () => {
        this.randomTheme()
      })
      const theme = localStorage.getItem('theme')
      if (null !== theme) {
        this.theme = JSON.parse(theme)
        this.saveTheme()
      } else {
        this.handleSetData()
      }
    },
    mounted() {
      let inputKey = ''
      document.addEventListener('keydown', (e) => {
        if (e.keyCode === 13) {
          if (inputKey == 'theme') {
            this.drawerVisible = !this.drawerVisible
          }
          inputKey = ''
        } else {
          inputKey += e.key
        }
      })
    },
    methods: {
      translateTitle,
      ...mapActions({
        changeFixedHeader: 'coreSettings/changeFixedHeader',
        changeLayout: 'coreSettings/changeLayout',
        handleShowLanguage: 'coreSettings/handleShowLanguage',
        handleShowProgressBar: 'coreSettings/handleShowProgressBar',
        handleShowRefresh: 'coreSettings/handleShowRefresh',
        handleShowSearch: 'coreSettings/handleShowSearch',
        handleShowTabsBar: 'coreSettings/handleShowTabsBar',
        handleShowNotice: 'coreSettings/handleShowNotice',
        handleShowFullScreen: 'coreSettings/handleShowFullScreen',
      }),
      shuffle(array) {
        let m = array.length,
          t,
          i
        while (m) {
          i = Math.floor(Math.random() * m--)
          t = array[m]
          array[m] = array[i]
          array[i] = t
        }
        return array
      },
      randomTheme() {
        const loading = this.$baseColorfullLoading(
          0,
          '随机换肤只用于演示会在页面刷新时自动失效，请放心切换，如需保存，在主题配置中保存...'
        )
        const themeNameArray = ['default', 'ocean', 'green', 'glory', 'white']
        const layoutArray = [
          'horizontal',
          'vertical',
          'gallery',
          'comprehensive',
          'common',
        ]
        this.theme.themeName = this.shuffle(themeNameArray)[0]
        this.theme.layout = this.shuffle(layoutArray)[0]
        if (document.body.getBoundingClientRect().width >= 992) {
          this.changeLayout(this.theme.layout)
        }
        document.getElementsByTagName(
          'body'
        )[0].className = `theme-${this.theme.themeName}`
        loading.close()
      },
      handleSetData() {
        this.theme.themeName = this.themeName
        this.theme.layout = this.layout
        this.theme.fixedHeader = this.fixedHeader
        this.theme.showLanguage = this.showLanguage
        this.theme.showProgressBar = this.showProgressBar
        this.theme.showRefresh = this.showRefresh
        this.theme.showSearch = this.showSearch
        this.theme.showTabsBar = this.showTabsBar
        this.theme.showNotice = this.showNotice
        this.theme.showFullScreen = this.showFullScreen
        document.getElementsByTagName(
          'body'
        )[0].className = `theme-${this.themeName}`
      },
      handleOpenTheme() {
        this.drawerVisible = true
      },
      saveTheme() {
        let {
          themeName,
          layout,
          fixedHeader,
          showLanguage,
          showProgressBar,
          showRefresh,
          showSearch,
          showTabsBar,
          showNotice,
          showFullScreen,
        } = this.theme
        localStorage.setItem(
          'theme',
          `{
              "themeName":"${themeName}",
              "layout":"${layout}",
              "fixedHeader":${fixedHeader},
              "showLanguage":${showLanguage},
              "showProgressBar":${showProgressBar},
              "showRefresh":${showRefresh},
              "showSearch":${showSearch},
              "showTabsBar":${showTabsBar},
              "showNotice":${showNotice},
              "showFullScreen":${showFullScreen}
            }`
        )
        document.getElementsByTagName(
          'body'
        )[0].className = `theme-${themeName}`

        if (document.body.getBoundingClientRect().width >= 992) {
          this.changeLayout(layout)
        }
        this.changeFixedHeader(fixedHeader)
        this.handleShowLanguage(showLanguage)
        this.handleShowProgressBar(showProgressBar)
        this.handleShowRefresh(showRefresh)
        this.handleShowSearch(showSearch)
        this.handleShowTabsBar(showTabsBar)
        this.handleShowNotice(showNotice)
        this.handleShowFullScreen(showFullScreen)
        this.drawerVisible = false
      },
      setDefaultTheme() {
        let { themeName } = this.theme
        document
          .getElementsByTagName('body')[0]
          .classList.remove(`theme-${themeName}`)
        localStorage.removeItem('theme')
        this.$refs['form'].resetFields()
        Object.assign(this.$data, this.$options.data())
        this.changeLayout(defaultLayout)
        this.changeFixedHeader(defaultHeader)
        this.handleShowLanguage(defaultShowLanguage)
        this.handleShowProgressBar(defaultShowProgressBar)
        this.handleShowRefresh(defaultShowRefresh)
        this.handleShowSearch(defaultShowSearch)
        this.handleShowTabsBar(defaultShowTabsBar)
        this.handleShowNotice(defaultShowNotice)
        this.handleShowFullScreen(defaultShowFullScreen)
        this.handleSetData()
        this.drawerVisible = false
      },
    },
  }
</script>

<style lang="scss" scoped>
  @mixin right-bar {
    position: fixed;
    right: 0;
    z-index: $base-z-index;
    width: 60px;
    min-height: 60px;
    text-align: center;
    cursor: pointer;
    background: $base-color-blue;
    border-radius: $base-border-radius;

    > div {
      padding-top: 10px;
      border-bottom: 0 !important;

      &:hover {
        opacity: 0.9;
      }

      & + div {
        border-top: 1px solid $base-color-white;
      }

      p {
        padding: 0;
        margin: 0;
        font-size: $base-font-size-small;
        line-height: 30px;
        color: $base-color-white;
      }
    }
  }

  .theme-scrollbar {
    height: calc(100vh - 80px);
    overflow: hidden;
  }

  .theme-setting {
    @include right-bar;

    top: calc((100vh - 110px) / 2);

    ::v-deep() {
      [class*='ri-'] {
        display: block !important;
        margin-right: auto !important;
        margin-left: auto !important;
        color: $base-color-white !important;
        fill: $base-color-white !important;
      }
    }
  }

  .el-drawer__body {
    padding: 0 20px 20px 20px;
  }
</style>
<style lang="scss">
  .el-drawer__wrapper {
    outline: none !important;

    * {
      outline: none !important;
    }
  }

  .core-color-picker {
    .el-color-dropdown__link-btn {
      display: none;
    }
  }
</style>
