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

export const CIRCLE_PLUGIN_INSTALL_DATA_ABI = [
  { name: 'initialOwners', type: 'address[]' },
  { name: 'ownerWeights', type: 'uint256[]' },
  {
    name: 'initialPublicKeyOwners',
    type: 'tuple[]',
    components: [
      { name: 'x', type: 'uint256' },
      { name: 'y', type: 'uint256' },
    ],
  },
  { name: 'publicKeyOwnerWeights', type: 'uint256[]' },
  { name: 'thresholdWeight', type: 'uint256' },
] as const

export const CIRCLE_PLUGIN_ADD_OWNERS_ABI = [
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'ownersToAdd',
        type: 'address[]',
      },
      {
        internalType: 'uint256[]',
        name: 'weightsToAdd',
        type: 'uint256[]',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'x',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'y',
            type: 'uint256',
          },
        ],
        internalType: 'struct PublicKey[]',
        name: 'publicKeyOwnersToAdd',
        type: 'tuple[]',
      },
      {
        internalType: 'uint256[]',
        name: 'publicKeyWeightsToAdd',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256',
        name: 'newThresholdWeight',
        type: 'uint256',
      },
    ],
    name: 'addOwners',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
