<template>
  <el-main class="si">
    <el-card class="box-card si-title" shadow="hover">
      <el-row slot="header" class="z-card-header">
        <el-row class="z-c-in">
          <el-col class="left">
            <i class="el-icon-document-copy" />
            <span>输送线管理</span>
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
      <el-col>
        <zTable
          ref="zTable"
          :table-data="tableData"
          :cols="cols"
          :total="total"
          :each-page-size="eachPageSize"
          :current-page="currentPage"
          :show-handle="true"
          :show-index="true"
          @pageChange="handleCurrentChange"
          @sizeChange="handleSizeChange"
        >
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
        <el-form ref="form" :model="createData" :rules="formRules">
          <el-form-item label="所属厂区:">
            <el-select v-model="createData.factoryId">
              <el-option
                v-for="list in fAreaList"
                :key="list.id"
                :value="list.id"
                :label="list.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="所属作业区:" prop="parentId">
            <el-select v-model="createData.parentId">
              <el-option
                v-for="list in workSpaceList"
                :key="list.id"
                :value="list.id"
                :label="list.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="输送线名称:" prop="name">
            <el-input
              v-model="createData.name"
              placeholder="输送线名称"
            />
          </el-form-item>

          <el-form-item label="输送线描述:" prop="description">
            <el-input
              v-model="createData.description"
              placeholder="输送线描述"
            />
          </el-form-item>
        </el-form>
        <el-row class="form-btns">
          <el-button
            v-if="addFlag"
            class="conBtn"
            type="primary"
            @click="submitInfo"
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
        <el-form-item label="输送线名称:">
          <el-input
            v-model="lineName"
            prefix-icon="el-icon-search"
            @keydown.enter.native="doSearch"
          />
        </el-form-item>
      </el-form>
    </zDrawer>
  </el-main>
</template>

<script>
  import zTable from '../../components/zTable'
  import zDropdown from '../../components/zDropdown'
  import zDrawer from '../../components/zDrawer'
  import {
    getProductLineList,
    updateProductLineInfo,
    createNewProductLine,
    deleteProductLine,
  } from '../../api/productLine'
  import { getWorkSpacePage } from '../../api/workSpace'
  import { getFactoryListPage } from '../../api/factory'
  export default {
    components: { zTable, zDropdown, zDrawer },
    data() {
      return {
        dialog: false,
        tipIndex: 1,
        dropData: [
          { command: 'create', value: '新建厂区', iconClass: 'el-icon-plus' },
          // {command:'createProd',value:'开通产品',iconClass:'el-icon-plus'}
        ],
        code: 'sys:prodline',
        level3List: [],
        dialogVisible: false,
        addFlag: true,
        editFlag: false,
        tableData: [],
        total: 0,
        curLineData: null,
        eachPageSize: 10,
        currentPage: 1,
        createData: {
          description: '',
          name: '',
          //厂区id
          factoryId: '',
          //作业区id
          parentId: '',
        },
        //search lineName
        lineName: '',
        //厂区
        fAreaList: [],
        //作业区
        workSpaceList: [],
        formRules: {
          name: [
            { required: true, message: '请输入输送线名称', trigger: 'blur' },
          ],
          parentId: [
            {
              required: true,
              message: '请选择作业区',
              trigger: ['blur', 'change'],
            },
          ],
        },
        cols: [
          { prop: 'name', label: '输送线名称' },
          { prop: 'factoryName', label: '所属厂区' },
          { prop: 'workSpaceName', label: '所属作业区' },
          {
            prop: 'description',
            label: '输送线描述',
            showOverflowTooltip: true,
          },
          { prop: 'createdTime', label: '创建时间' },
          { prop: 'updatedTime', label: '修改时间' },
        ],
      }
    },
    watch: {
      async 'createData.factoryId'(newVal, oldVal) {
        this.createData.parentId = ''
        await getWorkSpacePage({
          pageSize: 1000,
          factoryId: newVal,
        }).then((res) => {
          if (res.success == 1) {
            let { data } = res
            this.workSpaceList = data.result
          }
        })
      },
    },
    created() {
      this.getLevel3List()
      this.requestData(this.currentPage, this.eachPageSize)
      getFactoryListPage({
        pageNum: 1,
        pageSize: 1000,
      }).then((res) => {
        let { data } = res
        this.fAreaList = data.result
        // console.log('厂区列表',this.fAreaList);
      })
    },
    methods: {
      doSearch() {
        this.requestData(1, this.eachPageSize)
        this.closeDrawer()
      },
      doRest() {
        this.lineName = ''
        this.requestData(1, this.eachPageSize)
        this.closeDrawer()
      },
      addLineBtn() {
        this.createData.factoryId = this.fAreaList[0].id
        this.addFlag = true
        this.editFlag = false
        this.tipIndex = 2
      },
      requestData(pageNum, pageSize) {
        getProductLineList({ pageNum, pageSize, name: this.lineName }).then(
          (res) => {
            let { data } = res
            // console.log('输送线数据--',data);
            this.currentPage = data.pageNum
            this.eachPageSize = data.pageSize
            this.total = data.total
            this.tableData = data.result
            this.$refs.zTable.closeLoading()
          }
        )
      },
      //分页
      handleSizeChange(val) {
        this.eachPageSize = val
        this.currentPage = 1
        this.requestData(1, this.eachPageSize)
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.requestData(val, this.eachPageSize)
      },
      handleEdit(index, row) {
        // console.log(index,row);
        this.addFlag = false
        this.editFlag = true
        this.curLineData = row
        this.createData.factoryId = row.factoryId
        this.createData.description = row.description
        this.createData.name = row.name
        setTimeout(() => {
          this.createData.parentId = row.workSpaceId
          this.tipIndex = 2
        }, 50)
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
            deleteProductLine({
              id: row.id,
            }).then((res) => {
              if (res.success == 1) {
                this.$msg({
                  message: '删除成功',
                  type: 'success',
                })
                this.requestData(1, this.eachPageSize)
              }
            })
          })
          .catch((e) => {})
      },
      confirmEdit() {
        this.$refs['form'].validate((valid) => {
          if (!valid) {
            return
          } else {
            updateProductLineInfo({
              id: this.curLineData.id,
              name: this.createData.name,
              description: this.createData.description,
              workSpaceId: this.createData.parentId,
            }).then((res) => {
              console.log(res)
              if (res.success == 1) {
                this.$msg({
                  message: '更新成功',
                  type: 'success',
                })
                this.cancelFn()
                this.requestData(1, this.eachPageSize)
              }
            })
          }
        })
      },
      submitInfo() {
        this.$refs['form'].validate((valid) => {
          if (!valid) {
            return
          } else {
            // console.log(this.createData);
            createNewProductLine(this.createData).then((res) => {
              if (res.success == 1) {
                this.$msg({
                  message: '添加成功',
                  type: 'success',
                })
                this.cancelFn()
                this.requestData(1, this.eachPageSize)
              }
            })
          }
        })
      },
      //当前页面level3(需要显示隐藏的按钮)的数据
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
      resetData() {
        this.createData = this.$options.data().createData
        this.$refs.form.resetFields()
      },
      handleCommand(command) {
        // this.$message('click on item ' + command);
        if (command == 'create') this.addLineBtn()
      },
      closeDrawer() {
        this.dialog = false
      },
      cancelFn() {
        this.tipIndex = 1
        this.$refs.zTable.doLayout()
        this.addFlag = true
        this.editFlag = false
        this.resetData()
      },
    },
  }
</script>

<style scoped lang="scss">
  @import '../../css/base';
</style>
