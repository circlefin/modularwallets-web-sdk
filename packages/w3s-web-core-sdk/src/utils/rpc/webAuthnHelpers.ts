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

import { isChromeExtension } from './isChromeExtension'

/**
 * Adapts PublicKeyCredentialCreationOptions for different contexts.
 * @param options - The original credential creation options.
 * @returns Modified options suitable for unique contexts or original options for regular contexts.
 */
export function adaptCredentialCreationOptions(
  options: PublicKeyCredentialCreationOptions,
): PublicKeyCredentialCreationOptions {
  /**
   * Chrome extensions require removing the rp.id field due to security restrictions.
   * Https://chromium.googlesource.com/chromium/src/+/main/content/browser/webauth/origins.md.
   */
  if (isChromeExtension()) {
    const { rp, ...restOptions } = options
    const { id: _, ...rpWithoutId } = rp

    return {
      ...restOptions,
      rp: rpWithoutId,
    }
  }

  return options
}

/**
 * Adapts PublicKeyCredentialRequestOptions for different context.
 * @param options - The original credential request options.
 * @returns Modified options suitable for unique contexts or original options for regular contexts.
 */
export function adaptCredentialRequestOptions(
  options: PublicKeyCredentialRequestOptions,
): PublicKeyCredentialRequestOptions {
  /**
   * Chrome extensions require removing the rpId field due to security restrictions.
   * Https://chromium.googlesource.com/chromium/src/+/main/content/browser/webauth/origins.md.
   */
  if (isChromeExtension()) {
    const { rpId: _, ...rest } = options
    return rest
  }

  return options
}
