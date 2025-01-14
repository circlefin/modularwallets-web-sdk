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
  GetLoginOptionsReturnType,
  GetLoginOptionsRpcSchema,
} from '../../types'
import type { Client, Transport } from 'viem'

export type GetLoginOptionsParameters = {
  /*
   * The User ID.
   */
  userId: string
}

/**
 * Returns the login options, including a challenge for verification.
 * @param client - Client to use.
 * @param parameters - Parameters to use. See {@link GetLoginOptionsParameters}.
 * @returns Credential Request Options. See {@link GetLoginOptionsReturnType}.
 */
export async function getLoginOptions(
  client: Client<Transport>,
  { userId }: GetLoginOptionsParameters,
) {
  return await client.request<GetLoginOptionsRpcSchema>({
    method: 'rp_getLoginOptions',
    params: [userId],
  })
}
