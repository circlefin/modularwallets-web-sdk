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
import { createClient } from 'viem'
import { polygonAmoy } from 'viem/chains'

import {
  GetUserOperationGasPriceResult,
  toModularTransport,
} from '../../../__mocks__'
import { getUserOperationGasPrice } from '../../../actions/modularWallets'
import { AccountType } from '../../../types/modularWallets'
import { getJsonRpcStringifyResponse } from '../../../utils'

const modularTransport = toModularTransport({
  accountType: AccountType.WebAuthn,
})

describe('Actions > modularWallets > getUserOperationGasPrice', () => {
  const client = createClient({
    chain: polygonAmoy,
    transport: modularTransport,
  })

  beforeEach(() => {
    fetchMock.enableMocks()
  })

  afterEach(() => {
    fetchMock.resetMocks()
  })

  it('should get user operation gas price with valid parameters', async () => {
    fetchMock.mockResponseOnce(
      getJsonRpcStringifyResponse(GetUserOperationGasPriceResult),
    )

    const response = await getUserOperationGasPrice(client)

    expect(response).toEqual(GetUserOperationGasPriceResult)
  })
})
