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

import { base64UrlToBytes, hexToBytes } from 'webauthn-p256'

import type {
  AuthenticatorAssertionResponse,
  AuthenticatorAttestationResponse,
  CustomPublicKeyCredentialCreationOptions,
  CustomPublicKeyCredentialRequestOptions,
  GetLoginOptionsReturnType,
  GetLoginVerificationReturnType,
  GetRegistrationOptionsReturnType,
  GetRegistrationVerificationReturnType,
} from '../../../types'
import type { PublicKey } from 'webauthn-p256'

export const PublicKeyHexMock =
  '0x3059301306072a8648ce3d020106082a8648ce3d030107034200041fd0593f9f25ed8ecab174bba6ea6fcf22909c53b3a4e34d5a9f6abd37d6f98cf4954eec64a4b8a39c89e7c4a00b315359e0113fa3fa325ac23cc30ab98a5f21'
export const PublicKeyMock =
  'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEKwloXaeEIRe_7bBmj_4bar5NflcphALMmWyq_rzpi5ee39aScYoJYrTtVaPnaHR_4LZUHB80j6HnwlgsZy2pTA'
export const PublicKeyParsedMock: PublicKey = {
  x: 21868597917460517187477761352722420524099240106164764068967151223753133342623n,
  y: 17155303664512101283069763710135051912510533287923520223421140454424785644644n,
}

export const CustomPublicKeyCredentialRequestOptionsMock: CustomPublicKeyCredentialRequestOptions =
  {
    allowCredentials: [
      {
        id: '60FWjcTS4VlBO1BOPwrWKw',
        type: 'public-key',
      },
    ],
    challenge: 'cOUlZ_eAUzvkz1DU7nWl0bqgyt_wmdr6XrgDcwYhzo4',
    rpId: 'example.com',
    timeout: 1000000,
    userVerification: 'required',
  }

export const GetLoginOptionsResult: GetLoginOptionsReturnType = {
  ...CustomPublicKeyCredentialRequestOptionsMock,
}

export const GetLoginVerificationResult: GetLoginVerificationReturnType = {
  publicKey: PublicKeyMock,
}

export const CustomPublicKeyCredentialCreationOptionsMock: CustomPublicKeyCredentialCreationOptions =
  {
    rp: {
      name: 'example.com',
      id: 'example.com',
    },
    user: {
      name: 'testUserName',
      displayName: 'testUserName',
      id: 'AZJymaHGfX2VeG_dLgJ--w',
    },
    challenge: 'qJYzNLcrD-scDmqMbuQv51b0ds-TlLrnb__jG_Iu0pI',
    pubKeyCredParams: [
      {
        type: 'public-key',
        alg: -7,
      },
      {
        type: 'public-key',
        alg: -35,
      },
      {
        type: 'public-key',
        alg: -36,
      },
      {
        type: 'public-key',
        alg: -257,
      },
      {
        type: 'public-key',
        alg: -258,
      },
      {
        type: 'public-key',
        alg: -259,
      },
      {
        type: 'public-key',
        alg: -37,
      },
      {
        type: 'public-key',
        alg: -38,
      },
      {
        type: 'public-key',
        alg: -39,
      },
      {
        type: 'public-key',
        alg: -8,
      },
    ],
    timeout: 1000000,
    authenticatorSelection: {
      requireResidentKey: true,
      residentKey: 'required',
    },
  }

export const GetRegistrationOptionsResult: GetRegistrationOptionsReturnType = {
  ...CustomPublicKeyCredentialCreationOptionsMock,
}

export const GetRegistrationVerificationResult: GetRegistrationVerificationReturnType =
  {
    verified: undefined,
  }

export const CredentialMock: PublicKeyCredential = {
  rawId: base64UrlToBytes('60FWjcTS4VlBO1BOPwrWKw'),
  authenticatorAttachment: 'platform',
  type: 'public-key',
  id: '60FWjcTS4VlBO1BOPwrWKw',
  response: {
    clientDataJSON: base64UrlToBytes(
      'eyJ0eXBlIjoid2ViYXV0aG4uZ2V0IiwiY2hhbGxlbmdlIjoiY29vNU1COEJBYjFNWWZzUU1Td0hQbU1Zb1NOV1RiSmd5YmdtNEZtbTctSSIsIm9yaWdpbiI6ImFuZHJvaWQ6YXBrLWtleS1oYXNoOlBHT0VmcWJmQlNybWg4ZmZkUm5FMlpUU2RwclBsY0FSVUpOWm4wQVZZbEkiLCJhbmRyb2lkUGFja2FnZU5hbWUiOiJjaXJjbGUucHdzZGsuYndjb3Jlc2RrLnRlc3QifQ',
    ),
  },
  getClientExtensionResults: () => {
    return {}
  },
  toJSON: () => {
    return {
      id: '60FWjcTS4VlBO1BOPwrWKw',
      type: 'public-key',
      rawId: '60FWjcTS4VlBO1BOPwrWKw',
    }
  },
}

export const RegistrationCredentialMock: PublicKeyCredential = {
  ...CredentialMock,
  response: {
    ...CredentialMock.response,
    getPublicKey: () => hexToBytes(PublicKeyHexMock),
  } as AuthenticatorAttestationResponse,
}

export const LoginCredentialMock: PublicKeyCredential = {
  ...CredentialMock,
  response: {
    ...CredentialMock.response,
    signature: base64UrlToBytes(
      'MEYCIQCgxDpYKAEnUrQ5zKjisAalX0FzeulgV9OIOezQMnFAbwIhALQVDyeCEP7a6SlXnD4hZT8lQV5qZkIf9oJssv4f77jb',
    ),
    userHandle: base64UrlToBytes('AZLcg5k4fY6-3XdnA3_ufg'),
  } as AuthenticatorAssertionResponse,
}
