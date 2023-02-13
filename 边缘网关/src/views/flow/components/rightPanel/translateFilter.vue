<template>
  <div class="right-panel-body">
    <auto-form
      ref="autoForm"
      v-model="formData"
      :form-header="formHeader"
      :show-footer="false"
      :readonly="readonly"
    ></auto-form>

    <div class="tabs">
      <div
        class="tab-item"
        :class="{ active: tabIndex === 0 }"
        @click="tabIndex = 0"
      >
        时间段选择
      </div>
      <div
        class="tab-item"
        :class="{ active: tabIndex === 1 }"
        @click="tabIndex = 1"
      >
        量程变换
      </div>
    </div>
    <el-form v-show="tabIndex === 0" ref="filterForm" :model="filterForm">
      <el-form-item>
        <el-checkbox
          v-model="filterForm.timeEnable"
          :disabled="readonly"
          label="是否启用"
        ></el-checkbox>
      </el-form-item>

      <template v-for="(time, index) in filterForm.timeValue">
        <el-form-item
          v-if="filterForm.timeEnable"
          :key="index"
          :prop="`timeValue.${index}.value`"
          :rules="
            filterForm.timeEnable
              ? [
                  {
                    type: 'array',
                    required: true,
                    message: '请选择时间',
                    trigger: 'change',
                  },
                ]
              : null
          "
        >
          <div class="flex-parent start">
            <el-time-picker
              v-model="filterForm.timeValue[index].value"
              is-range
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder=""
              placement=""
              :disabled="readonly"
            ></el-time-picker>
            <remix-icon
              v-if="!readonly"
              v-show="index === filterForm.timeValue.length - 1"
              icon-class="add-box-fill"
              class="remix-icon"
              @click="addTimeValue"
            ></remix-icon>
            <remix-icon
              v-if="!readonly"
              v-show="index < filterForm.timeValue.length - 1"
              icon-class="checkbox-indeterminate-fill"
              class="remix-icon"
              @click="removeTimeValue(index)"
            ></remix-icon>
          </div>
        </el-form-item>
      </template>
    </el-form>
    <auto-form
      v-show="tabIndex === 1"
      ref="rangeForm"
      v-model="rangeForm"
      :form-header="rangeHeader"
      :show-footer="false"
      :readonly="readonly"
    ></auto-form>
  </div>
</template>
<script>
  import { getFilter, updateFilter } from '@/api/translate'
  import { dataToFormData, formDataToPostData } from '@/utils/autoForm'
  export default {
    name: 'TranslateFilter',
    props: {
      readonly: {
        type: Boolean,
        default: false,
      },
      loading: {
        type: Boolean,
        default: false,
      },
      currentNode: {
        type: Object,
        default: () => null,
      },
    },

    data() {
      return {
        formHeader: {
          group1: {
            title: '',
          },
        },
        formData: {
          nodeName: {
            code: 'nodeName', //前端的key,这个id必须和作为id的key保持一致,方便映射时作为指针值
            apiCode: 'nodeName', //后端的key
            title: '组件名称', //字段的label
            value: '', //字段的值
            type: 'text', //字段的类型,目前支持 input,number(使用input+正则验证模拟),select,checkbox,empty(表示占位符,不做任何逻辑处理)
            span: 24, //自定义一行的占位size,例如独占一行使用,使用规则同el-col的span属性
            groupId: 'group1', //属于哪个分组,
          },
        },
        filterForm: {
          timeEnable: false,
          timeValue: [
            {
              value: null,
            },
          ],
        },
        rangeHeader: {
          group1: {
            title: '',
          },
          group2: {
            title: '',
            hidden: true,
          },
        },
        rangeForm: {
          rangeEnable: {
            code: 'rangeEnable', //前端的key,这个id必须和作为id的key保持一致,方便映射时作为指针值
            apiCode: 'changeIsBegin', //后端的key 0启用,1禁用
            title: '', //字段的label
            value: '', //字段的值
            valueFrom: (value) => value == 0, //字段值的转换函数
            valueTo: (value) => (value ? 0 : 1),
            type: 'checkbox', //字段的类型,目前支持 input,number(使用input+正则验证模拟),select,checkbox,empty(表示占位符,不做任何逻辑处理)
            label: '是否启用',
            span: 24, //自定义一行的占位size,例如独占一行使用,使用规则同el-col的span属性
            groupId: 'group1',
          },
          rangeMin: {
            code: 'rangeMin', //前端的key,这个id必须和作为id的key保持一致,方便映射时作为指针值
            apiCode: 'rangeLowerLimit', //后端的key
            title: '量程下限', //字段的label
            value: '', //字段的值
            type: 'text', //字段的类型,目前支持 input,number(使用input+正则验证模拟),select,checkbox,empty(表示占位符,不做任何逻辑处理)
            label: '是否启用',
            required: true,
            span: 24, //自定义一行的占位size,例如独占一行使用,使用规则同el-col的span属性
            groupId: 'group2',
          },
          rangeMax: {
            code: 'rangeMax', //前端的key,这个id必须和作为id的key保持一致,方便映射时作为指针值
            apiCode: 'rangeTopLimit', //后端的key
            title: '量程上限', //字段的label
            value: '', //字段的值
            type: 'text', //字段的类型,目前支持 input,number(使用input+正则验证模拟),select,checkbox,empty(表示占位符,不做任何逻辑处理)
            label: '是否启用',
            required: true,
            span: 24, //自定义一行的占位size,例如独占一行使用,使用规则同el-col的span属性
            groupId: 'group2',
          },
          dataMin: {
            code: 'dataMin', //前端的key,这个id必须和作为id的key保持一致,方便映射时作为指针值
            apiCode: 'rawDataLowerLimit', //后端的key
            title: '裸数据下限', //字段的label
            value: '', //字段的值
            type: 'text', //字段的类型,目前支持 input,number(使用input+正则验证模拟),select,checkbox,empty(表示占位符,不做任何逻辑处理)
            label: '是否启用',
            required: true,
            span: 24, //自定义一行的占位size,例如独占一行使用,使用规则同el-col的span属性
            groupId: 'group2',
          },
          dataMax: {
            code: 'dataMax', //前端的key,这个id必须和作为id的key保持一致,方便映射时作为指针值
            apiCode: 'rawDataTopLimit', //后端的key
            title: '裸数据上限', //字段的label
            value: '', //字段的值
            type: 'text', //字段的类型,目前支持 input,number(使用input+正则验证模拟),select,checkbox,empty(表示占位符,不做任何逻辑处理)
            label: '是否启用',
            required: true,
            span: 24, //自定义一行的占位size,例如独占一行使用,使用规则同el-col的span属性
            groupId: 'group2',
          },
        },
        tabIndex: 0,
        id: null,
      }
    },
    watch: {
      'rangeForm.rangeEnable.value': function (newVal) {
        if (this.loading) {
          return false
        }
        if (newVal === true) {
          this.$set(this.rangeHeader.group2, 'hidden', false)
          // this.rangeHeader.group2.hidden = false
        } else {
          this.$set(this.rangeHeader.group2, 'hidden', true)
          // this.rangeHeader.group2.hidden = true
        }
        this.$nextTick(() => {
          this.$forceUpdate()
        })
      },
    },
    created() {
      // console.log('create', this.currentNode)
      this.getData()
    },
    methods: {
      addTimeValue() {
        this.filterForm.timeValue.push({
          value: null,
        })
      },
      removeTimeValue(index) {
        if (this.filterForm.timeValue.length > 1) {
          this.filterForm.timeValue.splice(index, 1)
        }
      },

      async getData() {
        this.$emit('loading', true)
        // todo 4
        const { data } = await getFilter(this.currentNode.id)
        this.id = data.id
        this.formData.nodeName.value =
          data.name || this.currentNode.attrs.text.text

        this.rangeForm = dataToFormData(data, this.rangeForm)

        this.filterForm.timeEnable = data.timeIsBegin == 0
        if (data.timeJson) {
          const _timeList = JSON.parse(data.timeJson)
          const _timeValue = []
          _timeList.forEach((time) => {
            const startTime = time.begin.split(':')
            const endTime = time.end.split(':')
            _timeValue.push({
              value: [
                new Date(2022, 1, 1, startTime[0], startTime[1], startTime[2]),
                new Date(2022, 1, 1, endTime[0], endTime[1], endTime[2]),
              ],
            })
          })

          this.$set(this.filterForm, 'timeValue', _timeValue)
        }

        this.$emit('loading', false)
      },
      async submit() {
        let valid, filterValid, rangeFormValid
        try {
          valid = await this.$refs['autoForm'].save()
          filterValid = await this.$refs['filterForm'].validate()
          rangeFormValid = await this.$refs['rangeForm'].save()
          console.log('rangeFormValid', rangeFormValid)
          if (valid && filterValid && rangeFormValid) {
            let timeValue = null
            if (this.filterForm.timeEnable) {
              timeValue = this.filterForm.timeValue.map((t) => {
                console.log(t.value)
                return {
                  begin: this.dayjs(t.value[0]).format('HH:mm:ss'),
                  end: this.dayjs(t.value[1]).format('HH:mm:ss'),
                }
              })
            }

            const postData = {
              name: this.formData.nodeName.value,
              timeJson: timeValue ? JSON.stringify(timeValue) : null,
              flowId: this.currentNode.id,
              timeIsBegin: this.filterForm.timeEnable ? 0 : 1,
              ...formDataToPostData(this.rangeForm),
              id: this.id,
            }

            updateFilter(postData)
              .then(() => {
                this.$message.success('更新成功!')
                this.$emit('updateNodeName', {
                  node: this.currentNode,
                  name: this.formData.nodeName.value,
                })
                this.$emit('loading', false)
                this.$emit('success')
                this.$emit('close')
              })
              .catch(() => {
                this.$emit('loading', false)
              })
          }
        } catch (error) {
          console.log(error)

          this.$message.warning('存在未填写内容!')
          if (!filterValid) {
            this.tabIndex = 0
          } else if (!rangeFormValid) {
            this.tabIndex = 1
          }
        }

        // console.log('submit', this.formData)
      },
      cancel() {
        console.log('cancel')
      },
    },
  }
</script>
<style lang="scss" scoped>
  .right-panel-body {
    padding: 20px;
    height: 100%;
    overflow-y: auto;

    .remix-icon {
      margin-left: 10px;
      color: #006fae;
      font-size: 24px;
    }

    .tabs {
      height: 50px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      border-bottom: 1px solid #dbdbdb;
      margin-bottom: 20px;
      .tab-item {
        font-size: 14px;
        color: #818182;
        cursor: pointer;
        &.active {
          color: #006fae;
        }
        & + .tab-item {
          margin-left: 38px;
        }
      }
    }
  }
</style>
