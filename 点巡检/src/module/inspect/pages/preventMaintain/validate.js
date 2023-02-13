// 判断输入正整数
export function blurInteger(rule, value, callback) {
  const boolean = new RegExp('^[1-9][0-9]*$').test(value)
  if (!boolean) {
    callback(new Error('请输入正整数'))
  } else if (value > 10000) {
    callback(new Error('数量应小于等于10000'))
  } else {
    callback()
  }
}
export function blurMaterialNum(rule, value, callback) {
  const boolean = new RegExp(
    '(?:^[1-9]([0-9]+)?(?:\\.[0-9]{1,2})?$)|(?:^(?:0)$)|(?:^[0-9]\\.[0-9](?:[0-9])?$)'
  ).test(value)
  if (!boolean) {
    callback(new Error('请输入正数,支持两位小数'))
  } else if (value == 0) {
    callback(new Error('数量应该大于0'))
  } else {
    callback()
  }
}
export function blurMaterialNumV2(rule, value, callback) {
  const boolean = new RegExp(
    '(?:^[1-9]([0-9]+)?(?:\\.[0-9]{1,2})?$)|(?:^(?:0)$)|(?:^[0-9]\\.[0-9](?:[0-9])?$)'
  ).test(value)
  if (!boolean) {
    callback(new Error('请输入正数,支持两位小数'))
  } else if (value == 0) {
    callback()
  } else {
    callback()
  }
}
export function blurMaterialNumBol(value) {
  const boolean = new RegExp(
    '(?:^[1-9]([0-9]+)?(?:\\.[0-9]{1,2})?$)|(?:^(?:0)$)|(?:^[0-9]\\.[0-9](?:[0-9])?$)'
  ).test(value)
  return boolean
}
// 判断单价大于0
export function priceValid(rule, value, callback) {
  if (value <= 0) {
    callback(new Error('单价应大于0'))
  } else {
    callback()
  }
}

//判断输入大于0的数
export function blurNumber(rule, value, callback) {
  const regular = /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/
  if (!value && value != '0') {
    callback()
  }
  if (!regular.test(value)) {
    callback(new Error('请输入大于0的数'))
  } else {
    callback()
  }
}

// 邮编校验
export function zipCode(rule, value, callback) {
  const regular = /^[1-9][0-9]{5}$/
  // if (!regular.test(value)) {
  //   callback(new Error('邮编格式有误'))
  // } else {
  //   callback()
  // }
  if (!value) {
    callback(new Error('请输入邮编格'))
  } else {
    callback()
  }
}
// 网址校验
export function website(rule, value, callback) {
  const regular =
    /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  // if (!regular.test(value)) {
  //   callback(new Error('网址格式有误，如"https://www.baidu.com/"'))
  // } else {
  //   callback()
  // }
  if (!value) {
    callback(new Error('请输入网址'))
  } else {
    callback()
  }
}

// 电话校验
export function checklxdh(rule, value, callback) {
  if (value.length <= 0) {
    //手机号码
    return callback(new Error('联系电话不能为空'))
  } else {
    return callback()
  }
}

// export function checklxdh(rule, value, callback) {
//   var tel = /^(0\d{2,3}-)?\d{7,8}$/
//   var phone = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/
//   if (value.length === 11) {
//     //手机号码
//     if (!phone.test(value)) {
//       return callback(new Error('联系电话格式不正确'))
//     } else {
//       return callback()
//     }
//   } else if (
//     (value.length === 13 || value.length === 12) &&
//     value.indexOf('-') !== -1
//   ) {
//     //电话号码
//     if (!tel.test(value)) {
//       return callback(new Error('座机格式不正确'))
//     } else {
//       return callback()
//     }
//   } else if (value.length === 0) {
//     return callback(new Error('联系电话不能为空'))
//   } else {
//     return callback('联系电话格式不正确')
//   }
// }

//保留两位小数不足补0
// export function changeTwoDecimal(x) {
//   var f_x = parseFloat(x)
//   if (isNaN(f_x)) {
//     return 0
//   }
//   var f_x = Math.floor(x * 100) / 100
//   var s_x = f_x.toString()
//   var pos_decimal = s_x.indexOf('.')
//   if (pos_decimal < 0) {
//     pos_decimal = s_x.length
//     s_x += '.'
//   }
//   while (s_x.length <= pos_decimal + 2) {
//     s_x += '0'
//   }
//   return s_x
// }
export function changeTwoDecimal(num, decimal = 2) {
  if (!num) {
  } else {
    num = num.toString()
    let index = num.indexOf('.')
    if (index !== -1) {
      num = num.substring(0, decimal + index + 1)
    } else {
      num = num.substring(0)
    }
    return parseFloat(num).toFixed(decimal)
  }
}
// 建议库存
export function numberRange(rule, value, callback) {
  const reg = /^(0|\+?[1-9][0-9]*)$/
  if (value && !reg.test(value)) {
    callback(new Error('输入格式不正确，应为数字'))
  } else if (value && value > 99999999) {
    callback(new Error('建议库存的值应小于等于99999999'))
  } else {
    callback()
  }
}
// 展示顺序
export function numberRange2(rule, value, callback) {
  const reg = /^(0|\+?[1-9][0-9]*)$/
  if (value && !reg.test(value)) {
    callback(new Error('输入格式不正确，应为数字'))
  } else if (value && value > 999999999) {
    callback(new Error('展示顺序应小于等于999999999'))
  } else {
    callback()
  }
}

// 重量
export function weightRange(rule, value, callback) {
  const reg = /^(0|\+?[1-9][0-9]*)$/
  if (value && value > 99999999) {
    callback(new Error('重量的值应小于等于99999999'))
  } else {
    callback()
  }
}

export function criticalValue(rule, value, callback) {
  const reg = /^[1-9][0-9]*$/
  if (value && value > 99999999) {
    callback(new Error('临界值应小于等于99999999'))
  } else {
    callback()
  }
}

// 校验经度
export function checkLong(rule, value, callback) {
  var longrg =
    /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,6})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/
  if (value && !longrg.test(value)) {
    callback(new Error('经度整数部分为0-180,小数部分为0到6位!'))
  } else {
    callback()
  }
}

// 纬度
export function checkLat(rule, value, callback) {
  var latreg = /^(\-|\+)?([0-8]?\d{1}\.\d{0,6}|90\.0{0,6}|[0-8]?\d{1}|90)$/
  if (value && !latreg.test(value)) {
    callback(new Error('纬度整数部分为0-90,小数部分为0到6位!'))
  } else {
    callback()
  }
}
