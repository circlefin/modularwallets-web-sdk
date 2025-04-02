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

import {
  toWebAuthnAccount,
  type WebAuthnAccount,
} from 'viem/account-abstraction'

import {
  LoginCredentialMock,
  MockInternalSignResult,
  MockReplaySafeHash,
  toPasskeyTransport,
} from '../../../__mocks__'
import { toWebAuthnCredential, webAuthnSign } from '../../../accounts'
import {
  AccountType,
  WebAuthnMode,
  type ToWebAuthnAccountParameters,
} from '../../../types'

describe('Accounts > implementations > webAuthnSign', () => {
  const mockNavigatorGet = globalThis.window.navigator.credentials[
    'get'
  ] as jest.Mock

  const transport = toPasskeyTransport()
  const loginParameters: ToWebAuthnAccountParameters = {
    transport,
    mode: WebAuthnMode.Login,
  }

  let owner: WebAuthnAccount

  beforeEach(async () => {
    mockNavigatorGet.mockResolvedValue(LoginCredentialMock)
    const credential = await toWebAuthnCredential(loginParameters)
    owner = toWebAuthnAccount({ credential })
  })

  it('should return signature', async () => {
    const signature = await webAuthnSign({
      owner,
      hash: MockReplaySafeHash[AccountType.WebAuthn],
    })

    expect(signature).toBe(MockInternalSignResult)
  })
})
