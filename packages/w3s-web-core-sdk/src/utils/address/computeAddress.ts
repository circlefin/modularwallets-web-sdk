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
  encodeAbiParameters,
  encodePacked,
  getContractAddress,
  keccak256,
  parseAbiParameters,
} from 'viem'

import { ERC1769_PROXY, FACTORY, UPGRADABLE_MSCA } from '../../constants'

import { getPublicKeyParamsFromOwner } from './getPublicKeyParamsFromOwner'
import { getSalt } from './getSalt'
import { getInitializeUpgradableMSCAData } from './initializeUpgradableMSCA'

import type { Address } from 'viem'
import type { WebAuthnAccount } from 'viem/account-abstraction'

/**
 * Computes the address of a contract.
 * @param owner - The owner.
 * @returns The computed address.
 */
export function computeAddress(owner: WebAuthnAccount): Address {
  const { sender } = getPublicKeyParamsFromOwner(owner)
  const salt = getSalt()
  const initializeUpgradableMSCAData = getInitializeUpgradableMSCAData(owner)

  const mixedSalt = keccak256(
    encodeAbiParameters(
      [{ type: 'bytes32' }, { type: 'bytes32' }],
      [sender, salt],
    ),
  )
  const bytecode = encodePacked(
    ['bytes', 'bytes'],
    [
      ERC1769_PROXY.creationCode,
      encodeAbiParameters(parseAbiParameters('address, bytes'), [
        UPGRADABLE_MSCA.address,
        initializeUpgradableMSCAData,
      ]),
    ],
  )

  const address = getContractAddress({
    bytecode,
    from: FACTORY.address,
    opcode: 'CREATE2',
    salt: mixedSalt,
  })

  return address
}
