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
  GetPaymasterDataResult,
  GetPaymasterStubDataResult,
} from '../../../__mocks__'
import { PaymasterProvider } from '../../../providers'
import { getJsonRpcStringifyResponse } from '../../../utils'

const provider = new PaymasterProvider('https://dev.api.com', 'test-client-key')

describe('Providers > paymaster > PaymasterProvider', () => {
  it('should be defined', () => {
    expect(PaymasterProvider).toBeDefined()
  })

  it('should be a function', () => {
    expect(typeof PaymasterProvider).toBe('function')
  })

  it('should create an instance correctly', () => {
    expect(provider).toBeInstanceOf(PaymasterProvider)
  })

  it('should throw InvalidProviderError if the URL is invalid', () => {
    expect(
      () =>
        new PaymasterProvider(
          'http://example.com(This is a wrong chain name)',
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

describe('Providers > paymaster > PaymasterProvider > fetchData', () => {
  beforeEach(() => {
    fetchMock.enableMocks()
  })

  afterEach(() => {
    fetchMock.resetMocks()
  })

  it('should fetch data successfully and return the correct response for pm_getPaymasterData', async () => {
    const mockPayload = { method: 'pm_getPaymasterData', id: 1 }

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
    const mockPayload = { method: 'pm_getPaymasterStubData', id: 2 }

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
      method: 'pm_getGasPrice',
    }

    fetchMock.mockRejectOnce(new MethodNotImplementedError())

    await expect(provider.request(mockPayload)).rejects.toThrow(
      MethodNotImplementedError,
    )
  })
})

describe('Providers > paymaster > PaymasterProvider > request method', () => {
  it('should call fetchData and return the correct response for supported methods', async () => {
    const mockPayload = {
      id: 1,
      method: 'pm_getPaymasterData',
    }

    fetchMock.mockResponseOnce(
      getJsonRpcStringifyResponse(GetPaymasterDataResult),
    )

    const response = await provider.request<
      string,
      typeof GetPaymasterDataResult
    >(mockPayload)

    expect(response).toEqual(GetPaymasterDataResult)
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
