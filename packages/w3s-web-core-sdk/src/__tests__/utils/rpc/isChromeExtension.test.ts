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

import { isChromeExtension } from '../../../utils'

describe('Utils > rpc > isChromeExtension', () => {
  const originalWindow = global.window
  const originalLocation = global.location

  afterEach(() => {
    global.window = originalWindow
    global.location = originalLocation
  })

  it('should return true when in Chrome extension context', () => {
    Object.defineProperty(global, 'window', {
      value: {
        location: {
          protocol: 'chrome-extension:',
        },
      },
      writable: true,
    })

    expect(isChromeExtension()).toBe(true)
  })

  it('should return false when in regular web context', () => {
    Object.defineProperty(global, 'window', {
      value: {
        location: {
          protocol: 'https:',
        },
      },
      writable: true,
    })

    expect(isChromeExtension()).toBe(false)
  })

  it('should return false when in http context', () => {
    Object.defineProperty(global, 'window', {
      value: {
        location: {
          protocol: 'http:',
        },
      },
      writable: true,
    })

    expect(isChromeExtension()).toBe(false)
  })

  it('should return false when window is undefined', () => {
    Object.defineProperty(global, 'window', {
      value: undefined,
      writable: true,
    })

    expect(isChromeExtension()).toBe(false)
  })

  it('should return false when window.location is undefined', () => {
    Object.defineProperty(global, 'window', {
      value: {},
      writable: true,
    })

    expect(isChromeExtension()).toBe(false)
  })

  it('should return false when protocol is undefined', () => {
    Object.defineProperty(global, 'window', {
      value: {
        location: {},
      },
      writable: true,
    })

    expect(isChromeExtension()).toBe(false)
  })
})
