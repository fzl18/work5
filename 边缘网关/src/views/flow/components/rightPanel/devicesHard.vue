<template>
  <div class="right-panel-body">
    <auto-form
      ref="autoForm"
      v-model="formData"
      :form-header="formHeader"
      :show-footer="false"
      :readonly="readonly"
    ></auto-form>
  </div>
</template>
<script>
  import {
    getBindDevice,
    getBindDeviceData,
    getBindDevicePoint,
    updateBindDevice,
  } from '@/api/flow'
  export default {
    name: 'DevicesHard',
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
          group2: {
            title: '',
          },
          point: {
            title: '',
          },
        },
        id: null,
        formData: {
          deviceName: {
            code: 'deviceName', //前端的key,这个id必须和作为id的key保持一致,方便映射时作为指针值
            apiCode: 'name', //后端的key
            title: '设备名称', //字段的label
            value: '', //字段的值
            type: 'text', //字段的类型,目前支持 input,number(使用input+正则验证模拟),select,checkbox,empty(表示占位符,不做任何逻辑处理)
            span: 24, //自定义一行的占位size,例如独占一行使用,使用规则同el-col的span属性
            groupId: 'group1', //属于哪个分组,
          },
          deviceBind: {
            code: 'deviceBind', //前端的key,这个id必须和作为id的key保持一致,方便映射时作为指针值
            apiCode: 'deviceBind', //后端的key
            title: '绑定设备', //字段的label
            value: '', //字段的值
            type: 'select', //字段的类型,目前支持 input,number(使用input+正则验证模拟),select,checkbox,empty(表示占位符,不做任何逻辑处理)
            options: [],
            filterable: true,
            span: 24, //自定义一行的占位size,例如独占一行使用,使用规则同el-col的span属性
            groupId: 'group2', //属于哪个分组,
          },
        },
      }
    },
    watch: {
      'formData.deviceBind.value': function (newId) {
        if (this.loading) {
          return false
        }
        let delKeys = []

        for (let key in this.formData) {
          if (key !== 'deviceName' && key !== 'deviceBind') {
            delKeys.push(key)
          }
        }
        delKeys.forEach((key) => {
          delete this.formData[key]
        })

        getBindDevicePoint(newId).then((res) => {
          if (res.data) {
            res.data.forEach((item) => {
              this.$set(this.formData, item.name, {
                code: item.name, //前端的key,这个id必须和作为id的key保持一致,方便映射时作为指针值
                apiCode: item.name, //后端的key
                title: '', //字段的label
                value: '', //字段的值
                type: 'checkbox', //字段的类型,目前支持 input,number(使用input+正则验证模拟),select,checkbox,empty(表示占位符,不做任何逻辑处理)
                label: `${item.name}（${item.dataType}）`,
                span: 24, //自定义一行的占位size,例如独占一行使用,使用规则同el-col的span属性
                groupId: 'point', //属于哪个分组,
                data: {
                  ...item,
                },
              })
            })
          }
        })
      },
    },
    created() {
      console.log('create', this.currentNode)
      this.getData()
    },
    methods: {
      async getData() {
        this.$emit('loading', true)

        const bindDevices = await getBindDevice()
        this.$set(
          this.formData.deviceBind,
          'options',
          bindDevices.data.map((t) => {
            return {
              label: t.deviceName,
              value: t.id,
              ...t,
            }
          })
        )

        const { data } = await getBindDeviceData(this.currentNode.id)
        this.id = data.id
        this.formData.deviceName.value =
          data.name || this.currentNode.attrs.text.text
        this.formData.deviceBind.value = data.deviceId || ''
        if (data.deviceId) {
          const point = await getBindDevicePoint(data.deviceId)

          if (point.data) {
            const collectionPointList = data.collectionPoint
              ? data.collectionPoint.split(',')
              : []

            point.data.forEach((item) => {
              this.$set(this.formData, item.name, {
                code: item.name, //前端的key,这个id必须和作为id的key保持一致,方便映射时作为指针值
                apiCode: item.name, //后端的key
                title: '', //字段的label
                value: collectionPointList.indexOf(item.id.toString()) >= 0, //字段的值
                type: 'checkbox', //字段的类型,目前支持 input,number(使用input+正则验证模拟),select,checkbox,empty(表示占位符,不做任何逻辑处理)
                label: `${item.name}（${item.dataType}）`,
                span: 24, //自定义一行的占位size,例如独占一行使用,使用规则同el-col的span属性
                groupId: 'point', //属于哪个分组,
                data: {
                  ...item,
                },
              })
            })
          }
        }

        this.$emit('loading', false)
      },
      async submit() {
        if (this.loading) {
          return false
        }

        let valid
        try {
          valid = await this.$refs['autoForm'].save()

          if (valid) {
            this.$emit('loading', true)
            // console.log('submit', this.formData)
            this.$emit('updateNodeName', {
              node: this.currentNode,
              name: this.formData.deviceName.value,
            })

            const collectionPointList = []

            for (let key in this.formData) {
              if (key !== 'deviceName' && key !== 'deviceBind') {
                if (this.formData[key].value === true) {
                  collectionPointList.push(this.formData[key].data.id)
                }
              }
            }

            const postData = {
              name: this.formData.deviceName.value,
              deviceId: this.formData.deviceBind.value,
              flowId: this.currentNode.id,
              collectionPoint: collectionPointList.join(','),
              id: this.id,
            }

            await updateBindDevice(postData)
              .then(() => {
                this.$message.success('更新成功!')

                this.$emit('loading', false)
                this.$emit('success')
                this.$emit('close')
              })
              .catch(() => {
                this.$emit('loading', false)
              })
          }
        } catch (error) {
          this.$emit('loading', false)
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
  }
</style>
