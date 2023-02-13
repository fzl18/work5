import Vue from 'vue'
import store from '@/store'
import VueI18n from 'vue-i18n'
import elEn from 'element-ui/lib/locale/lang/en'
import elZh from 'element-ui/lib/locale/lang/zh-CN'
import es from './common/es'
import zh from './common/zh'
import en from './common/en'
// import purchaseSystem from '@/module/btzbglSystem/purchaseSystem/i18n'

Vue.use(VueI18n)

const messages = {
  'en-US': {
    ...en,
    ...elEn,
    // ...purchaseSystem.en,
  },
  'zh-CN': {
    ...zh,
    ...elZh,
    // ...purchaseSystem.zh,
  },
  'es-CL': {
    ...es,
    // ...esCL,
    // ...purchaseSystem.es,
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
