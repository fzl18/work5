<template>
  <el-main class="page-index si">
    <el-card
      class="box-card si-card"
      shadow="hover"
      style="margin-bottom: 1.35%"
    >
      <div slot="header" class="z-card-header">
        <span>{{ translateTitle('输送线故障统计') }}</span>
        <el-row class="choose-time">
          <span
            v-for="(date, index) in dateList"
            :key="index"
            :class="{ active: index == lineDateIndex }"
            @click="changeLineDate(index)"
          >
            {{ translateTitle(date.label) }}
          </span>
        </el-row>
      </div>
      <el-scrollbar class="item-box">
        <div v-for="(line, index) in topLines" :key="index" class="item">
          <h5 class="item-title">输送线:{{ line.lineName }}</h5>
          <div class="center">
            <div class="d-bug">
              <span>{{ translateTitle('设备故障') }}</span>
              <p class="num">{{ line.equipmentFaultNum }}</p>
            </div>
            <div class="d-fix">
              <span>{{ translateTitle('设备维修') }}</span>
              <p class="num">{{ line.equipmentMaintenanceNum }}</p>
            </div>
          </div>
          <ul
            class="bot"
            :class="{ en: $i18n.locale == 'en', zh: $i18n.locale == 'zh' }"
          >
            <li>
              <span class="num">{{ line.allPollingNum }}</span>
              <div class="line">
                <el-progress
                  :stroke-width="15"
                  class="z-line"
                  :show-text="false"
                  :percentage="100"
                />
              </div>
              <span class="desc">{{ translateTitle('应巡') }}</span>
            </li>
            <li>
              <span class="num">{{ line.actualPollingNum }}</span>
              <div class="line">
                <el-progress
                  :stroke-width="15"
                  class="z-line"
                  :show-text="false"
                  :percentage="
                    line.actualPollingNum == 0
                      ? 0
                      : (line.actualPollingNum / line.allPollingNum) * 100
                  "
                />
              </div>
              <span class="desc">{{ translateTitle('实巡') }}</span>
            </li>
            <li>
              <span class="num">{{ line.omitPollingNum }}</span>
              <div class="line">
                <el-progress
                  :stroke-width="15"
                  class="z-line"
                  :show-text="false"
                  :percentage="
                    line.omitPollingNum == 0
                      ? 0
                      : (line.omitPollingNum / line.allPollingNum) * 100
                  "
                />
              </div>
              <span class="desc">{{ translateTitle('漏检') }}</span>
            </li>
            <li>
              <span class="num">{{ line.abnormalPollingNum }}</span>
              <div class="line">
                <el-progress
                  :stroke-width="15"
                  class="z-line"
                  :show-text="false"
                  :percentage="
                    line.abnormalPollingNum == 0
                      ? 0
                      : (line.abnormalPollingNum / line.allPollingNum) * 100
                  "
                />
              </div>
              <span class="desc">{{ translateTitle('异常') }}</span>
            </li>
          </ul>
        </div>
      </el-scrollbar>
    </el-card>

    <el-row type="flex" justify="space-between" style="margin-bottom: 1.35%">
      <el-col class="top-half11" style="width: 49.3%">
        <el-card class="center-box si-card" shadow="hover">
          <div slot="header" class="z-card-header">
            <span>{{ translateTitle('巡检任务') }}</span>
            <el-row class="choose-time">
              <span
                v-for="(date, index) in dateList"
                :key="index"
                :class="{ active: index + 1 == roundIndex }"
                @click="pollingChangeDate(1, index + 1, date.value)"
              >
                {{ translateTitle(date.label) }}
              </span>
            </el-row>
          </div>
          <el-row
            style="padding: 50px 0"
            type="flex"
            justify="space-between"
            @click.native="naviTo('Record', '0')"
          >
            <el-row class="circle-part" style="width: 50%">
              <el-col class="z-circle">
                <el-progress
                  :width="190"
                  :stroke-width="8"
                  type="circle"
                  class="circle1"
                  :format="format"
                  :percentage="roundPollingData.completeRate"
                />
              </el-col>
            </el-row>
            <el-row class="text-box" style="width: 50%">
              <el-col>
                <p>
                  {{ translateTitle('已完成任务数') }}
                  <el-tooltip effect="dark">
                    <div slot="content">
                      {{
                        translateTitle(
                          '选择时间内所有点巡检记录中已完成的任务数量之和，含已完成，已跳过两种完成状态'
                        )
                      }}
                    </div>
                    <i class="ri-question-fill" />
                  </el-tooltip>
                </p>
                <span>
                  {{
                    roundPollingData.finished ? roundPollingData.finished : 0
                  }}
                </span>
              </el-col>
              <el-col>
                <p>
                  {{ translateTitle('未完成任务数') }}
                  <el-tooltip effect="dark">
                    <div slot="content">
                      {{
                        translateTitle(
                          '选择时间内所有点巡检记录中未完成的任务数量之和，含待执行，执行中，已漏检三种状态'
                        )
                      }}
                    </div>
                    <i class="ri-question-fill" />
                  </el-tooltip>
                </p>
                <span>
                  {{
                    roundPollingData.nonFinished
                      ? roundPollingData.nonFinished
                      : 0
                  }}
                </span>
              </el-col>
              <el-col>
                <p>
                  {{ translateTitle('漏检设备数') }}
                  <el-tooltip effect="dark">
                    <div slot="content">
                      {{
                        translateTitle(
                          '选择时间内已完成任务中漏检的设备数量之和'
                        )
                      }}
                    </div>
                    <i class="ri-question-fill" />
                  </el-tooltip>
                </p>
                <span>
                  {{ roundPollingData.omitNum ? roundPollingData.omitNum : 0 }}
                </span>
              </el-col>
              <el-col>
                <p>
                  {{ translateTitle('异常设备数') }}
                  <el-tooltip effect="dark">
                    <div slot="content">
                      {{
                        translateTitle(
                          '选择时间内已完成任务中异常的设备数量之和'
                        )
                      }}
                    </div>
                    <i class="ri-question-fill" />
                  </el-tooltip>
                </p>
                <span>
                  {{
                    roundPollingData.abnormalNum
                      ? roundPollingData.abnormalNum
                      : 0
                  }}
                </span>
              </el-col>
              <el-col>
                <p>
                  {{ translateTitle('跳过设备数') }}
                  <el-tooltip effect="dark">
                    <div slot="content">
                      {{
                        translateTitle(
                          '选择时间内已完成任务中跳过的设备数量之和'
                        )
                      }}
                    </div>
                    <i class="ri-question-fill" />
                  </el-tooltip>
                </p>
                <span>
                  {{
                    roundPollingData.skippedNum
                      ? roundPollingData.skippedNum
                      : 0
                  }}
                </span>
              </el-col>
            </el-row>
          </el-row>
        </el-card>
      </el-col>
      <el-col class="top-half11" style="width: 49.3%">
        <el-card class="center-box si-card" shadow="hover">
          <div slot="header" class="z-card-header">
            <span>{{ translateTitle('点检任务') }}</span>
            <div class="choose-time">
              <span
                v-for="(date, index) in dateList"
                :key="index"
                :class="{ active: index + 1 == spotIndex }"
                @click="pollingChangeDate(2, index + 1, date.value)"
              >
                {{ translateTitle(date.label) }}
              </span>
            </div>
          </div>
          <el-row
            style="padding: 50px 0"
            type="flex"
            justify="space-between"
            @click.native="naviTo('Record', '0')"
          >
            <el-row class="circle-part" style="width: 50%">
              <div class="z-circle">
                <el-progress
                  :width="190"
                  :stroke-width="8"
                  type="circle"
                  class="circle2"
                  :percentage="spotPollingData.completeRate"
                />
              </div>
            </el-row>
            <el-row class="text-box" style="width: 50%">
              <el-col>
                <p>
                  {{ translateTitle('已完成任务数') }}
                  <el-tooltip effect="dark">
                    <div slot="content">
                      {{
                        translateTitle(
                          '选择时间内所有点巡检记录中已完成的任务数量之和，含已完成，已跳过两种完成状态'
                        )
                      }}
                    </div>
                    <i class="ri-question-fill" />
                  </el-tooltip>
                </p>
                <span>
                  {{ spotPollingData.finished ? spotPollingData.finished : 0 }}
                </span>
              </el-col>
              <el-col>
                <p>
                  {{ translateTitle('未完成任务数') }}
                  <el-tooltip effect="dark">
                    <div slot="content">
                      {{
                        translateTitle(
                          '选择时间内所有点巡检记录中未完成的任务数量之和，含待执行，执行中，已漏检三种状态'
                        )
                      }}
                    </div>
                    <i class="ri-question-fill" />
                  </el-tooltip>
                </p>
                <span>
                  {{
                    spotPollingData.nonFinished
                      ? spotPollingData.nonFinished
                      : 0
                  }}
                </span>
              </el-col>
              <el-col>
                <p>
                  {{ translateTitle('漏检设备数') }}
                  <el-tooltip effect="dark">
                    <div slot="content">
                      {{
                        translateTitle(
                          '选择时间内已完成任务中漏检的设备数量之和'
                        )
                      }}
                    </div>
                    <i class="ri-question-fill" />
                  </el-tooltip>
                </p>
                <span>
                  {{ spotPollingData.omitNum ? spotPollingData.omitNum : 0 }}
                </span>
              </el-col>
              <el-col>
                <p>
                  {{ translateTitle('异常设备数') }}
                  <el-tooltip effect="dark">
                    <div slot="content">
                      {{
                        translateTitle(
                          '选择时间内已完成任务中异常的设备数量之和'
                        )
                      }}
                    </div>
                    <i class="ri-question-fill" />
                  </el-tooltip>
                </p>
                <span>
                  {{
                    spotPollingData.abnormalNum
                      ? spotPollingData.abnormalNum
                      : 0
                  }}
                </span>
              </el-col>
              <el-col>
                <p>
                  {{ translateTitle('跳过设备数') }}
                  <el-tooltip effect="dark">
                    <div slot="content">
                      {{
                        translateTitle(
                          '选择时间内已完成任务中跳过的设备数量之和'
                        )
                      }}
                    </div>
                    <i class="ri-question-fill" />
                  </el-tooltip>
                </p>
                <span>
                  {{
                    spotPollingData.skippedNum ? spotPollingData.skippedNum : 0
                  }}
                </span>
              </el-col>
            </el-row>
          </el-row>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="box-card si-card" shadow="hover" style="margin-bottom: 0">
      <div slot="header">
        <span>{{ translateTitle('工单管理') }}</span>
      </div>
      <el-row class="workorder">
        <el-col @click.native="naviToWorkOrder('1')">
          <i class="el-icon-document-copy font44" />
          <div class="right-text">
            <p>{{ translateTitle('全部工单') }}</p>
            <span>{{ workOrderData.totalNum }}</span>
          </div>
        </el-col>
        <el-col @click.native="naviToWorkOrder('1', '1')">
          <i class="el-icon-document-add font44" />
          <div class="right-text">
            <p>{{ translateTitle('待审批') }}</p>
            <span>{{ workOrderData.waitApproveNum }}</span>
          </div>
        </el-col>
        <el-col @click.native="naviToWorkOrder('1', '3')">
          <i class="el-icon-connection font44" />
          <div class="right-text">
            <p>{{ translateTitle('待维修') }}</p>
            <span>{{ workOrderData.waitExecuteNum }}</span>
          </div>
        </el-col>
        <el-col @click.native="naviToWorkOrder('1', '4')">
          <i class="el-icon-edit-outline font44" />
          <div class="right-text">
            <p>{{ translateTitle('维修中') }}</p>
            <span>{{ workOrderData.executingNum }}</span>
          </div>
        </el-col>
        <el-col @click.native="naviToWorkOrder('1', '5')">
          <i class="el-icon-tickets font44" />
          <div class="right-text">
            <p>{{ translateTitle('待验收') }}</p>
            <span>{{ workOrderData.waitCheckNum }}</span>
          </div>
        </el-col>
        <el-col @click.native="naviToWorkOrder('1', '6')">
          <i class="el-icon-document-checked font44" />
          <div class="right-text">
            <p>{{ translateTitle('已完成') }}</p>
            <span>{{ workOrderData.completedNum }}</span>
          </div>
        </el-col>
        <el-col @click.native="naviToWorkOrder('1', '2')">
          <i class="el-icon-document-delete font44" />
          <div class="right-text">
            <p>{{ translateTitle('已驳回') }}</p>
            <span>{{ workOrderData.rejectedNum }}</span>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <div style="width: 0; height: 0">
      <svg width="100%" height="100%">
        <defs>
          <linearGradient id="write1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop
              offset="0%"
              style="stop-color: #6bc9df"
              stop-opacity="0.8"
            />
            <stop
              offset="100%"
              style="stop-color: #4594cd"
              stop-opacity="1"
            />
          </linearGradient>
        </defs>
      </svg>
      <svg width="100%" height="100%">
        <defs>
          <linearGradient id="write2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop
              offset="0%"
              style="stop-color: #6bc9df"
              stop-opacity="0.8"
            />
            <stop
              offset="100%"
              style="stop-color: #4594cd"
              stop-opacity="1"
            />
          </linearGradient>
        </defs>
      </svg>
    </div>
  </el-main>
</template>

<script>
import { translateTitle } from '../../i18n'
import { mapActions } from 'vuex'
import {
  getStatisticsWorkOrderData,
  getIndexPollingData,
  getIndexLineData,
} from '../../api/index'
export default {
  data() {
    return {
      dateList: [
        { label: '今日', value: '1' },
        { label: '本周', value: '2' },
        { label: '本月', value: '3' },
      ],
      spotIndex: 1,
      roundIndex: 1,
      workOrderData: {},
      roundPollingData: {},
      spotPollingData: {},
      emList: null,
      workorderCode: 'em:workorder',
      recordCode: 'em:polling_task',
      canNavToWorkOrder: false,
      canNavToRecord: false,
      lineDateIndex: 0,
      topLines: [],
    }
  },
  created() {
    /* this.emList = JSON.parse(localStorage.getItem('em_list'))
      if (!this.emList) {
        return
      } else {
        this.emList.forEach((item) => {
          item.childrenList.forEach((item) => {
            let code = item.code
            if (this.workorderCode === code) this.canNavToWorkOrder = true
            if (this.recordCode === code) this.canNavToRecord = true
          })
        })
      } */
  },
  mounted() {
    this.getPollingLineData('1')
    this.getPollingData('1', 1)
    this.getPollingData('1', 2)
    getStatisticsWorkOrderData().then((res) => {
      let { success, data } = res
      if (success) this.workOrderData = data
    })
  },
  methods: {
    format(percentage) {
      return `${percentage}%`
    },
    translateTitle,
    ...mapActions({
      _setWorkOrderStatus: 'zcoreBase/_setWorkOrderStatus',
    }),
    async pollingChangeDate(type, index, dateValue) {
      // console.log(type, index, dateValue)
      if (type == 1) {
        //巡检
        this.roundIndex = index
      } else {
        this.spotIndex = index
      }
      await this.getPollingData(index, type)
    },
    async getPollingData(dateType, pollingType) {
      await getIndexPollingData({ dateType, pollingType }).then((res) => {
        if (res.success == 1) {
          let { data } = res
          if (pollingType == 1) {
            //巡检
            if (data) {
              data.completeRate = Number(data.completeRate.split('%')[0])
              this.roundPollingData = data
            } else {
              this.roundPollingData = {}
            }
          } else {
            if (data) {
              data.completeRate = Number(data.completeRate.split('%')[0])
              this.spotPollingData = data
            } else {
              this.spotPollingData = {}
            }
          }
        }
      })
    },
    getPollingLineData(dateType, pollingType = 1) {
      getIndexLineData({ dateType, pollingType }).then((res) => {
        if (res.success == 1) {
          let { data } = res
          this.topLines = data
        }
      })
    },
    changeLineDate(index) {
      this.lineDateIndex = index
      this.getPollingLineData(index + 1)
    },
    naviTo(pathName, index) {
      // if (!this.canNavToRecord) return
      this.$router.push({
        name: pathName,
        params: {
          index,
        },
      })
    },
    naviToWorkOrder(index, status) {
      console.log(status)
      // if (!this.canNavToWorkOrder) return
      if (status) {
        this._setWorkOrderStatus(status)
      }
      this.$router.push({
        name: 'WorkOrder',
        params: {
          index,
        },
      })
    },
  },
}
</script>

<style scoped lang="scss">
@import '../../css/base';

.page-index {
  padding: 15px 15px 15px 17px;
  .center-box {
    .circle-part {
      display: flex;
      justify-content: center;
    }
    .z-circle {
      width: 200px;
      height: 200px;
      border-radius: 100%;
      background: #fff;
      box-shadow: -10px 8px 9px 2px #ccc;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .text-box {
      text-align: center;
      .el-col {
        display: flex;
        margin-bottom: 5px;
        &:last-child {
          margin-bottom: 0;
        }
        &:nth-child(2n) {
          p,
          span {
            background: none;
          }
        }
      }
      p {
        display: inline-block;
        background: #f1f8fc;
        color: #5b5b5b;
        // width: 160px;
        width: 59%;
        height: 40px;
        line-height: 40px;
        box-sizing: border-box;
        margin: 0;
        margin-right: 2px;
      }
      span {
        display: inline-block;
        color: #4da3de;
        // width: 106px;
        width: 40%;
        height: 40px;
        line-height: 40px;
        background: #f1f8fc;
        box-sizing: border-box;
        font-weight: bold;
      }
    }
  }
  ::v-deep(.el-scrollbar__wrap) {
    margin-bottom: 0 !important;
  }
}

.top-half11 {
  cursor: pointer;
  .center-box {
    margin-bottom: 0;
  }
}

.workorder {
  display: flex;
  justify-content: space-between;
  padding: 30px 0;
  .el-col {
    display: flex;
    justify-content: center;
    position: relative;
    cursor: pointer;
    &:after {
      content: '';
      position: absolute;
      right: 0;
      width: 1px;
      height: 100%;
      background: #d5d5d5;
    }
    &:last-child {
      &:after {
        background: none;
      }
    }
  }
  .right-text {
    p {
      color: #939393;
      margin: 0 0 10px 0;
    }
    span {
      color: #428ec8;
      font-weight: bold;
      font-size: 20px;
    }
  }
  .font44 {
    font-size: 34px;
    color: #428ec8;
    background: #f2f8fc;
    padding: 3px 10px 10px;
    border-radius: 5px;
    margin-right: 20px;
    &:after {
      content: '';
      width: 0px;
      height: 100%;
      display: inline-block;
      vertical-align: middle;
    }
    &:before {
      vertical-align: middle;
    }
  }
}

.si .box-card {
  margin-bottom: 25px;
  & ::v-deep(.el-progress-bar__outer) {
    background-color: #3d7fb7;
  }
  & ::v-deep(.el-progress-bar__inner) {
    background-color: unset;
    background-image: linear-gradient(to right, #5b9df8, #7ab0f1);
  }
  .item-box ::v-deep(.el-scrollbar__view) {
    display: flex;
    overflow-y: auto;
    .item {
      min-width: 240px;
      width: 19%;
      height: 320px;
      background: linear-gradient(to bottom, #499cd7 0%, #255790 100%);
      border-radius: 5px;
      box-sizing: border-box;
      padding: 20px 35px;
      color: #fff;
      margin-right: 20px;
      &:last-child {
        margin-right: 0;
      }
      .item-title {
        font-size: 18px;
        margin: 0;
        margin-bottom: 30px;
        color: #fff;
      }
      .center {
        display: flex;
        justify-content: space-between;
        text-align: center;
        // margin-bottom: 24px;
        span {
          font-size: 14px;
        }
        .num {
          font-size: 30px;
          margin: 15px 0 20px;
        }
      }
      .bot {
        font-size: 14px;
        display: flex;
        justify-content: space-between;
        li {
          text-align: center;
        }
        &.en {
          .line {
            .z-line {
              left: -28px;
            }
          }
        }
        .line {
          height: 76px;
          width: 15px;
          margin: 8px 0;
          position: relative;
          .z-line {
            transform: rotate(-90deg);
            width: 76px;
            position: absolute;
            left: -23px;
            top: 30px;
          }
        }
      }
    }
  }
}
.z-card-header {
  display: flex;
  justify-content: space-between;
  .choose-time {
    font-size: 14px;
    color: $grayColor;
    font-weight: normal;
    span {
      display: inline-block;
      width: 50px;
      height: 24px;
      line-height: 24px;
      text-align: center;
      border-radius: 3px;
      margin-right: 36px;
      cursor: pointer;
      &:last-child {
        margin-right: 0;
      }
      &.active {
        color: #fff;
        background: #307ec7;
      }
    }
  }
}
.circle1 ::v-deep(svg > path:nth-child(2)) {
  stroke: url(#write1);
}
.circle2 ::v-deep(svg > path:nth-child(2)) {
  stroke: url(#write2);
}
.el-progress-circle__track {
  stroke: #120d65;
}
@media only screen and (max-width: 1200px) {
  .page-index .center-box .z-circle {
    width: 150px;
    height: 150px;
  }
  ::v-deep(.el-progress-circle) {
    width: 130px !important;
    height: 130px !important;
  }
  .workorder .font44 {
    font-size: 24px;
    padding: 0 5px 0;
    margin-right: 10px;
  }
}
</style>
