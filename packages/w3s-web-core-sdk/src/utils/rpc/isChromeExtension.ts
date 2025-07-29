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

/**
 * Detects if the current execution context is within a Chrome extension.
 *
 * Chrome extensions have specific WebAuthn API limitations that require
 * modifications to credential creation and request options.
 * @returns True if running in a Chrome extension context, false otherwise.
 */
export function isChromeExtension(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.location?.protocol === 'chrome-extension:'
  )
}
