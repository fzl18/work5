<template>
  <div>
    <div class="search">
      <el-input
        v-model="filterText"
        placeholder="输入关键字进行过滤"
      ></el-input>
    </div>

    <el-tree
      ref="tree"
      :data="list"
      node-key="id"
      default-expand-all
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
      :draggable="showButton"
      icon-class="tree-icon"
      :show-checkbox="select && !showButton"
      :allow-drop="dropNode"
      check-strictly
      :default-checked-keys="checkedKeys"
      @node-click="nodeClick"
    >
      <span slot-scope="{ node, data }" :class="['custom-tree-node']">
        <!-- <div v-show="showButton" class="move"></div> -->
        <span v-if="!data.isEdit">
          {{ data.label }}
        </span>
        <span v-else>
          <el-input
            v-model="data.label"
            size="mini"
            placeholder="请输入分类名称"
          ></el-input>
        </span>
        <span class="tree-button">
          <div v-if="data.isEdit">
            <el-button
              type="text"
              size="mini"
              @click="() => cancal(node, data)"
            >
              取消
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="
                () => {
                  confirm(data)
                }
              "
            >
              确认
            </el-button>
          </div>
          <div v-show="showButton && !data.isEdit">
            <template v-if="data.id !== 'root'">
              <el-button
                type="text"
                size="mini"
                style="cursor: move"
                :disabled="lock"
              >
                <i class="el-icon-rank"></i>
                拖动排序
              </el-button>
              <el-button
                type="text"
                size="mini"
                :disabled="lock"
                @click="() => edit(data)"
              >
                <i class="el-icon-edit"></i>
                修改
              </el-button>
              <el-button
                type="text"
                size="mini"
                :disabled="lock"
                @click="() => remove(node, data)"
              >
                <i class="el-icon-delete"></i>
                删除
              </el-button>
            </template>
            <el-button
              v-if="node.level <= maxLevel"
              type="text"
              size="mini"
              :disabled="lock"
              @click="() => append(data, node)"
            >
              <i class="el-icon-plus"></i>
              新增
            </el-button>
          </div>
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script>
  let id = 1000
  import {
    getVideoCategory,
    postVideoCategory,
    putVideoCategory,
    delVideoCategory,
    sortVideoCategory,
  } from '@/views/system/api'
  export default {
    name: 'CategoryTree',
    props: {
      showButton: {
        type: Boolean,
        default: false,
      },
      select: {
        type: Boolean,
        default: false,
      },
      checkedKeys: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        filterText: '',
        list: [],
        defaultList: [],
        defaultCurrentNodeLabel: '',
        type: null,
        lock: false,
        maxLevel: 2,
        parentId: 0,
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val)
      },
    },
    created() {
      this.getList()
    },
    mounted() {},
    methods: {
      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      handleSearch() {
        this.getList()
      },
      getList() {
        getVideoCategory().then((res) => {
          let data = []
          let arr = []
          if (res.records.length) {
            res.records.map((item) => {
              if (item.parentId) {
                arr.forEach((val) => {
                  if (item.parentId == val.id) {
                    val.children.push({
                      id: item.id,
                      label: item.name,
                      children: [],
                    })
                  }
                })
              } else {
                arr.push({
                  id: item.id,
                  label: item.name,
                  children: [],
                })
              }
            })

            data = arr
            this.defaultList = JSON.parse(JSON.stringify(data))
            this.loopChange(data)
          }
          this.list = [{ id: 'root', label: 'root', children: data }]
        })
      },
      append(data, node) {
        this.parentId = (data.id == 'root' ? 0 : data.id) || 0
        this.lock = true
        this.type = 'add'
        this.defaultCurrentNodeLabel = ''
        const newChild = {
          id: id++,
          label: '',
          isEdit: true,
          children: [],
        }
        if (!data.children) {
          this.$set(data, 'children', [])
        }
        data.children.push(newChild)
      },
      edit(data) {
        console.log(data)
        this.lock = true
        this.type = 'edit'
        this.defaultCurrentNodeLabel = data.label
        data.isEdit = true
      },
      confirm(data) {
        if (this.type == 'add') {
          if (!data.label) {
            this.$baseMessage('分类名称不能为空', 'error')
          } else {
            postVideoCategory({
              name: data.label,
              parentId: this.parentId,
              sort: 0,
            }).then((res) => {
              if (res) {
                this.getList()
                data.isEdit = false
                this.lock = false
              }
            })
          }
        } else if (this.type == 'edit') {
          putVideoCategory({
            id: data.id,
            name: data.label,
          }).then((res) => {
            data.isEdit = false
            this.lock = false
          })
        }
      },

      add(node, data) {
        this.lock = true
        this.defaultCurrentNodeLabel = data.label
        data.isEdit = true
      },
      cancal(node, data) {
        data.label = this.defaultCurrentNodeLabel
        data.isEdit = false
        if (!this.defaultCurrentNodeLabel) {
          const parent = node.parent
          const children = parent.data.children || parent.data
          const index = children.findIndex((d) => d.id === data.id)
          children.splice(index, 1)
        }
        this.lock = false
      },

      remove(node, data) {
        this.$confirm('确定要删除此分类吗？', {
          type: '',
          title: '提示',
          customClass: 'category',
          callback: (action) => {
            console.log(action)
            if (action == 'confirm') {
              delVideoCategory({ idList: data.id }).then((res) => {
                if (res) {
                  const parent = node.parent
                  const children = parent.data.children || parent.data
                  const index = children.findIndex((d) => d.id === data.id)
                  children.splice(index, 1)
                }
              })
            }
          },
        })
      },
      loopChange(data) {
        data.forEach((item) => {
          item.isEdit = false
          if (item.children && item.children.length) {
            this.loopChange(item.children)
          }
        })
      },
      loopSort(data) {
        data.forEach((item, index) => {
          item.sort = index
          if (item.children && item.children.length) {
            this.loopSort(item.children)
          }
        })
      },
      nodeClick(data) {},
      dropNode(draggingNode, dropNode, type) {
        let pass = draggingNode.level === dropNode.level && type !== 'inner'
        return pass
      },
      foldAll() {
        let nodes = this.$refs.tree.store._getAllNodes()
        nodes.forEach((item) => {
          item.expanded = false
        })
      },
      openAll() {
        let nodes = this.$refs.tree.store._getAllNodes()
        nodes.forEach((item) => {
          item.expanded = true
        })
      },
      editGroup() {
        this.defaultList = JSON.parse(JSON.stringify(this.list))
      },
      cancalGroup() {
        this.list = this.defaultList
        this.lock = false
      },
      saveCategory() {
        const sortList = []
        this.loopSort(this.list)
        this.list[0].children.map((item) => {
          sortList.push({
            id: item.id,
            sort: item.sort,
          })
          if (item.children.length) {
            item.children.map((item) => {
              sortList.push({
                id: item.id,
                sort: item.sort,
              })
            })
          }
        })
        sortVideoCategory(sortList).then((res) => {
          console.log(res)
        })
      },
      getCheckedNodes() {
        return this.$refs.tree.getCheckedNodes()
      },
      getCheckedKeys(param) {
        return this.$refs.tree.getCheckedKeys(param)
      },
    },
  }
</script>

<style lang="scss" scoped>
  .search {
    max-width: 60%;
    margin-bottom: 20px;
  }

  .custom-tree-node {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    .move {
      position: absolute;
      left: 0;
      width: 10px;
      height: 10px;
      background: #000;
      cursor: move;
    }
  }
</style>
