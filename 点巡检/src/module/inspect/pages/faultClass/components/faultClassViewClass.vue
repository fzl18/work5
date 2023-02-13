<template>
  <div
    class="
      app-container
      baseManageSystem
      anchor_demo
      baseManageSystem
      detail-container
    "
  >
    <bt-page ref="btgs" title="故障代码" subtitle="故障代码基本信息">
      <template slot="option">
        <el-row>
          <el-button
            v-hasPermission="'DXJ-GZDM-edit'"
            type="primary"
            @click="edit()"
          >
            编辑故障代码
          </el-button>
        </el-row>
      </template>
      <div class="bt-page__body">
        <div class="basicInfo">
          <el-row :gutter="50">
            <el-col :span="6">
              <label for="">故障代码</label>
              <div class="value">
                {{
                  $store.state
                    .inspectFaultClassPageData
                    .clickTreeData.faultNo
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
                {{
                  $store.state
                    .inspectFaultClassPageData
                    .clickTreeData.label
                }}
              </div>
            </el-col>
            <el-col :span="6">
              <label for="">上级故障代码</label>
              <div class="value">
                {{
                  $store.state
                    .inspectFaultClassPageData
                    .clickTreeData.parentFaultName
                }}
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <!-- <div class="bt-page__body">
        <div class="bt-column__header">
          <div class="header">
            <div class="subtitle active">下级分类管理</div>
            <div class="handle-row">
              <el-button
                v-if="
                  $store.state
                    .inspectFaultClassPageData
                    .clickTreeData.nextKindType !== '1'
                "
                type="primary"
                @click="add()"
              >
                新增分类
              </el-button>
            </div>
          </div>
          <div class="line"></div>
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
              <el-table-column type="index" label="序号"></el-table-column>
              <el-table-column
                prop="faultNo"
                label="分类编码"
              ></el-table-column>
              <el-table-column
                prop="kindName"
                label="分类名称"
              ></el-table-column>
              <el-table-column prop="sort" label="展示顺序"></el-table-column>
              <el-table-column fixed="right" label="操作">
                <template #default="{ row }">
                  <bt-dropdown :show-split="false">
                    <bt-dropdown-menu>
                      <bt-dropdown-item @click.native="createType(row)">
                        <i class="el-icon-edit"></i>
                        编辑
                      </bt-dropdown-item>
                      <bt-dropdown-item @click.native="del(row)">
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
              @pagination="serach"
            ></bt-pagination>
          </div>
        </div>
      </div> -->
    </bt-page>
  </div>
</template>

<script>
  import './common.scss'
  import Api from '../../../api/faultClass'
  import { createNamespacedHelpers } from 'vuex'

  const { mapState, mapActions, mapMutations, mapGetters } =
    createNamespacedHelpers(
      'inspectFaultClassPageData'
    )

  export default {
    name: 'FaultClassViewClass',
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
        total: 50,
        list: [],
      }
    },
    computed: {
      isdata() {
        return this.$store.state
          .inspectFaultClassPageData.clickTreeData
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
        Api.getFaultInfoList({
          params: {
            current: this.search.page,
            size: this.search.pageSize,
          },
          data: {
            id: this.$store.state
              .inspectFaultClassPageData
              .clickTreeData.id,
          },
        }).then((res) => {
          this.list = res.data.records
          this.total = res.data.total
        })
      },
      ...mapMutations(['setIsComponent']),
      edit() {
        this.setIsComponent('FaultClassEdit')
      },
      add() {
        this.setIsComponent('FaultClassAdd')
      },
      createType(val) {
        this.$store.dispatch(
          'inspectFaultClassPageData/setupdataData',
          val
        )
        this.setIsComponent('FaultClassTableEdit')
      },
    },
  }
</script>

<style lang="scss" scoped></style>
