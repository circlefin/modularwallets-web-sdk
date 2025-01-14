module.exports = {
  overrides: [
    {
      files: '**/*.[jt]s?(x)',
      extends: ['eslint:recommended'],
      env: {
        node: true,
        browser: true,
        es2021: true,
      },
      rules: {
        // Require typesafe `===` and `!==` except when comparing against `null`
        // https://eslint.org/docs/latest/rules/eqeqeq
        eqeqeq: ['error', 'always', { null: 'ignore' }],
      },
    },
    {
      files: '**/*.[jt]s',
      env: {
        node: true,
        browser: false,
      },
      rules: {
        // Prevent the usage of console.* since we want to enforce the usage of `@circlefin/logger`
        // https://eslint.org/docs/latest/rules/no-console
        'no-console': 'error',
      },
    },
  ],
}
