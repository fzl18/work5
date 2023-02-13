<template>
  <el-badge :value="badge">
    <el-popover placement="bottom" trigger="hover" width="400">
      <remix-icon
        slot="reference"
        icon-class="notification-line"
        style="font-size: 22px"
      ></remix-icon>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="'消息'" name="notice">
          <div class="notice-list">
            <el-scrollbar>
              <ul>
                <li
                  v-for="(item, index) in list"
                  :key="index"
                  @click="linkto(item)"
                >
                  <span>
                    <el-badge
                      v-if="!item.readFlag"
                      class="item"
                      is-dot
                    ></el-badge>
                    <!-- {{ index + 1 }} -->
                  </span>
                  <span>{{ item.actionName }}</span>
                  <span>{{ item.approvalDate }}</span>
                  <span class="link">
                    {{ item.approvalIdea }}
                  </span>
                  <span>{{ getName(item.approvalId, approvalOptions) }}</span>
                </li>
              </ul>
            </el-scrollbar>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="notice-clear" @click="handleClearNotice">
        <remix-icon icon-class="close-circle-line"></remix-icon>
        清空已读信息
      </div>
    </el-popover>
  </el-badge>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { translateTitle } from '@/utils/i18n'
  // import {
  //   getMessageInfoList,
  //   getMessageInfoUpdate,
  //   getMessageInfoDelete,
  // } from '@/views/system/api'
  import dayjs from 'dayjs'

  export default {
    name: 'Notice',
    data() {
      return {
        activeName: 'notice',
        badge: null,
        list: [],
        approvalOptions: [{ value: '', label: '' }],
      }
    },
    computed: {
      // ...mapGetters({
      //   showNotice: 'settings/showNotice',
      // }),
    },

    created() {
      this.$nextTick(() => {
        // this.fetchData()
      })
    },
    mounted() {
      // let dictionary = this.$store.state.systemIndex.dictionary
      // dictionary.map((item) => {
      //   if (item.catalogCode == 200) {
      //     item.dataDictionaries.map((val) => {
      //       val.value = val.dataCode
      //       val.label = val.dataValue
      //     })
      //     this.approvalOptions = item.dataDictionaries
      //   }
      // })
    },
    methods: {
      translateTitle,
      getName(data, type) {
        let text = ''
        if (data && type && type.length) {
          type.map((val) => {
            if (val.value == data) {
              text = val.label
            }
          })
        }
        return text
      },
      handleClick() {
        this.fetchData()
      },
      handleClearNotice() {
        const ids = []
        this.list.map((item) => {
          if (item.readFlag) {
            ids.push(item.id)
          }
        })
        if (ids.length) {
          getMessageInfoDelete({
            ids,
          }).then((res) => {
            this.$baseMessage('清空消息成功', 'success')
            this.fetchData()
          })
        } else {
          this.$baseMessage('无已读信息', 'warning')
        }
      },
      async fetchData() {
        const data = await getMessageInfoList()
        let count = 0
        data.map((item) => {
          // item.approvalIdea = '这里真的'
          // item.approvalDate = dayjs(item.approvalDate).format('YYYY-MM-DD')
          if (!item.readFlag) {
            count++
          }
        })
        this.badge = count
        this.list = data
      },
      linkto(data) {
        getMessageInfoUpdate({ id: data.id, readFlag: true })
        setTimeout(() => {
          this.fetchData()
        }, 500)
        this.$router.push(`/system/detail/?id=${data.suggestionId}`)
      },
    },
  }
</script>

<style lang="scss" scoped>
  ::v-deep {
    .el-tabs__active-bar {
      min-width: 28px;
    }
  }

  .notice-list {
    height: 29vh;
    .link {
      cursor: pointer;
    }

    ul {
      padding: 0 15px 0 0;
      margin: 0;

      li {
        display: flex;
        align-items: center;
        padding: 10px 0 10px 0;
        cursor: pointer;
        span {
          display: inline-block;
          overflow: hidden;
          &:nth-child(1) {
            width: 10px;
          }
          &:nth-child(2) {
            width: 50px;
          }
          &:nth-child(3) {
            width: 120px;
          }
          &:nth-child(4) {
            width: 160px;
          }
          &:nth-child(4) {
            width: 80px;
          }
        }
        ::v-deep {
          .el-avatar {
            flex-shrink: 0;
            width: 50px;
            height: 50px;
            border-radius: 50%;
          }
        }

        span {
          margin-right: 10px;
        }
      }
    }
  }

  .notice-clear {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 0 0 0;
    font-size: 14px;
    color: $base-color-blue;
    text-align: center;
    cursor: pointer;
    border-top: 1px solid #e8eaec;
    -webkit-transition: color 0.2s ease-in-out;
    transition: color 0.2s ease-in-out;

    i {
      margin-right: 3px;
    }
  }
  .item {
    margin-top: 8px;
    // transform: scale(0.6);
  }
</style>
