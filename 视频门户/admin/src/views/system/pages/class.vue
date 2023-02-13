<template>
  <div class="app-container">
    <bt-page :title="$route.meta.title" subtitle="" :show-drawer="true">
      <template slot="option">
        <!-- <el-button
          type="primary"
          style="margin-left: 10px"
          @click="showButton = false"
        >
          批量删除
        </el-button> -->
        <el-button
          style="margin-left: 10px"
          type="primary"
          @click="
            showButton = false
            pushVideo()
          "
        >
          发布视频
        </el-button>
      </template>
      <template slot="drawer">
        <el-form
          ref="searchForm"
          :model="searchForm"
          label-position="top"
          size="mini"
        >
          <el-form-item label="名称" prop="name">
            <el-input v-model="searchForm.name" />
          </el-form-item>
          <el-form-item label="分类" prop="categoryNames">
            <el-select v-model="searchForm.categoryNames">
              <el-option
                v-for="item in categoryList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
                clearable
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布人" prop="publishName">
            <el-input v-model="searchForm.publishName"></el-input>
          </el-form-item>
          <el-form-item label="发布状态" prop="status">
            <el-select v-model="searchForm.status">
              <el-option
                v-for="item in [
                  { label: '草稿', value: '00' },
                  { label: '启用', value: '01' },
                  { label: '停用', value: '02' },
                ]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                clearable
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="发布日期">
            <el-date-picker
              v-model="searchForm.startTime"
              type="date"
              align="right"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
            ~
            <el-date-picker
              v-model="searchForm.endTime"
              type="date"
              align="right"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>

          <el-button class="bt-search_btn" type="primary" @click="handleSearch">
            查询
          </el-button>
          <el-button
            class="bt-search_btn clear"
            type="success"
            @click="resetForm('searchForm')"
          >
            重置
          </el-button>
        </el-form>
      </template>
      <el-tabs v-model="activeName" @tab-click="handleTab">
        <el-tab-pane :label="`视频`" name="0"></el-tab-pane>
        <el-tab-pane :label="`系列`" name="1"></el-tab-pane>
      </el-tabs>
      <el-table
        :data="list"
        stripe
        fit
        highlight-current-row
        style="width: 100%"
      >
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
        <el-table-column prop="userName" label="封面" width="120">
          <template #default="{ row }">
            <img :src="row.cover" alt="" width="100%" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" width="160" />
        <el-table-column prop="categoryNames" label="分类" />
        <el-table-column prop="likeCount" label="点赞数" />
        <el-table-column prop="playCount" label="播放数" />
        <el-table-column prop="favoriteCount" label="收藏数" />
        <el-table-column prop="status" label="发布状态">
          <template #default="{ row }">
            <el-tag v-if="row.status == '00'">草稿</el-tag>
            <el-tag v-if="row.status == '01'" type="success">启用</el-tag>
            <el-tag v-if="row.status == '02'" type="info">停用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="publishName" label="发布人" />
        <el-table-column prop="publishTime" label="发布时间" />
        <el-table-column fixed="right" label="操作" width="60">
          <template #default="{ row }">
            <bt-dropdown :show-split="false">
              <bt-dropdown-menu>
                <bt-dropdown-item
                  v-if="row.status == '00' || row.status == '02'"
                  @click="handleOnLoad(row)"
                >
                  <i class="el-icon-position"></i>
                  发布
                </bt-dropdown-item>
                <bt-dropdown-item
                  v-if="row.status == '01'"
                  @click="handleOffLoad(row)"
                >
                  <i class="el-icon-download"></i>
                  下架
                </bt-dropdown-item>
                <bt-dropdown-item @click="handleEdit(row)">
                  <i class="el-icon-edit"></i>
                  修改
                </bt-dropdown-item>
                <bt-dropdown-item @click="handleDel(row)">
                  <i class="el-icon-delete"></i>
                  删除
                </bt-dropdown-item>
              </bt-dropdown-menu>
            </bt-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <bt-pagination
        :total="total"
        :page.sync="search.page"
        :limit.sync="search.pageSize"
        show-page-sizes
        @pageSizeChange="pageSizeChange"
        @pagination="getList"
      ></bt-pagination>
    </bt-page>
  </div>
</template>

<script>
  import { getVideoList, delVideo, putVideo, getVideoCategory } from '../api'
  import dayjs from 'dayjs'
  export default {
    data() {
      return {
        activeName: '0',
        searchForm: {
          startTime: null,
          endTime: null,
          name: null,
          publishName: null,
          categoryNames: null,
        },
        search: {
          page: 1,
          pageSize: 10,
        },
        total: 10,
        categoryList: [],
        list: [],
        disabled: false,
      }
    },
    created() {
      this.getList()
      getVideoCategory({ size: 999 }).then((res) => {
        this.categoryList = res.records
      })
    },
    mounted() {},
    methods: {
      pushVideo() {
        this.$router.push('pushVideo')
      },

      initSearchParams() {
        this.searchForm.startTime = null
        this.searchForm.endTime = null
      },
      handleSearch() {
        this.getList()
      },
      getList() {
        getVideoList({
          type: this.activeName,
          ...this.searchForm,
          endTime: this.searchForm.endTime
            ? `${this.searchForm.endTime} 23:59:59`
            : null,
          current: this.search.page,
          size: this.search.pageSize,
        }).then((res) => {
          this.list = res.records
          this.total = res.total
          this.search.page = res.current
          this.search.pageSize = res.size
        })
      },
      pageSizeChange(page) {
        this.search.page = page.page
        this.search.pageSize = page.limit
        this.getList()
      },
      handleOnLoad(data) {
        putVideo({ id: data.id, status: '01' }).then((res) => {
          if (res) {
            this.$baseMessage('操作成功！', 'success')
            this.getList()
          }
        })
      },
      handleOffLoad(data) {
        putVideo({ id: data.id, status: '02' }).then((res) => {
          if (res) {
            this.$baseMessage('操作成功！', 'success')
            this.getList()
          }
        })
      },
      handleDel(data) {
        this.$confirm('确定要删除此视频吗？', {
          type: '',
          title: '提示',
          customClass: 'category',
          callback: (action) => {
            console.log(action)
            if (action == 'confirm') {
              delVideo({ idList: data.id }).then((res) => {
                if (res) {
                  this.$baseMessage('操作成功！', 'success')
                  this.getList()
                }
              })
            }
          },
        })
      },
      handleEdit(data) {
        this.$router.push(`/system/pushVideo?id=${data.id}`)
      },
      handleTab(tab) {
        // this.resetForm('searchForm')
        this.search.page = 1
        this.initSearchParams()
        this.getList()
      },
      indexMethod(index) {
        return (this.search.page - 1) * this.search.pageSize + (index + 1)
      },
      // submitForm() {
      //   this.$refs['ruleForm'].validate(async (valid) => {
      //     if (valid) {
      //       getWorkflowSavecheck({
      //         ...this.ruleForm,
      //         suggestionId: this.analysisInfo.id,
      //         userId: this.analysisInfo.userId,
      //       }).then((res) => {
      //         if (res) {
      //           this.analysisResultShow = false
      //           this.getList()
      //           this.$baseMessage('操作成功', 'success')
      //           this.resetForm('ruleForm')
      //         }
      //       })
      //     }
      //   })
      // },
      resetForm(type) {
        this.$refs[type].resetFields()
        if (type == 'searchForm') {
          this.initSearchParams()
        }
      },
      handleRemove(file) {
        this.dialogImageUrl = ''
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      delVideo(id) {
        this.$prompt('确定要删除此视频吗？', {})
      },
      batchDelVideo(ids) {},
    },
  }
</script>

<style lang="scss" scoped>
  .bt-search_btn {
    &.clear {
      margin: 0 !important;
    }
    &::before {
      background: none !important;
    }
  }
  .content {
    width: 90%;
    display: inline-block;
  }
</style>
