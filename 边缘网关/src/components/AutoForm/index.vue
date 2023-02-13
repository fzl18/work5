<template>
  <div class="auto-form">
    <el-form ref="myForm" :model="autoFormData" autocomplete="off">
      <!-- 这一行假input是为了禁用chrome下form的自动保存表单 -->
      <el-input type="password" style="display: none"></el-input>
      <template v-for="(group, groupKey) in autoFormData">
        <div
          v-if="group.hidden !== true"
          :key="group.groupId"
          class="auto-form-group"
        >
          <bt-divider
            v-if="group.groupName && group.groupName !== ''"
            :title="group.groupName"
          ></bt-divider>
          <slot :name="group.groupId" :group="group">
            <el-row :gutter="gutter">
              <template v-for="(data, key) in group.children">
                <el-col
                  v-if="data.hidden !== true"
                  :key="key"
                  :span="data.span || span"
                >
                  <template v-if="data.type !== 'custom'">
                    <slot :name="data.code" :data="data">
                      <el-form-item
                        v-if="data.slot !== true"
                        :label="data.title"
                        :prop="groupKey + '.children.' + key + '.value'"
                        :rules="computedRules(data)"
                      >
                        <div class="">
                          <el-input
                            v-if="data.type === 'text'"
                            v-model="data.value"
                            :disabled="readonly"
                            :placeholder="
                              data.placeholder
                                ? data.placeholder
                                : `请输入${data.title}`
                            "
                          ></el-input>
                          <el-input
                            v-if="
                              data.type === 'number' || data.type === 'float'
                            "
                            v-model.number="data.value"
                            :disabled="readonly"
                            :placeholder="
                              data.placeholder
                                ? data.placeholder
                                : `请输入${data.title}`
                            "
                          ></el-input>

                          <el-input
                            v-if="data.type === 'password'"
                            v-model="data.value"
                            type="password"
                            :disabled="readonly"
                            :placeholder="
                              data.placeholder
                                ? data.placeholder
                                : `请输入${data.title}`
                            "
                          ></el-input>
                          <el-select
                            v-if="data.type === 'select'"
                            v-model="data.value"
                            :disabled="readonly"
                            :filterable="data.filterable ? true : false"
                            :placeholder="
                              data.placeholder
                                ? data.placeholder
                                : `请选择${data.title}`
                            "
                          >
                            <el-option
                              v-for="(option, index) in data.options"
                              :key="index"
                              :label="option.label"
                              :value="option.value"
                            >
                              {{ option.label }}
                            </el-option>
                          </el-select>
                          <el-checkbox
                            v-if="data.type === 'checkbox'"
                            v-model="data.value"
                            :disabled="readonly"
                            :label="data.label ? data.label : '是否选择'"
                          ></el-checkbox>
                          <el-input
                            v-if="data.type === 'textarea'"
                            v-model="data.value"
                            :disabled="readonly"
                            type="textarea"
                            :placeholder="
                              data.placeholder
                                ? data.placeholder
                                : `请输入${data.title}`
                            "
                            :rows="data.rows || 4"
                          ></el-input>
                          <slot
                            :name="`${data.code}Suffix`"
                            :data="data"
                          ></slot>
                        </div>
                      </el-form-item>
                    </slot>
                  </template>
                  <template v-else>
                    <slot :name="data.code" :data="data"></slot>
                  </template>
                </el-col>
              </template>
            </el-row>
          </slot>
        </div>
      </template>

      <div v-if="showFooter" class="auto-form-footer">
        <slot name="footer">
          <el-button
            v-if="showConfirmBtn"
            type="primary"
            size="mini"
            @click="save"
          >
            保存
          </el-button>
          <el-button
            v-if="showCancelBtn"
            type="info"
            size="mini"
            @click="cancel"
          >
            取消
          </el-button>
        </slot>
      </div>
    </el-form>
  </div>
</template>
<script>
  import { isFloatNumber, isNumber } from '@/utils/formValidatorHelper'
  import _groupBy from 'lodash/groupBy'
  export default {
    name: 'AutoForm',
    model: {
      prop: 'formData',
      event: 'update',
    },
    props: {
      readonly: {
        type: Boolean,
        default: false,
      },
      // 表单头,非必填,如果不填则所有formData属于default组
      /**
       * @description formHeader
       *  formHeader: {
          group1: {
            title: '通讯设置',
          },
          group2: {
            title: '顺序设置',
          },
          group3: {
            title: '重试设置',
          },
          group4: {
            title: '时间设置',
            hidden:true //hidden=true则不渲染和校验该组下的表单内容,但是在保存时候仍然会提交该分组下的表单内容值
          },
        },
       */
      formHeader: {
        type: Object,
        default: () => null,
      },
      // 表单数据model
      /**
         @description formData的基本结构
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
        type: Object,
        default: () => null,
      },
      // 同el-col的span
      span: {
        type: Number,
        default: 6,
      },
      // 同el-row的gutter
      gutter: {
        type: Number,
        default: 100,
      },
      // 是否显示页脚
      showFooter: {
        type: Boolean,
        default: true,
      },
      showConfirmBtn: {
        type: Boolean,
        default: true,
      },
      showCancelBtn: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        // 先做一个基础版本,两级结构,不支持递归
        autoFormData: {
          default: { groupId: 'default', groupName: '', children: {} },
        },
        timer: null,
      }
    },
    watch: {
      autoFormData: {
        deep: true,
        handler: function (newVal) {
          if (this.timer) {
            clearTimeout(this.timer)
            this.timer = null
          }
          this.timer = setTimeout(() => {
            this.updateData(newVal)
            this.loading = false
          }, 200)
        },
      },
      formData: {
        deep: true,
        handler: function (newVal) {
          if (this.timer) {
            clearTimeout(this.timer)
            this.timer = null
          }
          this.timer = setTimeout(() => {
            this.initData(newVal)
          }, 200)
        },
      },
      formHeader: {
        deep: true,
        handler: function (newVal) {
          if (this.timer) {
            clearTimeout(this.timer)
            this.timer = null
          }
          this.timer = setTimeout(() => {
            this.initData(this.formData)
          }, 200)
        },
      },
    },
    mounted() {
      this.initData(this.formData)
    },
    methods: {
      async validate() {
        return await this.$refs['myForm'].validate()
      },
      clearValidate() {
        this.$refs['myForm'].clearValidate()
      },
      cancel() {
        this.$emit('cancel')
      },
      save() {
        return this.submit().then(() => {
          const formData = this.formatToFormData(this.autoFormData)
          this.$emit('save', formData)
          return formData
        })
      },
      submit() {
        return new Promise((resolve, reject) => {
          this.$refs['myForm'].validate((valid) => {
            valid ? resolve() : reject()
          })
        })
      },
      initData(formData) {
        // console.log('initData', formData)
        this.loading = true
        if (!formData) throw 'formData can not be null!'
        if (Object.keys(formData).length === 0)
          throw 'formData has not any key!'
        const autoFormData = {}
        if (this.formHeader && Object.keys(this.formHeader).length) {
          for (let key in this.formHeader) {
            const t = this.formHeader[key]
            autoFormData[key] = {
              groupId: key,
              groupName: t.title,
              children: {},
              hidden: t.hidden || false,
            }
          }
          for (let key in formData) {
            const data = formData[key]
            if (autoFormData[data.groupId]) {
              autoFormData[data.groupId].children[data.code] = data
            } else {
              throw 'do not have groupId:' + data.groupId
            }
          }
        } else {
          autoFormData['default'] = {
            groupId: 'default',
            groupName: '',
            children: {},
          }
          for (let key in formData) {
            const data = formData[key]
            autoFormData['default'].children[data.code] = data
          }
        }

        // console.log('autoFormData', autoFormData)
        this.autoFormData = autoFormData
        this.$nextTick(() => {
          this.$refs['myForm'].clearValidate()
        })
      },
      computedRules(data) {
        let rules = []
        const fieldName = data.title
        if (data.required) {
          rules.push({ required: true, message: `${fieldName}不能为空` })
        }
        if (data.type === 'number') {
          rules.push(isNumber())
        }
        if (data.type === 'float') {
          rules.push(isFloatNumber())
        }
        if (data.rules && data.rules.length) {
          rules = [].concat(rules, data.rules)
        }
        return rules
      },
      updateData(newVal) {
        if (this.loading) return
        console.log('updateData', newVal)
        const formData = this.formatToFormData(newVal)
        this.$emit('update', formData)
        this.$emit('submit', formData)
      },
      formatToFormData(autoFormData) {
        const formData = {}
        for (let group in autoFormData) {
          const children = autoFormData[group].children
          if (children && Object.keys(children).length) {
            for (let key in children) {
              formData[key] = { ...children[key] }
            }
          }
        }
        return formData
      },
    },
  }
</script>
<style lang="scss" scoped>
  .auto-form-footer {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .auto-form-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
</style>
