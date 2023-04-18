<template>
  <div class="custom-table-container">
    <el-row :gutter="20" class="grid">
      <el-col :span="6">
        <section
          v-if="userGroup == 12 || userGroup == 4 || userGroup == 8"
          @click="linkto('info')"
        >
          <div class="img">
            <remix-icon
              icon-class="bus-2-line"
              style="font-size: 40px"
            ></remix-icon>
          </div>
          <span>物流信息</span>
        </section>
      </el-col>
      <el-col :span="6">
        <section
          v-if="userGroup == 4 || userGroup == 8"
          @click="linkto('review')"
        >
          <div class="img">
            <remix-icon
              icon-class="search-eye-line"
              style="font-size: 40px"
            ></remix-icon>
          </div>
          <span>物流审核</span>
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
        userGroup: this.$store.state.user.userGroup,
      }
    },
    created() {
      this.init()
    },
    mounted() {
      // console.log(this.$store.state.user.userGroup)
    },
    methods: {
      init() {},
      linkto(type) {
        this.$router.push(`/logistics/${type}`)
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
