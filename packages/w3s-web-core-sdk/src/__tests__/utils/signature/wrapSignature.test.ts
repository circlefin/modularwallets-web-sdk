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

import { toWebAuthnAccount } from 'viem/account-abstraction'

import {
  LoginCredentialMock,
  MockWrappedSignResult,
  MockSignResult,
  MockWrappedUserOpSignResult,
  toPasskeyTransport,
} from '../../../__mocks__'
import { toWebAuthnCredential } from '../../../accounts'
import { AccountType, WebAuthnMode } from '../../../types'
import { getPublicKeyParamsFromOwner, wrapSignature } from '../../../utils'

import type { Hex } from 'viem'
import type { WebAuthnAccount } from 'viem/account-abstraction'

describe('Utils > signature > wrapSignature', () => {
  const signature: Hex = MockSignResult[AccountType.WebAuthn]
  let owner: WebAuthnAccount

  beforeEach(async () => {
    const passkeyTransport = toPasskeyTransport()

    jest
      .spyOn(window.navigator.credentials, 'get')
      .mockResolvedValueOnce(LoginCredentialMock)
    const credential = await toWebAuthnCredential({
      transport: passkeyTransport,
      mode: WebAuthnMode.Login,
    })

    owner = toWebAuthnAccount({ credential })
  })

  it('should wrap a valid signature correctly', () => {
    const { sender } = getPublicKeyParamsFromOwner(owner)

    const result = wrapSignature({ sender, signature })

    expect(result).toEqual(MockWrappedSignResult[AccountType.WebAuthn])
  })

  it('should wrap a valid user operation signature correctly', () => {
    const { sender } = getPublicKeyParamsFromOwner(owner)

    const result = wrapSignature({ sender, signature, hasUserOpGas: true })

    expect(result).toEqual(MockWrappedUserOpSignResult[AccountType.WebAuthn])
  })
})
