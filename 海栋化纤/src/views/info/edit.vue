<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="500px"
    @close="close"
  >
    <el-form
      ref="form"
      :inline="true"
      :model="form"
      :inline-message="true"
      label-width="140px"
    >
      <el-form-item
        label="公司名称"
        prop="compy"
        :rules="[
          {
            required: true,
            message: '必填',
            trigger: 'blur',
          },
        ]"
      >
        <el-input v-model.trim="form.compy"></el-input>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input
          v-model.trim="form.address"
          type="textarea"
          style="width: 106%"
        ></el-input>
      </el-form-item>
      <el-form-item label="联系人" prop="contact">
        <el-input v-model.trim="form.contact"></el-input>
      </el-form-item>
      <el-form-item
        label="电话"
        prop="tel"
        :rules="[
          {
            type: 'number',
            message: '只能填数字',
            trigger: 'blur',
          },
        ]"
      >
        <el-input v-model.number="form.tel"></el-input>
      </el-form-item>

      <el-form-item
        v-if="appType == 'customer'"
        label="常用发货地址"
        prop="shipaddress"
      >
        <el-input
          v-model.trim="form.shipaddress"
          type="textarea"
          style="width: 106%"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="save">
        确 定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
  // import { userGroupList, buscusEdit } from './api'

  export default {
    name: 'Edit',
    props: {
      appType: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        type: '',
        loading: false,
        form: {
          id: '',
          address: '',
          compy: '',
          tel: null,
          contact: '',
          shipaddress: '',
        },
        rules: {
          title: [{ required: true, trigger: 'blur', message: '请输入标题' }],
        },
        title: '',
        dialogFormVisible: false,
      }
    },
    created() {},
    mounted() {},
    methods: {
      showEdit(row) {
        this.loading = false
        if (!row) {
          this.title = '添加'
          this.type = 'add'
        } else {
          this.type = 'edit'
          this.title = '编辑'
          row.tel = row.tel * 1
          this.form = Object.assign({}, row)
        }
        this.dialogFormVisible = true
      },
      close() {
        this.loading = false
        this.$refs['form'].resetFields()
        this.form = this.$options.data().form
        this.dialogFormVisible = false
      },
      save() {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            this.loading = true
            this.$emit('confirm', this.form)
          } else {
            return false
          }
        })
      },
    },
  }
</script>
