<template>
  <el-main class="si">
    <bt-page title="手持终端管理" icon-bg-color="#FF866A">
      <!--    <zPageTitle title="手持终端管理" :show-filter="false">-->
      <!--    </zPageTitle>-->
      <el-row class="less-info-form">
        <el-row class="inner">
          <el-col class="top">
            <p>
              {{ translateTitle('注带') }}
              <span>*</span>
              {{ translateTitle('号为必填项目') }}
            </p>
          </el-col>
          <el-form
            ref="form"
            :model="createData"
            :rules="formRules"
            :disabled="onlyRead"
          >
            <el-form-item :label="translateTitle('设备名称')" prop="name">
              <el-input
                v-model="createData.name"
                :placeholder="translateTitle('设备名称')"
              />
            </el-form-item>
            <el-form-item label="IMEI" prop="uuid">
              <el-input v-model="createData.uuid" placeholder="IMEI" />
            </el-form-item>
            <el-form-item
              :label="translateTitle('设备频率')"
              prop="rfidFrequency"
            >
              <el-select v-model="createData.rfidFrequency" :disabled="!isCreate">
                <el-option value="9.15" label="9.15" />
                <el-option value="13.56" label="13.56" />
                <el-option value="134.2" label="134.2" />
              </el-select>
            </el-form-item>
            <el-form-item :label="translateTitle('设备功率')" prop="rfidPower">
              <el-input
                v-model="createData.rfidPower"
                :disabled="!isCreate"
              />
            </el-form-item>
            <el-form-item
              :label="translateTitle('设备型号')"
              prop="terminalModel"
            >
              <el-input
                v-model="createData.terminalModel"
                :placeholder="translateTitle('设备型号')"
              />
            </el-form-item>
            <el-form-item :label="translateTitle('所属厂区')" prop="factoryId">
              <el-select v-model="createData.factoryId" style="width: 100%">
                <el-option
                  v-for="list in fAreaList"
                  :key="list.id"
                  :value="list.id"
                  :label="list.name"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-row style="margin-bottom: 15px">
                {{ translateTitle('是否启用') }}
                <el-switch v-model="createData.isEnabled" />
              </el-row>
            </el-form-item>
          </el-form>
          <el-row class="form-btns">
            <el-button
              v-if="addFlag"
              class="conBtn"
              type="primary"
              @click="submitInfo"
            >
              {{ translateTitle('确定') }}
            </el-button>
            <el-button
              v-if="editFlag && !onlyRead"
              class="conBtn"
              type="primary"
              @click="confirmEdit"
            >
              {{ translateTitle('修改') }}
            </el-button>
            <el-button
              v-if="addFlag || (editFlag && !onlyRead)"
              class="resetBtn"
              @click="resetData"
            >
              {{ translateTitle('重置') }}
            </el-button>
            <el-button class="cancelBtn" @click="cancelBtn">
              {{ translateTitle('取消') }}
            </el-button>
          </el-row>
        </el-row>
      </el-row>
    </bt-page>
  </el-main>
</template>

<script>
import { hasPermission } from '@/utils/hasPermission'
import { translateTitle } from '../../i18n'
import { addTerminal, terminalUpdate, } from '../../api/handSet'
import { getFactoryList } from '../../api/factory'

export default {
  components: {},
  data () {
    return {
      dropData: [],
      code: 'sys:terminal',
      level3List: [],
      dialogVisible: false,
      dialogVisible2: false,
      isCreate: true,
      addFlag: true,
      editFlag: false,
      onlyRead: false,
      currentPage: 1,
      tableData: [],
      editData: {},
      curIndex: -1,
      tableLoading: false,
      total: 1,
      eachPageSize: 10,
      createData: {
        isEnabled: true,
        rfidFrequency: '9.15',
        rfidPower: '2400',
      },
      fAreaList: [],
      formRules: {},
    }
  },
  watch: {
    '$i18n.locale' () {
      this.setRules()
    },
  },
  created () {
    getFactoryList().then((res) => {
      let { success, data } = res
      if (success) this.fAreaList = data
      console.log('厂区列表--', this.fAreaList)
    })
  },
  mounted () {
    this.setRules()

    setTimeout(() => {
      this.$refs.form.resetFields()
    }, 30)

    // 查看详情
    if (this.$route.query.params)
      this.rowData = JSON.parse(this.$route.query.params)

    if (this.rowData && this.rowData.isEdit) {
      this.onlyRead = this.rowData.onlyRead ? true : false
      this.editFlag = this.rowData.isEdit ? true : false
      if (!this.onlyRead && this.editFlag) this.addFlag = false
      this.createData = Object.assign({}, this.rowData.data)
      this.$refs['form'].resetFields()
      this.createData.isEnabled = this.createData.isEnabled == '禁用' ? false : true
    }
  },
  methods: {
    hasPermission,
    translateTitle,
    setRules () {
      this.formRules = {
        name: [
          {
            required: true,
            message: this.translateTitle('请输入设备名称'),
            trigger: 'blur',
          },
        ],
        uuid: [
          {
            required: true,
            message: this.translateTitle('请输入IMIE'),
            trigger: 'blur',
          },
        ],
        factoryId: [
          {
            required: true,
            message: this.translateTitle('请选择厂区'),
            trigger: 'blur',
          },
        ],
        rfidFrequency: [
          {
            required: true,
            message: this.translateTitle('请选择频率'),
            trigger: 'blur',
          },
        ],
        rfidPower: [
          {
            required: true,
            message: this.translateTitle('请输入设备功率'),
            trigger: 'blur',
          },
        ],
      }
    },
    submitInfo () {
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          this.$msg({
            message: this.translateTitle('必填项不能为空'),
            type: 'error',
          })
          return
        } else {
          addTerminal(this.createData).then((res) => {
            if (res.success == 1) {
              this.$msg({
                message: this.translateTitle('添加成功'),
                type: 'success',
              })
              this.cancelBtn()
            }
          })
        }
      })
    },
    confirmEdit () {
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          this.$msg({
            message: this.translateTitle('必填项不能为空'),
            type: 'error',
          })
          return
        } else {
          terminalUpdate(this.createData).then((res) => {
            // console.log(res)
            if (res.success == 1) {

              this.$msg({
                message: this.translateTitle('更新成功'),
                type: 'success',
                customClass: 'z-el-msg',
                showClose: true,
              })
              this.cancelBtn()
            }
          })
        }
      })
    },
    resetData () {
      this.createData = this.$options.data().createData
      this.$refs.form.resetFields()
    },
    cancelBtn () {
      this.$router.go(-1)
    },
  },
}
</script>

<style scoped lang="scss">
  @import '../../css/base';
</style>
