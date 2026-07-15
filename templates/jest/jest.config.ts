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

import fs from 'node:fs'
import path from 'node:path'

/** Walk up from a package directory to the pnpm workspace root. */
export function findRepoRoot(fromDir: string): string {
  let dir = path.resolve(fromDir)

  while (dir !== path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, 'pnpm-workspace.yaml'))) {
      return dir
    }

    dir = path.dirname(dir)
  }

  return path.resolve(fromDir, '../..')
}

/**
 * LCOV paths must be relative to the monorepo root so SonarQube can match
 * source files under packages when coverage is merged at coverage/lcov.info.
 */
export function createMonorepoCoverageReporters(
  packageDir: string,
): Array<string | [string, Record<string, unknown>]> {
  return [
    'json',
    'text',
    'clover',
    ['lcov', { projectRoot: findRepoRoot(packageDir) }],
  ]
}

export default {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'node',
  reporters: ['default', 'jest-junit'],
  cacheDirectory: '.jest',
  clearMocks: true,
  maxWorkers: process.env.CI ? 1 : '25%',
  workerIdleMemoryLimit: process.env.CI ? '512MB' : '75%',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
}
