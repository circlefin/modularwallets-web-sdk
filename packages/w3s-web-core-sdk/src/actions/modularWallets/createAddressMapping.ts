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
  CreateAddressMappingParameters,
  CreateAddressMappingReturnType,
  CreateAddressMappingRpcSchema,
} from '../../types'
import type { Client, Transport } from 'viem'

/**
 * Creates an address mapping for recovery.
 * @param client - Client to use.
 * @param parameters - Parameters to use. See {@link CreateAddressMappingParameters}.
 * @returns The mapping result. See {@link CreateAddressMappingReturnType}.
 * @throws Error if the parameters are invalid.
 */
export async function createAddressMapping(
  client: Client<Transport>,
  parameters: CreateAddressMappingParameters,
): Promise<CreateAddressMappingReturnType> {
  return await client.request<CreateAddressMappingRpcSchema>({
    method: 'circle_createAddressMapping',
    params: [parameters],
  })
}
