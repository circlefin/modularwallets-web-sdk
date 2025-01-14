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

import { createClient } from 'viem'

import { rpActions, type RpActions } from './decorators'

import type { RpRpcSchema } from '../types'
import type {
  Client,
  ClientConfig,
  CreateClientErrorType,
  Prettify,
  RpcSchema,
  Transport,
} from 'viem'
import type { ErrorType } from 'viem/_types/errors/utils'

export type RpClientConfig<
  transport extends Transport = Transport,
  rpcSchema extends RpcSchema | undefined = undefined,
> = Prettify<
  Pick<
    ClientConfig<transport, undefined, undefined, rpcSchema>,
    'cacheTime' | 'key' | 'name' | 'pollingInterval' | 'rpcSchema' | 'transport'
  >
>

export type RpClient<
  transport extends Transport = Transport,
  rpcSchema extends RpcSchema | undefined = undefined,
> = Prettify<
  Client<
    transport,
    undefined,
    undefined,
    rpcSchema extends RpcSchema ? [...RpRpcSchema, ...rpcSchema] : RpRpcSchema,
    RpActions
  >
>

export type CreateRpClientErrorType = CreateClientErrorType | ErrorType

/**
 * Creates a RP Client.
 * @param parameters - See {@link RpClientConfig}.
 * @returns A RP Client. See {@link RpClient}.
 */
export function createRpClient<
  transport extends Transport,
  rpcSchema extends RpcSchema | undefined = undefined,
>(
  parameters: RpClientConfig<transport, rpcSchema>,
): RpClient<transport, rpcSchema>

/**
 * Creates a RP Client.
 * @param parameters - See {@link RpClientConfig}.
 * @returns A RP Client. See {@link RpClient}.
 */
export function createRpClient(parameters: RpClientConfig): RpClient {
  const { key = 'rp', name = 'RP Client', transport } = parameters
  const client = createClient({
    ...parameters,
    key,
    name,
    transport,
    type: 'RpClient',
  })
  return client.extend(rpActions)
}
