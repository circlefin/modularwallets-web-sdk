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

import { createBundlerClient } from 'viem/account-abstraction'
import { polygonAmoy } from 'viem/chains'

import {
  CreateAddressMappingMockParameters,
  CreateAddressMappingResult,
  GetAddressMappingMockParameters,
  GetAddressMappingResult,
  GetAddressMockParameters,
  GetAddressResult,
  GetUserOperationGasPriceResult,
  toModularTransport,
} from '../../../__mocks__'
import { modularWalletActions } from '../../../clients'
import { AccountType } from '../../../types'
import { getJsonRpcStringifyResponse } from '../../../utils'

describe('Client > Decorators > modularWallets', () => {
  const transport = toModularTransport({
    accountType: AccountType.WebAuthn,
  })
  const client = createBundlerClient({
    chain: polygonAmoy,
    transport,
  })
  const actions = modularWalletActions(client)

  beforeEach(() => {
    fetchMock.enableMocks()
    jest.spyOn(client, 'request')
  })

  afterEach(() => {
    fetchMock.resetMocks()
    jest.restoreAllMocks()
  })

  it('should include correct modular wallet actions', () => {
    expect(actions).toMatchInlineSnapshot(`
      {
        "createAddressMapping": [Function],
        "getAddress": [Function],
        "getAddressMapping": [Function],
        "getUserOperationGasPrice": [Function],
      }
    `)
  })

  it('should call circle_createAddressMapping RPC method', async () => {
    fetchMock.mockResponseOnce(
      getJsonRpcStringifyResponse(CreateAddressMappingResult),
    )

    await actions.createAddressMapping(CreateAddressMappingMockParameters)

    expect(client.request).toHaveBeenCalledWith({
      method: 'circle_createAddressMapping',
      params: [CreateAddressMappingMockParameters],
    })
  })

  it('should call circle_getAddress RPC method', async () => {
    fetchMock.mockResponseOnce(getJsonRpcStringifyResponse(GetAddressResult))

    await actions.getAddress(GetAddressMockParameters[AccountType.WebAuthn])

    expect(client.request).toHaveBeenCalledWith({
      method: 'circle_getAddress',
      params: [GetAddressMockParameters[AccountType.WebAuthn][0]],
    })
  })

  it('should call circle_getAddressMapping RPC method', async () => {
    fetchMock.mockResponseOnce(
      getJsonRpcStringifyResponse(GetAddressMappingResult),
    )

    await actions.getAddressMapping(GetAddressMappingMockParameters)

    expect(client.request).toHaveBeenCalledWith({
      method: 'circle_getAddressMapping',
      params: [GetAddressMappingMockParameters],
    })
  })

  it('should call circle_getUserOperationGasPrice RPC method', async () => {
    fetchMock.mockResponseOnce(
      getJsonRpcStringifyResponse(GetUserOperationGasPriceResult),
    )

    await actions.getUserOperationGasPrice()

    expect(client.request).toHaveBeenCalledWith({
      method: 'circle_getUserOperationGasPrice',
      params: [],
    })
  })
})
