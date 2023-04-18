<template>
  <div class="custom-table-container">
    <el-row :gutter="20" class="grid">
      <el-col :span="6">
        <section v-if="roles.includes('rway')" @click="linkto('applylist')">
          <div class="img">
            <remix-icon
              icon-class="file-text-line"
              style="font-size: 40px"
            ></remix-icon>
          </div>
          <span>添加送货申请单</span>
        </section>
      </el-col>
      <el-col :span="6">
        <section v-if="roles.includes('cway')" @click="linkto('review')">
          <div class="img">
            <remix-icon
              icon-class="auction-line"
              style="font-size: 40px"
            ></remix-icon>
          </div>
          <span>申请单审核</span>
        </section>
      </el-col>
      <el-col :span="6">
        <section v-if="roles.includes('out')" @click="linkto('delivery')">
          <div class="img">
            <remix-icon
              icon-class="pages-line"
              style="font-size: 40px"
            ></remix-icon>
          </div>
          <span>开具出库单</span>
        </section>
      </el-col>
      <el-col :span="6">
        <section v-if="roles.includes('go')" @click="linkto('permit')">
          <div class="img">
            <remix-icon
              icon-class="book-read-fill"
              style="font-size: 40px"
            ></remix-icon>
          </div>
          <span>开具出门证</span>
        </section>
      </el-col>
      <el-col :span="6">
        <section v-if="roles.includes('del')" @click="linkto('shipping')">
          <div class="img">
            <remix-icon
              icon-class="truck-line"
              style="font-size: 40px"
            ></remix-icon>
          </div>
          <span>开具送货单</span>
        </section>
      </el-col>
      <el-col :span="6">
        <section v-if="roles.includes('rtn')" @click="linkto('returnOrder')">
          <div class="img">
            <remix-icon
              icon-class="share-forward-box-line"
              style="font-size: 40px"
            ></remix-icon>
          </div>
          <span>退货申请单</span>
        </section>
      </el-col>
      <el-col :span="6">
        <section v-if="roles.includes('stats')" @click="linkto('count')">
          <div class="img">
            <remix-icon
              icon-class="table-2"
              style="font-size: 40px"
            ></remix-icon>
          </div>
          <span>统计查询</span>
        </section>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'Index',

    data() {
      return {
        roles: this.$store.state.user.roles,
      }
    },
    created() {
      this.init()
    },
    mounted() {
      // console.log(this.$store.state.user)
    },
    methods: {
      init() {},
      linkto(type) {
        this.$router.push(`/exwarehouse/${type}`)
      },
    },
  }
</script>
<style lang="scss" scoped>
  .grid {
    section {
      background: rgb(247, 253, 255);
      border-radius: 10px;
      padding: 20px;
      margin-bottom: 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      &:hover {
        box-shadow: 0 0 8px rgb(236, 236, 236);
      }
      .img {
        border-radius: 50%;
        width: 80px;
        height: 80px;
        line-height: 80px;
        text-align: center;
        background: rgb(55, 154, 224);
        margin-bottom: 20px;
        color: #fff;
      }
    }
  }
</style>
