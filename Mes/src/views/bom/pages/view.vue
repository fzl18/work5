<template>
  <bt-tablepager>
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
</template>
<script>
  import { getVersions } from '../api'
  export default {
    name: 'BOMView',
    data() {
      return {
        versionList: [],
      }
    },
    mounted() {},
    methods: {
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
