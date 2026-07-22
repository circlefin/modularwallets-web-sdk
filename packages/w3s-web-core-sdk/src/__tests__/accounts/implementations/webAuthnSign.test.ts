/*
 * Copyright (c) 2026, Circle Internet Group, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { decodeAbiParameters, stringToHex, type Hex } from 'viem'
import {
  toWebAuthnAccount,
  type WebAuthnAccount,
} from 'viem/account-abstraction'

import {
  LoginCredentialMock,
  MockInternalSignResult,
  MockReplaySafeHash,
  toPasskeyTransport,
} from '../../../__mocks__'
import { AUTHENTICATOR_DATA } from '../../../abis'
import { toWebAuthnCredential, webAuthnSign } from '../../../accounts'
import {
  AccountType,
  WebAuthnMode,
  type ToWebAuthnAccountParameters,
} from '../../../types'

describe('Accounts > implementations > webAuthnSign', () => {
  const mockNavigatorGet = globalThis.window.navigator.credentials[
    'get'
  ] as jest.Mock

  const transport = toPasskeyTransport()
  const loginParameters: ToWebAuthnAccountParameters = {
    transport,
    mode: WebAuthnMode.Login,
  }

  const hash = MockReplaySafeHash[AccountType.WebAuthn]

  let owner: WebAuthnAccount

  const createOwnerWithSignResult = (
    webauthn: Record<string, unknown>,
    signature: Hex = '0x',
  ): WebAuthnAccount => ({
    ...owner,
    sign: jest.fn().mockResolvedValue({ signature, webauthn }),
  })

  const validWebAuthnMetadata = {
    authenticatorData: '0x' as Hex,
    clientDataJSON: '{}',
    challengeIndex: 23,
    typeIndex: 1,
    userVerificationRequired: true,
  }

  beforeEach(async () => {
    mockNavigatorGet.mockResolvedValue(LoginCredentialMock)
    const credential = await toWebAuthnCredential(loginParameters)
    owner = toWebAuthnAccount({ credential })
  })

  it('should call owner.sign with the hash', async () => {
    const sign = jest.spyOn(owner, 'sign')

    await webAuthnSign({ owner, hash })

    expect(sign).toHaveBeenCalledWith({ hash })
  })

  it('should return an ABI-encoded WebAuthn signature', async () => {
    const signature = await webAuthnSign({ owner, hash })

    expect(signature).toBe(MockInternalSignResult)
  })

  it('should encode requireUserVerification as true for passkey signatures', async () => {
    const signature = await webAuthnSign({ owner, hash })

    const [{ webAuthnData }] = decodeAbiParameters(
      AUTHENTICATOR_DATA,
      signature,
    )

    expect(webAuthnData.requireUserVerification).toBe(true)
    expect(webAuthnData.challengeIndex).toBe(23n)
    expect(webAuthnData.typeIndex).toBe(1n)
  })

  it('should throw when WebAuthn metadata omits challengeIndex', async () => {
    const ownerWithIncompleteMetadata = createOwnerWithSignResult({
      ...validWebAuthnMetadata,
      challengeIndex: undefined,
    })

    await expect(
      webAuthnSign({
        owner: ownerWithIncompleteMetadata,
        hash,
      }),
    ).rejects.toThrow(
      'WebAuthn signature metadata missing challengeIndex or typeIndex.',
    )
  })

  it('should throw when WebAuthn metadata omits typeIndex', async () => {
    const ownerWithIncompleteMetadata = createOwnerWithSignResult({
      ...validWebAuthnMetadata,
      typeIndex: undefined,
    })

    await expect(
      webAuthnSign({
        owner: ownerWithIncompleteMetadata,
        hash,
      }),
    ).rejects.toThrow(
      'WebAuthn signature metadata missing challengeIndex or typeIndex.',
    )
  })

  it('should throw when WebAuthn metadata omits userVerificationRequired', async () => {
    const ownerWithIncompleteMetadata = createOwnerWithSignResult({
      authenticatorData: '0x',
      clientDataJSON: '{}',
      challengeIndex: 23,
      typeIndex: 1,
    })

    await expect(
      webAuthnSign({
        owner: ownerWithIncompleteMetadata,
        hash,
      }),
    ).rejects.toThrow(
      'WebAuthn signature metadata requires userVerificationRequired to be true.',
    )
  })

  it('should throw when WebAuthn metadata has userVerificationRequired false', async () => {
    const ownerWithIncompleteMetadata = createOwnerWithSignResult({
      ...validWebAuthnMetadata,
      userVerificationRequired: false,
    })

    await expect(
      webAuthnSign({
        owner: ownerWithIncompleteMetadata,
        hash,
      }),
    ).rejects.toThrow(
      'WebAuthn signature metadata requires userVerificationRequired to be true.',
    )
  })

  it('should pass authenticatorData and clientDataJSON through to encoding', async () => {
    const signResult = await owner.sign({ hash })
    const ownerWithSignResult = createOwnerWithSignResult(
      signResult.webauthn,
      signResult.signature,
    )

    const signature = await webAuthnSign({
      owner: ownerWithSignResult,
      hash,
    })

    const [{ webAuthnData }] = decodeAbiParameters(
      AUTHENTICATOR_DATA,
      signature,
    )

    expect(webAuthnData.authenticatorData).toBe(
      signResult.webauthn.authenticatorData,
    )
    expect(webAuthnData.clientDataJSON).toBe(
      stringToHex(signResult.webauthn.clientDataJSON),
    )
  })
})
