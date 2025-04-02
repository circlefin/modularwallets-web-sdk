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
import { type LocalAccount, privateKeyToAccount } from 'viem/accounts'

import {
  LoginCredentialMock,
  toPasskeyTransport,
  MockEoaAccount,
} from '../../../__mocks__'
import { toWebAuthnCredential } from '../../../accounts'
import { WebAuthnMode } from '../../../types'
import { isWebAuthnOwner } from '../../../utils'

import type {
  ToWebAuthnAccountParameters,
  WebAuthnCredential,
} from '../../../types'
import type { WebAuthnAccount } from 'viem/account-abstraction'

const mockNavigatorGet = globalThis.window.navigator.credentials[
  'get'
] as jest.Mock

const passkeyTransport = toPasskeyTransport()
const loginParameters: ToWebAuthnAccountParameters = {
  transport: passkeyTransport,
  mode: WebAuthnMode.Login,
}

let credential: WebAuthnCredential
let owner: WebAuthnAccount
let localOwner: LocalAccount

beforeAll(async () => {
  mockNavigatorGet.mockResolvedValue(LoginCredentialMock)
  credential = await toWebAuthnCredential(loginParameters)
  owner = toWebAuthnAccount({ credential })
  localOwner = privateKeyToAccount(MockEoaAccount.privateKey)
})

describe('Utils > smartAccount > isWebAuthnOwner', () => {
  it('should return `true` for a WebAuthnAccount', () => {
    expect(isWebAuthnOwner(owner)).toBe(true)
  })

  it('should return `false` for a LocalAccount', () => {
    expect(isWebAuthnOwner(localOwner)).toBe(false)
  })
})
