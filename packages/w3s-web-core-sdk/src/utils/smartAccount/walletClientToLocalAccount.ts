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

import { toAccount } from 'viem/accounts'

import type {
  LocalAccount,
  SignMessageParameters,
  SignTypedDataParameters,
  WalletClient,
} from 'viem'

/**
 * Creates a Local Account from a Wallet Client.
 * @param walletClient - The Wallet Client to use.
 * @returns A Local Account.
 * @throws If the walletClient does not have an associated account.
 */
export function walletClientToLocalAccount(
  walletClient: WalletClient,
): LocalAccount {
  if (!walletClient.account) {
    throw new Error('WalletClient does not have an associated account.')
  }

  return toAccount({
    address: walletClient.account.address,
    async signMessage(params) {
      return await walletClient.signMessage(params as SignMessageParameters)
    },
    async signTransaction(transaction) {
      /**
       * Cast transaction to the expected type for signTransaction
       * This approach is safer than using 'any' while still handling potential type mismatches
       * between different versions of viem.
       */
      return await walletClient.signTransaction(
        transaction as Parameters<typeof walletClient.signTransaction>[0],
      )
    },
    async signTypedData(typedData) {
      return await walletClient.signTypedData(
        typedData as unknown as SignTypedDataParameters,
      )
    },
  })
}
