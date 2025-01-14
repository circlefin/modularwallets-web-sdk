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

import { TestEnvironment } from 'jest-environment-jsdom'

/**
 * Set up a custom JSDOM-based test environment for Jest so we can add things JSDOM doesn't support.
 * @see SimpleWebAuthn (https://github.com/MasterKale/SimpleWebAuthn/blob/master/packages/browser/jest-environment.js)
 * Original Author: Matthew Miller (https://github.com/MasterKale)
 * License: MIT License (https://opensource.org/licenses/MIT)
 */
class CustomTestEnvironment extends TestEnvironment {
  async setup() {
    await super.setup()
    /**
     * JSDOM doesn't implement TextEncoder so we need to fake it with Node's.
     *
     * Solved thanks to https://stackoverflow.com/a/57713960/2133271.
     */
    if (typeof this.global.TextEncoder === 'undefined') {
      const { TextEncoder } = await import('util')
      this.global.TextEncoder = TextEncoder
    }

    /**
     * Add support for TextDecoder to JSDOM.
     */
    if (typeof this.global.TextDecoder === 'undefined') {
      const { TextDecoder } = await import('util')
      this.global.TextDecoder = TextDecoder
    }
  }
}

export default CustomTestEnvironment
