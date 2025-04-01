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

import { type GetAddressReturnType } from '../../types'

import { getDefaultWalletName } from './getDefaultWalletName'
import { getOwnersConfigFromOwner } from './getOwnersConfigFromOwner'

import type { CircleModularWalletClient } from '../../clients'
import type { LocalAccount } from 'viem'
import type { WebAuthnAccount } from 'viem/_types/account-abstraction'

interface GetCircleSmartAccountAddressParameters {
  /**
   * The Circle modular wallet client instance.
   */
  client: CircleModularWalletClient
  /**
   * The owner.
   */
  owner: WebAuthnAccount | LocalAccount
  /**
   * The Circle Smart Account Wallet Name.
   */
  name?: string
}

/**
 * Gets the Circle modular wallet address.
 * @param parameters - Parameters to use. See {@link GetCircleSmartAccountAddressParameters}.
 * @returns The Circle modular wallet address.
 */
export async function getModularWalletAddress({
  client,
  owner,
  name = getDefaultWalletName(owner),
}: GetCircleSmartAccountAddressParameters): Promise<GetAddressReturnType> {
  const ownerConfig = getOwnersConfigFromOwner(owner)
  return await client.getAddress([
    {
      scaConfiguration: {
        initialOwnershipConfiguration: {
          weightedMultisig: {
            ...ownerConfig,
            thresholdWeight: 1,
          },
        },
        scaCore: 'circle_6900_v1',
      },
      metadata: {
        name,
      },
    },
  ])
}
