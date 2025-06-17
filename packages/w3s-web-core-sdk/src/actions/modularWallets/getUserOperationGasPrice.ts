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

import type {
  GetUserOperationGasPriceReturnType,
  GetUserOperationGasPriceRpcSchema,
} from '../../types'
import type { Client, Transport } from 'viem'

/**
 * Gets the user operation gas price.
 * @param client - Client to use.
 * @returns The user operation gas price. See {@link GetUserOperationGasPriceReturnType}.
 */
export async function getUserOperationGasPrice(
  client: Client<Transport>,
): Promise<GetUserOperationGasPriceReturnType> {
  return await client.request<GetUserOperationGasPriceRpcSchema>({
    method: 'circle_getUserOperationGasPrice',
    params: [],
  })
}
