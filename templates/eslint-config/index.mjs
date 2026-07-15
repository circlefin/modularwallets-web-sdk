/*
 * Copyright (c) 2026, Circle Internet Group, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import importX from 'eslint-plugin-import-x'
import jestPlugin from 'eslint-plugin-jest'
import jsdoc from 'eslint-plugin-jsdoc'
import jsonc from 'eslint-plugin-jsonc'
import promise from 'eslint-plugin-promise'
import tsdoc from 'eslint-plugin-tsdoc'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import globals from 'globals'
import jsoncParser from 'jsonc-eslint-parser'

const jsTsFiles = ['**/*.{js,jsx,ts,tsx}']
const tsFiles = ['**/*.{ts,tsx}']
const jsTsNoJsxFiles = ['**/*.{js,ts}']
const testFiles = ['**/*.{spec,test}.{js,jsx,ts,tsx}']

/**
 * Shared ESLint flat config for MW Web SDK packages.
 *
 * @param {object} [options]
 * @param {string} [options.tsconfigRootDir] Root directory for TypeScript project service resolution.
 * @param {string[]} [options.ignores] Additional ignore patterns for the consuming package.
 * @returns {import('typescript-eslint').ConfigArray}
 */
export function createEslintConfig(options = {}) {
  const tsconfigRootDir = options.tsconfigRootDir ?? import.meta.dirname
  const packageIgnores = options.ignores ?? []

  return tseslint.config(
    {
      ignores: [
        '**/node_modules/**',
        '**/dist/**',
        '**/coverage/**',
        '**/.rollup.cache/**',
        '**/.jest/**',
        '**/eslint_report.json',
        ...packageIgnores,
      ],
    },
    eslint.configs.recommended,
    {
      files: jsTsFiles,
      languageOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        globals: {
          ...globals.browser,
          ...globals.node,
        },
      },
      rules: {
        eqeqeq: ['error', 'always', { null: 'ignore' }],
      },
    },
    {
      files: jsTsNoJsxFiles,
      languageOptions: {
        globals: globals.node,
      },
      rules: {
        'no-console': 'error',
      },
    },
    {
      files: jsTsFiles,
      plugins: {
        'import-x': importX,
      },
      settings: {
        'import-x/extensions': [
          '.ts',
          '.tsx',
          '.cts',
          '.mts',
          '.js',
          '.jsx',
          '.cjs',
          '.mjs',
        ],
        'import-x/external-module-folders': [
          'node_modules',
          'node_modules/@types',
        ],
        'import-x/parsers': {
          '@typescript-eslint/parser': ['.ts', '.tsx', '.cts', '.mts'],
        },
      },
      rules: {
        'import-x/no-duplicates': 'error',
        'import-x/no-cycle': ['error', { maxDepth: 1 }],
        'import-x/order': [
          'error',
          {
            groups: [
              'builtin',
              'external',
              'internal',
              'unknown',
              'parent',
              'sibling',
              'index',
              'object',
              'type',
            ],
            pathGroups: [
              {
                pattern: 'react*',
                group: 'external',
                position: 'before',
              },
              {
                pattern: '*.[p]css',
                patternOptions: {
                  matchBase: true,
                },
                group: 'type',
                position: 'after',
              },
            ],
            warnOnUnassignedImports: false,
            pathGroupsExcludedImportTypes: ['builtin', 'react'],
            'newlines-between': 'always',
            alphabetize: {
              order: 'asc',
            },
          },
        ],
        'import-x/no-extraneous-dependencies': 'off',
        'import-x/no-unresolved': 'off',
        'import-x/named': 'off',
      },
    },
    ...tseslint.configs.recommended.map((config) => ({
      ...config,
      files: tsFiles,
    })),
    ...tseslint.configs.recommendedTypeChecked.map((config) => ({
      ...config,
      files: tsFiles,
      languageOptions: {
        ...config.languageOptions,
        parserOptions: {
          ...config.languageOptions?.parserOptions,
          projectService: true,
          tsconfigRootDir,
        },
      },
    })),
    {
      files: tsFiles,
      rules: {
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/consistent-type-imports': 'error',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/strict-boolean-expressions': [
          'error',
          {
            allowString: true,
            allowNumber: false,
            allowNullableObject: true,
            allowNullableBoolean: true,
            allowNullableString: true,
            allowNullableNumber: false,
            allowAny: false,
          },
        ],
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'variableLike',
            format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
            leadingUnderscore: 'allow',
            trailingUnderscore: 'allow',
            filter: {
              regex: '^__typename$',
              match: false,
            },
          },
        ],
        '@typescript-eslint/unbound-method': [
          'warn',
          {
            ignoreStatic: true,
          },
        ],
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            args: 'all',
            argsIgnorePattern: '^_',
            caughtErrors: 'all',
            caughtErrorsIgnorePattern: '^_',
            destructuredArrayIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            ignoreRestSiblings: true,
          },
        ],
        '@typescript-eslint/no-unsafe-enum-comparison': 'off',
      },
    },
    jsdoc.configs['flat/recommended'],
    {
      files: ['**/*.{js,jsx,ts,tsx}'],
      rules: {
        'jsdoc/check-indentation': 'error',
        'jsdoc/check-line-alignment': 'error',
        'jsdoc/check-syntax': 'error',
        'jsdoc/match-description': [
          'error',
          {
            tags: {
              param: true,
              returns: true,
            },
          },
        ],
        'jsdoc/no-bad-blocks': 'error',
        'jsdoc/no-defaults': 'error',
        'jsdoc/require-asterisk-prefix': 'error',
        'jsdoc/require-description-complete-sentence': [
          'error',
          {
            abbreviations: ['etc', 'e.g.', 'i.e.'],
          },
        ],
        'jsdoc/require-hyphen-before-param-description': 'error',
        'jsdoc/require-jsdoc': [
          'error',
          {
            publicOnly: true,
          },
        ],
        'jsdoc/require-returns-description': 'off',
        'jsdoc/require-throws': 'error',
        'jsdoc/require-throws-type': 'off',
      },
    },
    {
      files: tsFiles,
      plugins: {
        tsdoc,
      },
      rules: {
        'jsdoc/check-param-names': [
          'error',
          {
            checkDestructured: false,
          },
        ],
        'jsdoc/check-tag-names': 'off',
        'jsdoc/no-types': 'error',
        'jsdoc/require-param': 'off',
        'jsdoc/require-param-type': 'off',
        'jsdoc/require-property-type': 'off',
        'jsdoc/require-returns': 'off',
        'jsdoc/require-returns-type': 'off',
        'tsdoc/syntax': 'error',
      },
    },
    promise.configs['flat/recommended'],
    {
      files: testFiles,
      ...jestPlugin.configs['flat/recommended'],
      ...jestPlugin.configs['flat/style'],
      languageOptions: {
        ...jestPlugin.configs['flat/recommended'].languageOptions,
        globals: jestPlugin.environments.globals.globals,
      },
      rules: {
        ...jestPlugin.configs['flat/recommended'].rules,
        ...jestPlugin.configs['flat/style'].rules,
        'jest/expect-expect': [
          'warn',
          {
            assertFunctionNames: ['expect', 'expectTypeOf'],
          },
        ],
        'jest/no-mocks-import': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
      },
    },
    ...jsonc.configs['flat/recommended-with-json'],
    ...jsonc.configs['flat/recommended-with-jsonc'],
    ...jsonc.configs['flat/recommended-with-json5'],
    {
      files: ['**/*.json'],
      ignores: ['**/tsconfig*.json'],
      rules: {
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
      files: ['**/package.json'],
      rules: {
        'jsonc/key-name-casing': 'off',
      },
    },
    {
      files: ['**/*.{json,json5,jsonc}', '**/tsconfig*.json'],
      languageOptions: {
        parser: jsoncParser,
      },
    },
    eslintPluginPrettierRecommended,
    {
      rules: {
        'prettier/prettier': [
          'error',
          {
            trailingComma: 'all',
            semi: false,
            arrowParens: 'always',
            singleQuote: true,
            proseWrap: 'never',
            endOfLine: 'lf',
          },
        ],
      },
    },
  )
}

export default createEslintConfig()
