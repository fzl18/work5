<template>
  <el-dialog
    :title="$translateTitle('设备档案信息')"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :before-close="close"
    width="600px"
    @open="handleOpen"
  >
    <el-form
      ref="form"
      class="form form-detail"
      :model="form"
      label-position="top"
    >
      <el-form-item
        class="span2"
        prop="code"
        :label="$translateTitle('设备编码')"
        :rules="[{ required: true, message: $translateTitle($cws.w105) }]"
      >
        <el-input v-model="form.code" class="form-i" clearable></el-input>
      </el-form-item>
      <el-form-item
        class="span2"
        prop="name"
        :label="$translateTitle('设备名称')"
        :rules="[{ required: true, message: $translateTitle($cws.w105) }]"
      >
        <el-input v-model="form.name" class="form-i" clearable></el-input>
      </el-form-item>
      <el-form-item
        class="span2"
        prop="deviceModel"
        :label="$translateTitle('设备型号')"
        :rules="[{ required: true, message: $translateTitle($cws.w105) }]"
      >
        <el-input
          v-model="form.deviceModel"
          class="form-i"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item
        class="span2"
        prop="deviceType"
        :label="$translateTitle('设备类型')"
        :rules="[{ required: true, message: $translateTitle($cws.w105) }]"
      >
        <el-select v-model="form.deviceType" class="form-i" clearable>
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <!-- <el-input v-model="form.deviceType" class="form-i" clearable></el-input> -->
      </el-form-item>
      <el-form-item
        class="span2"
        prop="brand"
        :label="$translateTitle('品牌名称')"
        :rules="[{ required: true, message: $translateTitle($cws.w105) }]"
      >
        <el-input v-model="form.brand" class="form-i" clearable></el-input>
      </el-form-item>
      <el-form-item
        class="span2"
        prop="important"
        :label="$translateTitle('是否是重要的设备')"
        :rules="[{ required: true, message: $translateTitle($cws.w105) }]"
      >
        <el-switch
          v-model="form.important"
          active-text="是"
          inactive-text="否"
          :active-value="true"
          :inactive-value="false"
        ></el-switch>
      </el-form-item>
      <el-form-item
        class="span2"
        prop="unitUnionCode"
        :label="$translateTitle('公司')"
        :rules="[{ required: true, message: $translateTitle($cws.w105) }]"
      >
        <el-select v-model="form.unitUnionCode" class="form-i" clearable>
          <el-option
            v-for="item in unitOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        class="span2"
        prop="department"
        :label="$translateTitle('所属部门')"
        :rules="[{ required: true, message: $translateTitle($cws.w105) }]"
      >
        <el-cascader
          v-model="form.department"
          class="form-i"
          :options="systemOptions"
          :props="systemProps"
        ></el-cascader>
        <!-- <el-input v-model="form.department" class="form-i" clearable></el-input> -->
      </el-form-item>
      <el-form-item
        class="span2"
        prop="installRegion"
        :label="$translateTitle('安装区域')"
        :rules="[{ required: true, message: $translateTitle($cws.w105) }]"
      >
        <el-input
          v-model="form.installRegion"
          class="form-i"
          clearable
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <bt-button type="primary" @click="submitForm">
        {{ $translateTitle($cws.w008) }}
      </bt-button>
      <bt-button @click="close">
        {{ $translateTitle($cws.w009) }}
      </bt-button>
    </span>
  </el-dialog>
</template>

<script>
  import { getSystemList, getDeviceById, addDevice, editDevice } from '../api'
  import { mapGetters } from 'vuex'
  export default {
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
      row: {
        type: Object,
      },
    },
    data() {
      return {
        form: {
          code: null, //设备编码
          name: null, //设备名称
          deviceModel: null, //设备型号
          deviceType: null, //设备类型
          brand: null, //品牌名称
          important: false, //是否是重要的设备
          unitUnionCode: null, //所属公司统一编码
          department: null, //所属部门
          installRegion: null, //安装区域
        },
        systemOptions: [],
        systemProps: {
          emitPath: false,
          checkStrictly: true,
        },
      }
    },
    computed: {
      ...mapGetters({
        userInfo: 'coreUser/userInfo',
        dictionary: 'coreDictionary/dictionary',
      }),
      unitOptions() {
        if (this.userInfo && Array.isArray(this.userInfo.userUnits)) {
          return this.userInfo.userUnits.map((item) => {
            item.value = item.unionCode
            item.label = item.unitName
            return item
          })
        } else {
          return []
        }
      },
      typeOptions() {
        return this.dictionary
          .filter((item) => item.dictCategory == 'DEVICE_TYPE')
          .map((item) => {
            return { value: item.dictCode, label: item.dictName }
          })
      },
    },
    methods: {
      async handleOpen() {
        if (this.row) {
          //编辑
          let data = await getDeviceById({ id: this.row.id })
          this.form = data
        } else {
          //新增
          this.form = {
            code: null, //设备编码
            name: null, //设备名称
            deviceModel: null, //设备型号
            deviceType: null, //设备类型
            brand: null, //品牌名称
            important: false, //是否是重要的设备
            unitUnionCode: null, //所属公司统一编码
            department: null, //所属部门
            installRegion: null, //安装区域
          }
          if (this.$refs.form) {
            this.$refs.form.resetFields()
          }
        }
        this.getSystemOptions()
      },
      async getSystemOptions() {
        let list = await getSystemList({ withSec: false })
        formatList(list)
        function formatList(list) {
          if (Array.isArray(list)) {
            list.forEach((item) => {
              item.value = item.unitCode
              item.label = item.unitName
              if (Array.isArray(item.children) && item.children.length > 0) {
                formatList(item.children)
              } else {
                delete item.children
              }
            })
          }
        }
        this.systemOptions = list
      },
      submitForm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.$confirm(this.$translateTitle(this.$cws.w101), {
              title: this.$translateTitle(this.$cws.w010),
              type: 'warning',
              center: true,
            })
              .then(async () => {
                if (this.form.id) {
                  await editDevice(this.form)
                } else {
                  await addDevice(this.form)
                }
                this.$msg({
                  type: 'success',
                  message: this.$translateTitle(this.$cws.w103),
                })
                this.$emit('refresh')
                this.close()
              })
              .catch(() => {})
          }
        })
      },
      close() {
        this.$emit('update:visible', false)
      },
    },
  }
</script>

<style lang="scss" scoped></style>
