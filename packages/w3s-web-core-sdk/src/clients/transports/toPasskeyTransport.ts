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
} from '../../constants'
import { RpProvider } from '../../providers'
import { isCircleUrl } from '../../utils'

/**
 * Creates a custom transport instance with the given clientUrl and clientKey.
 * @param clientUrl - The Client URL to use.
 * @param clientKey - The Client key to use.
 * @returns The custom transport instance.
 */
export const toPasskeyTransport = (clientUrl: string, clientKey: string) => {
  const provider = new RpProvider(clientUrl, clientKey)
  const config = isCircleUrl(provider.clientUrl)
    ? {
        key: MODULAR_WALLETS_TRANSPORT_KEY,
        name: MODULAR_WALLETS_TRANSPORT_NAME,
      }
    : undefined

  return custom(provider, config)
}
