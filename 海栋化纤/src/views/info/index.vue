<template>
  <div class="custom-table-container">
    <el-row :gutter="20" class="grid">
      <el-col v-if="roles.includes('rway')" :span="6">
        <section @click="linkto('customer')">
          <div class="img">
            <remix-icon
              icon-class="user-star-line"
              style="font-size: 40px"
            ></remix-icon>
          </div>
          <span>客户信息</span>
        </section>
      </el-col>
      <el-col v-if="roles.includes('out')" :span="6">
        <section @click="linkto('transit')">
          <div class="img">
            <remix-icon
              icon-class="truck-line"
              style="font-size: 40px"
            ></remix-icon>
          </div>
          <span>运输公司</span>
        </section>
      </el-col>
      <el-col :span="6">
        <section
          v-if="
            $store.state.user.userGroup == 8 || $store.state.user.userGroup == 4
          "
          @click="linkto('user')"
        >
          <div class="img">
            <remix-icon
              icon-class="user-line"
              style="font-size: 40px"
            ></remix-icon>
          </div>
          <span>用户管理</span>
        </section>
      </el-col>
      <!-- <el-col :span="6">
        <section v-if="roles.includes('cway')" @click="linkto('transit')">
          <div class="img">
            <remix-icon
              icon-class="group-line"
              style="font-size: 40px"
            ></remix-icon>
          </div>
          <span>供应商（暂无）</span>
        </section>
      </el-col>
      <el-col :span="6">
        <section v-if="roles.includes('cway')" @click="linkto('transit')">
          <div class="img">
            <remix-icon
              icon-class="suitcase-line"
              style="font-size: 40px"
            ></remix-icon>
          </div>
          <span>物品（暂无）</span>
        </section>
      </el-col> -->
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
      // console.log(this.$store.state.user)
    },
    methods: {
      init() {},
      linkto(type) {
        if (type == 'user') {
          this.$router.push(`/exwarehouse/${type}`)
        } else {
          this.$router.push(`/info/${type}`)
        }
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
