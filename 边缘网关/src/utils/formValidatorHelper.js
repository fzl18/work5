export const isRequired = (
  fieldName = '',
  type = 'string',
  errorMessage = '不能为空'
) => {
  return {
    type,
    required: true,
    message: fieldName + errorMessage,
  }
}

export const isEnglishOrNumberOrSymbol = (
  fieldName = '',
  errorMessage = '不支持中文与空格'
) => {
  return {
    pattern:
      /^[a-zA-Z0-9][a-zA-Z0-9_\-\.\,\/\\@\+\*\%#\!\(\)\[\]\{\}\'\"\:\;\<\>\?\$\^\&]*$/,
    message: fieldName + errorMessage,
  }
}

export const isEnglishAndNumber = (
  fieldName = '',
  errorMessage = '必须为英文或者数字'
) => {
  return {
    pattern: /^[a-zA-Z0-9]*$/,
    message: fieldName + errorMessage,
  }
}

export const isNumber = (fieldName = '', errorMessage = '必须为数值') => {
  return {
    pattern: /^[0-9]*$/,
    message: fieldName + errorMessage,
  }
}

export const isFloatNumber = (
  fieldName = '',
  errorMessage = '必须为非负数字'
) => {
  return {
    pattern: /^[0-9]*\.?[0-9]*$/,
    message: fieldName + errorMessage,
  }
}

export const isEmail = (
  fieldName = '',
  errorMessage = '必须为正确的Email格式'
) => {
  return {
    pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
    message: fieldName + errorMessage,
  }
}

export const isEmailList = (
  fieldName = '',
  errorMessage = '必须为正确的Email格式(用;分割)'
) => {
  return {
    pattern:
      /^(([a-zA-Z0-9_\.-]+)@([\da-zA-Z\.-]+)\.([a-zA-Z\.]{2,6}\;))*([a-zA-Z0-9_\.-]+)@([\da-z\.-]+)\.([a-zA-Z\.]{2,6})$/,
    message: fieldName + errorMessage,
  }
}

export const isIP = (fieldName = '', errorMessage = '必须为正确的IP格式') => {
  return {
    pattern:
      /((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/,
    message: fieldName + errorMessage,
  }
}

export const isLANIP = (
  fieldName = '',
  errorMessage = '必须为192,172,10开头的IP格式'
) => {
  return {
    pattern: /^(192|172|10)(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/,
    message: fieldName + errorMessage,
  }
}

export const isUrl = (fieldName = '', errorMessage = '必须为正确的Url格式') => {
  return {
    pattern:
      /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/,
    message: fieldName + errorMessage,
  }
}

export const isPort = (
  fieldName = '',
  errorMessage = '必须为正确的端口格式'
) => {
  return {
    pattern:
      /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
    message: fieldName + errorMessage,
  }
}
export const isKeyName = (
  fieldName = '',
  errorMessage = '必须为正确的KeyName格式'
) => {
  return {
    pattern: /^[a-zA-Z]+\w*$/,
    message: fieldName + errorMessage,
  }
}
