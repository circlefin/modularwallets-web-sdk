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

import { v4 as uuidv4 } from 'uuid'
import { EIP1193ProviderRpcError } from 'viem'
import { ResponseError } from 'web3'

import { isChromeExtension } from './isChromeExtension'

import type {
  JsonRpcResponseWithError,
  JsonRpcResponseWithResult,
  Web3APIMethod,
  Web3APIPayload,
  Web3APISpec,
} from 'web3'

/**
 * Fetches response from the specified client URL.
 * @param clientUrl - The URL of the API client.
 * @param clientKey - The authorization Client key.
 * @param payload - The payload to send in the request.
 * @param requestOptions - Optional request options for the fetch call.
 * @returns The JSON-RPC response from the API.
 * @throws \{ResponseError\} If the fetch call fails.
 */
export async function fetchFromApi<
  API extends Web3APISpec,
  Method extends Web3APIMethod<API>,
  ResultType,
>(
  clientUrl: string,
  clientKey: string,
  payload: Web3APIPayload<API, Method>,
  requestOptions?: RequestInit,
): Promise<JsonRpcResponseWithResult<ResultType>> {
  const hostname = window?.location?.hostname || 'unknown'

  /**
   * Determine the URI for the X-AppInfo header.
   * Chrome extensions require the chrome-extension:// protocol format
   * to properly identify the extension context to the API.
   */
  const uri = isChromeExtension() ? `chrome-extension://${hostname}` : hostname

  const fetchResponse: Response = await fetch(clientUrl, {
    ...requestOptions,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${clientKey}`,
      'X-AppInfo': `platform=web;version=${SDK_VERSION};uri=${uri}`,
    },
    body: JSON.stringify({
      ...payload,
      jsonrpc: '2.0',
      id: payload?.id ?? uuidv4(),
    }),
  })

  if (!fetchResponse.ok) {
    const errorResponse =
      (await fetchResponse.json()) as JsonRpcResponseWithResult<unknown>

    throw new ResponseError(
      errorResponse,
      undefined,
      undefined,
      fetchResponse.status,
    )
  }

  const jsonResponse: JsonRpcResponseWithResult<ResultType> =
    (await fetchResponse.json()) as JsonRpcResponseWithResult<ResultType>

  if ('error' in jsonResponse) {
    const errorResponse = jsonResponse as unknown as JsonRpcResponseWithError

    throw new EIP1193ProviderRpcError(
      errorResponse.error.code,
      errorResponse.error.message,
    )
  }

  return jsonResponse
}
