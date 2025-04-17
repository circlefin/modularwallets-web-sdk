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

import fetchMock from 'jest-fetch-mock'
import { InvalidProviderError, MethodNotImplementedError } from 'web3-errors'

import {
  BlockNumberResult,
  BlockResult,
  ChainIdResult,
  CreateAddressMappingResult,
  EntryPointsResult,
  EstimateUserOperationGasResult,
  EthCallResult,
  GasPriceResult,
  GetAddressMappingResult,
  GetAddressResult,
  GetBalanceResult,
  GetCodeResult,
  GetPaymasterDataResult,
  GetPaymasterStubDataResult,
  GetUserOperationReceiptResult,
  GetUserOperationResult,
  MaxPriorityFeePerGasResult,
  SendUserOperationResult,
} from '../../../__mocks__'
import { ModularWalletsProvider } from '../../../providers'
import { AccountType } from '../../../types/modularWallets'
import { getJsonRpcStringifyResponse } from '../../../utils'

const provider = new ModularWalletsProvider(
  'https://dev.api.com',
  'test-client-key',
)

describe('Providers > modular-wallets > ModularWalletsProvider', () => {
  it('should be defined', () => {
    expect(ModularWalletsProvider).toBeDefined()
  })

  it('should be a function', () => {
    expect(typeof ModularWalletsProvider).toBe('function')
  })

  it('should create an instance correctly', () => {
    expect(provider).toBeInstanceOf(ModularWalletsProvider)
  })

  it('should throw InvalidProviderError if the URL is invalid', () => {
    expect(
      () =>
        new ModularWalletsProvider(
          'http://example.com(This is a wrong url)',
          'test-client-key',
        ),
    ).toThrow(InvalidProviderError)
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

describe('Providers > modular-wallets > ModularWalletsProvider > fetchData', () => {
  beforeEach(() => {
    fetchMock.enableMocks()
  })

  afterEach(() => {
    fetchMock.resetMocks()
  })

  it('should fetch data successfully and return the correct response for eth_supportedEntryPoints', async () => {
    const mockPayload = { method: 'eth_supportedEntryPoints', id: 1 }

    fetchMock.mockResponseOnce(getJsonRpcStringifyResponse(EntryPointsResult))

    const response = await provider.request<string, typeof EntryPointsResult>(
      mockPayload,
    )

    expect(response).toEqual(EntryPointsResult)
  })

  it('should fetch data successfully and return the correct response for eth_sendUserOperation', async () => {
    const mockPayload = { method: 'eth_sendUserOperation', id: 2 }

    fetchMock.mockResponseOnce(
      getJsonRpcStringifyResponse(SendUserOperationResult),
    )

    const response = await provider.request<
      string,
      typeof SendUserOperationResult
    >(mockPayload)

    expect(response).toEqual(SendUserOperationResult)
  })

  it('should fetch data successfully and return the correct response for eth_estimateUserOperationGas', async () => {
    const mockPayload = { method: 'eth_estimateUserOperationGas', id: 3 }

    fetchMock.mockResponseOnce(
      getJsonRpcStringifyResponse(EstimateUserOperationGasResult),
    )

    const response = await provider.request<
      string,
      typeof EstimateUserOperationGasResult
    >(mockPayload)

    expect(response).toEqual(EstimateUserOperationGasResult)
  })

  it('should fetch data successfully and return the correct response for eth_getUserOperationByHash', async () => {
    const mockPayload = { method: 'eth_getUserOperationByHash', id: 4 }

    fetchMock.mockResponseOnce(
      getJsonRpcStringifyResponse(GetUserOperationResult),
    )

    const response = await provider.request<
      string,
      typeof GetUserOperationResult
    >(mockPayload)

    expect(response).toEqual(GetUserOperationResult)
  })

  it('should fetch data successfully and return the correct response for eth_getUserOperationReceipt', async () => {
    const mockPayload = { method: 'eth_getUserOperationReceipt', id: 5 }

    fetchMock.mockResponseOnce(
      getJsonRpcStringifyResponse(GetUserOperationReceiptResult),
    )

    const response = await provider.request<
      string,
      typeof GetUserOperationReceiptResult
    >(mockPayload)

    expect(response).toEqual(GetUserOperationReceiptResult)
  })

  it('should fetch data successfully and return the correct response for eth_chainId', async () => {
    const mockPayload = { method: 'eth_chainId', id: 6 }

    fetchMock.mockResponseOnce(getJsonRpcStringifyResponse(ChainIdResult))

    const response = await provider.request<string, typeof ChainIdResult>(
      mockPayload,
    )

    expect(response).toEqual(ChainIdResult)
  })

  it('should fetch data successfully and return the correct response for eth_getBalance', async () => {
    const mockPayload = { method: 'eth_getBalance', id: 7 }

    fetchMock.mockResponseOnce(getJsonRpcStringifyResponse(GetBalanceResult))

    const response = await provider.request<string, typeof GetBalanceResult>(
      mockPayload,
    )

    expect(response).toEqual(GetBalanceResult)
  })

  it('should fetch data successfully and return the correct response for eth_blockNumber', async () => {
    const mockPayload = { method: 'eth_blockNumber', id: 8 }

    fetchMock.mockResponseOnce(getJsonRpcStringifyResponse(BlockNumberResult))

    const response = await provider.request<string, typeof BlockNumberResult>(
      mockPayload,
    )

    expect(response).toEqual(BlockNumberResult)
  })

  it('should fetch data successfully and return the correct response for eth_call', async () => {
    const mockPayload = { method: 'eth_call', id: 9 }

    fetchMock.mockResponseOnce(getJsonRpcStringifyResponse(EthCallResult))

    const response = await provider.request<string, typeof EthCallResult>(
      mockPayload,
    )

    expect(response).toEqual(EthCallResult)
  })

  it('should fetch data successfully and return the correct response for eth_getBlockByNumber', async () => {
    const mockPayload = { method: 'eth_getBlockByNumber', id: 10 }

    fetchMock.mockResponseOnce(getJsonRpcStringifyResponse(BlockResult))

    const response = await provider.request<string, typeof BlockResult>(
      mockPayload,
    )

    expect(response).toEqual(BlockResult)
  })

  it('should fetch data successfully and return the correct response for eth_maxPriorityFeePerGas', async () => {
    const mockPayload = { method: 'eth_maxPriorityFeePerGas', id: 11 }

    fetchMock.mockResponseOnce(
      getJsonRpcStringifyResponse(MaxPriorityFeePerGasResult),
    )

    const response = await provider.request<
      string,
      typeof MaxPriorityFeePerGasResult
    >(mockPayload)

    expect(response).toEqual(MaxPriorityFeePerGasResult)
  })

  it('should fetch data successfully and return the correct response for eth_gasPrice', async () => {
    const mockPayload = { method: 'eth_gasPrice', id: 12 }

    fetchMock.mockResponseOnce(getJsonRpcStringifyResponse(GasPriceResult))

    const response = await provider.request<string, typeof GasPriceResult>(
      mockPayload,
    )

    expect(response).toEqual(GasPriceResult)
  })

  it('should fetch data successfully and return the correct response for eth_getCode', async () => {
    const mockPayload = { method: 'eth_getCode', id: 13 }

    fetchMock.mockResponseOnce(getJsonRpcStringifyResponse(GetCodeResult))

    const response = await provider.request<string, typeof GetCodeResult>(
      mockPayload,
    )

    expect(response).toEqual(GetCodeResult)
  })

  it('should fetch data successfully and return the correct response for circle_getAddress', async () => {
    const mockPayload = { method: 'circle_getAddress', id: 14 }

    fetchMock.mockResponseOnce(
      getJsonRpcStringifyResponse(GetAddressResult[AccountType.WebAuthn]),
    )

    const response = await provider.request<string, typeof GetAddressResult>(
      mockPayload,
    )

    expect(response).toEqual(GetAddressResult[AccountType.WebAuthn])
  })

  it('should fetch data successfully and return the correct response for circle_createAddressMapping', async () => {
    const mockPayload = { method: 'circle_createAddressMapping', id: 15 }

    fetchMock.mockResponseOnce(
      getJsonRpcStringifyResponse(CreateAddressMappingResult),
    )

    const response = await provider.request<
      string,
      typeof CreateAddressMappingResult
    >(mockPayload)

    expect(response).toEqual(CreateAddressMappingResult)
  })

  it('should fetch data successfully and return the correct response for circle_getAddressMapping', async () => {
    const mockPayload = { method: 'circle_getAddressMapping', id: 16 }

    fetchMock.mockResponseOnce(
      getJsonRpcStringifyResponse(GetAddressMappingResult),
    )

    const response = await provider.request<
      string,
      typeof GetAddressMappingResult
    >(mockPayload)

    expect(response).toEqual(GetAddressMappingResult)
  })

  it('should fetch data successfully and return the correct response for pm_getPaymasterData', async () => {
    const mockPayload = { method: 'pm_getPaymasterData', id: 17 }

    fetchMock.mockResponseOnce(
      getJsonRpcStringifyResponse(GetPaymasterDataResult),
    )

    const response = await provider.request<
      string,
      typeof GetPaymasterDataResult
    >(mockPayload)

    expect(response).toEqual(GetPaymasterDataResult)
  })

  it('should fetch data successfully and return the correct response for pm_getPaymasterStubData', async () => {
    const mockPayload = { method: 'pm_getPaymasterStubData', id: 18 }

    fetchMock.mockResponseOnce(
      getJsonRpcStringifyResponse(GetPaymasterStubDataResult),
    )

    const response = await provider.request<
      string,
      typeof GetPaymasterStubDataResult
    >(mockPayload)

    expect(response).toEqual(GetPaymasterStubDataResult)
  })

  it('should throw MethodNotImplementedError when fetch call fails', async () => {
    const mockPayload = {
      method: 'eth_accounts',
    }

    fetchMock.mockRejectOnce(new MethodNotImplementedError())

    await expect(provider.request(mockPayload)).rejects.toThrow(
      MethodNotImplementedError,
    )
  })
})

describe('Providers > modular-wallets > ModularWalletsProvider > request method', () => {
  it('should call fetchData and return the correct response for supported methods', async () => {
    const mockPayload = {
      id: 1,
      method: 'eth_supportedEntryPoints',
    }
    const mockedResult = {
      id: 1,
      jsonrpc: '2.0',
      result: EntryPointsResult,
    }

    fetchMock.mockResponseOnce(JSON.stringify(mockedResult), {
      status: 200,
    })

    const response = await provider.request<string, typeof EntryPointsResult>(
      mockPayload,
    )

    expect(response).toEqual(EntryPointsResult)
  })

  it('should throw MethodNotImplementedError for unsupported methods', async () => {
    const mockPayload = {
      method: 'unsupported_method',
    }

    await expect(provider.request(mockPayload)).rejects.toThrow(
      MethodNotImplementedError,
    )
  })
})
