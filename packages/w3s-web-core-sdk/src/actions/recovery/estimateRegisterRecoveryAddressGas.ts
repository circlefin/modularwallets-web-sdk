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

import { CIRCLE_PLUGIN_ADD_OWNERS_ABI } from '../../abis'

import type { Address, Chain, Client, Transport } from 'viem'
import type {
  EstimateUserOperationGasParameters,
  EstimateUserOperationGasReturnType,
  SmartAccount,
} from 'viem/account-abstraction'

export interface EstimateRegisterRecoveryAddressGasParameters
  extends Omit<EstimateUserOperationGasParameters, 'callData'> {
  /**
   * The derived address of the recovery key.
   */
  recoveryAddress: Address
}

/**
 * Estimates the gas required to register a recovery address during the recovery process.
 * @param client - Client to use.
 * @param params - Parameters to use. See {@link EstimateRegisterRecoveryAddressGasParameters}.
 * @returns An estimate of gas values necessary to register a recovery address. See {@link EstimateUserOperationGasReturnType}.
 */
export async function estimateRegisterRecoveryAddressGas(
  client: Client<Transport, Chain | undefined, SmartAccount | undefined>,
  params: EstimateRegisterRecoveryAddressGasParameters,
): Promise<EstimateUserOperationGasReturnType> {
  const { recoveryAddress, ...userOp } = params
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

  return await estimateUserOperationGas(client, {
    callData,
    ...userOp,
  } as EstimateUserOperationGasParameters)
}
