module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/recommended', 'prettier'], // @vue/prettier
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/no-v-html': 'off',
    'vue/no-template-shadow': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    "vue/max-attributes-per-line": ["error", {
      "singleline": {
        "max": 5
      },
      "multiline": {
        "max": 5
      }
    }]
    // 'vue/script-indent': [2, 0, { 'baseIndent': 1 }],
    // 'indent': ['off', 2],
    // "space-before-function-paren": [0, "always"],
    // 'no-multiple-empty-lines': 0
    // 'indent': [2, 4, { SwitchCase: 1 }],
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },
    {
      files: ['*.vue'],
      rules: {
        indent: 'off',
      },
    },
  ],
}
