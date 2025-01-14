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

import { getJsonRpcResponse } from '../../../utils'

describe('Utils > mock > getJsonRpcResponse', () => {
  it('should create a valid JSON-RPC response', async () => {
    const mockPayload = {
      id: 1,
      jsonrpc: '2.0',
      method: 'eth_getBlockByNumber',
      params: ['latest'],
    } as const

    const mockResult = {
      number: '0x5bad55',
      hash: '0xb3b20624f8f0f86eb50dd04688409e5cea4bd02d700bf6e79e9384d47d6a5a35',
    }

    const response = await getJsonRpcResponse(mockPayload, mockResult)

    expect(response).toHaveProperty('id', mockPayload.id)
    expect(response).toHaveProperty('jsonrpc', '2.0')
    expect(response).toHaveProperty('result', mockResult)
  })

  it('should handle unknown result type gracefully', async () => {
    const mockPayload = {
      id: 2,
      jsonrpc: '2.0',
      method: 'eth_getGasPrice',
      params: [],
    } as const

    const unknownResult = 'unknown result'

    const response = await getJsonRpcResponse(mockPayload, unknownResult)

    expect(response).toHaveProperty('id', mockPayload.id)
    expect(response).toHaveProperty('jsonrpc', '2.0')
    expect(response).toHaveProperty('result', unknownResult)
  })
})
