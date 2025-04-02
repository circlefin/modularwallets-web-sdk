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

import type { TransactionRequestBase, TransactionRequestEIP1559 } from 'viem'

/**
 * Mocks for the utility function - walletClientToLocalAccount.
 */
const base = {
  from: '0x0000000000000000000000000000000000000000',
  gas: 21000n,
  nonce: 785,
} satisfies TransactionRequestBase

/**
 * Mocks for the utility function - walletClientToLocalAccount.
 */
const baseEip1559 = {
  ...base,
  type: 'eip1559',
} as const satisfies TransactionRequestEIP1559

/**
 * Mocks for the utility function - walletClientToLocalAccount.
 */
export const MockSignTransactionParams = baseEip1559
