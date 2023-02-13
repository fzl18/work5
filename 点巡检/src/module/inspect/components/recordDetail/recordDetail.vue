<template>
  <div>
    <el-row>
      <el-col>
        <el-row class="topItems">
          <el-col class="item">
            <span class="title">{{ translateTitle('计划名称') }}: &nbsp;</span>
            <span class="con">{{ curTaskDetail.taskName }}</span>
          </el-col>
          <el-col class="item">
            <span class="title">{{ translateTitle('执行班组-人员') }}: &nbsp;</span>
            <span class="con">{{ actions }}</span>
          </el-col>
          <el-col class="item">
            <span class="title">
              {{ translateTitle('开始时间') }}: &nbsp;
            </span>
            <span class="con">{{ curTaskDetail.startTime }}</span>
          </el-col>
          <el-col class="item">
            <span class="title">
              {{ translateTitle('结束时间') }}: &nbsp;
            </span>
            <span class="con">{{ curTaskDetail.endTime }}</span>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="24">
        <zTable
          ref="recordInTable"
          :table-data="
            curTaskDetail.taskStandardVOList
              ? curTaskDetail.taskStandardVOList
              : []
          "
          :cols="recordInCols"
          :show-index="true"
          :show-pagination="false"
          :show-handle="true"
          height="500"
        >
          <template #equipUploadVOList="scope">
            <span v-if="!scope.row.equipUploadVOList && scope.row.scanningTime">
              {{ translateTitle('自动') }} {{ scope.row.scanningTime }}
            </span>
            <span
              v-if="scope.row.equipUploadVOList"
              class="rfidBtn"
              @click="checkRFIDImg(scope.row)"
            >
              {{ translateTitle('手动') }} {{ scope.row.scanningTime }}
            </span>
          </template>
          <template #abnormalNum="scope">
            {{ scope.row.abnormalNum == '0' ? '' : scope.row.abnormalNum }}
          </template>
          <template #abImg="scope">
            <el-button
              v-if="
                scope.row.abnormalUploadVOList &&
                  scope.row.abnormalUploadVOList.length > 0
              "
              type="text"
              size="small"
              @click="handleCheckImgs(scope.row)"
            >
              {{ translateTitle('查看') }}
            </el-button>
          </template>
          <template #handle="slotData">
            <zDropicon
              :slot-data="slotData"
              :op-list="recordInOpList"
              @handleIconFn="handleIconRecordIn"
            />
          </template>
        </zTable>
      </el-col>
      <el-col class="btn-align-center form-btns" style="margin-top: 20px">
        <el-button class="cancelBtn" @click="goBack">
          {{ translateTitle('关闭') }}
        </el-button>
      </el-col>
    </el-row>
    <el-dialog
      :close-on-click-modal="false"
      :title="translateTitle('点巡检详细记录')"
      width="60%"
      :visible.sync="dialogContentVisible"
      :before-close="handleCloseContentDia"
    >
      <div>
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
    <!-- 显示大图 -->
    <el-dialog
      title="查看大图"
      :close-on-click-modal="false"
      :visible.sync="checkImgFlag"
    >
      <img width="100%" :src="checkImageUrl" alt="">
    </el-dialog>
    <el-dialog
      title="异常图片"
      width="60%"
      :close-on-click-modal="false"
      :visible.sync="abnormalImgsFlag"
    >
      <el-row>
        <el-col
          v-for="img in curContentImgList"
          :key="img.id"
          style="padding: 0 5px"
          :span="8"
        >
          <img
            style="cursor: pointer"
            width="100%"
            :src="img.fileUrl"
            alt=""
            @click="viewBigImg(img.fileUrl)"
          >
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog
      title="RFID感应异常图"
      width="60%"
      :close-on-click-modal="false"
      :visible.sync="rfidDialog"
    >
      <el-row type="flex" justify="center">
        <el-col
          v-for="img in RFIDImgList"
          :key="img.id"
          style="padding: 0 5px"
          :span="8"
        >
          <img
            style="cursor: pointer"
            width="100%"
            :src="img.fileUrl"
            alt=""
            @click="viewBigImg(img.fileUrl)"
          >
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { translateTitle } from '../../i18n'
import { getPollingDeviceContentById } from '../../api/pollingRecord'
import zTable from '../../components/zTable'
import zDropicon from '../../components/zDropicon'

export default {
  components: {
    zTable,
    zDropicon,
  },
  props: {
    curTaskDetail: {
      type: Object,
      default: () => {},
    },
  },
  data () {
    return {
      recordInCols: [
        // { prop: 'productionLineName', label: '所属输送线', width: '120' },
        { prop: 'mainEquipmentName', label: '所属输送机', width: '120' },
        { prop: 'managementPointName', label: '所属管理点', width: '120' },
        { prop: 'equipmentNo', label: '设备编号', width: '160' },
        { prop: 'equipmentName', label: '设备名称', width: '160' },
        { prop: 'model', label: '型号', width: '160' },
        { prop: 'specification', label: '规格', width: '160' },
        { slot: 'equipUploadVOList', label: '设备感应时间', width: '160' },
        { prop: 'completeTime', label: '结束时间', width: '160' },
        { prop: 'contentNum', label: '应检工作项', width: '100' },
        { slot: 'abnormalNum', label: '异常项' },
        { prop: 'skipReason', label: '跳过原因', width: '180' },
        { slot: 'abImg', label: '异常图片' },
      ],
      recordInOpList: [{ value: '查看', disabled: false }],
      dialogContentVisible: false,
      dialogData: [],
      //当前内容详情 异常图片列表
      curContentImgList: [],
      //当前内容详情
      curContentData: {},
      //查看大图
      checkImageUrl: '',
      checkImgFlag: false,
      //异常图片
      abnormalImgsFlag: false,
      //RFID异常图片
      RFIDImgList: [],
      rfidDialog: false,
    }
  },
  computed: {
    actions () {
      if (this.curTaskDetail.actionUserNameList) {
        return this.curTaskDetail.actionUserNameList.join(' ')
      } else {
        return ''
      }
    },
    splitStartTime () {
      if (this.curTaskDetail.createdTime) {
        return this.curTaskDetail.createdTime.split(' ')[0]
      } else {
        return ''
      }
    },
  },
  methods: {
    translateTitle,
    handleIconRecordIn (res) {
      console.log(res)
      if (res.type === '查看')
        this.handleCheckContentDetail(res.index, res.row)
    },
    goBack () {
      this.$emit('goBack')
    },
    //关闭弹窗
    handleCloseContentDia () {
      this.dialogData = []
      this.dialogContentVisible = false
    },
    //查看异常图片
    handleCheckImgs (row) {
      if (row.abnormalUploadVOList) {
        this.curContentImgList = row.abnormalUploadVOList
        this.abnormalImgsFlag = true
      }
    },
    //查看rfid异常图片
    checkRFIDImg (row) {
      console.log(row)
      this.RFIDImgList = row.equipUploadVOList
      this.rfidDialog = true
    },
    //查看内容详情
    handleCheckContentDetail (index, row) {
      console.log('查看内容详情--', row)
      this.curContentData = row
      getPollingDeviceContentById({ id: row.id }).then((res) => {
        if (res.success == 1) {
          let { data } = res
          this.dialogData = data
          this.dialogContentVisible = true
        }
      })
    },
    //查看大图
    viewBigImg (url) {
      console.log(url)
      this.checkImageUrl = url
      this.checkImgFlag = true
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '../../css/base';

  .topItems {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
  }

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
