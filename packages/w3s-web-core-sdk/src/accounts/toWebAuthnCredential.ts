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

import {
  base64UrlToBytes,
  parseCredentialPublicKey,
  serializePublicKey,
  type PublicKeyCredential,
} from 'webauthn-p256'

import { createRpClient } from '../clients'
import { WebAuthnMode } from '../types'
import {
  parseBase64EncodedPublicKey,
  adaptCredentialCreationOptions,
  adaptCredentialRequestOptions,
} from '../utils'

import type { RpClient } from '../clients'
import type {
  AuthenticatorAttestationResponse,
  CustomPublicKeyCredentialCreationOptions,
  CustomPublicKeyCredentialRequestOptions,
  ToWebAuthnAccountParameters,
  WebAuthnCredential,
} from '../types'

/**
 * Returns a WebAuthn credential.
 * @param parameters - Parameters to use. See {@link ToWebAuthnAccountParameters}.
 * @returns A WebAuthn credential.
 */
export async function toWebAuthnCredential(
  parameters: ToWebAuthnAccountParameters,
): Promise<WebAuthnCredential> {
  if (
    typeof window === 'undefined' ||
    window.navigator == null ||
    window.navigator.credentials == null
  )
    throw new Error('Credential Management API not supported.')

  const { transport, username, credentialId, mode } = parameters
  const client = createRpClient({ transport })

  return mode === WebAuthnMode.Login
    ? await startAuthentication(client, credentialId)
    : await startRegistration(client, username)
}

/**
 * Starts a WebAuthn registration.
 * @param client - RpClient instance.
 * @param username - The username to use.
 * @returns A WebAuthn Credential.
 */
async function startRegistration(
  client: RpClient,
  username: string | null = null,
): Promise<WebAuthnCredential> {
  const createFn = window.navigator.credentials.create.bind(
    window.navigator.credentials,
  )

  // Get Registration Options
  const registrationOptions = await client.getRegistrationOptions({
    username: username ?? '',
  })

  // Convert to PublicKeyCredentialCreationOptions and adapt for different contexts
  const publicKeyOpts = adaptCredentialCreationOptions(
    getCredentialCreationOptions(registrationOptions),
  )

  // Start registration
  const credential = (await createFn({
    publicKey: publicKeyOpts,
  })) as PublicKeyCredential
  if (credential == null) throw new Error('No credential created.')

  // Verify registration
  await client.getRegistrationVerification({
    credential,
  })

  // Parse credential public key
  try {
    const publicKey = await parseCredentialPublicKey(
      new Uint8Array(
        (
          credential.response as AuthenticatorAttestationResponse
        ).getPublicKey(),
      ),
    )
    return {
      id: credential.id,
      publicKey: serializePublicKey(publicKey, { compressed: true }),
      raw: credential,
      rpId: registrationOptions.rp.id,
    }
  } catch (error) {
    throw new Error(`Credential creation failed. ${error}`)
  }
}

/**
 * Starts a WebAuthn authentication/login.
 * @param client - RpClient instance.
 * @param credentialId - The credential ID to use.
 * @returns A WebAuthn Credential.
 */
async function startAuthentication(
  client: RpClient,
  credentialId: string | null = null,
): Promise<WebAuthnCredential> {
  const getFn = window.navigator.credentials.get.bind(
    window.navigator.credentials,
  )

  // Get Login Options
  const loginOptions = await client.getLoginOptions({
    userId: credentialId ?? '',
  })

  // Convert to PublicKeyCredentialRequestOptions and adapt for different contexts
  const publicKeyReq = adaptCredentialRequestOptions(
    getCredentialRequestOptions(loginOptions),
  )

  // Start authentication (login)
  const credential = (await getFn({
    publicKey: publicKeyReq,
  })) as PublicKeyCredential
  if (credential == null) throw new Error('No credential available.')

  // Verify authentication
  const { publicKey: base64Url } = await client.getLoginVerification({
    credential,
  })
  if (!base64Url) {
    throw new Error('Login verification failed.')
  }

  // Parse credential public key
  try {
    const publicKey = await parseBase64EncodedPublicKey(base64Url)
    return {
      id: credential.id,
      publicKey: serializePublicKey(publicKey, { compressed: true }),
      raw: credential,
      rpId: loginOptions?.rpId,
    }
  } catch (error) {
    throw new Error(`Credential creation failed. ${error}`)
  }
}

/**
 * Transforms to PublicKeyCredentialCreationOptions.
 * @param options - CustomPublicKeyCredentialCreationOptions instance.
 * @returns PublicKeyCredentialCreationOptions instance.
 */
function getCredentialCreationOptions(
  options: CustomPublicKeyCredentialCreationOptions,
): PublicKeyCredentialCreationOptions {
  return {
    ...options,
    challenge: base64UrlToBytes(options.challenge),
    user: {
      ...options.user,
      id: base64UrlToBytes(options.user.id),
    },
  }
}

/**
 * Transforms to PublicKeyCredentialRequestOptions.
 * @param options - CustomPublicKeyCredentialRequestOptions instance.
 * @returns PublicKeyCredentialRequestOptions instance.
 */
function getCredentialRequestOptions(
  options: CustomPublicKeyCredentialRequestOptions,
): PublicKeyCredentialRequestOptions {
  return {
    ...options,
    challenge: base64UrlToBytes(options.challenge),
    allowCredentials: options.allowCredentials?.map((credential) => ({
      ...credential,
      id: base64UrlToBytes(credential.id),
    })),
  }
}
