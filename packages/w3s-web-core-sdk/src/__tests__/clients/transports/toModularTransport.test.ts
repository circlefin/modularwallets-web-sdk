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

import { custom } from 'viem'

import { MockModularWalletsProvider } from '../../../__mocks__'
import { toModularTransport } from '../../../clients'
import {
  DEFAULT_RPC_URL,
  MODULAR_WALLETS_TRANSPORT_KEY,
  MODULAR_WALLETS_TRANSPORT_NAME,
} from '../../../constants'
import { ModularWalletsProvider } from '../../../providers'

jest.mock('viem', () => ({
  custom: jest.fn(),
}))

describe('Clients > Transports > toModularTransport', () => {
  const mockClientUrl = 'http://example.com'
  const mockClientKey = '<my-client-key>'
  let customReturnValue: object

  beforeEach(() => {
    customReturnValue = {}
    ;(custom as jest.Mock).mockReturnValue(customReturnValue)
  })

  it('should create a ModularWalletsProvider instance with the given clientUrl and clientKey', () => {
    const providerInstance = new ModularWalletsProvider(
      mockClientUrl,
      mockClientKey,
    )

    expect(providerInstance).toBeInstanceOf(ModularWalletsProvider)
  })

  it('should create a MockModularWalletsProvider instance', () => {
    const providerInstance = new MockModularWalletsProvider()

    expect(providerInstance).toBeInstanceOf(MockModularWalletsProvider)
  })

  it('should call custom with the created provider using a Circle url', () => {
    const providerInstance = toModularTransport(DEFAULT_RPC_URL, mockClientKey)

    expect(custom).toHaveBeenCalledWith(expect.any(ModularWalletsProvider), {
      key: MODULAR_WALLETS_TRANSPORT_KEY,
      name: MODULAR_WALLETS_TRANSPORT_NAME,
    })
    expect(custom).toHaveBeenCalledTimes(1)

    expect(providerInstance).toEqual(customReturnValue)
  })

  it('should call custom with the created provider without using a Circle url', () => {
    const providerInstance = toModularTransport(mockClientUrl, mockClientKey)

    expect(custom).toHaveBeenCalledWith(
      expect.any(ModularWalletsProvider),
      undefined,
    )
    expect(custom).toHaveBeenCalledTimes(1)

    expect(providerInstance).toEqual(customReturnValue)
  })
})
