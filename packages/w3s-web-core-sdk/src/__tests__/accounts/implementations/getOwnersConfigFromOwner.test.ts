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
  getMockOwners,
  LoginCredentialMock,
  MockEoaAccount,
  MockOwnersConfig,
  toPasskeyTransport,
} from '../../../__mocks__'
import { toWebAuthnCredential } from '../../../accounts'
import { getOwnersConfigFromOwner } from '../../../accounts/implementations/getOwnersConfigFromOwner'
import { AccountType, WebAuthnMode } from '../../../types'

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
const owners = getMockOwners({
  [AccountType.WebAuthn]: () => owner,
  [AccountType.Local]: () => localOwner,
})

beforeAll(async () => {
  mockNavigatorGet.mockResolvedValue(LoginCredentialMock)
  credential = await toWebAuthnCredential(loginParameters)
  owner = toWebAuthnAccount({ credential })
  localOwner = privateKeyToAccount(MockEoaAccount.privateKey)
})

describe('Accounts > implementations > getOwnersConfigFromOwner', () => {
  it.each(owners)('should return mock result $description', ({ getOwner }) => {
    expect(getOwner()).toBeDefined()
    const owner = getOwner()
    const ownersConfig = getOwnersConfigFromOwner(owner)
    expect(ownersConfig).toEqual(MockOwnersConfig[owner.type])
  })
})
