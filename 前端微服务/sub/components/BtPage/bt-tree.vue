<template>
  <div class="bt-tree__container">
    <el-tree
      ref="tree"
      v-bind="$attrs"
      icon-class="none"
      :indent="0"
      v-on="$listeners"
    ></el-tree>
  </div>
</template>
<script>
  export default {
    name: 'BtTree',
    props: {},
    methods: {
      filter() {
        return this.$refs.tree.filter()
      },
      updateKeyChildren() {
        return this.$refs.tree.updateKeyChildren()
      },
      getCheckedNodes() {
        return this.$refs.tree.getCheckedNodes()
      },
      setCheckedNodes() {
        return this.$refs.tree.setCheckedNodes()
      },
      setChecked() {
        return this.$refs.tree.setChecked()
      },
      setCheckedKeys() {
        return this.$refs.tree.setCheckedKeys()
      },
      getCheckedKeys() {
        return this.$refs.tree.getCheckedKeys()
      },
      getHalfCheckedNodes() {
        return this.$refs.tree.getHalfCheckedNodes()
      },
      getHalfCheckedKeys() {
        return this.$refs.tree.getHalfCheckedKeys()
      },
      getCurrentKey() {
        return this.$refs.tree.getCurrentKey()
      },
      getCurrentNode() {
        return this.$refs.tree.getCurrentNode()
      },
      setCurrentKey() {
        return this.$refs.tree.setCurrentKey()
      },
      setCurrentNode() {
        return this.$refs.tree.setCurrentNode()
      },
      getNode() {
        return this.$refs.tree.getNode()
      },
      remove() {
        return this.$refs.tree.remove()
      },
      append() {
        return this.$refs.tree.append()
      },
      insertBefore() {
        return this.$refs.tree.insertBefore()
      },
      insertAfter() {
        return this.$refs.tree.insertAfter()
      },
    },
  }
</script>
<style lang="scss" scoped>
  .bt-tree__container ::v-deep() {
    .el-tree > .el-tree-node:after {
      border-top: none;
    }
    .el-tree-node {
      position: relative;
      padding-left: 2px;
      &:focus > .el-tree-node__content {
        background: none;
      }
    }
    .el-tree-node__content {
      height: 32px;
      &:hover {
        background: none;
      }
    }
    .el-tree-node__expand-icon {
      background-color: $base-color-blue;
      border-radius: 7px;
      margin-right: 8px;
      padding: 7px;
    }

    .el-tree-node__children {
      padding-left: 38px;
    }

    .el-tree-node:before {
      content: '';
      left: 8px;
      position: absolute;
      right: auto;
      border-width: 1px;
    }

    .el-tree-node:before {
      border-left: 1px solid #adb7c0;
      bottom: 0px;
      height: 100%;
      top: 10px;
      width: 1px;
    }

    .el-tree-node:last-child:before {
      display: none;
    }

    .is-expanded:last-child:before {
      height: 38px;
      display: block;
    }

    .el-tree > .el-tree-node:nth-last-child(2):before {
      display: none;
    }

    .el-tree > .is-expanded:nth-last-child(2):before {
      height: 38px;
      display: block;
    }

    .el-tree-node:first-child:after {
      content: '';
      left: -32px;
      position: absolute;
      right: auto;
      border-width: 1px;
    }

    .el-tree-node:after {
      border-top: 1px solid #adb7c0;
      height: 20px;
      top: 15px;
      width: 34px;
    }
  }
</style>
