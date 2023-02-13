<template>
  <div class="text-center section">
    <v-calendar
      class="custom-calendar max-w-full"
      :masks="masks"
      :attributes="attributes1"
      disable-page-swipe
      nav-visibility="hidden"
      title-position="left"
      is-expanded
    >
      <template #header="page">
        <div class="sch__custom__header">
          <div class="header__title">
            <span class="date__month">{{ `${ page.year }年${ page.month }月` }}</span>
            <el-button type="default" class="indicator" icon="el-icon-arrow-left" @click="handlePre(page)" />
            <el-button type="default" icon="el-icon-date" @click="handleToday(page)">今天</el-button>
            <el-button type="default" class="indicator" icon="el-icon-arrow-right" @click="handleNext(page)" />
          </div>
          <div class="header__opts">
            <!--            <el-button type="primary">点检</el-button>-->
            <el-button type="primary" @click="handleToggleStatus('preventMaintain')">保养</el-button>
            <el-button type="primary" @click="handleToggleStatus('abnormal')">维修</el-button>
          </div>
        </div>
        <!--        6666-->
      </template>
      <template #day-content="{ day, attributes }">
        <div
          class="flex flex-col h-full z-10 overflow-hidden"
          @click="handleCellClick(day)"
        >
          <span class="day-label text-sm text-gray-900">
            {{ day.day }}
            {{ isToday(day.year, day.month, day.day) ? '今天' : '' }}
          </span>
          <div class="flex-grow thin-scroller overflow-y-auto overflow-x-auto">
            <p
              v-for="attr in attributes"
              :key="attr.key"
              class="note"
              :class="attr.customData.class"
            >
              {{ attr.customData.title }}
            </p>
          </div>
        </div>
      </template>
    </v-calendar>
  </div>
</template>

<script>
import Calendar from 'v-calendar/lib/components/calendar.umd'
import { createNamespacedHelpers } from 'vuex';

const { mapState, mapActions } = createNamespacedHelpers('inspectMaintScheduleIndex');
export default {
  name: "BCalendar",
  components: {
    'VCalendar': Calendar
  },
  props: {
    attributes1: {
      type: Array,
      default: () => []
    }
  },
  data () {
    const date = new Date
    const month = date.getMonth();
    const year = date.getFullYear();
    const day = date.getDate()
    console.log(year, month, day)
    return {
      masks: {
        weekdays: 'WWW'
      },
      queryForm: {}
    }
  },
  computed: {
    ...mapState(['baseDataList', 'calAttrs'])
  },
  mounted () {
    console.log('this static data', this.attributes)
  },
  methods: {
    isToday (year, month, day) {
      const date = new Date()
      return date.getMonth() + 1 === month && date.getDate() === day
        && date.getFullYear() === year
    },
    handleCellClick (day) {
      const date = `${ day.year }-${ (day.month).toString().padStart(2, '0') }-${ day.day.toString().padStart(2, '0') }`
      console.log('date cell click', date)
      let dd = this.baseDataList[date] || []
      console.log('结果', dd)
      this.$emit('today-items', { date, list: dd })
    },
    handleToggleStatus (statusStr) {
      const params = {
        workorderType: statusStr
      }
      this.handleReload(params)
    },
    handlePre (page) {
      page.movePrevMonth()
      this.queryForm.month = `${ page.year }-${ (page.month - 1).toString().padStart(2, '0') }`
      this.handleReload()
      // this.handleReload({ month: `${ page.year }-${ (page.month - 1).toString().padStart(2, '0') }` })
    },
    handleToday (page) {
      page.move(new Date())
      this.queryForm.month = `${ page.year }-${ (page.month - 1).toString().padStart(2, '0') }`
      this.handleReload()
    },
    handleNext (page) {
      page.moveNextMonth()
      this.queryForm.month = `${ page.year }-${ (page.month + 1).toString().padStart(2, '0') }`
      this.handleReload()
      // this.handleReload({ month: `${ page.year }-${ (page.month + 1).toString().padStart(2, '0') }` })
    },
    handleReload (params) {
      const filters = { ...this.queryForm, ...params }
      this.$emit('reload', filters)
    }
  }
};
</script>

<style lang="scss">
  .text-white {
    color: white;
  }

  .thin-scroller {
    &::-webkit-scrollbar {
      width: 5px;
    }
  }

  .note {
    padding: 0 5px;
    margin-bottom: 10px;
    white-space: nowrap;
    overflow: hidden;
    cursor: pointer;
    line-height: 22px;
    text-overflow: ellipsis;
  }

  .is-today .day-label {
    color: #2180d2;
    padding-left: 2px;;
    font-weight: 800;
    background: antiquewhite;
  }

  .z-10 {
    z-index: 10;
  }

  .flex {
    display: flex;
  }

  .flex-col {
    flex-direction: column;
  }

  .overflow-hidden {
    overflow: hidden;
  }

  .h-full {
    height: 100%;
  }

  .flex-grow {
    flex-grow: 1;
  }

  .overflow-x-auto {
    overflow-x: auto;
  }

  .overflow-y-auto {
    overflow-y: auto;
  }

  .abnormal-gradient {
    background-image: var(--abnormal-gradi-color);
  }

  .finished-gradient {
    background-image: var(--finished-gradi-color);
  }

  .ready-gradient {
    background-image: var(--ready-gradi-color);
  }

  .infix-gradient {
    background-image: var(--infix-gradi-color);
  }

  ::-webkit-scrollbar {
    width: 0px;
  }

  ::-webkit-scrollbar-track {
    display: none;
  }

  .custom-calendar.vc-container {
    --day-border: 1px solid #b8c2cc;
    --day-border-highlight: 1px solid #b8c2cc;
    --day-width: 90px;
    --day-height: 90px;
    --weekday-bg: #f8fafc;
    --weekday-border: 1px solid #eaeaea;
    border-radius: 0;
    width: 100%;

    .vc-arrows-container {
      display: none;
    }

    .sch__custom__header {
      display: flex;
      height: 62px;
      justify-content: space-between;
      align-items: center;
      margin-top: -1px;
      border-bottom: 1px solid #cbd5e0;

      .el-button {
        background-color: #F0F1F5;
        color: #0F1217;
        border: none;
        height: 32px;
        font-weight: 400;

        &:hover {
          background-color: $base-menu-background-active;
          color: white;
        }
      }

      .header__title {
        font-size: 22px;
        font-weight: bold;
        display: flex;
        align-items: center;

        .date__month {
          margin-right: 20px;
        }

        .el-button {
          &.indicator {
            width: 32px;
            font-size: 16px;
            padding: 0;
          }

          i {
            font-weight: 600;
          }

          & + .el-button {
            margin-left: 6px;
          }
        }
      }

      .header__opts {
        padding-right: 20px;

        .el-button.el-button--default {
          background-color: #F0F1F5;
        }
      }
    }

    & .vc-header {
      background-color: #f1f5f8;
      padding: 10px 0;
    }

    & .vc-weeks {
      padding: 0;
    }

    & .vc-weekday {
      background-color: var(--weekday-bg);
      border-bottom: var(--weekday-border);
      //border-top: var(--weekday-border);
      border-top: none;
      padding: 5px 0;
    }

    & .vc-day {
      padding: 0 5px 3px 5px;
      text-align: left;
      height: var(--day-height);
      min-width: var(--day-width);
      background-color: white;

      &.weekday-1,
      &.weekday-7 {
        background-color: #eff8ff;
      }

      &:not(.on-bottom) {
        border-bottom: var(--day-border);

        &.weekday-1 {
          border-bottom: var(--day-border-highlight);
        }
      }

      &:not(.on-right) {
        border-right: var(--day-border);
      }
    }

    & .vc-day-dots {
      margin-bottom: 5px;
    }
  }
</style>
