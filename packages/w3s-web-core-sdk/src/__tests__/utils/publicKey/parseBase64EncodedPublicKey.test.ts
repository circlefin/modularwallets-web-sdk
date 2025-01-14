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

import { PublicKeyMock } from '../../../__mocks__'
import { parseBase64EncodedPublicKey } from '../../../utils'

describe('Utils > publicKey > parseBase64EncodedPublicKey', () => {
  it('should parse a base64 encoded public key correctly', async () => {
    const publicKey = await parseBase64EncodedPublicKey(PublicKeyMock)
    expect(publicKey).toMatchInlineSnapshot(`
      {
        "prefix": 4,
        "x": 19466074419200073959738105585241211628148020753775013824630852158321356016535n,
        "y": 71860917893429169600935445105694584634423507253445251635294662956512690678092n,
      }
    `)
  })
})
