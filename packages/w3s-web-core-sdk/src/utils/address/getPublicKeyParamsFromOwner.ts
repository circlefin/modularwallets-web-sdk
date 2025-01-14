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

import { encodeAbiParameters, keccak256, type Address } from 'viem'
import { parsePublicKey } from 'webauthn-p256'

import { PUBLIC_KEY_COORDINATES_ABI } from '../../abis'

import type { WebAuthnAccount } from 'viem/account-abstraction'
import type { PublicKey } from 'webauthn-p256'

/**
 * Gets the public key parameters from an owner.
 * @param owner - The owner.
 * @returns The public key parameters.
 */
export function getPublicKeyParamsFromOwner(owner: WebAuthnAccount): {
  sender: Address
  initialPublicKeyOwners: PublicKey[]
} {
  const publicKey = parsePublicKey(owner.publicKey)
  const initialPublicKeyOwners = [publicKey]

  const sender = keccak256(
    encodeAbiParameters(PUBLIC_KEY_COORDINATES_ABI, [
      initialPublicKeyOwners[0].x,
      initialPublicKeyOwners[0].y,
    ]),
  )

  return { sender, initialPublicKeyOwners }
}
