<template>
  <div class="app-container">
    <bt-page :title="$translateTitle($route.meta.title)" class="my-bt-page">
      <split-pane :default-percent="22" :min-percent="22" split="vertical">
        <template slot="paneL">
          <div class="btTree-head">
            <div class="headL">
              <remix-icon
                class="l-icon"
                icon-class="building-2-line"
              ></remix-icon>
              <span>{{ $translateTitle('组织架构') }}</span>
            </div>
            <div class="headR">
              <bt-button v-if="isEdit" type="text" @click="isEdit = false">
                {{ $translateTitle($cws.w009) }}
              </bt-button>
              <remix-icon
                v-else
                class="r-icon"
                icon-class="edit-box-line"
                @click="isEdit = true"
              ></remix-icon>
            </div>
          </div>
          <div class="btTree" :class="{ isEdit }">
            <el-tree
              ref="elTree"
              :props="customProps"
              node-key="unitCode"
              :data="systemTree"
              :indent="0"
              default-expand-all
              :expand-on-click-node="false"
              check-on-click-node
              @current-change="handleCurrentChange"
            >
              <span slot-scope="{ node }" class="custom-tree-node">
                <span
                  :class="node.isCurrent ? 'cur' : ''"
                  :style="`font-size: 14px;font-weight: ${
                    node.level == 1 ? 'bold' : 'normal'
                  }`"
                >
                  <remix-icon
                    v-show="isEdit"
                    class="icon"
                    icon-class="focus-2-fill"
                  ></remix-icon>
                  {{ node.label }}
                </span>
              </span>
            </el-tree>
          </div>
          <div v-show="isEdit" class="btBtns">
            <bt-button type="text" :disabled="!isLastDept" @click="addLine">
              <remix-icon icon-class="add-box-line"></remix-icon>
              {{ $translateTitle($cws.w002) }}
            </bt-button>
            <bt-button type="text" :disabled="!isLine" @click="editLine">
              <remix-icon icon-class="file-edit-line"></remix-icon>
              {{ $translateTitle($cws.w004) }}
            </bt-button>
            <bt-button type="text" :disabled="!isLine" @click="delLine">
              <remix-icon icon-class="delete-bin-line"></remix-icon>
              {{ $translateTitle($cws.w003) }}
            </bt-button>
          </div>
          <PopLine
            :visible.sync="visibleLine"
            :node="currentNode"
            @refresh="handleRefresh"
          />
        </template>
        <template slot="paneR">
          <EmployeeList :node="currentNode" />
          <!-- <component :is="isComponent" ref="equip" @getTree="getTree" /> -->
        </template>
      </split-pane>
    </bt-page>
  </div>
</template>
<script>
  import EmployeeList from '../components/EmployeeList.vue'
  import PopLine from '../components/PopLine.vue'
  import { getSystemList, delLine } from '../api'
  import BtButton from '@/components/BtPage/bt-button.vue'
  // import { tree } from '../api/test.js'
  export default {
    name: 'Tree',
    components: {
      EmployeeList,
      PopLine,
      BtButton,
    },
    data() {
      return {
        systemTree: [],
        customProps: {
          children: 'children',
          label: 'label',
        },
        currentNode: null,
        isEdit: false,
        visibleLine: false,
      }
    },
    computed: {
      isLastDept() {
        if (!this.currentNode) {
          return false
        }
        if (this.currentNode.unitType == 'CX') {
          return false
        }
        if (
          this.currentNode.children &&
          Array.isArray(this.currentNode.children) &&
          this.currentNode.children.some((item) => item.unitType != 'CX')
        ) {
          return false
        }
        return true
      },
      isLine() {
        if (!this.currentNode) {
          return false
        }
        return this.currentNode.unitType == 'CX'
      },
    },
    mounted() {
      this.getSystemTree()
    },
    methods: {
      addLine() {
        this.visibleLine = true
      },
      editLine() {
        let cNode = this.$refs.elTree.getNode(this.currentNode)
        this.currentNode.parentNode = cNode.parent
        this.visibleLine = true
      },
      delLine() {
        this.$confirm(this.$translateTitle(this.$cws.w101), {
          title: this.$translateTitle(this.$cws.w010),
          type: 'warning',
          center: true,
        })
          .then(async () => {
            await delLine({ ids: this.currentNode.unitCode })
            this.$msg({
              type: 'success',
              message: this.$translateTitle(this.$cws.w103),
            })
            this.handleRefresh()
          })
          .catch(() => {})
      },
      async getSystemTree() {
        let list = await getSystemList()
        formatList(list)
        function formatList(list) {
          if (Array.isArray(list)) {
            list.forEach((item) => {
              item.label = `${item.unitName}(${
                item.unitWord ? item.unitWord : '-'
              })`
              if (Array.isArray(item.children) && item.children.length > 0) {
                formatList(item.children)
              } else {
                delete item.children
              }
            })
          }
        }
        this.systemTree = list
      },
      handleCurrentChange(data) {
        this.currentNode = data
      },
      handleRefresh() {
        this.currentNode = null
        this.getSystemTree()
      },
    },
  }
</script>

<style lang="scss" scoped>
  ::v-deep .my-bt-page {
    .bt-page__body {
      padding: 0;
      .bt-column__body {
        height: calc(100vh - 60px - #{$base-tabs-bar-height} - 20px - 94px);
        .btTree-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 15px 0 15px;
          height: 55px;
          border-bottom: 1px solid #e5e5e5;
          .headL {
            display: flex;
            font-size: 16px;
            color: $base-color-default;
            .l-icon {
              margin-right: 8px;
            }
          }
          .headR {
            .r-icon {
              font-size: 16px;
              color: #1e3661;
              cursor: pointer;
            }
          }
        }
        .btTree {
          height: calc(100% - 55px);
          &.isEdit {
            height: calc(100% - 55px - 50px);
          }
        }
        .btBtns {
          height: 50px;
          border-top: 1px solid #c2c8d8;
          display: flex;
          justify-content: space-around;
          align-items: center;
        }
      }
    }
  }
</style>
