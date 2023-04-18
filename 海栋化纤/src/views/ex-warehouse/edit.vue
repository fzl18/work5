<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="85%"
    @close="close"
  >
    <!-- <el-divider content-position="left">填写</el-divider> -->
    <el-form
      ref="form"
      :inline="true"
      :model="form"
      :inline-message="true"
      label-width="140px"
    >
      <div class="vscode">
        <div class="box">
          <div class="head">
            <div class="title">
              {{ tit }}
              <br />
              <div v-if="type == 'apply'" class="num">
                编号: {{ form.number || '自动生成' }}
              </div>
              <div v-if="type == 'delivery'" class="num">
                编号: {{ form.out_number || '自动生成' }}
              </div>
              <div v-if="type == 'shipping'" class="num">
                编号: {{ form.deliv_number || '自动生成' }}
              </div>
              <div v-if="type == 'permit'" class="num">
                编号: {{ form.pp_number || '自动生成' }}
              </div>
              <div v-if="type == 'return'" class="num">
                编号: {{ form.rtn_number || '自动生成' }}
              </div>
              <div v-if="type == 'shipping'" class="sty">
                样式：
                <el-select
                  v-model="form.style"
                  placeholder="请选"
                  style="width: 80px"
                  size="mini"
                >
                  <el-option
                    v-for="item in [
                      { label: '样式1', value: 0 },
                      { label: '样式2', value: 2 },
                    ]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </div>

            <div class="date">日期：{{ dayjs().format('YYYY年MM月DD日') }}</div>
          </div>
          <div>
            <div class="">
              <span v-if="type != 'apply'">
                收货单位（客户）：{{ form.company }}
              </span>
              <el-form-item
                v-if="type == 'apply'"
                label="收货单位（客户）"
                prop="company"
                :rules="[
                  {
                    required: true,
                    message: '必填',
                    trigger: 'change',
                  },
                ]"
              >
                <!-- <el-input v-model="form.company"></el-input> -->
                <el-autocomplete
                  v-model="form.company"
                  :fetch-suggestions="getCustomerList"
                  @select="handleSelect"
                ></el-autocomplete>
              </el-form-item>
            </div>
          </div>

          <!--      申请单    -->
          <div v-if="type == 'apply'" class="body">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <th width="5%">序号</th>
                <th width="15%">货物名称</th>
                <th width="15%">规格</th>
                <!-- <th width="15%">备注</th> -->
                <th width="10%">批号</th>
                <th width="5%">重量</th>
                <th width="5%">单位</th>
                <th width="5%">单价</th>
                <th width="5%">数量</th>
                <th width="5%">托/箱</th>
                <!-- <th width="10%">金额</th> -->
                <th width="5%">操作</th>
              </tr>
              <tr v-for="(item, index) in form.goodsList" :key="index">
                <td>{{ index + 1 }}</td>
                <td>
                  <el-form-item
                    label=""
                    :prop="`goodsList.${index}.itemname`"
                    :rules="[
                      {
                        required: true,
                        message: '必填',
                        trigger: 'blur',
                      },
                    ]"
                  >
                    <el-input
                      v-model="item.itemname"
                      type="textarea"
                      size="mini"
                      rows="1"
                      style="width: 100%"
                    ></el-input>
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    label=""
                    :prop="`goodsList.${index}.format`"
                    :rules="[
                      {
                        required: true,
                        message: '必填',
                        trigger: 'blur',
                      },
                    ]"
                  >
                    <el-input
                      v-model="item.format"
                      type="textarea"
                      rows="1"
                      size="mini"
                    ></el-input>
                  </el-form-item>
                </td>
                <!-- <td>
                  <el-form-item label="" :prop="`goodsList.${index}.remark`">
                    <el-input
                      v-model="item.remark"
                      rows="1"
                      type="textarea"
                      size="mini"
                    ></el-input>
                  </el-form-item>
                </td> -->
                <td>
                  <el-form-item label="" :prop="`goodsList.${index}.batchnum`">
                    <el-input
                      v-model="item.batchnum"
                      :readonly="!isEdit"
                      size="mini"
                    ></el-input>
                  </el-form-item>
                </td>

                <td>
                  <el-form-item
                    label=""
                    :prop="`goodsList.${index}.weight`"
                    :rules="[
                      {
                        type: 'number',
                        message: '数字',
                        trigger: 'blur',
                      },
                    ]"
                  >
                    <el-input-number
                      v-model.number="item.weight"
                      :precision="3"
                      :min="0"
                      size="mini"
                    ></el-input-number>
                  </el-form-item>
                </td>
                <td>
                  <el-form-item label="" :prop="`goodsList.${index}.unit`">
                    <el-select
                      v-model="item.unit"
                      placeholder="请选"
                      style="width: 80px"
                      size="mini"
                    >
                      <el-option
                        v-for="val in ['KG', 'T']"
                        :key="val"
                        :label="val"
                        :value="val"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    label=""
                    :prop="`goodsList.${index}.price`"
                    :rules="[
                      {
                        type: 'number',
                        message: '数字',
                        trigger: 'blur',
                      },
                    ]"
                  >
                    <el-input-number
                      v-model.number="item.price"
                      :precision="3"
                    ></el-input-number>
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    label=""
                    :prop="`goodsList.${index}.nums`"
                    :rules="[
                      {
                        required: true,
                        message: '必填',
                        trigger: 'blur',
                      },
                      {
                        type: 'number',
                        message: '数字',
                        min: 1,
                        trigger: 'blur',
                      },
                    ]"
                  >
                    <el-input-number
                      v-model.number="item.nums"
                      size="mini"
                      :precision="0"
                    ></el-input-number>
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    label=""
                    :prop="`goodsList.${index}.boxes`"
                    :rules="[
                      {
                        required: true,
                        message: '必填',
                        trigger: 'change',
                      },
                    ]"
                  >
                    <el-select
                      v-model="item.boxes"
                      placeholder="请选"
                      style="width: 80px"
                      size="mini"
                    >
                      <el-option
                        v-for="val in [
                          { label: '托', value: 0 },
                          { label: '箱', value: 1 },
                        ]"
                        :key="val.value"
                        :label="val.label"
                        :value="val.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </td>
                <!-- <td>
                  <el-form-item label="" :prop="`goodsList.${index}.amount`">
                    <el-input v-model="item.amount"></el-input>
                  </el-form-item>
                </td> -->
                <td>
                  <i
                    class="el-icon-delete"
                    style="color: red"
                    @click="handleDel(item)"
                  ></i>
                </td>
              </tr>
              <tr>
                <td colspan="10">
                  <div class="remark">
                    <span>备注：</span>
                    <el-form-item label="" :prop="`remark`">
                      <el-input
                        v-model="form.remark"
                        rows="3"
                        type="textarea"
                        style="width: 100%"
                      ></el-input>
                    </el-form-item>
                  </div>
                </td>
              </tr>
              <tr>
                <td colspan="10">
                  <span class="add">
                    <i
                      class="el-icon-circle-plus-outline"
                      @click="handleAdd"
                    ></i>
                  </span>
                </td>
              </tr>
            </table>
          </div>

          <!--      出库单    -->
          <div v-if="type == 'delivery'" class="body">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <th width="5%">序号</th>
                <th width="15%">货物名称</th>
                <th width="15%">规格</th>
                <!-- <th width="15%">备注</th> -->
                <th width="10%">批号</th>
                <th width="10%">重量</th>
                <th width="5%">KG/T</th>
                <th width="10%">数量</th>
                <th width="10%">托/箱</th>
              </tr>
              <tr v-for="(item, index) in form.goodsList" :key="index">
                <td>{{ index + 1 }}</td>
                <td>
                  {{ item.itemname }}
                </td>
                <td>
                  {{ item.format }}
                </td>
                <!-- <td>
                  <el-form-item label="" :prop="`goodsList.${index}.remark`">
                    <el-input
                      v-model="item.remark"
                      rows="1"
                      type="textarea"
                      size="mini"
                    ></el-input>
                  </el-form-item>
                </td> -->
                <td>
                  <el-form-item
                    label=""
                    :prop="`goodsList.${index}.batchnum`"
                    :rules="[
                      {
                        required: true,
                        message: '必填',
                        trigger: 'blur',
                      },
                    ]"
                  >
                    <el-input v-model="item.batchnum" size="mini"></el-input>
                  </el-form-item>
                </td>

                <td>
                  <el-form-item
                    label=""
                    :prop="`goodsList.${index}.weight`"
                    :rules="[
                      {
                        required: true,
                        message: '必填',
                        trigger: 'blur',
                      },
                      {
                        type: 'number',
                        message: '数字',
                        trigger: 'blur',
                      },
                    ]"
                  >
                    <el-input-number
                      v-model.number="item.weight"
                      :precision="3"
                      :min="0"
                      size="mini"
                    ></el-input-number>
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    label=""
                    :prop="`goodsList.${index}.unit`"
                    :rules="[
                      {
                        required: true,
                        message: '必选',
                        trigger: 'change',
                      },
                    ]"
                  >
                    <el-select
                      v-model="item.unit"
                      placeholder="请选"
                      style="width: 80px"
                      size="mini"
                    >
                      <el-option
                        v-for="val in ['KG', 'T']"
                        :key="val"
                        :label="val"
                        :value="val"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    label=""
                    :prop="`goodsList.${index}.nums`"
                    :rules="[
                      {
                        required: true,
                        message: '必填',
                        trigger: 'blur',
                      },
                      {
                        type: 'number',
                        message: '数字',
                        min: 1,
                        trigger: 'blur',
                      },
                    ]"
                  >
                    <el-input-number
                      v-model.number="item.nums"
                      size="mini"
                      :precision="0"
                    ></el-input-number>
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    label=""
                    :prop="`goodsList.${index}.boxes`"
                    :rules="[
                      {
                        required: true,
                        message: '必填',
                        trigger: 'change',
                      },
                    ]"
                  >
                    <el-select
                      v-model="item.boxes"
                      placeholder="请选"
                      style="width: 80px"
                      size="mini"
                    >
                      <el-option
                        v-for="val in [
                          { label: '托', value: 0 },
                          { label: '箱', value: 1 },
                        ]"
                        :key="val.value"
                        :label="val.label"
                        :value="val.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </td>
              </tr>

              <tr>
                <td colspan="8">
                  <div class="remark">
                    <span>备注：</span>
                    <el-form-item label="" :prop="`remark`">
                      <el-input
                        v-model="form.remark"
                        rows="3"
                        type="textarea"
                        style="width: 100%"
                      ></el-input>
                    </el-form-item>
                  </div>
                </td>
              </tr>
            </table>
          </div>

          <!--      送货单    -->
          <div v-if="type == 'shipping'" class="body">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <th width="5%">序号</th>
                <th width="15%">货物名称</th>
                <th width="15%">规格</th>
                <!-- <th width="15%">备注</th> -->
                <th width="10%">批号</th>
                <th width="10%">重量</th>
                <th width="5%">KG/T</th>
                <th width="10%">数量</th>
                <th width="10%">托/箱</th>
                <th v-if="form.style == 2" width="10%">单价</th>
                <th v-if="form.style == 2" width="10%">金额</th>
              </tr>
              <tr v-for="(item, index) in form.goodsList" :key="index">
                <td>{{ index + 1 }}</td>
                <td>
                  {{ item.itemname }}
                </td>
                <td>
                  {{ item.format }}
                </td>
                <!-- <td>
                  {{ item.remark }}
                </td> -->
                <td>
                  {{ item.batchnum }}
                </td>
                <td>
                  {{ item.weight }}
                </td>
                <td>
                  {{ item.unit }}
                </td>
                <td>
                  {{ item.nums }}
                </td>
                <td>
                  {{ item.boxes ? '箱' : '托' }}
                </td>
                <td v-if="form.style == 2">
                  <el-form-item
                    label=""
                    :prop="`goodsList.${index}.price`"
                    :rules="[
                      {
                        type: 'number',
                        message: '数字',
                        trigger: 'blur',
                      },
                    ]"
                  >
                    <el-input-number
                      v-model.number="item.price"
                      :min="0"
                      :precision="3"
                    ></el-input-number>
                  </el-form-item>
                </td>
                <td v-if="form.style == 2">
                  {{
                    item.price && item.weight
                      ? (item.price * item.weight).toFixed(2)
                      : ''
                  }}
                  <!-- <el-form-item label="" :prop="`goodsList.${index}.amount`">
                    <el-input v-model="item.amount"></el-input>
                  </el-form-item> -->
                </td>
              </tr>
              <tr>
                <td colspan="8">
                  <div class="remark">
                    <span>备注：</span>
                    <div>{{ form.remark }}</div>
                  </div>
                </td>
              </tr>
            </table>
          </div>

          <!--      出门证    -->
          <div v-if="type == 'permit'" class="body">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <th width="5%">序号</th>
                <th width="15%">货物名称</th>
                <th width="10%">重量</th>
                <th width="10%">KG/T</th>
                <th width="10%">数量</th>
                <th width="10%">托/箱</th>
              </tr>
              <tr v-for="(item, index) in form.goodsList" :key="index">
                <td>{{ index + 1 }}</td>
                <td>
                  {{ item.itemname }}
                </td>
                <td>
                  {{ item.weight }}
                </td>
                <td>
                  {{ item.unit }}
                </td>
                <td>
                  {{ item.nums }}
                </td>
                <td>
                  {{ item.boxes ? '箱' : '托' }}
                </td>
              </tr>
              <tr>
                <td colspan="6">
                  <div class="remark">
                    <span>备注：</span>
                    <div>{{ form.remark }}</div>
                  </div>
                </td>
              </tr>
            </table>
          </div>

          <!--      退货单    -->
          <div v-if="type == 'return'" class="body">
            <table cellpadding="0" cellspacing="0" border="0" class="old">
              <tr>
                <th width="5%">序号</th>
                <th width="15%">货物名称</th>
                <th width="15%">规格</th>
                <!-- <th width="15%">备注</th> -->
                <th width="10%">批号</th>
                <th width="10%">数量</th>
                <th width="10%">重量</th>
                <th width="5%">单位</th>
                <th width="5%">操作</th>
                <!-- <th v-if="form.style == 2" width="10%">单价</th>
                <th v-if="form.style == 2" width="10%">金额</th> -->
              </tr>
              <tr v-for="(item, index) in form.goodsList" :key="index">
                <td>{{ index + 1 }}</td>
                <td>
                  {{ item.itemname }}
                </td>
                <td>
                  {{ item.format }}
                </td>
                <!-- <td>
                  {{ item.remark }}
                </td> -->
                <td>
                  {{ item.batchnum }}
                </td>
                <td>{{ item.nums }}{{ item.boxes ? '箱' : '托' }}</td>
                <td>
                  {{ item.weight }}
                </td>
                <td>
                  {{ item.unit }}
                </td>
                <!-- <td v-if="form.style == 2">
                  <el-form-item label="" :prop="`goodsList.${index}.price`">
                    <el-input v-model="item.price"></el-input>
                  </el-form-item>
                </td>
                <td v-if="form.style == 2">
                  {{ item.price * item.nums }}                  
                </td> -->
                <td>
                  <el-button
                    :type="item.ret ? 'info' : 'danger'"
                    plain
                    :disabled="!!item.ret"
                    @click="returnGoods(item)"
                  >
                    退货
                  </el-button>
                </td>
              </tr>
              <tr>
                <td colspan="8">
                  <div class="remark">
                    <span>备注：</span>
                    <div>{{ form.remark }}</div>
                  </div>
                </td>
              </tr>
            </table>
            <table
              cellpadding="0"
              cellspacing="0"
              border="0"
              style="margin-top: 20px"
            >
              <tr>
                <th width="15%">回单</th>
                <th width="25%">收货地址</th>
                <th width="10%">车型</th>
                <th width="15%">运输公司</th>
                <th width="10%">运费</th>
                <th width="10%">邮寄费</th>
              </tr>
              <tr>
                <td>
                  <el-form-item label="" prop="receipt">
                    <el-switch
                      v-model="form.receipt"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      active-text="有"
                      inactive-text="无"
                      size="mini"
                    ></el-switch>
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    label=""
                    prop="address"
                    :rules="[
                      {
                        required: true,
                        message: '必填',
                        trigger: 'blur',
                      },
                    ]"
                  >
                    <el-input v-model="form.address" type="textarea"></el-input>
                  </el-form-item>
                </td>
                <td>
                  <el-form-item label="" prop="cmodel">
                    <el-input v-model="form.cmodel"></el-input>
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    label=""
                    prop="trancom"
                    :rules="[
                      {
                        required: true,
                        message: '必填',
                        trigger: 'blur',
                      },
                    ]"
                  >
                    <el-input v-model="form.trancom"></el-input>
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    label=""
                    prop="fare "
                    :rules="[
                      {
                        type: 'number',
                        message: '数字',
                        trigger: 'blur',
                      },
                    ]"
                  >
                    <el-input v-model.number="form.fare"></el-input>
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    label=""
                    prop="pfee"
                    :rules="[
                      {
                        type: 'number',
                        message: '数字',
                        trigger: 'blur',
                      },
                    ]"
                  >
                    <el-input v-model.number="form.pfee"></el-input>
                  </el-form-item>
                </td>
              </tr>
            </table>
            <div class="return">
              退货明细
              <span
                v-if="form.rtn_number"
                class="clearAll"
                @click="returnListInit"
              >
                清空
              </span>
            </div>
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <th width="5%">序号</th>
                <th width="15%">货物名称</th>
                <th width="15%">规格</th>
                <!-- <th width="15%">备注</th> -->
                <th width="10%">批号</th>
                <th width="10%">数量</th>
                <th width="10%">重量</th>
                <th width="5%">单位</th>
                <th width="5%">操作</th>
                <!-- <th v-if="form.style == 2" width="10%">单价</th>
                <th v-if="form.style == 2" width="10%">金额</th> -->
              </tr>
              <tr v-for="(item, index) in form.returnGoodsList" :key="index">
                <td>{{ index + 1 }}</td>
                <td>
                  {{ item.itemname }}
                </td>
                <td>
                  {{ item.format }}
                </td>
                <!-- <td>
                  {{ item.remark }}
                </td> -->
                <td>
                  {{ item.batchnum }}
                </td>
                <td>{{ item.nums }}{{ item.boxes ? '箱' : '托' }}</td>
                <td>
                  <el-form-item
                    label=""
                    :prop="`returnGoodsList.${index}.weight`"
                    :rules="[
                      {
                        required: true,
                        message: '必填',
                        trigger: 'blur',
                      },
                    ]"
                  >
                    <el-input-number
                      v-model.number="item.weight"
                      :min="0"
                      :precision="3"
                    ></el-input-number>
                  </el-form-item>
                </td>
                <td>
                  {{ item.unit }}
                </td>
                <td>
                  <el-button type="danger" plain @click="itemDel(item)">
                    删除
                  </el-button>
                </td>
              </tr>
              <tr>
                <td colspan="8">
                  <div class="remark">
                    <span>备注：</span>
                    <div>{{ form.remark }}</div>
                  </div>
                </td>
              </tr>
            </table>
            <div class="foot" style="margin-top: 30px">
              <div>操作员：{{ $store.state.user.username }}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="baseInfo">
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
        <el-form-item label="托数" prop="nums">
          <el-input
            v-model.number="form.nums"
            :readonly="type == 'permit' ? true : false"
          ></el-input>
        </el-form-item>
      </div>
      <div v-if="type == 'tuihuo'" class="baseInfo returnInfo">
        <div class="tit">退货信息</div>
        <el-form-item label="托数" prop="nums">
          <el-input v-model.number="form.nums"></el-input>
        </el-form-item>
      </div> -->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="big" @click="close">取 消</el-button>
      <el-button
        type="primary"
        :loading="loading"
        size="big"
        @click="save('form')"
      >
        确 定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
  // import { doEdit } from '@/api/menuManagement'
  import { applyEdit, buscusIndex } from './api'
  // import { number } from 'echarts/lib/export'
  import dayjs from 'dayjs'
  export default {
    name: 'MenuManagementEdit',
    props: {
      tit: { type: String, default: '' },
      type: { type: String, default: '' },
      isEdit: { type: Boolean, default: false },
    },
    data() {
      return {
        loading: false,
        form: {
          company: '',
          // goodsList: [
          //   {
          //     // returnGoodsList: [],
          //     itemname: '',
          //     format: '',
          //     weight: '',
          //     price: '',
          //     amount: '',
          //     unit: '',
          //     nums: '',
          //     batchnum: '',
          //     remark: '',
          //   },
          // ],
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
          itemname: [{ required: true, trigger: 'blur', message: '必填' }],
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
    mounted() {},
    methods: {
      dayjs,
      showEdit(row) {
        this.loading = false
        if (!row) {
          this.title = '新增'
        } else {
          this.title = this.type == 'apply' ? '编辑' : '开具'
          // if (row.deliv) {
          //   row.goodsList = row.deliv
          // }
          // if (row.ret) {
          //   row.returnGoodsList = row.ret
          // }
          // this.form = row
        }
        this.form = Object.assign({}, row)
        this.dialogFormVisible = true
      },
      close() {
        this.$refs['form'].resetFields()
        this.form = this.$options.data().form
        this.dialogFormVisible = false
        this.loading = false
      },
      getCustomerList(queryString, cb) {
        buscusIndex({
          datatype: 1,
          filter: JSON.stringify({
            compy: queryString,
            type: 1,
          }),
          op: JSON.stringify({
            compy: 'LIKE',
          }),
        }).then((res) => {
          const list = []
          res.rows.forEach((item) => {
            list.push({
              value: item.compy,
              ...item,
            })
          })
          cb(list)
        })
      },
      handleSelect(val) {
        // console.log(val)
        this.form.shipaddress = val.shipaddress
      },
      save(type) {
        this.$refs[type].validate(async (valid) => {
          if (valid) {
            this.loading = true
            // this.$baseMessage(msg, 'success')
            // console.log(this.form)
            this.form.goodsList.map((item) => {
              item.amount = (item.price * item.weight).toFixed(2)
            })
            const data = {
              ...this.form,
              itemname: this.form.goodsList[0].itemname,
              nums: this.form.goodsList[0].nums,
              amount: this.form.goodsList[0].amount,
              weight: this.form.goodsList[0].weight,
              unit: this.form.goodsList[0].unit,
              format: this.form.goodsList[0].format,
            }
            this.$emit('confirm', data)
            // this.close()
          } else {
            return false
          }
        })
      },
      handleAdd(row) {
        this.form.goodsList.push({
          itemname: '',
          format: '',
          weight: 0,
          price: 0,
          amount: 0,
          unit: '',
          nums: 0,
          batchnum: '',
          boxes: 0,
        })
      },
      handleDel(row) {
        var index = this.form.goodsList.indexOf(row)
        if (index !== -1) {
          this.form.goodsList.splice(index, 1)
        }
        // console.log(row)
      },
      returnListInit() {
        this.form.goodsList.map((item) => {
          item.ret = false
        })
        this.form.returnGoodsList = []
      },
      returnGoods(row) {
        row.ret = true
        this.form.returnGoodsList.push(JSON.parse(JSON.stringify(row)))
      },
      itemDel(row) {
        var index = this.form.returnGoodsList.indexOf(row)
        if (index !== -1) {
          this.form.goodsList.map((item) => {
            if (item.id == row.id) {
              item.ret = 0
            }
          })
          this.form.returnGoodsList.splice(index, 1)
        }
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

  .vscode {
    .box {
      width: 100%;
      padding: 0 20px;
      margin: 0 10px;
      .head {
        display: flex;
        margin-bottom: 20px;
        justify-content: space-between;
        align-items: flex-end;
        position: relative;
        .num {
          // color: red;
        }

        .title {
          font-size: 22px;
          text-align: center;
          width: 80%;

          .sty {
            position: absolute;
            top: 0;
            right: 0;
            font-size: 12px;
          }
          .num {
            font-size: 14px;
            margin-top: 8px;
            position: relative;
            display: inline-block;
            border-top: 1px solid;
            padding: 8px 15px;
            // &::before {
            //   content: '';
            //   width: 200px;
            //   height: 1px;
            //   position: absolute;
            //   top: -5px;
            //   left: -20px;
            //   background: rgb(149, 149, 149);
            // }
          }
        }
        .date {
          text-align: right;
          width: 160px;
        }
      }
      .body {
        margin: 5px 0 20px 0;

        table {
          border: 3px solid rgb(32, 40, 253);
          width: 100%;
          th,
          td {
            text-align: center;
            padding: 5px;
            border-right: 1px solid rgb(32, 40, 253);
            border-bottom: 1px solid rgb(32, 40, 253);
            &:last-child {
              border-right: none;
            }
            .add {
              font-size: 26px;
              color: rgb(1, 5, 253);
            }
          }
          tr {
            &:last-child {
              td {
                border-bottom: none;
              }
            }
          }

          &.old {
            border: 3px solid rgb(178, 178, 178);
            th,
            td {
              border-right: 1px solid rgb(178, 178, 178);
              border-bottom: 1px solid rgb(178, 178, 178);
            }
          }
        }
        .return {
          font-size: 18px;
          text-align: center;
          margin: 20px 0 10px 0;
        }
      }
      .clearAll {
        float: right;
        font-size: 12px;
        cursor: pointer;
        color: #fff;
        padding: 5px 10px;
        background-color: red;
      }
      .foot {
        text-align: right;
      }
    }
    .el-form-item--small.el-form-item {
      margin-bottom: 0 !important;
    }
    .el-form-item.el-form-item--small {
      width: 100%;
    }
    .el-form-item--small {
      .el-form-item__content {
        width: 100% !important;
      }
    }
    .remark {
      text-align: left;
      vertical-align: top;
      padding: 5px;
      white-space: pre-wrap;
      display: flex;
      line-height: 26px;
      span {
        width: 50px;
      }
    }
  }
</style>
