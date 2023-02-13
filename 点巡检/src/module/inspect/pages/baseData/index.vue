<template>
  <el-main class="si">
    <bt-page :title="translateTitle('基础数据管理')" icon-bg-color="#FF866A">
      <template slot="option">
        <bt-dropdown v-show="hasPermission('DXJXTSZ-JCSJ-edit')" :show-arrow="true">
          {{ $translateTitle('操作') }}
          <bt-dropdown-menu>
            <bt-dropdown-item @click="handleEdit">
              编辑
            </bt-dropdown-item>
          </bt-dropdown-menu>
        </bt-dropdown>
      </template>
      <!--      <el-card class="box-card si-title" shadow="hover">-->
      <!--        <el-row slot="header" class="z-card-header">-->
      <!--          <el-row class="z-c-in">-->
      <!--            <el-col class="left">-->
      <!--              <i class="el-icon-document-copy" />-->
      <!--              <span>{{ translateTitle('基础数据管理') }}</span>-->
      <!--            </el-col>-->
      <!--            <el-col class="right">-->
      <!--              <el-button-->
      <!--                v-if="hasPermission('DXJXTSZ-JCSJ-edit')"-->
      <!--                type="primary"-->
      <!--                class="saveBtn"-->
      <!--                @click="updateBaseInfo"-->
      <!--              >-->
      <!--                {{ translateTitle('保存编辑') }}-->
      <!--              </el-button>-->
      <!--            </el-col>-->
      <!--          </el-row>-->
      <!--        </el-row>-->
      <!--      </el-card>-->

      <el-row class="s-box">
        <div v-for="(item, index) in tipsList" :key="index" class="block__basic">
          <div class="block__header">
            <div class="title">
              {{ translateTitle(item.optionType) }}
              <el-tooltip
                v-if="item.optionCode === 'trouble_level' ||item.optionCode === 'trouble_cause'"
                effect="dark"
              >
                <div slot="content">
                  {{ translateTitle('第一项为工单默认选择项') }}
                </div>
                <i class="ri-question-fill" style="font-size: 14px" />
              </el-tooltip>
            </div>
          </div>
          <div class="config__items">
            <div v-for="(inp, i) in item.options" :key="i" class="pf__item">
              <i v-if="!locked" class="item__decrease el-icon-remove" @click="handleRemoveItem(index,i)" />
              <el-input
                v-model="inp.value"
                :disabled="locked"
                clearable
              />
            </div>
            <el-button
              v-if="!locked"
              type="default"
              class="item__increase" icon="el-icon-circle-plus-outline"
              @click="insertFn(item, index)"
            >
              添加
            </el-button>
          </div>
        </div>
      </el-row>
      <template slot="sections">
        <el-button :disabled="locked" style="float: right; margin-left: 10px" @click="locked=true">
          取消
        </el-button>
        <el-button v-if="!locked" type="primary" style="float: right" @click="handleSave">
          保存
        </el-button>
      </template>
    </bt-page>
  </el-main>
</template>

<script>
import { hasPermission } from '@/utils/hasPermission'
import { translateTitle } from '../../i18n'
import { baseOptionListUpdate, getBaseInfoOptionList, } from '../../api/baseData'

export default {
  data () {
    return {
      code: 'sys:option',
      level3List: [],
      tipsList: [],
      locked: true
    }
  },
  created () {
    this.getLevel3List()
    this.requestData()
  },
  methods: {
    hasPermission,
    translateTitle,
    requestData () {
      getBaseInfoOptionList().then((res) => {
        let { data } = res
        data.forEach((item) => {
          item.options = item.optionValueList.map((item) => {
            return { value: item }
          })
        })
        this.tipsList = data
      })
    },
    //当前页面level3(需要显示隐藏的按钮)的数据
    getLevel3List () {
      //获取level3 list
      /* let list = JSON.parse(localStorage.getItem('system_list'))
      list.forEach((item) => {
        if (item.code === this.code) this.level3List = item.childrenList
      }) */
    },
    showOrHidden (code) {
      //code: "sys:role"
      let result = false
      for (let i = 0; i < this.level3List.length; i++) {
        if (this.level3List[i].code === code) {
          result = true
          return result
        }
      }
    },
    insertFn (item, index) {
      this.tipsList[index].options.push({ value: '' })
    },
    handleRemoveItem (key, index) {
      this.tipsList[key].options.splice(index, 1)
    },
    handleEdit () {
      this.locked = false
    },
    handleSave () {
      this.tipsList.forEach((item) => {
        item.optionValueList = []
        item.options.forEach(
          (option) => option.value && item.optionValueList.push(option.value)
        )
      })
      baseOptionListUpdate(this.tipsList).then((res) => {
        console.log(res)
        if (res.success == 1) {
          this.$msg({
            message: this.translateTitle('更新成功'),
            type: 'success',
          })
          this.locked = true
          this.requestData()
        } else {
          this.$msg.error(`业务错误: ${ res.errorMsg || '服务异常' }`)
        }
      })
    },
  },
}
</script>

<style scoped lang="scss">
  @import '../../css/base';

  .box-card {
    .saveBtn {
      width: 110px;
      height: 32px;
      background: $blueColor;
      border-color: $blueColor;
      color: #fff;
      font-size: 14px;
    }
  }

  // Fixed by wangjunjie
  .block__basic {
    .block__header {
      border-bottom: 1px solid #e5e5e5;
      padding-bottom: 14px;
      position: relative;

      &:after {
        content: '';
        position: absolute;
        height: 2px;
        width: 28px;
        background: $blueColor;
        left: 0;
        bottom: -1px;
      }

      .title {
        font-size: 1.16em;
        font-weight: 600;
        text-align: left;
        color: #0f1217;
        line-height: 26px;

        i {
          vertical-align: middle;
        }
      }
    }

    .config__items {
      position: relative;
      margin-top: 24px;

      &:after {
        content: '';
        display: table;
        clear: both
      }

      .pf__item {
        float: left;
        margin-right: 20px;
        margin-bottom: 15px;
        line-height: 32px;
        //display: flex;
        //align-items: center;

        .item__decrease {
          margin-right: 8px;
          font-size: 14px;
          cursor: pointer;
          user-select: none;
        }

        .el-input {
          width: 200px;
          box-shadow: 0px 3px 4px 0px #ececec;
        }
      }

      .item__increase {
        float: left;
        padding: 9px 10px;
        box-shadow: 0px 3px 4px 0px #ececec;
      }
    }
  }
</style>
