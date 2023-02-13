<template>
  <div class="bt-section__container">
    <bt-title
      v-if="title"
      :title="title"
      :show-line="showLine"
      :size="size"
    />
    <div class="section_options">
      <div
        v-if="showDrawer"
        class="icon-sm search-btn"
        @click="handleOpenDrawer"
      >
        <remix-icon
          icon-class="bt-filter"
          class="remix-icon"
          is-svg
        />
      </div>
      <slot name="options" />
    </div>
    <slot />
    <el-drawer
      :visible.sync="drawerVisible"
      direction="rtl"
      :modal="false"
      custom-class="bt-drawer"
      :title="drawerTitle"
    >
      <div class="drawer-main">
        <slot name="drawer" />
      </div>
      <!-- <button
        class="drawer_close_btn ri-indent-increase"
        @click="closeDrawer"
      ></button> -->
    </el-drawer>
  </div>
</template>
<script>
  export default {
    name: 'BtSection',
    props: {
      title: {
        type: String,
        default: '',
      },

      showLine: {
        type: Boolean,
        default: true,
      },

      size: {
        type: String,
        default: 'small',
      },

      showDrawer: {
        type: Boolean,
        default: true,
      },

      drawerTitle: {
        type: String,
        default: '筛选条件',
      },
    },
    data() {
      return {
        drawerVisible: false,
      }
    },
    methods: {
      handleOpenDrawer() {
        this.drawerVisible = true
      },
      closeDrawer() {
        this.drawerVisible = false
      },
    },
  }
</script>
<style lang="scss" scoped>
  .bt-section__container {
    width: 100%;
    margin: 15px 0;
    padding: 15px;
    background-color: #fff;
    position: relative;
    min-height: 48px;
    .section_options {
      position: absolute;
      display: flex;
      align-items: center;
      right: 5px;
      top: 0;
      z-index: 10;
      & > * {
        margin: 10px;
      }
      .search-btn {
        cursor: pointer;
        font-size: 16px;
      }
      .icon-sm {
        width: 24px;
        height: 24px;
        background-color: $base-color-blue;
        color: #fff;
        font-size: 16px;
        border-radius: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        i {
          font-size: 16px;
        }
      }
    }
    .bt-drawer {
      position: relative;
      .drawer-main {
        padding: 28px;
      }
      .drawer_close_btn {
        position: fixed;
        width: 35px;
        height: 35px;
        background-color: $base-color-blue;
        font-size: 28px;
        color: #fff;
        border: none;
        display: flex;
        justify-content: center;
        border-radius: 5px;
        top: 100px;
        right: 280px;
        z-index: 9999;
        cursor: pointer;
      }
    }
  }
</style>
