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

import type { AccountType } from '..'
import type { WebAuthnAccount } from 'viem/_types/account-abstraction'
import type { LocalAccount } from 'viem/accounts'

/**
 * Parameters of toModularTransport.
 */
export type ToModularTransportParameters = {
  /**
   * The account type.
   */
  accountType: AccountType
}

/**
 * Parameters of getMockOwners. Specifies the account type and the function to retrieve the mock owner.
 */
export type GetMockOwnersParameters = {
  /**
   * Retrieves a mock owner for the specified account type.
   * @returns A WebAuthnAccount representing the mock owner.
   */
  [AccountType.WebAuthn]: () => WebAuthnAccount
  /**
   * Retrieves a mock owner for the specified account type.
   * @returns A LocalAccount representing the mock owner.
   */
  [AccountType.Local]: () => LocalAccount
}
