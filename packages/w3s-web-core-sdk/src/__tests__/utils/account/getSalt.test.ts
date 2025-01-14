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

import { pad } from 'viem'

import { getSalt } from '../../../utils'

describe('Utils > account > getSalt', () => {
  it('should return a padded salt of size 32', () => {
    const salt = getSalt()

    const expectedSalt = pad('0x', { size: 32 })

    expect(salt).toBe(expectedSalt)
    expect(salt).toHaveLength(66) // 32 bytes padded in hex is 64 characters + 2 for '0x'
  })
})
