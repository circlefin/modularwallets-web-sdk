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

import { encodeAbiParameters, stringToHex } from 'viem'
import {
  type WebAuthnData,
  parseSignature as parseP256Signature,
} from 'webauthn-p256'

import { AUTHENTICATOR_DATA } from '../../abis'

import type { Hex } from 'viem'

interface WebAuthnSignatureParameters {
  /**
   * The WebAuthn data.
   */
  webauthn: WebAuthnData
  /**
   * The signature.
   */
  signature: Hex
}

/**
 * Regarding the ABI type of clientDataJSON, it must be either string or bytes.
 *
 * We found that the calculation results are the same, because when the encodeAbiParameters receives a string,
 * it also automatically hex-encodes it once. Therefore:
 * - If the ABI type is a string, it needs to be hex-encoded once during encoding,
 * which is equivalent to when the ABI type is bytes; during encoding, it can be used directly.
 * - The results of the encodeABIParams operations for both cases will be completely the same.
 *
 * Proof:.
 *
 * ```typescript
 * import { encodeAbiParameters, stringToHex } from "viem"
 *
 * const encode1 = encodeAbiParameters(
 *   [
 *     {
 *       type: "string",
 *     },
 *   ],
 *   [`{"type":"webauthn.get","challenge":"test-challenge","origin":"http://localhost:3005","crossOrigin":false}`]
 * )
 * const encode2 = encodeAbiParameters(
 *   [
 *     {
 *       type: "bytes",
 *     },
 *   ],
 *   [
 *     stringToHex(
 *       `{"type":"webauthn.get","challenge":"test-challenge","origin":"http://localhost:3005","crossOrigin":false}`
 *     ),
 *   ]
 * )
 * console.log("same?", encode1 === encode2)
 * ```
 *
 * Run the code snippet to see the console.log, you will see it's true.
 */

/**
 * Converts a WebAuthn signature to an ABI-encoded signature, which is the dynamic part of the secp256r1 signature.
 * @param parameters - Parameters to use. See {@link WebAuthnSignatureParameters}.
 * @returns The ABI-encoded signature.
 */
export function toWebAuthnSignature({
  webauthn,
  signature,
}: WebAuthnSignatureParameters): Hex {
  const { r, s } = parseP256Signature(signature)

  return encodeAbiParameters(AUTHENTICATOR_DATA, [
    {
      webAuthnData: {
        authenticatorData: webauthn.authenticatorData,
        clientDataJSON: stringToHex(webauthn.clientDataJSON),
        challengeIndex: BigInt(webauthn.challengeIndex),
        typeIndex: BigInt(webauthn.typeIndex),
        requireUserVerification: true,
      },
      r,
      s,
    },
  ])
}
