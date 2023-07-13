import store from '@/store'
export function hasPermission(key) {
  const permissions = Object.keys(store.getters['coreCommon/userPowers'])
  return permissions.includes(key)
}
