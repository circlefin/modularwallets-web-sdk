module.exports = {
  extends: ['prettier', 'plugin:prettier/recommended'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        trailingComma: 'all',
        semi: false,
        arrowParens: 'always',
        singleQuote: true,
        proseWrap: 'never',
      },
    ],
  },
}
