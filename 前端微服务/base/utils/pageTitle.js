import { title, titleReverse, titleSeparator } from '@/config'
import i18n from '@/i18n'
/**
 * @description 设置标题
 * @param pageTitle
 * @returns {string}
 */
// export default function getPageTitle(pageTitle) {
//   if (i18n.te(`i18n.${pageTitle}`)) pageTitle = i18n.t(`i18n.${pageTitle}`)
//   let newTitles = []
//   if (pageTitle) newTitles.push(pageTitle)
//   if (title) newTitles.push(title)
//   if (titleReverse) newTitles = newTitles.reverse()
//   return newTitles.join(titleSeparator)
// }

export default function getPageTitle(pageTitle) {
  return title
}
