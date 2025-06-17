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
  type GetAddressParameters,
  createAddressMapping,
  getAddress,
  getAddressMapping,
  getUserOperationGasPrice,
} from '../../actions'

import type {
  CreateAddressMappingParameters,
  CreateAddressMappingReturnType,
  GetAddressReturnType,
  GetAddressMappingParameters,
  GetAddressMappingReturnType,
  GetUserOperationGasPriceReturnType,
} from '../../types'
import type { Client, Transport } from 'viem'

export type ModularWalletActions = {
  /**
   * Gets the modular wallet address for the user.
   * @param parameters - Parameters to use. See {@link GetAddressParameters}.
   * @returns Wallets created. See {@link GetAddressReturnType}.
   */
  getAddress: (
    parameters: GetAddressParameters,
  ) => Promise<GetAddressReturnType>
  /**
   * Creates an address mapping between new account owners and the modular wallet.
   * @param parameters - Parameters to use. See {@link CreateAddressMappingParameters}.
   * @returns Address mapping id. See {@link CreateAddressMappingReturnType}.
   */
  createAddressMapping: (
    parameters: CreateAddressMappingParameters,
  ) => Promise<CreateAddressMappingReturnType>
  /**
   * Gets the address mapping for the modular wallet.
   * @param parameters - Parameters to use. See {@link GetAddressMappingParameters}.
   * @returns Address mapping. See {@link GetAddressMappingReturnType}.
   */
  getAddressMapping: (
    parameters: GetAddressMappingParameters,
  ) => Promise<GetAddressMappingReturnType>
  /**
   * Gets the gas prices for user operations.
   * @returns Gas prices. See {@link GetUserOperationGasPriceReturnType}.
   */
  getUserOperationGasPrice: () => Promise<GetUserOperationGasPriceReturnType>
}

/**
 * Returns the Modular Wallets actions.
 * @param client - Client to use.
 * @returns Modular Wallets Actions. See {@link ModularWalletActions}.
 */
export function modularWalletActions<transport extends Transport = Transport>(
  client: Client<transport>,
): ModularWalletActions {
  return {
    getAddress: (parameters) => getAddress(client, parameters),
    createAddressMapping: (parameters) =>
      createAddressMapping(client, parameters),
    getAddressMapping: (parameters) => getAddressMapping(client, parameters),
    getUserOperationGasPrice: () => getUserOperationGasPrice(client),
  }
}
