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

import { createPublicClient } from 'viem'

import {
  GetAddressMockParameters,
  GetAddressResult,
  toModularTransport,
} from '../../../__mocks__'
import { getAddress } from '../../../actions'
import { toCircleModularWalletClient } from '../../../clients'

describe('Actions > modularWallets > getAddress', () => {
  it('should return wallet creation result', async () => {
    const modularTransport = toModularTransport()
    const client = createPublicClient({ transport: modularTransport })
    const circleModularWalletClient = toCircleModularWalletClient({
      client,
    })

    const result = await getAddress(
      circleModularWalletClient,
      GetAddressMockParameters,
    )

    expect(result).toEqual(GetAddressResult)
  })
})
