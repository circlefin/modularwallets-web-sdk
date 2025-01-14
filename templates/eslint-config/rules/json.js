module.exports = {
  overrides: [
    {
      files: ['*.json', '*.json5', '*.jsonc'],
      parser: 'jsonc-eslint-parser',
    },
    {
      files: '*.json5',
      extends: ['plugin:jsonc/recommended-with-json5'],
      rules: {},
    },
    {
      files: ['*.jsonc', 'tsconfig?([-.]*).json'], // TSConfig parse it as jsonc
      extends: ['plugin:jsonc/recommended-with-jsonc'],
      rules: {},
    },
    {
      files: '*.json',
      extends: ['plugin:jsonc/recommended-with-json'],
      excludedFiles: ['tsconfig?([-.]*).json'],
      rules: {
        // enforce naming convention to property key names
        // https://ota-meshi.github.io/eslint-plugin-jsonc/rules/key-name-casing.html
        'jsonc/key-name-casing': [
          'error',
          {
            camelCase: true,
            SCREAMING_SNAKE_CASE: true,
          },
        ],
      },
    },
    {
      files: 'package.json',
      rules: {
        // Turn off enforce naming convention to property key names
        // https://ota-meshi.github.io/eslint-plugin-jsonc/rules/key-name-casing.html
        'jsonc/key-name-casing': 'off',
      },
    },
  ],
}
