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
  createBundlerClient,
  toWebAuthnAccount,
} from 'viem/account-abstraction'
import { type LocalAccount, privateKeyToAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains'

import {
  LoginCredentialMock,
  MockEoaAccount,
  MockSignParams,
  MockSignResult,
  toModularTransport,
  toPasskeyTransport,
} from '../../../__mocks__'
import {
  signAndWrap,
  toCircleSmartAccount,
  toWebAuthnCredential,
} from '../../../accounts'
import { AccountType, WebAuthnMode } from '../../../types'
import { getSenderForContract, toReplaySafeHash } from '../../../utils'

import type {
  ToWebAuthnAccountParameters,
  WebAuthnCredential,
} from '../../../types'
import type { BundlerClient, WebAuthnAccount } from 'viem/account-abstraction'

const mockNavigatorGet = globalThis.window.navigator.credentials[
  'get'
] as jest.Mock

const passkeyTransport = toPasskeyTransport()
const loginParameters: ToWebAuthnAccountParameters = {
  transport: passkeyTransport,
  mode: WebAuthnMode.Login,
}
const client: Record<string, BundlerClient> = {
  [AccountType.WebAuthn]: createBundlerClient({
    transport: toModularTransport({ accountType: AccountType.WebAuthn }),
    chain: sepolia,
  }),
  [AccountType.Local]: createBundlerClient({
    transport: toModularTransport({ accountType: AccountType.Local }),
    chain: sepolia,
  }),
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

describe('Accounts > implementations > signAndWrap', () => {
  it('should return mock result for wrapped signature with WebAuthnAccount owner', async () => {
    const accountType = AccountType.WebAuthn
    const account = await toCircleSmartAccount({
      client: client[accountType],
      owner,
    })
    const sender = getSenderForContract(owner)
    const address = await account.getAddress()
    const hash = toReplaySafeHash({
      address,
      chainId: client[accountType].chain!.id,
      hash: MockSignParams[accountType].hash,
    })
    const signature = await signAndWrap({ hash, owner, sender })
    expect(signature).toBe(MockSignResult[accountType])
  })

  it('should return mock result for wrapped signature with LocalAccount owner', async () => {
    const accountType = AccountType.Local
    const owner = localOwner
    const account = await toCircleSmartAccount({
      client: client[accountType],
      owner,
    })
    const sender = getSenderForContract(owner)
    const address = await account.getAddress()
    const hash = toReplaySafeHash({
      address,
      chainId: client[accountType].chain!.id,
      hash: MockSignParams[accountType].hash,
    })
    const signature = await signAndWrap({ hash, owner, sender })
    expect(signature).toBe(MockSignResult[accountType])
  })

  it('Should throw an error when the owner does not have sign and raw signing is required', async () => {
    const owner = {
      address: '0x' as `0x${string}`,
      type: AccountType.Local,
    } as LocalAccount
    const sender = getSenderForContract(owner)
    const hash = toReplaySafeHash({
      address: owner.address,
      chainId: client[owner.type].chain!.id,
      hash: MockSignParams[owner.type].hash,
    })

    await expect(signAndWrap({ hash, owner, sender })).rejects.toThrow(
      '`owner` does not support raw sign.',
    )
  })
})
