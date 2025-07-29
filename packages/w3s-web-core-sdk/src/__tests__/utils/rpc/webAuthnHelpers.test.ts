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
  adaptCredentialCreationOptions,
  adaptCredentialRequestOptions,
} from '../../../utils'
import { isChromeExtension } from '../../../utils/rpc/isChromeExtension'

jest.mock('../../../utils/rpc/isChromeExtension', () => ({
  isChromeExtension: jest.fn(),
}))

describe('Utils > rpc > webAuthnHelpers', () => {
  const mockIsChromeExtension = isChromeExtension as jest.MockedFunction<
    typeof isChromeExtension
  >

  afterEach(() => {
    mockIsChromeExtension.mockReset()
  })

  describe('adaptCredentialCreationOptions', () => {
    const mockCreationOptions: PublicKeyCredentialCreationOptions = {
      challenge: new Uint8Array([1, 2, 3]),
      rp: {
        id: 'example.com',
        name: 'Example Corp',
      },
      user: {
        id: new Uint8Array([4, 5, 6]),
        name: 'user@example.com',
        displayName: 'John Doe',
      },
      pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
      timeout: 60000,
      attestation: 'direct',
    }

    it('should return original options when not in Chrome extension', () => {
      mockIsChromeExtension.mockReturnValue(false)

      const result = adaptCredentialCreationOptions(mockCreationOptions)

      expect(result).toEqual(mockCreationOptions)
      expect(result.rp.id).toBe('example.com')
    })

    it('should remove rp.id when in Chrome extension context', () => {
      mockIsChromeExtension.mockReturnValue(true)

      const result = adaptCredentialCreationOptions(mockCreationOptions)

      expect(result.rp).toEqual({
        name: 'Example Corp',
      })
      expect(result.rp).not.toHaveProperty('id')
      expect(result.challenge).toEqual(mockCreationOptions.challenge)
      expect(result.user).toEqual(mockCreationOptions.user)
    })

    it('should preserve all other properties when removing rp.id', () => {
      mockIsChromeExtension.mockReturnValue(true)

      const result = adaptCredentialCreationOptions(mockCreationOptions)

      expect(result.challenge).toEqual(mockCreationOptions.challenge)
      expect(result.user).toEqual(mockCreationOptions.user)
      expect(result.pubKeyCredParams).toEqual(
        mockCreationOptions.pubKeyCredParams,
      )
      expect(result.timeout).toEqual(mockCreationOptions.timeout)
      expect(result.attestation).toEqual(mockCreationOptions.attestation)
    })
  })

  describe('adaptCredentialRequestOptions', () => {
    const mockRequestOptions: PublicKeyCredentialRequestOptions = {
      challenge: new Uint8Array([7, 8, 9]),
      rpId: 'example.com',
      allowCredentials: [
        {
          id: new Uint8Array([10, 11, 12]),
          type: 'public-key',
          transports: ['usb', 'nfc'],
        },
      ],
      timeout: 60000,
      userVerification: 'preferred',
    }

    it('should return original options when not in Chrome extension', () => {
      mockIsChromeExtension.mockReturnValue(false)

      const result = adaptCredentialRequestOptions(mockRequestOptions)

      expect(result).toEqual(mockRequestOptions)
      expect(result.rpId).toBe('example.com')
    })

    it('should remove rpId when in Chrome extension context', () => {
      mockIsChromeExtension.mockReturnValue(true)

      const result = adaptCredentialRequestOptions(mockRequestOptions)

      expect(result).not.toHaveProperty('rpId')
      expect(result.challenge).toEqual(mockRequestOptions.challenge)
      expect(result.allowCredentials).toEqual(
        mockRequestOptions.allowCredentials,
      )
    })

    it('should preserve all other properties when removing rpId', () => {
      mockIsChromeExtension.mockReturnValue(true)

      const result = adaptCredentialRequestOptions(mockRequestOptions)

      expect(result.challenge).toEqual(mockRequestOptions.challenge)
      expect(result.allowCredentials).toEqual(
        mockRequestOptions.allowCredentials,
      )
      expect(result.timeout).toEqual(mockRequestOptions.timeout)
      expect(result.userVerification).toEqual(
        mockRequestOptions.userVerification,
      )
    })

    it('should handle options without rpId gracefully', () => {
      mockIsChromeExtension.mockReturnValue(true)

      const optionsWithoutRpId = {
        challenge: new Uint8Array([7, 8, 9]),
        timeout: 60000,
      } as PublicKeyCredentialRequestOptions

      const result = adaptCredentialRequestOptions(optionsWithoutRpId)

      expect(result).toEqual(optionsWithoutRpId)
      expect(result).not.toHaveProperty('rpId')
    })
  })
})
