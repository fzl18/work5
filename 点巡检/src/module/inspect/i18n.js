export function translateTitle(title) {
  if (this.$te(`inspect.${title}`)) return this.$t(`inspect.${title}`)
  return title
}
