import { getTypes } from '@/api/dictionary'

/**
 * @description 传入typeName,直接返回map加工过的数据
 */
export default async (typeName) => {
  const result = await getTypes(typeName)
  if (result.code === 200 && result.data && result.data.length) {
    return result.data.map((t) => {
      return { ...t, label: t.numberName, value: t.numberValue }
    })
  } else {
    return []
  }
}

export const getTypeLabelbyValue = (types, typeValue) => {
  const result = [...types].filter((t) => t.value === typeValue)
  return result && result.length ? result[0].label : null
}

/**
 * 枚举表
 */
export const TypeName = {
  /**
   * @description 协议类型
   */
  ARGEE: 'argee',
  /**
   * @description 通讯类型
   */
  DISPATCHTYPE: 'dispatchType', //通讯类型
  /**
   * @description 通讯方法
   */
  DISPATCHMETHOD: 'dispatchMethod', //通讯方法
  /**
   * @description 字节
   */
  BYTECOUNT: 'byteCount', //字节
  /**
   * @description 字序
   */
  BYTESORT: 'byteSort', //字序
  /**
   * @description 数据类型
   */
  DATATYPE: 'dataType', //数据类型
  /**
   * @description 读写类型
   */
  READTYPE: 'readType', //读写类型
  /**
   * @description 加密类型
   */
  AUTHTYPES: 'authType',
  /**
   * @description method
   */
  METHODTYPE: 'methodType',
  /**
   * @description 视频源类型
   */
  VIEWTYPE: 'viewType',
  /**
   * @description 效验位
   */
  CHECKTYPE: 'checkType',
  /**
   * @description 波特率
   */
  BPSTYPE: 'BPSType',
  /**
   * @description 数据位
   */
  BYTESIZE: 'bytesize',
  /**
   * @description 停止位
   */
  STOPBITS: 'stopbits',
  /**
   * @description 报警等级
   */
  WARNTYPE: 'warnType',
  /**
   * @description 安全等级
   */
  SAFETYPE: 'safeType',

  /**
   * @description 数学运算操作符
   */
  OPERATORTYPE: 'operatorType',
  /**
   * @description 日志等级
   */
  LEVELTYPE: 'levelType',
}

Object.freeze(TypeName)
