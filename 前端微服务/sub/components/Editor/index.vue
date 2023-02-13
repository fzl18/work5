<template>
  <div>
    <mavonEditor
      v-model="mavonValue"
      :subfield="false"
      :box-shadow="false"
      placeholder=" "
    ></mavonEditor>
  </div>
</template>

<script>
  import { mavonEditor } from 'mavon-editor'
  import 'mavon-editor/dist/css/index.css'
  export default {
    name: 'Editor',
    components: { mavonEditor },
    data() {
      return {
        mavonValue: '',
      }
    },
  }
</script>

<style lang="scss" scoped>
  ::v-deep() {
    .v-note-wrapper {
      z-index: 960;
    }
    textarea {
      font-size: 12px !important;
    }
  }
</style>
