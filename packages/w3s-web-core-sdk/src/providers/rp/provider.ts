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

import { InvalidProviderError, MethodNotImplementedError } from 'web3-errors'
import { Web3BaseProvider } from 'web3-types'

import { fetchFromApi, validateClientUrl } from '../../utils'

import type {
  EthExecutionAPI,
  Web3APIMethod,
  Web3APIPayload,
  Web3APIReturnType,
  Web3APISpec,
  Web3ProviderStatus,
} from 'web3-types'

/**
 * A Web3 provider that connects to the RP API.
 * @param clientUrl - The Client URL.
 * @param clientKey - The Client key.
 */
export default class RpProvider<
  API extends Web3APISpec = EthExecutionAPI,
> extends Web3BaseProvider<API> {
  public readonly clientUrl: string
  private readonly clientKey: string

  public constructor(clientUrl: string, clientKey: string) {
    super()

    if (!validateClientUrl(clientUrl)) {
      throw new InvalidProviderError(clientUrl)
    }

    this.clientUrl = clientUrl
    this.clientKey = clientKey
  }

  public async request<
    Method extends Web3APIMethod<API>,
    ResultType = Web3APIReturnType<API, Method>,
  >(
    payload: Web3APIPayload<API, Method>,
    requestOptions?: RequestInit,
  ): Promise<ResultType> {
    switch (payload.method) {
      case 'rp_getLoginOptions':
      case 'rp_getLoginVerification':
      case 'rp_getRegistrationOptions':
      case 'rp_getRegistrationVerification':
        return (
          await fetchFromApi<API, Method, ResultType>(
            this.clientUrl,
            this.clientKey,
            payload,
            requestOptions,
          )
        ).result
      default:
        // Only support the above methods, throw an error for any other method.
        throw new MethodNotImplementedError()
    }
  }

  /**
   * This is an abstract method from the parent class but we don't need it for this provider.
   * @throws MethodNotImplementedError.
   */
  public getStatus(): Web3ProviderStatus {
    throw new MethodNotImplementedError()
  }

  /**
   * This is an abstract method from the parent class but we don't need it for this provider.
   * @Returns false.
   */
  public supportsSubscriptions() {
    return false
  }

  /**
   * This is an abstract method from the parent class but we don't need it for this provider.
   * @throws MethodNotImplementedError.
   */
  public on() {
    throw new MethodNotImplementedError()
  }

  /**
   * This is an abstract method from the parent class but we don't need it for this provider.
   * @throws MethodNotImplementedError.
   */
  public removeListener() {
    throw new MethodNotImplementedError()
  }

  /**
   * This is an abstract method from the parent class but we don't need it for this provider.
   * @throws MethodNotImplementedError.
   */
  public once() {
    throw new MethodNotImplementedError()
  }

  /**
   * This is an abstract method from the parent class but we don't need it for this provider.
   * @throws MethodNotImplementedError.
   */
  public removeAllListeners() {
    throw new MethodNotImplementedError()
  }

  /**
   * This is an abstract method from the parent class but we don't need it for this provider.
   * @throws MethodNotImplementedError.
   */
  public connect() {
    throw new MethodNotImplementedError()
  }

  /**
   * This is an abstract method from the parent class but we don't need it for this provider.
   * @throws MethodNotImplementedError.
   */
  public disconnect() {
    throw new MethodNotImplementedError()
  }

  /**
   * This is an abstract method from the parent class but we don't need it for this provider.
   * @throws MethodNotImplementedError.
   */
  public reset() {
    throw new MethodNotImplementedError()
  }

  /**
   * This is an abstract method from the parent class but we don't need it for this provider.
   * @throws MethodNotImplementedError.
   */
  public reconnect() {
    throw new MethodNotImplementedError()
  }
}
