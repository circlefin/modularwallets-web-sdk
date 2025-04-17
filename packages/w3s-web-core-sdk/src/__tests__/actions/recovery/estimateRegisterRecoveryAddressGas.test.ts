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
  createBundlerClient,
  toWebAuthnAccount,
} from 'viem/account-abstraction'
import * as viemAccountAbstraction from 'viem/account-abstraction'
import { polygonAmoy } from 'viem/chains'

import {
  EstimateRecoveryUserOperationResponseMock,
  EstimateRegisterRecoveryAddressGasMockParameters,
  LoginCredentialMock,
  RecoveryCallDataMock,
  toModularTransport,
  toPasskeyTransport,
} from '../../../__mocks__'
import { toCircleSmartAccount, toWebAuthnCredential } from '../../../accounts'
import { estimateRegisterRecoveryAddressGas } from '../../../actions'
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

beforeAll(async () => {
  mockNavigatorGet.mockResolvedValue(LoginCredentialMock)
  credential = await toWebAuthnCredential(loginParameters)
  owner = toWebAuthnAccount({ credential })
})

describe('Actions > recovery > estimateRegisterRecoveryAddressGas', () => {
  beforeEach(() => {
    fetchMock.enableMocks()

    // Mock the estimateUserOperationGas function from the imported module
    jest
      .spyOn(viemAccountAbstraction, 'estimateUserOperationGas')
      .mockResolvedValue(EstimateRecoveryUserOperationResponseMock)
  })

  afterEach(() => {
    fetchMock.resetMocks()
    jest.restoreAllMocks()
  })

  it('should return the estimated gas values result', async () => {
    const account = await toCircleSmartAccount({
      client,
      owner,
    })

    const result = await estimateRegisterRecoveryAddressGas(client, {
      account,
      ...EstimateRegisterRecoveryAddressGasMockParameters,
    })

    // Verify the module function was called
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
})
