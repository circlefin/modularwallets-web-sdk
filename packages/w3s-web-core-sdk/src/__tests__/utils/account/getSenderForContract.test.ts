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

import { pad } from 'viem'
import { toWebAuthnAccount } from 'viem/account-abstraction'
import { type LocalAccount, privateKeyToAccount } from 'viem/accounts'

import {
  LoginCredentialMock,
  toPasskeyTransport,
  MockEoaAccount,
} from '../../../__mocks__'
import { toWebAuthnCredential } from '../../../accounts'
import { WebAuthnMode } from '../../../types'
import {
  getPublicKeyParamsFromOwner,
  getSenderForContract,
} from '../../../utils'

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

describe('Utils > account > getSenderForContract', () => {
  it('should return the correct encoded sender with WebAuthnAccount owner', () => {
    const senderForContract = getSenderForContract(owner)
    const expectedEncodedResult = getPublicKeyParamsFromOwner(owner).sender

    expect(senderForContract).toBe(expectedEncodedResult)
  })

  it('should return the correct encoded sender with LocalAccount owner', () => {
    const owner = localOwner
    const senderForContract = getSenderForContract(owner)
    const expectedEncodedResult = pad(owner.address)

    expect(senderForContract).toBe(expectedEncodedResult)
  })
})
