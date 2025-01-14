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

import { custom } from 'viem'

import {
  MODULAR_WALLETS_TRANSPORT_KEY,
  MODULAR_WALLETS_TRANSPORT_NAME,
} from '../../../constants'
import { MockModularWalletsProvider } from '../../providers'

/**
 * Creates a custom transport instance with mock ModularWallets provider.
 * @returns The custom transport instance.
 */
export const toModularTransport = () => {
  const provider = new MockModularWalletsProvider()
  const config = {
    key: MODULAR_WALLETS_TRANSPORT_KEY,
    name: MODULAR_WALLETS_TRANSPORT_NAME,
  }

  return custom(provider, config)
}
