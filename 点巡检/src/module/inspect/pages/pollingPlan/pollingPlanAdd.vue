<template>
  <el-main ref="main" class="si">
    <!--    <zPageTitle-->
    <!--      :title="title"-->
    <!--      :show-filter="false"-->
    <!--      @handleIconClick="openDrawer"-->
    <!--    />-->

    <bt-page :title="title" icon-bg-color="#FF866A">
      <el-form ref="dynamicValidateForm" :model="form">
        <div class="block-item">
          <bt-title title="基础信息" />
          <div>
            <el-row :gutter="66">
              <el-col :span="7">
                <el-form-item
                  label="计划名称"
                  prop="planName"
                  :rules="[
                    {
                      required: true,
                      message: '请输入计划名称',
                      trigger: 'change'
                    }
                  ]"
                >
                  <el-input
                    v-model="form.planName"
                    placeholder="请输入计划名称"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item
                  label="所属区域"
                  prop="areaId"
                  :rules="[
                    {
                      required: true,
                      message: '请选择区域',
                      trigger: 'change'
                    }
                  ]"
                >
                  <el-cascader
                    ref="caRef"
                    v-model="form.areaId"
                    placeholder="请选择所属区域"
                    :props="customAreaProps"
                    :options="areaOptions"
                    :show-all-levels="true"
                    style="width: 100%"
                    @change="handleAreaChange"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="block-item">
          <bt-title title="巡检线路" />
          <div>
            <el-transfer
              v-model="value" :titles="['所有线路','已选择']" :props="{label:'genLabel',key:'id'}"
              :data="manaPOptions"
            />
          </div>
        </div>
        <div class="block-item">
          <bt-title title="执行班次" />
          <div>
            <el-row :gutter="66">
              <el-col v-for="(item,index) in form.shiftTeamList" :key="`shift${index}`" :span="7">
                <el-form-item
                  :label="item.shiftName"
                  :prop="`shiftTeamList.${index}.teamId`"
                  :rules="[
                    {
                      required: true,
                      message: '请选择白班第一次班组',
                      trigger: 'change'
                    }
                  ]"
                >
                  <el-select
                    v-model="item.teamId"
                    placeholder="请选择"
                  >
                    <el-option v-for="item in groupOptions" :key="item.id" :label="item.teamName" :value="item.id" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-form>
      <template slot="sections">
        <el-button style="float: right; margin-left: 10px" @click="handleCancel">
          取消
        </el-button>
        <el-button type="primary" style="float: right" @click="handleSubmit">
          保存
        </el-button>
      </template>
    </bt-page>
  </el-main>
</template>

<script>
import { hasPermission } from '@/utils/hasPermission'
// import PollingRecord from '../polling/Record';
import { translateTitle } from '../../i18n'
import { getPlanInfoById, savePollingPlan, updatePollingPlan, } from '../../api/pollingPlan'
// import zTable from '../../components/zTable'
// import zPageTitle from '../../components/zPageTitle'
// import zDropdown from '../../components/zDropdown'
// import zDropicon from '../../components/zDropicon'
// import zDrawer from '../../components/zDrawer'
// import recordDetail from '../../components/recordDetail/recordDetail'
// import mapRange from '../../components/mapRange/mapRange'
import BtTitle from '@/components/BtPage/bt-title';
import { detailedAreaInfo, listAreaTree } from '@/module/inspect/api/basicSetting/area';
import { listBaseData, listEquipManaPoints } from '@/module/inspect/api/basicSetting/equipPos';
// import BtSection from '@/components/BtPage/bt-section';

export default {
  components: {
    // BtSection,
    BtTitle,
    // PollingRecord
    // zTable,
    // zDropdown,
    // zDropicon,
    // zDrawer,
    // zPageTitle,
    // recordDetail,
    // mapRange,
  },
  data () {
    return {
      id: '',
      planType: '',
      value: [],
      code: 'em:polling_plan',
      title: '点巡检计划（新增）',
      form: {
        planName: '',
        areaId: '',
        planType: '',
        shiftTeamList: [],
        equipmentList: []
      },
      customAreaProps: {
        label: 'areaName',
        value: 'id',
        children: 'children',
        emitPath: false,
        checkStrictly: true
      },
      areaOptions: [],
      groupOptions: [],
      manaPOptions: []
    }
  },
  computed: {
    // computedRules () {
    //   if (this.form.isScheduling) {
    //     return this.rulesNoTime
    //   } else {
    //     return this.rules
    //   }
    // },
  },
  watch: {
    // onlyRead (newVal, oldVal) {
    //   if (newVal) {
    //     this.standardOpList.forEach((item) => (item.disabled = true))
    //   } else {
    //     this.standardOpList.forEach((item) => (item.disabled = false))
    //   }
    // },
    // '$i18n.locale' () {
    //   this.setRules()
    // },
    'form.areaId' () {
      this.handleAreaChange(this.form.areaId)
    }
  },
  created () {
    // //获取排班数据
    // getListScheduling({
    //   pageNum: 1,
    //   pageSize: 1000,
    // }).then((res) => {
    //   let { data } = res
    //   this.schedulingList = data.result
    //   console.log('排班数据列表--', this.schedulingList)
    // })
    //
    // /*getFactoryList().then((res) => {
    //   let { success, data } = res
    //   if (success) this.factoryList = data
    // })*/
    // this.getDevicePageFn()
    //
    // monitorApi.getKindPage({ params: { ignoreConveyor: '1' } })
    // .then((res) => {
    //   let { data } = res
    //   this.kindList = this.getTreeData(data)
    // })
    //
    // // 时间点
    // for (var i = 0; i < 24; i++) {
    //   var time = ''
    //   if (i < 10) {
    //     time = `0${ i }`
    //   } else {
    //     time = `${ i }`
    //   }
    //   this.executeTimes.push(time + ':00:00')
    // }
  },
  mounted () {
    this.pageInit()
  },
  methods: {
    hasPermission,
    translateTitle,
    async pageInit () {
      const { id = '', planType = '' } = this.$route.query
      this.id = id
      this.form.planType = planType
      this.fetchAreaTreeData()
      if (!this.id) {
        this.fetchingShiftTime()
      } else {
        console.log('编辑')
        this.title = '点巡检计划（编辑）'
        // await this.fetchDetailedInfo(id)
        await this.fetchingStatusByPromise(id)
      }
    },
    handleSubmit () {
      const v = this.value
      // v.forEach((item) => {
      //
      // })
      const foundFuckEquip = v.reduce((pre, cur, index) => {
        const arr = this.manaPOptions.find(ele => {
          return ele.id = cur
        })
        const { id, equipmentName, parentInstanceId } = arr
        const obj = { id, equipmentName, parentInstanceId, equipmentOrder: index }
        pre = [...pre, obj]
        return pre
      }, [])
      this.form.equipmentList = foundFuckEquip
      this.form.shiftTeamList.forEach(item => {
        const fucker = this.groupOptions.find(vv => vv.id = item.teamId)
        item.teamName = fucker.teamName
      })
      if (this.id) {
        updatePollingPlan(this.form).then(res => {
          if (res.success) {
            this.$msg.success('计划编辑成功')
            this.$router.go(-1)
            this.form = {}
          } else {
            this.$msg.error('计划编辑失败')
          }
        })
      } else {
        savePollingPlan(this.form).then(res => {
          if (res.success) {
            this.$msg.success('计划创建成功')
            this.$router.go(-1)
            // this.form = {}
          } else {
            this.$msg.error('计划创建失败')
          }
        })
      }
    },
    /* Drop */
    fetchDetailedInfo (id) {
      getPlanInfoById({ id }).then(res => {
        if (res.success) {
          this.form = res.data
          const copy = res.data
          const arr = copy.checkInPointEquipmentNumList || []
          const ids = []
          arr.forEach((item) => {
            ids.push(item.checkInPointId)
          })
          this.value = ids
          // check
        }
      })
    },
    fetchingStatusByPromise (id) {
      const proQueen = [getPlanInfoById({ id }), listBaseData({ code: 'shift_time' })]
      Promise.all(proQueen).then(res => {
        const pre1 = res[0]
        const pre2 = res[1]
        const missedMatch = []
        // match
        if (pre1.success && pre2.success) {
          const pre1HaveShit = pre1.data.shiftTeamList || []
          const ed = pre1HaveShit.map(item => item.shiftName)
          const aa = pre2.data.every(item => {
            if (!ed.includes(item)) {
              missedMatch.push(item)
            }
            console.log()
            return ed.includes(item)
          })
          if (missedMatch.length) {
            missedMatch.forEach(item => {
              pre1.data.shiftTeamList.push({
                'shiftName': item,
                'teamId': '',
                'teamName': ''
              })
            })
          }
          this.form = pre1.data
          const arr = pre1.data.checkInPointEquipmentNumList || []
          const ids = []
          arr.forEach((item) => {
            ids.push(item.checkInPointId)
          })
          this.value = ids
        }
      })
    },
    handleCancel () {
      this.$router.go(-1)
    },
    fetchAreaTreeData () {
      listAreaTree().then(res => {
        if (res.success) {
          this.areaOptions = res.data
        }
      })
    },
    handleAreaChange (id) {
      // fetch data by area id
      id && this.fetchingTeamGroup(id)
      this.fetchingManaPointsByAreaID(id)
    },
    //shift_time for new add
    fetchingShiftTime () {
      listBaseData({ code: 'shift_time' }).then(res => {
        if (res.success) {
          const list = res.data
          this.form.shiftTeamList = list.map(item => ({
            'shiftName': item,
            'teamId': '',
            'teamName': ''
          }))
        }
      })
    },
    fetchingTeamGroup (id) {
      detailedAreaInfo({ id }).then(res => {
        if (res.success) {
          this.groupOptions = res.data.teamList || []
        }
      })
    },
    fetchingManaPointsByAreaID (areaId) {
      listEquipManaPoints({ areaId }).then(res => {
        if (res.success) {
          this.manaPOptions = res.data
          this.manaPOptions.forEach((item) => {
            item.genLabel = `${ item.mainEquipmentName }-${ item.equipmentName }`
          })
        }
      })
    }
    //!!!!! odd blew !!!!!!
  }
}
</script>

<style scoped lang="scss">
  @import '../../css/base';

  .block-item {
    margin-bottom: 20px;

    & ::v-deep .el-transfer {
      .el-transfer-panel {
        width: 320px;
      }
    }
  }

  .pass-date {
    height: 100px;
    padding: 10px;
    background: #f9f9f9;
  }

  .filterUser {
    background: #f9f9f9;
  }

  .filterBar {
    .is-error {
      .el-button {
        border: 1px solid #ff4d4f;
      }
    }
  }

  .eltag-table {
    .el-tag + .el-tag {
      margin-left: 0;
    }
  }
</style>
