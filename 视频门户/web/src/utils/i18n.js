export function translateTitle(title) {
  if (this.$te(`i18n.${title}`)) return this.$t(`i18n.${title}`)
  return title
}
