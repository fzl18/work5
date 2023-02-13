<template>
  <div class="app-container">
    <bt-page
      :title="$route.meta.title"
      subtitle="全部分类"
      icon-bg-color=""
      :show-drawer="false"
    >
      <template slot="option">
        <span v-if="showButton">
          <el-button size="medium" @click="cancalGroup">取消</el-button>
          <el-button type="primary" size="medium" @click="saveCategory">
            保存排序
          </el-button>
        </span>
        <span v-else>
          <el-button type="primary" size="medium" @click="editGroup">
            编辑分类
          </el-button>
        </span>
      </template>
      <div class="button">
        <el-button type="text" size="medium" @click="foldAll">
          全部折叠
        </el-button>
        <el-divider direction="vertical"></el-divider>
        <el-button type="text" size="medium" @click="openAll">
          全部展开
        </el-button>
      </div>

      <CategoryTree ref="CategoryTree" :show-button="showButton" />
    </bt-page>
  </div>
</template>

<script>
  import {} from '../api'
  import CategoryTree from '../components/CategoryTree.vue'
  let id = 5000
  export default {
    components: { CategoryTree },
    data() {
      return {
        showButton: false,
      }
    },

    mounted() {},
    methods: {
      cancalGroup() {
        this.showButton = false
        this.$refs.CategoryTree.cancalGroup()
      },
      saveCategory() {
        this.showButton = false
        this.$refs.CategoryTree.saveCategory()
      },

      editGroup() {
        this.showButton = true
        this.$refs.CategoryTree.editGroup()
      },
      foldAll() {
        this.$refs.CategoryTree.foldAll()
      },
      openAll() {
        this.$refs.CategoryTree.openAll()
      },
    },
  }
</script>

<style lang="scss" scoped>
  .button {
    position: absolute;
    right: 30px;
    top: 135px;
  }
</style>
