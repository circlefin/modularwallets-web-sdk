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
  GetLoginOptionsResult,
  GetLoginVerificationResult,
  GetRegistrationOptionsResult,
  GetRegistrationVerificationResult,
} from '../../../__mocks__'
import { RpProvider } from '../../../providers'
import { getJsonRpcStringifyResponse } from '../../../utils'

const provider = new RpProvider('https://dev.api.com', 'test-client-key')

describe('Providers > rp > RpProvider', () => {
  it('should be defined', () => {
    expect(RpProvider).toBeDefined()
  })

  it('should be a function', () => {
    expect(typeof RpProvider).toBe('function')
  })

  it('should create an instance correctly', () => {
    expect(provider).toBeInstanceOf(RpProvider)
  })

  it('should throw InvalidProviderError if the URL is invalid', () => {
    expect(
      () =>
        new RpProvider(
          'test-client-key',
          'test-client-url(This is a wrong client URL)',
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

describe('Providers > rp > RpProvider > fetchData', () => {
  beforeEach(() => {
    fetchMock.enableMocks()
  })

  afterEach(() => {
    fetchMock.resetMocks()
  })

  it('should fetch data successfully and return the correct response for rp_getLoginOptions', async () => {
    const mockPayload = { method: 'rp_getLoginOptions', id: 1 }

    fetchMock.mockResponseOnce(
      getJsonRpcStringifyResponse(GetLoginOptionsResult),
    )

    const response = await provider.request<
      string,
      typeof GetLoginOptionsResult
    >(mockPayload)

    expect(response).toEqual(GetLoginOptionsResult)
  })

  it('should fetch data successfully and return the correct response for rp_getLoginVerification', async () => {
    const mockPayload = { method: 'rp_getLoginVerification', id: 2 }

    fetchMock.mockResponseOnce(
      getJsonRpcStringifyResponse(GetLoginVerificationResult),
    )

    const response = await provider.request<
      string,
      typeof GetLoginVerificationResult
    >(mockPayload)

    expect(response).toEqual(GetLoginVerificationResult)
  })

  it('should fetch data successfully and return the correct response for rp_getRegistrationOptions', async () => {
    const mockPayload = { method: 'rp_getRegistrationOptions', id: 3 }

    fetchMock.mockResponseOnce(
      getJsonRpcStringifyResponse(GetRegistrationOptionsResult),
    )

    const response = await provider.request<
      string,
      typeof GetRegistrationOptionsResult
    >(mockPayload)

    expect(response).toEqual(GetRegistrationOptionsResult)
  })

  it('should fetch data successfully and return the correct response for rp_getRegistrationVerification', async () => {
    const mockPayload = { method: 'rp_getRegistrationVerification', id: 4 }

    fetchMock.mockResponseOnce(
      getJsonRpcStringifyResponse(GetRegistrationVerificationResult),
    )

    const response = await provider.request<
      string,
      typeof GetRegistrationVerificationResult
    >(mockPayload)

    expect(response).toEqual(GetRegistrationVerificationResult)
  })
})

describe('Providers > rp > RpProvider > request method', () => {
  it('should call fetchData and return the correct response for supported methods', async () => {
    const mockPayload = {
      id: 1,
      method: 'rp_getLoginOptions',
    }

    fetchMock.mockResponseOnce(
      getJsonRpcStringifyResponse(GetLoginOptionsResult),
      {
        status: 200,
      },
    )

    const response = await provider.request<
      string,
      typeof GetLoginOptionsResult
    >(mockPayload)

    expect(response).toEqual(GetLoginOptionsResult)
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
