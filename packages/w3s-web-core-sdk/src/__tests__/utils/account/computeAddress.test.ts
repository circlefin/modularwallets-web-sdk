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

import {
  LoginCredentialMock,
  MockComputedAddressResult,
  MockPublicKey,
  toPasskeyTransport,
} from '../../../__mocks__'
import { toWebAuthnCredential } from '../../../accounts'
import { WebAuthnMode } from '../../../types'
import { computeAddress, getPublicKeyParamsFromOwner } from '../../../utils'

jest.mock('../../../utils/address/getPublicKeyParamsFromOwner', () => ({
  getPublicKeyParamsFromOwner: jest.fn(),
}))

describe('Utils > account > computeAddress', () => {
  it('should return the correct address', async () => {
    const passkeyTransport = toPasskeyTransport()

    jest
      .spyOn(window.navigator.credentials, 'get')
      .mockResolvedValueOnce(LoginCredentialMock)
    const credential = await toWebAuthnCredential({
      transport: passkeyTransport,
      mode: WebAuthnMode.Login,
    })
    const owner = toWebAuthnAccount({ credential })

    ;(getPublicKeyParamsFromOwner as jest.Mock).mockReturnValue({
      sender: keccak256(
        encodeAbiParameters(
          [
            { name: 'x', type: 'uint256' },
            { name: 'y', type: 'uint256' },
          ],
          [MockPublicKey[0].x, MockPublicKey[0].y],
        ),
      ),
      initialPublicKeyOwners: MockPublicKey,
    })

    expect(computeAddress(owner)).toBe(MockComputedAddressResult)
  })
})
