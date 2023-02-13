<template>
  <div>
    <el-input
      v-if="attrConstraint.type == 1"
      :value="value"
      @input="emitModel"
    />
    <el-select
      v-else-if="attrConstraint.type == 2"
      :value="value"
      clearable
      placeholder="请选择"
      style="width: 100%"
      @change="emitModel"
    >
      <el-option
        v-for="option in attrConstraint.options"
        :key="option.value"
        :label="option.label"
        :value="option.value"
      />
    </el-select>
  </div>
</template>

<script>
  export default {
    name: 'AttrBox',
    props: {
      value: {
        type: [String, Number],
        required: true,
        default: ''
      },
      attrConstraint: {
        type: Object,
        default: function () {
          return {
            type: 1,
            rules: []
          }
        }
      }
    },
    methods: {
      emitModel(value) {
        this.$emit('input', value)
      }
    }
  }
</script>

<style lang="scss" scoped></style>
