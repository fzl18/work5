<template>
  <div class="app-container">
    <bt-tablepager ref="tablepager" @operate="operate">
      <template #mainColumnItem1="{ row }">
        <el-popover placement="bottom" width="650" trigger="click">
          <el-table
            v-if="list.length"
            :data="list"
            stripe
            fit
            border
            style="width: 99%"
          >
            <el-table-column
              prop="code"
              :label="$translateTitle('编码')"
              min-width="100"
            />
            <el-table-column
              prop="name"
              :label="$translateTitle('名称')"
              min-width="100"
            />
            <el-table-column
              prop="contactNumber"
              :label="$translateTitle('电话')"
              min-width="120"
            />
            <el-table-column
              prop="addr"
              :label="$translateTitle('地址')"
              min-width="200"
              show-overflow-tooltip
            />
          </el-table>
          <el-button
            slot="reference"
            icon="el-icon-search"
            type="text"
            circle=""
            @click="handleView(row.id)"
          >
            {{ $translateTitle('查看') }}
          </el-button>
        </el-popover>
      </template>
    </bt-tablepager>
    <bt-dialog ref="dbox" :title="title" width="1000px">
      <vxe-form
        :data="form.fields"
        :items="form.items"
        size="small"
        title-colon
        title-overflow=" tooltip"
        title-align="right"
        class-name="detailForm"
        title-width="120"
      >
        <template #contacts>
          <el-table
            v-if="list.length"
            :data="list"
            stripe
            fit
            border
            style="width: 100%"
          >
            <el-table-column
              prop="code"
              :label="$translateTitle('编码')"
              min-width="100"
            />
            <el-table-column
              prop="name"
              :label="$translateTitle('名称')"
              min-width="150"
            />
            <el-table-column
              prop="contactNumber"
              :label="$translateTitle('电话')"
              min-width="150"
            />
            <el-table-column
              prop="addr"
              :label="$translateTitle('地址')"
              min-width="200"
              show-overflow-tooltip
            />
          </el-table>
        </template>
      </vxe-form>
    </bt-dialog>
  </div>
</template>
<script>
  import { getContactList } from '../../purveyor/api'
  import { detail } from '../pageConfig'
  import { ObjFormat } from '@/views/dictionaryApi.js'
  export default {
    name: 'Custom',
    data() {
      return {
        title: '',
        form: {
          fields: {},
          items: [],
        },
        list: [],
      }
    },

    mounted() {},
    methods: {
      handleView(id) {
        this.list = []
        getContactList({
          currentPage: 1,
          pageSize: 999,
          relationType: 'customer',
          id,
        }).then((res) => {
          this.list = res.objList
        })
      },
      operate({ name, data }) {
        switch (name) {
          case 'view':
            this.title = this.$translateTitle('客户详情')
            getContactList({
              currentPage: 1,
              pageSize: 999,
              relationType: 'customer',
              id: data.id,
            }).then((res) => {
              data = ObjFormat(data)
              this.form.fields = data
              this.form.items = detail.items
              this.list = res.objList
            })
            break
          default:
            break
        }
        this.$refs.dbox.open()
      },
    },
  }
</script>

<style lang="scss" scoped></style>
