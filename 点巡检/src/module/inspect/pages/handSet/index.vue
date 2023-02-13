<template>
  <el-main class="si">
    <bt-page :title="$route.meta.title" icon-bg-color="#FF866A">
      <template slot="option">
        <bt-dropdown>
          <i class="el-icon-plus" />
          操作
          <bt-dropdown-menu>
            <bt-dropdown-item v-show="hasPermission('DXJXTSZ-SCSB-add')" @click="handleDropClick">
              <i class="el-icon-plus" />
              新建
            </bt-dropdown-item>
          </bt-dropdown-menu>
        </bt-dropdown>
      </template>
      <!--      <zPageTitle title="手持终端管理" :show-filter="false">-->
      <!--        <zDropdown-->
      <!--          v-show="tipIndex == 1 && hasPermission('DXJXTSZ-SCSB-add')"-->
      <!--          :drop-data="dropData"-->
      <!--          @handleClick="handleDropClick"-->
      <!--          @handleDropClick="handleCommand"-->
      <!--        />-->
      <!--      </zPageTitle>-->
      <el-row v-show="tipIndex == 1" class="s-box">
        <zTable
          ref="zTable"
          :table-data="tableData"
          :cols="cols"
          :total="total"
          :current-page="currentPage"
          :show-handle="true"
          :show-index="true"
          @pageChange="handleCurrentChange"
        >
          <template #handle="slotData">
            <zDropicon
              :slot-data="slotData"
              :op-list="opList"
              @handleIconFn="handleHandSet"
            />
          </template>
        </zTable>
      </el-row>
    </bt-page>
  </el-main>
</template>

<script>
import { hasPermission } from '@/utils/hasPermission'
import { translateTitle } from '../../i18n'
import zTable from '../../components/zTable'
import zDropicon from '../../components/zDropicon'
import { deleteTerminal, getTerminalList, } from '../../api/handSet'

export default {
  components: {
    zTable,
    // zDropdown,
    // zPageTitle,
    zDropicon,
  },
  data () {
    return {
      tipIndex: '1',
      opList: [
        {
          value: '查看',
          disabled: false,
          hasPermission: 'DXJXTSZ-SCSB-view',
        },
        {
          value: '编辑',
          disabled: false,
          hasPermission: 'DXJXTSZ-SCSB-edit',
        },
        {
          value: '删除',
          disabled: false,
          hasPermission: 'DXJXTSZ-SCSB-delete',
        },
      ],
      cols: [
        { label: '设备名称', prop: 'name', width: '160' },
        { label: 'IMEI', prop: 'uuid', width: '140' },
        { label: '设备型号', prop: 'terminalModel', width: '140' },
        { label: 'RFID频率', prop: 'rfidFrequency', width: '80' },
        { label: 'RFID功率', prop: 'rfidPower', width: '80' },
        { label: '所属厂区', prop: 'factoryName' },
        { label: '当前状态', prop: 'isEnabled', width: '80' },
      ],
      dropData: [],
      code: 'sys:terminal',
      level3List: [],
      dialogVisible: false,
      dialogVisible2: false,
      isCreate: true,
      addFlag: true,
      editFlag: false,
      onlyRead: false,
      currentPage: 1,
      tableData: [],
      editData: {},
      curIndex: -1,
      tableLoading: false,
      total: 1,
      eachPageSize: 10,
      formRules: {},
    }
  },
  watch: {
    '$i18n.locale' () {
      this.setRules()
    },
  },
  created () {
    this.requestData(1, this.eachPageSize)

    this.showOrHidden(this.opList)
  },
  mounted () {
  },
  methods: {
    hasPermission,
    translateTitle,
    changeTag (index) {
      this.tipIndex = index
      if (index == 1) {
        this.$nextTick(() => {
          this.$refs.zTable.doLayout()
        })
      }
    },
    requestData (pageNum, pageSize) {
      getTerminalList({ pageNum, pageSize }).then((res) => {
        let { success, data } = res
        if (!success) return
        console.log('设备数据--', data)
        this.currentPage = data.pageNum
        this.eachPageSize = data.pageSize
        this.total = data.total
        data.result.forEach((item) => {
          item.isEnabled
            ? (item.isEnabled = '启用中')
            : (item.isEnabled = '禁用')
        })
        this.tableData = data.result
      })
    },
    handleView (index, row) {
      this.$router.push({
        path: 'handSetAdd',
        query: {
          params: JSON.stringify({
            isEdit: true,
            onlyRead: true,
            data: row,
          }),
        },
      })
    },
    handleEdit (index, row) {
      this.$router.push({
        path: 'handSetAdd',
        query: {
          params: JSON.stringify({
            isEdit: true,
            data: row,
          }),
        },
      })

    },
    handleDelete (index, row) {
      console.log(index, row)
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
          deleteTerminal({
            id: row.id,
          }).then((res) => {
            console.log(res)
            if (res.success == 1) {
              this.requestData(1, this.eachPageSize)
              this.$msg({
                message: this.translateTitle('删除成功'),
                type: 'success',
              })
            }
          })
        })
        .catch((e) => {})
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.requestData(val, this.eachPageSize)
    },
    showOrHidden (arr) {
      arr.forEach((item) => {
        item.disabled = hasPermission(item.hasPermission) ? false : true
      })
    },
    handleCommand (command) {
      if (command == 'create') {
        this.$router.push({ name: 'handSetAdd' })
      }
    },
    handleDropClick () {
      this.$router.push({ name: 'handSetAdd' })
    },
    handleHandSet (res) {
      switch (res.type) {
        case '查看':
          this.handleView(res.index, res.row)
          break
        case '编辑':
          this.handleEdit(res.index, res.row)
          break
        case '删除':
          this.handleDelete(res.index, res.row)
          break
      }
    },
  },
}
</script>

<style scoped lang="scss">
  @import '../../css/base';
</style>
