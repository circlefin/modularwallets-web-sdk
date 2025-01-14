module.exports = {
  overrides: [
    {
      files: '**/*.[tj]s?(x)',
      extends: ['plugin:jsdoc/recommended'],
      rules: {
        // Reports invalid padding inside JSDoc blocks
        // https://github.com/gajus/eslint-plugin-jsdoc/blob/master/.README/rules/check-indentation.md
        'jsdoc/check-indentation': 'error',

        // Reports invalid alignment of JSDoc block lines
        // https://github.com/gajus/eslint-plugin-jsdoc/blob/master/.README/rules/check-line-alignment.md
        'jsdoc/check-line-alignment': 'error',

        // Reports against syntax not encouraged for the mode
        // https://github.com/gajus/eslint-plugin-jsdoc/blob/master/.README/rules/check-syntax.md
        'jsdoc/check-syntax': 'error',

        // Enforces a regular expression pattern on descriptions
        // https://github.com/gajus/eslint-plugin-jsdoc/blob/master/.README/rules/match-description.md
        'jsdoc/match-description': [
          'error',
          {
            tags: {
              param: true,
              returns: true,
            },
          },
        ],

        // This rule checks for multi-line-style comments which fail to meet the criteria of a jsdoc block
        // https://github.com/gajus/eslint-plugin-jsdoc/blob/master/.README/rules/no-bad-blocks.md
        'jsdoc/no-bad-blocks': 'error',

        // This rule reports defaults being used on the relevant portion of @param or @default
        // https://github.com/gajus/eslint-plugin-jsdoc/blob/master/.README/rules/no-defaults.md
        'jsdoc/no-defaults': 'error',

        // Requires that each JSDoc line starts with an *
        // https://github.com/gajus/eslint-plugin-jsdoc/blob/master/.README/rules/require-asterisk-prefix.md
        'jsdoc/require-asterisk-prefix': 'error',

        // Requires that block description, explicit @description, and @param/@returns tag descriptions are written in complete sentences
        // https://github.com/gajus/eslint-plugin-jsdoc/blob/master/.README/rules/require-description-complete-sentence.md
        'jsdoc/require-description-complete-sentence': [
          'error',
          {
            abbreviations: ['etc', 'e.g.', 'i.e.'],
          },
        ],

        // Requires (or disallows) a hyphen before the @param description
        // https://github.com/gajus/eslint-plugin-jsdoc/blob/master/.README/rules/require-hyphen-before-param-description.md
        'jsdoc/require-hyphen-before-param-description': 'error',

        // Checks for presence of jsdoc comments, on class declarations as well as functions
        // https://github.com/gajus/eslint-plugin-jsdoc/blob/master/.README/rules/require-jsdoc.md
        'jsdoc/require-jsdoc': [
          'error',
          {
            publicOnly: true,
          },
        ],

        // Requires that the @returns tag has a description value
        // https://github.com/gajus/eslint-plugin-jsdoc/blob/master/.README/rules/require-returns-description.md
        'jsdoc/require-returns-description': 'off', // Not all functions need a description for the return.

        // Requires that throw statements are documented.
        // https://github.com/gajus/eslint-plugin-jsdoc/blob/master/.README/rules/require-throws.md
        'jsdoc/require-throws': 'error',
      },
    },
  ],
}
