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

import { encodeAbiParameters, keccak256 } from 'viem'
import { toWebAuthnAccount } from 'viem/account-abstraction'

import { LoginCredentialMock, toPasskeyTransport } from '../../../__mocks__'
import { PUBLIC_KEY_COORDINATES_ABI } from '../../../abis'
import { toWebAuthnCredential } from '../../../accounts'
import { WebAuthnMode } from '../../../types'
import { getPublicKeyParamsFromOwner } from '../../../utils'

describe('Utils > account > getPublicKeyParamsFromOwner', () => {
  it('should return sender and initial public key owners', async () => {
    const passkeyTransport = toPasskeyTransport()

    jest
      .spyOn(window.navigator.credentials, 'get')
      .mockResolvedValueOnce(LoginCredentialMock)
    const credential = await toWebAuthnCredential({
      transport: passkeyTransport,
      mode: WebAuthnMode.Login,
    })
    const owner = toWebAuthnAccount({ credential })

    const { sender, initialPublicKeyOwners } =
      getPublicKeyParamsFromOwner(owner)

    expect(initialPublicKeyOwners).toHaveLength(1)

    expect(initialPublicKeyOwners[0]).toEqual(
      expect.objectContaining({
        x: expect.anything() as bigint,
        y: expect.anything() as bigint,
      }),
    )

    const expectedSender = keccak256(
      encodeAbiParameters(PUBLIC_KEY_COORDINATES_ABI, [
        initialPublicKeyOwners[0].x,
        initialPublicKeyOwners[0].y,
      ]),
    )
    expect(sender).toBe(expectedSender)
  })
})
