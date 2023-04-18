<template>
  <el-dialog
    :visible.sync="dialogFormVisible"
    width="60%"
    @close="dialogFormVisible = false"
  >
    <div id="printMe">
      <!-- 出门证 -->
      <div v-if="type == 'permit'" id="permit">
        <div class="company"><span>江苏海栋化纤有限公司</span></div>
        <div class="box">
          <div class="head">
            <div class="title">
              <div>出门证</div>
              <div class="num">出门证号: {{ info.pp_number }}</div>
            </div>
          </div>
          <div class="custom">
            <div class="">收货单位（客户）：{{ info.company }}</div>
            <div class="date">
              日期：{{ dayjs(info.pp_time).format('YYYY年MM月DD日') }}
            </div>
          </div>
          <div class="body">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <th>序号</th>
                <th>重量</th>
                <th>单位</th>
                <th>数量</th>
                <th>托/箱</th>
              </tr>
              <tr v-for="(item, index) in info.goodsList" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ item.weight }}</td>
                <td>{{ item.unit }}</td>
                <td>{{ item.nums }}</td>
                <td>{{ item.boxes ? '箱' : '托' }}</td>
              </tr>
              <tr
                v-for="item in emptyList"
                :key="item.index"
                style="height: 26px"
              >
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td colspan="5">
                  <div class="remark">
                    <span>备注：</span>
                    <div>{{ info.remark }}</div>
                  </div>
                </td>
              </tr>
            </table>
          </div>
          <div style="text-align: right">操作员：{{ username }}</div>
        </div>
      </div>
      <!-- 入库单 -->
      <div v-if="type == 'delivery'" id="delivery">
        <div class="company"><span>江苏海栋化纤有限公司</span></div>
        <div class="box">
          <div class="head">
            <div class="title">
              <div>出库单</div>
              <div class="num">出库单号: {{ info.out_number }}</div>
            </div>
          </div>
          <div class="custom">
            <div class="">供应商：{{ info.company }}</div>
            <div class="date">
              日期：{{ dayjs(info.out_time).format('YYYY年MM月DD日') }}
            </div>
          </div>
          <div class="body">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <th>序号</th>
                <th>货物名称</th>
                <th>规格</th>
                <th>重量</th>
                <th>单位</th>
                <th>数量</th>
                <!-- <th>托/箱</th> -->
              </tr>
              <tr v-for="(item, index) in info.goodsList" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ item.itemname }}</td>
                <td>{{ item.format }}</td>
                <td>{{ item.weight }}</td>
                <td>{{ item.unit }}</td>
                <td>{{ item.nums }}</td>
                <!-- <td>{{ item.boxes ? '箱' : '托' }}</td> -->
              </tr>
              <tr
                v-for="item in emptyList"
                :key="item.index"
                style="height: 26px"
              >
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <!-- <td></td> -->
              </tr>
              <tr>
                <td colspan="6">
                  <div class="remark">
                    <span>备注：</span>
                    <div>{{ info.remark }}</div>
                  </div>
                </td>
              </tr>
            </table>
          </div>
          <div class="foot">
            <div></div>
            <div>操作员：{{ username }}</div>
          </div>
        </div>
      </div>
      <!-- 送货单 -->
      <div v-if="type == 'shipping'" id="shipping">
        <div class="company"><span>江苏海栋化纤有限公司</span></div>
        <div class="side">
          <span>存根(白)</span>
          <span>客户(红)</span>
          <span>物流(蓝)</span>
          <span>记账(黄)</span>
        </div>
        <div class="box">
          <div class="head">
            <div class="title">
              <div
                style="
                  display: flex;
                  align-items: center;
                  justify-content: center;
                "
              >
                <div>送货单</div>
                <div
                  v-if="info.style == 2"
                  class="num"
                  style="margin: 0 0 3px 5px"
                >
                  (编号: {{ info.deliv_number }} )
                </div>
              </div>
              <div v-if="info.style != 2" class="num">
                送货单号: {{ info.deliv_number }}
              </div>
            </div>
          </div>
          <div class="custom">
            <div class="">收货单位（客户）：{{ info.company }}</div>
            <div class="date">
              日期：{{ dayjs(info.deliv_time).format('YYYY年MM月DD日') }}
            </div>
          </div>
          <div class="body">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <th width="40">序号</th>
                <th>货物名称</th>
                <th>规格</th>
                <!-- <th>备注</th> -->
                <th>批号</th>
                <th>重量</th>
                <th width="5%">单位</th>
                <th width="60">数量</th>
                <th width="50">托/箱</th>
                <th v-if="info.style == 2" width="5%">单价</th>
                <th v-if="info.style == 2" width="10%">金额</th>
              </tr>
              <tr v-for="(item, index) in info.goodsList" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ item.itemname }}</td>
                <td>{{ item.format }}</td>
                <!-- <td>{{ item.remark }}</td> -->
                <td>{{ item.batchnum }}</td>
                <td>{{ item.weight }}</td>
                <td>{{ item.unit }}</td>
                <td>{{ item.nums }}</td>
                <td>{{ item.boxes ? '箱' : '托' }}</td>
                <td v-if="info.style == 2">{{ item.price }}</td>
                <td v-if="info.style == 2">{{ item.amount }}</td>
              </tr>
              <tr
                v-for="item in emptyList"
                :key="item.index"
                style="height: 26px"
              >
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td v-if="info.style == 2"></td>
                <td v-if="info.style == 2"></td>
              </tr>
              <tr>
                <td :colspan="info.style == 2 ? 10 : 8">
                  <div class="remark">
                    <span>备注：</span>
                    <div v-html="info.remark"></div>
                  </div>
                </td>
              </tr>
            </table>
          </div>
          <div style="text-align: right">操作员：{{ username }}</div>
          <div class="foot">
            <div class="fir">
              <div>
                收货单位
                <br />
                <br />
                及经办人
              </div>
              <div>（盖章）</div>
            </div>
            <div class="sec">
              <div>
                送货单位
                <br />
                <br />
                及经办人
              </div>
              <div>（盖章）</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 退货单 -->
      <div v-if="type == 'return'">
        <div class="company"><span>江苏海栋化纤有限公司</span></div>
        <div class="box">
          <div class="head">
            <div class="title">
              <div>{{ tit }}(退货)</div>
              <div class="num">退货单号:{{ info.rtn_number }}</div>
            </div>
          </div>
          <div class="custom">
            <div class="">收货单位（客户）：{{ info.company }}</div>
            <div class="date">
              日期：{{ dayjs(info.rtn_time).format('YYYY年MM月DD日') }}
            </div>
          </div>
          <div class="body">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <th>序号</th>
                <th>货物名称</th>
                <th>规格</th>
                <!-- <th>备注</th> -->
                <th>批号</th>
                <th>重量</th>
                <th>单位</th>
                <th>数量</th>
                <th>托/箱</th>
                <!-- <th v-if="info.style == 2">单价</th>
                <th v-if="info.style == 2">金额</th> -->
              </tr>
              <tr v-for="(item, index) in info.goodsList" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ item.itemname }}</td>
                <td>{{ item.format }}</td>
                <!-- <td>{{ item.remark }}</td> -->
                <td>{{ item.batchnum }}</td>
                <td>{{ item.weight }}</td>
                <td>{{ item.unit }}</td>
                <td>{{ item.nums }}</td>
                <td>{{ item.boxes ? '箱' : '托' }}</td>
                <!-- <td v-if="info.style == 2">{{ item.price }}</td>
                <td v-if="info.style == 2">{{ item.amount }}</td> -->
              </tr>
              <tr
                v-for="item in emptyList"
                :key="item.index"
                style="height: 26px"
              >
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <!-- <td v-if="info.style == 2"></td>
                <td v-if="info.style == 2"></td> -->
              </tr>
              <tr>
                <td colspan="8">
                  <div class="remark">
                    <span>备注：</span>
                    <div v-html="info.remark"></div>
                  </div>
                </td>
              </tr>
            </table>
            <table
              cellpadding="0"
              cellspacing="0"
              border="0"
              style="margin: 20px 0"
            >
              <tr>
                <th width="15%">回单</th>
                <th width="25%">收货地址</th>
                <th width="10%">车型</th>
                <th width="20%">运输公司</th>
                <th width="10%">运费</th>
                <th width="10%">邮寄费</th>
              </tr>
              <tr>
                <td>
                  {{ info.receipt ? '有' : '无' }}
                </td>
                <td>
                  {{ info.address }}
                </td>
                <td>
                  {{ info.cmodel }}
                </td>
                <td>
                  {{ info.trancom }}
                </td>
                <td>
                  {{ info.fare }}
                </td>
                <td>
                  {{ info.pfee }}
                </td>
              </tr>
            </table>
            <div class="return" style="font-size: 18px; text-align: center">
              退货明细
            </div>
            <table
              cellpadding="0"
              cellspacing="0"
              border="0"
              style="margin-top: 10px"
            >
              <tr>
                <th width="5%">序号</th>
                <th width="20%">货物名称</th>
                <th width="15%">规格</th>
                <!-- <th width="15%">备注</th> -->
                <th width="10%">批号</th>
                <th width="10%">数量</th>
                <th width="10%">托/箱</th>
                <th width="10%">重量</th>
                <th width="5%">单位</th>
                <!-- <th v-if="form.style == 2" width="10%">单价</th>
                <th v-if="form.style == 2" width="10%">金额</th> -->
              </tr>
              <tr v-for="(item, index) in info.returnGoodsList" :key="index">
                <td>{{ index + 1 }}</td>
                <td>
                  {{ item.itemname }}
                </td>
                <td>
                  {{ item.format }}
                </td>
                <!-- <td>
                  {{ item.remark }}
                </td> -->
                <td>
                  {{ item.batchnum }}
                </td>
                <td>
                  {{ item.nums }}
                </td>
                <td>
                  {{ item.boxes ? '箱' : '托' }}
                </td>
                <td>
                  {{ item.weight }}
                </td>
                <td>
                  {{ item.unit }}
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <!-- 查看 -->
      <div v-if="type == 'view'">
        <div class="company"><span>江苏海栋化纤有限公司</span></div>
        <div class="box">
          <div class="head">
            <div class="title">
              <div>{{ tit }}</div>
              <div class="num">单号:{{ info.number }}</div>
            </div>
          </div>
          <div class="custom">
            <div class="">供应商：{{ info.company }}</div>
            <div class="date">
              日期：{{ dayjs(info.create_time).format('YYYY年MM月DD日') }}
            </div>
          </div>
          <div class="body">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <th>序号</th>
                <th>货物名称</th>
                <th>规格</th>
                <!-- <th>备注</th> -->
                <th>批号</th>
                <th>重量</th>
                <th>单位</th>
                <th>数量</th>
                <!-- <th>托/箱</th> -->
                <th>单价</th>
                <th>金额</th>
              </tr>
              <tr v-for="(item, index) in info.goodsList" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ item.itemname }}</td>
                <td>{{ item.format }}</td>
                <!-- <td>{{ item.remark }}</td> -->
                <td>{{ item.batchnum }}</td>
                <td>{{ item.weight }}</td>
                <td>{{ item.unit }}</td>
                <td>{{ item.nums }}</td>
                <!-- <td>{{ item.boxes ? '箱' : '托' }}</td> -->
                <td>{{ item.price }}</td>
                <td>{{ item.amount }}</td>
              </tr>
              <tr
                v-for="item in emptyList"
                :key="item.index"
                style="height: 26px"
              >
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <!-- <td></td> -->
              </tr>
              <tr>
                <td :colspan="9">
                  <div class="remark">
                    <span>备注：</span>
                    <div v-html="info.remark"></div>
                  </div>
                </td>
              </tr>
            </table>
            <!-- <div v-if="info.status == 1" class="review">已审核</div> -->
          </div>
          <div style="text-align: right">操作员：{{ username }}</div>
        </div>
      </div>
    </div>
    <div v-if="type != 'return'" slot="footer" class="dialog-footer">
      <el-button size="big" @click="dialogFormVisible = false">关闭</el-button>
      <el-button
        v-if="type != 'view'"
        v-print="printObj"
        type="primary"
        size="big"
      >
        打印
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
  import dayjs from 'dayjs'
  import { userAll } from './api'
  export default {
    name: 'PrintTemp',
    props: {
      type: {
        type: String,
        default: '',
      },
      tit: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        userList: [],
        // username: this.$store.state.user.username || window.localStorage.name,
        dialogFormVisible: false,
        info: {},
        emptyList: [],
        printObj: {
          id: this.type, // 这里是要打印元素的ID
          popTitle: '	', // 打印的标题
          extraCss: '', // 打印可引入外部的一个 css 文托
          extraHead: '', // 打印头部文字
          preview: true, // 预览
        },
      }
    },
    computed: {
      username() {
        let name = null
        switch (this.type) {
          case 'permit':
            this.userList.map((item) => {
              if (item.user_id == this.info.pp_uid) {
                name = item.nickname
              }
            })
            break
          case 'return':
            this.userList.map((item) => {
              if (item.user_id == this.info.rtn_uid) {
                name = item.nickname
              }
            })
            break
          case 'delivery':
            this.userList.map((item) => {
              if (item.user_id == this.info.out_uid) {
                name = item.nickname
              }
            })
            break
          case 'shipping':
            this.userList.map((item) => {
              if (item.user_id == this.info.deliv_uid) {
                name = item.nickname
              }
            })
            break
          case 'view':
            this.userList.map((item) => {
              if (item.user_id == this.info.uid) {
                name = item.nickname
              }
            })
            break
          default:
            break
        }

        return name
      },
    },
    created() {
      userAll().then((res) => {
        this.userList = res
      })
    },
    methods: {
      dayjs,
      printDiv() {},
      show(row) {
        this.dialogFormVisible = true
        this.info = row
        if (!this.info.goodsList) {
          this.info.goodsList = [{}, {}, {}, {}, {}]
        }
        const data = []
        for (let i = 0; i < 5 - this.info.goodsList.length; i++) {
          data.push({ index: i + 'key' })
        }
        this.emptyList = data
        // console.log(this.info.goodsList.length, this.emptyList)
      },
    },
  }
</script>

<style lang="scss" scoped>
  #printMe {
    font-family: '华文中宋', '黑体', 'Times New Roman', Times, serif;
  }
  #shipping {
    position: relative;
    padding-right: 20px;
    // font-family: '黑体', '微软雅黑', 'Times New Roman', Times, serif;
    .side {
      position: absolute;
      right: 0px;
      top: 80px;
      writing-mode: vertical-lr;
      font-size: 13px;
      font-family: '黑体', '微软雅黑', 'Times New Roman', Times, serif;
      span {
        padding: 5px 0;
      }
    }
  }

  .company {
    font-size: 22px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 15px;
    font-family: '微软雅黑', '黑体', 'Times New Roman', Times, serif;
    span {
      padding: 5px 0px;
      border-bottom: 3px solid #666;
    }
  }
  .box {
    width: 100%;
    padding: 0 20px;
    margin: 0 10px;
    .head {
      display: flex;
      margin-bottom: 10px;
      justify-content: center;
      align-items: flex-start;

      .num {
        color: red;
      }
      .title {
        font-size: 18px;
        text-align: center;
        display: flex;
        flex-direction: column;
        .num {
          font-size: 14px;
          margin-top: 6px;
        }
      }

      .date {
        text-align: right;
        width: 160px;
      }
    }
    .custom {
      display: flex;
      justify-content: space-between;
    }
    .body {
      margin: 5px 0 5px 0;
      table {
        border: 3px solid rgb(116, 116, 116);
        width: 100%;
        th,
        td {
          text-align: center;
          padding: 5px;
          border-right: 1px solid rgb(116, 116, 116);
          border-bottom: 1px solid rgb(116, 116, 116);
          &:last-child {
            border-right: none;
          }
        }
      }
      .review {
        position: absolute;
        right: 10%;
        bottom: 27%;
        display: inline-block;
        color: red;
        border: 3px solid red;
        padding: 5px;
        font-size: 22px;
        transform: rotate(-20deg);
      }
    }
    .foot {
      display: flex;
      justify-content: space-between;
      text-align: right;
      .fir,
      .sec {
        width: 160px;
        margin: 20px 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-right: 50px;
      }
    }
  }
  .remark {
    text-align: left;
    vertical-align: top;
    // padding: 5px;
    white-space: pre-wrap;
    display: flex;
    line-height: 26px;
    span {
      width: 50px;
    }
  }
</style>
