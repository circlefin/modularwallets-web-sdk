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

import { decodeAbiParameters, stringToHex, type Hex } from 'viem'

import { AUTHENTICATOR_DATA } from '../../abis'
import { ENTRY_POINT_07, FACTORY, STUB_SIGNATURE } from '../../constants'

describe('Smart Account Constants', () => {
  it('should export entryPoint with correct properties', () => {
    expect(ENTRY_POINT_07).toBeDefined()
    expect(ENTRY_POINT_07).toHaveProperty('abi')
    expect(ENTRY_POINT_07).toHaveProperty('address')
    expect(ENTRY_POINT_07).toHaveProperty('version', '0.7')
  })

  it('should export factory with correct properties', () => {
    expect(FACTORY).toBeDefined()
    expect(FACTORY).toHaveProperty('abi')
    expect(FACTORY).toHaveProperty('address')
    expect(FACTORY.address).toBe('0x0000000DF7E6c9Dc387cAFc5eCBfa6c3a6179AdD')
  })

  it('should export stub signature', () => {
    expect(STUB_SIGNATURE).toBeDefined()
  })

  it('should decode the stub signature', () => {
    let offset = 0
    const wrappedData = STUB_SIGNATURE.slice(2)

    const sender = '0x' + wrappedData.slice(offset, offset + 64)
    offset += 64

    const fixedValue = BigInt('0x' + wrappedData.slice(offset, offset + 64))
    offset += 64

    const sigType = parseInt(wrappedData.slice(offset, offset + 2), 16)
    offset += 2

    const sigLength = BigInt('0x' + wrappedData.slice(offset, offset + 64))
    offset += 64

    const signature = ('0x' +
      wrappedData.slice(offset, offset + Number(sigLength) * 2)) as Hex

    expect(sender).toBe(
      '0x0000be58786f7ae825e097256fc83a4749b95189e03e9963348373e9c595b152',
    )
    expect(fixedValue).toBe(65n)
    expect(sigType).toBe(34)
    expect(sigLength).toBe(576n)
    expect(signature).toBe(
      '0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000006091077742edaf8be2fa866827236532ec2a5547fe2721e606ba591d1ffae7a15c022e5f8fe5614bbf65ea23ad3781910eb04a1a60fae88190001ecf46e5f5680a00000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000001700000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002549960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d9763050000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000867b2274797065223a22776562617574686e2e676574222c226368616c6c656e6765223a224b6d62474d316a4d554b57794d6352414c6774553953537144384841744867486178564b6547516b503541222c226f726967696e223a22687474703a2f2f6c6f63616c686f73743a35313733222c2263726f73734f726967696e223a66616c73657d0000000000000000000000000000000000000000000000000000',
    )

    const values = decodeAbiParameters(AUTHENTICATOR_DATA, signature)
    const {
      webAuthnData: {
        authenticatorData,
        clientDataJSON,
        challengeIndex,
        typeIndex,
      },
      r,
      s,
    } = values[0]

    const mockClientDataJSONHex = stringToHex(
      `{"type":"webauthn.get","challenge":"KmbGM1jMUKWyMcRALgtU9SSqD8HAtHgHaxVKeGQkP5A","origin":"http://localhost:5173","crossOrigin":false}`,
    )

    expect(authenticatorData).toBe(
      '0x49960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d97630500000000',
    )
    expect(clientDataJSON).toBe(mockClientDataJSONHex)
    expect(challengeIndex).toBe(23n)
    expect(typeIndex).toBe(1n)
    expect(r).toBe(
      65598554086230051852458873484680482763545221260710486252326167969554919563612n,
    )
    expect(s).toBe(
      986560207478196961402101717612577862689750704552302603413595528664561575946n,
    )
  })
})
