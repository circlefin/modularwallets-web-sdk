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

import * as viem from 'viem'
import { encodeFunctionData } from 'viem'
import {
  createBundlerClient,
  toWebAuthnAccount,
} from 'viem/account-abstraction'
import * as viemAccountAbstraction from 'viem/account-abstraction'
import { polygonAmoy } from 'viem/chains'
import * as webauthnp256 from 'webauthn-p256'
import { parsePublicKey } from 'webauthn-p256'

import {
  EstimateRecoveryUserOperationResponseMock,
  RecoveryCallDataMock,
  PublicKeyParsedMock,
  RegistrationCredentialMock,
  toModularTransport,
  toPasskeyTransport,
} from '../../../__mocks__'
import { CIRCLE_PLUGIN_ADD_OWNERS_ABI } from '../../../abis'
import { toCircleSmartAccount, toWebAuthnCredential } from '../../../accounts'
import { estimateExecuteRecoveryGas } from '../../../actions'
import { AccountType, WebAuthnMode } from '../../../types'

import type {
  ToWebAuthnAccountParameters,
  WebAuthnCredential,
} from '../../../types'
import type { WebAuthnAccount } from 'viem/account-abstraction'

const mockNavigatorGet = globalThis.window.navigator.credentials[
  'get'
] as jest.Mock

const passkeyTransport = toPasskeyTransport()
const modularTransport = toModularTransport({
  accountType: AccountType.WebAuthn,
})
const loginParameters: ToWebAuthnAccountParameters = {
  transport: passkeyTransport,
  mode: WebAuthnMode.Login,
}

const client = createBundlerClient({
  transport: modularTransport,
  chain: polygonAmoy,
})

let credential: WebAuthnCredential
let owner: WebAuthnAccount
let account: viemAccountAbstraction.SmartAccount

beforeAll(async () => {
  mockNavigatorGet.mockResolvedValue(RegistrationCredentialMock)
  credential = await toWebAuthnCredential(loginParameters)
  owner = toWebAuthnAccount({ credential })
})

describe('Actions > recovery > estimateExecuteRecoveryGas', () => {
  beforeEach(async () => {
    fetchMock.enableMocks()

    // Create account for testing
    account = await toCircleSmartAccount({
      client,
      owner,
    })
    // Mock the encodeFunctionData function
    jest.spyOn(viem, 'encodeFunctionData').mockReturnValue(RecoveryCallDataMock)

    // Mock the estimateUserOperationGas function
    jest
      .spyOn(viemAccountAbstraction, 'estimateUserOperationGas')
      .mockResolvedValue(EstimateRecoveryUserOperationResponseMock)

    // Mock the parsePublicKey function
    jest
      .spyOn(webauthnp256, 'parsePublicKey')
      .mockReturnValue(PublicKeyParsedMock)
  })

  afterEach(() => {
    fetchMock.resetMocks()
    jest.restoreAllMocks()
  })

  it('should return the estimated gas values for execute recovery', async () => {
    const result = await estimateExecuteRecoveryGas(client, {
      account,
      credential,
    })

    // Verify parsePublicKey was called with credential.publicKey
    expect(parsePublicKey).toHaveBeenCalledWith(credential.publicKey)

    // Verify encodeFunctionData was called with correct parameters
    expect(encodeFunctionData).toHaveBeenCalledWith({
      abi: CIRCLE_PLUGIN_ADD_OWNERS_ABI,
      functionName: 'addOwners',
      args: [
        [], // ownersToAdd
        [], // weightsToAdd
        [PublicKeyParsedMock], // publicKeyOwnersToAdd
        [BigInt(1)], // publicKeyWeightsToAdd
        BigInt(1), // newThresholdWeight
      ],
    })

    // Verify estimateUserOperationGas was called with correct parameters
    expect(
      viemAccountAbstraction.estimateUserOperationGas,
    ).toHaveBeenCalledWith(
      client,
      expect.objectContaining({
        account,
        callData: RecoveryCallDataMock,
      }),
    )

    // Verify the result
    expect(result).toEqual(EstimateRecoveryUserOperationResponseMock)
  })

  it('should pass through additional userOp parameters', async () => {
    const additionalParams = {
      maxFeePerGas: 1000000000n,
      maxPriorityFeePerGas: 100000000n,
    }

    await estimateExecuteRecoveryGas(client, {
      account,
      credential,
      ...additionalParams,
    })

    // Verify the additional parameters were passed through
    expect(
      viemAccountAbstraction.estimateUserOperationGas,
    ).toHaveBeenCalledWith(
      client,
      expect.objectContaining({
        ...additionalParams,
        callData: RecoveryCallDataMock,
      }),
    )
  })

  it('should work with client.account if params.account is not provided', async () => {
    const clientWithAccount = { ...client, account }

    await estimateExecuteRecoveryGas(clientWithAccount, {
      credential,
    })

    // Verify estimateUserOperationGas was called using client.account
    expect(
      viemAccountAbstraction.estimateUserOperationGas,
    ).toHaveBeenCalledWith(
      clientWithAccount,
      expect.objectContaining({
        callData: RecoveryCallDataMock,
      }),
    )
  })

  it('should propagate errors from estimateUserOperationGas', async () => {
    const errorMessage = 'Estimation failed'
    jest
      .spyOn(viemAccountAbstraction, 'estimateUserOperationGas')
      .mockRejectedValueOnce(new Error(errorMessage))

    await expect(
      estimateExecuteRecoveryGas(client, {
        account,
        credential,
      }),
    ).rejects.toThrow(errorMessage)
  })
})
