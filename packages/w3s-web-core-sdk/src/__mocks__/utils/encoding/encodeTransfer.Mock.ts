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

import type { Hex } from 'viem'

/**
 * Mocks for the utility function - encodeTransfer to address parameter.
 */
export const MockRecipientAddress: Hex =
  '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'

/**
 * Mocks for the utility function - encodeTransfer response.
 */
export const MockEncodedPredefinedTokenTransferResult = {
  data: '0xa9059cbb000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb922660000000000000000000000000000000000000000000000000000000000000064',
  to: '0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582',
}

/**
 * Mocks for the utility function - encodeTransfer response.
 */
export const MockEncodedERC20TransferResult = {
  data: '0xa9059cbb000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb9226600000000000000000000000000000000000000000000000000000000000003e8',
  to: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
}
