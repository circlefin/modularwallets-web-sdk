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

// Accounts
export * from './accounts'

// Actions
export * from './actions'

// Clients
export * from './clients'

// Constants
export { ContractAddress } from './constants'

// Providers
export * from './providers'

// Utils
export { encodeTransfer, walletClientToLocalAccount } from './utils'

// Types
export {
  WebAuthnMode,
  AccountType,
  type AuthenticatorAssertionResponse,
  type AuthenticatorAttestationResponse,
  type CircleSmartAccountImplementation,
  type CreateCredentialParameters,
  type CustomPublicKeyCredentialCreationOptions,
  type CustomPublicKeyCredentialDescriptor,
  type CustomPublicKeyCredentialRequestOptions,
  type CustomPublicKeyCredentialUserEntity,
  type GetAddressReturnType,
  type GetAddressRpcSchema,
  type GetLoginOptionsReturnType,
  type GetLoginOptionsRpcSchema,
  type GetLoginVerificationReturnType,
  type GetLoginVerificationRpcSchema,
  type GetRegistrationOptionsReturnType,
  type GetRegistrationOptionsRpcSchema,
  type GetRegistrationVerificationReturnType,
  type GetRegistrationVerificationRpcSchema,
  type ModularWalletRpcSchema,
  type RpRpcSchema,
  type ToCircleSmartAccountParameters,
  type ToCircleSmartAccountReturnType,
  type ToWebAuthnAccountParameters,
  type WebAuthnCredential,
} from './types'
