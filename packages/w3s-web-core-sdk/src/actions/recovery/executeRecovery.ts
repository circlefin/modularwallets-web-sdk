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
import { parsePublicKey } from 'webauthn-p256'

import { CIRCLE_PLUGIN_ADD_OWNERS_ABI } from '../../abis'
import { OwnerIdentifierType } from '../../types'
import { ErrorCodes } from '../../utils'
import { createAddressMapping } from '../modularWallets'

import type { Chain, Client, Transport } from 'viem'
import type {
  P256Credential,
  SendUserOperationParameters,
  SendUserOperationReturnType,
  SmartAccount,
} from 'viem/account-abstraction'

export interface ExecuteRecoveryParameters
  extends Omit<SendUserOperationParameters, 'callData'> {
  /**
   * The newly registered passkey credential.
   */
  credential: P256Credential
}

/**
 * Executes and finalizes the recovery process.
 * @param client - Client to use.
 * @param params - Parameters to use. See {@link ExecuteRecoveryParameters}.
 * @returns The user operation hash from executing recovery onchain. See {@link SendUserOperationReturnType}.
 */
export async function executeRecovery(
  client: Client<Transport, Chain | undefined, SmartAccount | undefined>,
  params: ExecuteRecoveryParameters,
): Promise<SendUserOperationReturnType> {
  if (!client.account && !params.account) {
    throw new Error('Account is required')
  }

  const account = client.account || (params.account as SmartAccount)
  const { credential, ...userOp } = params
  const publicKeyOwner = parsePublicKey(credential.publicKey)

  // Step 1: Create a mapping between the MSCA address and the WebAuthn credential
  try {
    await createAddressMapping(client, {
      walletAddress: account.address,
      owners: [
        {
          type: OwnerIdentifierType.WebAuthn,
          identifier: {
            publicKeyX: publicKeyOwner.x.toString(),
            publicKeyY: publicKeyOwner.y.toString(),
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
        'Failed to register the new WebAuthn credential. Please try again.',
      )
    }
  }

  // Step 2: Encode the function call for the userOp
  const callData = encodeFunctionData({
    abi: CIRCLE_PLUGIN_ADD_OWNERS_ABI,
    functionName: 'addOwners',
    args: [
      [], // ownersToAdd
      [], // weightsToAdd
      [publicKeyOwner], // publicKeyOwnersToAdd
      [BigInt(1)], // publicKeyWeightsToAdd
      BigInt(1), // newThresholdWeight
    ],
  })

  // Step 3: Send user operation to store the recovery address onchain
  return await sendUserOperation(client, {
    callData,
    ...userOp,
  } as SendUserOperationParameters)
}
