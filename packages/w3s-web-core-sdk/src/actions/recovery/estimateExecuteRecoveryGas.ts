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

import { encodeFunctionData } from 'viem'
import { estimateUserOperationGas } from 'viem/account-abstraction'
import { parsePublicKey } from 'webauthn-p256'

import { CIRCLE_PLUGIN_ADD_OWNERS_ABI } from '../../abis'

import type { Chain, Client, Transport } from 'viem'
import type {
  EstimateUserOperationGasParameters,
  EstimateUserOperationGasReturnType,
  P256Credential,
  SmartAccount,
} from 'viem/account-abstraction'

export interface EstimateExecuteRecoveryGasParameters
  extends Omit<EstimateUserOperationGasParameters, 'callData'> {
  /**
   * The newly registered passkey credential.
   */
  credential: P256Credential
}

/**
 * Estimates the gas required to execute and finalize the recovery process.
 * @param client - Client to use.
 * @param params - Parameters to use. See {@link EstimateExecuteRecoveryGasParameters}.
 * @returns An estimate of gas values necessary to execute recovery. See {@link EstimateUserOperationGasReturnType}.
 */
export async function estimateExecuteRecoveryGas(
  client: Client<Transport, Chain | undefined, SmartAccount | undefined>,
  params: EstimateExecuteRecoveryGasParameters,
): Promise<EstimateUserOperationGasReturnType> {
  const { credential, ...userOp } = params
  const publicKeyOwner = parsePublicKey(credential.publicKey)
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

  return await estimateUserOperationGas(client, {
    callData,
    ...userOp,
  } as EstimateUserOperationGasParameters)
}
