module.exports = {
  overrides: [
    {
      files: '**/*.ts?(x)',
      plugins: ['eslint-plugin-tsdoc'],
      rules: {
        // Ensures that parameter names in JSDoc are matched by corresponding items in the function declaration.
        // https://github.com/gajus/eslint-plugin-jsdoc/blob/master/.README/rules/check-param-names.md
        'jsdoc/check-param-names': [
          'error',
          {
            checkDestructured: false,
          },
        ],

        // Reports invalid block tag names.
        // https://github.com/gajus/eslint-plugin-jsdoc/blob/master/.README/rules/check-tag-names.md
        'jsdoc/check-tag-names': 'off', // TSDoc will check that for us.

        // This rule reports types being used on @param or @returns.
        // https://github.com/gajus/eslint-plugin-jsdoc/blob/master/.README/rules/no-types.md
        'jsdoc/no-types': 'error',

        // TSDoc automatically identifies the parameters. We should only use them when they need a description.
        // https://github.com/gajus/eslint-plugin-jsdoc/blob/master/.README/rules/require-param.md
        'jsdoc/require-param': 'off',

        // The indication of types would be redundant.
        // https://github.com/gajus/eslint-plugin-jsdoc/blob/master/.README/rules/require-param-type.md
        'jsdoc/require-param-type': 'off',

        // The indication of types would be redundant.
        // https://github.com/gajus/eslint-plugin-jsdoc/blob/master/.README/rules/require-property-type.md
        'jsdoc/require-property-type': 'off',

        // Without a description, the return tag is useless in TypeScript.
        // https://github.com/gajus/eslint-plugin-jsdoc/blob/master/.README/rules/require-returns.md
        'jsdoc/require-returns': 'off',

        // The indication of types would be redundant.
        // https://github.com/gajus/eslint-plugin-jsdoc/blob/master/.README/rules/require-returns-type.md
        'jsdoc/require-returns-type': 'off',

        // Enable TSDoc
        // https://github.com/microsoft/tsdoc/blob/d8ce4aedcf64b5c948e7152ba02ac6c7bdedc9be/eslint-plugin/README.md
        'tsdoc/syntax': 'error',
      },
    },
  ],
}
