module.exports = {
  presets: [
    // '@vue/cli-plugin-babel/preset',
    '@vue/babel-preset-jsx',
  ],
  plugins: [
    [
      'import',
      { libraryName: 'ant-design-vue', libraryDirectory: 'es', style: 'css' },
    ],
  ],
  env: {
    development: {
      plugins: ['dynamic-import-node'],
    },
  },
}
