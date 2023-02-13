export default []

// export const mockMenuData = {
//   group1: {
//     label: '设备',
//     list: [
//       {
//         label: '工业设备',
//         image: require('@/assets/images/icons/devices.png'),
//       },
//       {
//         label: '视频流设备',
//         image: require('@/assets/images/icons/media.png'),
//       },
//     ],
//   },
// }

const postData = {
  id: 1, //流程ID flowId
  title: '流程标题', //流程标题
  flowData: [
    {
      id: '36932827-95c7-443c-ae5f-28b15f970b5f', //组件内部id
      subId: 1, // 组件ID,subId
      subCode: 'ABC', //组件CODE,也就是节点类型的具体代码
      ruleId: 1, //rule Id
      name: null, //如果是edge类型，名称为null
      type: 'edge', //组件的类型，edge=边，其他=节点(节点有各种类型比如custom-device)
      metadata: {
        //前端流程引擎要用到的数据
        shape: 'edge', //组件的类型，edge=边，node=节点
        attrs: {
          //组件的样式
          line: {
            stroke: '#CDD5DB',
            strokeWidth: 1,
            targetMarker: {
              name: 'classic',
              width: 16,
              height: 10,
            },
          },
        },
        id: '36932827-95c7-443c-ae5f-28b15f970b5f',
        zIndex: 0,
        source: {
          //来源
          cell: 'img_1662429508482',
          port: 'img_1662429508482_port_right',
        },
        target: {
          //目标
          cell: 'img_1662429509322',
          port: 'img_1662429509322_port_left',
        },
      },
    },
    {
      id: 'img_1662429508482',
      subId: 1, // 组件ID,subId
      subCode: 'ABC', //组件CODE,也就是节点类型的具体代码
      ruleId: 1, //rule Id
      type: 'custom-image', //组件的类型，edge=边，其他=节点(节点有各种类型比如custom-device)
      name: '视频流设备', //流程组件的名称
      metadata: {
        position: {
          x: 60,
          y: 60,
        },
        size: {
          width: 68,
          height: 68,
        },
        attrs: {
          text: {
            text: '视频流设备',
          },
          body: {
            stroke: '#CED5DB',
            fill: '#FFFFFF',
            'fill-opacity': 1,
          },
          image: {
            href: '', // 图片相对路径
            refY2: -16,
          },
        },
        visible: true,
        shape: 'custom-image',
        id: 'img_1662429508482',
        ports: {
          groups: {
            left: {
              position: 'left',
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
                  stroke: '#448EE8',
                  strokeWidth: 1,
                  fill: '#fff',
                  style: {
                    visibility: 'hidden',
                  },
                },
              },
            },
            top: {
              position: 'top',
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
                  stroke: '#448EE8',
                  strokeWidth: 1,
                  fill: '#fff',
                  style: {
                    visibility: 'hidden',
                  },
                },
              },
            },
            bottom: {
              position: 'bottom',
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
                  stroke: '#448EE8',
                  strokeWidth: 1,
                  fill: '#fff',
                  style: {
                    visibility: 'hidden',
                  },
                },
              },
            },
            right: {
              position: 'right',
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
                  stroke: '#448EE8',
                  strokeWidth: 1,
                  fill: '#fff',
                  style: {
                    visibility: 'hidden',
                  },
                },
              },
            },
          },
          items: [
            {
              group: 'left',
              id: 'img_1662429508482_port_left',
            },
            {
              group: 'top',
              id: 'img_1662429508482_port_top',
            },
            {
              group: 'bottom',
              id: 'img_1662429508482_port_bottom',
            },
            {
              group: 'right',
              id: 'img_1662429508482_port_right',
            },
          ],
        },
        zIndex: 1,
      },
    },
    {
      id: 'img_1662429509322',
      type: 'custom-image',
      name: {
        text: '工业设备',
      },
      metadata: {
        position: {
          x: 300,
          y: 120,
        },
        size: {
          width: 68,
          height: 68,
        },
        attrs: {
          text: {
            text: '工业设备',
          },
          body: {
            stroke: '#CED5DB',
            fill: '#FFFFFF',
            'fill-opacity': 1,
          },
          image: {
            href: '', // 图片相对路径
            refY2: -16,
          },
        },
        visible: true,
        shape: 'custom-image',
        id: 'img_1662429509322',
        ports: {
          groups: {
            left: {
              position: 'left',
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
                  stroke: '#448EE8',
                  strokeWidth: 1,
                  fill: '#fff',
                  style: {
                    visibility: 'hidden',
                  },
                },
              },
            },
            top: {
              position: 'top',
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
                  stroke: '#448EE8',
                  strokeWidth: 1,
                  fill: '#fff',
                  style: {
                    visibility: 'hidden',
                  },
                },
              },
            },
            bottom: {
              position: 'bottom',
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
                  stroke: '#448EE8',
                  strokeWidth: 1,
                  fill: '#fff',
                  style: {
                    visibility: 'hidden',
                  },
                },
              },
            },
            right: {
              position: 'right',
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
                  stroke: '#448EE8',
                  strokeWidth: 1,
                  fill: '#fff',
                  style: {
                    visibility: 'hidden',
                  },
                },
              },
            },
          },
          items: [
            {
              group: 'left',
              id: 'img_1662429509322_port_left',
            },
            {
              group: 'top',
              id: 'img_1662429509322_port_top',
            },
            {
              group: 'bottom',
              id: 'img_1662429509322_port_bottom',
            },
            {
              group: 'right',
              id: 'img_1662429509322_port_right',
            },
          ],
        },
        zIndex: 2,
      },
    },
  ],
}

const flowData = {
  id: 'img_1662429508482',
  subId: 1, // 组件ID,subId
  subCode: 'ABC', //组件CODE,也就是节点类型的具体代码
  ruleId: 1, //rule Id
  type: 'custom-image', //组件的类型，edge=边，其他=节点(节点有各种类型比如custom-device)
  name: '视频流设备', //流程组件的名称
  metadata: {
    position: {
      x: 60,
      y: 60,
    },
    size: {
      width: 68,
      height: 68,
    },
    attrs: {
      text: {
        text: '视频流设备',
      },
      body: {
        stroke: '#CED5DB',
        fill: '#FFFFFF',
        'fill-opacity': 1,
      },
      image: {
        href: '', // 图片相对路径
        refY2: -16,
      },
    },
    visible: true,
    shape: 'custom-image',
    id: 'img_1662429508482',
    ports: {
      groups: {
        left: {
          position: 'left',
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
              stroke: '#448EE8',
              strokeWidth: 1,
              fill: '#fff',
              style: {
                visibility: 'hidden',
              },
            },
          },
        },
        top: {
          position: 'top',
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
              stroke: '#448EE8',
              strokeWidth: 1,
              fill: '#fff',
              style: {
                visibility: 'hidden',
              },
            },
          },
        },
        bottom: {
          position: 'bottom',
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
              stroke: '#448EE8',
              strokeWidth: 1,
              fill: '#fff',
              style: {
                visibility: 'hidden',
              },
            },
          },
        },
        right: {
          position: 'right',
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
              stroke: '#448EE8',
              strokeWidth: 1,
              fill: '#fff',
              style: {
                visibility: 'hidden',
              },
            },
          },
        },
      },
      items: [
        {
          group: 'left',
          id: 'img_1662429508482_port_left',
        },
        {
          group: 'top',
          id: 'img_1662429508482_port_top',
        },
        {
          group: 'bottom',
          id: 'img_1662429508482_port_bottom',
        },
        {
          group: 'right',
          id: 'img_1662429508482_port_right',
        },
      ],
    },
    zIndex: 1,
  },
}
