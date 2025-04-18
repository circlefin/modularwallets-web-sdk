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

import { validateClientUrl } from '../../../utils'

describe('Utils > rpc > validateClientUrl', () => {
  it('should return true for valid HTTP URLs', () => {
    expect(validateClientUrl('http://example.com')).toBe(true)
    expect(validateClientUrl('http://localhost:3000')).toBe(true)
    expect(validateClientUrl('http://127.0.0.1')).toBe(true)
  })

  it('should return true for valid HTTPS URLs', () => {
    expect(validateClientUrl('https://example.com')).toBe(true)
    expect(validateClientUrl('https://secure-site.com')).toBe(true)
    expect(validateClientUrl('https://localhost:3000')).toBe(true)
    expect(
      validateClientUrl(
        'https://api.pimlico.io/v1/goerli/rpc?apikey=YOUR_API_KEY_HERE',
      ),
    ).toBe(true)
  })

  it('should return false for invalid URLs', () => {
    expect(validateClientUrl('ftp://example.com')).toBe(false)
    expect(validateClientUrl('invalid-url')).toBe(false)
    expect(validateClientUrl('://missing.scheme')).toBe(false)
    expect(validateClientUrl('http://')).toBe(false)
    expect(validateClientUrl('http://http://')).toBe(false)
    expect(validateClientUrl('')).toBe(false)
  })

  it('should return false for malformed URLs', () => {
    expect(validateClientUrl('!@#$%^&*()')).toBe(false)
    expect(validateClientUrl('http:example.com')).toBe(false)
    expect(validateClientUrl('http://:3000')).toBe(false)
  })
})
