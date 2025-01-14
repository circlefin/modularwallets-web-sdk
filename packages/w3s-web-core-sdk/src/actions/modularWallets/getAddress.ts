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

import type { GetAddressReturnType, GetAddressRpcSchema } from '../../types'
import type { InitialOwnershipConfiguration } from '../../types/modularWallets'
import type { Client, Transport } from 'viem'

export type GetAddressParameters = [
  {
    /**
     * The SCA configuration.
     */
    scaConfiguration: {
      initialOwnershipConfiguration: Omit<
        InitialOwnershipConfiguration,
        'ownershipContractAddress'
      >
      scaCore: string
    }
    /**
     * The metadata.
     */
    metadata?: {
      name?: string
    }
  },
]

/**
 * Gets the Circle smart wallet address for the user.
 * @param client - Client to use.
 * @param params - Parameters to use. See {@link GetAddressParameters}.
 * @returns Circle smart wallet creation response. See {@link GetAddressReturnType}.
 */
export async function getAddress(
  client: Client<Transport>,
  params: GetAddressParameters,
) {
  return await client.request<GetAddressRpcSchema>({
    method: 'circle_getAddress',
    params,
  })
}
