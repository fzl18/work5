<template>
  <el-card class="box-card si-title" shadow="hover">
    <el-row slot="header" class="z-card-header">
      <el-row class="z-c-in">
        <el-col class="left">
          <i class="el-icon-document-copy" />
          <span>{{ translateTitle(title) }}</span>
        </el-col>
        <el-col class="right">
          <slot />
          <div v-if="showFilter" class="icon-sm" @click="clickIcon">
            <remix-icon
              icon-class="bt-filter"
              class="remix-icon"
              is-svg
            />
          </div>
        </el-col>
      </el-row>
    </el-row>
  </el-card>
</template>

<script>
  import { translateTitle } from '../i18n'
  export default {
    props: {
      title: {
        type: String,
        required: true,
      },
      showFilter: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {}
    },
    methods: {
      translateTitle,
      clickIcon() {
        this.$emit('handleIconClick')
      },
    },
  }
</script>

<style lang="scss" scoped></style>
