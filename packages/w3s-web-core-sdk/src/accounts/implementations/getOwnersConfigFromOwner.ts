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

import { type EoaOwner, type WebauthnOwner } from '../../types/modularWallets'
import { getPublicKeyParamsFromOwner } from '../../utils/address'
import { isWebAuthnOwner } from '../../utils/smartAccount'

import type { AtLeastOne } from '../../types/utils'
import type { LocalAccount } from 'viem'
import type { WebAuthnAccount } from 'viem/_types/account-abstraction'

/**
 * Generates an ownership configuration based on the owner type.
 * @param owner - The account owner.
 * @returns An ownership configuration ensuring at least one owner exists.
 */
export function getOwnersConfigFromOwner(
  owner: WebAuthnAccount | LocalAccount,
): AtLeastOne<{
  owners?: EoaOwner[]
  webauthnOwners?: WebauthnOwner[]
}> {
  if (isWebAuthnOwner(owner)) {
    const { initialPublicKeyOwners } = getPublicKeyParamsFromOwner(owner)
    const publicKeyX = initialPublicKeyOwners[0].x.toString()
    const publicKeyY = initialPublicKeyOwners[0].y.toString()
    return {
      webauthnOwners: [{ publicKeyX, publicKeyY, weight: 1 }],
    }
  }

  return {
    owners: [{ address: owner.address, weight: 1 }],
  }
}
