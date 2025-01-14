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

import { type Hash, type Hex } from 'viem'

import { toWebAuthnSignature } from '../../utils'

import type { WebAuthnAccount } from 'viem/account-abstraction'

interface WebAuthnSignParameters {
  /**
   * The hash to sign.
   */
  hash: Hash
  /**
   * The owner of the account.
   */
  owner: WebAuthnAccount
}

/**
 * Signs a hash and parses it to a ABI-encoded  webauthn signature. The dynamic part of the secp256r1 signature.
 * @param parameters - Parameters to use. See {@link WebAuthnSignParameters}.
 * @returns The ABI-encoded webauthn signature.
 */
export const webAuthnSign = async ({
  hash,
  owner,
}: WebAuthnSignParameters): Promise<Hex> => {
  const { signature, webauthn } = await owner.sign({
    hash,
  })

  return Promise.resolve(
    toWebAuthnSignature({
      signature,
      webauthn,
    }),
  )
}
