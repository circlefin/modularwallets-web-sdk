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

import { encodePacked, keccak256, pad } from 'viem'

import {
  CIRCLE_WEIGHTED_WEB_AUTHN_MULTISIG_PLUGIN,
  EIP712_PREFIX,
  REPLAY_SAFE_HASH_V1,
} from '../../constants'

import type { Address, Hash, Hex } from 'viem'

interface ReplaySafeHashParameters {
  /**
   * The address.
   */
  address: Address
  /**
   * The chain ID.
   */
  chainId: number
  /**
   * The hash.
   */
  hash: Hash
}

/**
 * Converts the given data to a replay-safe hash.
 * @param parameters - Parameters to use. See {@link ReplaySafeHashParameters}.
 * @returns The replay-safe hash.
 */
export function toReplaySafeHash({
  address,
  chainId,
  hash,
}: ReplaySafeHashParameters): Hash {
  const textEncoder = new TextEncoder()

  const { name, version, domainSeparatorType, moduleType } = REPLAY_SAFE_HASH_V1

  const domainSeparatorTypeHash = keccak256(
    textEncoder.encode(domainSeparatorType),
  )

  const moduleIdHash = keccak256(
    encodePacked(['string', 'string'], [name, version]),
  )

  const moduleTypeHash = keccak256(textEncoder.encode(moduleType))

  const domainSeparator = encodePacked(
    ['bytes', 'bytes', 'uint256', 'bytes32', 'bytes32'],
    [
      domainSeparatorTypeHash,
      moduleIdHash,
      BigInt(chainId),
      pad(CIRCLE_WEIGHTED_WEB_AUTHN_MULTISIG_PLUGIN.address),
      pad(address, {
        dir: 'right',
      }),
    ],
  )

  const structHash = encodePacked(['bytes', 'bytes'], [moduleTypeHash, hash])

  // Generate the replay safe hash using EIP712
  return keccak256(
    (EIP712_PREFIX +
      keccak256(domainSeparator).slice(2) +
      keccak256(structHash).slice(2)) as Hex,
  )
}
