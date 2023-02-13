<template>
  <div
    class="app-container baseManageSystem anchor_demo baseManageSystem detail-container"
  >
    <bt-page ref="btgs" title="故障代码" subtitle="故障代码基本信息">
      <template slot="option">
        <el-row>
          <el-button
            v-if="
              $store.state.inspectFaultClassPageData.clickTreeData &&
                $store.state.inspectFaultClassPageData.clickTreeData.id
            "
            v-hasPermission="'DXJ-GZDM-edit'"
            type="primary"
            @click="edit()"
          >
            编辑故障代码
          </el-button>
        </el-row>
      </template>
      <div
        v-if="
          $store.state.inspectFaultClassPageData.clickTreeData &&
            $store.state.inspectFaultClassPageData.clickTreeData.id
        "
        class="bt-page__body"
      >
        <div class="basicInfo">
          <el-row :gutter="50">
            <el-col :span="6">
              <label for="">故障代码</label>
              <div class="value">
                {{
                  $store.state.inspectFaultClassPageData.clickTreeData.faultNo
                }}
              </div>
              <!-- <diversityPurposeItem
                    :value="
                      $store.state
                        .inspectFaultClassPageData
                        .clickTreeData.faultNo
                    "
                    label="分类编码"
                  /> -->
            </el-col>
            <el-col :span="6">
              <label for="">故障代码名称</label>
              <div class="value">
                {{ $store.state.inspectFaultClassPageData.clickTreeData.label }}
              </div>
            </el-col>
            <el-col :span="6">
              <label for="">上级故障代码</label>
              <div class="value">
                {{
                  $store.state.inspectFaultClassPageData.clickTreeData
                    .parentFaultName
                }}
              </div>
            </el-col>

            <el-col :span="6">
              <label for="">故障原因</label>
              <div class="value">
                {{
                  $store.state.inspectFaultClassPageData.clickTreeData.reason
                }}
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="50">
            <el-col :span="6">
              <label for="">解决方法</label>
              <div class="value">
                {{
                  $store.state.inspectFaultClassPageData.clickTreeData.resolvent
                }}
              </div>
            </el-col>
            <el-col :span="6">
              <label for="">所需工种</label>
              <div class="value">
                {{
                  $store.state.inspectFaultClassPageData.clickTreeData
                    .repairWorkerTypeName
                }}
              </div>
            </el-col>
            <el-col :span="6">
              <label for="">工种等级</label>
              <div class="value">
                {{
                  $store.state.inspectFaultClassPageData.clickTreeData
                    .repairJobGradeName
                }}
              </div>
            </el-col>
            <el-col :span="6">
              <label for="">所需工具</label>
              <div class="value">
                {{
                  $store.state.inspectFaultClassPageData.clickTreeData
                    .repairToolName
                }}
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="50">
            <el-col :span="6">
              <label for="">文档</label>
              <div class="value">
                <img
                  v-if="
                    $store.state.inspectFaultClassPageData.clickTreeData
                      .fileType === 'img'
                  "
                  :src="
                    $store.state.inspectFaultClassPageData.clickTreeData
                      .resolventFile.indexOf('http') >= 0 ? $store.state.inspectFaultClassPageData.clickTreeData
                      .resolventFile : $store.state.inspectFaultClassPageData.clickTreeData
                      .resolventFileAll
                  "
                  width="40"
                  height="40"
                  class="head_pic"
                  @click="
                    viewFiles(
                      $store.state.inspectFaultClassPageData.clickTreeData
                        .resolventFile.indexOf('http') >= 0 ? $store.state.inspectFaultClassPageData.clickTreeData
                        .resolventFile : $store.state.inspectFaultClassPageData.clickTreeData
                        .resolventFileAll
                    )
                  "
                >
                <video
                  v-if="
                    $store.state.inspectFaultClassPageData.clickTreeData
                      .fileType === 'video'
                  "
                  :src="
                    $store.state.inspectFaultClassPageData.clickTreeData
                      .resolventFile.indexOf('http') >= 0 ? $store.state.inspectFaultClassPageData.clickTreeData
                      .resolventFile : $store.state.inspectFaultClassPageData.clickTreeData
                      .resolventFileAll
                  "
                  width="40"
                  height="40"
                  controls="controls"
                >
                  您的浏览器不支持视频播放
                </video>
                <img
                  v-if="
                    $store.state.inspectFaultClassPageData.clickTreeData
                      .fileType === 'pdf' &&
                      $store.state.inspectFaultClassPageData.clickTreeData
                        .resolventFile
                  "
                  src="@/assets/images/inspect/file_pdf.png"
                  title="点击下载pdf"
                  width="40"
                  height="40"
                  class="head_pic"
                  @click="
                    downFiles(
                      $store.state.inspectFaultClassPageData.clickTreeData
                        .resolventFile.indexOf('http') >= 0 ? $store.state.inspectFaultClassPageData.clickTreeData
                        .resolventFile : $store.state.inspectFaultClassPageData.clickTreeData
                        .resolventFileAll
                    )
                  "
                >
                <img
                  v-if="
                    $store.state.inspectFaultClassPageData.clickTreeData
                      .fileType === 'word' &&
                      $store.state.inspectFaultClassPageData.clickTreeData
                        .resolventFile
                  "
                  src="@/assets/images/inspect/file_word.png"
                  title="点击下载word"
                  width="40"
                  height="40"
                  class="head_pic"
                  @click="
                    downFiles(
                      $store.state.inspectFaultClassPageData.clickTreeData
                        .resolventFile.indexOf('http') >= 0 ? $store.state.inspectFaultClassPageData.clickTreeData
                        .resolventFile : $store.state.inspectFaultClassPageData.clickTreeData
                        .resolventFileAll
                    )
                  "
                >
              </div>
            </el-col>
            <el-col :span="6">
              <label for="">排序</label>
              <div class="value" style="height: 60px; padding-top: 15px">
                {{ $store.state.inspectFaultClassPageData.clickTreeData.sort }}
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="bt-page__body">
        <div class="bt-column__header">
          <div class="header">
            <div class="subtitle active">下级故障代码管理</div>
            <div class="handle-row">
              <el-button
                v-hasPermission="'DXJ-GZDM-add'"
                type="primary"
                @click="add()"
              >
                新增故障代码
              </el-button>
            </div>
          </div>
          <div class="line" />
        </div>
        <div class="bt-column__body" style="padding-top: 10px">
          <div class="el-box">
            <el-table
              :data="list"
              stripe
              fit
              highlight-current-row
              style="width: 100%"
            >
              <el-table-column
                type="index"
                label="序号"
                :index="Numshow"
              />
              <!--<el-table-column prop="id" label="故障代码ID"></el-table-column>-->
              <el-table-column
                prop="faultNo"
                label="故障代码"
              />
              <el-table-column
                prop="faultName"
                label="代码名称"
              />
              <el-table-column prop="reason" label="故障原因" />
              <el-table-column
                prop="resolvent"
                label="解决方法"
              />
              <el-table-column prop="resolventFile" label="文档">
                <template slot-scope="scope">
                  <img
                    v-if="scope.row.fileType === 'img'"
                    :src="scope.row.resolventFile.indexOf('http') >= 0 ? scope.row.resolventFile : scope.row.resolventFileAll"
                    width="40"
                    height="40"
                    class="head_pic"
                    @click="
                      viewFiles(scope.row.resolventFile.indexOf('http') >= 0 ? scope.row.resolventFile : scope.row.resolventFileAll)
                    "
                  >
                  <video
                    v-if="scope.row.fileType === 'video'"
                    :src="scope.row.resolventFile.indexOf('http') >= 0 ? scope.row.resolventFile : scope.row.resolventFileAll"
                    width="40"
                    height="40"
                    controls="controls"
                  >
                    您的浏览器不支持视频播放
                  </video>
                  <img
                    v-if="
                      scope.row.fileType === 'pdf' && scope.row.resolventFile
                    "
                    src="@/assets/images/inspect/file_pdf.png"
                    title="点击下载pdf"
                    width="40"
                    height="40"
                    class="head_pic"
                    @click="downFiles(scope.row.resolventFile.indexOf('http') >= 0 ? scope.row.resolventFile : scope.row.resolventFileAll)"
                  >
                  <img
                    v-if="
                      scope.row.fileType === 'word' && scope.row.resolventFile
                    "
                    src="@/assets/images/inspect/file_word.png"
                    title="点击下载word"
                    width="40"
                    height="40"
                    class="head_pic"
                    @click="downFiles(scope.row.resolventFile.indexOf('http') >= 0 ? scope.row.resolventFile : scope.row.resolventFileAll)"
                  >
                </template>
              </el-table-column>
              <el-table-column
                prop="repairWorkerTypeName"
                label="所需工种"
              />
              <el-table-column
                prop="repairJobGradeName"
                label="工种等级"
              />
              <el-table-column
                prop="repairToolName"
                label="所需工具"
              />
              <el-table-column prop="sort" label="展示顺序" />
              <el-table-column fixed="right" label="操作" width="75">
                <template #default="{ row }">
                  <bt-dropdown :show-split="false">
                    <bt-dropdown-menu>
                      <bt-dropdown-item
                        v-hasPermission="'DXJ-GZDM-edit'"
                        @click.native="createType(row)"
                      >
                        <i class="el-icon-edit" />
                        编辑
                      </bt-dropdown-item>
                      <bt-dropdown-item
                        v-hasPermission="'DXJ-GZDM-delete'"
                        @click.native="del(row)"
                      >
                        <i class="el-icon-delete" />
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
              @pagination="serach"
            />
          </div>
        </div>
      </div>
    </bt-page>

    <el-dialog center :visible.sync="dialogVisible" width="50%">
      <bt-title title="预览" />
      <img :src="codeImg" style="width: 100%; height: 100%">
    </el-dialog>
  </div>
</template>

<script>
  import './common.scss'
  import Api from '../../../api/faultClass'
  import { createNamespacedHelpers } from 'vuex'

  const { mapState, mapActions, mapMutations, mapGetters } =
    createNamespacedHelpers('inspectFaultClassPageData')

  export default {
    name: 'FaultClass',
    data() {
      return {
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: '',
        },
        activeName: 'first',
        search: {
          page: 1,
          pageSize: 10,
        },
        total: 0,
        list: [],
        codeImg: '',
        dialogVisible: false,
      }
    },
    computed: {
      isdata() {
        return this.$store.state.inspectFaultClassPageData.clickTreeData
      },
      // 序列号递增
      Numshow() {
        return (this.search.page - 1) * this.search.pageSize + 1
      },
    },
    watch: {
      isdata(val) {
        this.serach()
      },
    },
    mounted() {
      this.serach()
    },
    methods: {
      getList() {},
      del(val) {
        const params = {
          id: val.id,
        }
        this.$confirm('确定本次操作吗?执行后将不可撤销', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true,
        })
          .then(() => {
            Api.deleteFault({ params: params }).then((res) => {
              if (res.success === 1) {
                this.search.page = 1
                this.search.pageSize = 10
                this.serach()
                this.$emit('getTree')
                this.$msg({
                  type: 'success',
                  message: '删除成功',
                })
              } else {
                this.$msg({
                  type: 'error',
                  message: `${res.errorMsg}`,
                })
              }
            })
          })
          .catch(() => {
            this.$msg({
              type: 'warning',
              message: '取消了删除',
            })
          })
      },

      serach() {
        let data = {}
        let id = this.$store.state.inspectFaultClassPageData.clickTreeData
        if (!!id) {
          data = {
            id: this.$store.state.inspectFaultClassPageData.clickTreeData.id,
          }
        } else {
          data = {
            id: '',
          }
        }
        Api.getFaultInfoList({
          params: {
            current: this.search.page,
            size: this.search.pageSize,
          },
          data,
          // data: {
          //   id: this.$store.state
          //     .inspectFaultClassPageData
          //     .clickTreeData.id,
          // },
        }).then((res) => {
          if (res.success === 1) {
            this.list = res.data.result
            this.total = res.data.total
          }
        })
      },
      ...mapMutations(['setIsComponent']),
      edit() {
        this.setIsComponent('FaultClassEdit')
      },
      add() {
        this.setIsComponent('FaultClassAdd')
      },
      downFiles(url) {
        window.open(url)
      },
      viewFiles(url) {
        this.codeImg = url
        this.dialogVisible = true
      },
      createType(val) {
        this.$store.dispatch('inspectFaultClassPageData/setupdataData', val)
        this.setIsComponent('FaultClassTableEdit')
      },
    },
  }
</script>

<style lang="scss" scoped>
  .app-container {
    .avatar {
      width: 25px;
      height: 25px;
      display: block;
    }
  }
</style>
