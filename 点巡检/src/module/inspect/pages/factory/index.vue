<template>
  <el-main class="si">
    <el-card class="box-card si-title" shadow="hover">
      <el-row slot="header" class="z-card-header">
        <el-row class="z-c-in">
          <el-col class="left">
            <i class="el-icon-document-copy" />
            <span>厂区管理</span>
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
      <zTable
        ref="fTable"
        :cols="fCols"
        :table-data="tableData"
        :show-pagination="true"
        :each-page-size="pageConfig.eachPageSize"
        :show-handle="true"
        :total="pageConfig.total"
        :current-page="pageConfig.currentPage"
        @pageChange="handleCurrentChange"
      >
        <!-- <template v-slot:handle="scope">
                    <el-button v-if="showOrHidden('sys:factory:update')" @click="handleEdit(scope.scope.$index,scope.row)" type="text" size="small">编辑</el-button>
                    <el-button v-if="showOrHidden('sys:factory:remove')" @click="handlerDelete(scope.scope.$index,scope.row)" type="text" size="small">删除</el-button>
                </template> -->
        <template #handle="slotData">
          <el-dropdown class="s-dropdown-onlyicon" placement="bottom">
            <span class="el-dropdown-link">
              <span class="s-span"><i class="el-icon-caret-bottom" /></span>
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
        <el-form ref="form" :model="createData" :rules="rules">
          <el-form-item prop="name" label="厂区名称:">
            <el-input v-model="createData.name" />
          </el-form-item>
          <el-form-item prop="description" label="厂区描述:">
            <el-input v-model="createData.description" />
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
        <el-form-item label="厂区名称:">
          <el-input
            v-model="factoryName"
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
    getFactoryListPage,
    createNewFactory,
    updateFactoryInfo,
    deleteFactory,
  } from '../../api/factory'
  import zTable from '../../components/zTable'
  import zDropdown from '../../components/zDropdown'
  import zDrawer from '../../components/zDrawer'
  export default {
    components: { zTable, zDropdown, zDrawer },
    data() {
      return {
        code: 'sys:factory',
        level3List: [],
        dialog: false,
        tipIndex: 1,
        dropData: [
          { command: 'create', value: '新建厂区', iconClass: 'el-icon-plus' },
          // {command:'createProd',value:'开通产品',iconClass:'el-icon-plus'}
        ],
        dialogVisible: false,
        addFlag: true,
        editFlag: false,
        tableData: [],
        editData: {},
        curIndex: -1,
        pageConfig: {
          total: 0,
          eachPageSize: 10,
          currentPage: 1,
        },
        createData: {
          name: '',
          description: '',
        },
        factoryName: '',
        fCols: [
          { prop: 'name', label: '厂区名称' },
          {
            prop: 'description',
            label: '厂区描述',
            showOverflowTtooltip: true,
          },
          { prop: 'createdTime', label: '创建时间' },
          { prop: 'updatedTime', label: '修改时间' },
        ],
        rules: {
          name: [
            { required: true, message: '厂区名称不可为空', trigger: 'blur' },
          ],
        },
      }
    },
    created() {
      this.getLevel3List()
      this.requestData(
        this.pageConfig.currentPage,
        this.pageConfig.eachPageSize
      )
    },
    methods: {
      doSearch() {
        this.closeDrawer()
        this.requestData(1, this.pageConfig.eachPageSize)
      },
      doRest() {
        this.factoryName = ''
        this.requestData(1, this.eachPageSize)
        this.closeDrawer()
      },
      clickAdd() {
        this.addFlag = true
        this.editData = false
        this.tipIndex = 2
        this.createData = this.$options.data().createData
      },
      requestData(pageNum, pageSize) {
        getFactoryListPage({
          pageNum,
          pageSize,
          factoryName: this.factoryName,
        }).then((res) => {
          let { data } = res
          // console.log('厂区列表',data);
          this.pageConfig.currentPage = data.pageNum
          this.pageConfig.eachPageSize = data.pageSize
          this.pageConfig.total = data.total
          this.tableData = data.result
          this.$refs.fTable.closeLoading()
        })
      },
      handleCurrentChange(val) {
        this.pageConfig.currentPage = val
        this.requestData(val, this.pageConfig.eachPageSize)
      },
      handleEdit(index, row) {
        // console.log('edit--',index,row);
        this.addFlag = false
        this.editFlag = true
        this.createData = Object.assign({}, row)
        this.tipIndex = 2
      },
      handleDelete(index, row) {
        // console.log(index,row);
        this.$confirm('确定本次操作吗?执行后将不可撤销', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true,
        })
          .then((res) => {
            // console.log(row.id)
            deleteFactory({
              id: row.id,
            }).then((res) => {
              if (res.success == 1) {
                this.$msg({
                  message: '删除成功',
                  type: 'success',
                })
                this.requestData(1, this.pageConfig.eachPageSize)
              }
            })
          })
          .catch((e) => {})
      },
      cancelFn() {
        this.addFlag = true
        this.editData = false
        this.tipIndex = 1
        this.resetData()
      },
      confirmEdit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            updateFactoryInfo(this.createData).then((res) => {
              if (res.success == 1) {
                this.$msg({
                  message: '更新成功',
                  type: 'success',
                })
                this.cancelFn()
                this.requestData(1, this.pageConfig.eachPageSize)
              }
            })
          }
        })
      },
      confirmCreate() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            createNewFactory(this.createData).then((res) => {
              if (res.success == 1) {
                this.$msg({
                  message: '添加成功',
                  type: 'success',
                })
                this.cancelFn()
                this.requestData(1, this.pageConfig.eachPageSize)
              }
            })
          }
        })
      },
      //当前页面level3(需要显示隐藏的按钮)的数据
      getLevel3List() {
        //获取level3 list
        /* let list = JSON.parse(localStorage.getItem('system_list'));
            list.forEach(item => {
                if(item.code === this.code) this.level3List = item.childrenList;
            }); */
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
        if (command == 'create') this.clickAdd()
      },
      closeDrawer() {
        this.dialog = false
      },
      resetData() {
        this.createData = this.$options.data().createData
        this.$refs.form.resetFields()
      },
    },
  }
</script>

<style scoped lang="scss">
  @import '../../css/base';
</style>
