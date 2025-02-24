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
  MockEncodedERC20TransferResult,
  MockEncodedPredefinedTokenTransferResult,
  MockRecipientAddress,
} from '../../../__mocks__'
import { ContractAddress } from '../../../constants'
import { encodeTransfer } from '../../../utils'

describe('Utils > encoding > encodeTransfer', () => {
  it('should encode an ERC-20 transfer correctly using the pre-defined token list', () => {
    const result = encodeTransfer(
      MockRecipientAddress,
      ContractAddress.PolygonAmoy_USDC,
      100n,
    )
    expect(result).toEqual(MockEncodedPredefinedTokenTransferResult)
  })

  it('should encode an ERC-20 transfer correctly using the passed-in token address', () => {
    const result = encodeTransfer(
      MockRecipientAddress,
      '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
      1000n,
    )
    expect(result).toEqual(MockEncodedERC20TransferResult)
  })
})
