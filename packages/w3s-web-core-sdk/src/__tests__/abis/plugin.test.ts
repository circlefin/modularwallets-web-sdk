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
  CIRCLE_PLUGIN_ADD_OWNERS_ABI,
  CIRCLE_PLUGIN_INSTALL_DATA_ABI,
} from '../../abis'

describe('ABI > pluginInstallData', () => {
  it('should export circlePluginInstallDataAbi', () => {
    expect(CIRCLE_PLUGIN_INSTALL_DATA_ABI).toBeDefined()
    expect(Array.isArray(CIRCLE_PLUGIN_INSTALL_DATA_ABI)).toBe(true)
    expect(CIRCLE_PLUGIN_INSTALL_DATA_ABI.length).toBeGreaterThan(0)
  })

  it('should export circlePluginAddOwnersAbi', () => {
    expect(CIRCLE_PLUGIN_ADD_OWNERS_ABI).toBeDefined()
    expect(Array.isArray(CIRCLE_PLUGIN_ADD_OWNERS_ABI)).toBe(true)
    expect(CIRCLE_PLUGIN_ADD_OWNERS_ABI.length).toBeGreaterThan(0)
  })
})
