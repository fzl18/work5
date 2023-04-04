import { Shape } from '@antv/x6'
import { Message } from 'element-ui'

let flowMessageBoxTimer = null

export const defaultColorConfig = {
  //画布
  grid: {
    color: '#fefefe',
  },
  //连接线
  line: {
    color: '#CDD5DB',
  },
  //连接线箭头
  marker: {
    color: '#CDD5DB',
  },
  //链接桩
  port: {
    strokeWidth: 1,
    color: '#448EE8',
    fillColor: '#fff',
    highlighting: {
      color: '#448EE8',
    },
  },
  //菜单面板颜色管理
  menu: {
    node: {
      fillColor: '#ECECEC',
      fillOpacity: 1,
      strokeColor: '#ECECEC',
      labelColor: '#6F7579',
    },
    nodeActived: {
      fillColor: '#448EE8',
      fillOpacity: 0.1,
      strokeColor: '#448EE8',
      labelColor: '#6F7579',
    },
  },
  //流程面板颜色管理
  flow: {
    node: {
      fillColor: '#FFFFFF',
      fillOpacity: 1,
      strokeColor: '#CED5DB',
      labelColor: '#6F7579',
    },
    nodeActived: {
      fillColor: '#448EE8',
      fillOpacity: 0.1,
      strokeColor: '#448EE8',
      labelColor: '#6F7579',
    },
  },
}

// 画布的全局默认设置
export default {
  background: {
    color: defaultColorConfig.grid.color, // 设置画布背景颜色
  },
  grid: {
    size: 20, // 网格大小 10px
    visible: true, // 渲染网格背景
  },
  history: true, //撤销/重做，默认禁用。创建画布时，通过以下配置开启画布撤销/重做能力。 参考：https://x6.antv.vision/zh/docs/api/graph/history
  autoResize: true, //是否监听容器大小改变，并自动更新画布大小，默认为 false。默认监听画布容器，也可以指定监听的元素，如 Document。
  connecting: {
    allowBlank: false,
    allowMulti: true,
    allowLoop: false,
    allowNode: false,
    allowEdge: false,
    allowPort: true,
    router: {
      name: 'manhattan', //路由的种类，参考：https://x6.antv.vision/zh/docs/api/registry/router#orth
      args: {
        step: 20, //路由算法步进步长，其值越小计算量越大。推荐使用画布的网格大小
        // startDirections: ['bottom', 'right'], //	['top', 'right', 'bottom', 'left']	支持从哪些方向开始路由。
        // endDirections: ['top', 'left'], //	['top', 'right', 'bottom', 'left']		支持从哪些方向结束路由。
      },
    },
    snap: {
      //自动吸附,该值影响链接桩吸附范围,如果遇见链接桩连不上,修改该值
      radius: 20,
    },
    connector: {
      //连接线配置
      args: {
        stroke: defaultColorConfig.line.color,
        strokeWidth: 1,
        padding: 0,
      },
    },
    createEdge() {
      //
      return new Shape.Edge({
        attrs: {
          line: {
            stroke: defaultColorConfig.marker.color,
            strokeWidth: 1,
            targetMarker: {
              name: 'classic',
              width: 16,
              height: 10,
            },
          },
        },
        zIndex: 0,
      })
    },
    validateConnection({
      edge,
      edgeView,
      sourceView,
      targetView,
      sourcePort,
      targetPort,
      sourceMagnet,
      targetMagnet,
      sourceCell,
      targetCell,
      type,
    }) {
      // console.log('edge', edge)

      // console.log('sourceCell', sourceCell)
      // console.log('targetCell', targetCell)
      // let flag = true
      // let message = ''
      // 禁止链接自己
      try {
        if (sourceCell.id === targetCell.id) {
          return false
        }
        // 设备组件有一个或者多个输出、没有输入
        if (targetCell.data.type === 'devices') {
          throw '设备不能作为接入组件'
        }

        //设备的输入只能是平台,或者无输入
        if (
          targetCell.data.type === 'output' &&
          targetCell.data.code === 'outputDevicesHard' &&
          sourceCell.data.type !== 'platform'
        ) {
          throw '输出设备只能作为平台的输出'
        }

        // 平台的输出只能是设备
        if (
          targetCell.data.code !== 'outputDevicesHard' &&
          sourceCell.data.type === 'platform'
        ) {
          throw '平台的输出只能是输出设备'
        }

        // 平台只能作为输出组件
        if (targetCell.data.type === 'platform') {
          throw '平台不能成为其他组件的输出'
        }

        // 输出组件有一个或者多个输入、不能输出
        if (sourceCell.data.type === 'output') {
          throw '输出组件不能再输出'
        }

        // 事件组件有一个输入，没有输出
        if (sourceCell.data.type === 'event') {
          throw '事件组件不能再输出'
        }

        // 两个设备、输出、事件组件之间不能互相连接
        if (
          ['devices', 'output', 'event'].indexOf(sourceCell.data.type) >= 0 &&
          sourceCell.data.type === targetCell.data.type
        ) {
          throw '两个设备、输出、事件组件之间不能互相连接'
        }

        // 视频流设备只能连接视频流输出和使用时间段选择控件
        if (sourceCell.data.code === 'devicesVideo') {
          if (['outputVideoSteam'].indexOf(targetCell.data.code) === -1) {
            throw '视频流设备只能连接视频流输出组件'
          }
        }

        // 禁止重复链接

        const sourceEdges = this.getConnectedEdges(sourceCell, {
          outgoing: true,
        })
        // console.log(sourceEdges.filter((t) => t.target.cell === targetCell.id))
        if (
          sourceEdges.filter((t) => t.target.cell === targetCell.id).length > 0
        ) {
          throw '禁止重复链接'
        }
        // 不允许循环结构：即a组件输出接了b组件的输入，b组件的输出再接a组件的输入

        const targetEdges = this.getConnectedEdges(targetCell, {
          deep: true,
          outgoing: true,
        })

        if (targetEdges.length) {
          for (let i = 0; i < targetEdges.length; i++) {
            const _edge = targetEdges[i]
            if (sourceCell.id == _edge.target.cell) {
              throw '不允许循环结构'
            }
          }
        }

        //  如果目标不能被连接
        if (!targetMagnet) {
          return false
        }
        return true
      } catch (error) {
        if (flowMessageBoxTimer) {
          clearTimeout(flowMessageBoxTimer)
          flowMessageBoxTimer = null
        }

        flowMessageBoxTimer = setTimeout(() => {
          Message.closeAll()
          Message({
            type: 'error',
            message: error,
          })
          return false
        }, 200)
      }
    },
  },
  scroller: {
    // 滚动画布
    enabled: true,

    pageVisible: false,
    pageBreak: false, // 是否显示分页符，默认为 false
    pannable: true,
  },
  mousewheel: {
    enabled: true,
    modifiers: ['ctrl', 'meta'],
    minScale: 0.5,
    maxScale: 2,
  },
  selecting: {
    // 点选/框选，默认禁用。创建画布时，通过以下配置开启选择交互，开启后可以通过点击或者套索框选节点。
    enabled: false,
    modifiers: 'ctrl',
    rubberband: true, // 启用框选
    rubberEdge: true,
    className: 'flow-selecting', //选择器的样式
    showNodeSelectionBox: true, //节点被选中之后的包围框
    filter: ['vue-shape'],
  },
  highlighting: {
    // 当链接桩可以被链接时，在链接桩外围渲染一个 2px 宽的矩形框
    default: {
      name: 'stroke',
      args: {
        padding: 4,
        attrs: {
          'stroke-width': defaultColorConfig.port.highlighting.strokeWidth,
          stroke: defaultColorConfig.port.highlighting.color,
        },
      },
    },
  },
}

/***
 * @description 菜单中节点的样式
 ***/
export const imageNodeSideConfig = {
  inherit: 'rect',
  width: 80,
  height: 102,

  markup: [
    {
      tagName: 'rect',
      selector: 'border',
    },
    {
      tagName: 'rect',
      selector: 'body',
    },
    {
      tagName: 'image',
    },
    {
      tagName: 'text',
      selector: 'label',
    },
  ],
  attrs: {
    border: {
      width: 35,
      height: 35,
      refX: 0.5, //设置元素 x 坐标，目标 x 坐标相对于 ref 指代的参照元素的左上角 x 坐标（参照 x 坐标）
      refX2: -16, //参考 https://x6.antv.vision/zh/docs/api/registry/attr/#refx
      refY: 32,
      stroke: 'red',
      fill: defaultColorConfig.menu.node.fillColor,
    },
    body: {
      rx: 4,
      ry: 4,
      stroke: defaultColorConfig.menu.node.strokeColor,
      fill: defaultColorConfig.menu.node.fillColor,
    },
    image: {
      width: 35,
      height: 35,
      refX: 0.5, //设置元素 x 坐标，目标 x 坐标相对于 ref 指代的参照元素的左上角 x 坐标（参照 x 坐标）
      refX2: -16, //参考 https://x6.antv.vision/zh/docs/api/registry/attr/#refx
      refY: 22,
    },
    label: {
      x: 0,
      refY: 78,
      fontSize: 12,
      fill: defaultColorConfig.menu.node.labelColor,
    },
  },
}

/***
 * @description 图片节点的尺寸
 ***/
export const imgageNodeFlowSize = 88

// //流程图中的节点图形样式
// export const imageNodeFlowAttrConfig = {
//   border: {
//     width: 68,
//     height: 68,
//     stroke: 'red',
//     refX: 0,
//     refX2: 10,
//     refY: 0,
//     refY2: 10,
//     rx: 4,
//     ry: 4,
//     stroke: defaultColorConfig.flow.node.strokeColor,
//     fill: defaultColorConfig.flow.node.fillColor,
//   },
//   body: {
//     stroke: 'transparent',
//     fill: 'transparent',
//   },
//   image: {
//     width: 34,
//     height: 34,
//     refX: '50%', //设置元素 x 坐标，目标 x 坐标相对于 ref 指代的参照元素的左上角 x 坐标（参照 x 坐标）
//     refX2: -18, //参考 https://x6.antv.vision/zh/docs/api/registry/attr/#refx
//     refY: '50%',
//     refY2: -18,
//   },
//   label: {
//     x: 0,
//     refY: 96,
//     fontSize: 14,
//     fill: defaultColorConfig.flow.node.labelColor,
//   },
// }
// //流程图中节点图形激活
// export const imageNodeFlowAttrConfigActived = {
//   border: {
//     width: 68,
//     height: 68,
//     stroke: 'red',
//     refX: 0,
//     refX2: 10,
//     refY: 0,
//     refY2: 10,
//     rx: 4,
//     ry: 4,
//     stroke: defaultColorConfig.flow.nodeActived.strokeColor,
//     fill: defaultColorConfig.flow.node.fillColor,
//   },
//   body: {
//     stroke: 'transparent',
//     fill: 'transparent',
//   },
//   image: {
//     width: 34,
//     height: 34,
//     refX: '50%', //设置元素 x 坐标，目标 x 坐标相对于 ref 指代的参照元素的左上角 x 坐标（参照 x 坐标）
//     refX2: -18, //参考 https://x6.antv.vision/zh/docs/api/registry/attr/#refx
//     refY: '50%',
//     refY2: -18,
//   },
//   label: {
//     x: 0,
//     refY: 96,
//     fontSize: 14,
//     fill: defaultColorConfig.flow.node.labelColor,
//   },
// }

//自定义组件节点的svg样式
export const flowComponentNodeAttrConfig = {
  borderBox: {
    width: 68,
    height: 68,
    refX: 0.5, //设置元素 x 坐标，目标 x 坐标相对于 ref 指代的参照元素的左上角 x 坐标（参照 x 坐标）
    refX2: -34,
    refY: 10,
    rx: 4,
    ry: 4,
    stroke: defaultColorConfig.flow.node.strokeColor,
    strokeWidth: 2,
    fill: 'transparent',
  },
  foreignObject: {
    refX: 0.5, //设置元素 x 坐标，目标 x 坐标相对于 ref 指代的参照元素的左上角 x 坐标（参照 x 坐标）
    refX2: -32,
    refY: 12,
  },
  label: {
    x: 0,
    refY: 96,
    fontSize: 14,
    fill: defaultColorConfig.flow.node.labelColor,
  },
}
//自定义组件节点的svg样式(选中后)
export const flowComponentNodeAttrConfigActived = {
  borderBox: {
    width: 68,
    height: 68,
    refX: 0.5, //设置元素 x 坐标，目标 x 坐标相对于 ref 指代的参照元素的左上角 x 坐标（参照 x 坐标）
    refX2: -34,
    refY: 10,
    rx: 4,
    ry: 4,
    stroke: defaultColorConfig.flow.nodeActived.strokeColor,
    strokeWidth: 2,
    fill: 'transparent',
  },
  foreignObject: {
    refX: 0.5, //设置元素 x 坐标，目标 x 坐标相对于 ref 指代的参照元素的左上角 x 坐标（参照 x 坐标）
    refX2: -32,
    refY: 12,
  },
  label: {
    x: 0,
    refY: 96,
    fontSize: 14,
    fill: defaultColorConfig.flow.node.labelColor,
  },
}

export const portConfig = {
  markup: [
    {
      tagName: 'rect',
      selector: 'rect',
    },
  ],
  attrs: {
    rect: {
      width: 8,
      height: 8,
      x: -4,
      y: -4,
      magnet: true,
      stroke: defaultColorConfig.port.color,
      strokeWidth: defaultColorConfig.port.strokeWidth,
      fill: defaultColorConfig.port.fillColor,
      // style: {
      //   visibility: 'hidden',
      // },
    },
  },
  // zIndex: 100,
}

export const portPositionConfig = {
  top: {
    dx: 0,
    dy: 10,
  },
  left: {
    dx: 10,
    dy: 0,
  },
  right: {
    dx: -10,
    dy: 0,
  },
  bottom: {
    dx: 0,
    dy: -10,
  },
}

export const menuGroupsConfig = [
  {
    title: '设备',
    name: 'devices',
    collapsable: true,
    collapsed: true,
    graphHeight: 136,
    graphPadding: 20,
  },
  {
    title: '转换',
    name: 'translate',
    collapsable: true,
    collapsed: true,
    graphHeight: 136,
    graphPadding: 20,
  },
  {
    title: '输出',
    name: 'output',
    collapsable: true,
    collapsed: true,
    graphHeight: 247,
    graphPadding: 20,
  },
  {
    title: '事件',
    name: 'event',
    collapsable: true,
    collapsed: true,
    graphHeight: 136,
    graphPadding: 20,
  },
  {
    title: '计算',
    name: 'compute',
    collapsable: true,
    collapsed: true,
    graphHeight: 136,
    graphPadding: 20,
  },
  {
    title: '平台',
    name: 'platform',
    collapsable: true,
    collapsed: true,
    graphHeight: 136,
    graphPadding: 20,
  },
]

export const menuConfig = {
  devices: [
    {
      title: '设备绑定',
      label: '工业设备',
      image: require('@/assets/images/icons/devices_hard.png'),
      type: 'devices',
      code: 'devicesHard',
    },
    {
      title: '设备绑定',
      label: '视频流设备',
      image: require('@/assets/images/icons/devices_video.png'),
      type: 'devices',
      code: 'devicesVideo',
    },
  ],

  translate: [
    {
      title: '数据过滤',
      label: '数据过滤',
      image: require('@/assets/images/icons/translate_filter.png'),
      type: 'translate',
      code: 'translateFilter',
    },
    {
      title: '阈值设定',
      label: '阈值设定',
      image: require('@/assets/images/icons/translate_threshold.png'),
      type: 'translate',
      code: 'translateThreshold',
    },
  ],

  output: [
    {
      title: 'MQTT',
      label: 'MQTT',
      image: require('@/assets/images/icons/output_mqtt.png'),
      type: 'output',
      code: 'outputMqtt',
    },
    {
      title: 'HTTP(S)',
      label: 'HTTP(S)',
      image: require('@/assets/images/icons/output_http.png'),
      type: 'output',
      code: 'outputHttp',
    },
    {
      title: '视频流转换',
      label: '视频流',
      image: require('@/assets/images/icons/output_video_steam.png'),
      type: 'output',
      code: 'outputVideoSteam',
    },
    {
      title: '设备绑定',
      label: '输出设备',
      image: require('@/assets/images/icons/devices_hard.png'),
      type: 'output',
      code: 'outputDevicesHard', //INDUSTRY_OUT_DEVICE_BINDING
    },
  ],

  event: [
    {
      title: '平台报警',
      label: '平台报警',
      image: require('@/assets/images/icons/event_warning.png'),
      type: 'event',
      code: 'eventWarning',
    },
    {
      title: '内网邮件发送',
      label: '内网邮件发送',
      image: require('@/assets/images/icons/event_email.png'),
      type: 'event',
      code: 'eventEmail',
    },
  ],

  compute: [
    {
      title: '算数运算',
      label: '算数运算',
      image: require('@/assets/images/icons/compute_math.png'),
      type: 'compute',
      code: 'computeMath',
    },
  ],

  platform: [
    {
      title: 'IOT',
      label: 'IOT',
      image: require('@/assets/images/icons/platform_iot.png'),
      type: 'platform',
      code: 'platformIot',
    },
  ],
}
