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
import { EIP1193ProviderRpcError } from 'viem'
import { ResponseError } from 'web3'

import { fetchFromApi } from '../../../utils'
import { isChromeExtension } from '../../../utils/rpc/isChromeExtension'

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('mocked-uuid'),
}))

jest.mock('../../../utils/rpc/isChromeExtension', () => ({
  isChromeExtension: jest.fn(),
}))

beforeAll(() => {
  fetchMock.enableMocks()
})

afterEach(() => {
  fetchMock.resetMocks()
})

describe('Utils > rpc > fetchFromApi', () => {
  const mockClientKey = 'testClientKey'
  const mockClientUrl = 'https://api.example.com'
  const mockPayload = {
    method: 'eth_getBalance',
    params: ['0x123', 'latest'],
    id: 1,
  }

  it('should return data when API responds with success', async () => {
    const mockResponse = { jsonrpc: '2.0', id: 1, result: '0x1' }

    fetchMock.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 })

    const response = await fetchFromApi(
      mockClientUrl,
      mockClientKey,
      mockPayload,
    )

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(
      mockClientUrl,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          ...mockPayload,
          jsonrpc: '2.0',
          id: 1,
        }),
      }),
    )
    expect(response).toEqual(mockResponse)
  })

  it('should throw ResponseError when API responds with an error without the network status code 200', async () => {
    const errorResponse = {
      jsonrpc: '2.0',
      id: 1,
      error: { code: -32603, message: 'Internal error' },
    }

    fetchMock.mockResponseOnce(JSON.stringify(errorResponse), { status: 400 })

    await expect(
      fetchFromApi(mockClientUrl, mockClientKey, mockPayload),
    ).rejects.toThrow(ResponseError)
  })

  it('should throw ResponseError when API responds with an error with the network status code 200', async () => {
    const mockError = { code: -32603, message: 'Internal error' }

    const errorResponse = {
      jsonrpc: '2.0',
      id: 2,
      error: mockError,
    }

    fetchMock.mockResponseOnce(JSON.stringify(errorResponse), { status: 200 })

    await expect(
      fetchFromApi(mockClientUrl, mockClientKey, mockPayload),
    ).rejects.toThrow(
      new EIP1193ProviderRpcError(mockError.code, mockError.message),
    )
  })

  it('should generate id when payload does not include id', async () => {
    const mockId = 'mocked-uuid'

    const mockResponse = {
      jsonrpc: '2.0',
      id: mockId,
      result: '0x1',
    }

    fetchMock.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 })

    const response = await fetchFromApi(mockClientUrl, mockClientKey, {
      ...mockPayload,
      id: undefined,
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(
      mockClientUrl,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          ...mockPayload,
          jsonrpc: '2.0',
          id: mockId,
        }),
      }),
    )
    expect(response).toEqual(mockResponse)

    jest.restoreAllMocks()
  })

  describe('Chrome extension support', () => {
    const mockIsChromeExtension = isChromeExtension as jest.MockedFunction<
      typeof isChromeExtension
    >
    const originalWindow = global.window

    beforeEach(() => {
      Object.defineProperty(global, 'window', {
        value: {
          location: {
            hostname: 'test-extension-id',
          },
        },
        writable: true,
      })
    })

    afterEach(() => {
      global.window = originalWindow
      mockIsChromeExtension.mockReset()
    })

    it('should use chrome-extension URI format when in Chrome extension context', async () => {
      mockIsChromeExtension.mockReturnValue(true)

      const mockResponse = { jsonrpc: '2.0', id: 1, result: '0x1' }
      fetchMock.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 })

      await fetchFromApi(mockClientUrl, mockClientKey, mockPayload)

      const callArgs = fetchMock.mock.calls[0]
      const requestOptions = callArgs?.[1]
      const headers = requestOptions?.headers as Record<string, string>

      expect(headers['X-AppInfo']).toContain(
        'chrome-extension://test-extension-id',
      )
    })

    it('should use regular hostname when not in Chrome extension context', async () => {
      mockIsChromeExtension.mockReturnValue(false)

      const mockResponse = { jsonrpc: '2.0', id: 1, result: '0x1' }
      fetchMock.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 })

      await fetchFromApi(mockClientUrl, mockClientKey, mockPayload)

      const callArgs = fetchMock.mock.calls[0]
      const requestOptions = callArgs?.[1]
      const headers = requestOptions?.headers as Record<string, string>
      const appInfo = headers['X-AppInfo']

      expect(appInfo).toContain('uri=test-extension-id')
      expect(appInfo).not.toContain('chrome-extension://')
    })

    it('should handle unknown hostname gracefully', async () => {
      mockIsChromeExtension.mockReturnValue(false)

      Object.defineProperty(global, 'window', {
        value: {
          location: {
            hostname: undefined,
          },
        },
        writable: true,
      })

      const mockResponse = { jsonrpc: '2.0', id: 1, result: '0x1' }
      fetchMock.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 })

      await fetchFromApi(mockClientUrl, mockClientKey, mockPayload)

      const callArgs = fetchMock.mock.calls[0]
      const requestOptions = callArgs?.[1]
      const headers = requestOptions?.headers as Record<string, string>

      expect(headers['X-AppInfo']).toContain('uri=unknown')
    })
  })
})
