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

import { isWebAuthnOwner } from '../smartAccount'

import { getPublicKeyParamsFromOwner } from './getPublicKeyParamsFromOwner'

import type { Hex, LocalAccount } from 'viem'
import type { WebAuthnAccount } from 'viem/account-abstraction'

/**
 * Get the sender formatted for Bytes32 for smart contract interactions.
 * @param owner - The owner.
 * @returns The sender.
 */
export function getSenderForContract(
  owner: WebAuthnAccount | LocalAccount,
): Hex {
  return isWebAuthnOwner(owner)
    ? getPublicKeyParamsFromOwner(owner).sender
    : pad(owner.address)
}
