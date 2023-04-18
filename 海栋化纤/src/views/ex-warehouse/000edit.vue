<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="60%"
    @close="close"
  >
    <!-- <el-divider content-position="left">填写</el-divider> -->
    <el-form
      ref="form"
      :inline="true"
      :model="form"
      :rules="rules"
      label-width="140px"
    >
      <div class="baseInfo">
        <div class="tit">基础信息</div>
        <el-form-item label="批号" prop="batchnum">
          <el-input
            v-model.number="form.batchnum"
            :readonly="!isEdit"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-if="type != 'permit'"
          label="收货单位（客户）"
          prop="company"
        >
          <el-input
            v-model="form.company"
            :readonly="!isEdit"
            required
          ></el-input>
        </el-form-item>
      </div>
      <div class="baseInfo goodsInfo">
        <div class="tit">货物信息</div>
        <el-form-item v-if="type != 'permit'" label="货物名称" prop="itemname">
          <el-input
            v-model="form.itemname"
            :readonly="!isEdit"
            required
          ></el-input>
        </el-form-item>
        <el-form-item v-if="type != 'permit'" label="规格" prop="format">
          <el-input v-model="form.format" :readonly="!isEdit"></el-input>
        </el-form-item>
        <el-form-item label="重量" prop="weight">
          <el-input v-model.number="form.weight" :readonly="!isEdit"></el-input>
        </el-form-item>
        <el-form-item label="单位(KG/T)" prop="unit">
          <el-input v-model="form.unit" :readonly="!isEdit"></el-input>
        </el-form-item>
        <el-form-item v-if="type == 'amount'" label="单价" prop="price">
          <el-input v-model.number="form.price" :readonly="!isEdit"></el-input>
        </el-form-item>
        <el-form-item v-if="type == 'amount'" label="金额" prop="amount">
          <el-input v-model.number="form.amount" :readonly="!isEdit"></el-input>
        </el-form-item>
      </div>
      <div
        v-if="type == 'fahuo' || type == 'permit'"
        class="baseInfo shippingInfo"
      >
        <div class="tit">发货信息</div>
        <el-form-item label="件数" prop="nums">
          <el-input
            v-model.number="form.nums"
            :readonly="type == 'permit' ? true : false"
          ></el-input>
        </el-form-item>
      </div>
      <div v-if="type == 'tuihuo'" class="baseInfo returnInfo">
        <div class="tit">退货信息</div>
        <el-form-item label="件数" prop="nums">
          <el-input v-model.number="form.nums"></el-input>
        </el-form-item>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="big" @click="close">取 消</el-button>
      <el-button type="primary" size="big" @click="save('form')">
        确 定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
  // import { doEdit } from '@/api/menuManagement'
  // import { applyEdit } from './api'
  // import { number } from 'echarts/lib/export'
  export default {
    name: 'MenuManagementEdit',
    props: {
      tit: { type: String, default: '' },
      type: { type: String, default: '' },
      isEdit: { type: Boolean, default: false },
    },
    data() {
      return {
        form: {
          batchnum: '',
          company: '',
          itemname: '',
          format: '',
          weight: '',
          price: '',
          amount: '',
          unit: '',
          nums: '',
        },
        rules: {
          batchnum: [{ required: true, trigger: 'blur', message: '必填' }],
          company: [{ required: true, trigger: 'blur', message: '必填' }],
          itemname: [{ required: true, trigger: 'blur', message: '必填' }],
          // price: [
          //   { required: true, trigger: 'blur', message: '必填' },
          //   { type: 'number', trigger: 'blur', message: '只能填写数字' },
          // ],
          unit: [{ required: true, trigger: 'blur', message: '必填' }],
          format: [{ required: true, trigger: 'blur', message: '必填' }],
          weight: [
            { required: true, trigger: 'blur', message: '必填' },
            { type: 'number', trigger: 'blur', message: '只能填写数字' },
          ],
          // amount: [
          //   { required: true, trigger: 'blur', message: '必填' },
          //   { type: 'number', trigger: 'blur', message: '只能填写数字' },
          // ],
          nums: [
            { required: true, trigger: 'blur', message: '必填' },
            { type: 'number', trigger: 'blur', message: '只能填写数字' },
          ],
        },
        title: '',
        dialogFormVisible: false,
      }
    },
    created() {},
    methods: {
      showEdit(row) {
        if (!row) {
          this.title = '添加' + this.tit
        } else {
          this.title = '编辑' + this.tit
          this.form = Object.assign({}, row)
        }
        this.dialogFormVisible = true
      },
      close() {
        this.$refs['form'].resetFields()
        this.form = this.$options.data().form
        this.dialogFormVisible = false
      },
      save() {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            // this.$baseMessage(msg, 'success')
            // console.log(this.form)
            this.$emit('confirm', this.form)
            this.close()
          } else {
            return false
          }
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .baseInfo {
    border: 1px solid rgb(207, 207, 207);
    // padding: 0px 10px 5px 10px;
    margin-bottom: 20px;
    background: rgb(245, 245, 245);
    border-radius: 4px;

    .tit {
      font-size: 15px;
      // font-weight: bold;
      padding: 10px 15px;
      background: rgb(51, 134, 251);
      border-radius: 4px 4px 0 0;
      margin-bottom: 20px;
      color: #fff;
    }
  }
  .goodsInfo {
    .tit {
      background: rgb(145, 0, 212);
    }
  }
  .shippingInfo {
    .tit {
      background: rgb(0, 192, 93);
    }
  }
  .shippingInfo {
    .tit {
      background: rgb(176, 10, 63);
    }
  }
</style>
