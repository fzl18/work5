<template>
  <el-main class="si">
    <bt-page :title="$route.meta.title" icon-bg-color="#FF866A">
      <template slot="option">
        <el-button
          v-if="hasPermission('xunjianpaiban-download')"
          type="primary"
          class="d-btn"
        >
          <a
            class="download"
            :title="translateTitle('模板下载')"
            :href="`${publicPath}/temp_scheduling.xlsx`"
            download="模板下载.xlsx"
          >
            {{ translateTitle('模板下载') }}
          </a>
        </el-button>
        <zUpload
          v-if="hasPermission('xunjianpaiban-import')"
          ref="zUpload"
          type="file"
          :only-read="false"
          :limit="1"
          :multiple="false"
          :file-btn-str="translateTitle('导入排班计划')"
          :file-list="fileList"
          :dir-obj="{ dir: 'workDir', name: 'workorder' }"
          @handleUpload="handleUpload"
        />
      </template>
      <!--      <el-card class="box-card si-title" shadow="hover">-->
      <!--        <el-row slot="header" class="z-card-header">-->
      <!--          <el-row class="z-c-in">-->
      <!--            <el-col class="left">-->
      <!--            </el-col>-->
      <!--            <el-col v-show="active" class="right">-->

      <!--            </el-col>-->
      <!--          </el-row>-->
      <!--        </el-row>-->
      <!--      </el-card>-->
      <el-row v-show="active" class="s-box">
        <zTable
          ref="sTable"
          :table-data="tableData"
          :cols="cols"
          :total="total"
          :each-page-size="eachPageSize"
          :current-page="currentPage"
          :show-handle="true"
          :show-index="true"
          @pageChange="handleCurrentChange"
        >
          <template #handle="slotData">
            <zDropicon
              :slot-data="slotData"
              :op-list="opList"
              @handleIconFn="handleIconClick"
            />
          </template>
        </zTable>
      </el-row>
      <el-row v-if="!active" class="s-box">
        <el-col :span="20">
          <FullCalendar ref="zCalendar" :options="calendarOptions" />
        </el-col>
        <el-col :span="4">
          <div class="form-btns">
            <el-button class="cancelBtn" @click="tipClose">
              {{ translateTitle('取消') }}
            </el-button>
          </div>
        </el-col>
      </el-row>
    </bt-page>
  </el-main>
</template>

<script>
import { hasPermission } from '@/utils/hasPermission'
import { translateTitle } from '../../i18n'
import { deleteScheduling, getListScheduling, getSchedulingDetail, } from '../../api/scheduling'
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import zUpload from '../../components/zUpload'
import zTable from '../../components/zTable'
import zDropicon from '../../components/zDropicon'

export default {
  components: { FullCalendar, zUpload, zTable, zDropicon },
  data () {
    return {
      code: 'em:scheduling',
      level3List: [],
      dialogVisible2: false,
      active: true,
      cols: [
        {
          prop: 'title',
          label: '排班计划名称',
          showOverflowTooltip: true,
          width: '300',
        },
        { prop: 'createdTime', label: '创建时间' },
        { prop: 'createdName', label: '创建人' },
      ],
      opList: [
        {
          value: '查看',
          disabled: false,
          hasPermission: 'xunjianpaiban-view',
        },
        {
          value: '删除',
          disabled: false,
          hasPermission: 'xunjianpaiban-delete',
        },
      ],
      tableData: [],
      total: 0,
      eachPageSize: 10,
      currentPage: 1,
      file: null,
      fileList: [],
      publicPath: process.env.BASE_URL,
      // publicPath: '/dailycheck',
      calendarOptions: {
        plugins: [dayGridPlugin],
        initialView: 'dayGridMonth',
        locale: 'zh-cn',
        buttonText: {
          today: '今天',
        },
        showNonCurrentDates: true,
      },
      eventData: [],
    }
  },
  watch: {
    '$i18n.locale' (val1) {
      this.initLanguage(val1)
    },
  },
  created () {
    console.log(this.publicPath)
    this.showOrHidden(this.opList)
    if (this.$route.params.id) {
      this.changeTag(2)
      this.handleCheckDate('', this.$route.params)
    }
    this.requestData(1, this.eachPageSize)
    let la = JSON.parse(localStorage.getItem('language'))
    if (la) {
      let language = la.language ? la.language : 'en'
      this.initLanguage(language)
    }
  },
  methods: {
    hasPermission,
    translateTitle,
    initLanguage (language) {
      this.calendarOptions.locale = language === 'en' ? 'en' : 'zh-cn'
      this.calendarOptions.buttonText.today = this.translateTitle('今天')
    },
    changeTag (index) {
      if (index == 1) {
        this.active = true
        this.$nextTick(() => this.$refs.sTable.doLayout())
      } else {
        this.active = false
      }
    },
    //tip关闭
    tipClose () {
      this.active = true
      this.$nextTick(() => this.$refs.sTable.doLayout())
    },
    requestData (pageNum = 1, pageSize = 10) {
      getListScheduling({
        pageNum,
        pageSize,
      }).then((res) => {
        let { data } = res
        this.currentPage = data.pageNum
        this.eachPageSize = data.pageSize
        this.total = data.total
        this.tableData = data.result
      })
    },
    handleDelete (index, row) {
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
          deleteScheduling({
            id: row.id,
          }).then((res) => {
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
    handleCurrentChange (val) {
      this.currentPage = val
      this.requestData(val, this.eachPageSize)
    },
    handleCheckDate (index, row) {
      getSchedulingDetail({ id: row.id }).then((res) => {
        if (res.success == 1) {
          // this.calendarOptions.events
          this.calendarOptions.events = []
          let { data } = res
          if (data.length == 0) {
            this.$msg({
              message: this.translateTitle('排班信息为空'),
              type: 'success',
            })
            return
          }
          data.forEach((item) => {
            this.calendarOptions.events.push({
              title: item.userName,
              date: item.schedulingTime,
            })
          })

          setTimeout(() => {
            this.changeTag(2)
            /* setTimeout(() => {
                let date = data[0].schedulingTime
                this.$refs.zCalendar.getApi().gotoDate(date)
              }, 100) */
          }, 251)
        }
      })
    },
    showOrHidden (arr) {
      arr.forEach((item) => {
        item.disabled = hasPermission(item.hasPermission) ? false : true
      })
    },
    //upload处理
    handleUpload (res) {
      console.log(res)
      switch (res.type) {
        case 'id':
          this.requestData()
          this.$msg({
            message: this.translateTitle('添加成功'),
            type: 'success',
          })
          break
      }
    },
    handleIconClick (res) {
      switch (res.type) {
        case '查看':
          this.handleCheckDate(res.index, res.row)
          break
        case '删除':
          this.handleDelete(res.index, res.row)
          break
      }
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '../../css/base';

  ::v-deep(.s-box) {
    a {
      color: #333;
      font-size: 13px;
    }

    .fc table {
      font-size: 100%;
    }

    .fc-daygrid-body,
    .fc-scrollgrid-sync-table {
      height: 100% !important;
    }
  }

  .d-btn {
    height: 32px;
    background: $blueColor;
    border-color: $blueColor;
    font-size: 14px;
    margin-left: 10px;

    .download {
      display: inline-block;
      font-size: 12px;
      color: #fff;
    }
  }

  ::v-deep(.scheduling-upload) {
    & > ul {
      display: none;
    }
  }
</style>
