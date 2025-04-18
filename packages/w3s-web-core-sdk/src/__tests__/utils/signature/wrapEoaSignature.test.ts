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

import {
  MockInvalidWrappedEoaSignature,
  MockWrapEoaSignatureParams,
  MockWrappedSignResult,
} from '../../../__mocks__'
import { AccountType } from '../../../types/modularWallets'
import { wrapEoaSignature } from '../../../utils'

import type { Hex } from 'viem'

describe('Utils > signature > wrapEoaSignature', () => {
  const signature: Hex = MockWrapEoaSignatureParams

  it('should wrap a valid signature correctly', () => {
    const result = wrapEoaSignature({ signature, hasUserOpGas: false })

    expect(result).toEqual(MockWrappedSignResult[AccountType.Local])
  })

  it('error: invalid signature', () => {
    expect(() =>
      wrapEoaSignature({
        signature: MockInvalidWrappedEoaSignature,
        hasUserOpGas: false,
      }),
    ).toThrow('signature is invalid')
  })
})
