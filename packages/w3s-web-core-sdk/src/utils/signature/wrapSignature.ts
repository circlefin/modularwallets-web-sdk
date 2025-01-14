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

import { encodePacked, size } from 'viem'

import type { Hex } from 'viem'

interface WrapSignatureParameters {
  /**
   * The public key on-chain id.
   * A.k.a. The result of `keccak256(abi.encode(x, y))` where `x` and `y` are the x and y coordinates of the public key.
   */
  sender: Hex
  /**
   * The signature to wrap.
   */
  signature: Hex
  /**
   * Whether the signature is for a user operation.
   */
  hasUserOpGas?: boolean
}

/**
 * Wraps a signature with the sender and the signature type.
 * @param parameters - Parameters to use. See {@link WrapSignatureParameters}.
 * @returns The wrapped signature.
 */
export function wrapSignature({
  sender,
  signature,
  hasUserOpGas,
}: WrapSignatureParameters): Hex {
  const sigType = hasUserOpGas ? 34 : 2

  return encodePacked(
    ['bytes32', 'uint256', 'uint8', 'uint256', 'bytes'],
    [sender, 65n, sigType, BigInt(size(signature)), signature],
  )
}
