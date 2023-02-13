export function translateTitle(title, params = {}) {
  if (this.$te(`${title}`)) return this.$t(`${title}`, params)
  return title
}
