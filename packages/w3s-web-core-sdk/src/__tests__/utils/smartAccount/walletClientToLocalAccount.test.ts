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

import { createWalletClient, publicActions } from 'viem'
import { type LocalAccount, privateKeyToAccount } from 'viem/accounts'
import { sepolia, mainnet } from 'viem/chains'

import {
  MockEoaAccount,
  MockSignMessageParams,
  MockSignTransactionParams,
  MockSignTypedDataParams,
  toModularTransport,
} from '../../../__mocks__'
import { AccountType } from '../../../types'
import { walletClientToLocalAccount } from '../../../utils'

import type {
  SignMessageParameters,
  SignTypedDataParameters,
  WalletClient,
} from 'viem'

const transport = toModularTransport({ accountType: AccountType.Local })
const localOwner: LocalAccount = privateKeyToAccount(MockEoaAccount.privateKey)
const walletClient: WalletClient = createWalletClient({
  account: localOwner,
  chain: mainnet,
  transport,
}).extend(publicActions)

describe('Utils > smartAccount > walletClientToLocalAccount', () => {
  it('should return the same value from converted LocalAccount as from WalletClient: signMessage', async () => {
    const expected = await walletClient.signMessage(
      MockSignMessageParams as SignMessageParameters,
    )
    const owner = walletClientToLocalAccount(walletClient)
    const signature = await owner.signMessage(MockSignMessageParams)
    expect(signature).toBe(expected)
  })

  it('should return the same value from converted LocalAccount as from WalletClient: signTypedData', async () => {
    const expected = await walletClient.signTypedData(
      MockSignTypedDataParams as SignTypedDataParameters,
    )
    const owner = walletClientToLocalAccount(walletClient)
    const signature = await owner.signTypedData(
      MockSignTypedDataParams as SignTypedDataParameters,
    )
    expect(signature).toBe(expected)
  })

  it('should return the same value from converted LocalAccount as from WalletClient: signTransaction', async () => {
    const expected = await walletClient.signTransaction({
      ...MockSignTransactionParams,
      account: localOwner,
      chain: mainnet,
    })
    const owner = walletClientToLocalAccount(walletClient)
    const signature = await owner.signTransaction({
      ...MockSignTransactionParams,
      chainId: 1,
    })
    expect(signature).toBe(expected)
  })

  it('should should throw an error when the WalletClient does not have an associated account', () => {
    const walletClient = createWalletClient({
      chain: sepolia,
      transport,
    })
    expect(() => walletClientToLocalAccount(walletClient)).toThrow(
      'WalletClient does not have an associated account.',
    )
  })
})
