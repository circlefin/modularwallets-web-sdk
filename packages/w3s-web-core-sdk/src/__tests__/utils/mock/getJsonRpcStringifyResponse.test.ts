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

import { getJsonRpcStringifyResponse } from '../../../utils'

const getExpectedResponse = (result: unknown) =>
  JSON.stringify({
    id: 1,
    jsonrpc: '2.0',
    result,
  })

describe('Utils > mock > getJsonRpcStringifyResponse', () => {
  it('should return a JSON stringified response with the given result', () => {
    const result = { key: 'value' }
    const expectedResponse = getExpectedResponse(result)

    expect(getJsonRpcStringifyResponse(result)).toBe(expectedResponse)
  })

  it('should handle null result', () => {
    const result = null
    const expectedResponse = getExpectedResponse(result)

    expect(getJsonRpcStringifyResponse(result)).toBe(expectedResponse)
  })

  it('should handle undefined result', () => {
    const result = undefined
    const expectedResponse = getExpectedResponse(result)

    expect(getJsonRpcStringifyResponse(result)).toBe(expectedResponse)
  })

  it('should handle number result', () => {
    const result = 123
    const expectedResponse = getExpectedResponse(result)

    expect(getJsonRpcStringifyResponse(result)).toBe(expectedResponse)
  })

  it('should handle string result', () => {
    const result = 'test'
    const expectedResponse = getExpectedResponse(result)

    expect(getJsonRpcStringifyResponse(result)).toBe(expectedResponse)
  })
})
