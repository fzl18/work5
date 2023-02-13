<template>
  <div class="right-panel-body">
    <auto-form
      ref="autoForm"
      v-model="formData"
      :form-header="formHeader"
      :show-footer="false"
      :readonly="readonly"
    ></auto-form>
    <el-form ref="subForm" :model="subFormData">
      <el-form-item label="选择设备">
        <el-select
          v-model="subFormData.deviceId"
          clearable
          placeholder="请先选择设备"
          :disabled="readonly"
        >
          <el-option
            v-for="(item, index) in devicesList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <template v-if="subFormData.deviceId && subFormData.deviceId !== ''">
        <div
          v-for="(item, index) in subFormData.mathList"
          :key="index"
          class="sub-form-item"
        >
          <div class="title flex-parent between">
            运算{{ index + 1 }}
            <div v-if="!readonly">
              <i
                v-if="index === subFormData.mathList.length - 1"
                class="icon-button ri-add-box-fill m-l-5"
                @click="addItem"
              ></i>
              <i
                v-if="index !== 0"
                class="icon-button ri-checkbox-indeterminate-fill m-l-5"
                @click="removeItem(index)"
              ></i>
            </div>
          </div>
          <el-form-item
            label="字段名"
            :prop="`mathList.${index}.name`"
            :rules="[rules.isRequired, rules.isKeyName]"
          >
            <el-input
              v-model="subFormData.mathList[index].name"
              placeholder="请输入字段名"
              :disabled="readonly"
            ></el-input>
          </el-form-item>
          <el-form-item label="运算公式">
            <div class="flex-parent start">
              <el-form-item
                :prop="`mathList.${index}.point1`"
                :rules="[{ required: true, message: '不能为空' }]"
              >
                <el-select
                  v-model="subFormData.mathList[index].point1"
                  placeholder="采集点"
                  :disabled="readonly"
                >
                  <el-option
                    v-for="(point, $index) in point1List"
                    :key="$index"
                    :label="point.label"
                    :value="point.label"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                :prop="`mathList.${index}.symbol`"
                :rules="[{ required: true, message: '不能为空' }]"
                class="m-l-10 m-r-10"
                style="width: 160px"
              >
                <el-select
                  v-model="subFormData.mathList[index].symbol"
                  placeholder="运算"
                  :disabled="readonly"
                >
                  <el-option
                    v-for="(symbol, $index) in symbolList"
                    :key="$index"
                    :label="symbol.label"
                    :value="symbol.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                :prop="`mathList.${index}.point2`"
                :rules="[{ required: true, message: '不能为空' }]"
              >
                <el-select
                  v-model="subFormData.mathList[index].point2"
                  placeholder="采集点"
                  :disabled="readonly"
                >
                  <el-option
                    v-for="(point, $index) in point2List"
                    :key="$index"
                    :label="point.label"
                    :value="point.label"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-form-item>
          <div
            v-show="
              item.point1 !== '' && item.symbol !== '' && item.point2 !== ''
            "
            class="preview"
          >
            公式预览: {{ item.point1 }} {{ item.symbol }} {{ item.point2 }}
          </div>
        </div>
      </template>
    </el-form>
  </div>
</template>
<script>
  import getTypes, { TypeName } from '@/utils/getTypes'
  import { getBindDevice, getBindDevicePoint } from '@/api/flow'
  import {
    isRequired,
    isUrl,
    isKeyName,
    isEmail,
    isEmailList,
  } from '@/utils/formValidatorHelper'
  import { getMath, updateMath } from '@/api/math'
  export default {
    name: 'ComputeMath',
    props: {
      readonly: {
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
            required: true,
            groupId: 'group1', //属于哪个分组,
          },
        },
        subFormData: {
          deviceId: '',
          mathList: [
            {
              name: '',
              point1: '',
              point2: '',
              symbol: '',
            },
          ],
        },
        devicesList: [],
        point1List: [],
        point2List: [],
        symbolList: [],
        rules: {
          isRequired: isRequired(),
          isKeyName: isKeyName(),
        },
        tabIndex: 0,
      }
    },
    watch: {
      'subFormData.deviceId': async function (newId) {
        if (this.loading) {
          return
        }
        this.$set(this.subFormData, 'mathList', [
          {
            name: '',
            point1: '',
            point2: '',
            symbol: '',
          },
        ])
        this.getPointList(newId)
      },
    },
    async created() {
      const symbolTypes = await getTypes(TypeName.OPERATORTYPE)
      this.symbolList = [...symbolTypes]

      const bindDevices = await getBindDevice()
      this.devicesList = bindDevices.data.map((t) => {
        return {
          label: t.deviceName,
          value: t.id,
          ...t,
        }
      })

      this.getData()
    },
    methods: {
      addItem() {
        this.$set(
          this.subFormData,
          'mathList',
          this.subFormData.mathList.concat({
            name: '',
            point1: '',
            point2: '',
            symbol: '',
          })
        )
      },
      removeItem(index) {
        if (this.subFormData.mathList.length <= 1) {
          return
        }
        this.subFormData.mathList.splice(index, 1)
      },
      async getPointList(id) {
        let point1List = []
        let point2List = []
        if (!!id) {
          const res = await getBindDevicePoint(id)
          // console.log(res.data)
          if (res.data) {
            point1List = point1List.concat(
              res.data.map((t) => {
                return {
                  label: t.name,
                  value: t.id,
                  ...t,
                }
              })
            )
            point2List = point2List.concat(
              res.data.map((t) => {
                return {
                  label: t.name,
                  value: t.id,
                  ...t,
                }
              })
            )
            console.log(point1List, point2List)
          }
        }

        this.point1List = [...point1List]
        this.point2List = [...point2List]
        return
      },
      async getData() {
        this.$emit('loading', true)
        const { data } = await getMath(this.currentNode.id)
        this.id = data.id
        this.formData.nodeName.value =
          data.name || this.currentNode.attrs.text.text
        if (data.deviceId) {
          this.subFormData.deviceId = Number(data.deviceId)
          await this.getPointList(data.deviceId)
        }
        if (data.formula) {
          const formulaList = JSON.parse(data.formula)
          console.log('formulaList', formulaList)
          if (formulaList.length) {
            const mathList = []
            formulaList.forEach((formula) => {
              const math = {
                name: '',
                point1: '',
                point2: '',
                symbol: '',
              }
              math.name = formula.collectionName
              const expressionList = this.formatFormula(formula.expression)
              console.log('expressionList', expressionList)
              if (expressionList) {
                math.point1 = expressionList[0]
                math.symbol = expressionList[1]
                math.point2 = expressionList[2]
              }
              mathList.push(math)
            })
            this.subFormData.mathList = [...mathList]
            this.$forceUpdate()
          }
        }

        this.$nextTick(() => {
          this.$emit('loading', false)
        })
      },
      formatFormula(formula) {
        let symbol = this.getSymbolFromFormula(formula)
        if (symbol) {
          let formulaList = formula.split(symbol)

          if (formulaList.length !== 2) {
            throw (
              'formula format error! content is:' + JSON.stringify(formulaList)
            )
          }

          return [formulaList[0], symbol, formulaList[1]]
        } else {
          return null
        }
      },
      getSymbolFromFormula(formula) {
        let symbol = null
        const symbolList = this.symbolList.map((t) => t.value)
        for (let i = 0; i < symbolList.length; i++) {
          if (formula.indexOf(symbolList[i]) >= 0) {
            symbol = symbolList[i]
            break
          }
        }
        return symbol
      },
      async submit() {
        let valid, subFormValid
        try {
          valid = await this.$refs['autoForm'].save()
          subFormValid = await this.$refs['subForm'].validate()

          if (valid && subFormValid) {
            /**
             * [{expression:2+2,collectionName:''}]
             */
            const formula = []
            this.subFormData.mathList.forEach((item) => {
              formula.push({
                expression: `${item.point1}${item.symbol}${item.point2}`,
                collectionName: item.name,
              })
            })

            const postData = {
              id: this.id,
              flowId: this.currentNode.id,
              formula: JSON.stringify(formula),
              deviceId: this.subFormData.deviceId,
              name: this.formData.nodeName.value,
            }

            await updateMath(postData)
              .then(() => {
                this.$message.success('更新成功!')
                this.$emit('loading', false)
                this.$emit('updateNodeName', {
                  node: this.currentNode,
                  name: this.formData.nodeName.value,
                })
                this.$emit('success')
                this.$emit('close')
              })
              .catch(() => {
                this.$emit('loading', false)
              })
          }
        } catch (error) {
          console.log(error)
        }
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
    .sub-form-item {
      & + .sub-form-item {
        margin-top: 20px;
      }
      .title {
        font-size: 14px;
        color: #818182;
        padding-bottom: 10px;
        border-bottom: 1px solid #dbdbdb;
        margin-bottom: 20px;
      }
      .preview {
        font-size: 14px;
        color: #006fae;
      }
    }
  }
</style>
