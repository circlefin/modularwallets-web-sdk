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

import { http } from 'viem'

import { createRpClient } from '../../clients'

describe('Clients > createRpClient', () => {
  it('should create the RP client correctly', () => {
    const { uid, transport, ...client } = createRpClient({
      transport: http('https://'),
    })

    expect(uid).toBeDefined()
    expect(transport).toBeDefined()
    expect(client).toMatchInlineSnapshot(`
      {
        "account": undefined,
        "batch": undefined,
        "cacheTime": 4000,
        "ccipRead": undefined,
        "chain": undefined,
        "extend": [Function],
        "getLoginOptions": [Function],
        "getLoginVerification": [Function],
        "getRegistrationOptions": [Function],
        "getRegistrationVerification": [Function],
        "key": "rp",
        "name": "RP Client",
        "pollingInterval": 4000,
        "request": [Function],
        "type": "RpClient",
      }
    `)
  })
})
