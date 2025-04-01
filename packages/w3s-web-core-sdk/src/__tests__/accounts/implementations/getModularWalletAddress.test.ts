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

import { createPublicClient } from 'viem'
import { toWebAuthnAccount } from 'viem/account-abstraction'
import { privateKeyToAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains'

import {
  GetAddressResult,
  getMockOwners,
  LoginCredentialMock,
  MockEoaAccount,
  toModularTransport,
  toPasskeyTransport,
} from '../../../__mocks__'
import { toWebAuthnCredential } from '../../../accounts'
import { getModularWalletAddress } from '../../../accounts/implementations'
import { toCircleModularWalletClient } from '../../../clients'
import { WebAuthnMode, AccountType } from '../../../types'

import type { LocalAccount } from 'viem'
import type { WebAuthnAccount } from 'viem/account-abstraction'

let owner: WebAuthnAccount
let localOwner: LocalAccount

beforeAll(async () => {
  const transport = toPasskeyTransport()
  jest
    .spyOn(window.navigator.credentials, 'get')
    .mockResolvedValueOnce(LoginCredentialMock)
  const credential = await toWebAuthnCredential({
    transport,
    mode: WebAuthnMode.Login,
  })
  owner = toWebAuthnAccount({ credential })
  localOwner = privateKeyToAccount(MockEoaAccount.privateKey)
})

const owners = getMockOwners({
  [AccountType.WebAuthn]: () => owner,
  [AccountType.Local]: () => localOwner,
})

describe('Actions > implementations > getModularWalletAddress', () => {
  it.each(owners)(
    'should return wallet creation result $description',
    async ({ getOwner }) => {
      expect(getOwner()).toBeDefined()
      const owner = getOwner()
      const transport = toModularTransport({
        accountType: owner.type as AccountType,
      })
      const client = createPublicClient({
        transport,
        chain: sepolia,
      })
      const circleModularWalletClient = toCircleModularWalletClient({
        client,
      })

      const result = await getModularWalletAddress({
        client: circleModularWalletClient,
        owner,
      })

      expect(result).toEqual(GetAddressResult[owner.type])
    },
  )
})
