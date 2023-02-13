<template>
  <el-main class="si">
    <bt-page :title="$route.meta.title" icon-bg-color="#FF866A" :show-drawer="true">
      <!--      <zPageTitle-->
      <!--        title="点巡检标准"-->
      <!--        show-filter-->
      <!--        @handleIconClick="handleIconClick"-->
      <!--      >-->
      <!--        <zDropdown-->
      <!--          v-show="hasPermission('DXJ-BZ-add')"-->
      <!--          :drop-data="[]"-->
      <!--          @handleClick="addNewStanderd"-->
      <!--          @handleDropClick="handleCommand"-->
      <!--        />-->
      <!--      </zPageTitle>-->
      <template slot="option">
        <bt-dropdown>
          <i class="el-icon-plus" />
          操作
          <bt-dropdown-menu>
            <bt-dropdown-item v-show="hasPermission('DXJ-BZ-add')" @click="addNewStanderd">
              <i class="el-icon-plus" />
              新建
            </bt-dropdown-item>
          </bt-dropdown-menu>
        </bt-dropdown>
      </template>
      <div>
        <zTable
          ref="zTable"
          :table-data="tableData"
          :cols="cols"
          :total="total"
          :each-page-size="eachPageSize"
          :current-page="currentPage"
          :show-index="true"
          :show-handle="true"
          @pageChange="handleCurrentChange"
          @sizeChange="handleSizeChange"
        >
          <template #effectiveTime="scope">
            {{
              scope.row.effectiveTime && scope.row.effectiveTime.split(' ')[0]
            }}
          </template>
          <template #ineffectiveTime="scope">
            {{ scope.row.ineffectiveTime && scope.row.ineffectiveTime.split(' ')[0] }}
          </template>

          <template #fileUrl="scope">
            <img
              v-if="scope.row.fileType === 'img'"
              :src="scope.row.fileUrl"
              width="40"
              height="40"
              class="head_pic"
              @click="viewFiles(scope.row.fileUrl)"
            >
            <video
              v-if="scope.row.fileType === 'video'"
              :src="scope.row.fileUrl"
              width="40"
              height="40"
              controls="controls"
            >
              您的浏览器不支持视频播放
            </video>
            <img
              v-if="scope.row.fileType === 'pdf' && scope.row.fileUrl"
              src="@/assets/images/inspect/file_pdf.png"
              title="点击下载pdf"
              width="40"
              height="40"
              class="head_pic"
              @click="downFiles(scope.row.fileUrl)"
            >
            <img
              v-if="scope.row.fileType === 'word' && scope.row.fileUrl"
              src="@/assets/images/inspect/file_word.png"
              title="点击下载word"
              width="40"
              height="40"
              class="head_pic"
              @click="downFiles(scope.row.fileUrl)"
            >
          </template>

          <template #handle="slotData">
            <zDropicon
              :slot-data="slotData"
              :op-list="standardOpList"
              @handleIconFn="handleIconStandard"
            />
          </template>
        </zTable>
      </div>

      <el-dialog center :visible.sync="dialogVisible" width="50%">
        <bt-title title="预览" />
        <img :src="codeImg" style="width: 100%; height: 100%">
      </el-dialog>

      <template slot="drawer">
        <el-form class="si-title-body" @submit.native.prevent>
          <el-form-item :label="translateTitle('标准类型')">
            <el-select v-model="searchData.standardType" placeholder="" clearable>
              <el-option
                v-for="list in standardTypeSelect"
                :key="list.code"
                :value="list.code"
                :label="list.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="translateTitle('标准名称')">
            <el-input v-model="searchData.standardName" />
          </el-form-item>
          <el-button class="bt-search_btn" type="primary" @click="doSearch">查询</el-button>
          <el-button class="common-search__reset" type="default" @click="doRest">重置</el-button>
        </el-form>
      </template>

      <!--      <zDrawer-->
      <!--        :visible="dialog"-->
      <!--        @closeDrawer="closeDrawer"-->
      <!--        @doSearch="doSearch"-->
      <!--        @doRest="doRest"-->
      <!--      >-->
      <!--      </zDrawer>-->
    </bt-page>
  </el-main>
</template>

<script>
import { hasPermission } from '@/utils/hasPermission'
import { translateTitle } from '../../i18n'
import { getSelectEnums } from '../../api/index'
import { deletePollingStandardById, getStandardList, } from '../../api/standard'
import zTable from '../../components/zTable'
import zDropicon from '../../components/zDropicon'

export default {
  components: {
    zTable,
    zDropicon
  },
  data () {
    return {
      code: 'em:polling_standard',
      actionUrl: ``,
      fileList: [],
      fileType: '',
      level3List: [],
      dialog: false,
      //标准操作list
      standardOpList: [
        { value: '查看', disabled: false, hasPermission: 'DXJ-BZ-view' },
        { value: '编辑', disabled: false, hasPermission: 'DXJ-BZ-edit' },
        { value: '删除', disabled: false, hasPermission: 'DXJ-BZ-delete' },
      ],
      //内容操作list
      contentOpList: [
        { value: '编辑', disabled: false },
        { value: '删除', disabled: false },
      ],
      cols: [
        {
          prop: 'version',
          label: '版本号',
          showOverflowTooltip: true,
        },
        {
          prop: 'standardName',
          label: '点巡检标准名称',
          width: 200,
          showOverflowTooltip: true,
        },
        {
          prop: 'standardType',
          label: '标准类型',
          showOverflowTooltip: true,
        },
        {
          prop: 'equipmentTypeName',
          label: '设备分类',
          showOverflowTooltip: true,
        },
        {
          slot: 'effectiveTime',
          label: '生效日期',
          showOverflowTooltip: true,
        },
        {
          slot: 'ineffectiveTime',
          label: '失效日期',
          showOverflowTooltip: true,
        },
        {
          slot: 'fileUrl',
          label: '文档',
          showOverflowTooltip: true,
        },
      ],
      addFlag: false,
      editFlag: false,
      onlyRead: false,
      //编辑工作内容
      editContentFlag: false,
      editContentIndex: -1,
      tableData: [],
      tableContentData: [],
      tableLoading: false,
      total: 1,
      eachPageSize: 10,
      currentPage: 1,
      searchData: {
        standardName: '',
      },
      curStandardData: null,
      //巡检标准下拉枚举
      ENUM_KEY: 'POLLING_TYPE',
      //巡检标准类型列表
      standardTypeSelect: [],
      //填表方式下拉枚举
      ENUM_KEY2: 'POLLING_CONTENT_TYPE',
      ENUM_KEY3: 'POLLING_CONTENT_ACTUAL',
      //填表方式下拉列表
      contentTypeSelect: [],
      contentActualTypeSelect: [],
      codeImg: '',
      dialogVisible: false,
    }
  },
  watch: {
    onlyRead (newVal, oldVal) {
      if (newVal) {
        this.contentOpList.forEach((item) => (item.disabled = true))
      } else {
        this.contentOpList.forEach((item) => (item.disabled = false))
      }
    },
    '$i18n.locale' () {
      this.setRules()
    },
  },
  async created () {
    this.showOrHidden(this.standardOpList)
    this.requestData(1, this.eachPageSize)

    //selectEnums
    await getSelectEnums().then((res) => {
      let enumData = res.data
      this.standardTypeSelect = enumData[this.ENUM_KEY]
      this.contentTypeSelect = enumData[this.ENUM_KEY2]
      this.contentActualTypeSelect = enumData[this.ENUM_KEY3]
    })
    /* console.log('巡检标准下拉枚举--', this.standardTypeSelect)
    console.log('填表方式下拉枚举--', this.contentTypeSelect) */
  },
  mounted () {
  },
  methods: {
    hasPermission,
    translateTitle,
    handleIconClick () {
      this.dialog = true
    },
    //点击添加
    addNewStanderd () {
      this.$router.push({ name: 'standardAdd' })
    },
    doSearch () {
      this.requestData(1, this.eachPageSize)
      this.closeDrawer()
    },
    doRest () {
      this.searchData = {}
      this.requestData(1, this.eachPageSize)
      this.closeDrawer()
    },
    //当前选中的标准
    handleCurStandardChange (val) {
      this.curStandardData = val
    },
    handleSizeChange (val) {
      this.eachPageSize = val
      this.currentPage = 1
      this.requestData(1, this.eachPageSize)
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.requestData(val, this.eachPageSize)
    },
    requestData (pageNum, pageSize = 10) {
      getStandardList({
        pageNum,
        pageSize,
        ...this.searchData,
      }).then((res) => {
        if (res.success == 1) {
          let { data } = res
          this.currentPage = data.pageNum
          this.eachPageSize = data.pageSize
          this.total = data.total
          data.result.forEach((item) => {
            if (item.standardType == '1') {
              item.standardType = '巡检'
            } else if (item.standardType == '2') {
              item.standardType = '点检'
            }
          })
          this.tableData = data.result
        }
      })
    },
    //删除巡检标准
    handleDeleteStandard (index, row) {
      this.$confirm(
          this.translateTitle('确定本次操作吗执行后将不可撤销'),
          this.translateTitle('警告'),
          {
            confirmButtonText: this.translateTitle('确定'),
            cancelButtonText: this.translateTitle('取消'),
            type: 'warning',
            center: true,
          }
        )
        .then((res) => {
          deletePollingStandardById({ id: row.id }).then((res) => {
            if (res.success == 1) {
              this.$msg({
                message: this.translateTitle('删除成功'),
                type: 'success',
              })
              this.requestData(1, this.eachPageSize)
            }
          })
        })
        .catch((e) => {})
    },
    //点击编辑巡检标准
    handleEditStandard (index, row) {
      this.$router.push({
        path: 'standardAdd',
        query: {
          params: JSON.stringify({
            isEdit: true,
            data: row,
          }),
        },
      })
    },
    //查看标准详情
    handleCheckStandard (index, row) {
      this.$router.push({
        path: 'standardAdd',
        query: {
          params: JSON.stringify({
            isEdit: true,
            onlyRead: true,
            data: row,
          }),
        },
      })
    },
    showOrHidden (arr) {
      arr.forEach((item) => {
        item.disabled = hasPermission(item.hasPermission) ? false : true
      })
    },
    handleCommand (command) {
      if (command == 'create') this.addNewStanderd()
    },
    closeDrawer () {
      this.dialog = false
    },
    handleIconStandard (res) {
      switch (res.type) {
        case '查看':
          this.handleCheckStandard(res.index, res.row)
          break
        case '编辑':
          this.handleEditStandard(res.index, res.row)
          break
        case '删除':
          this.handleDeleteStandard(res.index, res.row)
          break
      }
    },
    downFiles (url) {
      window.open(url)
    },
    viewFiles (url) {
      this.codeImg = url
      this.dialogVisible = true
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '../../css/base';
</style>
