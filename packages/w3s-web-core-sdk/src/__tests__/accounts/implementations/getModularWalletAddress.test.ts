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
import { sepolia } from 'viem/chains'

import {
  GetAddressResult,
  LoginCredentialMock,
  toModularTransport,
  toPasskeyTransport,
} from '../../../__mocks__'
import { toWebAuthnCredential } from '../../../accounts'
import { getModularWalletAddress } from '../../../accounts/implementations'
import { toCircleModularWalletClient } from '../../../clients'
import { WebAuthnMode } from '../../../types'

describe('Actions > implementations > getModularWalletAddress', () => {
  it('should return wallet creation result', async () => {
    const modularTransport = toModularTransport()
    const client = createPublicClient({
      transport: modularTransport,
      chain: sepolia,
    })
    const circleModularWalletClient = toCircleModularWalletClient({
      client,
    })

    const passkeyTransport = toPasskeyTransport()

    jest
      .spyOn(window.navigator.credentials, 'get')
      .mockResolvedValueOnce(LoginCredentialMock)
    const credential = await toWebAuthnCredential({
      transport: passkeyTransport,
      mode: WebAuthnMode.Login,
    })
    const owner = toWebAuthnAccount({ credential })

    const result = await getModularWalletAddress({
      client: circleModularWalletClient,
      owner,
    })

    expect(result).toEqual(GetAddressResult)
  })
})
