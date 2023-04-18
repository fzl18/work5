<template>
  <el-dialog
    :visible.sync="dialogFormVisible"
    width="60%"
    @close="dialogFormVisible = false"
  >
    <div id="printMe">
      <!-- 物流信息 -->
      <div id="delivery">
        <el-form
          ref="form"
          :inline="true"
          :model="logInfo"
          :inline-message="true"
          label-width="140px"
          :disabled="type == 'view'"
        >
          <div class="company"><span>物流运输信息</span></div>
          <div class="box">
            <div class="head">
              <div class="title">
                <div class="num">运输单号 (自动生成)</div>
              </div>
            </div>
            <div class="custom">
              <div class=""></div>
              <div class="date">
                日期：{{ dayjs().format('YYYY年 MM月 DD日') }}
              </div>
            </div>
            <div class="body">
              <!-- 物流信息 -->
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="20%">收货单位（客户）：</td>
                  <td>{{ logInfo.customer || info.company }}</td>
                  <td>运输公司：</td>
                  <td>
                    <el-form-item label="" prop="compy">
                      <el-autocomplete
                        v-model="logInfo.compy"
                        :fetch-suggestions="getTransitList"
                        @select="handleSelect"
                      ></el-autocomplete>
                    </el-form-item>
                  </td>
                </tr>
                <tr>
                  <td>收货地址:</td>
                  <td>
                    <el-form-item label="" prop="shipaddress">
                      <el-input v-model="logInfo.shipaddress"></el-input>
                    </el-form-item>
                  </td>
                  <td>车型:</td>
                  <td>
                    <el-form-item label="" prop="cmodel">
                      <el-input v-model="logInfo.cmodel"></el-input>
                    </el-form-item>
                  </td>
                </tr>
                <tr>
                  <td>运费:</td>
                  <td>
                    <el-form-item
                      label=""
                      prop="freight"
                      :rules="[
                        {
                          type: 'number',
                          message: '必须为数字',
                          trigger: 'change',
                        },
                      ]"
                    >
                      <el-input
                        v-model="logInfo.freight"
                        @change="handleNumber('freight', logInfo.freight)"
                      ></el-input>
                    </el-form-item>
                  </td>
                  <td>车牌:</td>
                  <td>
                    <el-form-item label="" prop="lp">
                      <el-input v-model="logInfo.lp"></el-input>
                    </el-form-item>
                  </td>
                </tr>
                <tr>
                  <td>重量</td>
                  <td>
                    <el-form-item
                      label=""
                      prop="weight"
                      :rules="[
                        {
                          type: 'number',
                          message: '必须为数字',
                          trigger: 'change',
                        },
                      ]"
                    >
                      <el-input
                        v-model="logInfo.weight"
                        @change="handleNumber('weight', logInfo.weight, 1)"
                      ></el-input>
                    </el-form-item>
                  </td>
                  <td>司机姓名:</td>
                  <td>
                    <el-form-item label="" prop="contact">
                      <el-input v-model="logInfo.contact"></el-input>
                    </el-form-item>
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td>身份证:</td>
                  <td>
                    <el-form-item label="" prop="card">
                      <el-input v-model.number="logInfo.card"></el-input>
                    </el-form-item>
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td>电话:</td>
                  <td>
                    <el-form-item label="" prop="tel">
                      <el-input v-model.number="logInfo.tel"></el-input>
                    </el-form-item>
                  </td>
                </tr>
              </table>
              <!-- 审核信息 -->
              <div
                v-if="info.log_status || type == 'review'"
                class="goods"
                style="margin-bottom: 10px"
              >
                物流审核
              </div>
              <table
                v-if="info.log_status || type == 'review'"
                cellpadding="0"
                cellspacing="0"
                border="0"
              >
                <tr>
                  <td width="20%">实际运费</td>
                  <td>
                    <el-form-item
                      label=""
                      prop="rfreight"
                      :rules="[
                        {
                          type: 'number',
                          message: '必须为数字',
                          trigger: 'change',
                        },
                      ]"
                    >
                      <el-input
                        v-model="logInfo.rfreight"
                        @change="handleNumber('rfreight', logInfo.rfreight, 1)"
                      ></el-input>
                    </el-form-item>
                  </td>
                  <td>运费差额：</td>
                  <td>
                    {{ logInfo.rfreight - logInfo.freight }}
                  </td>
                </tr>
                <tr>
                  <td>发票日期:</td>
                  <td>
                    <el-form-item label="" prop="idate">
                      <el-date-picker
                        v-model="logInfo.idate"
                        placeholder="选择日期"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="timestamp"
                      ></el-date-picker>
                    </el-form-item>
                  </td>
                  <td>发票号:</td>
                  <td>
                    <el-form-item label="" prop="recptno">
                      <el-input v-model="logInfo.recptno"></el-input>
                    </el-form-item>
                  </td>
                </tr>
                <tr>
                  <td>回单情况:</td>
                  <td>
                    <el-switch
                      v-model="logInfo.backorder"
                      active-text="已收"
                      inactive-text="未收到"
                    ></el-switch>
                  </td>
                  <td></td>
                  <td></td>
                </tr>
              </table>

              <!-- 货物信息 -->
              <div class="goods">货物信息</div>
              <div class="head">
                <div class="title">
                  <div class="num">申请单号: {{ info.number }}</div>
                </div>
              </div>
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <th>序号</th>
                  <th>货物名称</th>
                  <th>规格</th>
                  <th>重量</th>
                  <th>单位</th>
                  <th>数量</th>
                  <th>托/箱</th>
                </tr>
                <tr v-for="(item, index) in info.goodsList" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>{{ item.itemname }}</td>
                  <td>{{ item.format }}</td>
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
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td colspan="7">
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
              <div v-if="info.log_uid">操作员：{{ username }}</div>
            </div>
          </div>
        </el-form>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="big" @click="close">关闭</el-button>
      <el-button
        v-if="type != 'view'"
        type="primary"
        size="big"
        :loading="loading"
        @click="save"
      >
        确认
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
  import dayjs from 'dayjs'
  import { userAll, buscusIndex } from './api'
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
        loading: false,
        userList: [],
        // username: this.$store.state.user.username || window.localStorage.name,
        dialogFormVisible: false,
        info: {},
        logInfo: {
          backorder: false,
          recptno: '',
          idate: null,
          rfreight: null,
          freight: null,
          lp: null,
          weight: null,
          cmodel: null,
          tel: null,
          contact: null,
          compy: null,
          shipaddress: null,
          customer: null,
          card: null,
        },
        emptyList: [],
      }
    },
    computed: {
      username() {
        let name = null
        this.userList.map((item) => {
          if (item.user_id == this.info.log_uid) {
            name = item.nickname
          }
        })
        return name
      },
    },
    created() {
      // console.log(new Date().valueOf())
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
        // console.log(this.info)
        if (this.info.logList.length) {
          this.info.logList[0].idate = this.info.logList[0].idate
            ? this.info.logList[0].idate * 1000
            : null
          this.info.logList[0].backorder = this.info.logList[0].backorder
            ? true
            : false
          this.logInfo = JSON.parse(JSON.stringify(this.info.logList[0]))
          this.handleNumber('rfreight', this.logInfo.rfreight, 3)
          this.handleNumber('freight', this.logInfo.freight, 3)
          this.handleNumber('weight', this.logInfo.weight, 3)
          console.log(this.logInfo)
        } else {
          this.logInfo = {
            backorder: false,
            recptno: '',
            idate: null,
            rfreight: null,
            freight: null,
            lp: null,
            weight: null,
            cmodel: null,
            tel: null,
            contact: null,
            compy: null,
            shipaddress: null,
            customer: null,
            card: null,
          }
        }
        if (this.info.shipaddress) {
          this.logInfo.shipaddress = this.info.shipaddress
        }
      },
      getTransitList(queryString, cb) {
        buscusIndex({
          datatype: 1,
          filter: JSON.stringify({
            compy: queryString,
            type: 2,
          }),
          op: JSON.stringify({
            compy: 'LIKE',
          }),
        }).then((res) => {
          const list = []
          res.rows.forEach((item) => {
            list.push({
              value: item.compy,
              ...item,
            })
          })
          cb(list)
        })
      },
      handleSelect(val) {
        this.logInfo.contact = val.contact
        this.logInfo.tel = val.tel * 1
      },
      handleNumber(name, val, n = 2) {
        // console.log(val)
        this.logInfo[name] = (val * 1).toFixed(n) * 1
      },
      close() {
        this.loading = false
        this.$refs['form'].resetFields()
        // this.form = this.$options.data().form
        this.dialogFormVisible = false
      },
      save() {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            this.loading = true
            if (this.type == 'review') {
              this.logInfo.backorder = this.logInfo.backorder ? 1 : 0
              this.logInfo.customer = this.logInfo.customer || this.info.company
            }
            this.info.logList[0] = this.logInfo
            this.$emit('confirm', this.info)
          } else {
            return false
          }
        })
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
    font-family: '黑体', '微软雅黑', 'Times New Roman', Times, serif;
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
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    // font-family: '微软雅黑', '黑体', 'Times New Roman', Times, serif;
    span {
      padding: 5px 50px;
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
      margin-top: -25px;
      display: flex;
      justify-content: space-between;
    }
    .body {
      margin: 5px 0 20px 0;
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
      .transit {
        border: 3px solid rgb(116, 116, 116);
        padding: 10px;
      }
      .goods {
        font-size: 18px;
        font-weight: bold;
        margin: 30px 0 0px 0;
        text-align: center;
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
  .el-form-item--small.el-form-item {
    margin-bottom: 2px !important;
  }
</style>
