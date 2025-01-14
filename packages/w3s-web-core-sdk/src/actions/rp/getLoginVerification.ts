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
  GetLoginVerificationReturnType,
  GetLoginVerificationRpcSchema,
} from '../../types'
import type { Client, Transport } from 'viem'
import type { PublicKeyCredential } from 'webauthn-p256'

export type GetLoginVerificationParameters = {
  /*
   * The Credential.
   */
  credential: PublicKeyCredential
}

/**
 * Returns the login verification response to indicate if it's verified or not.
 * @param client - Client to use.
 * @param parameters - Parameters to use. See {@link GetLoginVerificationParameters}.
 * @returns WebAuthn Verification Response. See {@link GetLoginVerificationReturnType}.
 */
export async function getLoginVerification(
  client: Client<Transport>,
  { credential }: GetLoginVerificationParameters,
) {
  return await client.request<GetLoginVerificationRpcSchema>({
    method: 'rp_getLoginVerification',
    params: [credential],
  })
}
