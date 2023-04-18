<template>
  <div class="custom-table-container">
    <el-row :gutter="20" class="grid">
      <el-col :span="6">
        <section v-if="roles.includes('rway')" @click="linkto('list')">
          <div class="img">
            <remix-icon
              icon-class="inbox-archive-fill"
              style="font-size: 40px"
            ></remix-icon>
          </div>
          <span>入库单</span>
        </section>
      </el-col>
      <el-col :span="6">
        <section v-if="roles.includes('stats')" @click="linkto('count2')">
          <div class="img">
            <remix-icon
              icon-class="bar-chart-box-line"
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
        this.$router.push(`/imwarehouse/${type}`)
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
