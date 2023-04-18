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
        label="登录名"
        prop="name"
        :rules="[
          {
            required: true,
            message: '必填',
            trigger: 'blur',
          },
        ]"
      >
        <el-input v-model.trim="form.name"></el-input>
      </el-form-item>
      <el-form-item
        label="真实姓名"
        prop="nickname"
        :rules="[
          {
            required: true,
            message: '必填',
            trigger: 'blur',
          },
        ]"
      >
        <el-input v-model.trim="form.nickname"></el-input>
      </el-form-item>
      <el-form-item
        label="密码"
        prop="password"
        :rules="[
          {
            required: type == 'add',
            message: '必填',
            trigger: 'blur',
          },
        ]"
      >
        <el-input v-model.trim="form.password"></el-input>
      </el-form-item>
      <el-form-item
        label="角色"
        prop="groups"
        :rules="[
          {
            required: true,
            message: '必选',
            trigger: 'change',
          },
        ]"
      >
        <el-select
          v-model="form.groups"
          placeholder="请选择"
          style="width: 120px"
          size="mini"
        >
          <el-option
            v-for="item in groupList"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="手机" prop="telephone">
        <el-input v-model.trim="form.telephone"></el-input>
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
  import { userGroupList, userEdit } from './api'

  export default {
    name: 'TableEdit',
    data() {
      return {
        type: '',
        loading: false,
        groupList: [],
        form: {
          name: '',
          nickname: '',
          telephone: '',
          groups: null,
          password: '',
        },
        rules: {
          title: [{ required: true, trigger: 'blur', message: '请输入标题' }],
          author: [{ required: true, trigger: 'blur', message: '请输入作者' }],
        },
        title: '',
        dialogFormVisible: false,
      }
    },
    created() {},
    mounted() {
      userGroupList().then((res) => {
        const list = res.filter((item) => {
          item.title = item.title.split(item.spacer + ' ').pop()
          return item.pid != 1 && item.id != this.$store.state.user.userGroup
        })
        this.groupList = list
      })
    },
    methods: {
      showEdit(row) {
        this.loading = false
        if (!row) {
          this.title = '添加用户'
          this.type = 'add'
        } else {
          this.type = 'edit'
          this.title = '编辑用户'
          row.password = ''
          row.groups = row.groups * 1
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
            this.form.group_id = this.form.groups
            this.form.id = this.form.user_id
            this.$emit('confirm', this.form)
          } else {
            return false
          }
        })
      },
    },
  }
</script>
