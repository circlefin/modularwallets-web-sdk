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

import { encodeFunctionData, erc20Abi } from 'viem'

import type { EncodeTransferReturnType } from '../../types'
import type { ContractAddress } from 'src/constants'
import type { Hex } from 'viem'

/**
 * Encode the ERC20 transfer for user operations.
 * @param to - The recipient address.
 * @param token - The token address you want to transfer.
 * @param amount - The amount to transfer.
 * @returns The encoded transfer.
 */
export function encodeTransfer(
  to: Hex,
  token: ContractAddress | Hex,
  amount: bigint,
): EncodeTransferReturnType {
  const data = encodeFunctionData({
    abi: erc20Abi,
    functionName: 'transfer',
    args: [to, amount],
  })

  return { data, to: token }
}
