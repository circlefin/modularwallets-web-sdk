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

import type { Transport } from 'viem'
import type { CreateCredentialReturnType } from 'webauthn-p256'

export enum WebAuthnMode {
  /*
   * Login mode.
   */
  Login = 'Login',
  /*
   * Register mode.
   */
  Register = 'Register',
}

export interface CreateCredentialParameters {
  /*
   * The WebAuthn Credential.
   */
  credential: PublicKeyCredential
  /*
   * The RP ID.
   */
  rpId: string | undefined
}

// Custom interfaces from RP server
export interface CustomPublicKeyCredentialDescriptor
  extends Omit<PublicKeyCredentialDescriptor, 'id'> {
  id: string
}

export interface CustomPublicKeyCredentialRequestOptions
  extends Omit<
    PublicKeyCredentialRequestOptions,
    'allowCredentials' | 'challenge'
  > {
  allowCredentials?: CustomPublicKeyCredentialDescriptor[]
  challenge: string
}

export interface CustomPublicKeyCredentialUserEntity
  extends Omit<PublicKeyCredentialUserEntity, 'id'> {
  id: string
}

export interface CustomPublicKeyCredentialCreationOptions
  extends Omit<PublicKeyCredentialCreationOptions, 'challenge' | 'user'> {
  challenge: string
  user: CustomPublicKeyCredentialUserEntity
}

export interface ToWebAuthnAccountParameters {
  /*
   * Transport for Client.
   */
  transport: Transport
  /*
   * The username for passkey registration.
   */
  username?: string
  /*
   * The existing credential ID for passkey login.
   */
  credentialId?: string
  /*
   * The WebAuthnMode (Login or Register).
   */
  mode: WebAuthnMode
}

/**
 * Available only in secure contexts.
 *
 * [MDN Reference](https://developer.mozilla.org/docs/Web/API/AuthenticatorAssertionResponse).
 */
export interface AuthenticatorAssertionResponse extends AuthenticatorResponse {
  /**
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/AuthenticatorAssertionResponse/userHandle).
   */
  readonly userHandle: ArrayBuffer
}

/**
 * Available only in secure contexts.
 *
 * [MDN Reference](https://developer.mozilla.org/docs/Web/API/AuthenticatorAttestationResponse).
 */
export interface AuthenticatorAttestationResponse
  extends AuthenticatorResponse {
  /**
   * Returns Public Key.
   */
  getPublicKey(): ArrayBuffer
}

export interface WebAuthnCredential extends CreateCredentialReturnType {
  /*
   * The RP ID.
   */
  rpId: string | undefined
}

export type GetLoginOptionsReturnType = CustomPublicKeyCredentialRequestOptions
export type GetRegistrationOptionsReturnType =
  CustomPublicKeyCredentialCreationOptions

export interface GetLoginVerificationReturnType {
  /*
   * Boolean of WebAuthn Verification Result or null.
   */
  publicKey: string
}

export interface GetRegistrationVerificationReturnType {
  /*
   * Boolean of WebAuthn Verification Result or null.
   */
  verified?: boolean | null
}
