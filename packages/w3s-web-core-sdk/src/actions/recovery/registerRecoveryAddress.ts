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

import { encodeFunctionData, RpcError } from 'viem'
import { sendUserOperation } from 'viem/account-abstraction'

import { CIRCLE_PLUGIN_ADD_OWNERS_ABI } from '../../abis'
import { OwnerIdentifierType } from '../../types'
import { ErrorCodes } from '../../utils'
import { createAddressMapping } from '../modularWallets'

import type { Address, Chain, Client, Transport } from 'viem'
import type {
  SendUserOperationParameters,
  SendUserOperationReturnType,
  SmartAccount,
} from 'viem/account-abstraction'

export interface RegisterRecoveryAddressParameters
  extends Omit<SendUserOperationParameters, 'callData'> {
  /**
   * The recovery address.
   */
  recoveryAddress: Address
}

/**
 * Registers a recovery address during the recovery process.
 * @param client - Client to use.
 * @param params - Parameters to use. See {@link RegisterRecoveryAddressParameters}.
 * @returns The user operation hash from registering the recovery address onchain. See {@link SendUserOperationReturnType}.
 */
export async function registerRecoveryAddress(
  client: Client<Transport, Chain | undefined, SmartAccount | undefined>,
  params: RegisterRecoveryAddressParameters,
): Promise<SendUserOperationReturnType> {
  if (!client.account && !params.account) {
    throw new Error('Account is required')
  }

  const account = client.account || (params.account as SmartAccount)
  const { recoveryAddress, ...userOp } = params

  // Step 1: Create a mapping between the MSCA address and the recovery address
  try {
    await createAddressMapping(client, {
      walletAddress: account.address,
      owners: [
        {
          type: OwnerIdentifierType.EOA,
          identifier: {
            address: recoveryAddress,
          },
        },
      ],
    })
  } catch (error) {
    const addressMappingAlreadyExistsError =
      error instanceof RpcError && error.code === ErrorCodes.ALREADY_KNOWN

    /**
     * Ignore "address mapping already exists" errors to ensure idempotency and allow safe retries.
     * This prevents inconsistent states between RPC calls and onchain transactions.
     */
    if (!addressMappingAlreadyExistsError) {
      throw new Error(
        'Failed to register the recovery address. Please try again.',
      )
    }
  }

  // Step 2: Encode the function call for the userOp
  const callData = encodeFunctionData({
    abi: CIRCLE_PLUGIN_ADD_OWNERS_ABI,
    functionName: 'addOwners',
    args: [
      [recoveryAddress], // recovery address
      [BigInt(1)], // weightsToAdd
      [], // publicKeyOwnersToAdd
      [], // publicKeyWeightsToAdd
      BigInt(0), // newThresholdWeight, 0 means no change
    ],
  })

  // Step 3: Send user operation to store the recovery address onchain
  return await sendUserOperation(client, {
    callData,
    ...userOp,
  } as SendUserOperationParameters)
}
