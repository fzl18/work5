<template>
  <div class="app-container">
    <bt-page
      ref="btPage"
      :title="$translateTitle($route.meta.title)"
      class="my-bt-page"
    >
      <template slot="drawer">
        <vxe-form
          :data="query.searchData"
          :items="searchItems"
          size="small"
          title-align="top"
          class-name="formSearch"
          :rules="formRules"
          @submit="
            $refs.grid.commitProxy('query')
            $refs.btPage.closeDrawer()
          "
          @reset="formReset"
        >
          <template #formItem1="{ data }">
            <slot name="formItem1" :data="data" />
          </template>
        </vxe-form>
      </template>
      <vxe-grid v-if="columns.columns" ref="grid" v-bind="grid">
        <template #left>
          <span v-if="config.drawer" class="title">
            <remix-icon
              icon-class="edit-2-fill"
              class="remix-icon"
            ></remix-icon>
            {{ $translateTitle($route.meta.title) }}
          </span>
          <slot name="headLeft" />
        </template>
        <template #right>
          <bt-button
            v-if="columns.method.batAdd"
            type="success"
            @click="columns.method.batAdd"
          >
            {{ $translateTitle($cws.w002) }}
          </bt-button>
          <bt-button
            v-if="columns.method.batDel"
            type="error"
            @click="columns.method.batDel"
          >
            {{ $translateTitle($cws.w003) }}
          </bt-button>
          <i
            v-if="config.drawer"
            class="vxe-icon-funnel"
            @click="openDrawer"
          ></i>
        </template>
        <template #expand="{ row }">
          <div class="expandCol">
            <!-- <bt-table
              ref="subTab"
              :query="{
                method: expandQuery.method,
                searchData: {
                  code: row.code,
                  version: row.version,
                  haveLastBomVersion: true,
                },
              }"
              :columns="{
                method: {},
                columns: expandGrid.columns,
              }"
              :config="{ drawer: false }"
              :pager-config="{ pageSize: 999, autoHidden: true }"
              :expand-config="expandConfig"
            ></bt-table> -->
            <vxe-grid ref="expandGrid" v-bind="expandGrid" :data="row.child" />
          </div>
        </template>
        <template #options="{ row }">
          <div class="options">
            <bt-dropdown :show-split="false">
              <bt-dropdown-menu>
                <bt-dropdown-item
                  v-if="columns.method.view"
                  @click="columns.method.view(row)"
                >
                  <i class="el-icon-edit"></i>
                  {{ $translateTitle($cws.w005) }}
                </bt-dropdown-item>
                <bt-dropdown-item
                  v-if="columns.method.edit"
                  @click="columns.method.edit(row)"
                >
                  <i class="el-icon-edit"></i>
                  {{ $translateTitle($cws.w004) }}
                </bt-dropdown-item>
                <bt-dropdown-item
                  v-if="columns.method.del"
                  @click="columns.method.del(row)"
                >
                  <i class="el-icon-edit"></i>
                  {{ $translateTitle($cws.w003) }}
                </bt-dropdown-item>
              </bt-dropdown-menu>
            </bt-dropdown>
          </div>
        </template>
      </vxe-grid>
    </bt-page>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Sortable from 'sortablejs'
  import merge from 'xe-utils/merge'
  import clone from 'xe-utils/clone'
  export default {
    name: 'BtTablelayer',
    props: {
      formRules: {
        type: Object,
        default: () => {
          return {
            // unitUnionCode: [{ required: true, message: '请输入' }],
          }
        },
      },
      columns: {
        type: Object,
        default: () => {},
      },
      expandColumns: {
        type: Object,
        default: () => {},
      },
      query: {
        type: Object,
        default: () => {},
      },
      treeConfig: {
        type: Object,
        default: () => {},
      },
      expandQuery: {
        type: Object,
        default: () => {},
      },
      expandConfig: {
        type: Object,
        default: () => {},
      },
      config: {
        type: Object,
        default: () => {
          return {
            drawer: true,
          }
        },
      },
      response: {
        type: Object,
        default: () => {
          return {
            result: 'objList',
            total: 'pageDesc.totalRows',
          }
        },
      },
    },
    data() {
      return {
        searchItems: [],
        defaultTreeConfig: {
          lazy: true,
          line: false,
          transform: false,
          // rowField: 'id',
          // parentField: 'parentId',
          iconOpen: 'vxe-icon-square-minus-fill',
          iconClose: 'vxe-icon-square-plus-fill',
          hasChild: 'lastBomVersion', //
          loadMethod: ({ row }) => {
            return this.query
              .method({
                code: row.code,
                version: row.lastBomVersion,
                hasChild: true,
                haveChildLastBomVersion: true,
              })
              .then((res) => {
                return res
              })
          },
        },
        grid: {
          size: 'small',
          border: true,
          resizable: true,
          showOverflow: true,
          align: 'left',
          // headerAlign: 'center',
          stripe: true,
          headerRowClassName: 'tabh',
          rowConfig: {
            isHover: true,
          },
          pagerConfig: {
            pageSize: 10,
            className: 'pageClass',
            // autoHidden: true,
            layouts: [
              // 'PrevJump',
              'PrevPage',
              'JumpNumber',
              'NextPage',
              // 'NextJump',
              'Sizes',
              'FullJump',
              'Total',
            ],
          },
          expandConfig: {
            accordion: true,
            lazy: true,
            // custom: 'vxe-icon-square-minus',
            visibleMethod: ({ row }) => row.haveChild,
            loadMethod: ({ row }) => {
              return this.expandQuery
                .method({
                  code: row.bom.code,
                  version: row.bom.version,
                  hasChild: true,
                  haveChildLastBomVersion: true,
                })
                .then((res) => {
                  return res
                })
            },
            ...this.expandConfig,
          },
          treeConfig: {},
          toolbarConfig: {
            className: 'tabheader',
            custom: { immediate: true, isFooter: false },
            slots: {
              buttons: 'left',
              tools: 'right',
            },
          },
          columnConfig: {
            useKey: true,
            minWidth: 60,
          },
          proxyConfig: {
            seq: true,
            props: {
              ...this.response,
            },
            ajax: {
              query: ({ page }) => {
                return this.query
                  .method({
                    ...this.query.searchData,
                    ...page,
                  })
                  .then((res) => {
                    if (res.objList) {
                      res.objList.map((item, index) => {
                        res.objList[index] = { ...item, ...item.bom }
                      })
                      return res
                    } else {
                      return { objList: res || [] }
                    }
                  })
              },
            },
          },
          ...this.config.grid,
        },
        expandGrid: {
          size: 'small',
          border: true,
          resizable: true,
          showOverflow: true,
          // showHeader: false,
          align: 'left',
          // headerAlign: 'center',
          // headerRowClassName: 'tabh',
          rowConfig: {
            isHover: true,
            useKey: true,
          },
          data: [],
          // pagerConfig: {
          //   pageSize: 10,
          //   className: 'pageClass',
          //   // autoHidden: true,
          //   layouts: [
          //     // 'PrevJump',
          //     'PrevPage',
          //     'JumpNumber',
          //     'NextPage',
          //     // 'NextJump',
          //     'Sizes',
          //     'FullJump',
          //     'Total',
          //   ],
          // },
          // expandConfig: {
          // accordion: true,
          // lazy: true,
          // custom: 'vxe-icon-square-minus',
          // iconOpen: 'vxe-icon-square-minus',
          // iconClose: 'vxe-icon-square-plus',
          // visibleMethod: ({ row }) => row.haveChild,
          // ...this.expandConfig,
          // },
          treeConfig: {
            lazy: true,
            line: true,
            transform: false,
            // rowField: 'id',
            // parentField: 'parentId',
            iconOpen: 'vxe-icon-square-minus-fill',
            iconClose: 'vxe-icon-square-plus-fill',
            hasChild: 'lastBomVersion', //
            loadMethod: ({ row }) => {
              return this.expandQuery
                .method({
                  code: row.code,
                  version: row.lastBomVersion,
                  hasChild: true,
                  haveChildLastBomVersion: true,
                })
                .then((res) => {
                  console.log(row, res)
                  row.child = res
                })
            },
          },
          // toolbarConfig: {
          //   className: 'tabheader',
          //   custom: { immediate: true, isFooter: false },
          //   slots: {
          //     buttons: 'left',
          //     tools: 'right',
          //   },
          // },
          columnConfig: {
            // useKey: true,
            // minWidth: 40,
          },
          columns: [],
          // proxyConfig: {
          //   seq: true,
          //   props: {
          //     ...this.response,
          //   },
          //   ajax: {
          //     query: ({ page }) => {
          //       return this.expandQuery
          //         .method({
          //           ...this.expandQuery.expandSearchData,
          //           ...page,
          //         })
          //         .then((res) => {
          //           console.log(res)
          //           // return { objList: res }
          //         })
          //     },
          //   },
          // },
          ...this.config.grid,
        },
      }
    },
    computed: {
      ...mapGetters({
        userInfo: 'coreUser/userInfo',
      }),
      unitOptions() {
        if (this.userInfo && Array.isArray(this.userInfo.userUnits)) {
          return this.userInfo.userUnits.map((item) => {
            item.value = item.unionCode
            item.label = item.unitName
            return item
          })
        } else {
          return []
        }
      },
    },
    watch: {
      query(val) {
        this.searchItems = [
          ...val.searchItems,
          {
            align: 'center',
            span: 24,
            className: 'submitButton',
            itemRender: {
              name: '$buttons',
              children: [
                {
                  props: {
                    type: 'submit',
                    content: '查询',
                    status: 'primary',
                  },
                },
                {
                  props: { type: 'reset', content: '重置', status: 'success' },
                },
              ],
            },
          },
        ]
        if (val.searchData.unitUnionCode !== undefined) {
          this.searchItems.unshift({
            field: 'unitUnionCode',
            title: '公司',
            span: 24,
            itemRender: {
              name: '$select',
              props: {
                placeholder: '请选择',
                options: this.unitOptions,
              },
            },
          })
        }
      },
      columns() {
        this.init()
      },
      expandColumns(val) {
        this.expandGrid.columns = [...val.expandColumns]
      },
    },
    created() {
      this.columnDrop()
    },
    beforeDestroy() {
      if (this.sortable) {
        this.sortable.destroy()
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.init()
      })
    },
    methods: {
      init() {
        let columns = clone(this.columns.columns, true)
        columns.unshift({
          type: 'seq',
          title: this.$translateTitle('序号'),
          align: 'center',
          width: 50,
        })
        let { method } = this.columns
        if (Object.keys(method).length) {
          columns.push({
            title: this.$translateTitle('操作'),
            align: 'center',
            fixed: 'right',
            with: 100,
            slots: { default: 'options' },
          })
        }
        console.log(columns)
        this.grid.columns = columns
        this.grid.proxyConfig.seq = true
        this.grid.treeConfig = { ...this.defaultTreeConfig, ...this.treeConfig }
      },
      querySearch() {
        this.$refs.grid.commitProxy('query')
      },
      queryReset() {
        this.searchParams
      },
      openDrawer() {
        this.$refs.btPage.handleOpenDrawer()
      },
      formReset({ data, $event }) {
        this.$emit('formReset', data)
      },
      columnDrop() {
        this.$nextTick(() => {
          const $table = this.$refs.grid
          const $table2 = this.$refs.expandGrid
          this.sortable = Sortable.create(
            $table.$el.querySelector(
              '.body--wrapper>.vxe-table--header .vxe-header--row'
            ),
            {
              handle: '.vxe-header--column',
              onEnd: ({ item, newIndex, oldIndex }) => {
                const { fullColumn, tableColumn } = $table.getTableColumn()
                const targetThElem = item
                const wrapperElem = targetThElem.parentNode
                const newColumn = fullColumn[newIndex]
                if (newColumn.fixed) {
                  const oldThElem = wrapperElem.children[oldIndex]
                  // 错误的移动
                  if (newIndex > oldIndex) {
                    wrapperElem.insertBefore(targetThElem, oldThElem)
                  } else {
                    wrapperElem.insertBefore(
                      targetThElem,
                      oldThElem ? oldThElem.nextElementSibling : oldThElem
                    )
                  }
                  this.$message.error('固定列不允许拖动，即将还原操作！')
                  return
                }
                const oldColumnIndex = $table.getColumnIndex(
                  tableColumn[oldIndex]
                )
                const newColumnIndex = $table.getColumnIndex(
                  tableColumn[newIndex]
                )
                const currRow = fullColumn.splice(oldColumnIndex, 1)[0]
                fullColumn.splice(newColumnIndex, 0, currRow)
                $table.loadColumn(fullColumn)
              },
            }
          )
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  ::v-deep .vxe-header--column {
    font-size: 12px;
    font-weight: normal;
  }
  ::v-deep .tabh {
    background: #adb7c0;
    color: #fff;
  }
  ::v-deep .tabheader {
    .title {
      font-size: 18px;
      color: $base-color-default;
      i {
        font-size: 20px;
        color: #fff;
        width: 28px;
        height: 28px;
        line-height: 28px;
        text-align: center;
        background: $base-color-default;
        display: inline-block;
        border-radius: 4px;
        margin-right: 5px;
      }
    }
    .vxe-icon-funnel {
      background: $base-color-default;
      padding: 7.5px;
      color: #fff;
      border-radius: 4px;
      margin: 0 8px;
      cursor: pointer;
    }
    button {
      &.is--circle {
        border: none !important;
        background: $base-color-default !important;
        color: #fff !important;
        border-radius: 4px !important;
      }
    }
    border-bottom: 2px solid #e5e5e5;
    margin-bottom: 20px;
    position: relative;
    &::before {
      content: '';
      width: 33px;
      height: 2px;
      background-color: $base-color-default;
      position: absolute;
      left: 0;
      bottom: -2px;
    }
  }
  ::v-deep .pageClass {
    margin-top: 10px;
  }
  ::v-deep .formSearch {
    background: none;
    color: #fff;
    input {
      background-color: #1d1f21;
      border-color: #2a2e31;
      color: #777777;
      border-radius: 5px;
    }
    .vxe-form--item .vxe-form--item-inner {
      flex-direction: column;
      align-items: start;
      .vxe-form--item-title {
        margin-bottom: 10px;
      }
      .vxe-form--item-content {
        width: 100%;
      }
    }
    .submitButton {
      margin-top: 20px;
      border-top: 1px solid #7777;
      padding-top: 20px;
      button {
        width: 45%;
      }
    }
  }
  ::v-deep .expandCol {
    padding: 20px;
  }
</style>
<style>
  .vxe-select-option--wrapper {
    border-radius: 2px;
    margin-top: 10px;
  }
</style>
