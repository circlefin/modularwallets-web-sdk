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

export const CIRCLE_MSCA_6900_V1_EP07_FACTORY_ABI = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_owner',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '_entryPointAddr',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '_pluginManagerAddr',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'receive',
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'acceptOwnership',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'accountImplementation',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract UpgradableMSCA',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'addStake',
    inputs: [
      {
        name: '_unstakeDelaySec',
        type: 'uint32',
        internalType: 'uint32',
      },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'createAccount',
    inputs: [
      {
        name: '_sender',
        type: 'bytes32',
        internalType: 'bytes32',
      },
      {
        name: '_salt',
        type: 'bytes32',
        internalType: 'bytes32',
      },
      {
        name: '_initializingData',
        type: 'bytes',
        internalType: 'bytes',
      },
    ],
    outputs: [
      {
        name: 'account',
        type: 'address',
        internalType: 'contract UpgradableMSCA',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'entryPoint',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract IEntryPoint',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getAddress',
    inputs: [
      {
        name: '_sender',
        type: 'bytes32',
        internalType: 'bytes32',
      },
      {
        name: '_salt',
        type: 'bytes32',
        internalType: 'bytes32',
      },
      {
        name: '_initializingData',
        type: 'bytes',
        internalType: 'bytes',
      },
    ],
    outputs: [
      {
        name: 'addr',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'mixedSalt',
        type: 'bytes32',
        internalType: 'bytes32',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'isPluginAllowed',
    inputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'owner',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'pendingOwner',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'renounceOwnership',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setPlugins',
    inputs: [
      {
        name: '_plugins',
        type: 'address[]',
        internalType: 'address[]',
      },
      {
        name: '_permissions',
        type: 'bool[]',
        internalType: 'bool[]',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'transferOwnership',
    inputs: [
      {
        name: 'newOwner',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'unlockStake',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'withdrawStake',
    inputs: [
      {
        name: '_withdrawAddress',
        type: 'address',
        internalType: 'address payable',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'AccountCreated',
    inputs: [
      {
        name: 'proxy',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'sender',
        type: 'bytes32',
        indexed: false,
        internalType: 'bytes32',
      },
      {
        name: 'salt',
        type: 'bytes32',
        indexed: false,
        internalType: 'bytes32',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'FactoryDeployed',
    inputs: [
      {
        name: 'factory',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'accountImplementation',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'entryPoint',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'OwnershipTransferStarted',
    inputs: [
      {
        name: 'previousOwner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'newOwner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'OwnershipTransferred',
    inputs: [
      {
        name: 'previousOwner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'newOwner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'error',
    name: 'Create2FailedDeployment',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidInitializationInput',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidLength',
    inputs: [],
  },
  {
    type: 'error',
    name: 'OwnableInvalidOwner',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'OwnableUnauthorizedAccount',
    inputs: [
      {
        name: 'account',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'PluginIsNotAllowed',
    inputs: [
      {
        name: 'plugin',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
] as const
