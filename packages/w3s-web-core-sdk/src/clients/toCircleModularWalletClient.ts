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

import { modularWalletActions } from './decorators'

import type { ModularWalletRpcSchema } from '../types'
import type { ModularWalletActions } from './decorators'
import type { Account, Chain, Client, RpcSchema, Transport } from 'viem'

export interface ToCircleModularWalletClientParameters {
  /**
   * The client instance.
   */
  client: Client
}

export type ExtendedRpcSchema<
  rpcSchema extends RpcSchema | undefined = undefined,
> = rpcSchema extends RpcSchema
  ? [...ModularWalletRpcSchema, ...rpcSchema]
  : ModularWalletRpcSchema

export type CircleModularWalletClient = Client<
  Transport,
  Chain | undefined,
  Account | undefined,
  ExtendedRpcSchema<RpcSchema>,
  ModularWalletActions
>

/**
 * Transforms a client into a Circle modular wallet client using decorators.
 * @param parameters - Parameters to use. See {@link ToCircleModularWalletClientParameters}.
 * @returns A decorated Circle modular wallet client. See {@link CircleModularWalletClient}.
 */
export function toCircleModularWalletClient({
  client,
}: ToCircleModularWalletClientParameters): CircleModularWalletClient {
  const circleModularWalletClient =
    client.extend<ModularWalletActions>(modularWalletActions)

  return circleModularWalletClient
}
