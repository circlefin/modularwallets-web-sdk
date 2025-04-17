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

import { encodeFunctionData, RpcError } from 'viem'
import * as viem from 'viem'
import {
  createBundlerClient,
  toWebAuthnAccount,
} from 'viem/account-abstraction'
import * as viemAccountAbstraction from 'viem/account-abstraction'
import { polygonAmoy } from 'viem/chains'

import {
  LoginCredentialMock,
  RegisterRecoveryAddressMockParameters,
  RecoveryUserOperationHashResponseMock,
  toModularTransport,
  toPasskeyTransport,
  RecoveryAddressMock,
} from '../../../__mocks__'
import { CIRCLE_PLUGIN_ADD_OWNERS_ABI } from '../../../abis'
import { toCircleSmartAccount, toWebAuthnCredential } from '../../../accounts'
import { registerRecoveryAddress } from '../../../actions'
import { createAddressMapping } from '../../../actions/modularWallets'
import { AccountType, OwnerIdentifierType, WebAuthnMode } from '../../../types'
import { ErrorCodes } from '../../../utils'

import type {
  ToWebAuthnAccountParameters,
  WebAuthnCredential,
} from '../../../types'
import type { WebAuthnAccount } from 'viem/account-abstraction'

// Mock modules
jest.mock('../../../actions/modularWallets/createAddressMapping', () => ({
  createAddressMapping: jest.fn(),
}))

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
  mockNavigatorGet.mockResolvedValue(LoginCredentialMock)
  credential = await toWebAuthnCredential(loginParameters)
  owner = toWebAuthnAccount({ credential })
})

describe('Actions > recovery > registerRecoveryAddress', () => {
  beforeEach(async () => {
    fetchMock.enableMocks()

    // Mock account creation
    account = await toCircleSmartAccount({
      client,
      owner,
    })

    // Mock the sendUserOperation function
    jest
      .spyOn(viemAccountAbstraction, 'sendUserOperation')
      .mockResolvedValue(RecoveryUserOperationHashResponseMock)

    // Mock the createAddressMapping function
    const mockCreateAddressMapping = createAddressMapping as jest.Mock
    mockCreateAddressMapping.mockResolvedValue(undefined)
    // Mock encodeFunctionData
    jest.spyOn(viem, 'encodeFunctionData').mockReturnValue('0x123456')
  })

  afterEach(() => {
    fetchMock.resetMocks()
    jest.restoreAllMocks()
  })

  it('should successfully register a recovery address', async () => {
    const result = await registerRecoveryAddress(client, {
      account,
      ...RegisterRecoveryAddressMockParameters,
    })

    // Verify createAddressMapping was called with correct parameters
    expect(createAddressMapping).toHaveBeenCalledWith(client, {
      walletAddress: account.address,
      owners: [
        {
          type: OwnerIdentifierType.EOA,
          identifier: {
            address: RegisterRecoveryAddressMockParameters.recoveryAddress,
          },
        },
      ],
    })

    // Verify encodeFunctionData was called with correct parameters
    expect(encodeFunctionData).toHaveBeenCalledWith({
      abi: CIRCLE_PLUGIN_ADD_OWNERS_ABI,
      functionName: 'addOwners',
      args: [[RecoveryAddressMock], [BigInt(1)], [], [], BigInt(0)],
    })

    // Verify sendUserOperation was called with correct parameters
    expect(viemAccountAbstraction.sendUserOperation).toHaveBeenCalledWith(
      client,
      expect.objectContaining({
        callData: '0x123456',
        account,
      }),
    )

    // Verify the result
    expect(result).toEqual(RecoveryUserOperationHashResponseMock)
  })

  it('should continue if address mapping already exists', async () => {
    // Mock createAddressMapping to throw ALREADY_KNOWN error
    const mockCreateAddressMapping = createAddressMapping as jest.Mock
    const rpcError = new RpcError(new Error('Address mapping already exists'), {
      code: ErrorCodes.ALREADY_KNOWN,
      shortMessage: 'Address mapping already exists',
    })
    mockCreateAddressMapping.mockRejectedValue(rpcError)

    const result = await registerRecoveryAddress(client, {
      account,
      recoveryAddress: RecoveryAddressMock,
    })

    // Verify createAddressMapping was called
    expect(createAddressMapping).toHaveBeenCalled()

    // Verify the operation continued despite the error
    expect(viemAccountAbstraction.sendUserOperation).toHaveBeenCalled()

    // Verify the result
    expect(result).toEqual(RecoveryUserOperationHashResponseMock)
  })

  it('should throw an error when both client.account and params.account are undefined', async () => {
    const clientWithoutAccount = { ...client, account: undefined }

    await expect(
      registerRecoveryAddress(clientWithoutAccount, {
        recoveryAddress: RecoveryAddressMock,
      } as never),
    ).rejects.toThrow('Account is required')
  })

  it('should use client.account when params.account is not provided', async () => {
    const clientWithAccount = { ...client, account }

    await registerRecoveryAddress(clientWithAccount, {
      recoveryAddress: RecoveryAddressMock,
    })

    // Verify createAddressMapping was called with the client's account
    expect(createAddressMapping).toHaveBeenCalledWith(
      clientWithAccount,
      expect.objectContaining({
        walletAddress: account.address,
      }),
    )
  })

  it('should use params.account when client.account is not provided', async () => {
    const clientWithoutAccount = { ...client, account: undefined }

    await registerRecoveryAddress(clientWithoutAccount, {
      account,
      recoveryAddress: RecoveryAddressMock,
    })

    // Verify createAddressMapping was called with the provided account
    expect(createAddressMapping).toHaveBeenCalledWith(
      clientWithoutAccount,
      expect.objectContaining({
        walletAddress: account.address,
      }),
    )
  })

  it('should rethrow non-ADDRESS_MAPPING_ALREADY_EXISTS errors from createAddressMapping', async () => {
    const mockCreateAddressMapping = createAddressMapping as jest.Mock
    const genericError = new Error('Some other error')
    mockCreateAddressMapping.mockRejectedValue(genericError)

    await expect(
      registerRecoveryAddress(client, {
        account,
        recoveryAddress: RecoveryAddressMock,
      }),
    ).rejects.toThrow(
      'Failed to register the recovery address. Please try again.',
    )

    // Verify sendUserOperation was not called after the error
    expect(viemAccountAbstraction.sendUserOperation).not.toHaveBeenCalled()
  })
})
