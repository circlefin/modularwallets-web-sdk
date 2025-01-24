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
import { Web3BaseProvider } from 'web3-types'

import type {
  EthExecutionAPI,
  JsonRpcResponseWithResult,
  Web3APIMethod,
  Web3APIPayload,
  Web3APISpec,
  Web3ProviderStatus,
} from 'web3-types'

/**
 * A base EIP-1193 provider that reduces repetitive code.
 */
export default abstract class BaseProvider<
  API extends Web3APISpec = EthExecutionAPI,
> extends Web3BaseProvider<API> {
  public constructor() {
    super()
  }

  /**
   * Sends a request to the API client. This is an abstract method that must be implemented by the child class.
   * @param args - The payload to send in the request.
   */
  abstract request<Method extends Web3APIMethod<API>, ResultType = unknown>(
    args: Web3APIPayload<API, Method>,
  ): Promise<JsonRpcResponseWithResult<ResultType>>

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
