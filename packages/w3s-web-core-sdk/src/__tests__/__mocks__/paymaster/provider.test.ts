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
  GetPaymasterDataResult,
  GetPaymasterStubDataResult,
  MockPaymasterProvider,
} from '../../../__mocks__'

describe('Mocks > providers > paymaster > PaymasterProvider', () => {
  it('should be defined', () => {
    expect(MockPaymasterProvider).toBeDefined()
  })

  it('should be a function', () => {
    expect(typeof MockPaymasterProvider).toBe('function')
  })

  it('should create an instance correctly', () => {
    const provider = new MockPaymasterProvider()
    expect(provider).toBeInstanceOf(MockPaymasterProvider)
  })

  it('should return false for supportsSubscriptions', () => {
    const provider = new MockPaymasterProvider()
    expect(provider.supportsSubscriptions()).toBe(false)
  })

  it('should throw MethodNotImplementedError when calling any of the mandatory abstract methods', () => {
    const provider = new MockPaymasterProvider()

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

describe('Mocks > providers > paymaster > PaymasterProvider > fetchData', () => {
  const provider = new MockPaymasterProvider()

  it('should fetch data successfully and return the correct response for pm_getPaymasterData', async () => {
    const mockPayload = { method: 'pm_getPaymasterData', id: 1 }

    const response = await provider.request<
      string,
      typeof GetPaymasterDataResult
    >(mockPayload)

    expect(response).toEqual(GetPaymasterDataResult)
  })

  it('should fetch data successfully and return the correct response for pm_getPaymasterStubData', async () => {
    const mockPayload = { method: 'pm_getPaymasterStubData', id: 2 }

    const response = await provider.request<
      string,
      typeof GetPaymasterStubDataResult
    >(mockPayload)

    expect(response).toEqual(GetPaymasterStubDataResult)
  })

  it('should throw MethodNotImplementedError when fetch call fails', async () => {
    const provider = new MockPaymasterProvider()

    const mockPayload = {
      method: 'pm_getGasPrice',
    }

    await expect(provider.request(mockPayload)).rejects.toThrow(
      MethodNotImplementedError,
    )
  })
})

describe('Mocks > providers > paymaster > PaymasterProvider > request method', () => {
  it('should call fetchData and return the correct response for supported methods', async () => {
    const provider = new MockPaymasterProvider()

    const mockPayload = {
      id: 1,
      method: 'pm_getPaymasterData',
    }

    const response = await provider.request<
      string,
      typeof GetPaymasterDataResult
    >(mockPayload)

    expect(response).toEqual(GetPaymasterDataResult)
  })

  it('should throw MethodNotImplementedError for unsupported methods', async () => {
    const provider = new MockPaymasterProvider()

    const mockPayload = {
      method: 'unsupported_method',
    }

    await expect(provider.request(mockPayload)).rejects.toThrow(
      MethodNotImplementedError,
    )
  })
})
