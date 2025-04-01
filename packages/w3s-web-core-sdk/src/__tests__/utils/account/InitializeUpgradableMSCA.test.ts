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
import { toWebAuthnAccount } from 'viem/account-abstraction'

import { LoginCredentialMock, toPasskeyTransport } from '../../../__mocks__'
import {
  CIRCLE_PLUGIN_INSTALL_DATA_ABI,
  INITIALIZING_DATA_ABI_PARAMS,
} from '../../../abis'
import { toWebAuthnCredential } from '../../../accounts'
import {
  CIRCLE_WEIGHTED_WEB_AUTHN_MULTISIG_PLUGIN,
  OWNER_WEIGHTS,
  THRESHOLD_WEIGHT,
  UPGRADABLE_MSCA,
} from '../../../constants'
import { WebAuthnMode } from '../../../types'
import {
  getInitializeUpgradableMSCAData,
  getInitializeUpgradableMSCAParams,
  getPublicKeyParamsFromOwner,
} from '../../../utils'

describe('Utils > account > initializeUpgradableMSCA > getInitializeUpgradableMSCAData', () => {
  it('should return the correct encoded initializeUpgradableMSCA function data', async () => {
    const passkeyTransport = toPasskeyTransport()

    jest
      .spyOn(window.navigator.credentials, 'get')
      .mockResolvedValueOnce(LoginCredentialMock)
    const credential = await toWebAuthnCredential({
      transport: passkeyTransport,
      mode: WebAuthnMode.Login,
    })
    const owner = toWebAuthnAccount({ credential })
    const initializeUpgradableMSCAData = getInitializeUpgradableMSCAData(owner)

    const { initialPublicKeyOwners } = getPublicKeyParamsFromOwner(owner)
    const pluginInstallParams = encodeAbiParameters(
      CIRCLE_PLUGIN_INSTALL_DATA_ABI,
      [[], [], initialPublicKeyOwners, OWNER_WEIGHTS, THRESHOLD_WEIGHT],
    )

    const expectedEncodedResult = encodeFunctionData({
      abi: UPGRADABLE_MSCA.abi,
      functionName: 'initializeUpgradableMSCA',
      args: [
        [CIRCLE_WEIGHTED_WEB_AUTHN_MULTISIG_PLUGIN.address],
        [CIRCLE_WEIGHTED_WEB_AUTHN_MULTISIG_PLUGIN.manifestHash],
        [pluginInstallParams],
      ],
    })

    expect(initializeUpgradableMSCAData).toBe(expectedEncodedResult)
  })
})

describe('Utils > account > initializeUpgradableMSCA > getInitializeUpgradableMSCAParams', () => {
  it('should return the correct initializing data', async () => {
    const passkeyTransport = toPasskeyTransport()

    jest
      .spyOn(window.navigator.credentials, 'get')
      .mockResolvedValueOnce(LoginCredentialMock)
    const credential = await toWebAuthnCredential({
      transport: passkeyTransport,
      mode: WebAuthnMode.Login,
    })
    const owner = toWebAuthnAccount({ credential })
    const initializeUpgradableMSCAParams =
      getInitializeUpgradableMSCAParams(owner)

    const { initialPublicKeyOwners } = getPublicKeyParamsFromOwner(owner)
    const pluginInstallParams = encodeAbiParameters(
      CIRCLE_PLUGIN_INSTALL_DATA_ABI,
      [[], [], initialPublicKeyOwners, OWNER_WEIGHTS, THRESHOLD_WEIGHT],
    )

    const expectedEncodedResult = encodeAbiParameters(
      INITIALIZING_DATA_ABI_PARAMS,
      [
        [CIRCLE_WEIGHTED_WEB_AUTHN_MULTISIG_PLUGIN.address],
        [CIRCLE_WEIGHTED_WEB_AUTHN_MULTISIG_PLUGIN.manifestHash],
        [pluginInstallParams],
      ],
    )

    expect(initializeUpgradableMSCAParams).toBe(expectedEncodedResult)
  })
})
