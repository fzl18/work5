<template>
  <div class="hello">hello,{{ name }}</div>
</template>
<script>
  export default {
    name: 'HelloWorld',
    props: {
      name: {
        type: String,
        default: '',
      },
    },
  }
</script>
<style lang="scss" scoped>
  .hello {
    width: 100px;
    height: 20px;
    line-height: 20px;
    font-size: 12px;
    color: #000;
    border: 1px solid #000;
  }
</style>
