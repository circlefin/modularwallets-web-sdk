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
  estimateRegisterRecoveryAddressGas,
  estimateExecuteRecoveryGas,
  registerRecoveryAddress,
  executeRecovery,
} from '../../actions'

import type {
  EstimateRegisterRecoveryAddressGasParameters,
  EstimateExecuteRecoveryGasParameters,
  RegisterRecoveryAddressParameters,
  ExecuteRecoveryParameters,
} from '../../actions'
import type { Chain, Client, Transport } from 'viem'
import type {
  EstimateUserOperationGasReturnType,
  SendUserOperationReturnType,
  SmartAccount,
} from 'viem/_types/account-abstraction'

export type RecoveryActions = {
  /**
   * Estimates the gas for registering a recovery address.
   * @param parameters - Parameters to use. See {@link EstimateRegisterRecoveryAddressGasParameters}.
   * @returns An estimate of gas values necessary to register a recovery address. See {@link EstimateUserOperationGasReturnType}.
   */
  estimateRegisterRecoveryAddressGas: (
    parameters: EstimateRegisterRecoveryAddressGasParameters,
  ) => Promise<EstimateUserOperationGasReturnType>
  /**
   * Estimates the gas for executing recovery.
   * @param parameters - Parameters to use. See {@link EstimateExecuteRecoveryGasParameters}.
   * @returns An estimate of gas values necessary to execute recovery. See {@link EstimateUserOperationGasReturnType}.
   */
  estimateExecuteRecoveryGas: (
    parameters: EstimateExecuteRecoveryGasParameters,
  ) => Promise<EstimateUserOperationGasReturnType>
  /**
   * Executes the recovery process.
   * @param parameters - Parameters to use. See {@link ExecuteRecoveryParameters}.
   * @returns The user operation hash from executing recovery onchain. See {@link SendUserOperationReturnType}.
   */
  executeRecovery: (
    parameters: ExecuteRecoveryParameters,
  ) => Promise<SendUserOperationReturnType>
  /**
   * Registers a recovery address during the recovery process.
   * @param parameters - Parameters to use. See {@link RegisterRecoveryAddressParameters}.
   * @returns The user operation hash from registering the recovery address onchain. See {@link SendUserOperationReturnType}.
   */
  registerRecoveryAddress: (
    params: RegisterRecoveryAddressParameters,
  ) => Promise<SendUserOperationReturnType>
}

/**
 * Returns the Recovery actions.
 * @param client - Client to use.
 * @returns Recovery Actions. See {@link RecoveryActions}.
 */
export function recoveryActions<transport extends Transport = Transport>(
  client: Client<transport, Chain | undefined, SmartAccount | undefined>,
): RecoveryActions {
  return {
    estimateRegisterRecoveryAddressGas: (parameters) =>
      estimateRegisterRecoveryAddressGas(client, parameters),
    estimateExecuteRecoveryGas: (parameters) =>
      estimateExecuteRecoveryGas(client, parameters),
    executeRecovery: (parameters) => executeRecovery(client, parameters),
    registerRecoveryAddress: (parameters) =>
      registerRecoveryAddress(client, parameters),
  }
}
