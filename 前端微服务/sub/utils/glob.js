let unitName = ''
function unitTale(val, arr) {
  arr.forEach((element) => {
    if (element.unitCode === val) {
      unitName = element.unitName
    } else {
      if (element.children) {
        unitTale(val, element.children)
      } else {
      }
    }
  })
  return unitName
}
export default {
  unitTale,
}
