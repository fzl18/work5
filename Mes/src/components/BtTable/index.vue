<template>
  <vxe-grid ref="grid" v-bind="grid">
    <template #left>
      <span v-if="config.drawer" class="title">
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
      <i v-if="config.drawer" class="vxe-icon-funnel" @click="openDrawer"></i>
    </template>
    <template #options="{ row }">
      <div class="options">
        <bt-dropdown :show-split="false">
          <bt-dropdown-menu>
            <bt-dropdown-item
              v-if="columns.method.view"
              @click="columns.method.view.name(row)"
            >
              <i class="el-icon-edit"></i>
              {{ $translateTitle($cws.w005) }}
            </bt-dropdown-item>
            <bt-dropdown-item
              v-if="columns.method.edit"
              @click="columns.method.edit.name(row)"
            >
              <i class="el-icon-edit"></i>
              {{ $translateTitle($cws.w004) }}
            </bt-dropdown-item>
            <bt-dropdown-item
              v-if="columns.method.del"
              @click="columns.method.del.name(row)"
            >
              <i class="el-icon-edit"></i>
              {{ $translateTitle($cws.w003) }}
            </bt-dropdown-item>
          </bt-dropdown-menu>
        </bt-dropdown>
      </div>
    </template>
  </vxe-grid>
</template>

<script>
  import Sortable from 'sortablejs'
  export default {
    name: 'BtTable',
    props: {
      columns: {
        type: Object,
        default: () => {},
      },
      query: {
        type: Object,
        default: () => {},
      },
      expandConfig: {
        type: Object,
        default: () => {},
      },
      pagerConfig: {
        type: Object,
        default: () => {},
      },
      config: {
        type: Object,
        default: () => {
          return {
            drawer: true,
            toolbarConfig: true,
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
        grid: {
          size: 'small',
          border: true,
          resizable: true,
          stripe: true,
          showOverflow: true,
          align: 'left',
          // headerAlign: 'center',
          headerRowClassName: 'tabh',
          rowConfig: {
            isHover: true,
            useKey: true,
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
            ...this.pagerConfig,
          },
          expandConfig: {
            // accordion: true,
            // lazy: true,
            // custom: 'vxe-icon-square-minus',
            iconOpen: 'vxe-icon-square-minus',
            iconClose: 'vxe-icon-square-plus',
            ...this.expandConfig,
          },
          // treeConfig: {
          //   lazy: true,
          //   line: true,
          //   // transform: true,
          //   // rowField: 'id',
          //   // parentField: 'parentId',
          //   hasChild: 'hasChild', // 设置是否有子节点标识
          //   loadMethod({ row }) {
          //     // 模拟后台接口
          //     return new Promise((resolve) => {
          //       setTimeout(() => {
          //         dataId++
          //         const list = [
          //           {
          //             id: row.id + dataId + 1,
          //             parentId: row.id,
          //             name: 'test abc1',
          //             type: 'mp3',
          //             size: 1024,
          //             date: '2020-08-01',
          //           },
          //           {
          //             id: row.id + dataId + 2,
          //             parentId: row.id,
          //             name: 'Test2',
          //             type: 'mp4',
          //             size: null,
          //             date: '2021-04-01',
          //             hasChild: true,
          //           },
          //         ]
          //         resolve(list)
          //       }, 500)
          //     })
          //   },
          // },
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
            minWidth: 80,
          },
          columns: [],
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
                    return { objList: res }
                  })
              },
            },
          },
          ...this.config.grid,
        },
      }
    },

    watch: {
      'query.searchData'() {
        this.querySearch()
      },
      columns(val) {
        const list = [
          {
            type: 'seq',
            title: this.$translateTitle('序号'),
            align: 'center',
            width: 50,
          },
          ...val.columns,
        ]
        let { method } = this.columns
        if (Object.keys(method).length) {
          list.push({
            title: this.$translateTitle('操作'),
            align: 'center',
            fixed: 'right',
            with: 100,
            slots: { default: 'options' },
          })
        }

        this.grid.columns = list
        this.$refs.grid.recalculate()
      },
    },
    created() {
      this.columnDrop()
    },
    mounted() {
      this.$nextTick(() => {
        this.init()
      })
    },
    beforeDestroy() {
      if (this.sortable) {
        this.sortable.destroy()
      }
    },

    methods: {
      init() {},
      querySearch() {
        this.$refs.grid.commitProxy('query')
      },
      queryReset() {
        this.searchParams
      },
      openDrawer() {
        this.$parent.$parent.$refs.btPage.handleOpenDrawer()
      },
      columnDrop() {
        this.$nextTick(() => {
          const $table = this.$refs.grid
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
      font-size: 16px;
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
</style>
<style>
  .vxe-select-option--wrapper {
    border-radius: 2px;
    margin-top: 10px;
  }
</style>
