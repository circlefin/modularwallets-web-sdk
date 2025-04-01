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

import { isWebAuthnOwner } from '../../utils'

import type { LocalAccount } from 'viem'
import type { WebAuthnAccount } from 'viem/_types/account-abstraction'

/**
 * Generates a default wallet name based on the owner type.
 * @param owner - The account owner.
 * @returns The default wallet name.
 */
export function getDefaultWalletName(
  owner: WebAuthnAccount | LocalAccount,
): string {
  return isWebAuthnOwner(owner)
    ? `passkey-${new Date().toISOString()}`
    : `wallet-${new Date().toISOString()}`
}
