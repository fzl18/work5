<template>
  <div>
    <div class="search">
      <el-input v-model="filterText" placeholder="输入关键字进行过滤">
        >
      </el-input>
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
      @node-click="nodeClick"
    >
      <span slot-scope="{ node, data }" :class="['custom-tree-node']">
        <!-- <div v-show="showButton" class="move"></div> -->
        <span v-if="!data.isEdit">
          {{ data.label }}
        </span>
        <span v-else>
          <el-input v-model="data.label" size="mini"></el-input>
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
                  data.isEdit = false
                  lock = false
                }
              "
            >
              确认
            </el-button>
          </div>
          <div v-show="showButton && !data.isEdit">
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
              @click="() => append(data)"
            >
              <i class="el-icon-plus"></i>
              新增
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
          </div>
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script>
  let id = 1000
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
    },
    data() {
      return {
        filterText: '',
        list: [],
        defaultList: [],
        defaultCurrentNodeLabel: '',
        lock: false,
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
        const data = [
          {
            id: 1,
            label: '一级 1',
            children: [
              {
                id: 4,
                label: '二级 1-1',
                children: [
                  {
                    id: 9,
                    label: '三级 1-1-1',
                  },
                  {
                    id: 10,
                    label: '三级 1-1-2',
                  },
                ],
              },
            ],
          },
          {
            id: 2,
            label: '一级 2',
            children: [
              {
                id: 5,
                label: '二级 2-1',
              },
              {
                id: 6,
                label: '二级 2-2',
              },
            ],
          },
          {
            id: 3,
            label: '一级 3',
            children: [
              {
                id: 7,
                label: '二级 3-1',
              },
              {
                id: 8,
                label: '二级 3-2',
              },
            ],
          },
        ]
        this.defaultList = JSON.parse(JSON.stringify(data))
        this.loopChange(data)
        this.list = data
      },
      append(data) {
        console.log(data)
        this.lock = true
        this.defaultCurrentNodeLabel = ''
        const newChild = {
          id: id++,
          label: '新分类',
          isEdit: true,
          children: [],
        }
        if (!data.children) {
          this.$set(data, 'children', [])
        }
        data.children.push(newChild)
      },
      edit(data) {
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
              const parent = node.parent
              const children = parent.data.children || parent.data
              const index = children.findIndex((d) => d.id === data.id)
              children.splice(index, 1)
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
      nodeClick(data) {},
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
      },
      saveCategory() {
        console.log(this.list)
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
