import _cloneDeep from 'lodash/cloneDeep'

/**
 * @desciption 将服务器json数据映射到formData的value
 * @param {*} sourceData
 * @param {*} formData
 * @returns
 */
export const dataToFormData = (sourceData, formData) => {
  if (sourceData === undefined) {
    throw 'sourceData is undefined'
  }
  if (formData === undefined) {
    throw 'formData is undefined'
  }
  const _formData = _cloneDeep(formData)
  for (let key in _formData) {
    const item = _formData[key]
    if (item.type === 'checkbox') {
      if (item.valueFrom && typeof item.valueFrom === 'function') {
        item.value = item.valueFrom(sourceData[item.apiCode])
      } else {
        item.value = sourceData[item.apiCode] == 1
      }
    } else if (item.type === 'empty') {
      continue
    } else {
      if (item.valueFrom && typeof item.valueFrom === 'function') {
        item.value = item.valueFrom(sourceData[item.apiCode])
      } else {
        item.value = sourceData[item.apiCode]
      }
    }
  }
  return _formData
}

/**
 * @description 将formData格式数据转换为服务器需要的json
 * @param {*} formData
 * @returns
 */
export const formDataToPostData = (formData) => {
  if (formData === undefined) {
    throw 'formData is undefined'
  }
  const postData = {}
  for (let key in formData) {
    const item = formData[key]
    if (item.type === 'checkbox') {
      if (item.valueTo && typeof item.valueTo === 'function') {
        postData[item.apiCode] = item.valueTo(item.value)
      } else {
        postData[item.apiCode] = item.value ? 1 : 0
      }
    } else if (item.type === 'empty') {
      continue
    } else {
      if (item.parseValueTo && item.parseValueTo === 'number') {
        postData[item.apiCode] = Number(item.value)
      } else if (item.valueTo && typeof item.valueTo === 'function') {
        postData[item.apiCode] = item.valueTo(item.value)
      } else {
        postData[item.apiCode] = item.value
      }
    }
  }
  return postData
}
