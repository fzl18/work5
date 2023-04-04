import { Graph } from '@antv/x6'
import {
  imgageNodeFlowSize,
  imageNodeSideConfig,
  flowComponentNodeAttrConfig,
  menuConfig,
  portConfig,
  portPositionConfig,
} from './flowConfig'
import _cloneDeep from 'lodash/cloneDeep'
import _find from 'lodash/find'

const menuImageList = {}
for (let key in menuConfig) {
  const menu = menuConfig[key]
  menu.forEach((item) => {
    menuImageList[item.code] = item.image
  })
}

// export const drawFlowData = (graph, data) => {
//   console.log('drawFlowData', graph, data)
//   const cells = []

//   // data.forEach(item=>{
//   //   if(item.)
//   // })
//   // graph.clear()
//   graph.addCells(cells)
// }

/**
 * 格式化数据为X6支持的格式
 * @param {Object[]} data
 * @returns {{nodes:[],edges:[]}}
 */
export const formatFlowData = (data, groups) => {
  const cells = []

  data.forEach((t) => {
    if (!!t.metadata) {
      const cell =
        Object.prototype.toString.call(t.metadata) === '[object String]'
          ? JSON.parse(t.metadata)
          : _cloneDeep(t.metadata)

      if (!!cell) {
        //重新添加被删除的样式属性
        if (cell.shape === 'edge') {
          cell.id = cell.id ? cell.id : getUUID()
        } else if (cell.shape !== 'edge') {
          cell.shape = 'flow-component'
          cell.ports.groups = groups
          cell.width = imgageNodeFlowSize
          cell.height = imgageNodeFlowSize
          cell.attrs = Object.assign(
            {},
            { ...cell.attrs },
            { ...flowComponentNodeAttrConfig }
          )
          cell.data.image = menuImageList[cell.data.code]
        }
      }
      cells.push({
        ...cell,
      })
    }
  })

  return cells
}

/**
 * 格式化导出的数据,删除样式相关的属性,被删除的样式属性,会在导入时重新添加
 * @param {*} json
 * @returns
 */
export const formatExportData = (json) => {
  if (!json.cells || json.cells.length === 0) {
    return []
  }
  const result = []
  const cells = json.cells.map((cell) => {
    const res = {
      id: cell.id, // String，节点的唯一标识
    }

    if (cell.shape === 'edge') {
      res.id = 0
      res.code = 'EDGE'
      res.source = cell.source.cell
      res.target = cell.target.cell
    } else if (cell.shape === 'flow-component') {
      res.code = cell.data.subCode
    }

    const metadata = _cloneDeep(cell)

    // ! 由于ports.group和attrs.image属于过于庞大重复,从元数据中删除,在导入数据时,需从系统设置中抽取

    if (metadata.shape === 'flow-component') {
      delete metadata.ports.groups
      delete metadata.attrs.body
      delete metadata.attrs.border
      delete metadata.attrs.image
      delete metadata.attrs.borderBox
      delete metadata.attrs.foreignObject
      delete metadata.data.image
      delete metadata.markup
      delete metadata.component
    }

    res.metadata = _cloneDeep(metadata)

    return res
  })

  cells.forEach((item) => {
    if (item.shape !== 'vue-shape') {
      result.push(item)
    }
  })
  return result
}

/**
 * 创建链接桩分组
 * @param {} params
 * @returns
 */
export const createPortGroup = (position = [], options) => {
  if (!position || !position.length) throw 'position can not be []!'
  const groups = {}

  position.forEach((pos) => {
    groups[pos] = {
      position: {
        name: pos,
        args: { ...portPositionConfig[pos] },
      },
      ...Object.assign({}, portConfig, options),
    }
  })
  return groups
}

/**
 * 添加链接桩
 * @param {*} nodeId
 * @param {*} group
 * @returns
 */
export const createPorts = (nodeId, group) => {
  // console.log(nodeId, group)
  if (!nodeId) throw 'nodeId can not be null!'
  if (!group) throw 'group can not be null!'

  const items = []
  for (let groupName in group) {
    items.push({
      group: groupName,
      id: `${nodeId}_${groupName}`,
    })
  }

  return items
}

/**
 * 注册自定义的图片node节点
 * @param {} name
 * @param {*} ports
 */
export const registerImageNode = (name, ports) => {
  Graph.registerNode(
    name,
    {
      ...imageNodeSideConfig,
      // ports: { ...ports },
    },
    true
  )
}

/**
 * 控制连接桩显示/隐藏
 *  */
export const showPorts = (ports, show) => {
  for (let i = 0, len = ports.length; i < len; i = i + 1) {
    ports[i].style.visibility = show ? 'visible' : 'hidden'
  }
}

/**
 * 控制节点颜色
 * @param {*} node
 * @param {*} param1
 */
export const nodeChangeColor = (node, config) => {
  node.attr({
    ...config,
  })
}

export const getUUID = () => {
  return new Date().valueOf()
}
