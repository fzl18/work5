export default {
  // 校对对象某个属性是否相等
  checkEqual: function (obj1, obj2, key) {
    if (obj1[key] == obj2[key]) {
      return true
    } else {
      return false
    }
  },
  // 格式化存储的图片组到最新格式
  formatGraphList: function (arr, extId) {
    arr.forEach((item) => {
      item.extId = extId
    })
    let graphTypeList = ['小', '中', '大', '3D']
    graphTypeList.forEach((gt, index) => {
      let isHas = arr.some((item) => item.graphType == gt)
      if (!isHas) {
        arr.splice(index, 0, {
          extId,
          graphType: gt,
          graphUrl: '',
        })
      }
    })
  },
  // 筛选出临时保存展示的图片
  formatTempGraphList(arr1, arr2, extId) {
    return arr2.map((a2) => {
      let temp
      if (Array.isArray(arr1)) {
        temp = arr1.find((a1) => a2.graphType == a1.graphType && a1.graphUrl)
      }
      if (temp) {
        return JSON.parse(JSON.stringify(temp))
      } else {
        return {
          extId,
          graphType: a2.graphType,
          graphUrl: a2.graphUrl,
        }
      }
    })
  },
  // 筛选出提交的图片
  formatSubmitGraphList(arr1, arr2) {
    let arr = []
    if (Array.isArray(arr1)) {
      arr2.forEach((a2) => {
        let temp = arr1.find(
          (a1) => a2.graphType == a1.graphType && a2.graphUrl != a1.graphUrl
        )
        if (temp) {
          arr.push(temp)
        }
      })
    }
    return arr
  },
  // 筛选出临时保存展示的属性列表
  formatTempAttrList(arr1, kind) {
    let tempAttrList
    if (
      kind.parent &&
      kind.parent.monitorAttrList &&
      Array.isArray(kind.parent.monitorAttrList) &&
      kind.parent.monitorAttrList.length > 0 &&
      kind.monitorAttrList &&
      Array.isArray(kind.monitorAttrList) &&
      kind.monitorAttrList.length > 0
    ) {
      let filterAttrList = kind.monitorAttrList.filter((item) => {
        return !kind.parent.monitorAttrList.some((pitem) => pitem.id == item.id)
      })
      tempAttrList = kind.parent.monitorAttrList.concat(filterAttrList)
    } else if (
      kind.parent &&
      kind.parent.monitorAttrList &&
      Array.isArray(kind.parent.monitorAttrList) &&
      kind.parent.monitorAttrList.length > 0
    ) {
      tempAttrList = kind.parent.monitorAttrList
    } else if (
      kind.monitorAttrList &&
      Array.isArray(kind.monitorAttrList) &&
      kind.monitorAttrList.length > 0
    ) {
      tempAttrList = kind.monitorAttrList
    } else {
      tempAttrList = []
    }
    return tempAttrList.map((a2) => {
      let obj = {
        id: a2.id,
        attrCode: a2.attrCode,
        attrName: a2.attrName,
        attrType: a2.attrType,
        attrUnit: a2.attrUnit,
        attrDesc: a2.attrDesc,
        attrConstraint: JSON.parse(a2.attrVal),
      }
      let temp
      if (Array.isArray(arr1)) {
        temp = arr1.find((a1) => a2.id == a1.id)
      }
      if (
        !temp ||
        temp.attrVal === '' ||
        temp.attrVal === null ||
        temp.attrVal === undefined
      ) {
        obj.attrVal = ''
      } else {
        obj.attrVal = temp.attrVal
      }
      return obj
    })
  },
  // 筛选出临时保存展示的组装结构属性列表
  formatTempStructureList(arr) {
    return arr.map((item) => {
      let structure = {}
      structure.structureName = item.kindName
      if (!Array.isArray(item.monitorAttrList)) {
        item.monitorAttrList = []
      }
      structure.columnList = item.monitorAttrList.map((structureAttr) => {
        return {
          id: structureAttr.id,
          prop: 'attr' + structureAttr.id,
          label: structureAttr.attrName,
          attrConstraint: JSON.parse(structureAttr.attrVal),
        }
      })
      structure.children = item.children.map((structureItem) => {
        let structureChild = {}
        structureChild.attrName = structureItem.kindName
        let graph, graph3D
        if (Array.isArray(structureItem.monitorGraphList)) {
          graph = structureItem.monitorGraphList.find(
            (graph) => graph.graphType == '小'
          )
          graph3D = structureItem.monitorGraphList.find(
            (graph) => graph.graphType == '3D'
          )
        }
        structureChild.graphUrl = graph && graph.graphUrl ? graph.graphUrl : ''
        structureChild.graphUrl3D =
          graph3D && graph3D.graphUrl ? graph3D.graphUrl : ''
        structure.columnList.forEach((column) => {
          let temp
          if (Array.isArray(structureItem.monitorAttrList)) {
            temp = structureItem.monitorAttrList.find(
              (structureItemAttr) => structureItemAttr.id == column.id
            )
          }
          if (temp && temp.attrDesc) {
            if (
              temp.attrVal === '' ||
              temp.attrVal === null ||
              temp.attrVal === undefined
            ) {
              structureChild[column.prop] = {
                id: temp.attrDesc,
                attrVal: '',
              }
            } else {
              structureChild[column.prop] = {
                id: temp.attrDesc,
                attrVal: temp.attrVal,
              }
            }
          } else {
            structureChild[column.prop] = {
              attrId: column.id,
              extInstanceId: structureItem.updateby,
              attrVal: '',
            }
          }
        })
        return structureChild
      })
      structure.columnList.unshift({
        id: 'graphUrl',
        prop: 'graphUrl',
        label: '部件图标',
      })
      structure.columnList.unshift({
        id: 'attrName',
        prop: 'attrName',
        label: '部件名称',
      })
      return structure
    })
  },
  //双三次插值法根据原数据及缩放比例获取新数据
  formatDataByScale(data, scaleX, scaleY) {
    //获取距离0~1的系数
    function getK01(value) {
      const s = Math.abs(value)
      return 1.5 * s * s * s - 2.5 * s * s + 1
    }

    //获取距离1~2的系数
    function getK12(value) {
      const s = Math.abs(value)
      return -0.5 * s * s * s + 2.5 * s * s - 4 * s + 2
    }

    //Y轴线性插值
    function getValueByLine(data, x, y, p_x, p_y) {
      let x0y0 = data[x][y].value
      let x0y1 = data[x][y + 1].value
      return (x0y1 - x0y0) * (p_y - y) + x0y0
    }

    //双线性插值
    function getValueByDoubleLine(data, x, y, p_x, p_y) {
      let x0y0 = data[x][y].value
      let x1y0 = data[x + 1][y].value
      let x0y1 = data[x][y + 1].value
      let x1y1 = data[x + 1][y + 1].value
      if (isNaN(x0y0) || isNaN(x1y0) || isNaN(x0y1) || isNaN(x1y1)) {
        return getValueByLine(data, x, y, p_x, p_y)
      } else {
        let a = (x1y0 - x0y0) * (p_x - x) + x0y0
        let b = (x1y1 - x0y1) * (p_x - x) + x0y1
        return (b - a) * (p_y - y) + a
      }
    }

    //双三次插值
    function getValueByDoubleTrinomial(data, x, y, p_x, p_y) {
      let value = 0
      //使用相关的16个点估算新值
      for (let p = x - 1; p <= x + 2; p++) {
        for (let q = y - 1; q <= y + 2; q++) {
          if (isNaN(data[p][q].value)) {
            // value = data[x][y].value
            value = getValueByDoubleLine(data, x, y, p_x, p_y)
            break
          }
          let k_x, k_y
          let m_x = Math.abs(p - p_x)
          let m_y = Math.abs(q - p_y)
          if (m_x < 1) {
            k_x = getK01(m_x)
          } else {
            k_x = getK12(m_x)
          }
          if (m_y < 1) {
            k_y = getK01(m_y)
          } else {
            k_y = getK12(m_y)
          }
          value += k_x * k_y * data[p][q].value
        }
      }
      return value
    }

    //判断数据格式合法
    if (
      !Array.isArray(data) ||
      !Array.isArray(data[0]) ||
      isNaN(scaleX) ||
      isNaN(scaleY)
    ) {
      return data
    }
    //计算缩放点列
    const countX = Math.floor((data.length - 1) * scaleX)
    const countY = Math.floor((data[0].length - 1) * scaleY)
    //判断原数组x轴长度
    // if (data.length > 1) {
    //创建处理后的数组
    let newArray = []
    for (let i = 0; i < countX; i++) {
      newArray.push([])
      //新数组坐标在原数组的x轴映射
      let i_o = Math.floor(i / scaleX)
      let i_t = i / scaleX
      //计算x轴坐标
      let x = (
        ((data.at(-1)[0].x - data.at(0)[0].x) / (data.length - 1)) * i_t +
        data.at(0)[0].x
      ).toFixed(1)
      for (let j = 0; j < countY; j++) {
        //新数组坐标在原数组的y轴映射
        let j_o = Math.floor(j / scaleY)
        let j_t = j / scaleY
        let value
        if (
          i_o <= 1 ||
          i_o > data.length - 3 ||
          j_o <= 1 ||
          j_o > data[i_o].length - 3
        ) {
          value = getValueByDoubleLine(data, i_o, j_o, i_t, j_t)
        } else {
          value = getValueByDoubleTrinomial(data, i_o, j_o, i_t, j_t)
        }
        newArray[i].push({
          x,
          value,
        })
      }
    }
    return newArray
    // } else {
    //   return data
    // }
  },
}
