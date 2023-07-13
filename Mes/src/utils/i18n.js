import i18n from '@/i18n'
export function translateTitle(title, params = {}) {
  if (this.$te(`${title}`)) return this.$t(`${title}`, params)
  return title
}
export function $translateTitle(title, params = {}) {
  if (i18n.te(`${title}`)) return i18n.t(`${title}`, params)
  return title
}
