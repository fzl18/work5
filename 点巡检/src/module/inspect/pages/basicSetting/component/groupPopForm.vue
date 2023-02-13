<template>
  <el-dialog :title="`新增(编辑)班组`" :visible.sync="isShow" :before-close="handleClose">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="班组名称" prop="teamName" :rules="[{required:true,message:'请输入班组名称'}]">
        <el-input v-model="form.teamName" />
      </el-form-item>
      <el-form-item label="班组长" prop="teamLeaderId" :rules="[{required:true,message:'请选择班组长'}]">
        <el-select v-model="form.teamLeaderId" placeholder="请选择班组长">
          <el-option
            v-for="item in allUser" :key="item.userCode" :label="item.userName"
            :value="item.userCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="班组成员" prop="value">
        <el-transfer
          v-model="value" :titles="['所有人员','已选人员']" :props="{label:'userName',key:'userName'}"
          :data="allUser"
        />
      </el-form-item>
      <el-form-item style="text-align: right">
        <el-button type="primary" @click="handleSubmitForm('ruleForm')">保存</el-button>
        <el-button @click="handleClose">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { saveGroup, updateGroup } from '@/module/inspect/api/basicSetting/area';

const { mapState: mapState1 } = createNamespacedHelpers('coreCommon')
const { mapState, mapActions } = createNamespacedHelpers('inspectBasicSettingArea')
export default {
  name: "GroupPopForm",
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      value: [],
      form: {}
    }
  },
  computed: {
    ...mapState1({ allUnits: 'allUnits', allUser: 'allUser' }),
    ...mapState(['detailedId'])
  },
  watch: {
    isShow (val) {
      if (val) {
        this.$refs.form.clearValidate()
      }
    }
  },
  methods: {
    ...mapActions(['fetchDetailedAreaInfo']),
    handleClose () {
      this.$emit('close')
      this.form = {}
      this.value = []
    },
    initFormData (dd) {
      this.form = { ...this.form, ...dd }
      this.value = dd.teamMember.split(',')
    },
    handleSubmitForm () {
      this.$refs.form.validate((val) => {
        if (val) {
          const data = { ...this.form, areaId: this.detailedId, teamMember: this.value.join(',') }
          if (this.form.id) {
            updateGroup(data).then(res => {
              if (res.success) {
                this.$msg.success('修改班组成功')
                this.handleClose()
                this.fetchDetailedAreaInfo({ id: this.detailedId })
              } else {
                this.$msg.error('修改失败')
              }
            })
          } else {
            saveGroup(data).then(res => {
              if (res.success) {
                this.$msg.success('设备班组成功')
                this.handleClose()
                this.fetchDetailedAreaInfo({ id: this.detailedId })
              } else {
                this.$msg.error('设置失败')
              }
            })
          }
        }
      })
    }
  }
}
</script>
