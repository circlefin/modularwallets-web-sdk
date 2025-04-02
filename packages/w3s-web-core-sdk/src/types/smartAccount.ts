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

import type { CIRCLE_MSCA_6900_V1_EP07_FACTORY_ABI } from '../abis'
import type { Address } from 'abitype'
import type { Assign, Client, Prettify, LocalAccount } from 'viem'
import type {
  SmartAccount,
  SmartAccountImplementation,
  WebAuthnAccount,
} from 'viem/_types/account-abstraction/accounts/types'
import type { entryPoint07Abi } from 'viem/account-abstraction/constants/abis'

/**
 * Parameters to create a Circle smart account.
 */
export type ToCircleSmartAccountParameters = {
  /**
   * The address.
   */
  address?: Address
  /**
   * The client instance.
   */
  client: Client
  /**
   * The owner.
   */
  owner: LocalAccount | WebAuthnAccount
  /**
   * The Nonce.
   */
  nonce?: bigint
  /**
   * The Circle Smart Account Wallet Name.
   */
  name?: string
}

/**
 * Return type of the Circle smart account.
 */
export type ToCircleSmartAccountReturnType = Prettify<
  SmartAccount<CircleSmartAccountImplementation>
>

/**
 * Circle smart account implementation.
 */
export type CircleSmartAccountImplementation = Assign<
  SmartAccountImplementation<
    typeof entryPoint07Abi,
    '0.7',
    {
      abi: typeof entryPoint07Abi
      factory: {
        abi: typeof CIRCLE_MSCA_6900_V1_EP07_FACTORY_ABI
        address: Address
      }
    }
  >,
  {
    sign: NonNullable<SmartAccountImplementation['sign']>
    getFactoryArgs: NonNullable<SmartAccountImplementation['getFactoryArgs']>
  }
>
