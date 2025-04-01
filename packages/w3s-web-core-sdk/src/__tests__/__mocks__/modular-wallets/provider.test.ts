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

import { MethodNotImplementedError } from 'web3-errors'

import {
  BlockNumberResult,
  BlockResult,
  ChainIdResult,
  EntryPointsResult,
  EstimateUserOperationGasResult,
  EthCallResult,
  GasPriceResult,
  GetAddressResult,
  GetBalanceResult,
  GetCodeResult,
  GetPaymasterDataResult,
  GetPaymasterStubDataResult,
  GetUserOperationReceiptResult,
  GetUserOperationResult,
  MaxPriorityFeePerGasResult,
  MockModularWalletsProvider,
  SendUserOperationResult,
} from '../../../__mocks__'
import { AccountType } from '../../../types/modularWallets'

describe('Mocks > providers > modular-wallets > ModularWalletsProvider', () => {
  it('should be defined', () => {
    expect(MockModularWalletsProvider).toBeDefined()
  })

  it('should be a function', () => {
    expect(typeof MockModularWalletsProvider).toBe('function')
  })

  it('should create an instance correctly', () => {
    const provider = new MockModularWalletsProvider()
    expect(provider).toBeInstanceOf(MockModularWalletsProvider)
  })

  it('should return false for supportsSubscriptions', () => {
    const provider = new MockModularWalletsProvider()
    expect(provider.supportsSubscriptions()).toBe(false)
  })

  it('should throw MethodNotImplementedError when calling any of the mandatory abstract methods', () => {
    const provider = new MockModularWalletsProvider()

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

describe('Mocks > providers > modular-wallets > ModularWalletsProvider > fetchData', () => {
  const provider = new MockModularWalletsProvider()

  it('should fetch data successfully and return the correct response for eth_supportedEntryPoints', async () => {
    const mockPayload = { method: 'eth_supportedEntryPoints', id: 1 }

    const response = await provider.request<string, typeof EntryPointsResult>(
      mockPayload,
    )

    expect(response).toEqual(EntryPointsResult)
  })

  it('should fetch data successfully and return the correct response for eth_sendUserOperation', async () => {
    const mockPayload = { method: 'eth_sendUserOperation', id: 2 }

    const response = await provider.request<
      string,
      typeof SendUserOperationResult
    >(mockPayload)

    expect(response).toEqual(SendUserOperationResult)
  })

  it('should fetch data successfully and return the correct response for eth_estimateUserOperationGas', async () => {
    const mockPayload = { method: 'eth_estimateUserOperationGas', id: 3 }

    const response = await provider.request<
      string,
      typeof EstimateUserOperationGasResult
    >(mockPayload)

    expect(response).toEqual(EstimateUserOperationGasResult)
  })

  it('should fetch data successfully and return the correct response for eth_getUserOperationByHash', async () => {
    const mockPayload = { method: 'eth_getUserOperationByHash', id: 4 }

    const response = await provider.request<
      string,
      typeof GetUserOperationResult
    >(mockPayload)

    expect(response).toEqual(GetUserOperationResult)
  })

  it('should fetch data successfully and return the correct response for eth_getUserOperationReceipt', async () => {
    const mockPayload = { method: 'eth_getUserOperationReceipt', id: 5 }

    const response = await provider.request<
      string,
      typeof GetUserOperationReceiptResult
    >(mockPayload)

    expect(response).toEqual(GetUserOperationReceiptResult)
  })

  it('should fetch data successfully and return the correct response for eth_chainId', async () => {
    const mockPayload = { method: 'eth_chainId', id: 6 }

    const response = await provider.request<string, typeof ChainIdResult>(
      mockPayload,
    )

    expect(response).toEqual(ChainIdResult)
  })

  it('should fetch data successfully and return the correct response for eth_getBalance', async () => {
    const mockPayload = { method: 'eth_getBalance', id: 7 }

    const response = await provider.request<string, typeof GetBalanceResult>(
      mockPayload,
    )

    expect(response).toEqual(GetBalanceResult)
  })

  it('should fetch data successfully and return the correct response for eth_blockNumber', async () => {
    const mockPayload = { method: 'eth_blockNumber', id: 8 }

    const response = await provider.request<string, typeof BlockNumberResult>(
      mockPayload,
    )

    expect(response).toEqual(BlockNumberResult)
  })

  it('should fetch data successfully and return the correct response for eth_call', async () => {
    const mockPayload = { method: 'eth_call', id: 9 }

    const response = await provider.request<string, typeof EthCallResult>(
      mockPayload,
    )

    expect(response).toEqual(EthCallResult)
  })

  it('should fetch data successfully and return the correct response for eth_getBlockByNumber', async () => {
    const mockPayload = { method: 'eth_getBlockByNumber', id: 10 }

    const response = await provider.request<string, typeof BlockResult>(
      mockPayload,
    )

    expect(response).toEqual(BlockResult)
  })

  it('should fetch data successfully and return the correct response for eth_maxPriorityFeePerGas', async () => {
    const mockPayload = { method: 'eth_maxPriorityFeePerGas', id: 11 }

    const response = await provider.request<
      string,
      typeof MaxPriorityFeePerGasResult
    >(mockPayload)

    expect(response).toEqual(MaxPriorityFeePerGasResult)
  })

  it('should fetch data successfully and return the correct response for eth_gasPrice', async () => {
    const mockPayload = { method: 'eth_gasPrice', id: 12 }

    const response = await provider.request<string, typeof GasPriceResult>(
      mockPayload,
    )

    expect(response).toEqual(GasPriceResult)
  })

  it('should fetch data successfully and return the correct response for eth_getCode', async () => {
    const mockPayload = { method: 'eth_getCode', id: 13 }

    const response = await provider.request<string, typeof GetCodeResult>(
      mockPayload,
    )

    expect(response).toEqual(GetCodeResult)
  })

  it('should fetch data successfully and return the correct response for circle_getAddress', async () => {
    const mockPayload = { method: 'circle_getAddress', id: 14 }

    const response = await provider.request<string, typeof GetAddressResult>(
      mockPayload,
    )

    expect(response).toEqual(GetAddressResult[AccountType.WebAuthn])
  })

  it('should fetch data successfully and return the correct response for pm_getPaymasterData', async () => {
    const mockPayload = { method: 'pm_getPaymasterData', id: 15 }

    const response = await provider.request<
      string,
      typeof GetPaymasterDataResult
    >(mockPayload)

    expect(response).toEqual(GetPaymasterDataResult)
  })

  it('should fetch data successfully and return the correct response for pm_getPaymasterStubData', async () => {
    const mockPayload = { method: 'pm_getPaymasterStubData', id: 16 }

    const response = await provider.request<
      string,
      typeof GetPaymasterStubDataResult
    >(mockPayload)

    expect(response).toEqual(GetPaymasterStubDataResult)
  })

  it('should throw MethodNotImplementedError when fetch call fails', async () => {
    const provider = new MockModularWalletsProvider()

    const mockPayload = {
      method: 'eth_feeHistory',
    }

    await expect(provider.request(mockPayload)).rejects.toThrow(
      MethodNotImplementedError,
    )
  })
})

describe('Mocks > providers > modular-wallets > ModularWalletsProvider > request method', () => {
  it('should call fetchData and return the correct response for supported methods', async () => {
    const provider = new MockModularWalletsProvider()

    const mockPayload = {
      method: 'eth_supportedEntryPoints',
    }

    const response = await provider.request<string, typeof EntryPointsResult>(
      mockPayload,
    )

    expect(response).toEqual(EntryPointsResult)
  })

  it('should throw MethodNotImplementedError for unsupported methods', async () => {
    const provider = new MockModularWalletsProvider()

    const mockPayload = {
      method: 'unsupported_method',
    }

    await expect(provider.request(mockPayload)).rejects.toThrow(
      MethodNotImplementedError,
    )
  })
})
