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
  bytesToCryptoKey,
  cryptoKeyToBytes,
  parsePublicKey,
} from 'webauthn-p256'

import type { PublicKey } from 'webauthn-p256'

/**
 * Parses a base64Url encoded (PEM) public key into x and y coordinates from the public key
 * defined on the credential.
 * @param base64Url - Base64Url encoded public key.
 * @returns PublicKey for credential.
 */
export async function parseBase64EncodedPublicKey(
  base64Url: string,
): Promise<PublicKey> {
  const bytes = base64UrlToBytes(base64Url)
  const cryptoKey = (await bytesToCryptoKey(bytes)) as CryptoKey
  const publicKey = await cryptoKeyToBytes(cryptoKey)
  return parsePublicKey(publicKey)
}
