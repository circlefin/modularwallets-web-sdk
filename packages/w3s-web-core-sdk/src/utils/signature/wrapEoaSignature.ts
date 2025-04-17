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

import { encodePacked, parseSignature } from 'viem'

import type { Hex } from 'viem'

interface WrapEoaSignatureParameters {
  /**
   * The signature to wrap.
   */
  signature: Hex
  /**
   * Whether the signature is for a user operation.
   */
  hasUserOpGas: boolean
}

/**
 * Wraps an eoa signature.
 * @param parameters - Parameters to use. See {@link WrapEoaSignatureParameters}.
 * @returns The wrapped signature.
 * @throws Error if the signature is invalid.
 */
export function wrapEoaSignature({
  signature,
  hasUserOpGas,
}: WrapEoaSignatureParameters): Hex {
  const { r, s, v } = parseSignature(signature)
  if (typeof v !== 'undefined') {
    const signType = hasUserOpGas ? Number(v + 32n) : Number(v)
    return encodePacked(['bytes32', 'bytes32', 'uint8'], [r, s, signType])
  }
  throw new Error('signature is invalid')
}
