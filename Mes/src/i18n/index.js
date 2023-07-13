import Vue from 'vue'
import store from '@/store'
import VueI18n from 'vue-i18n'
import zhCN from 'vxe-table/lib/locale/lang/zh-CN'
import enUS from 'vxe-table/lib/locale/lang/en-US'
import elZh from 'element-ui/lib/locale/lang/zh-CN'
import elEn from 'element-ui/lib/locale/lang/en'
import elTh from 'element-ui/lib/locale/lang/th'
import commonZh from './common/zh'
import commonEn from './common/en'
import commonTh from './common/th'
import projectZh from './project/zh'
import projectEn from './project/en'
import projectTh from './project/th'

Vue.use(VueI18n)

const messages = {
  'zh-CN': {
    ...elZh,
    ...commonZh,
    ...projectZh,
    ...zhCN,
  },
  'en-US': {
    ...elEn,
    ...commonEn,
    ...projectEn,
    ...enUS,
  },
  'th-THA': {
    ...elTh,
    ...commonTh,
    ...projectTh,
  },
}

function getLanguage() {
  return store.getters['coreSettings/language'] || 'zh-CN'
}

const i18n = new VueI18n({
  locale: getLanguage(),
  messages,
})
export default i18n
