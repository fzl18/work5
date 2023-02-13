/**乘法 */
var multiplication = function (arg1, arg2) {
  var m = 0
  var s1 = arg1.toString()
  var s2 = arg2.toString()
  try {
    m += s1.split('.')[1].length
  } catch (e) {}
  try {
    m += s2.split('.')[1].length
  } catch (e) {}

  return (
    (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) /
    Math.pow(10, m)
  )
}

/**加法 */
var add = function (arg1, arg2) {
  var r1, r2, m, n
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2))
  n = r1 >= r2 ? r1 : r2
  return ((arg1 * m + arg2 * m) / m).toFixed(n)
}

/**减法 */
var sub = function (arg1, arg2) {
  var re1, re2, m, n
  try {
    re1 = arg1.toString().split('.')[1].length
  } catch (e) {
    re1 = 0
  }
  try {
    re2 = arg2.toString().split('.')[1].length
  } catch (e) {
    re2 = 0
  }
  m = Math.pow(10, Math.max(re1, re2))
  n = re1 >= re2 ? re1 : re2
  return ((arg1 * m - arg2 * m) / m).toFixed(n)
}

/**除法  参数:除数，被除数， 保留的小数点后的位数*/
var division = function (arg1, arg2, digit) {
  var t1 = 0,
    t2 = 0,
    r1,
    r2
  try {
    t1 = arg1.toString().split('.')[1].length
  } catch (e) {}
  try {
    t2 = arg2.toString().split('.')[1].length
  } catch (e) {}
  r1 = Number(arg1.toString().replace('.', ''))
  r2 = Number(arg2.toString().replace('.', ''))
  //获取小数点后的计算值
  var result = ((r1 / r2) * Math.pow(10, t2 - t1)).toString()
  var result2 = result.split('.')[1]
  result2 = result2.substring(
    0,
    digit > result2.length ? result2.length : digit
  )

  return Number(result.split('.')[0] + '.' + result2)
}

function mul(a, b) {
  var c = 0,
    d = a.toString(),
    e = b.toString()
  try {
    c += d.split('.')[1].length
  } catch (f) {}
  try {
    c += e.split('.')[1].length
  } catch (f) {}
  return (
    (Number(d.replace('.', '')) * Number(e.replace('.', ''))) / Math.pow(10, c)
  )
}

//返回值：a除以b的结果
var division2 = function (a, b) {
  var c,
    d,
    e = 0,
    f = 0
  try {
    e = a.toString().split('.')[1].length
  } catch (g) {}
  try {
    f = b.toString().split('.')[1].length
  } catch (g) {}
  return (
    (c = Number(a.toString().replace('.', ''))),
    (d = Number(b.toString().replace('.', ''))),
    mul(c / d, Math.pow(10, f - e))
  )
}

// var changeTwoDecimal = function (x) {
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
var changeTwoDecimal = function (num, decimal = 2) {
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
export default {
  multiplication,
  add,
  sub,
  division,
  division2,
  changeTwoDecimal,
}
