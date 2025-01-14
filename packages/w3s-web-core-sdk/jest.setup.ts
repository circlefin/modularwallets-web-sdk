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

import { webcrypto } from 'node:crypto'

import { enableFetchMocks } from 'jest-fetch-mock'

import packageJson from './package.json'

enableFetchMocks()

/**
 * Define global `crypto` for JSDom to allow mocking in tests.
 * JSDom lacks native support for the Web Crypto API.
 */
Object.defineProperty(globalThis, 'crypto', {
  value: webcrypto,
})

/**
 * Define `navigator.credentials` for JSDom to allow mocking in tests.
 * JSDom lacks native support for the Credentials API.
 */
Object.defineProperty(globalThis.window.navigator, 'credentials', {
  writable: true,
  value: {
    create: jest.fn(),
    get: jest.fn(),
  },
})

/**
 * Define `SDK_VERSION` for use in the SDK.
 */
Object.defineProperty(globalThis, 'SDK_VERSION', {
  value: packageJson.version,
})
