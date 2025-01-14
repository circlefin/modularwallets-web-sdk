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

import { mainnet, sepolia } from 'viem/chains'

import {
  MAINNET_MINIMUM_UNDEPLOY_VERIFICATION_GAS_LIMIT,
  MAINNET_MINIMUM_VERIFICATION_GAS_LIMIT,
  MINIMUM_UNDEPLOY_VERIFICATION_GAS_LIMIT,
  MINIMUM_VERIFICATION_GAS_LIMIT,
  SEPOLIA_MINIMUM_UNDEPLOY_VERIFICATION_GAS_LIMIT,
  SEPOLIA_MINIMUM_VERIFICATION_GAS_LIMIT,
} from '../../constants'

type GasLimits = {
  deployed: number
  undeployed: number
}

type ChainLimits = {
  [chainId: number]: GasLimits
}

/**
 * Gets the minimum verification gas limit for a given chain.
 * @param deployed - Whether the smart account is deployed.
 * @param chainId - The chain id.
 * @returns The chain-specific minimum verification gas limit or the default value if the chain is not supported.
 */
export const getMinimumVerificationGasLimit = (
  deployed: boolean,
  chainId?: number,
): number => {
  const chainSpecificLimits: ChainLimits = {
    // Ethereum Sepolia specific gas limits
    [sepolia.id]: {
      deployed: SEPOLIA_MINIMUM_VERIFICATION_GAS_LIMIT,
      undeployed: SEPOLIA_MINIMUM_UNDEPLOY_VERIFICATION_GAS_LIMIT,
    },
    // Ethereum Mainnet specific gas limits
    [mainnet.id]: {
      deployed: MAINNET_MINIMUM_VERIFICATION_GAS_LIMIT,
      undeployed: MAINNET_MINIMUM_UNDEPLOY_VERIFICATION_GAS_LIMIT,
    },
  }

  // Default gas limits for all other chains
  const defaultLimits = {
    deployed: MINIMUM_VERIFICATION_GAS_LIMIT,
    undeployed: MINIMUM_UNDEPLOY_VERIFICATION_GAS_LIMIT,
  }

  const chainLimits =
    chainId !== undefined && chainId in chainSpecificLimits
      ? chainSpecificLimits[chainId]
      : defaultLimits

  return deployed ? chainLimits.deployed : chainLimits.undeployed
}
