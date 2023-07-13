<template>
  <el-dialog
    :title="$translateTitle('仓库详情')"
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
        :label="$translateTitle('仓库编码')"
      >
        <div class="form-i form-view">
          {{ form.code ? form.code : '-' }}
        </div>
      </el-form-item>
      <el-form-item
        class="span2"
        prop="name"
        :label="$translateTitle('仓库名称')"
      >
        <div class="form-i form-view">
          {{ form.name ? form.name : '-' }}
        </div>
      </el-form-item>
      <el-form-item
        class="span2"
        prop="propertyLocalVal"
        :label="$translateTitle('仓库属性')"
      >
        <div class="form-i form-view">
          {{ form.propertyLocalVal ? form.propertyLocalVal : '-' }}
        </div>
      </el-form-item>
      <el-form-item
        class="span2"
        prop="type"
        :label="$translateTitle('仓库类型')"
        :rules="[{ required: isEdit, message: $translateTitle($cws.w105) }]"
      >
        <el-select v-if="isEdit" v-model="form.type" class="form-i" clearable>
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <!-- <div class="form-i form-view">
          {{ form.typeName ? form.typeName : '-' }}
        </div> -->
      </el-form-item>
      <el-form-item
        class="span2"
        prop="stationIn"
        :label="$translateTitle('默认入库库位')"
      >
        <el-select
          v-if="isEdit"
          v-model="form.stationIn"
          class="form-i"
          clearable
        >
          <el-option
            v-for="item in placeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <!-- <div v-else class="form-i form-view">
          {{ form.stationIn ? form.stationIn : '-' }}
        </div> -->
      </el-form-item>
      <el-form-item
        class="span2"
        prop="stationOut"
        :label="$translateTitle('默认出库库位')"
      >
        <el-select
          v-if="isEdit"
          v-model="form.stationOut"
          class="form-i"
          clearable
        >
          <el-option
            v-for="item in placeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <!-- <div v-else class="form-i form-view">
          {{ form.stationOut ? form.stationOut : '-' }}
        </div> -->
      </el-form-item>
      <el-form-item
        class="span2"
        prop="warHouse"
        :label="$translateTitle('是否立库')"
        :rules="[{ required: isEdit, message: $translateTitle($cws.w105) }]"
      >
        <el-switch
          v-if="isEdit"
          v-model="form.warHouse"
          active-text="是"
          inactive-text="否"
          :active-value="true"
          :inactive-value="false"
        ></el-switch>
        <!-- <div v-else class="form-i form-view">
          {{ form.warHouse ? '是' : '否' }}
        </div> -->
      </el-form-item>
      <el-form-item
        class="span2"
        prop="autoTransferIn"
        :label="$translateTitle('自动调拨入库')"
        :rules="[{ required: isEdit, message: $translateTitle($cws.w105) }]"
      >
        <el-switch
          v-if="isEdit"
          v-model="form.autoTransferIn"
          active-text="是"
          inactive-text="否"
          :active-value="true"
          :inactive-value="false"
        ></el-switch>
        <!-- <div v-else class="form-i form-view">
          {{ form.autoTransferIn ? '是' : '否' }}
        </div> -->
      </el-form-item>
      <el-form-item
        class="span2"
        prop="responsible"
        :label="$translateTitle('直接负责人')"
      >
        <el-input
          v-if="isEdit"
          v-model="form.responsible"
          class="form-i"
          clearable
        ></el-input>
        <!-- <div v-else class="form-i form-view">
          {{ form.responsible ? form.responsible : '-' }}
        </div> -->
      </el-form-item>
      <el-form-item
        class="span2"
        prop="contactNumber"
        :label="$translateTitle('联系电话')"
      >
        <el-input
          v-if="isEdit"
          v-model="form.contactNumber"
          class="form-i"
          clearable
        ></el-input>
        <!-- <div v-else class="form-i form-view">
          {{ form.contactNumber ? form.contactNumber : '-' }}
        </div> -->
      </el-form-item>
      <el-form-item
        class="span4"
        prop="depUnionCode"
        :label="$translateTitle('所属末级部门')"
        :rules="[{ required: isEdit, message: $translateTitle($cws.w105) }]"
      >
        <el-cascader
          v-if="isEdit"
          v-model="form.depUnionCode"
          class="form-i"
          :options="systemOptions"
          :props="systemProps"
        ></el-cascader>
        <!-- <div v-else class="form-i form-view">
          {{ form.depUnionCode ? form.depUnionCode : '-' }}
        </div> -->
      </el-form-item>
      <el-form-item
        class="span4"
        prop="remark"
        :label="$translateTitle('备注')"
      >
        <el-input
          v-if="isEdit"
          v-model="form.remark"
          class="form-i"
          clearable
          type="textarea"
          :rows="3"
        ></el-input>
        <!-- <div v-else class="form-i form-view">
          {{ form.remark ? form.remark : '-' }}
        </div> -->
      </el-form-item>
    </el-form>
    <span v-if="isEdit" slot="footer" class="dialog-footer">
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
  import { getSystemList, getPlaceList, saveStorage } from '../api'
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
      isEdit: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        form: {},
        systemOptions: [],
        systemProps: {
          emitPath: false,
        },
        placeOptions: [],
      }
    },
    computed: {
      ...mapGetters({
        dictionary: 'coreDictionary/dictionary',
      }),
      typeOptions() {
        return this.dictionary.filter((item) => item.dictCategory == 'lx')
      },
    },
    methods: {
      async handleOpen() {
        if (this.row) {
          this.form = JSON.parse(JSON.stringify(this.row))
          if (this.isEdit) {
            let data = await getPlaceList({
              storage: this.form.code,
              enablePage: false,
            })
            let placeList = []
            if (Array.isArray(data.objList)) {
              placeList = data.objList
            }
            placeList.forEach((item) => {
              item.value = item.code
              item.label = `${item.name}(${item.code})`
            })
            this.placeOptions = placeList
          }
        } else {
          this.form = {}
        }
        if (this.isEdit) {
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
        }
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
                this.form.storageCode = this.form.code
                await saveStorage(this.form)
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
