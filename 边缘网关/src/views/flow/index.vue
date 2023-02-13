<template>
  <div class="app-container">
    <bt-page
      v-loading="flowLoading"
      :title="$route.meta.title"
      :show-drawer="false"
    >
      <template #option>
        <el-button v-if="!readonly" type="primary" @click="doFinishSave">
          保存流程
        </el-button>
        <el-button v-else type="primary" @click="$router.go(-1)">
          返回
        </el-button>
        <!-- <el-button type="primary" @click="importData">导入数据</el-button>
        <el-button type="primary" @click="exportData">导出数据</el-button> -->
      </template>
      <el-alert
        v-if="readonly"
        title="已启动的流程不可编辑，如需编辑请先禁用流程"
        type="warning"
        effect="dark"
      />
      <div class="main-container">
        <div v-show="!readonly" id="SideMenuContainer" class="side-menu"></div>
        <div class="flow-container">
          <div id="FlowContainer" style="flex: 1"></div>
          <right-panel
            v-model="rightPanel.isShow"
            :title="rightPanel.title"
            :readonly="readonly"
            :loading="rightPanel.loading"
            @submit="rightPanelSubmit"
            @cancel="rightPanelCancel"
            @close="rightPanelClose"
          >
            <components
              :is="rightPanel.componentCode"
              ref="rightPanelComponent"
              :current-node="rightPanel.currentNode"
              :readonly="readonly"
              :loading="rightPanel.loading"
              @close="rightPanel.isShow = false"
              @updateNodeName="updateNodeName"
              @loading="updateRightPanelLoading"
              @success="saveFlowData"
            ></components>
          </right-panel>
        </div>
      </div>
    </bt-page>
  </div>
</template>
<script>
  import { Graph, Addon, View } from '@antv/x6'
  import '@antv/x6-vue-shape'
  import {
    formatFlowData,
    formatExportData,
    registerImageNode,
    createPorts,
    showPorts,
    nodeChangeColor,
    getUUID,
    createPortGroup,
  } from './util/flowHelper'
  import flowData from './mockData/flowData'
  import flowConfig, {
    imgageNodeFlowSize,
    imageNodeFlowAttrConfig,
    imageNodeFlowAttrConfigActived,
    defaultColorConfig,
    menuGroupsConfig,
    menuConfig,
  } from './util/flowConfig'
  import contextMenu from './components/contextMenu'
  import _cloneDeep from 'lodash/cloneDeep'

  import RightPanel from './components/rightPanel/rightPanel.vue'
  import DevicesHard from './components/rightPanel/devicesHard.vue'
  import DevicesVideo from './components/rightPanel/devicesVideo.vue'
  import TranslateFilter from './components/rightPanel/translateFilter.vue'
  import TranslateThreshold from './components/rightPanel/translateThreshold.vue'
  import OutputMqtt from './components/rightPanel/outputMqtt.vue'
  import OutputHttp from './components/rightPanel/outputHttp.vue'
  import OutputVideoSteam from './components/rightPanel/outputVideoSteam.vue'
  import EventEmail from './components/rightPanel/eventEmail.vue'
  import EventWarning from './components/rightPanel/eventWarning.vue'
  import ComputeMath from './components/rightPanel/computeMath.vue'
  import {
    createNode,
    updateFlowData,
    getFlowDataById,
    getFlowInfoById,
  } from '@/api/flow'
  import {
    FlowComponentTypes,
    transformFlowComponentTypes,
  } from './util/flowComponentMapping'

  import { uploadImageFromBase64, updateFlowImage } from '@/api/image'
  import _debounce from 'lodash/debounce'

  let flowTimer = null
  let saveTimer = null

  export default {
    name: 'FlowIndex',
    components: {
      RightPanel,
      DevicesHard,
      DevicesVideo,
      TranslateFilter,
      TranslateThreshold,
      OutputMqtt,
      OutputHttp,
      OutputVideoSteam,
      EventEmail,
      EventWarning,
      ComputeMath,
    },
    beforeRouteLeave(to, from, next) {
      if (flowTimer) {
        clearTimeout(flowTimer)
        flowTimer = null
      }

      if (saveTimer) {
        clearTimeout(saveTimer)
        saveTimer = null
      }
      this.flowLoading = true
      this.graph && this.graph.dispose()
      next()
    },
    data() {
      return {
        flowId: null,
        flowInfo: null,
        isRun: 1,
        flowData: null,
        graph: null,
        registed: false,
        normalPortGroup: null,
        timer: null,
        oldClickTime: null,
        timeStep: 200,
        rightMenu: null,
        rightPanel: {
          isShow: false,
          componentCode: null,
          currentNode: null,
          currentNodeId: null,
          loading: false,
        },
        flowLoading: false,
      }
    },
    computed: {
      readonly: function () {
        return this.isRun == 0
      },
    },
    created() {
      this.flowId = this.$route.params.id
      this.normalPortGroup = createPortGroup(['left', 'top', 'bottom', 'right'])
    },
    async mounted() {
      await this.getFlowInfo()
      this.getData()
    },
    methods: {
      async getFlowInfo() {
        const result = await getFlowInfoById(this.flowId)

        // console.log(result)
        this.flowInfo = result.data
        this.isRun = result.data.isRun
        return result
      },
      updateRightPanelLoading(loading) {
        this.rightPanel.loading = loading
      },
      getData: _debounce(async function () {
        if (this.flowLoading) {
          return false
        }
        console.log('getData')
        this.flowLoading = true
        if (!this.flowInfo) {
          await this.getFlowInfo()
        }
        const result = await getFlowDataById(this.flowId)
        const data = formatFlowData(result.data, this.normalPortGroup)
        this.initFlow()

        this.initSideMenu()

        this.drawFromData(data)
        this.$nextTick(() => {
          this.flowLoading = false
        })
      }, 1000),
      updateNodeName({ node, name }) {
        const currentNode = this.graph.getCellById(
          this.rightPanel.currentNode.id
        )
        console.log(currentNode)
        currentNode.setAttrs({
          text: {
            text: name,
          },
        })
        // this.graph.fin
      },
      rightPanelClose() {
        this.rightPanel.componentCode = null
        this.rightPanel.currentNode = null
      },
      rightPanelSubmit() {
        this.$refs['rightPanelComponent'].submit()
      },
      rightPanelCancel() {
        this.$refs['rightPanelComponent'].cancel()
      },
      // importData() {
      //   this.flowLoading = true
      //   const flowData = window.localStorage.getItem('flowData')
      //   if (!flowData) {
      //     throw 'flowData is null!'
      //   }
      //   const data = formatFlowData(JSON.parse(flowData))
      //   this.drawFromData(data)
      //   this.flowLoading = false
      // },
      drawFromData(data) {
        data && this.graph.fromJSON(data) //传入数据

        this.graph.centerContent()
        this.flowData = this.graph.toJSON()
      },
      // exportData() {
      //   const json = formatExportData(this.graph.toJSON())
      //   console.log(json)

      //   window.localStorage.setItem('flowData', JSON.stringify(json))
      // },

      initFlow() {
        //初始化画布，设置宽高

        const containerId = 'FlowContainer'

        let baseConfig = {
          container: document.getElementById(containerId),
        }

        if (this.readonly) {
          baseConfig = {
            ...baseConfig,
            selecting: false,
            history: false,
            interacting: {
              nodeMovable: false,
              magnetConnectable: false,
              edgeMovable: false,
              arrowheadMovable: false,
            },
            allowRubberband: () => false,
          }
        }

        const config = Object.assign({}, flowConfig, baseConfig)
        const graph = new Graph(config)

        graph.center()
        this.registerEvent(containerId, graph)

        this.graph = graph

        return graph
      },
      /**
       * 注册左侧菜单
       * todo 1.获取group数据
       * todo 2.注册图片node
       */
      initSideMenu() {
        const that = this
        // #region 初始化 stencil
        const stencil = new Addon.Stencil({
          title: null,
          target: this.graph,
          stencilGraphWidth: 244,
          stencilGraphHeight: 268,
          stencilGraphPadding: 50,
          collapsable: false,
          groups: _cloneDeep(menuGroupsConfig),
          layoutOptions: {
            columns: 2,
            columnWidth: 'auto',
            rowHeight: 'auto',
          },
          // getDragNode(node) {
          //   // 返回一个新的节点作为实际放置到画布上的节点
          // },
          // getDropNode(node) {
          //   const cloneNode = node.clone()

          //   // console.log(cloneNode.toJSON())
          //   return that.graph.createNode({
          //     ...cloneNode.toJSON(),
          //   })
          // },
          async validateNode(node) {
            console.log('validateNode', node)
            const { data } = await createNode({
              subCode: FlowComponentTypes[node.data.code],
              name: node.attrs.text.text,
              flowGroupId: that.$route.params.id,
            })
            if (data) {
              const nodeId = data
              const newNode = that.graph.updateCellId(node, nodeId)
              const ports = createPorts(`${nodeId}`, that.normalPortGroup)
              newNode
                .size(imgageNodeFlowSize, imgageNodeFlowSize)
                .attr({ ...imageNodeFlowAttrConfig })
              newNode.addPorts(ports)
              newNode.setData({
                id: nodeId,
                subCode: FlowComponentTypes[node.data.code],
              })
            }

            return false
          },
        })

        document
          .getElementById('SideMenuContainer')
          .appendChild(stencil.container)
        // #endregion

        registerImageNode('custom-image')

        const imageShapes = _cloneDeep(menuConfig)
        for (let key in imageShapes) {
          const list = imageShapes[key]

          const imageNodes = list.map((item, index) => {
            return this.graph.createNode({
              shape: 'custom-image',
              label: item.label,
              ports: { groups: that.normalPortGroup },
              attrs: {
                image: {
                  href: item.image,
                },
              },
              data: {
                type: item.type,
                code: item.code,
                title: item.title,
              },
              // ports: { ...ports },
            })
          })

          stencil.load(imageNodes, key)
        }

        return stencil
      },
      /**
       * 页面中插入右键菜单事件
       * @param {*} id
       * @param {*} pos
       */
      initContextMenu(id, pos, cellData, cellType) {
        console.log(id, pos, cellData, cellType)
        this.rightMenu = this.graph.addNode({
          id: 'right-context-menu',
          x: pos ? pos.x : -10000,
          y: pos ? pos.y : -10000,
          width: 84,
          height: 40,
          name: 'right-context-menu',
          shape: 'vue-shape',
          component: 'contextmenu',
          data: {
            currentCellId: id,
            cellData,
            cellType,
          },
        })
      },
      toggleContextMenu(id, cellData, cellType, pos, visible) {
        this.graph.removeNode('right-context-menu')
        document.removeEventListener('mousedown', this.onMouseDown)
        if (visible) {
          this.initContextMenu(id, pos, cellData, cellType)
          document.addEventListener('mousedown', this.onMouseDown)
        }
      },
      onMouseDown() {
        this.timer = window.setTimeout(() => {
          this.toggleContextMenu(null, null, null, null, false)
        }, 200)
      },
      /**
       * 注册各种事件
       * @param {*} containerId
       * @param {*} graph
       */
      registerEvent(containerId, graph) {
        if (this.registed) {
          return false
        }
        this.registed = true
        graph.on('node:mouseenter', ({ node }) => {
          if (['vue-shape'].indexOf(node.shape) > -1) return
          const container = document.getElementById(containerId)
          const ports = container.querySelectorAll('.x6-port-body')

          nodeChangeColor(node, imageNodeFlowAttrConfigActived)
          if (!this.readonly) {
            showPorts(ports, true)
          }
        })
        graph.on('node:mouseleave', ({ node }) => {
          // console.log(node.shape)
          if (['vue-shape'].indexOf(node.shape) > -1) return
          const container = document.getElementById(containerId)
          const ports = container.querySelectorAll('.x6-port-body')

          nodeChangeColor(node, imageNodeFlowAttrConfig)

          if (!this.readonly) {
            showPorts(ports, false)
          }
        })

        graph.on('node:click', ({ node }) => {
          if (['vue-shape'].indexOf(node.shape) > -1) return

          const clickTime = new Date().getTime()

          // console.log(
          //   clickTime,
          //   this.oldClickTime,
          //   this.timeStep,
          //   clickTime - this.oldClickTime
          // )

          if (
            this.oldClickTime &&
            clickTime - this.oldClickTime <= this.timeStep
          ) {
            clearTimeout(flowTimer)
            flowTimer = null
          } else {
            flowTimer = setTimeout(() => {
              console.log('click', node)
            }, this.timeStep)
          }
          this.oldClickTime = clickTime
        })

        graph.on('node:dblclick', (event) => {
          if (['vue-shape'].indexOf(event.shape) > -1) return

          const clickTime = new Date().getTime()

          clearTimeout(flowTimer)
          flowTimer = null

          if (
            this.oldClickTime &&
            clickTime - this.oldClickTime < this.timeStep
          ) {
            console.log('dblclick', event)
            if (event.node.data.code) {
              const eventName = `${event.node.data.code}DbClick`
              this[eventName] && this[eventName](event.node)
              this.toggleRightPanel(event.node, true)
            }
          }
          this.oldClickTime = clickTime
        })

        if (this.readonly) {
          return
        }
        // 右键菜单功能源码 start
        Graph.registerVueComponent(
          'contextmenu',
          {
            template: `<context-menu />`,
            components: {
              contextMenu,
            },
          },
          true
        )

        graph.on('node:contextmenu', ({ node, x, y }) => {
          if (this.timer) {
            clearTimeout(this.timer)
            this.timer = 0
          }
          const pos = { x: -10000, y: -10000 }
          const nodepos = node.position()
          const { width } = node.size()

          pos.x = nodepos.x + (width - 84) / 2
          pos.y = nodepos.y - 40 - 15

          this.toggleContextMenu(node.id, node, 'node', pos, true)
        })

        graph.on('edge:contextmenu', ({ edge, x, y }) => {
          if (this.timer) {
            clearTimeout(this.timer)
            this.timer = 0
          }
          const pos = { x: -10000, y: -10000 }

          pos.x = x - 84 / 2
          pos.y = y - 40 - 15

          this.toggleContextMenu(edge.id, edge, 'edge', pos, true)
        })
        // 右键菜单功能源码end

        graph.on('node:added', ({ cell, options }) => {
          if (cell.shape === 'vue-shape') {
            return false
          }
          this.saveFlowData(cell, 'node', 'added', options)
        })

        graph.on('node:removed', ({ node, index, options }) => {
          if (node.shape === 'vue-shape') {
            return false
          }
          this.saveFlowData(node, 'node', 'removed', options)
        })

        graph.on('edge:removed', ({ edge, index, options }) => {
          this.saveFlowData(edge, 'edge', 'removed', options)
        })

        graph.on('edge:connected', ({ edge, isNew }) => {
          console.log('edge:connected', edge, isNew)
          this.saveFlowData(edge, 'edge', 'connected', { isNew })
        })

        graph.on('node:moved', ({ e, x, y, node, view }) => {
          this.saveFlowData(node, 'node', 'moved', null)
        })
      },
      rulesCheck() {
        return new Promise((resolve, reject) => {
          const rootNodes = this.graph.getRootNodes() //获取所有根节点
          // console.log('rootNodes', rootNodes)
          for (let i = 0; i < rootNodes.length; i++) {
            const rootNode = rootNodes[i]
            if (rootNode.data.type !== 'devices') {
              reject({
                message: '每个流程的起始组件必须是设备!',
                data: rootNode,
              })
              break
            }

            // 末端组件必须是事件或者输出
            const successors = this.graph.getSuccessors(rootNode)
            if (successors.length) {
              for (let j = 0; j < successors.length; j++) {
                const successorsNode = successors[j]
                // console.log('successorsNode', successorsNode)
                if (this.graph.isLeafNode(successorsNode)) {
                  if (
                    ['event', 'output'].indexOf(successorsNode.data.type) === -1
                  ) {
                    reject({
                      message: '末端组件必须是事件或者输出!',
                      data: successorsNode,
                    })

                    break
                  }
                }
                continue
              }
            } else {
              reject({
                message:
                  '每个流程中必须至少要有一个设备和一个输出（或者事件）!',
                data: successors,
              })

              break
            }
          }
          resolve(true)
        })
      },
      async doFinishSave() {
        // todo 每个流程的起始组件必须是设备，末端组件必须是事件或者输出

        const graphData = this.graph.toJSON()
        console.log(graphData)
        const rulesValid = await this.rulesCheck().catch((error) => {
          console.log('check failed!', error)
          this.$message.error(error.message)
        })
        if (!rulesValid) {
          return false
        }
        console.log('check end!')

        if (this.flowLoading) {
          return false
        }
        this.flowLoading = true
        let postData = formatExportData(graphData)
        // todo 后端接受业务数据metadata数据是string,需要JSON.stringify()

        postData.forEach((t) => {
          t.metadata = JSON.stringify(t.metadata)
        })
        console.log('postData', postData)
        updateFlowData(this.flowId, postData, true)
          .then(() => {
            this.graph.toPNG(
              async (dataUri) => {
                // 下载
                console.log('dataUri', dataUri)
                // const image = await uploadImageFromBase64(
                //   this.flowId,
                //   dataUri
                // ).catch((error) => {
                //   this.flowLoading = false
                // })
                const filename = `flow_${this.flowId}.png`
                const image = await uploadImageFromBase64(
                  dataUri,
                  filename
                ).catch((error) => {
                  this.flowLoading = false
                })

                if (!!image) {
                  const result = await updateFlowImage(
                    this.flowId,
                    image.data
                  ).catch((error) => {
                    this.flowLoading = false
                  })

                  if (!!result) {
                    // console.log('image', image)
                    this.flowLoading = false
                    this.$message.success('保存成功!')
                    this.$router.go(-1)
                  }
                }
              },
              {
                padding: {
                  top: 10,
                  right: 10,
                  bottom: 10,
                  left: 10,
                },
                width: 215,
                height: 150,
              }
            )
          })
          .catch((error) => {
            this.flowLoading = false
          })
      },
      saveFlowData(cell, cellType, cellOpt, options = null) {
        // console.log('cell', cell, cellType, cellOpt, options)
        if (this.flowLoading) {
          return false
        }
        if (saveTimer) {
          clearTimeout(saveTimer)
          saveTimer = null
        }

        saveTimer = setTimeout(() => {
          this.flowData = this.graph.toJSON()
          let postData = formatExportData(this.graph.toJSON())
          // todo 后端接受业务数据metadata数据是string,需要JSON.stringify()

          postData.forEach((t) => {
            t.metadata = JSON.stringify(t.metadata)
          })
          // console.log('postData', postData)
          updateFlowData(this.flowId, postData, true)
        }, 200)
      },
      toggleRightPanel(node, isShow) {
        this.rightPanel.isShow = isShow
        this.rightPanel.currentNode = node.toJSON()
        this.rightPanel.title = node.data.title
        this.rightPanel.currentNodeId = node.id

        let componentCode = node.data.code
        // console.log(componentCode, this.rightPanel)
        this.rightPanel.componentCode =
          componentCode.charAt(0).toUpperCase() + componentCode.slice(1)
      },
    },
  }
</script>
<style lang="scss">
  .x6-widget-stencil-title {
    background-color: transparent;
  }
</style>
<style lang="scss" scoped>
  .main-container {
    height: calc(100vh - 50px - 94px - 30px - 30px - 30px - 55px);
    display: flex;
  }
  .flow-container {
    flex: 1 1 calc(100% - 204px);
    height: 100%;
    display: flex;
    background-color: #fff;
    position: relative;
    overflow: hidden;
  }
  .side-menu {
    height: 100%;
    flex: 0 0 204px;
    position: relative;
  }
</style>
