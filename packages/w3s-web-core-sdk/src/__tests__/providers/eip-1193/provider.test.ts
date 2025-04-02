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

import { createPublicClient, http } from 'viem'
import {
  createBundlerClient,
  toWebAuthnAccount,
} from 'viem/account-abstraction'
import { sepolia } from 'viem/chains'
import { MethodNotImplementedError } from 'web3-errors'

import {
  LoginCredentialMock,
  toModularTransport,
  toPasskeyTransport,
} from '../../../__mocks__'
import {
  EthAccountsResponse,
  GetTransactionReceiptParams,
  MockGetTransactionReceiptResponse,
  MockSendTransactionResponse,
  MockSendUserOperationResponse,
  MockWaitForUserOperationReceiptResponse,
  PersonalSignParams,
  PersonalSignResponse,
  PersonalSignWrongAddressParams,
  SendTransactionParams,
  SendTransactionToAddressMissingParams,
  SignTypedDataV4Params,
  SignTypedDataV4WrongAddressParams,
} from '../../../__mocks__/providers/eip-1193'
import { toCircleSmartAccount, toWebAuthnCredential } from '../../../accounts'
import { EIP1193Provider } from '../../../providers/eip-1193'
import { AccountType, WebAuthnMode } from '../../../types'

import type {
  ToCircleSmartAccountReturnType,
  ToWebAuthnAccountParameters,
  WebAuthnCredential,
} from '../../../types'
import type { BundlerClient, WebAuthnAccount } from 'viem/account-abstraction'

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

let bundlerClient: BundlerClient
let provider: EIP1193Provider

const modularTransport = toModularTransport({
  accountType: AccountType.WebAuthn,
})
const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
})
let account: ToCircleSmartAccountReturnType

beforeAll(async () => {
  mockNavigatorGet.mockResolvedValue(LoginCredentialMock)
  credential = await toWebAuthnCredential(loginParameters)
  owner = toWebAuthnAccount({ credential })

  account = await toCircleSmartAccount({
    client: publicClient,
    owner,
  })
})

describe('Providers > eip-1193 > EIP1193Provider > constructor and inherited methods', () => {
  it('should be defined', () => {
    expect(EIP1193Provider).toBeDefined()
  })

  it('should be a function', () => {
    expect(typeof EIP1193Provider).toBe('function')
  })

  it('should throw an error when the bundler account is not provided', () => {
    bundlerClient = createBundlerClient({
      chain: sepolia,
      transport: modularTransport,
    })

    expect(() => new EIP1193Provider(bundlerClient, publicClient)).toThrow(
      new Error('Account is required'),
    )
  })

  it('should create an instance correctly', () => {
    bundlerClient = createBundlerClient({
      account,
      chain: sepolia,
      transport: modularTransport,
    })

    provider = new EIP1193Provider(bundlerClient, publicClient)
    expect(provider).toBeInstanceOf(EIP1193Provider)
  })

  it('should throw MethodNotImplementedError for unsupported methods', async () => {
    const mockPayload = {
      method: 'unsupported_method',
    }

    await expect(provider.request(mockPayload)).rejects.toThrow(
      MethodNotImplementedError,
    )
  })

  it('should return false for supportsSubscriptions', () => {
    expect(provider.supportsSubscriptions()).toBe(false)
  })

  it('should throw MethodNotImplementedError when calling any of the mandatory abstract methods', () => {
    expect(() => provider.getStatus()).toThrow(MethodNotImplementedError)
    expect(() => provider.on()).toThrow(MethodNotImplementedError)
    expect(() => provider.removeListener()).toThrow(MethodNotImplementedError)
    expect(() => provider.once()).toThrow(MethodNotImplementedError)
    expect(() => provider.removeAllListeners()).toThrow(
      MethodNotImplementedError,
    )
    expect(() => provider.connect()).toThrow(MethodNotImplementedError)
    expect(() => provider.disconnect()).toThrow(MethodNotImplementedError)
    expect(() => provider.reset()).toThrow(MethodNotImplementedError)
    expect(() => provider.reconnect()).toThrow(MethodNotImplementedError)
  })
})

describe('Providers > eip-1193 > EIP1193Provider > rpc methods', () => {
  beforeEach(() => {
    bundlerClient = createBundlerClient({
      account,
      chain: sepolia,
      transport: modularTransport,
    })

    provider = new EIP1193Provider(bundlerClient, publicClient)
  })

  it('should return the correct response for eth_accounts', async () => {
    const mockPayload = { method: 'eth_accounts' }

    const response = await provider.request<string, typeof EthAccountsResponse>(
      mockPayload,
    )

    expect(response).toEqual(EthAccountsResponse)
  })

  it('should return the correct response for eth_requestAccounts', async () => {
    const mockPayload = { method: 'eth_requestAccounts' }

    const response = await provider.request<string, typeof EthAccountsResponse>(
      mockPayload,
    )

    expect(response).toEqual(EthAccountsResponse)
  })

  it('should throw an error when the addresses are different for personal_sign', async () => {
    const mockPayload = {
      method: 'personal_sign',
      params: PersonalSignWrongAddressParams,
    }

    await expect(() => provider.request(mockPayload)).rejects.toThrow(
      new Error('Invalid account'),
    )
  })

  it('should return the correct response for personal_sign', async () => {
    const mockPayload = {
      method: 'personal_sign',
      params: PersonalSignParams,
    }

    const response = await provider.request<
      string,
      typeof PersonalSignResponse
    >(mockPayload)

    expect(response).toEqual(PersonalSignResponse)
  })

  it('should throw an error when the to parameter is not provided for eth_sendTransaction', async () => {
    const mockPayload = {
      method: 'eth_sendTransaction',
      params: SendTransactionToAddressMissingParams,
    }

    await expect(() => provider.request(mockPayload)).rejects.toThrow(
      new Error('Missing to address'),
    )
  })

  it('should return the correct response for eth_sendTransaction', async () => {
    const mockPayload = {
      method: 'eth_sendTransaction',
      params: SendTransactionParams,
    }

    // Spy on `sendUserOperation` and `waitForUserOperationReceipt`
    const sendUserOperationSpy = jest
      .spyOn(bundlerClient, 'sendUserOperation')
      .mockResolvedValue(MockSendUserOperationResponse)
    const waitForUserOperationReceiptSpy = jest
      .spyOn(bundlerClient, 'waitForUserOperationReceipt')
      .mockResolvedValue(MockWaitForUserOperationReceiptResponse as never)

    const response = await provider.request<
      string,
      typeof MockSendTransactionResponse
    >(mockPayload)

    expect(sendUserOperationSpy).toHaveBeenCalledWith({
      calls: [
        {
          to: SendTransactionParams[0].to,
          value: SendTransactionParams[0].value,
          data: SendTransactionParams[0].data,
        },
      ],
      account: bundlerClient.account,
    })
    expect(waitForUserOperationReceiptSpy).toHaveBeenCalledWith({
      hash: MockSendUserOperationResponse,
    })

    expect(response).toEqual(MockSendTransactionResponse)

    sendUserOperationSpy.mockRestore()
    waitForUserOperationReceiptSpy.mockRestore()
  })

  it('should return the correct response when value is not provided for eth_sendTransaction', async () => {
    const mockPayload = {
      method: 'eth_sendTransaction',
      params: [
        {
          ...SendTransactionParams[0],
          value: undefined,
        },
      ],
    }

    // Spy on `sendUserOperation` and `waitForUserOperationReceipt`
    const sendUserOperationSpy = jest
      .spyOn(bundlerClient, 'sendUserOperation')
      .mockResolvedValue(MockSendUserOperationResponse)
    const waitForUserOperationReceiptSpy = jest
      .spyOn(bundlerClient, 'waitForUserOperationReceipt')
      .mockResolvedValue(MockWaitForUserOperationReceiptResponse as never)

    const response = await provider.request<
      string,
      typeof MockSendTransactionResponse
    >(mockPayload)

    expect(sendUserOperationSpy).toHaveBeenCalledWith({
      calls: [
        {
          to: SendTransactionParams[0].to,
          value: BigInt(0),
          data: SendTransactionParams[0].data,
        },
      ],
      account: bundlerClient.account,
    })
    expect(waitForUserOperationReceiptSpy).toHaveBeenCalledWith({
      hash: MockSendUserOperationResponse,
    })

    expect(response).toEqual(MockSendTransactionResponse)

    sendUserOperationSpy.mockRestore()
    waitForUserOperationReceiptSpy.mockRestore()
  })

  it('should return the correct response when data is not provided for eth_sendTransaction', async () => {
    const mockPayload = {
      method: 'eth_sendTransaction',
      params: [
        {
          ...SendTransactionParams[0],
          data: undefined,
        },
      ],
    }

    // Spy on `sendUserOperation` and `waitForUserOperationReceipt`
    const sendUserOperationSpy = jest
      .spyOn(bundlerClient, 'sendUserOperation')
      .mockResolvedValue(MockSendUserOperationResponse)
    const waitForUserOperationReceiptSpy = jest
      .spyOn(bundlerClient, 'waitForUserOperationReceipt')
      .mockResolvedValue(MockWaitForUserOperationReceiptResponse as never)

    const response = await provider.request<
      string,
      typeof MockSendTransactionResponse
    >(mockPayload)

    expect(sendUserOperationSpy).toHaveBeenCalledWith({
      calls: [
        {
          to: SendTransactionParams[0].to,
          value: SendTransactionParams[0].value,
          data: '0x',
        },
      ],
      account: bundlerClient.account,
    })
    expect(waitForUserOperationReceiptSpy).toHaveBeenCalledWith({
      hash: MockSendUserOperationResponse,
    })

    expect(response).toEqual(MockSendTransactionResponse)

    sendUserOperationSpy.mockRestore()
    waitForUserOperationReceiptSpy.mockRestore()
  })

  it('should return the correct response for eth_getTransactionReceipt', async () => {
    const mockPayload = {
      method: 'eth_getTransactionReceipt',
      params: GetTransactionReceiptParams,
    }

    // Spy on `waitForTransactionReceipt`
    const waitForGetTransactionReceiptSpy = jest
      .spyOn(publicClient, 'waitForTransactionReceipt')
      .mockResolvedValue(MockWaitForUserOperationReceiptResponse as never)

    const response = await provider.request<
      string,
      typeof MockGetTransactionReceiptResponse
    >(mockPayload)

    expect(waitForGetTransactionReceiptSpy).toHaveBeenCalledWith({
      hash: GetTransactionReceiptParams[0],
    })

    expect(response).toEqual(MockGetTransactionReceiptResponse)

    waitForGetTransactionReceiptSpy.mockRestore()
  })

  it('should throw an error when the addresses are different for eth_signTypedData_v4', async () => {
    const mockPayload = {
      method: 'eth_signTypedData_v4',
      params: SignTypedDataV4WrongAddressParams,
    }

    await expect(() => provider.request(mockPayload)).rejects.toThrow(
      new Error('Invalid account'),
    )
  })

  it('should return the correct response for eth_signTypedData_v4', async () => {
    const mockPayload = {
      method: 'eth_signTypedData_v4',
      params: SignTypedDataV4Params,
    }

    const response = await provider.request<
      string,
      typeof PersonalSignResponse
    >(mockPayload)

    expect(response).toEqual(PersonalSignResponse)
  })

  it('should forward the rpc requests to the bundler client when the method is not handled by itself', async () => {
    const mockPayload = {
      method: 'unsupported_method',
    }

    // Spy on `request`
    const requestSpy = jest
      .spyOn(bundlerClient.transport, 'request')
      .mockResolvedValue({} as never)

    await provider.request(mockPayload)

    expect(requestSpy).toHaveBeenCalledWith(mockPayload)

    requestSpy.mockRestore()
  })
})
