<template>
  <el-main class="si">
    <bt-page :title="$route.meta.title" icon-bg-color="#FF866A" :show-drawer="true">
      <!--      <zPageTitle title="设备异常列表" @handleIconClick="openDrawer" />-->
      <div class="s-box">
        <!-- <p style="font-size: 14px">{{ translateTitle('异常设备数') }}：3</p>
         -->
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
        >
          <template #completeTime="scope">
            {{ scope.row.completeTime && scope.row.completeTime.split('T')[0] }}
          </template>
          <template #taskType="scope">
            {{ scope.row.taskType == '1' ? '巡检' : '' }}
            {{ scope.row.taskType == '2' ? '点检' : '' }}
          </template>
          <template #handle="slotData">
            <zDropicon
              :slot-data="slotData"
              :op-list="opList"
              @handleIconFn="handleIconFn"
            />
          </template>
        </zTable>
      </div>
      <el-dialog
        :close-on-click-modal="false"
        :title="translateTitle('点巡检详细记录')"
        width="60%"
        :visible.sync="dialogContentVisible"
        :before-close="handleCloseContentDia"
      >
        <div>
          <el-row style="margin-bottom: 6px">
            <el-col :span="12">计划名称: {{ pData.taskName }}</el-col>
            <el-col :span="12">
              执行班组-人员:
              {{ pData.actionUserNameList && pData.actionUserNameList.join(',') }}
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-table stripe :data="dialogData" height="300">
                <el-table-column
                  prop="contentName"
                  :label="translateTitle('工作内容名称')"
                />
                <el-table-column
                  prop="normalOptionList"
                  :label="translateTitle('正常值')"
                >
                  <template slot-scope="scope">
                    {{
                      scope.row.normalOptionList.length > 0
                        ? scope.row.normalOptionList.join(',')
                        : '-'
                    }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="abnormalOptionList"
                  :label="translateTitle('异常值')"
                >
                  <template slot-scope="scope">
                    {{
                      scope.row.abnormalOptionList.length > 0
                        ? scope.row.abnormalOptionList.join(',')
                        : '-'
                    }}
                  </template>
                </el-table-column>
                <el-table-column :label="translateTitle('参考值')">
                  <template slot-scope="scope">
                    {{ scope.row.minNumber }}-{{ scope.row.maxNumber }}
                  </template>
                </el-table-column>
                <el-table-column :label="translateTitle('点巡检输入值')">
                  <template slot-scope="scope">
                    {{ scope.row.actualValueList.join(',') }}
                  </template>
                </el-table-column>
                <el-table-column :label="translateTitle('点巡检结果')">
                  <template slot-scope="scope">
                    <span v-if="scope.row.isAbnormal" style="color: red">
                      {{ translateTitle('异常') }}
                    </span>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <div style="font-size: 14px; margin-top: 15px">
            <div class="ab-title">{{ translateTitle('异常详情记录') }}</div>
            <div class="ab-con">
              <span style="font-size: 12px">
                {{ curContentData.abnormalRemark }}
              </span>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer form-btns">
          <el-button class="cancelBtn" @click="handleCloseContentDia">
            {{ translateTitle('关闭') }}
          </el-button>
        </span>
      </el-dialog>
      <template slot="drawer">
        <el-form class="si-title-body" :model="form">
          <el-form-item :label="translateTitle('点巡检类型')">
            <el-select v-model="form.taskType" placeholder="" clearable>
              <el-option value="1" :label="translateTitle('巡检')" />
              <el-option value="2" :label="translateTitle('点检')" />
            </el-select>
          </el-form-item>
          <!--<el-form-item :label="translateTitle('厂区筛选')">
            <el-select
              v-model="form.factoryId"
              placeholder=""
              filterable
              clearable
              @change="changeGetWorkSpacePageList"
            >
              <el-option
                v-for="list in factoryList"
                :key="list.id"
                :value="list.id"
                :label="list.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="translateTitle('作业区筛选')">
            <el-select
              v-model="form.workSpaceId"
              placeholder=""
              filterable
              clearable
              @change="changeGetProductionLinePageList"
            >
              <el-option
                v-for="list in workSpaceList"
                :key="list.id"
                :value="list.id"
                :label="list.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="translateTitle('输送线筛选')">
            <el-select
              v-model="form.productionLineId"
              placeholder=""
              filterable
              clearable
              @change="changeGetBeltPageList"
            >
              <el-option
                v-for="list in productLineList"
                :key="list.id"
                :value="list.id"
                :label="list.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="translateTitle('输送带筛选')">
            <el-select v-model="form.coverybeltId" placeholder="" filterable clearable>
              <el-option
                v-for="list in beltList"
                :key="list.id"
                :value="list.id"
                :label="list.coveryBeltName"
              ></el-option>
            </el-select>
          </el-form-item>-->
          <!--<el-form-item :label="translateTitle('设备分类')">-->
          <!--<el-select v-model="form.equipmentTypeId" filterable clearable>-->
          <!--<el-option-->
          <!--v-for="list in deviceTypeList"-->
          <!--:key="list.id"-->
          <!--:value="list.id"-->
          <!--:label="list.name"-->
          <!--&gt;</el-option>-->
          <!--</el-select>-->
          <!--</el-form-item>-->
          <el-form-item :label="translateTitle('区域')">
            <el-cascader
              v-model="form.departId"
              placeholder=""
              clearable
              style="width: 100%"
              :props="propData"
              :show-all-levels="true"
              :options="areaList"
              @change="getDevicePageFn"
            />
          </el-form-item>
          <el-form-item :label="translateTitle('输送机')">
            <el-select
              v-model="form.conveyorId"
              placeholder=""
              filterable
              clearable
            >
              <el-option
                v-for="list in conveyorList"
                :key="list.id"
                :value="list.id"
                :label="list.equipmentName"
              />
            </el-select>
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
import { translateTitle } from '../../i18n'
import { getAbnormalEquip, getPollingTaskInfo, } from '../../api/abnormalEquipment'
import { getPollingDeviceContentById } from '../../api/pollingRecord'
import { listAreaTree } from '../../api/basicSetting/area'
import { listMainEquip } from '../../api/basicSetting/equipPos'
import zTable from '../../components/zTable'
import zDropicon from '../../components/zDropicon'

export default {
  components: {
    zTable,
    zDropicon,
  },
  data () {
    return {
      dialog: false,
      //弹窗内容
      dialogContentVisible: false,
      dialogData: [],
      curContentData: {},
      cols: [
        { slot: 'completeTime', label: '日期', width: 160 },
        {
          prop: 'equipmentName',
          label: '设备名称',
          width: 120,
          showOverflowTooltip: true,
        },
        { slot: 'taskType', label: '点巡检类型' },
        {
          prop: 'taskName',
          label: '计划名称',
          width: 120,
          showOverflowTooltip: true,
        },
        /*{
          prop: 'factoryName',
          label: '厂区名称',
          width: 120,
          showOverflowTooltip: true,
        },
        {
          prop: 'workSpaceName',
          label: '作业区名称',
          width: 120,
          showOverflowTooltip: true,
        },
        {
          prop: 'productionLineName',
          label: '输送线名称',
          width: 120,
          showOverflowTooltip: true,
        },
        {
          prop: 'beltName',
          label: '输送带名称',
          width: 120,
          showOverflowTooltip: true,
        },*/
        {
          prop: 'departName',
          label: '所属区域',
          width: 120,
          showOverflowTooltip: true,
        },
        {
          prop: 'conveyorName',
          label: '所属输送机',
          width: 120,
          showOverflowTooltip: true,
        },
        {
          prop: 'equipmentNo',
          label: '设备编号',
          width: 140,
          showOverflowTooltip: true,
        },
        {
          prop: 'model',
          label: '型号',
          width: 140,
          showOverflowTooltip: true,
        },
        {
          prop: 'specification',
          label: '规格',
          width: 140,
          showOverflowTooltip: true,
        },
        { prop: 'abnormalNum', label: '异常数', width: 100 },
      ],
      opList: [{ value: '查看', disabled: false }],
      form: {
        taskType: '',
        // factoryId: '',
        // workSpaceId: '',
        // productionLineId: '',
        // coverybeltId: '',
        departId: '',
        conveyorId: '',
        equipmentTypeId: '',
      },
      tableData: [],
      total: 0,
      eachPageSize: 10,
      currentPage: 1,
      // deviceTypeList: [],
      // factoryList: [],
      // workSpaceList: [],
      // productLineList: [],
      // beltList: [],
      pData: {},
      conveyorList: [],
      areaList: [],
      propData: {
        label: 'areaName',
        value: 'id',
        children: 'children',
        emitPath: false,
        checkStrictly: true,
      },
    }
  },
  async created () {
    await this.requestData(1, this.eachPageSize)

    this.getDevicePageFn()
    /*getAllDeviceTypeList().then((res) => {
      let { success, data } = res
      if (success) this.deviceTypeList = data
    })
    getFactoryList().then((res) => {
      let { success, data } = res
      if (success) this.factoryList = data
    })
    */
    // getWorkSpacePageList().then((res) => {
    //   let { success, data } = res
    //   if (success) this.workSpaceList = data
    // })
    // getPrdLineList().then((res) => {
    //   let { success, data } = res
    //   if (success) this.productLineList = data
    // })

    listAreaTree().then(res => {
      if (res.success) {
        this.areaList = this.getTreeData(res.data)
        console.log("====ZZ:" + this.areaList)
      }
    })

  },
  methods: {
    translateTitle,
    async requestData (pageNum, pageSize) {
      await getAbnormalEquip({ pageNum, pageSize, ...this.form }).then(
        (res) => {
          let { success, data } = res
          if (!success) return
          this.tableData = data.result
          this.total = data.total
          this.eachPageSize = data.pageSize
          this.currentPage = data.pageNum
        }
      )
    },
    // 获取输送机列表
    getDevicePageFn (areaId) {
      /*
      monitorApi.getConveyorList({params: {current: -1, size: -1, domain}})
        .then((res) => {
          let { success, data } = res
          this.conveyorList = data.records
        })

       */

      listMainEquip({ areaId: areaId }).then(res => {
        if (res.success) {
          this.conveyorList = res.data
          console.log("====YY:" + this.conveyorList)
        }
      })

    },
    /*changeGetWorkSpacePageList(val) {
      this.workSpaceList = []
      this.productLineList = []
      this.beltList = []
      this.form.workSpaceId = ''
      this.form.productionLineId = ''
      this.form.coverybeltId = ''
      getWorkSpacePage({
        pageSize: 99999,
        pageNum: 1,
        factoryId: val,
      }).then((res) => {
        let { success, data } = res
        if (success) this.workSpaceList = data
      })
    },
    changeGetProductionLinePageList(val) {
      this.productLineList = []
      this.beltList = []
      this.form.productionLineId = ''
      this.form.coverybeltId = ''
      getProductLineList({
        pageSize: 99999,
        pageNum: 1,
        workSpaceId: val,
      }).then((res) => {
        let { success, data } = res
        if (success) this.productLineList = data
      })
    },
    changeGetBeltPageList(val) {
      this.beltList = []
      this.form.coverybeltId = ''
      getBeltList({
        pageSize: 99999,
        pageNum: 1,
        coveryLineId: val,
      }).then((res) => {
        let { success, data } = res
        if (success) this.beltList = data
      })
    },*/
    handleCurrentChange (val) {
      this.currentPage = val
      this.requestData(val, this.eachPageSize)
    },
    openDrawer () {
      this.dialog = true
    },
    closeDrawer () {
      this.dialog = false
    },
    doSearch () {
      this.requestData(1, this.eachPageSize)
      this.closeDrawer()
    },
    doRest () {
      this.form = {}
      this.requestData(1, this.eachPageSize)
      this.closeDrawer()
    },
    //查看内容详情
    handleCheckContentDetail (index, row) {
      console.log('查看内容详情--', row)
      this.curContentData = row
      getPollingDeviceContentById({ id: row.taskStandardId }).then((res) => {
        if (res.success == 1) {
          let { data } = res
          this.dialogData = data
          this.dialogContentVisible = true
        }
      })

      getPollingTaskInfo({ taskId: row.taskId }).then((res) => {
        console.log(res)
        if (res.success == 1) {
          let { data } = res
          this.pData = data
        }
      })
    },
    handleIconFn (res) {
      if (res.type === '查看') {
        console.log('chakan')
        this.handleCheckContentDetail(res.index, res.row)
      }
    },
    handleCloseContentDia () {
      this.dialogContentVisible = false
      this.dialogData = []
    },
    getTreeData (data) {
      // 循环遍历json数据
      for (var i = 0; i < data.length; i++) {
        if ((data[i].children == undefined) || (data[i].children.length < 1)) {
          // children若为空数组，则将children设为undefined
          data[i].children = undefined
        } else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].children)
        }
      }
      return data
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '../../css/base';

  .ab-title {
    position: relative;
    padding-bottom: 12px;
    margin-bottom: 15px;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      bottom: -2px;
      width: 100%;
      height: 1px;
      background: #e5e5e5;
    }

    &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -2px;
      width: 32px;
      height: 3px;
      background: $blueColor;
    }
  }

  .ab-con {
    height: 100px;
    padding: 10px;
    background: #f9f9f9;
  }

  .rfidBtn {
    cursor: pointer;
    color: #409eff;
  }
</style>
