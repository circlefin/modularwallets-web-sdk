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

import { encodeAbiParameters } from 'viem'

import { CIRCLE_PLUGIN_INSTALL_DATA_ABI } from '../../abis'
import { OWNER_WEIGHTS, THRESHOLD_WEIGHT } from '../../constants'
import { isWebAuthnOwner } from '../smartAccount'

import { getPublicKeyParamsFromOwner } from './getPublicKeyParamsFromOwner'

import type { Hex, LocalAccount } from 'viem'
import type { WebAuthnAccount } from 'viem/account-abstraction'

/**
 * Get the encoded plugin installation parameters.
 * @param owner - The owner.
 * @returns The encoded plugin installation parameters.
 */
export function getPluginInstallParams(
  owner: WebAuthnAccount | LocalAccount,
): Hex {
  return isWebAuthnOwner(owner)
    ? encodeAbiParameters(CIRCLE_PLUGIN_INSTALL_DATA_ABI, [
        [],
        [],
        getPublicKeyParamsFromOwner(owner).initialPublicKeyOwners,
        OWNER_WEIGHTS,
        THRESHOLD_WEIGHT,
      ])
    : encodeAbiParameters(CIRCLE_PLUGIN_INSTALL_DATA_ABI, [
        [owner.address],
        OWNER_WEIGHTS,
        [],
        [],
        THRESHOLD_WEIGHT,
      ])
}
