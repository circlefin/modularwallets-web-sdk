/*
 * Copyright (c) 2026, Circle Internet Group, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { decodeAbiParameters, stringToHex, type Hex } from 'viem'

import { AUTHENTICATOR_DATA } from '../../../abis'
import { toWebAuthnSignature } from '../../../utils'

import type { WebAuthnData } from 'webauthn-p256'

describe('Utils > signature > toWebAuthnSignature', () => {
  // Valid compact P256 signature (r || s) from webauthn-p256's parseSignature tests.
  const signature: Hex =
    '0x16d6f4bd3231c71c5e58927b9cf2ee701df03b52e3db71efc03d1139122f854f67f32a4fcb17b07ab9b7755b61e999b99139074fc8e1aa6d33d25beccbb2fbd4'

  const baseWebAuthn: Omit<WebAuthnData, 'userVerificationRequired'> = {
    authenticatorData:
      '0x49960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d97630500000000',
    clientDataJSON:
      '{"type":"webauthn.get","challenge":"test","origin":"http://localhost"}',
    challengeIndex: 23,
    typeIndex: 1,
  }

  it.each([true, false])(
    'should encode requireUserVerification as %s from webauthn.userVerificationRequired',
    (userVerificationRequired) => {
      const encoded = toWebAuthnSignature({
        signature,
        webauthn: {
          ...baseWebAuthn,
          userVerificationRequired,
        },
      })

      const [{ webAuthnData }] = decodeAbiParameters(
        AUTHENTICATOR_DATA,
        encoded,
      )

      expect(webAuthnData.requireUserVerification).toBe(
        userVerificationRequired,
      )
      expect(webAuthnData.challengeIndex).toBe(23n)
      expect(webAuthnData.typeIndex).toBe(1n)
      expect(webAuthnData.authenticatorData).toBe(
        baseWebAuthn.authenticatorData,
      )
      expect(webAuthnData.clientDataJSON).toBe(
        stringToHex(baseWebAuthn.clientDataJSON),
      )
    },
  )
})
