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

import { encodeAbiParameters, encodeFunctionData } from 'viem'

import { INITIALIZING_DATA_ABI_PARAMS } from '../../abis'
import {
  CIRCLE_WEIGHTED_WEB_AUTHN_MULTISIG_PLUGIN,
  UPGRADABLE_MSCA,
} from '../../constants'

import { getPluginInstallParams } from './getPluginInstallParams'

import type { Hex, LocalAccount } from 'viem'
import type { WebAuthnAccount } from 'viem/account-abstraction'

/**
 * Gets the encoded initializeUpgradableMSCA function data from an owner.
 * @param owner - The owner.
 * @returns The encoded initializeUpgradableMSCA function data.
 */
export function getInitializeUpgradableMSCAData(
  owner: WebAuthnAccount | LocalAccount,
): Hex {
  const pluginInstallParams = getPluginInstallParams(owner)

  return encodeFunctionData({
    abi: UPGRADABLE_MSCA.abi,
    functionName: 'initializeUpgradableMSCA',
    args: [
      [CIRCLE_WEIGHTED_WEB_AUTHN_MULTISIG_PLUGIN.address],
      [CIRCLE_WEIGHTED_WEB_AUTHN_MULTISIG_PLUGIN.manifestHash],
      [pluginInstallParams],
    ],
  })
}

/**
 * Gets the encoded initializeUpgradableMSCA function parameters from an owner.
 * @param owner - The owner.
 * @returns The encoded initializeUpgradableMSCA function parameters.
 */
export function getInitializeUpgradableMSCAParams(
  owner: LocalAccount | WebAuthnAccount,
): Hex {
  const pluginInstallParams = getPluginInstallParams(owner)

  return encodeAbiParameters(INITIALIZING_DATA_ABI_PARAMS, [
    [CIRCLE_WEIGHTED_WEB_AUTHN_MULTISIG_PLUGIN.address],
    [CIRCLE_WEIGHTED_WEB_AUTHN_MULTISIG_PLUGIN.manifestHash],
    [pluginInstallParams],
  ])
}
