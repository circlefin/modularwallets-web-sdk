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

import { createPublicClient } from 'viem'
import { toWebAuthnAccount } from 'viem/account-abstraction'
import { sepolia } from 'viem/chains'

import {
  GetAddressResult,
  GetAddressResultForValidationError,
  LoginCredentialMock,
  toModularTransport,
  toPasskeyTransport,
} from '../../../__mocks__'
import {
  getModularWalletAddress,
  toCircleSmartAccount,
  toWebAuthnCredential,
} from '../../../accounts'
import { WebAuthnMode } from '../../../types'

import type {
  ToWebAuthnAccountParameters,
  WebAuthnCredential,
} from '../../../types'
import type { WebAuthnAccount } from 'viem/account-abstraction'

const mockNavigatorGet = globalThis.window.navigator.credentials[
  'get'
] as jest.Mock

const passkeyTransport = toPasskeyTransport()
const loginParameters: ToWebAuthnAccountParameters = {
  transport: passkeyTransport,
  mode: WebAuthnMode.Login,
}

let credential: WebAuthnCredential
let owner: WebAuthnAccount

beforeAll(async () => {
  mockNavigatorGet.mockResolvedValue(LoginCredentialMock)
  credential = await toWebAuthnCredential(loginParameters)
  owner = toWebAuthnAccount({ credential })
})

jest.mock('../../../accounts/implementations/getModularWalletAddress', () => ({
  getModularWalletAddress: jest.fn(),
}))

describe('Accounts > implementations > toCircleSmartAccount > address validation', () => {
  const mockedGetModularWalletAddress =
    getModularWalletAddress as jest.MockedFunction<
      typeof getModularWalletAddress
    >

  it('should return the client instance if the addresses match', async () => {
    mockedGetModularWalletAddress.mockResolvedValueOnce(GetAddressResult)

    const transport = toModularTransport()
    const client = createPublicClient({
      transport,
      chain: sepolia,
    })

    const circleSmartAccount = await toCircleSmartAccount({
      client,
      owner,
    })

    expect(circleSmartAccount).toBeDefined()
  })

  it('should throw an error if the addresses do not match', async () => {
    mockedGetModularWalletAddress.mockResolvedValueOnce(
      GetAddressResultForValidationError,
    )

    const transport = toModularTransport()
    const client = createPublicClient({
      transport,
      chain: sepolia,
    })

    await expect(
      toCircleSmartAccount({
        client,
        owner,
      }),
    ).rejects.toThrow('Address mismatch')
  })
})
