<template>
  <el-dropdown class="s-dropdown-onlyicon" placement="bottom" trigger="click">
    <span class="el-dropdown-link">
      <span class="s-span">
        <i class="el-icon-caret-bottom" />
      </span>
    </span>
    <el-dropdown-menu slot="dropdown" class="s-dropdown-menu">
      <template v-for="(item, index) in opList">
        <el-dropdown-item
          v-if="!item.disabled"
          :key="index"
          @click.native="
            handleClick(item.value, slotData.scope.$index, slotData.scope.row)
          "
        >
          <i
            :class="{
              'el-icon-plus': item.value == '添加标准',
              'el-icon-view': item.value == '查看' || item.value == '查看评价',
              'el-icon-edit': item.value == '编辑',
              'el-icon-delete': item.value == '删除',
              'el-icon-video-play': item.value == '启用',
              'el-icon-video-pause': item.value == '停用',
            }"
          />
          {{ translateTitle(item.value) }}
        </el-dropdown-item>
      </template>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
  import { translateTitle } from '../i18n'
  export default {
    props: {
      /* onlyRead: {
        type: Boolean,
        default: false,
      }, */
      slotData: {
        type: Object,
        required: true,
      },
      opList: {
        type: Array,
        required: true,
      },
    },
    data() {
      return {}
    },
    methods: {
      translateTitle,
      handleClick(type, index, row) {
        console.log(type, index, row)
        this.$emit('handleIconFn', { type, index, row })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .s-dropdown-onlyicon {
    .s-span {
      border-radius: 3px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      box-sizing: border-box;
      background: #307ec7;
      text-align: center;
      i {
        color: #fff;
      }
    }
  }
</style>
