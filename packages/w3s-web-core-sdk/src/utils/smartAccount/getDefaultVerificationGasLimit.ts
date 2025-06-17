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

import { modularWalletActions } from '../../clients'
import {
  MINIMUM_UNDEPLOY_VERIFICATION_GAS_LIMIT,
  MINIMUM_VERIFICATION_GAS_LIMIT,
} from '../../constants'

import type { Client } from 'viem'

/**
 * Gets the default verification gas limit.
 * @param client - Client to use for RPC requests. Will attempt to get gas limits from the RPC endpoint.
 * @param deployed - Whether the smart account is deployed.
 * @returns The default verification gas limit.
 */
export const getDefaultVerificationGasLimit = async (
  client: Client,
  deployed: boolean,
): Promise<number> => {
  // Try to get gas limits from the RPC endpoint
  try {
    const modularWalletClient = client.extend(modularWalletActions)
    const result = await modularWalletClient.getUserOperationGasPrice()

    // Use the gas limits from the RPC response
    const verificationGasLimit = deployed
      ? Number(result?.deployed ?? MINIMUM_VERIFICATION_GAS_LIMIT)
      : Number(result?.notDeployed ?? MINIMUM_UNDEPLOY_VERIFICATION_GAS_LIMIT)

    return verificationGasLimit
  } catch (_error) {
    // If RPC call fails, fall back to hardcoded values
    return deployed
      ? MINIMUM_VERIFICATION_GAS_LIMIT
      : MINIMUM_UNDEPLOY_VERIFICATION_GAS_LIMIT
  }
}
