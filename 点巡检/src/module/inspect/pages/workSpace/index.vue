<template>
  <el-main class="workShop si">
    <el-card class="box-card si-title" shadow="hover">
      <el-row slot="header" class="z-card-header">
        <el-row class="z-c-in">
          <el-col class="left">
            <i class="el-icon-document-copy" />
            <span>作业区管理</span>
          </el-col>
          <el-col class="right">
            <zDropdown :drop-data="dropData" @handleDropClick="handleCommand" />
            <div class="icon-sm" @click="dialog = true">
              <remix-icon
                icon-class="bt-filter"
                class="remix-icon"
                is-svg
              />
            </div>
          </el-col>
        </el-row>
      </el-row>
    </el-card>
    <el-row v-show="tipIndex == 1" class="s-box">
      <el-col :span="24">
        <zTable
          ref="zTable"
          :table-data="tableData"
          :cols="cols"
          :total="pageConfig.total"
          :each-page-size="pageConfig.eachPageSize"
          :current-page="pageConfig.currentPage"
          :show-handle="true"
          :show-index="true"
          @pageChange="pPageChange"
          @sizeChange="pSizeChange"
        >
          <template #handle="slotData">
            <el-dropdown class="s-dropdown-onlyicon" placement="bottom">
              <span class="el-dropdown-link">
                <span class="s-span">
                  <i class="el-icon-caret-bottom" />
                </span>
              </span>
              <el-dropdown-menu slot="dropdown" class="s-dropdown-menu">
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
      </el-col>
    </el-row>

    <el-row v-show="tipIndex == 2" class="less-info-form">
      <el-row class="inner">
        <el-col class="top">
          <p>
            注:带
            <span>*</span>
            号为必填项目
          </p>
        </el-col>
        <el-form ref="form" :model="form" :rules="rules">
          <el-form-item label="选择厂区:" prop="factoryId">
            <el-select v-model="form.factoryId" style="width: 100%">
              <el-option
                v-for="item in factoryList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="作业区名称:" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="作业区描述:">
            <el-input v-model="form.description" />
          </el-form-item>
        </el-form>
        <el-row class="form-btns">
          <el-button
            v-if="addFlag"
            class="conBtn"
            type="primary"
            @click="confirmCreate"
          >
            提 交
          </el-button>
          <el-button
            v-if="editFlag"
            class="conBtn"
            type="primary"
            @click="confirmEdit"
          >
            提 交
          </el-button>
          <el-button
            v-if="addFlag || editFlag"
            class="resetBtn"
            @click="resetData"
          >
            重 置
          </el-button>
          <el-button class="cancelBtn" @click="cancelFn">取 消</el-button>
        </el-row>
      </el-row>
    </el-row>

    <zDrawer
      :visible="dialog"
      @closeDrawer="closeDrawer"
      @doSearch="doSearch"
      @doRest="doRest"
    >
      <el-form class="si-title-body" @submit.native.prevent>
        <el-form-item label="作业区名称:">
          <el-input
            v-model="workSpaceName"
            prefix-icon="el-icon-search"
            @keydown.enter.native="doSearch"
          />
        </el-form-item>
      </el-form>
    </zDrawer>
  </el-main>
</template>

<script>
  import {
    getWorkSpacePage,
    createNewWorkSpace,
    updateWorkSpace,
    deleteWorkSpace,
  } from '../../api/workSpace'
  import { getFactoryListPage } from '../../api/factory'
  import zTable from '../../components/zTable'
  import zDropdown from '../../components/zDropdown'
  import zDrawer from '../../components/zDrawer'
  export default {
    components: { zTable, zDropdown, zDrawer },
    data() {
      return {
        code: 'sys:workspace',
        level3List: [],
        dropData: [
          { command: 'create', value: '新建作业区', iconClass: 'el-icon-plus' },
          // {command:'createProd',value:'开通产品',iconClass:'el-icon-plus'}
        ],
        tipIndex: 1,
        dialog: false,
        addFlag: true,
        editFlag: false,
        workSpaceName: '',
        tableData: [],
        cols: [
          { label: '作业区名称', prop: 'name' },
          { label: '所属厂区', prop: 'factoryName' },
          { label: '作业区描述', prop: 'description' },
          { label: '创建时间', prop: 'createdTime', width: '160' },
          { label: '修改时间', prop: 'updatedTime', width: '160' },
        ],
        pageConfig: {
          total: 0,
          eachPageSize: 10,
          currentPage: 1,
        },
        form: {
          factoryId: '',
          name: '',
          description: '',
        },
        dialogVisible: false,
        factoryList: [],
        rules: {
          name: [
            { required: true, message: '作业区名称不能为空', trigger: 'blur' },
          ],
          factoryId: [
            { required: true, message: '厂区不能为空', trigger: 'change' },
          ],
        },
      }
    },
    created() {
      this.getLevel3List()
      this.requestData(1, this.pageConfig.eachPageSize)
      getFactoryListPage({
        pageNum: 1,
        pageSize: 1000,
      }).then((res) => {
        if (res.success == 1) {
          let { data } = res
          // console.log('厂区数据--', data)
          this.factoryList = data.result
        }
      })
    },
    methods: {
      requestData(pageNum, pageSize) {
        getWorkSpacePage({ pageNum, pageSize, name: this.workSpaceName }).then(
          (res) => {
            if (res.success == 1) {
              let { data } = res
              // console.log('作业区数据--', data)
              this.tableData = data.result
              this.pageConfig.total = data.total
              this.pageConfig.pageNum = data.pageNum
              this.pageConfig.pageSize = data.pageSize
            }
          }
        )
      },
      openWorkShopDia() {
        this.resetData()
        this.tipIndex = 2
      },
      //分页
      pSizeChange(val) {
        this.pageConfig.eachPageSize = val
        this.pageConfig.currentPage = 1
        this.requestData(1, this.pageConfig.eachPageSize)
      },
      pPageChange(val) {
        this.pageConfig.currentPage = val
        this.requestData(val, this.pageConfig.eachPageSize)
      },
      resetData() {
        this.addFlag = true
        this.editFlag = false
        this.form = this.$options.data().form
        this.$refs['form'].resetFields()
      },
      //创建作业区
      confirmCreate() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            createNewWorkSpace(this.form).then((res) => {
              if (res.success == 1) {
                this.$msg({
                  message: '创建成功',
                  type: 'success',
                })
                this.cancelFn()
                this.requestData(1, this.pageConfig.eachPageSize)
              }
            })
          }
        })
      },
      //edit
      handleEdit(index, row) {
        this.addFlag = false
        this.editFlag = true
        this.form = Object.assign({}, this.form, row)
        this.tipIndex = 2
      },
      //修改
      confirmEdit() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            updateWorkSpace(this.form).then((res) => {
              if (res.success == 1) {
                this.$msg({
                  message: '修改成功',
                  type: 'success',
                })
                this.cancelFn()
                this.requestData(
                  this.pageConfig.currentPage,
                  this.pageConfig.eachPageSize
                )
              }
            })
          }
        })
      },
      //delete
      handleDelete(index, row) {
        this.$confirm('确定本次操作吗?执行后将不可撤销', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true,
        })
          .then(() => {
            deleteWorkSpace({ id: row.id }).then((res) => {
              if (res.success == 1) {
                this.$msg({
                  message: '删除成功',
                  type: 'success',
                })
                this.requestData(1, this.pageConfig.eachPageSize)
              }
            })
          })
          .catch(() => {})
      },
      //search
      doSearch() {
        this.requestData(1, this.pageConfig.eachPageSize)
        this.closeDrawer()
      },
      doRest() {
        this.workSpaceName = ''
        this.requestData(1, this.eachPageSize)
        this.closeDrawer()
      },
      //当前页面level3
      getLevel3List() {
        //获取level3 list
        let list = JSON.parse(localStorage.getItem('system_list'))
        list &&
          list.forEach((item) => {
            if (item.code === this.code) this.level3List = item.childrenList
          })
      },
      showOrHidden(code) {
        //code: "sys:role"
        let result = false
        for (let i = 0; i < this.level3List.length; i++) {
          if (this.level3List[i].code === code) {
            result = true
            return result
          }
        }
      },
      handleCommand(command) {
        // this.$message('click on item ' + command);
        if (command == 'create') this.openWorkShopDia()
      },
      cancelFn() {
        this.resetData()
        this.tipIndex = 1
      },
      closeDrawer() {
        this.dialog = false
      },
    },
  }
</script>

<style scoped lang="scss">
  @import '../../css/base';
</style>
