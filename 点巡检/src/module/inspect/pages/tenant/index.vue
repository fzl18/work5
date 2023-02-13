<template>
  <el-main ref="main" class="si">
    <el-card class="box-card si-title" shadow="hover">
      <div slot="header" class="z-card-header">
        <div class="z-c-in">
          <div class="left">
            <i class="el-icon-document-copy" />
            <span>租户列表</span>
          </div>
          <div class="right">
            <zDropdown :drop-data="dropData" @handleDropClick="handleCommand" />
            <div class="icon-sm" @click="dialog = true">
              <remix-icon
                icon-class="bt-filter"
                class="remix-icon"
                is-svg
              />
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <div
      v-show="tipIndex == 1"
      style="padding: 20px; background: #fff; border-radius: 5px"
    >
      <el-row>
        <zTable
          ref="zTable"
          :table-data="tableData"
          :cols="cols"
          :total="pageConfig.total"
          :each-page-size="pageConfig.eachPageSize"
          :current-page="pageConfig.currentPage"
          :show-handle="true"
          :show-index="true"
          @pageChange="handleCurrentChange"
        >
          <template #isEnabled="scope">
            {{ scope.row.isEnabled ? '启用' : '禁用' }}
          </template>
          <template #createdTime="scope">
            {{ scope.row.createdTime.split(' ')[0] }}
          </template>
          <template #industryType="scope">
            {{ getInType(scope.row.industryType) }}
          </template>
          <template #handle="slotData">
            <el-dropdown class="s-dropdown-onlyicon" placement="bottom">
              <span class="el-dropdown-link">
                <span class="s-span"><i class="el-icon-caret-bottom" /></span>
              </span>
              <el-dropdown-menu slot="dropdown" class="s-dropdown-menu">
                <el-dropdown-item
                  @click.native="
                    handleView(slotData.scope.$index, slotData.scope.row)
                  "
                >
                  <i class="el-icon-view" />
                  查看
                </el-dropdown-item>
                <el-dropdown-item
                  @click.native="
                    handleEdit(slotData.scope.$index, slotData.scope.row)
                  "
                >
                  <i class="el-icon-edit" />
                  编辑
                </el-dropdown-item>
                <el-dropdown-item
                  @click.native="
                    handleDelete(slotData.scope.$index, slotData.scope.row)
                  "
                >
                  <i class="el-icon-delete" />
                  删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </zTable>
      </el-row>

      <!--  <el-row>
                <el-col :span="24">
                    <el-tabs type="border-card">
                        <el-tab-pane label="产品">
                            <el-table
                                ref="rTable"
                                :data="tableContentData"
                                height="200"
                                v-loading="tableContentLoading"
                                border
                                style="width: 100%">
                               <el-table-column
                                type="index"
                                label="序号"
                                width="50">
                                    <template slot-scope="scope">
                                        <span>{{scope.$index + 1}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="productName"
                                    label="产品名称">
                                </el-table-column>
                                <el-table-column
                                    label="时间">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.startTime}} 至 {{scope.row.endTime}}</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                    </el-tabs>
                </el-col>
            </el-row> -->
    </div>

    <!-- 新增 编辑 -->
    <div v-show="tipIndex == 2" class="more-info-form">
      <el-form
        ref="form"
        :model="createInfo"
        :rules="formRules"
        :disabled="onlyRead"
      >
        <div class="top-title">
          <h6>租户信息</h6>
        </div>
        <el-row type="flex" justify="space-between">
          <el-col :span="5">
            <el-form-item label="租户名称" prop="name">
              <el-input
                v-model="createInfo.name"
                placeholder="租户名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="域名" prop="domain">
              <el-input
                v-model="createInfo.domain"
                placeholder="域名"
              />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="地址" prop="address">
              <el-input
                v-model="createInfo.address"
                placeholder="地址"
              />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="联系人" prop="contacts">
              <el-input
                v-model="createInfo.contacts"
                placeholder="联系人"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="space-between">
          <el-col :span="5">
            <el-form-item label="行业分类" prop="industryType">
              <el-select
                v-model="createInfo.industryType"
                placeholder="行业分类"
              >
                <el-option
                  v-for="(item, index) in INDUSTRY_TYPE"
                  :key="index"
                  :label="item.value"
                  :value="item.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="手机号" prop="cellphone">
              <el-input
                v-model="createInfo.cellphone"
                placeholder="手机号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="座机号" prop="telephone">
              <el-input
                v-model="createInfo.telephone"
                placeholder="座机号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="createInfo.email"
                placeholder="邮箱"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="space-between">
          <el-col :span="5">
            <el-form-item label="网址" prop="website">
              <el-input
                v-model="createInfo.website"
                placeholder="网址"
              />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="是否启用" prop="isEnabled">
              <el-select v-model="createInfo.isEnabled" placeholder="是否启用">
                <el-option label="启用" :value="true" />
                <el-option label="禁用" :value="false" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" />
          <el-col :span="5" />
        </el-row>
        <div class="top-title">
          <h6>租户logo</h6>
        </div>
        <el-row>
          <el-col>
            <el-form-item>
              <zUpload
                ref="upload1"
                type="img"
                :only-read="onlyRead"
                :limit="1"
                :multiple="false"
                :file-list="imgList"
                :dir-obj="{ dir: 'workDir', name: 'equip' }"
                @handleUpload="handleUpload"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="form-btns">
        <el-button v-if="addFlag" class="conBtn" type="primary" @click="addFn">
          提 交
        </el-button>
        <el-button
          v-if="editFlag"
          class="conBtn"
          type="primary"
          @click="updateFn"
        >
          提 交
        </el-button>
        <el-button v-if="addFlag || editFlag" class="resetBtn" @click="doReset">
          重 置
        </el-button>
        <el-button class="cancelBtn" @click="handleCloseAdd">取 消</el-button>
      </div>
    </div>

    <!-- 未开通产品弹窗 -->
    <el-dialog
      :close-on-click-modal="false"
      title="开通租户产品"
      width="50%"
      :visible.sync="dialogPrd"
      :before-close="handleClosePrd"
    >
      <div>
        <el-row>
          <el-col>
            <el-table
              v-loading="tablePrdLoading"
              height="240"
              :data="tablePrdData"
              border
              highlight-current-row
              style="width: 100%"
              @current-change="handleCurPrdChange"
            >
              <el-table-column type="index" label="序号" width="50">
                <template slot-scope="scope">
                  <span>{{ scope.$index + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="productCode"
                label="产品代码"
              />
              <el-table-column
                prop="productName"
                label="产品名称"
              />
            </el-table>
          </el-col>
          <el-col style="margin: 15px 0">
            <p style="font-size: 16px; margin-bottom: 15px">
              设置产品时间及状态
            </p>
            <div class="flex-between">
              <el-date-picker
                v-model="createPrdData.timeArr"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                type="daterange"
                :picker-options="expireTimeOption"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
              <div>
                是否启用:
                <el-switch v-model="createPrdData.isEnabled" />
                <span v-if="createPrdData.isEnabled">启用</span>
                <span v-else>禁用</span>
              </div>
            </div>
          </el-col>
          <el-col>
            <p style="font-size: 16px; margin-bottom: 15px">备注说明</p>
            <el-input
              v-model="createPrdData.remarks"
              type="textarea"
              placeholder="备注说明"
            />
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClosePrd">取 消</el-button>
        <el-button type="primary" @click="confirmAddPrd">提 交</el-button>
      </span>
    </el-dialog>

    <el-drawer
      ref="drawer"
      :before-close="handleClose"
      :visible.sync="dialog"
      direction="rtl"
      :size="310"
      custom-class="s-drawer"
    >
      <div slot="title" class="d-title">
        筛选条件
        <span class="line" />
      </div>
      <div class="s-drawer__content">
        <el-form class="si-title-body">
          <el-form-item label="用户名:">
            <el-input
              v-model="searchInfo.nameLike"
              placeholder="请输入租户名称"
              prefix-icon="el-icon-search"
              @keydown.enter.native="doSearch"
            />
          </el-form-item>
          <el-form-item label="用户名:">
            <el-select
              v-model="searchInfo.industryType"
              clearable
              placeholder="行业分类"
            >
              <el-option
                v-for="(item, index) in INDUSTRY_TYPE"
                :key="index"
                :label="item.value"
                :value="item.code"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div class="s-drawer__footer">
          <el-button type="primary" class="conBtn" @click="doSearch">
            搜索
          </el-button>
        </div>
      </div>
    </el-drawer>
  </el-main>
</template>

<script>
  import {
    getTenantList,
    createTenant,
    deleteTenant,
    updateTenant,
    getTenantOpenPrdList,
    getTenantNotOpenPrdList,
    openTenantPrd,
    getTenantInfoById,
  } from '../../api/tenant'
  import { getSelectEnums } from '../../api/index'
  import zTable from '../../components/zTable'
  import zDropdown from '../../components/zDropdown'
  import zUpload from '../../components/zUpload'

  export default {
    components: {
      zDropdown,
      zTable,
      zUpload,
    },
    data() {
      return {
        cols: [
          { label: '企业名称', prop: 'name' },
          { label: '行业分类', slot: 'industryType' },
          { label: '工号', prop: 'code' },
          { label: '域名', prop: 'domain' },
          { label: '地址', prop: 'address' },
          { label: '手机号', prop: 'cellphone' },
          { label: '座机号', prop: 'telephone' },
          { label: '联系人', prop: 'contacts' },
          { label: '邮箱', prop: 'email' },
          { label: '网址', prop: 'website' },
          { label: '账号状态', slot: 'isEnabled' },
          { label: '创建时间', slot: 'createdTime' },
          // {label:'修改时间',prop:'updatedTime'},
        ],
        dropData: [
          {
            command: 'create',
            value: '新建租户',
            iconClass: 'el-icon-plus',
          },
          // {command:'createProd',value:'开通产品',iconClass:'el-icon-plus'}
        ],
        dialog: false,
        tipIndex: 1,
        addFlag: true,
        editFlag: false,
        onlyRead: false,
        tableData: [],
        tableContentData: [],
        tablePrdData: [],
        tableContentLoading: false,
        tablePrdLoading: false,
        pageConfig: {
          total: 0,
          eachPageSize: 10,
          currentPage: 1,
        },
        searchInfo: {
          nameLike: '',
          industryType: '',
        },
        dialogPrd: false,
        createInfo: {
          domain: '',
          isEnabled: true,
          name: '',
          address: '',
          cellphone: '',
          telephone: '',
          contacts: '',
          industryType: '',
          website: '',
          logoAttachId: '',
        },
        formRules: {
          name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
          industryType: [
            {
              required: true,
              message: '请选择行业',
              trigger: ['blur', 'change'],
            },
          ],
        },
        //当前选择的租户
        curTenantInfo: null,
        //当前选中未开通的产品
        curPrdInfo: null,
        createPrdData: {
          timeArr: '',
          isEnabled: true,
          remarks: '',
        },
        expireTimeOption: {
          disabledDate(date) {
            return date.getTime() < Date.now() - 24 * 60 * 60 * 1000
          },
        },
        INDUSTRY_TYPE: null,
        imgList: [],
      }
    },
    /* computed: {
      title() {
        if (this.addFlag) return '新建租户'
        if (this.editFlag) return '编辑租户'
        // if(this.onlyRead) return '查看租户';
      },
    }, */
    async created() {
      await getSelectEnums().then((res) => {
        console.log(res)
        this.INDUSTRY_TYPE = res.data['INDUSTRY_TYPE']
      })

      this.requestData(1, this.pageConfig.eachPageSize)
    },
    methods: {
      getInType(type) {
        let str = ''
        this.INDUSTRY_TYPE.forEach((item) => {
          if (item.code == type) str = item.value
        })
        return str
      },
      changeTag(index) {
        this.tipIndex = index
        if (index == 1) {
          this.$nextTick(() => {
            this.$refs.zTable.doLayout()
          })
        }
      },
      //tip关闭
      tipClose(index) {
        this.tipIndex = 1
        this.$refs.main.$el.scrollTop = 0
        if (index != 1) {
          this.$nextTick(() => {
            this.$refs.recordTable.doLayout()
            this.$refs.planTable.doLayout()
          })
        }
      },
      //请求用户列表
      requestData(pageNum, pageSize) {
        getTenantList({ pageNum, pageSize, ...this.searchInfo }).then((res) => {
          if (res.success == 1) {
            let { data } = res
            console.log(res)
            this.pageConfig.currentPage = data.pageNum
            this.pageConfig.eachPageSize = data.pageSize
            this.pageConfig.total = data.total
            this.tableData = data.result
            this.$refs.zTable.closeLoading()
          }
        })
      },
      doSearch() {
        this.requestData(1, this.pageConfig.eachPageSize)
        this.handleClose()
      },
      handleCurrentChange(val) {
        this.pageConfig.currentPage = val
        this.requestData(val, this.pageConfig.eachPageSize)
      },
      addUserBtn() {
        this.addFlag = true
        this.editFlag = false
        this.onlyRead = false
        this.doReset()
        this.changeTag(2)
      },
      handleCloseAdd() {
        this.changeTag(1)
        this.doReset()
      },
      //创建租户
      addFn() {
        this.$refs.form.validate((valid) => {
          if (!valid) {
            return
          } else {
            console.log(this.createInfo)
            createTenant(this.createInfo).then((res) => {
              console.log(res)
              if (res.success == 1) {
                this.handleCloseAdd()
                this.requestData(1, this.pageConfig.eachPageSize)
                this.$msg({
                  message: '添加成功',
                  type: 'success',
                })
              }
            })
          }
        })
      },
      handleDelete(index, row) {
        console.log(index, row)
        this.$confirm('确定本次操作吗?执行后将不可撤销', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true,
        })
          .then((res) => {
            deleteTenant({ tenantId: row.id }).then((res) => {
              console.log(res)
              if (res.success == 1) {
                this.requestData(1, this.pageConfig.eachPageSize)
                this.$msg({
                  message: '删除成功',
                  type: 'success',
                })
              }
            })
          })
          .catch((e) => {})
      },
      //编辑
      async handleEdit(index, row) {
        this.addFlag = false
        this.onlyRead = false
        this.editFlag = true
        this.imgList = []
        this.createInfo = Object.assign({}, row)
        this.curTenantInfo = row
        await getTenantInfoById({ id: row.id }).then((res) => {
          let {
            data: { data },
          } = res
          if (data.logoAttachVO) {
            this.imgList = [
              { url: data.logoAttachVO.fileUrl, id: data.logoAttachVO.fileId },
            ]
            this.createInfo.logoAttachId = data.logoAttachVO.fileId
          }
        })
        this.changeTag(2)
      },
      //查看租户
      async handleView(index, row) {
        this.addFlag = false
        this.editFlag = false
        this.onlyRead = true
        this.imgList = []
        this.createInfo = Object.assign({}, row)
        this.curTenantInfo = row
        await getTenantInfoById({ id: row.id }).then((res) => {
          let {
            data: { data },
          } = res
          if (data.logoAttachVO) {
            this.imgList = [
              { url: data.logoAttachVO.fileUrl, id: data.logoAttachVO.fileId },
            ]
            this.createInfo.logoAttachId = data.logoAttachVO.fileId
          }
        })
        this.changeTag(2)
      },
      //修改租户信息
      updateFn() {
        updateTenant({
          id: this.curTenantInfo.id,
          ...this.createInfo,
        }).then((res) => {
          console.log(res)
          if (res.success == 1) {
            this.requestData(1, this.pageConfig.eachPageSize)
            this.handleCloseAdd()
            this.$msg({
              message: '修改成功',
              type: 'success',
            })
          }
        })
      },
      //当前选中租户
      handleCurTenantChange(val) {
        console.log('当前选中--', val)
        this.curTenantInfo = val
        this.tableContentLoading = true
        this.getCurTenantOpenPrd()
      },
      //获取选中租户的已开通产品
      getCurTenantOpenPrd() {
        if (this.curTenantInfo) {
          getTenantOpenPrdList({
            tenantId: this.curTenantInfo.id,
          }).then((res) => {
            let {
              data: { data },
            } = res
            this.tableContentData = data
            this.tableContentLoading = false
          })
        } else {
          console.log('没有选中租户')
        }
      },
      //打开未开通产品弹窗
      openTenantPrd() {
        if (!this.curTenantInfo) {
          this.$confirm('请先选择一个租户', '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true,
          }).catch((e) => {})
        } else {
          this.dialogPrd = true
          this.tablePrdLoading = true
          getTenantNotOpenPrdList({
            tenantId: this.curTenantInfo.id,
          }).then((res) => {
            let {
              data: { data },
            } = res
            this.tablePrdData = data
            this.tablePrdLoading = false
          })
        }
      },
      //关闭产品弹窗
      handleClosePrd() {
        this.dialogPrd = false
        this.tablePrdData = []
        this.curPrdInfo = null
        this.createPrdData = this.$options.data().createPrdData
      },
      //未开通产品选中
      handleCurPrdChange(val) {
        this.curPrdInfo = val
      },
      //确认添加产品
      confirmAddPrd() {
        if (!this.curPrdInfo || !this.createPrdData.timeArr) {
          this.$confirm('请选择一个产品，并设置时间', '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true,
          }).catch((e) => {})
          return
        } else {
          console.log(this.curPrdInfo, this.createPrdData)
          let obj = {
            bizProductId: this.curPrdInfo.id,
            endTime: this.createPrdData.timeArr[1],
            isEnabled: this.createPrdData.isEnabled,
            remarks: this.createPrdData.remarks,
            startTime: this.createPrdData.timeArr[0],
            tenantId: this.curTenantInfo.id,
          }
          openTenantPrd(obj).then((res) => {
            console.log(res)
            if (res.success == 1) {
              this.handleClosePrd()
              this.createPrdData = this.$options.data().createPrdData
              this.getCurTenantOpenPrd()
            }
          })
        }
      },
      handleCommand(command) {
        // this.$message('click on item ' + command);
        if (command == 'create') this.addUserBtn()
        if (command == 'createProd') this.openTenantPrd()
      },
      doReset() {
        this.imgList = []
        this.createInfo = this.$options.data().createInfo
        this.$refs.form.resetFields()
      },
      handleClose() {
        this.dialog = false
        this.doReset()
      },
      //upload处理
      handleUpload(data) {
        console.log(data)
        switch (data.type) {
          case 'change':
            this.imgList = data.fileList
            break
          case 'del':
            this.imgList.splice(data.index, 1)
            this.createInfo.logoAttachId = null
            break
          case 'id':
            this.createInfo.logoAttachId = data.id
            break
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '../../css/base';
  .flex-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
