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

import { PaymasterProvider } from '../../../providers'
import { getJsonRpcResponse } from '../../../utils'
import {
  GetPaymasterDataResult,
  GetPaymasterStubDataResult,
} from '../modular-wallets/ModularWallets.Mock'

import type {
  EthExecutionAPI,
  Web3APIMethod,
  Web3APIPayload,
  Web3APIReturnType,
  Web3APISpec,
} from 'web3-types'

/**
 * A Web3 provider that mocks Paymaster API responses.
 */
export default class MockPaymasterProvider<
  API extends Web3APISpec = EthExecutionAPI,
> extends PaymasterProvider<API> {
  public constructor() {
    super('https://example.com', 'test-client-key')
  }

  public async request<
    Method extends Web3APIMethod<API>,
    ResultType = Web3APIReturnType<API, Method>,
  >(
    payload: Web3APIPayload<API, Method>,
    _requestOptions?: RequestInit,
  ): Promise<ResultType> {
    switch (payload.method) {
      case 'pm_getPaymasterData': {
        const response = await getJsonRpcResponse<API, Method, ResultType>(
          payload,
          GetPaymasterDataResult,
        )

        return response.result
      }

      case 'pm_getPaymasterStubData': {
        const response = await getJsonRpcResponse<API, Method, ResultType>(
          payload,
          GetPaymasterStubDataResult,
        )

        return response.result
      }
      default:
        throw new MethodNotImplementedError()
    }
  }
}
