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
  GetLoginOptionsResult,
  GetLoginVerificationResult,
  GetRegistrationOptionsResult,
  GetRegistrationVerificationResult,
  MockRpProvider,
} from '../../../__mocks__'

describe('Mocks > providers > rp > RpProvider', () => {
  it('should be defined', () => {
    expect(MockRpProvider).toBeDefined()
  })

  it('should be a function', () => {
    expect(typeof MockRpProvider).toBe('function')
  })

  it('should create an instance correctly', () => {
    const provider = new MockRpProvider()
    expect(provider).toBeInstanceOf(MockRpProvider)
  })

  it('should return false for supportsSubscriptions', () => {
    const provider = new MockRpProvider()
    expect(provider.supportsSubscriptions()).toBe(false)
  })

  it('should throw MethodNotImplementedError when calling any of the mandatory abstract methods', () => {
    const provider = new MockRpProvider()

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

describe('Mocks > providers > rp > RpProvider > fetchData', () => {
  const provider = new MockRpProvider()

  it('should fetch data successfully and return the correct response for rp_getLoginOptions', async () => {
    const mockPayload = { method: 'rp_getLoginOptions' }

    const response = await provider.request<
      string,
      typeof GetLoginOptionsResult
    >(mockPayload)

    expect(response).toEqual(GetLoginOptionsResult)
  })

  it('should fetch data successfully and return the correct response for rp_getLoginVerification', async () => {
    const mockPayload = { method: 'rp_getLoginVerification' }

    const response = await provider.request<
      string,
      typeof GetLoginVerificationResult
    >(mockPayload)

    expect(response).toEqual(GetLoginVerificationResult)
  })

  it('should fetch data successfully and return the correct response for rp_getRegistrationOptions', async () => {
    const mockPayload = { method: 'rp_getRegistrationOptions' }

    const response = await provider.request<
      string,
      typeof GetRegistrationOptionsResult
    >(mockPayload)

    expect(response).toEqual(GetRegistrationOptionsResult)
  })

  it('should fetch data successfully and return the correct response for rp_getRegistrationVerification', async () => {
    const mockPayload = { method: 'rp_getRegistrationVerification' }

    const response = await provider.request<
      string,
      typeof GetRegistrationVerificationResult
    >(mockPayload)

    expect(response).toEqual(GetRegistrationVerificationResult)
  })

  it('should throw MethodNotImplementedError when fetch call fails', async () => {
    const provider = new MockRpProvider()

    const mockPayload = {
      method: 'rp_options',
    }

    await expect(provider.request(mockPayload)).rejects.toThrow(
      MethodNotImplementedError,
    )
  })
})

describe('Mocks > providers > rp > RpProvider > request method', () => {
  it('should call fetchData and return the correct response for supported methods', async () => {
    const provider = new MockRpProvider()

    const mockPayload = {
      id: 1,
      method: 'rp_getLoginOptions',
    }

    const response = await provider.request<
      string,
      typeof GetLoginOptionsResult
    >(mockPayload)

    expect(response).toEqual(GetLoginOptionsResult)
  })

  it('should throw MethodNotImplementedError for unsupported methods', async () => {
    const provider = new MockRpProvider()

    const mockPayload = {
      method: 'unsupported_method',
    }

    await expect(provider.request(mockPayload)).rejects.toThrow(
      MethodNotImplementedError,
    )
  })
})
