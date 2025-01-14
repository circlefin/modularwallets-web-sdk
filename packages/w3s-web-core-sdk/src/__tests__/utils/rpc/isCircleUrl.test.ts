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

import { isCircleUrl } from '../../../utils'

describe('Utils > rpc > isCircleUrl', () => {
  it('should return true for Circle URLs', () => {
    expect(isCircleUrl('https://modular-sdk.circle.com')).toBe(true)
    expect(isCircleUrl('https://modular-sdk-staging.circle.com')).toBe(true)
    expect(isCircleUrl('https://modular-sdk.circle.com/v1/rpc/w3s/buidl')).toBe(
      true,
    )
    expect(
      isCircleUrl('https://modular-sdk-staging.circle.com/v1/rpc/w3s/buidl'),
    ).toBe(true)
  })

  it('should return false for non-Circle URLs', () => {
    expect(isCircleUrl('https://www.google.com')).toBe(false)
  })

  it('should return false when the url is invalid', () => {
    expect(isCircleUrl('hello')).toBe(false)
  })
})
