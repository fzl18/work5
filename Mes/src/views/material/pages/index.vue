<template>
  <div class="app-container">
    <bt-tablepager ref="tablepager" type="category" @operate="operate" />
    <bt-dialog ref="dbox" :title="title" width="580px">
      <vxe-form
        :data="form.fields"
        :items="form.items"
        size="small"
        title-colon
        title-overflow=" tooltip"
        title-align="right"
        class-name="detailForm"
        title-width="120"
        @submit="submit"
      />
    </bt-dialog>
  </div>
</template>
<script>
  import { detail, edit } from '../pageConfig'
  export default {
    name: 'Index',
    data() {
      return {
        title: '',
        form: {
          fields: {},
          items: [],
        },
      }
    },
    mounted() {},
    methods: {
      operate({ name, data }) {
        switch (name) {
          case 'view':
            this.title = this.$translateTitle('物料详情')
            this.form.fields = data
            this.form.items = detail.items
            break
          case 'edit':
            this.title = this.$translateTitle('物料信息设置')
            this.form.items = edit.items
            this.form.fields = data.$oldData
            break
          default:
            break
        }
        this.$refs.dbox.open()
      },
      submit({ data }) {
        edit
          .submit({
            materialCode: data.code,
            materialId: data.id,
            exemptCheck: data.exemptCheck,
            outExceed: data.outExceed,
            remark: data.remark,
          })
          .then(() => {
            this.$refs.tablepager.reload()
            this.$refs.dbox.close()
          })
      },
    },
  }
</script>

<style lang="scss" scoped></style>
