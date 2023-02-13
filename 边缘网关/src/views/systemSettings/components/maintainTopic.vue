<template>
  <el-dialog
    title="数据格式模板"
    :visible="dialogVisible"
    append-to-body
    @close="$emit('change', false)"
  >
    <div class="maintain-topic">
      <auto-form
        ref="autoForm"
        v-model="formData"
        :form-header="formHeader"
        :show-footer="false"
      >
        <template #group2>
          <div class="topic-list">
            <div class="flex-parent end">
              <el-button type="text" icon="el-icon-plus" @click="addPoint">
                添加
              </el-button>
              <el-button
                type="text"
                danger
                icon="el-icon-delete"
                @click="batchDeletePoint"
              >
                删除
              </el-button>
            </div>
            <el-table :data="list" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column type="index" label="序号"></el-table-column>
              <el-table-column prop="name" label="名称"></el-table-column>
              <el-table-column
                prop="dataType"
                label="数据类型"
              ></el-table-column>
              <el-table-column fixed="right" label="操作" width="100">
                <template #default="{ row }">
                  <bt-dropdown :show-split="false">
                    <bt-dropdown-menu>
                      <bt-dropdown-item @click="doPointEdit(row)">
                        <remix-icon
                          class-name="menu-icon"
                          icon-class="edit-line"
                        ></remix-icon>
                        编辑
                      </bt-dropdown-item>
                      <bt-dropdown-item @click="doPointDelete(row)">
                        <remix-icon
                          class-name="menu-icon"
                          icon-class="delete-bin-7-line"
                        ></remix-icon>
                        删除
                      </bt-dropdown-item>
                    </bt-dropdown-menu>
                  </bt-dropdown>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </auto-form>
      <div class="flex-parent center m-t-30">
        <el-button type="primary" @click="save">确定</el-button>
        <el-button type="default" @click="cancel">取消</el-button>
      </div>

      <el-dialog
        title="添加/编辑采集点"
        :visible.sync="dialogPointVisible"
        append-to-body
        :close-on-click-modal="false"
      >
        <auto-form
          ref="pointForm"
          v-model="pointFormData"
          :gutter="0"
          :span="24"
          @save="savePoint"
          @cancel="cancelPoint"
        ></auto-form>
      </el-dialog>
    </div>
  </el-dialog>
</template>
<script>
  import {
    getPointListByTopicId,
    getTopicById,
    saveTopic,
    savePoint,
    deletePoint,
    batchDeletePoints,
  } from '@/api/topic'
  import { dataToFormData, formDataToPostData } from '@/utils/autoForm'
  import getTypes, { TypeName } from '@/utils/getTypes'
  import { isKeyName } from '@/utils/formValidatorHelper'

  export default {
    name: 'MaintainTopic',
    inject: ['mqtt'],
    model: {
      prop: 'dialogVisible',
      event: 'change',
    },
    props: {
      topicId: {
        type: [String, Number],
        default: null,
      },
      dialogVisible: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        formHeader: {
          group1: {
            title: '字段映射',
          },
          group2: {
            title: '采集点',
          },
        },
        /**
         * formData的基本结构
         * [key]:{ //key作为id使用
         *  code: 'remoteIP',//前端的key,这个id必须和作为id的key保持一致,方便映射时作为指针值
         *  apiCode:'remoteIP', //后端的key
            title: '远程地址',//字段的label
            value: '', //字段的值
            type: 'text', //字段的类型,目前支持 input,number(使用input+正则验证模拟),select,checkbox,empty(表示占位符,不做任何逻辑处理)
            rules: [],//el-form的自定义验证rules规则
            options:[],下拉单的options
            sort:true//使用自定义slot代替内容
             span: 24,//自定义一行的占位size,例如独占一行使用,使用规则同el-col的span属性
             groupId:''属于哪个分组,
         * }
         */

        formData: {
          topicUrl: {
            code: 'topicUrl',
            apiCode: 'topicUrl',
            title: '主题URL',
            value: '',
            type: 'text',
            required: true,
            groupId: 'group1',
            span: 8,
          },
          deviceValue: {
            code: 'deviceValue',
            apiCode: 'deviceValue',
            title: '设备名称的Key值',
            value: '',
            type: 'text',
            required: true,
            groupId: 'group1',
            span: 8,
          },
          deviceType: {
            code: 'deviceType',
            apiCode: 'deviceType',
            title: '设备类型的Key值',
            value: '',
            type: 'text',
            required: true,
            groupId: 'group1',
            span: 8,
          },
        },
        list: [],
        currentPointId: null,
        dialogPointVisible: false,
        pointFormData: {
          name: {
            code: 'name',
            apiCode: 'name',
            title: '名称',
            value: '',
            type: 'text',
            rules: [isKeyName()],
            required: true,
          },
          acceptName: {
            code: 'acceptName',
            apiCode: 'acceptName',
            title: '接收字段',
            value: '',
            type: 'text',
            required: true,
          },
          describe: {
            code: 'describe',
            apiCode: 'describe',
            title: '描述',
            value: '',
            type: 'text',
            required: true,
          },
          dataType: {
            code: 'dataType',
            apiCode: 'dataType',
            title: '数据类型',
            value: '',
            type: 'select',
            options: [],
            required: true,
          },
        },
        multipleSelectionPoint: [],
      }
    },
    async created() {
      const dataTypes = await getTypes(TypeName.DATATYPE)
      this.$set(this.pointFormData.dataType, 'options', dataTypes)

      this.getData()
      this.getPointList()
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelectionPoint = val
      },
      async getData() {
        if (!this.topicId) return
        const { data } = await getTopicById(this.topicId)
        this.formData = dataToFormData(data, this.formData)
      },
      async getPointList() {
        if (!this.topicId) return
        const { data } = await getPointListByTopicId(this.topicId)
        this.list = data
      },
      doPointEdit(row) {
        this.currentPointId = row.id
        this.pointFormData = dataToFormData(row, this.pointFormData)
        this.dialogPointVisible = true
      },
      async doPointDelete(row) {
        const flag = await this.$confirm(`确定删除采集点${row.name}?`, '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true,
        })
        if (flag) {
          await deletePoint(row.id)
          this.$message.success('删除成功！')
          this.getPointList()
        }
      },
      async batchDeletePoint() {
        const ids = [].concat(this.multipleSelectionPoint)
        // console.log(ids)
        const flag = await this.$confirm(`确定批量删除采集点?`, '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true,
        })
        if (flag) {
          let { code } = await batchDeletePoints(ids.map((t) => t.id).join(','))
          // console.log(ids)
          if (code === 200) {
            this.$message.success('删除成功！')
          }
          this.getPointList()
        }
      },
      save() {
        this.$refs['autoForm'].submit().then(async () => {
          const postData = {
            id: this.topicId,
            mqttId: this.mqtt.id,
            ...formDataToPostData(this.formData),
          }
          await saveTopic(postData)
          this.$message.success('更新成功！')
          this.$emit('change', false)
          this.$emit('update')
        })
      },
      cancel() {
        this.$emit('change', false)
      },
      addPoint() {
        this.currentPointId = null
        this.clearPoint()
        this.dialogPointVisible = true
      },
      async savePoint() {
        const postData = {
          topicHttpId: this.topicId,
          ...formDataToPostData(this.pointFormData),
        }
        if (this.currentPointId) {
          postData.id = this.currentPointId
        }

        await savePoint(postData)
        this.$message.success(this.currentPointId ? '更新成功！' : '添加成功！')
        this.dialogPointVisible = false
        this.getPointList()
      },
      cancelPoint() {
        this.dialogPointVisible = false
      },
      clearPoint() {
        this.pointFormData.name.value = ''
        this.pointFormData.acceptName.value = ''
        this.pointFormData.describe.value = ''
        this.pointFormData.dataType.value = ''
      },
    },
  }
</script>
