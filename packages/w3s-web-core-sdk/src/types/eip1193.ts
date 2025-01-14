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

import type {
  GetAddressReturnType,
  InitialOwnershipConfiguration,
} from './modularWallets'
import type {
  GetLoginOptionsReturnType,
  GetLoginVerificationReturnType,
  GetRegistrationOptionsReturnType,
  GetRegistrationVerificationReturnType,
} from './rp'
import type { PublicKeyCredential } from 'webauthn-p256'

/**
 * Generate login options, including a challenge for verification, and return them to the client.
 */
export type GetLoginOptionsRpcSchema = {
  Method: 'rp_getLoginOptions'
  Parameters?: [userId: string]
  ReturnType: GetLoginOptionsReturnType
}

/**
 * Verify the login response (authentication credential) and report the outcome to the client.
 */
export type GetLoginVerificationRpcSchema = {
  Method: 'rp_getLoginVerification'
  Parameters?: [authenticationCredential: PublicKeyCredential]
  ReturnType: GetLoginVerificationReturnType
}

/**
 * Generate and return registration options to the client. The client will use these options to prompt the user to create a passkey.
 */
export type GetRegistrationOptionsRpcSchema = {
  Method: 'rp_getRegistrationOptions'
  Parameters?: [username: string]
  ReturnType: GetRegistrationOptionsReturnType
}

/**
 * Verify the registration response (registration credential) and return the results to the client.
 */
export type GetRegistrationVerificationRpcSchema = {
  Method: 'rp_getRegistrationVerification'
  Parameters?: [registrationCredential: PublicKeyCredential]
  ReturnType: GetRegistrationVerificationReturnType
}

/**
 * Gets the Circle modular wallet address for the user.
 */
export type GetAddressRpcSchema = {
  Method: 'circle_getAddress'
  Parameters?: [
    {
      scaConfiguration: {
        initialOwnershipConfiguration: Omit<
          InitialOwnershipConfiguration,
          'ownershipContractAddress'
        >
        scaCore: string
      }
    },
  ]
  ReturnType: GetAddressReturnType
}

export type RpRpcSchema = [
  GetLoginOptionsRpcSchema,
  GetLoginVerificationRpcSchema,
  GetRegistrationOptionsRpcSchema,
  GetRegistrationVerificationRpcSchema,
]

export type ModularWalletRpcSchema = [GetAddressRpcSchema]
