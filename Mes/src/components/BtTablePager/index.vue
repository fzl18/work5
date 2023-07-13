<template>
  <div class="app-container">
    <bt-page
      v-if="type !== 'single'"
      ref="btPage"
      :title="$translateTitle($route.meta.title)"
      class="my-bt-page"
    >
      <template v-if="useSearch.enable" slot="drawer">
        <vxe-form
          :data="useSearch.fields"
          :items="useSearch.items"
          size="small"
          title-align="top"
          class-name="formSearch"
          @submit="
            $refs.grid.commitProxy('query')
            $refs.btPage.closeDrawer()
          "
          @reset="formReset"
        >
          <template #formItem1="{ data }">
            <slot name="formItem1" :data="data" />
          </template>
          <template #formItem2="{ data }">
            <slot name="formItem2" :data="data" />
          </template>
          <template #formItem3="{ data }">
            <slot name="formItem3" :data="data" />
          </template>
          <template #formItem4="{ data }">
            <slot name="formItem4" :data="data" />
          </template>
          <template #formItem5="{ data }">
            <slot name="formItem5" :data="data" />
          </template>
        </vxe-form>
      </template>

      <div v-if="type == 'normal'" class="normal">
        <vxe-grid ref="grid" v-bind="useMain">
          <template #toolbarleft>
            <span v-if="useSettings.titleVisable" class="title">
              <remix-icon
                icon-class="edit-2-fill"
                class="remix-icon"
              ></remix-icon>
              {{ $translateTitle($route.meta.title) }}
            </span>
            <slot name="headLeft" />
          </template>
          <template #toolbarright>
            <slot name="headRight" />
            <el-button
              v-if="useSettings.operate.button.includes('add')"
              type="primary"
              :disabled="!checkboxList.length"
              @click="batchOperate('add')"
            >
              {{ $translateTitle('批量添加') }}
            </el-button>
            <el-button
              v-if="useSettings.operate.button.includes('edit')"
              type="warning"
              :disabled="!checkboxList.length"
              @click="batchOperate('edit')"
            >
              {{ $translateTitle('批量编辑') }}
            </el-button>
            <el-button
              v-if="useSettings.operate.button.includes('del')"
              type="danger"
              :disabled="!checkboxList.length"
              @click="batchOperate('del')"
            >
              {{ $translateTitle('批量删除') }}
            </el-button>
            <el-button
              v-if="useSettings.operate.button.includes('download')"
              type="primary"
              @click="batchOperate('download')"
            >
              {{ $translateTitle('批量下载') }}
            </el-button>
            <el-button
              v-if="useSettings.operate.button.includes('import')"
              type="primary"
              @click="batchOperate('import')"
            >
              {{ $translateTitle('导入') }}
            </el-button>
            <el-button
              v-if="useSettings.operate.button.includes('export')"
              type="primary"
              @click="batchOperate('export')"
            >
              {{ $translateTitle('导出') }}
            </el-button>
            <i
              v-if="useSearch.enable"
              class="vxe-icon-funnel"
              @click="openDrawer"
            ></i>
          </template>
          <template #mainColumnItem1="{ row }">
            <slot name="mainColumnItem1" :row="row" />
          </template>
          <template #mainColumnItem2="{ row }">
            <slot name="mainColumnItem2" :row="row" />
          </template>
          <template #mainColumnItem3="{ row }">
            <slot name="mainColumnItem3" :row="row" />
          </template>
          <template #mainColumnItem4="{ row }">
            <slot name="mainColumnItem4" :row="row" />
          </template>
          <template #mainColumnItem5="{ row }">
            <slot name="mainColumnItem5" :row="row" />
          </template>

          <template #expand="{ row }">
            <div class="expandCol">
              <vxe-grid ref="expandGrid" v-bind="useExpand" :data="row.child" />
            </div>
          </template>
          <template #options="{ row }">
            <div class="options">
              <bt-dropdown :show-split="false">
                <slot
                  v-if="useMain.operate.custom"
                  :name="`operate${useMain.operate.custom}`"
                  :row="row"
                />
                <bt-dropdown-menu v-if="!useMain.operate.custom">
                  <bt-dropdown-item
                    v-if="useMain.operate.button.includes('view')"
                    @click="operatehandle('view')"
                  >
                    <i class="el-icon-tickets"></i>
                    {{ $translateTitle('详情') }}
                  </bt-dropdown-item>
                  <bt-dropdown-item
                    v-if="useMain.operate.button.includes('edit')"
                    @click="operatehandle('edit')"
                  >
                    <i class="el-icon-edit"></i>
                    {{ $translateTitle('编辑') }}
                  </bt-dropdown-item>
                  <bt-dropdown-item
                    v-if="useMain.operate.button.includes('del')"
                    @click="operatehandle('del')"
                  >
                    <i class="el-icon-delete"></i>
                    {{ $translateTitle('删除') }}
                  </bt-dropdown-item>
                  <bt-dropdown-item
                    v-if="useMain.operate.button.includes('download')"
                    @click="operatehandle('download')"
                  >
                    <i class="el-icon-download"></i>
                    {{ $translateTitle('下载') }}
                  </bt-dropdown-item>
                </bt-dropdown-menu>
              </bt-dropdown>
            </div>
          </template>
        </vxe-grid>
      </div>

      <div v-if="type == 'category'" class="category">
        <split-pane :default-percent="20" :min-percent="10" split="vertical">
          <template slot="paneL">
            <div class="btTree-head">
              <div class="headL">
                <remix-icon
                  :class="useCategory.titleIcon || 'l-icon'"
                  icon-class="list-check"
                ></remix-icon>
                <span>{{ useCategory.title }}</span>
              </div>
            </div>
            <div class="btTree">
              <vxe-grid
                ref="categoryGrid"
                v-bind="useCategory"
                :cell-class-name="isCurrentCel"
                @cell-dblclick="categoryCellDblclick"
              ></vxe-grid>
            </div>
          </template>
          <template slot="paneR">
            <vxe-grid ref="grid" v-bind="useMain" :height="530">
              <template #toolbarleft>
                <span v-if="useSettings.titleVisable" class="title">
                  <remix-icon
                    icon-class="edit-2-fill"
                    class="remix-icon"
                  ></remix-icon>
                  {{ $translateTitle($route.meta.title) }}
                </span>
                <slot name="headLeft" />
              </template>
              <template #toolbarright>
                <slot name="headRight" />
                <el-button
                  v-if="useSettings.operate.button.includes('add')"
                  type="primary"
                  :disabled="!checkboxList.length"
                  @click="batchOperate('add')"
                >
                  {{ $translateTitle('批量添加') }}
                </el-button>
                <el-button
                  v-if="useSettings.operate.button.includes('edit')"
                  type="warning"
                  :disabled="!checkboxList.length"
                  @click="batchOperate('edit')"
                >
                  {{ $translateTitle('批量编辑') }}
                </el-button>
                <el-button
                  v-if="useSettings.operate.button.includes('del')"
                  type="danger"
                  :disabled="!checkboxList.length"
                  @click="batchOperate('del')"
                >
                  {{ $translateTitle('批量删除') }}
                </el-button>
                <el-button
                  v-if="useSettings.operate.button.includes('download')"
                  type="primary"
                  @click="batchOperate('download')"
                >
                  {{ $translateTitle('批量下载') }}
                </el-button>
                <el-button
                  v-if="useSettings.operate.button.includes('import')"
                  type="primary"
                  @click="batchOperate('import')"
                >
                  {{ $translateTitle('导入') }}
                </el-button>
                <el-button
                  v-if="useSettings.operate.button.includes('export')"
                  type="primary"
                  @click="batchOperate('export')"
                >
                  {{ $translateTitle('导出') }}
                </el-button>
                <i
                  v-if="useSearch.enable"
                  class="vxe-icon-funnel"
                  @click="openDrawer"
                ></i>
              </template>
              <template #mainColumnItem1="{ row }">
                <slot name="mainColumnItem1" :row="row" />
              </template>
              <template #mainColumnItem2="{ row }">
                <slot name="mainColumnItem2" :row="row" />
              </template>
              <template #mainColumnItem3="{ row }">
                <slot name="mainColumnItem3" :row="row" />
              </template>
              <template #mainColumnItem4="{ row }">
                <slot name="mainColumnItem4" :row="row" />
              </template>
              <template #mainColumnItem5="{ row }">
                <slot name="mainColumnItem5" :row="row" />
              </template>
              <template #expand="{ row }">
                <div class="expandCol">
                  <vxe-grid
                    ref="expandGrid"
                    v-bind="useExpand"
                    :data="row.child"
                  />
                </div>
              </template>
              <template #options="{ row }">
                <div class="options">
                  <bt-dropdown :show-split="false">
                    <slot
                      v-if="useMain.operate.custom"
                      :name="`operate${useMain.operate.custom}`"
                      :row="row"
                    />
                    <bt-dropdown-menu v-if="!useMain.operate.custom">
                      <bt-dropdown-item
                        v-if="useMain.operate.button.includes('view')"
                        @click="operatehandle('view', row)"
                      >
                        <i class="el-icon-tickets"></i>
                        {{ $translateTitle('详情') }}
                      </bt-dropdown-item>
                      <bt-dropdown-item
                        v-if="useMain.operate.button.includes('edit')"
                        @click="operatehandle('edit', row)"
                      >
                        <i class="el-icon-edit"></i>
                        {{ $translateTitle('编辑') }}
                      </bt-dropdown-item>
                      <bt-dropdown-item
                        v-if="useMain.operate.button.includes('del')"
                        @click="operatehandle('del', row)"
                      >
                        <i class="el-icon-delete"></i>
                        {{ $translateTitle('删除') }}
                      </bt-dropdown-item>
                      <bt-dropdown-item
                        v-if="useMain.operate.button.includes('download')"
                        @click="operatehandle('download', row)"
                      >
                        <i class="el-icon-download"></i>
                        {{ $translateTitle('下载') }}
                      </bt-dropdown-item>
                    </bt-dropdown-menu>
                  </bt-dropdown>
                </div>
              </template>
            </vxe-grid>
          </template>
        </split-pane>
      </div>
    </bt-page>

    <div v-if="type == 'single'" class="single">
      <vxe-grid ref="grid" v-bind="useMain">
        <template #toolbarleft>
          <span v-if="useSettings.titleVisable" class="title">
            <remix-icon
              icon-class="edit-2-fill"
              class="remix-icon"
            ></remix-icon>
            {{ $translateTitle($route.meta.title) }}
          </span>
          <slot name="headLeft" />
        </template>
        <template #toolbarright>
          <slot name="headRight" />
          <el-button
            v-if="useSettings.operate.button.includes('add')"
            type="primary"
            :disabled="!checkboxList.length"
            @click="batchOperate('add')"
          >
            {{ $translateTitle('批量添加') }}
          </el-button>
          <el-button
            v-if="useSettings.operate.button.includes('edit')"
            type="warning"
            :disabled="!checkboxList.length"
            @click="batchOperate('edit')"
          >
            {{ $translateTitle('批量编辑') }}
          </el-button>
          <el-button
            v-if="useSettings.operate.button.includes('del')"
            type="danger"
            :disabled="!checkboxList.length"
            @click="batchOperate('del')"
          >
            {{ $translateTitle('批量删除') }}
          </el-button>
          <el-button
            v-if="useSettings.operate.button.includes('download')"
            type="primary"
            @click="batchOperate('download')"
          >
            {{ $translateTitle('批量下载') }}
          </el-button>
          <el-button
            v-if="useSettings.operate.button.includes('import')"
            type="primary"
            @click="batchOperate('import')"
          >
            {{ $translateTitle('导入') }}
          </el-button>
          <el-button
            v-if="useSettings.operate.button.includes('export')"
            type="primary"
            @click="batchOperate('export')"
          >
            {{ $translateTitle('导出') }}
          </el-button>
          <i
            v-if="useSearch.enable"
            class="vxe-icon-funnel"
            @click="openDrawer"
          ></i>
        </template>
        <template #expand="{ row }">
          <div class="expandCol">
            <vxe-grid ref="expandGrid" v-bind="useExpand" :data="row.child" />
          </div>
        </template>
        <template #options="{ row }">
          <div class="options">
            <bt-dropdown :show-split="false">
              <slot
                v-if="useMain.operate.custom"
                :name="`operate${useMain.operate.custom}`"
                :row="row"
              />
              <bt-dropdown-menu v-if="!useMain.operate.custom">
                <bt-dropdown-item
                  v-if="useMain.operate.button.includes('view')"
                  @click="operatehandle('view')"
                >
                  <i class="el-icon-tickets"></i>
                  {{ $translateTitle('详情') }}
                </bt-dropdown-item>
                <bt-dropdown-item
                  v-if="useMain.operate.button.includes('edit')"
                  @click="operatehandle('edit')"
                >
                  <i class="el-icon-edit"></i>
                  {{ $translateTitle('编辑') }}
                </bt-dropdown-item>
                <bt-dropdown-item
                  v-if="useMain.operate.button.includes('del')"
                  @click="operatehandle('del')"
                >
                  <i class="el-icon-delete"></i>
                  {{ $translateTitle('删除') }}
                </bt-dropdown-item>
                <bt-dropdown-item
                  v-if="useMain.operate.button.includes('download')"
                  @click="operatehandle('download')"
                >
                  <i class="el-icon-download"></i>
                  {{ $translateTitle('下载') }}
                </bt-dropdown-item>
              </bt-dropdown-menu>
            </bt-dropdown>
          </div>
        </template>
      </vxe-grid>
    </div>

    <vxe-modal
      id="modal"
      v-model="useModal.visible"
      class-name="tablepagerModal"
      :width="useModal.width"
      :height="useModal.height"
      :min-width="useModal.minWidth"
      :min-height="useModal.minHeight"
      :show-zoom="useModal.showZoom"
      transfer
    >
      <vxe-form
        :data="useSearch.fields"
        :items="useSearch.items"
        size="small"
        title-align="top"
        class-name="detailForm"
      >
        <template #formItem1="{ data }">
          <slot name="formItem1" :data="data" />
        </template>
        <template #formItem2="{ data }">
          <slot name="formItem2" :data="data" />
        </template>
        <template #formItem3="{ data }">
          <slot name="formItem3" :data="data" />
        </template>
        <template #formItem4="{ data }">
          <slot name="formItem4" :data="data" />
        </template>
        <template #formItem5="{ data }">
          <slot name="formItem5" :data="data" />
        </template>
      </vxe-form>
    </vxe-modal>
  </div>
</template>

<script>
  import pageData from '@/pageConfig'
  import { mapGetters } from 'vuex'
  import merge from 'xe-utils/merge'
  import clone from 'xe-utils/clone'
  import isEmpty from 'xe-utils/isEmpty'
  import Sortable from 'sortablejs'
  import { dataArrayFormat } from '@/views/dictionaryApi.js'
  const common = {
    config: {
      size: 'small',
      border: true,
      resizable: true,
      showOverflow: true,
      align: 'left',
      // headerAlign: 'center',
      stripe: true,
      headerRowClassName: 'tabh',
      rowConfig: {
        useKey: true,
        isHover: true,
      },
      toolbarConfig: {
        className: 'tabheader',
        custom: { immediate: true, isFooter: false },
        // refresh: {
        //   icon: 'vxe-icon-refresh',
        //   iconLoading: 'vxe-icon-spinner roll',
        // },
        slots: {
          buttons: 'toolbarleft',
          tools: 'toolbarright',
        },
      },
      operate: { button: [], custom: false },
      columns: [],
      columnConfig: {
        useKey: true,
        minWidth: 50,
      },
    },
    pagerConfig: {
      pageSize: 10,
      className: 'pageClass',
      autoHidden: true,
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
        return this.useExpand
          .getData({
            code: row.bom.code,
            version: row.bom.version,
            hasChild: true,
            haveChildLastBomVersion: true,
          })
          .then((res) => {
            return res
          })
      },
    },
    treeConfig: {
      lazy: true,
      line: true,
      transform: false,
      // rowField: 'id',
      // parentField: 'parentId',
      trigger: 'cell',
      hasChild: 'lastBomVersion', //
    },
  }
  export default {
    name: 'BtTablepager',
    props: {
      options: {
        type: Object,
        default: () => {
          return {}
        },
      },
      type: {
        type: String,
        default: 'normal',
      },
    },
    data() {
      return {
        categoryParamsConfig: ['materialGroup', 'code'],
        categoryParams: {},
        defaultOptions: {
          search: {},
          main: {},
          expand: {},
          category: {},
          settings: {},
          modal: {},
        },
        defaultSearch: {
          items: [],
          formRules: {},
          enable: true,
        },
        defaultMain: {
          ...common.config,
          pagerConfig: common.pagerConfig,
          expandConfig: common.expandConfig,
          treeConfig: {
            ...common.treeConfig,
            iconOpen: 'vxe-icon-square-minus-fill',
            iconClose: 'vxe-icon-square-plus-fill',
            loadMethod: ({ row }) => {
              return this.useSearch.getData({
                code: row.code,
                version: row.lastBomVersion,
                hasChild: true,
                haveLastBomVersion: true,
              })
            },
          },
          proxyConfig: {
            seq: true,
            props: {
              result: 'objList',
              total: 'pageDesc.totalRows',
            },
            ajax: {
              query: ({ page }) => {
                return this.useSearch
                  .getData({
                    ...this.useSearch.fields,
                    ...this.categoryParams,
                    ...page,
                  })
                  .then((res) => {
                    if (res.objList) {
                      const oldData = merge(res.objList)
                      res.objList = dataArrayFormat(res.objList)
                      res.objList.$oldData = oldData
                      if (this.useMain.format) {
                        const data = this.useMain.format(res.objList)
                        return data
                      }
                      return res
                    } else {
                      const oldData = merge(res)
                      res = dataArrayFormat(res)
                      res.$oldData = oldData
                      if (this.useMain.format) {
                        const data = this.useMain.format(res)
                        return { objList: data }
                      }
                      // console.log(res)
                      return { objList: res }
                    }
                  })
              },
            },
          },
        },
        defaultExpand: {
          ...common.config,
          pagerConfig: common.pagerConfig,
          expandConfig: common.expandConfig,
          treeConfig: common.treeConfig,
          toolbarConfig: {
            className: 'tabheader',
            custom: { immediate: true, isFooter: false },
          },
        },
        defaultCategory: {
          ...common.config,
          showHeader: false,
          border: 'none',
          stripe: false,
          height: 520,
          toolbarConfig: { enable: false },
          treeConfig: common.treeConfig,
          pagerConfig: { ...common.pagerConfig, autoHidden: true },
          proxyConfig: {
            seq: true,
            props: {
              result: 'objList',
              total: 'pageDesc.totalRows',
            },
            ajax: {
              query: ({ page }) => {
                return this.useCategory
                  .getData({
                    ...this.useCategory.fields,
                    ...page,
                  })
                  .then((res) => {
                    if (res.objList) {
                      if (this.useCategory.format) {
                        const data = this.useCategory.DataFormat(res.objList)
                        return data
                      }
                      return res
                    } else {
                      if (this.useCategory.format) {
                        const data = this.useCategory.DataFormat(res)
                        return { objList: data }
                      }
                      return { objList: res }
                    }
                  })
              },
            },
          },
        },
        defaultSettings: {
          operate: {
            button: [],
            custom: false,
          },
          titleVisable: true,
        },
        defaultModal: {
          visible: false,
          width: '60%',
          height: '50%',
          minHeight: '40%',
          minWidth: '40%',
          showZoom: true,
        },
        useMain: {},
        useExpand: {},
        useCategory: {},
        useSettings: {},
        useModal: {},
        useSearch: {
          fields: {},
        },
        curCategoryRowid: '',
        curRowData: {},
      }
    },

    computed: {
      ...mapGetters({
        userInfo: 'coreUser/userInfo',
        language: 'coreSettings/language',
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
      checkboxList() {
        // console.log(this.$refs)
        return this.$refs.grid.getCheckboxRecords(true)
      },
    },
    watch: {
      // language(val) {
      // },
      options(val) {
        if (!isEmpty(val)) {
          this.init()
          this.$refs.grid.commitProxy('query')
        }
      },
    },
    created() {
      this.init()
      this.columnDrop()
    },
    beforeDestroy() {
      if (this.sortable) {
        this.sortable.destroy()
      }
    },
    mounted() {},
    methods: {
      async init() {
        let path = this.$route.path.replaceAll('/', '$')
        let options = pageData[path]
        if (isEmpty(this.options) && typeof options === 'function') {
          options = await options()
        }
        this.initSearch(options)
        this.initMain(options)
        this.useExpand = merge(
          clone(this.defaultExpand, true),
          this.options.expand || options.expand
        )
        this.useCategory = merge(
          clone(this.defaultCategory, true),
          this.options.category || options.category
        )
        this.useSettings = merge(
          clone(this.defaultSettings, true),
          this.options.settings || options.settings
        )
        this.useModal = merge(
          clone(this.defaultModal, true),
          this.options.modal || options.modal
        )

        if (this.type == 'category') {
          this.categoryParamsConfig =
            this.useCategory.categoryParamsConfig || this.categoryParamsConfig
        }
      },
      initSearch(options) {
        let data = merge(
          clone(this.defaultSearch, true),
          this.options.search || options.search
        )
        if (data.fields && data.fields.unitUnionCode !== undefined) {
          data.items.unshift({
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
        data.items.push({
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
        })
        this.useSearch.fields = data.fields
        this.useSearch.getData = data.getData
        this.useSearch.formRules = data.formRules
        this.useSearch.items = data.items
        this.useSearch.enable = data.enable
      },
      initMain(options) {
        this.useMain = merge(
          clone(this.defaultMain, true),
          this.options.main || options.main
        )
        // console.log(this.options, options.main)
        this.useMain.columns.unshift({
          type: 'seq',
          title: '序号',
          align: 'center',
          width: 50,
        })
        if (this.useMain.operate.button.length) {
          this.useMain.columns.push({
            title: '操作',
            align: 'center',
            fixed: 'right',
            with: 80,
            slots: { default: 'options' },
          })
        }
      },
      openDrawer() {
        this.$refs.btPage.handleOpenDrawer()
      },
      categoryCellDblclick({ row }) {
        this.curCategoryRowid = row._X_ROW_KEY
        this.categoryParams = {
          [this.categoryParamsConfig[0]]: row[this.categoryParamsConfig[1]],
        }
        this.$refs.grid.commitProxy('query')
      },
      formReset({ data, $event }) {
        this.$emit('formReset', data)
      },
      reload() {
        this.$refs.grid.commitProxy('query')
      },
      isCurrentCel(val) {
        if (this.curCategoryRowid == val.rowid) {
          return 'isActive'
        }
      },
      batchOperate(type) {
        this.$emit('batchOperate', {
          name: type,
          data: this.checkboxList,
          query:
            type == 'download' || type == 'export' ? useSearch.fields : null,
        })
      },
      operatehandle(type, row) {
        this.curRowData = row
        this.$emit('operate', {
          name: type,
          data: row,
          search: this.useSearch,
        })
      },
      columnDrop() {
        this.$nextTick(() => {
          if (!this.$refs.grid) {
            return
          }
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
  ::v-deep .category {
    height: calc(100vh - 170px);
    .splitter-pane.vertical.splitter-paneL,
    .splitter-pane.vertical.splitter-paneR {
      height: auto;
    }
    .cellHover {
      &.isActive {
        color: #3f75e1;
        font-weight: 700;
      }
      &:hover {
        user-select: none;
        cursor: pointer;
      }
    }
    .headL {
      font-size: 16px;
      color: #3c64b2;
      display: flex;
      align-items: center;
      position: relative;
      z-index: 1;
      top: 6px;
      margin-bottom: 15px;
      i {
        margin-right: 5px;
        font-size: 20px;
      }
      &::after {
        height: 1px;
        width: 100%;
        content: '';
        position: absolute;
        bottom: -10px;
        left: 0;
        background: #e5e5e5;
      }
    }
  }
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
      margin-left: 10px;
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
  .vxe-cell--tree-node.is--active {
  }
</style>
