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
import { privateKeyToAccount } from 'viem/accounts'

import {
  getMockOwners,
  LoginCredentialMock,
  MockComputedAddressResult,
  MockEoaAccount,
  MockPublicKey,
  toPasskeyTransport,
} from '../../../__mocks__'
import { toWebAuthnCredential } from '../../../accounts'
import { AccountType, WebAuthnMode } from '../../../types'
import { computeAddress, getPublicKeyParamsFromOwner } from '../../../utils'

import type { LocalAccount } from 'viem'
import type { WebAuthnAccount } from 'viem/account-abstraction'

jest.mock('../../../utils/address/getPublicKeyParamsFromOwner', () => ({
  getPublicKeyParamsFromOwner: jest.fn(),
}))

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

describe('Utils > account > computeAddress', () => {
  it('should return the correct address with WebAuthnAccount', () => {
    const accountType = AccountType.WebAuthn
    const getPublicKeyParamsFromOwnerMock =
      getPublicKeyParamsFromOwner as jest.Mock
    getPublicKeyParamsFromOwnerMock.mockReturnValue({
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
    expect(computeAddress(owner)).toBe(MockComputedAddressResult[accountType])
  })

  it('should return the correct address with LocalAccount', () => {
    const accountType = AccountType.Local
    const owner = localOwner

    expect(computeAddress(owner)).toBe(MockComputedAddressResult[accountType])
  })

  it.each(owners)(
    'should return the correct address $description',
    ({ getOwner }) => {
      expect(getOwner()).toBeDefined()
      const owner = getOwner()

      const getPublicKeyParamsFromOwnerMock =
        getPublicKeyParamsFromOwner as jest.Mock
      getPublicKeyParamsFromOwnerMock.mockReturnValue({
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

      expect(computeAddress(owner)).toBe(MockComputedAddressResult[owner.type])
    },
  )
})
