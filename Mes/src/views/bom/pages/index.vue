<template>
  <div class="app-container">
    <bt-tablepager ref="tablepager" type="category" @operate="operate">
      <template #formItem1="{ data }">
        <vxe-input v-model="data.code" @blur="blur"></vxe-input>
      </template>
      <template #formItem2="{ data }">
        <vxe-select v-model="data.version">
          <vxe-option
            v-for="num in versionList"
            :key="num"
            :value="num"
            :label="`${num}`"
          ></vxe-option>
        </vxe-select>
      </template>
    </bt-tablepager>
    <bt-dialog ref="dbox" :title="title" width="80%" @close="dboxClose">
      <vxe-form
        :data="form.fields"
        :items="form.items"
        size="small"
        title-colon
        title-overflow=" tooltip"
        title-align="right"
        class-name="detailForm"
        title-width="120"
      />
      <div class="subTabs">
        <bt-tablepager ref="subtablepager" type="single" :options="options">
          <template #headLeft>
            <vxe-radio-group v-model="selectTab" class="headButtton">
              <vxe-radio-button
                label="tab1"
                :content="$translateTitle('子项名细')"
              ></vxe-radio-button>
              <vxe-radio-button
                label="tab2"
                :disabled="!currentRow.haveChildStepUsage"
                :content="$translateTitle('阶梯用量')"
              ></vxe-radio-button>
            </vxe-radio-group>
          </template>
        </bt-tablepager>
      </div>
    </bt-dialog>
  </div>
</template>

<script>
  import { detailTab1, detailTab2, detailFormItem } from '../pageConfig'
  import { getVersions } from '../api'
  export default {
    name: 'BOMIndex',
    data() {
      return {
        title: '',
        form: {
          fields: {},
          items: [],
        },
        selectTab: '',
        options: {},
        currentRow: {},
        versionList: [],
      }
    },
    watch: {
      selectTab(val) {
        switch (val) {
          case 'tab1':
            this.options = detailTab1
            break
          case 'tab2':
            this.options = detailTab2
            break
          default:
            this.options = {}
            break
        }
      },
    },

    mounted() {},
    methods: {
      operate({ name, data, search }) {
        if (name == 'view') {
          this.title = this.$translateTitle('BOM详情')
          const searchParams = {
            code: data.bom.code,
            version: data.bom.version,
            haveLastBomVersion: true,
            unitUnionCode: search.fields.unitUnionCode,
          }
          this.currentRow = data
          this.selectTab = 'tab1'
          this.form.fields = data.bom
          this.form.items = detailFormItem
          detailTab1.search.fields = searchParams
          detailTab2.search.fields = searchParams
          this.$refs.dbox.open()
        }
      },
      dboxClose() {
        this.selectTab = ''
      },
      blur(val) {
        if (val.value) {
          getVersions({
            materialCode: val.value,
          }).then((res) => {
            this.versionList = res.objList
          })
        }
      },
    },
  }
</script>

<style lang="scss" scoped></style>
