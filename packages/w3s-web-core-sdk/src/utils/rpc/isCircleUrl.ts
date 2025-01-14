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
 * Check if the URL is a Circle URL.
 * @param url - The URL to check.
 * @returns True if the URL is a Circle URL, false otherwise.
 */
export function isCircleUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url)

    const allowedHosts = [
      'modular-sdk.circle.com',
      'modular-sdk-staging.circle.com',
    ]

    return allowedHosts.includes(parsedUrl.host)
  } catch {
    return false
  }
}
