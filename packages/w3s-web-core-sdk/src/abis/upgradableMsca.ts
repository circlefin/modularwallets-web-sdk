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

export const CIRCLE_MSCA_6900_V1_EP07_ABI = [
  {
    inputs: [
      {
        internalType: 'contract IEntryPoint',
        name: '_newEntryPoint',
        type: 'address',
      },
      {
        internalType: 'contract PluginManager',
        name: '_newPluginManager',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [{ internalType: 'address', name: 'target', type: 'address' }],
    name: 'AddressEmptyCode',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'address', name: 'implementation', type: 'address' },
    ],
    name: 'ERC1967InvalidImplementation',
    type: 'error',
  },
  { inputs: [], name: 'ERC1967NonPayable', type: 'error' },
  {
    inputs: [
      { internalType: 'address', name: 'plugin', type: 'address' },
      { internalType: 'bytes4', name: 'selector', type: 'bytes4' },
    ],
    name: 'ExecFromPluginToSelectorNotPermitted',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ExecuteFromPluginToExternalNotPermitted',
    type: 'error',
  },
  { inputs: [], name: 'FailedInnerCall', type: 'error' },
  { inputs: [], name: 'InvalidAuthorizer', type: 'error' },
  {
    inputs: [{ internalType: 'bytes4', name: 'selector', type: 'bytes4' }],
    name: 'InvalidExecutionFunction',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'uint8', name: 'functionId', type: 'uint8' }],
    name: 'InvalidHookFunctionId',
    type: 'error',
  },
  { inputs: [], name: 'InvalidInitialization', type: 'error' },
  { inputs: [], name: 'InvalidInitializationInput', type: 'error' },
  { inputs: [], name: 'InvalidLimit', type: 'error' },
  {
    inputs: [{ internalType: 'uint8', name: 'functionId', type: 'uint8' }],
    name: 'InvalidValidationFunctionId',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'address', name: 'plugin', type: 'address' }],
    name: 'NativeTokenSpendingNotPermitted',
    type: 'error',
  },
  { inputs: [], name: 'NotFoundSelector', type: 'error' },
  { inputs: [], name: 'NotInitializing', type: 'error' },
  {
    inputs: [{ internalType: 'bytes4', name: 'selector', type: 'bytes4' }],
    name: 'NotNativeFunctionSelector',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'address', name: 'plugin', type: 'address' },
      { internalType: 'uint8', name: 'functionId', type: 'uint8' },
      { internalType: 'bytes', name: 'revertReason', type: 'bytes' },
    ],
    name: 'PostExecHookFailed',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'address', name: 'plugin', type: 'address' },
      { internalType: 'uint8', name: 'functionId', type: 'uint8' },
      { internalType: 'bytes', name: 'revertReason', type: 'bytes' },
    ],
    name: 'PreExecHookFailed',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'address', name: 'plugin', type: 'address' },
      { internalType: 'uint8', name: 'functionId', type: 'uint8' },
      { internalType: 'bytes', name: 'revertReason', type: 'bytes' },
    ],
    name: 'PreRuntimeValidationHookFailed',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'address', name: 'plugin', type: 'address' },
      { internalType: 'uint8', name: 'functionId', type: 'uint8' },
      { internalType: 'bytes', name: 'revertReason', type: 'bytes' },
    ],
    name: 'RuntimeValidationFailed',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'address', name: 'plugin', type: 'address' }],
    name: 'TargetIsPlugin',
    type: 'error',
  },
  { inputs: [], name: 'UUPSUnauthorizedCallContext', type: 'error' },
  {
    inputs: [{ internalType: 'bytes32', name: 'slot', type: 'bytes32' }],
    name: 'UUPSUnsupportedProxiableUUID',
    type: 'error',
  },
  { inputs: [], name: 'UnauthorizedCaller', type: 'error' },
  { inputs: [], name: 'WalletStorageIsInitialized', type: 'error' },
  { inputs: [], name: 'WalletStorageIsInitializing', type: 'error' },
  { inputs: [], name: 'WalletStorageIsNotInitializing', type: 'error' },
  { inputs: [], name: 'WrongTimeBounds', type: 'error' },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint64',
        name: 'version',
        type: 'uint64',
      },
    ],
    name: 'Initialized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'plugin',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'manifestHash',
        type: 'bytes32',
      },
      {
        components: [
          { internalType: 'address', name: 'plugin', type: 'address' },
          { internalType: 'uint8', name: 'functionId', type: 'uint8' },
        ],
        indexed: false,
        internalType: 'struct FunctionReference[]',
        name: 'dependencies',
        type: 'tuple[]',
      },
    ],
    name: 'PluginInstalled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'plugin',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'bool',
        name: 'onUninstallSucceeded',
        type: 'bool',
      },
    ],
    name: 'PluginUninstalled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'entryPointAddress',
        type: 'address',
      },
    ],
    name: 'UpgradableMSCAInitialized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'implementation',
        type: 'address',
      },
    ],
    name: 'Upgraded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [],
    name: 'WalletStorageInitialized',
    type: 'event',
  },
  { stateMutability: 'payable', type: 'fallback' },
  {
    inputs: [],
    name: 'UPGRADE_INTERFACE_VERSION',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'addDeposit',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'author',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'entryPoint',
    outputs: [
      { internalType: 'contract IEntryPoint', name: '', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'target', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
    ],
    name: 'execute',
    outputs: [{ internalType: 'bytes', name: 'returnData', type: 'bytes' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'target', type: 'address' },
          { internalType: 'uint256', name: 'value', type: 'uint256' },
          { internalType: 'bytes', name: 'data', type: 'bytes' },
        ],
        internalType: 'struct Call[]',
        name: 'calls',
        type: 'tuple[]',
      },
    ],
    name: 'executeBatch',
    outputs: [{ internalType: 'bytes[]', name: 'returnData', type: 'bytes[]' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes', name: 'data', type: 'bytes' }],
    name: 'executeFromPlugin',
    outputs: [{ internalType: 'bytes', name: '', type: 'bytes' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'target', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
    ],
    name: 'executeFromPluginExternal',
    outputs: [{ internalType: 'bytes', name: '', type: 'bytes' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getDeposit',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getEntryPoint',
    outputs: [
      { internalType: 'contract IEntryPoint', name: '', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes4', name: 'selector', type: 'bytes4' }],
    name: 'getExecutionFunctionConfig',
    outputs: [
      {
        components: [
          { internalType: 'address', name: 'plugin', type: 'address' },
          {
            components: [
              { internalType: 'address', name: 'plugin', type: 'address' },
              { internalType: 'uint8', name: 'functionId', type: 'uint8' },
            ],
            internalType: 'struct FunctionReference',
            name: 'userOpValidationFunction',
            type: 'tuple',
          },
          {
            components: [
              { internalType: 'address', name: 'plugin', type: 'address' },
              { internalType: 'uint8', name: 'functionId', type: 'uint8' },
            ],
            internalType: 'struct FunctionReference',
            name: 'runtimeValidationFunction',
            type: 'tuple',
          },
        ],
        internalType: 'struct ExecutionFunctionConfig',
        name: 'executionFunctionConfig',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes4', name: 'selector', type: 'bytes4' }],
    name: 'getExecutionHooks',
    outputs: [
      {
        components: [
          {
            components: [
              { internalType: 'address', name: 'plugin', type: 'address' },
              { internalType: 'uint8', name: 'functionId', type: 'uint8' },
            ],
            internalType: 'struct FunctionReference',
            name: 'preExecHook',
            type: 'tuple',
          },
          {
            components: [
              { internalType: 'address', name: 'plugin', type: 'address' },
              { internalType: 'uint8', name: 'functionId', type: 'uint8' },
            ],
            internalType: 'struct FunctionReference',
            name: 'postExecHook',
            type: 'tuple',
          },
        ],
        internalType: 'struct ExecutionHooks[]',
        name: 'executionHooks',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getInstalledPlugins',
    outputs: [
      { internalType: 'address[]', name: 'pluginAddresses', type: 'address[]' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getNonce',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes4', name: 'selector', type: 'bytes4' }],
    name: 'getPreValidationHooks',
    outputs: [
      {
        components: [
          { internalType: 'address', name: 'plugin', type: 'address' },
          { internalType: 'uint8', name: 'functionId', type: 'uint8' },
        ],
        internalType: 'struct FunctionReference[]',
        name: 'preUserOpValidationHooks',
        type: 'tuple[]',
      },
      {
        components: [
          { internalType: 'address', name: 'plugin', type: 'address' },
          { internalType: 'uint8', name: 'functionId', type: 'uint8' },
        ],
        internalType: 'struct FunctionReference[]',
        name: 'preRuntimeValidationHooks',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address[]', name: 'plugins', type: 'address[]' },
      { internalType: 'bytes32[]', name: 'manifestHashes', type: 'bytes32[]' },
      { internalType: 'bytes[]', name: 'pluginInstallData', type: 'bytes[]' },
    ],
    name: 'initializeUpgradableMSCA',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'plugin', type: 'address' },
      { internalType: 'bytes32', name: 'manifestHash', type: 'bytes32' },
      { internalType: 'bytes', name: 'pluginInstallData', type: 'bytes' },
      {
        components: [
          { internalType: 'address', name: 'plugin', type: 'address' },
          { internalType: 'uint8', name: 'functionId', type: 'uint8' },
        ],
        internalType: 'struct FunctionReference[]',
        name: 'dependencies',
        type: 'tuple[]',
      },
    ],
    name: 'installPlugin',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'pluginManager',
    outputs: [
      { internalType: 'contract PluginManager', name: '', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'plugin', type: 'address' },
      { internalType: 'bytes', name: 'config', type: 'bytes' },
      { internalType: 'bytes', name: 'pluginUninstallData', type: 'bytes' },
    ],
    name: 'uninstallPlugin',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'newImplementation', type: 'address' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'sender', type: 'address' },
          { internalType: 'uint256', name: 'nonce', type: 'uint256' },
          { internalType: 'bytes', name: 'initCode', type: 'bytes' },
          { internalType: 'bytes', name: 'callData', type: 'bytes' },
          {
            internalType: 'bytes32',
            name: 'accountGasLimits',
            type: 'bytes32',
          },
          {
            internalType: 'uint256',
            name: 'preVerificationGas',
            type: 'uint256',
          },
          { internalType: 'bytes32', name: 'gasFees', type: 'bytes32' },
          { internalType: 'bytes', name: 'paymasterAndData', type: 'bytes' },
          { internalType: 'bytes', name: 'signature', type: 'bytes' },
        ],
        internalType: 'struct PackedUserOperation',
        name: 'userOp',
        type: 'tuple',
      },
      { internalType: 'bytes32', name: 'userOpHash', type: 'bytes32' },
      { internalType: 'uint256', name: 'missingAccountFunds', type: 'uint256' },
    ],
    name: 'validateUserOp',
    outputs: [
      { internalType: 'uint256', name: 'validationData', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'version',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address payable',
        name: 'withdrawAddress',
        type: 'address',
      },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'withdrawDepositTo',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  { stateMutability: 'payable', type: 'receive' },
] as const
