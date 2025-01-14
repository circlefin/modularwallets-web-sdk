module.exports = {
  extends: [
    './rules/base',
    './rules/import',
    './rules/jest',
    './rules/jsdoc',
    './rules/json',
    './rules/prettier',
    './rules/promise',
    './rules/tsdoc',
    './rules/typescript',
  ].map(require.resolve),
  rules: {},
}
