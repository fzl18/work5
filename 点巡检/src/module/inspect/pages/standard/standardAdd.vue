<template>
  <el-main ref="main" class="si">
    <bt-page :title="title" icon-bg-color="#FF866A">
      <!--    <zPageTitle-->
      <!--      :title="title"-->
      <!--      :show-filter="false"-->
      <!--    />-->

      <div class="more-info-form">
        <el-form ref="form" :disabled="onlyRead" :model="form" :rules="rules">
          <div class="top-title">
            <h6>{{ translateTitle('标准信息') }}</h6>
          </div>
          <el-row type="flex" justify="space-between">
            <el-col :span="5">
              <el-form-item
                :label="translateTitle('标准名称')"
                prop="standardName"
              >
                <el-input
                  v-model="form.standardName"
                  :placeholder="translateTitle('标准名称')"
                />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item
                :label="translateTitle('标准类型')"
                prop="standardType"
              >
                <el-select
                  v-model="form.standardType"
                  :placeholder="translateTitle('标准类型')"
                >
                  <el-option
                    v-for="list in standardTypeSelect"
                    :key="list.code"
                    :value="list.code"
                    :label="list.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item
                :label="translateTitle('设备分类')"
                prop="equipmentTypeId"
              >
                <!--<el-select
                  v-model="form.equipmentTypeId"
                  :placeholder="translateTitle('设备分类')"
                >
                  <el-option
                    v-for="list in deviceList"
                    :key="list.id"
                    :value="list.id"
                    :label="list.name"
                  ></el-option>
                </el-select>-->
                <el-cascader
                  v-model="form.deviceKindId"
                  placeholder=""
                  style="width: 100%"
                  :props="propData"
                  :show-all-levels="true"
                  :options="deviceList"
                />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item :label="translateTitle('工具')">
                <el-input
                  v-model="form.pollingTool"
                  :placeholder="translateTitle('工具')"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="space-between">
            <el-col :span="5">
              <el-form-item :label="translateTitle('版本号')" prop="version">
                <el-input
                  v-model="form.version"
                  :placeholder="translateTitle('版本号')"
                />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item :label="translateTitle('生效日期')">
                <el-date-picker
                  v-model="form.effectiveTime"
                  style="width: 100%"
                  :picker-options="expireTimeOption"
                  type="datetime"
                  format="yyyy-MM-dd  HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :placeholder="translateTitle('生效日期')"
                  @change="changeStartTime"
                />
                <span style="font-size: 12px; color: #dcdfe6">
                  不选择， 默认保存之后即刻生效
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item :label="translateTitle('失效日期')">
                <el-date-picker
                  v-model="form.ineffectiveTime"
                  style="width: 100%"
                  :picker-options="expireTimeOptionEnd"
                  type="datetime"
                  format="yyyy-MM-dd  HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :placeholder="translateTitle('失效日期')"
                />
                <span style="font-size: 12px; color: #dcdfe6">
                  不选择，默认永久有效
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="5" />
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item :label="translateTitle('文档')">
                <div style="display: flex">
                  <el-upload
                    ref="uploadForm"
                    class="avatar-uploader"
                    :action="actionUrl"
                    :http-request="uploadfile"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                    :on-remove="removeFile"
                  >
                    <img
                      v-if="form.fileUrl && form.fileType === 'img'"
                      :src="form.fileUrl.pathAll"
                      class="avatar"
                    >

                    <video
                      v-if="form.fileUrl && form.fileType === 'video'"
                      :src="form.fileUrl.pathAll"
                      class="avatar"
                      controls="controls"
                    >
                      您的浏览器不支持视频播放
                    </video>

                    <img
                      v-if="form.fileUrl && form.fileType === 'pdf'"
                      src="@/assets/images/inspect/file_pdf.png"
                      class="avatar"
                    >
                    <img
                      v-if="form.fileUrl && form.fileType === 'word'"
                      src="@/assets/images/inspect/file_word.png"
                      class="avatar"
                    >

                    <el-button size="small" type="primary">
                      上传图片/PDF/Word/视频
                    </el-button>
                  </el-upload>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item :label="translateTitle('目标')">
                <el-input
                  v-model="form.pollingTarget"
                  type="textarea"
                  :placeholder="translateTitle('目标')"
                  :rows="3"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item :label="translateTitle('备注')">
                <el-input
                  v-model="form.remark"
                  :placeholder="translateTitle('备注')"
                  type="textarea"
                  :rows="3"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <div class="top-title">
            <h6>{{ translateTitle('标准工作内容') }}</h6>
          </div>
          <el-row style="margin-bottom: 15px">
            <el-col>
              <el-button
                type="primary"
                :disabeld="onlyRead"
                @click="dialogVisible = true"
              >
                {{ translateTitle('新建工作内容') }}
              </el-button>
            </el-col>
          </el-row>
          <el-row style="margin-bottom: 30px">
            <el-col>
              <el-table :data="tableContentData" stripe>
                <el-table-column
                  prop="contentName"
                  :label="translateTitle('工作内容名称')"
                />
                <el-table-column :label="translateTitle('填表方式')">
                  <template #default="scope">
                    {{
                      scope.row.recordType == '1' ? translateTitle('单选') : ''
                    }}
                    {{
                      scope.row.recordType == '2' ? translateTitle('多选') : ''
                    }}
                    {{
                      scope.row.recordType == '3' ? translateTitle('数值') : ''
                    }}
                    {{
                      scope.row.recordType == '4' ? translateTitle('文本') : ''
                    }}
                  </template>
                </el-table-column>
                <el-table-column :label="translateTitle('数据类型')">
                  <template #default="scope">
                    {{ getActualStr(scope.row.actualType) }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="normalOptionStr"
                  :label="translateTitle('正常值')"
                />
                <el-table-column
                  prop="abnormalOptionStr"
                  :label="translateTitle('异常值')"
                />
                <el-table-column
                  prop="maxNumber"
                  :label="translateTitle('上限')"
                />
                <el-table-column
                  prop="minNumber"
                  :label="translateTitle('下限')"
                />
                <el-table-column
                  prop="placeholder"
                  :label="translateTitle('默认值')"
                />
                <el-table-column fixed="right" :label="translateTitle('操作')">
                  <template #default="slotData">
                    <zDropicon
                      :slot-data="{ scope: slotData }"
                      :op-list="contentOpList"
                      @handleIconFn="handleIconFn"
                    />
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-form>
        <div class="form-btns">
          <el-button
            v-if="addFlag"
            class="conBtn"
            type="primary"
            @click="doCreateStandard"
          >
            {{ translateTitle('确定') }}
          </el-button>
          <el-button
            v-if="editFlag && !onlyRead"
            class="conBtn"
            type="primary"
            @click="doEditStandard"
          >
            {{ translateTitle('修改') }}
          </el-button>
          <el-button
            v-if="addFlag || (editFlag && !onlyRead)"
            class="resetBtn"
            @click="doReset"
          >
            {{ translateTitle('重置') }}
          </el-button>
          <el-button class="cancelBtn" @click="cancelBtn">
            {{ translateTitle('取消') }}
          </el-button>
        </div>
      </div>
      <!-- 新建,编辑工作内容 -->
      <el-dialog
        :close-on-click-modal="false"
        :title="
          editContentFlag
            ? translateTitle('编辑工作内容')
            : translateTitle('新建工作内容')
        "
        :visible.sync="dialogVisible"
        :before-close="cancelAddContent"
      >
        <div>
          <el-form
            ref="contentForm"
            style="width: 80%; margin: 0 auto 0"
            label-width="120px"
            :rules="contentRule"
            :model="createContentData"
          >
            <el-form-item
              :label="translateTitle('工作内容名称')"
              prop="contentName"
            >
              <el-input v-model="createContentData.contentName" />
            </el-form-item>
            <el-form-item :label="translateTitle('填表方式')" prop="recordType">
              <el-select
                v-model="createContentData.recordType"
                @change="contentSelectChange"
              >
                <el-option
                  v-for="list in contentTypeSelect"
                  :key="list.code"
                  :value="list.code"
                  :label="translateTitle(list.value)"
                />
              </el-select>
            </el-form-item>
            <!-- contentActualTypeSelect -->
            <el-form-item
              :label="translateTitle('结果数据类型')"
              prop="actualType"
            >
              <el-select
                v-model="createContentData.actualType"
                :disabled="createContentData.recordType == '1' ||createContentData.recordType == '2'
                  ||createContentData.recordType == '4'"
              >
                <el-option
                  v-for="list in contentActualTypeSelect"
                  :key="list.code"
                  :value="list.code"
                  :label="translateTitle(list.value)"
                />
              </el-select>
            </el-form-item>
            <el-form-item style="margin-bottom: 0">
              <span style="font-size: 12px; color: #dcdfe6">
                {{ translateTitle('工作内容提示') }}！
              </span>
            </el-form-item>
            <el-form-item :label="translateTitle('正常值')">
              <el-input
                v-model="createContentData.normalOptionStr"
                :disabled="recordContentType == '3' || recordContentType == '4'"
                type="textarea"
                rows="3"
              />
            </el-form-item>
            <el-form-item :label="translateTitle('异常值')">
              <el-input
                v-model="createContentData.abnormalOptionStr"
                :disabled="recordContentType == '3' || recordContentType == '4'"
                type="textarea"
                rows="3"
              />
            </el-form-item>
            <el-form-item :label="translateTitle('上限')">
              <el-input
                v-model="createContentData.maxNumber"
                :disabled="recordContentType == '1' ||recordContentType == '2' ||recordContentType == '4'"
              />
            </el-form-item>
            <el-form-item :label="translateTitle('下限')">
              <el-input
                v-model="createContentData.minNumber"
                :disabled="recordContentType == '1' ||recordContentType == '2' ||recordContentType == '4'"
              />
            </el-form-item>
            <el-form-item :label="translateTitle('默认值')">
              <el-input
                v-model="createContentData.placeholder"
                type="textarea"
                rows="2"
              />
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button class="conBtn" type="primary" @click="confirmAddContent">
            {{ translateTitle('确定') }}
          </el-button>
          <el-button class="cancelBtn" @click="cancelAddContent">
            {{ translateTitle('取消') }}
          </el-button>
        </div>
      </el-dialog>
    </bt-page>
  </el-main>
</template>

<script>
import { hasPermission } from '@/utils/hasPermission'
import { translateTitle } from '../../i18n'
import { getSelectEnums } from '../../api/index'
import { createNewPollingStandard, getPollingStandardById, updatePollingStandard, } from '../../api/standard'
import { listEquipTypeTree } from '../../api/basicSetting/equipType'
import Api from '../../api/faultClass'
import zDropicon from '../../components/zDropicon'
// import zPageTitle from '../../components/zPageTitle'

export default {
  components: {
    zDropicon
    // zPageTitle,
  },
  data () {
    return {
      code: 'em:polling_standard',
      title: "点巡检标准（新增）",
      actionUrl: ``,
      fileList: [],
      fileType: '',
      level3List: [],
      dialog: false,
      //内容操作list
      contentOpList: [
        { value: '编辑', disabled: false },
        { value: '删除', disabled: false },
      ],
      dialogVisible: false,
      addFlag: true,
      editFlag: false,
      onlyRead: false,
      //编辑工作内容
      editContentFlag: false,
      editContentIndex: -1,
      tableData: [],
      tableContentData: [],
      tableLoading: false,
      total: 1,
      eachPageSize: 10,
      currentPage: 1,
      //记录方式
      recordContentType: '1',
      createContentData: {
        contentName: '',
        recordType: '1',
        actualType: '1',
        normalOptionStr: '',
        normalOptionList: [],
        abnormalOptionStr: '',
        abnormalOptionList: [],
        maxNumber: '',
        minNumber: '',
        placeholder: '',
      },
      //编辑内容临时数据
      tempContentData: {},
      editContentData: {},
      searchData: {
        standardName: '',
      },
      curStandardData: null,
      //巡检标准下拉枚举
      ENUM_KEY: 'POLLING_TYPE',
      //巡检标准类型列表
      standardTypeSelect: [],
      //填表方式下拉枚举
      ENUM_KEY2: 'POLLING_CONTENT_TYPE',
      ENUM_KEY3: 'POLLING_CONTENT_ACTUAL',
      //填表方式下拉列表
      contentTypeSelect: [],
      contentActualTypeSelect: [],
      propData: {
        label: 'kindName',
        value: 'id',
        children: 'children',
        emitPath: false,
        checkStrictly: true,
      },
      //设备类型
      deviceList: [],
      form: {
        standardName: '',
        standardType: '1',
        version: '',
        // equipmentTypeId: '',
        deviceKindId: '',
        contentSaveDTOList: [],
        effectiveTime: '',
        ineffectiveTime: '',
        remark: '',
        pollingTool: '',
        pollingTarget: '',
      },
      //巡检标准form
      rules: {},
      //工作内容form
      contentRule: {},
      //过期时间不可用
      expireTimeOption: {
        disabledDate (date) {
          return date.getTime() < Date.now()
        },
      },
      expireTimeOptionEnd: {
        disabledDate: (date) => {
          if (this.form.effectiveTime) {
            return (
              date.getTime() <
              new Date(this.form.effectiveTime).getTime() +
              24 * 60 * 60 * 1000
            )
          } else {
            return date.getTime() < Date.now()
          }
        },
      },
    }
  },
  watch: {
    onlyRead (newVal, oldVal) {
      if (newVal) {
        this.contentOpList.forEach((item) => (item.disabled = true))
      } else {
        this.contentOpList.forEach((item) => (item.disabled = false))
      }
    },
    '$i18n.locale' () {
      this.setRules()
    },
  },
  async created () {

    /*getAllDeviceTypeList().then((res) => {
      if (res.success == 1) {
        let { data } = res
        this.deviceList = data
        // console.log('设备分类列表-', this.deviceList)
      }
    })*/
    /*
    monitorApi.getKindPage({params: {ignoreConveyor: '1'}})
      .then((res) => {
        let { data } = res
        this.deviceList = this.getTreeData(data)
      })
     */
    listEquipTypeTree().then(res => {
      if (res.success) {
        this.deviceList = this.getTreeData(res.data)
      }
    })
    //selectEnums
    await getSelectEnums().then((res) => {
      let enumData = res.data
      this.standardTypeSelect = enumData[this.ENUM_KEY]
      this.contentTypeSelect = enumData[this.ENUM_KEY2]
      this.contentActualTypeSelect = enumData[this.ENUM_KEY3]
    })
    /* console.log('巡检标准下拉枚举--', this.standardTypeSelect)
    console.log('填表方式下拉枚举--', this.contentTypeSelect) */
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
      let onlyRead = this.rowData.onlyRead ? true : false
      this.title = onlyRead ? "点巡检标准（查看）" : "点巡检标准（编辑）"
      this.getPollingStandardInfoById(onlyRead)
    }

  },
  methods: {
    hasPermission,
    translateTitle,
    setRules () {
      this.rules = {
        standardName: [
          {
            required: true,
            message: this.translateTitle('工作名称不可为空'),
            trigger: 'blur',
          },
        ],
        standardType: [
          {
            required: true,
            message: this.translateTitle('标准类型不可为空'),
            trigger: 'blur',
          },
        ],
        deviceKindId: [
          {
            required: true,
            message: this.translateTitle('设备分类不可为空'),
            trigger: ['blur', 'change'],
          },
        ],
        version: [
          {
            required: true,
            message: this.translateTitle('版本号不可为空'),
            trigger: 'blur',
          },
        ],
      }
      this.contentRule = {
        contentName: [
          {
            required: true,
            message: this.translateTitle('名称不可为空'),
            trigger: 'blur',
          },
        ],
        recordType: [
          {
            required: true,
            message: this.translateTitle('类型不可为空'),
            trigger: ['blur', 'change'],
          },
        ],
      }
    },
    handleIconClick () {
      this.dialog = true
    },
    cancelBtn () {
      this.$router.go(-1)
    },
    doReset () {
      this.form = this.$options.data().form
      this.tableContentData = []
      this.$refs.form.resetFields()
      this.$refs.zTable.doLayout()
    },
    //当前选中的标准
    handleCurStandardChange (val) {
      this.curStandardData = val
    },
    //工作内容编辑
    handleEditContent (index, row) {
      this.editContentFlag = true
      this.editContentIndex = index
      this.createContentData = row
      this.tempContentData = Object.assign({}, row)
      this.recordContentType = row.recordType
      this.dialogVisible = true
    },
    //工作内容删除
    handleDeleteContent (index, row) {
      this.tableContentData.splice(index, 1)
    },
    //添加工作内容
    confirmAddContent () {
      this.$refs.contentForm.validate((valid) => {
        if (!valid) {
          return
        } else {
          if (this.recordContentType == '3') {
            if (
              this.createContentData.maxNumber === '' ||
              this.createContentData.minNumber === ''
            ) {
              this.$msg({
                message: this.translateTitle('上下限必填且上限必须大于下限'),
                type: 'error',
              })
              return
            } else {
              if (
                !isNaN(this.createContentData.maxNumber) &&
                !isNaN(this.createContentData.minNumber)
              ) {
                if (
                  Number(this.createContentData.minNumber) >=
                  Number(this.createContentData.maxNumber)
                ) {
                  this.$msg({
                    message:
                      this.translateTitle('上下限必填且上限必须大于下限'),
                    type: 'error',
                  })
                  return
                }
                //只能保留2位小数
                let testFn = (str) => {
                  if (str.indexOf('.') != -1) {
                    let s = str.split('.')[1]
                    if (s) {
                      if (s.length > 2) {
                        this.$msg({
                          message: this.translateTitle('最多输入2位小数'),
                          type: 'error',
                        })
                        return false
                      }
                    } else {
                      this.$msg({
                        message: this.translateTitle('上下限数值格式错误'),
                        type: 'error',
                      })
                      return false
                    }
                    return true
                  }
                }
                let max = String(this.createContentData.maxNumber)
                let min = String(this.createContentData.minNumber)
                if (max.indexOf('.') != -1) {
                  if (!testFn(max)) return
                }
                if (min.indexOf('.') != -1) {
                  if (!testFn(min)) return
                }
              } else {
                this.$msg({
                  message: this.translateTitle('上下限必填，只能输入数字'),
                  type: 'error',
                })
                return
              }
            }
          }
          let obj = Object.assign({}, this.createContentData)
          if (!this.editContentFlag) {
            this.tableContentData.push(obj)
          } else {
            this.tableContentData.splice(this.editContentIndex, 1, obj)
          }
          //reset
          this.dialogVisible = false
          this.editContentFlag = false
          this.$refs.contentForm.resetFields()
          this.recordContentType = '1'
          this.createContentData = this.$options.data().createContentData
        }
      })
    },
    //取消添加工作内容
    cancelAddContent () {
      this.dialogVisible = false
      this.editContentFlag = false
      this.$refs.contentForm.resetFields()
      if (this.editFlag) {
        let obj = Object.assign({}, this.tempContentData)
        this.tableContentData.splice(this.editContentIndex, 1, obj)
        this.tempContentData = {}
      }
      this.editContentIndex = -1
      this.recordContentType = '1'
      this.createContentData = this.$options.data().createContentData
    },
    //添加巡检标准
    doCreateStandard () {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          this.$msg({
            message: this.translateTitle('必填项不能为空'),
            type: 'error',
          })
          return
        } else {
          if (this.tableContentData.length == 0) {
            this.$msg({
              message: this.translateTitle('工作内容不可为空'),
              type: 'error',
            })
            return
          } else {
            let removeEmpty = (list) => {
              let result = []
              list.forEach((item) => {
                if (item != '') result.push(item)
              })
              return result
            }
            this.tableContentData.forEach((item) => {
              let str1 = item.normalOptionStr
              let str2 = item.abnormalOptionStr
              let valList1 = str1
                .replace(/\n/g, '|')
                .split('|')
                .map((item) => item.replace(/\s+/g, ''))
              let valList2 = str2
                .replace(/\n/g, '|')
                .split('|')
                .map((item) => item.replace(/\s+/g, ''))
              valList1 = removeEmpty(valList1)
              valList2 = removeEmpty(valList2)

              item.normalOptionList = valList1
              item.abnormalOptionList = valList2
            })
            this.form.contentSaveDTOList = [...this.tableContentData]
            createNewPollingStandard(this.form).then((res) => {
              if (res.success == 1) {
                this.$msg({
                  message: this.translateTitle('创建成功'),
                  type: 'success',
                })
                this.cancelBtn()
              }
            })
          }
        }
      })
    },
    //确认修改 更新巡检标准
    doEditStandard () {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          this.$msg({
            message: this.translateTitle('必填项不能为空'),
            type: 'error',
          })
          return
        } else {
          if (this.tableContentData.length == 0) {
            this.$msg({
              message: this.translateTitle('工作内容不可为空'),
              type: 'error',
            })
            return
          }
          let removeEmpty = (list) => {
            let result = []
            list.forEach((item) => {
              if (item != '') result.push(item)
            })
            return result
          }
          this.tableContentData.forEach((item) => {
            let str1 = item.normalOptionStr
            let str2 = item.abnormalOptionStr
            let valList1 = str1
              .replace(/\n/g, '|')
              .split('|')
              .map((item) => item.replace(/\s+/g, ''))
            let valList2 = str2
              .replace(/\n/g, '|')
              .split('|')
              .map((item) => item.replace(/\s+/g, ''))
            valList1 = removeEmpty(valList1)
            valList2 = removeEmpty(valList2)
            item.normalOptionList = valList1
            item.abnormalOptionList = valList2
          })
          this.form.contentUpdateDTOList = [...this.tableContentData]
          updatePollingStandard(this.form).then((res) => {
            if (res.success == 1) {
              this.$msg({
                message: this.translateTitle('更新成功'),
                type: 'success',
              })
              this.cancelBtn()
            }
          })
        }
      })
    },
    //查看标准详情
    getPollingStandardInfoById (onlyRead) {
      getPollingStandardById({ id: this.rowData.data.id }).then((res) => {
        // console.log(res)
        if (res.success == 1) {
          let { data } = res
          this.form = Object.assign({}, data)
          data.contentVOList.forEach((item) => {
            // item.normalOptionStr = item.normalOptionList.join('\n')
            // item.abnormalOptionStr = item.abnormalOptionList.join('\n')
            let normalOptionStr = item.normalOptionList.join('\n')
            let abnormalOptionStr = item.abnormalOptionList.join('\n')
            this.$set(item, 'normalOptionStr', normalOptionStr)
            this.$set(item, 'abnormalOptionStr', abnormalOptionStr)
          })
          //多个内容数据
          this.tableContentData = [...data.contentVOList]
          this.editFlag = true
          this.addFlag = false
          this.onlyRead = onlyRead
        }
      })
    },
    contentSelectChange () {
      this.recordContentType = this.createContentData.recordType
      switch (this.createContentData.recordType) {
        case '1':
          this.createContentData.maxNumber = ''
          this.createContentData.minNumber = ''
          this.createContentData.actualType =
            this.contentActualTypeSelect[0].code
          break
        case '2':
          this.createContentData.maxNumber = ''
          this.createContentData.minNumber = ''
          this.createContentData.actualType =
            this.contentActualTypeSelect[0].code
          break
        case '3':
          this.createContentData.normalOptionStr = ''
          this.createContentData.abnormalOptionStr = ''
          break
        case '4':
          this.createContentData.maxNumber = ''
          this.createContentData.minNumber = ''
          this.createContentData.normalOptionStr = ''
          this.createContentData.abnormalOptionStr = ''
          this.createContentData.actualType =
            this.contentActualTypeSelect[0].code
          break
      }
    },
    showOrHidden (arr) {
      arr.forEach((item) => {
        item.disabled = hasPermission(item.hasPermission) ? false : true
      })
    },
    changeStartTime (date) {
      this.form.ineffectiveTime = ''
    },
    closeDrawer () {
      this.dialog = false
    },
    handleIconFn (res) {
      switch (res.type) {
        case '编辑':
          this.handleEditContent(res.index, res.row)
          break
        case '删除':
          this.handleDeleteContent(res.index, res.row)
          break
      }
    },
    getActualStr (code) {
      let result
      this.contentActualTypeSelect.forEach((item) => {
        if (item.code == code) result = item.value
      })
      return result
    },
    // 上传
    uploadfile (o) {
      var that = this
      var params = new FormData()
      params.set('file', o.file)
      Api.uploadFile(params, 'public').then((res) => {
        // this.fileMap.set(o.file.uid, res.data.id)
        // this.$emit('addSn', res.data.sn)
        if (res.success === 1 && res.data) {
          that.form.fileUrl = res.data
          that.form.fileType = this.fileType
          this.$forceUpdate()
        }
      })
    },
    handleAvatarSuccess (res, file) {},
    beforeAvatarUpload (file) {
      const images = ['image/jpeg', 'image/png', 'image/jpg']
      const videos = [
        'video/mp4',
        'video/ogg',
        'video/flv',
        'video/avi',
        'video/wmv',
        'video/rmvb',
      ]
      const pdfs = ['application/pdf']
      const words = [
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
      ]
      if (images.concat(videos, pdfs, words).indexOf(file.type) == -1) {
        this.$message.error('请上传正确的图片/PDF/Word/视频格式')
        return false
      }
      if (!this.checkFile(images, file, 5, 'img')) return false
      if (!this.checkFile(videos, file, 10, 'video')) return false
      if (!this.checkFile(pdfs, file, 5, 'pdf')) return false
      if (!this.checkFile(words, file, 5, 'word')) return false
    },
    checkFile (fileTypes, file, limtSize, fileType) {
      const isLtSize = file.size / 1024 / 1024 < limtSize
      if (fileTypes.indexOf(file.type) !== -1) {
        if (!isLtSize) {
          this.$message.error(`上传文件大小不能超过 ${ limtSize }MB!`)
          return false
        } else {
          this.fileType = fileType
        }
      }
      return true
    },
    handleExceed (files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${ files.length } 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      )
    },
    removeFile (files, fileList) {
      this.form.fileUrl = ''
      this.$forceUpdate()
    },
    getTreeData (data) {
      // 循环遍历json数据
      for (var i = 0; i < data.length; i++) {
        if ((data[i].children == undefined) || (data[i].children.length < 1)) {
          // children若为空数组，则将children设为undefined
          data[i].children = undefined;
        } else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].children);
        }
      }
      return data;
    }
  },
}
</script>

<style lang="scss" scoped>
  @import '../../css/base';

  .avatar-uploader {
    border: 1px dashed #d9d9d9;

    .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .el-upload:hover {
      border-color: #409eff;
    }

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 100px;
      height: 100px;
      line-height: 100px;
      text-align: center;
    }

    .avatar {
      width: 100px;
      height: 100px;
      display: block;
    }
  }
</style>
