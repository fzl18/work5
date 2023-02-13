<template>
  <el-form
    ref="form"
    :model="form"
    class="iot-timeSearch"
    label-position="top"
    size="mini"
  >
    <el-form-item label="日期范围">
      <el-row type="flex" class="row-bg" :gutter="20" justify="space-around">
        <el-col :span="8">
          <el-button
            class="timeBtn"
            size="mini"
            :type="active == 'today' ? 'primary' : ''"
            @click="checkoutDate('today')"
          >
            近1天
          </el-button>
        </el-col>
        <el-col :span="8">
          <el-button
            class="timeBtn"
            size="mini"
            :type="active == 'week' ? 'primary' : ''"
            @click="checkoutDate('week')"
          >
            近7天
          </el-button>
        </el-col>
        <el-col :span="8">
          <el-button
            class="timeBtn"
            size="mini"
            :type="active == 'halfMonth' ? 'primary' : ''"
            @click="checkoutDate('halfMonth')"
          >
            近15天
          </el-button>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" :gutter="20" justify="space-around">
        <el-col :span="8">
          <el-button
            class="timeBtn"
            size="mini"
            :type="active == 'month' ? 'primary' : ''"
            @click="checkoutDate('month')"
          >
            近一月
          </el-button>
        </el-col>
        <el-col :span="8">
          <el-button
            class="timeBtn"
            size="mini"
            :type="active == 'month3' ? 'primary' : ''"
            @click="checkoutDate('month3')"
          >
            近三月
          </el-button>
        </el-col>
        <el-col :span="8">
          <el-button
            class="timeBtn"
            size="mini"
            :type="active == 'custom' ? 'primary' : ''"
            @click="checkoutDate('custom')"
          >
            自定义
          </el-button>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item v-show="active == 'custom'">
      <el-date-picker
        v-model="form.custom1"
        type="datetime"
        placeholder="从"
        align="right"
        :picker-options="pickerOptions"
        value-format="yyyy-MM-dd HH:mm:ss"
      ></el-date-picker>
    </el-form-item>
    <el-form-item v-if="active == 'custom'">
      <el-date-picker
        v-model="form.custom2"
        type="datetime"
        placeholder="到"
        align="right"
        :picker-options="pickerOptions"
        value-format="yyyy-MM-dd HH:mm:ss"
      ></el-date-picker>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    name: 'BtDatepicker',
    props: {
      value: {
        type: Object,
        default() {
          return {
            startTime: '',
            endTime: '',
          }
        },
      },
    },
    data() {
      return {
        form: {
          custom1: '',
          custom2: '',
        },
        search: {
          startTime: '',
          endTime: '',
        },
        active: '',
        timeOptions: [],
        format: 'YYYY-MM-DD HH:mm:ss',
        pickerOptions: {
          shortcuts: [
            {
              text: '今天',
              onClick(picker) {
                picker.$emit('pick', new Date())
              },
            },
            {
              text: '昨天',
              onClick(picker) {
                const date = new Date()
                date.setTime(date.getTime() - 3600 * 1000 * 24)
                picker.$emit('pick', date)
              },
            },
            {
              text: '一周前',
              onClick(picker) {
                const date = new Date()
                date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
                picker.$emit('pick', date)
              },
            },
          ],
        },
      }
    },
    watch: {
      active(val) {
        const dayjs = require('dayjs')
        let current = dayjs().format(this.format)
        switch (val) {
          case 'today':
            this.search.startTime = dayjs()
              .subtract(1, 'day')
              .format(this.format)
            this.search.endTime = current
            break
          case 'week':
            this.search.startTime = dayjs()
              .subtract(1, 'week')
              .format(this.format)
            this.search.endTime = current
            break
          case 'halfMonth':
            this.search.startTime = dayjs()
              .subtract(15, 'day')
              .format(this.format)
            this.search.endTime = current
            break
          case 'month':
            this.search.startTime = dayjs()
              .subtract(1, 'month')
              .format(this.format)
            this.search.endTime = current
            break
          case 'month3':
            this.search.startTime = dayjs()
              .subtract(3, 'month')
              .format(this.format)
            this.search.endTime = current
            break
          case 'custom':
            this.search.startTime = ''
            this.search.endTime = ''
            break
        }
      },
      'form.custom1': function (val) {
        this.search.startTime = val
      },
      'form.custom2': function (val) {
        this.search.endTime = val
      },
    },
    mounted() {
      this.active = 'today'
    },
    updated() {
      this.$emit('input', this.search)
    },
    created() {
      this.search = this.value
    },
    methods: {
      checkoutDate(val) {
        this.active = val
      },
      clearInput() {
        this.active = 'today'
      },
    },
  }
</script>
<style lang="scss" scoped>
  .iot-timeSearch {
    .el-row {
      margin-top: 10px;
      .timeBtn {
        width: 100%;
      }
    }
  }
</style>
