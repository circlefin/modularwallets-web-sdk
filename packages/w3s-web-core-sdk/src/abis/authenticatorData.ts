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

export const AUTHENTICATOR_DATA = [
  {
    components: [
      {
        components: [
          {
            internalType: 'bytes',
            name: 'authenticatorData',
            type: 'bytes',
          },
          {
            internalType: 'string',
            name: 'clientDataJSON',
            type: 'bytes',
          },
          {
            internalType: 'uint256',
            name: 'challengeIndex',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'typeIndex',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'requireUserVerification',
            type: 'bool',
          },
        ],
        internalType: 'struct WebAuthnData',
        name: 'webAuthnData',
        type: 'tuple',
      },
      {
        internalType: 'uint256',
        name: 'r',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 's',
        type: 'uint256',
      },
    ],
    name: 'WebAuthnSigDynamicPart',
    type: 'tuple',
  },
] as const
