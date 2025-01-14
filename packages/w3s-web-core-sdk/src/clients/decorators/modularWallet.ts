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

import { type GetAddressParameters, getAddress } from '../../actions'

import type { GetAddressReturnType } from '../../types'
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
  }
}
