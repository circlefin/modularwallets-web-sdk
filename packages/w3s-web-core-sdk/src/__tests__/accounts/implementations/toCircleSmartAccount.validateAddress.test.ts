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
import { privateKeyToAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains'

import {
  GetAddressResult,
  GetAddressResultForValidationError,
  getMockOwners,
  LoginCredentialMock,
  MockEoaAccount,
  toModularTransport,
  toPasskeyTransport,
} from '../../../__mocks__'
import {
  getModularWalletAddress,
  toCircleSmartAccount,
  toWebAuthnCredential,
} from '../../../accounts'
import { WebAuthnMode, AccountType } from '../../../types'
import { computeAddress } from '../../../utils/address/computeAddress'

import type {
  ToWebAuthnAccountParameters,
  WebAuthnCredential,
} from '../../../types'
import type { LocalAccount } from 'viem'
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
let localOwner: LocalAccount
const owners = getMockOwners({
  [AccountType.WebAuthn]: () => owner,
  [AccountType.Local]: () => localOwner,
})

beforeAll(async () => {
  mockNavigatorGet.mockResolvedValue(LoginCredentialMock)
  credential = await toWebAuthnCredential(loginParameters)
  owner = toWebAuthnAccount({ credential })
  localOwner = privateKeyToAccount(MockEoaAccount.privateKey)
})

jest.mock('../../../accounts/implementations/getModularWalletAddress', () => ({
  getModularWalletAddress: jest.fn(),
}))

// Use a separate mock for just the computeAddress function
jest.mock('../../../utils/address/computeAddress', () => ({
  computeAddress: jest.fn(),
}))

describe('Accounts > implementations > toCircleSmartAccount > address resolution', () => {
  const mockedGetModularWalletAddress =
    getModularWalletAddress as jest.MockedFunction<
      typeof getModularWalletAddress
    >

  const mockedComputeAddress = computeAddress as jest.MockedFunction<
    typeof computeAddress
  >

  beforeEach(() => {
    jest.clearAllMocks()
    // Reset the mock for computeAddress between tests
    mockedComputeAddress.mockReset()
  })

  it.each(owners)(
    'should use the Circle Modular Wallet API address when available $description',
    async ({ getOwner }) => {
      expect(getOwner()).toBeDefined()
      const owner = getOwner()

      // Mock the modular wallet address API response
      mockedGetModularWalletAddress.mockResolvedValueOnce(
        GetAddressResult[owner.type],
      )

      const transport = toModularTransport({
        accountType: owner.type as AccountType,
      })
      const client = createPublicClient({
        transport,
        chain: sepolia,
      })

      const circleSmartAccount = await toCircleSmartAccount({
        client,
        owner,
      })

      expect(circleSmartAccount).toBeDefined()

      // Get the address from the smart account to verify it's using the Circle API address
      const address = await circleSmartAccount.getAddress()

      // The return value should be an Address from viem which is guaranteed to be Hex type
      expect(address).toBe(GetAddressResult[owner.type].address)

      // Verify our computeAddress function was not called since we're using Circle API
      expect(mockedComputeAddress).not.toHaveBeenCalled()
    },
  )

  it.each(owners)(
    'should use the Circle-provided address even when different from computed address $description',
    async ({ getOwner }) => {
      expect(getOwner()).toBeDefined()
      const owner = getOwner()

      // Mock the modular wallet address API to return a different address
      mockedGetModularWalletAddress.mockResolvedValueOnce(
        GetAddressResultForValidationError,
      )

      // Mock the compute address function to return what would have been the "expected" address
      mockedComputeAddress.mockReturnValue(GetAddressResult[owner.type].address)

      const transport = toModularTransport({
        accountType: owner.type as AccountType,
      })
      const client = createPublicClient({
        transport,
        chain: sepolia,
      })

      const circleSmartAccount = await toCircleSmartAccount({
        client,
        owner,
      })

      expect(circleSmartAccount).toBeDefined()

      // Get the address from the smart account
      const address = await circleSmartAccount.getAddress()

      // Verify it's using the address from the modular wallet API
      // even though it's different from what computeAddress would return
      expect(address).toBe(GetAddressResultForValidationError.address)
      expect(address).not.toBe(GetAddressResult[owner.type].address)

      // Verify computeAddress was not called - it was mocked but not called by the implementation
      expect(mockedComputeAddress).not.toHaveBeenCalled()
    },
  )
})
