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

import { CIRCLE_MSCA_6900_V1_EP07_FACTORY_ABI } from '../../abis'

describe('ABI > factory', () => {
  it('should export factoryAbi', () => {
    expect(CIRCLE_MSCA_6900_V1_EP07_FACTORY_ABI).toBeDefined()
    expect(Array.isArray(CIRCLE_MSCA_6900_V1_EP07_FACTORY_ABI)).toBe(true)
    expect(CIRCLE_MSCA_6900_V1_EP07_FACTORY_ABI.length).toBeGreaterThan(0)
  })
})
