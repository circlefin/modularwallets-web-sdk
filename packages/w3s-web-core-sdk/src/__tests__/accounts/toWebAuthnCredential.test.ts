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
  LoginCredentialMock,
  RegistrationCredentialMock,
  toPasskeyTransport,
} from '../../__mocks__'
import { toWebAuthnCredential } from '../../accounts'
import { WebAuthnMode } from '../../types'

import type { ToWebAuthnAccountParameters } from '../../types'

describe('Accounts > toWebAuthnCredential', () => {
  // Mock navigator.credentials functions
  const mockNavigatorCreate = globalThis.window.navigator.credentials[
    'create'
  ] as jest.Mock

  const mockNavigatorGet = globalThis.window.navigator.credentials[
    'get'
  ] as jest.Mock

  const transport = toPasskeyTransport()
  const loginParameters: ToWebAuthnAccountParameters = {
    transport,
    mode: WebAuthnMode.Login,
  }
  const registrationParameters: ToWebAuthnAccountParameters = {
    transport,
    username: 'test',
    mode: WebAuthnMode.Register,
  }

  it('should return login credential correctly', async () => {
    mockNavigatorGet.mockResolvedValueOnce(LoginCredentialMock)
    const credential = await toWebAuthnCredential(loginParameters)
    expect(credential).toBeDefined()
  })

  it('should throw error when no credential available', async () => {
    mockNavigatorGet.mockResolvedValueOnce(null)
    await expect(
      async () => await toWebAuthnCredential(loginParameters),
    ).rejects.toThrow(new Error('No credential available.'))
  })

  it('should return registration credential correctly', async () => {
    mockNavigatorCreate.mockResolvedValueOnce(RegistrationCredentialMock)
    const credential = await toWebAuthnCredential(registrationParameters)
    expect(credential).toBeDefined()
  })

  it('should throw error when no credential created', async () => {
    mockNavigatorCreate.mockResolvedValueOnce(null)
    await expect(
      async () => await toWebAuthnCredential(registrationParameters),
    ).rejects.toThrow(new Error('No credential created.'))
  })
})
