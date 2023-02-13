<template>
  <div class="modbus-point-container">
    <div class="bt-column__header">
      <div class="header">
        <div class="subtitle">采集点配置</div>
        <el-button type="primary" size="mini" @click="addNew">新增</el-button>
      </div>
      <div class="line"></div>
    </div>
    <el-table :data="list">
      <el-table-column type="index" label="序号" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="dataType" label="数据类型" />
      <el-table-column prop="readType" label="读写类型">
        <template #default="{ row }">
          {{ getReadTypeName(row.readType) }}
        </template>
      </el-table-column>

      <el-table-column prop="objectsCount" label="数量" />
      <el-table-column prop="dataAddress" label="数据地址" />
      <el-table-column fixed="right" label="操作" width="100">
        <template #default="{ row, $index }">
          <bt-dropdown :show-split="false">
            <bt-dropdown-menu>
              <bt-dropdown-item @click="doEdit(row, $index)">
                <remix-icon
                  class-name="menu-icon"
                  icon-class="edit-line"
                ></remix-icon>
                编辑
              </bt-dropdown-item>
              <bt-dropdown-item danger @click="doDelete(row, $index)">
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
    <el-row class="m-t-30">
      <el-col>
        <el-button type="default" size="mini" @click="$emit('goPrevStep')">
          上一步
        </el-button>
        <el-button type="primary" size="mini" @click="$emit('submit')">
          完成
        </el-button>
        <el-button size="mini" type="info" @click="$emit('cancel')">
          取消
        </el-button>
      </el-col>
    </el-row>

    <el-dialog
      title="添加/编辑采集点"
      :visible.sync="dialogTableVisible"
      :close-on-click-modal="false"
    >
      <auto-form
        ref="autoForm"
        v-model="formData"
        :gutter="0"
        :span="24"
        @save="save"
        @cancel="cancel"
      ></auto-form>
    </el-dialog>
  </div>
</template>
<script>
  import getTypes from '@/utils/getTypes'
  import _cloneDeep from 'lodash/cloneDeep'
  import _find from 'lodash/find'
  import { mapGetters } from 'vuex'
  import { isKeyName } from '@/utils/formValidatorHelper'
  import { dataToFormData } from '@/utils/autoForm'
  export default {
    name: 'ModbusPoint',
    inject: {
      orginData: {
        from: 'orginData',
      },
    },
    props: {
      options: {
        type: Object,
        default: () => null,
      },
    },

    data() {
      return {
        /**
         * @description list数据结构
         * {
         * index:'序号',
         * name:'名称',
         * description:'描述',
         * dataType:'数据类型',
         * readType:'读写类型',
         * objectsCount:'数量',
         * dataAddress:'数据地址'
         * }
         */
        list: [],
        readTypes: [],
        currentPointId: null,
        formData: {
          name: {
            code: 'name',
            apiCode: 'name',
            title: '名称',
            value: '',
            type: 'text',
            rules: [isKeyName()],
            required: true,
          },
          describe: {
            code: 'describe',
            apiCode: 'describe',
            title: '描述',
            value: '',
            type: 'textarea',
            required: true,
          },
          dataType: {
            code: 'dataType',
            apiCode: 'dataType',
            title: '数据类型',
            value: '',
            options: [],
            type: 'select',
            required: true,
          },
          readType: {
            code: 'readType',
            apiCode: 'readType',
            title: '读写类型',
            value: '',
            valueFrom: (t) => t.toString(),
            options: [],
            type: 'select',
            required: true,
          },
          objectsCount: {
            code: 'objectsCount',
            apiCode: 'objectsCount',
            title: '数量',
            value: '',
            type: 'number',
            required: true,
          },
          dataAddress: {
            code: 'dataAddress',
            apiCode: 'dataAddress',
            title: '数据地址',
            value: '',
            type: 'number',
            required: true,
          },
        },

        dialogTableVisible: false,
      }
    },
    computed: {
      ...mapGetters('devicesInfo', ['pointInfo']),
    },
    async created() {
      const dataTypes = await getTypes('dataType')
      const readTypes = await getTypes('readType')

      this.$set(this.formData.dataType, 'options', dataTypes)
      this.$set(this.formData.readType, 'options', readTypes)
      this.readTypes = readTypes
      if (this.pointInfo) {
        this.list = _cloneDeep(this.pointInfo)
      } else if (this.orginData.id) {
        const { sourceData } = this.orginData
        if (!sourceData) return
        this.list = sourceData.points ? [...sourceData.points] : []
      } else {
        this.list = []
      }
      this.updateStore()
      this.$forceUpdate()
    },
    methods: {
      getReadTypeName(value) {
        const obj = _find(this.readTypes, (t) => {
          return t.value == value
        })

        return obj ? obj.label : ''
      },
      addNew() {
        this.currentPointId = -1
        this.dialogTableVisible = true
      },
      /**
       * @description 与后端口头确认采集点数据每次在设备保存时都做全量新增插入,所以删改时无需记录id,不调用api 2022.9.9
       * @param {*} row
       */
      doEdit(row, index) {
        this.currentPointId = index
        // this.formData.name.value = row.name
        // this.formData.describe.value = row.describe
        // this.formData.dataType.value = row.dataType
        // this.formData.readType.value = row.readType.toString
        // this.formData.objectsCount.value = row.objectsCount
        // this.formData.dataAddress.value = row.dataAddress
        this.formData = dataToFormData(row, this.formData)
        this.dialogTableVisible = true
      },
      doDelete(row, index) {
        this.$confirm(`确认删除字段${row.name}吗?`, {
          title: '警告',
          type: 'warning',
          center: true,
        }).then(() => {
          this.list.splice(index, 1)

          this.$message.success('删除成功！')
          this.updateStore()
        })
      },
      save(data) {
        const newPoint = {
          name: data.name.value,
          describe: data.describe.value,
          dataType: data.dataType.value,
          readType: data.readType.value,
          objectsCount: data.objectsCount.value,
          dataAddress: data.dataAddress.value,
        }
        if (this.currentPointId === -1) {
          this.list.push(newPoint)
        } else {
          this.$set(this.list, this.currentPointId, newPoint)
        }

        this.$nextTick(() => {
          this.dialogTableVisible = false
          this.reset()
          this.updateStore()
        })
      },
      cancel() {
        this.dialogTableVisible = false
        this.reset()
      },
      reset() {
        this.currentPointId = -1
        this.formData.name.value = ''
        this.formData.describe.value = ''
        this.formData.dataType.value = ''
        this.formData.readType.value = ''
        this.formData.objectsCount.value = ''
        this.formData.dataAddress.value = ''
        this.$refs['autoForm'].clearValidate()
      },
      updateStore() {
        this.$store.dispatch('devicesInfo/updatePointInfo', this.list)
      },
    },
  }
</script>
