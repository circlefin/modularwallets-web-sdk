/**
 * Copyright 2025 Circle Internet Group, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at.
 *
 * Http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import baseJestConfig from '@templates/jest/jest.config'

export default {
  ...baseJestConfig,

  // the path to the directory where Jest stores its cache files
  cacheDirectory: '.jest',

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: ['./src/**/*.ts'],

  // A list of paths to directories or files that Just should exclude from coverage report
  coveragePathIgnorePatterns: ['./types', './*/index.ts'],

  // The test environment that will be used for testing
  testEnvironment: '<rootDir>/jest-environment.js',

  // Setup files to run before each test
  setupFiles: ['./jest.setup.ts'],

  // A list of paths to directories that Jest should use to search for files in
  roots: ['<rootDir>/src'],
}
