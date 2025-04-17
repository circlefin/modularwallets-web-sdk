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

import { hashMessage, type Hash, type Hex, type LocalAccount } from 'viem'

import { isWebAuthnOwner, wrapEoaSignature, wrapSignature } from '../../utils'

import { webAuthnSign } from './webAuthnSign'

import type { WebAuthnAccount } from 'viem/account-abstraction'

interface SignAndWrapParameters {
  /**
   * The hash to sign.
   */
  hash: Hash
  /**
   * The owner of the account.
   */
  owner: LocalAccount | WebAuthnAccount
  /**
   * The sender of the account.
   */
  sender: Hex
  /**
   * Whether the signature is for a user operation.
   */
  hasUserOpGas?: boolean
}

/**
 * Signs a hash and parses it to a ABI-encoded  webauthn signature. The dynamic part of the secp256r1 signature.
 * @param parameters - Parameters to use. See {@link SignAndWrapParameters}.
 * @returns The ABI-encoded webauthn signature.
 * @throws Error if the owner type is invalid.
 */
export const signAndWrap = async ({
  hash,
  owner,
  sender,
  hasUserOpGas,
}: SignAndWrapParameters): Promise<Hex> => {
  if (isWebAuthnOwner(owner)) {
    const finalHash = hasUserOpGas ? hashMessage({ raw: hash }) : hash
    const signature = await webAuthnSign({ hash: finalHash, owner })
    return wrapSignature({
      signature,
      sender,
      hasUserOpGas,
    })
  }

  if (hasUserOpGas) {
    const signature = await owner.signMessage({
      message: { raw: hash },
    })
    return wrapEoaSignature({ signature, hasUserOpGas: true })
  }

  if (owner.sign) {
    const signature = await owner.sign({ hash })
    return wrapEoaSignature({ signature, hasUserOpGas: false })
  }
  throw new Error('`owner` does not support raw sign.')
}
