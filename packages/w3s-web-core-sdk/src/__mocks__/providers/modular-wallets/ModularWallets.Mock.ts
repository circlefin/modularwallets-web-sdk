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

import type { GetAddressParameters } from '../../../actions'
import type { GetAddressReturnType, ModularWallet } from '../../../types'

/**
 * Mocks for ModularWallets rpc responses - eth_supportedEntryPoints.
 */
export const EntryPointsResult = ['0x123', '0x456']

/**
 * Mocks for ModularWallets rpc responses - eth_sendUserOperation.
 */
export const SendUserOperationResult =
  '0x824cce7c7c2ec6874b9fa9a9a898eb5f27cbaf3991dfa81084c3af60d1db618c'

/**
 * Mocks for ModularWallets rpc responses - eth_estimateUserOperationGas.
 */
export const EstimateUserOperationGasResult = {
  callGasLimit: '0x22945',
  paymasterPostOpGasLimit: '0x0',
  paymasterVerificationGasLimit: '0x0',
  preVerificationGas: '0xd0de',
  verificationGasLimit: '0x3f6e6',
}

/**
 * Mocks for ModularWallets rpc responses - eth_getUserOperationByHash.
 */
export const GetUserOperationResult = {
  blockHash:
    '0xb3b20624f8f0f86eb50dd04688409e5cea4bd02d700bf6e79e9384d47d6a5a35',
  blockNumber: '0x5bad55',
  entryPoint: '0x1234567890abcdef1234567890abcdef12345678',
  transactionHash:
    '0x8784d99762bccd03b2086eabccee0d77f14d05463281e121a62abfebcf0d2d5f',
  userOperation: {
    sender: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef',
    nonce: '0x1',
    initCode: '0x',
    callData: '0x',
    callGasLimit: '0x5208',
    verificationGasLimit: '0x1e8480',
    preVerificationGas: '0x5208',
    maxFeePerGas: '0x3b9aca00',
    maxPriorityFeePerGas: '0x3b9aca00',
    paymasterAndData: '0x',
    signature: '0x',
  },
}

/**
 * Mocks for ModularWallets rpc responses - eth_getUserOperationReceipt.
 */
export const GetUserOperationReceiptResult = {
  userOpHash:
    '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  entryPoint: '0x1234567890abcdef1234567890abcdef12345678',
  sender: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef',
  nonce: 1,
  paymaster: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef',
  actualGasCost: '0x3b9aca',
  actualGasUsed: '0x5208',
  success: true,
  reason: '',
  logs: [
    {
      address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef',
      topics: [
        '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdef',
      ],
      data: '0x',
      blockNumber: '0x5bad55',
      transactionHash:
        '0x8784d99762bccd03b2086eabccee0d77f14d05463281e121a62abfebcf0d2d5f',
      transactionIndex: '0x1',
      blockHash:
        '0xb3b20624f8f0f86eb50dd04688409e5cea4bd02d700bf6e79e9384d47d6a5a35',
      logIndex: '0x1',
      removed: false,
    },
  ],
  receipt: {
    blobGasPrice: BigInt(0).toString(),
    blobGasUsed: BigInt(0).toString(),
    blockHash:
      '0xb3b20624f8f0f86eb50dd04688409e5cea4bd02d700bf6e79e9384d47d6a5a35',
    blockNumber: BigInt('0x5bad55').toString(),
    contractAddress: null,
    cumulativeGasUsed: BigInt('0x79ccd3').toString(),
    effectiveGasPrice: BigInt('0x3b9aca00').toString(),
    from: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef',
    gasUsed: BigInt('0x5208').toString(),
    logs: [
      {
        address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef',
        topics: [
          '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
          '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdef',
        ],
        data: '0x',
        blockNumber: BigInt('0x5bad55').toString(),
        transactionHash:
          '0x8784d99762bccd03b2086eabccee0d77f14d05463281e121a62abfebcf0d2d5f',
        transactionIndex: '0x1',
        blockHash:
          '0xb3b20624f8f0f86eb50dd04688409e5cea4bd02d700bf6e79e9384d47d6a5a35',
        logIndex: '0x1',
        removed: false,
      },
    ],
    logsBloom:
      '0x4848112002a2020aaa0812180045840210020005281600c80104264300080008000491220144461026015300100000128005018401002090a824a4150015410020140400d808440106689b29d0280b1005200007480ca950b15b010908814e01911000054202a020b05880b914642a0000300003010044044082075290283516be82504082003008c4d8d14462a8800c2990c88002a030140180036c220205201860402001014040180002006860810ec0a1100a14144148408118608200060461821802c081000042d0810104a8004510020211c088200420822a082040e10104c00d010064004c122692020c408a1aa2348020445403814002c800888208b1',
    root: '',
    status: 'success',
    to: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef',
    transactionHash:
      '0x8784d99762bccd03b2086eabccee0d77f14d05463281e121a62abfebcf0d2d5f',
    transactionIndex: 1,
    type: 'legacy',
  },
}

/**
 * Mocks for ModularWallets rpc responses - eth_chainId.
 */
export const ChainIdResult = 1

/**
 * Mocks for ModularWallets rpc responses - eth_getBalance.
 */
export const GetBalanceResult = 1 * 10 ** 18

/**
 * Mocks for ModularWallets rpc responses - eth_blockNumber.
 */
export const BlockNumberResult = 20890761

/**
 * Mocks for ModularWallets rpc responses - eth_call.
 */
export const EthCallResult = '0x'

/**
 * Mocks for ModularWallets rpc responses - eth_getBlockByNumber.
 */
export const BlockResult = {
  difficulty: '0xbfabcdbd93dda',
  extraData: '0x737061726b706f6f6c2d636e2d6e6f64652d3132',
  gasLimit: '0x79f39e',
  gasUsed: '0x79ccd3',
  hash: '0xb3b20624f8f0f86eb50dd04688409e5cea4bd02d700bf6e79e9384d47d6a5a35',
  logsBloom:
    '0x4848112002a2020aaa0812180045840210020005281600c80104264300080008000491220144461026015300100000128005018401002090a824a4150015410020140400d808440106689b29d0280b1005200007480ca950b15b010908814e01911000054202a020b05880b914642a0000300003010044044082075290283516be82504082003008c4d8d14462a8800c2990c88002a030140180036c220205201860402001014040180002006860810ec0a1100a14144148408118608200060461821802c081000042d0810104a8004510020211c088200420822a082040e10104c00d010064004c122692020c408a1aa2348020445403814002c800888208b1',
  miner: '0x5a0b54d5dc17e0aadc383d2db43b0a0d3e029c4c',
  mixHash: '0x3d1fdd16f15aeab72e7db1013b9f034ee33641d92f71c0736beab4e67d34c7a7',
  nonce: '0x4db7a1c01d8a8072',
  number: '0x5bad55',
  parentHash:
    '0x61a8ad530a8a43e3583f8ec163f773ad370329b2375d66433eb82f005e1d6202',
  receiptsRoot:
    '0x5eced534b3d84d3d732ddbc714f5fd51d98a941b28182b6efe6df3a0fe90004b',
  sha3Uncles:
    '0x8a562e7634774d3e3a36698ac4915e37fc84a2cd0044cb84fa5d80263d2af4f6',
  size: '0x41c7',
  stateRoot:
    '0xf5208fffa2ba5a3f3a2f64ebd5ca3d098978bedd75f335f56b705d8715ee2305',
  timestamp: '0x5b541449',
  totalDifficulty: '0x12ac11391a2f3872fcd',
  transactions: [
    '0x8784d99762bccd03b2086eabccee0d77f14d05463281e121a62abfebcf0d2d5f',
    '0x311be6a9b58748717ac0f70eb801d29973661aaf1365960d159e4ec4f4aa2d7f',
    '0xe42b0256058b7cad8a14b136a0364acda0b4c36f5b02dea7e69bfd82cef252a2',
    '0x4eb05376055c6456ed883fc843bc43df1dcf739c321ba431d518aecd7f98ca11',
    '0x994dd9e72b212b7dc5fd0466ab75adf7d391cf4f206a65b7ad2a1fd032bb06d7',
    '0xf1cd627c97746bc75727c2f0efa2d0dc66cca1b36d8e45d897e18a9b19af2f60',
    '0x241d89f7888fbcfadfd415ee967882fec6fdd67c07ca8a00f2ca4c910a84c7dd',
  ],
  transactionsRoot:
    '0xf98631e290e88f58a46b7032f025969039aa9b5696498efc76baf436fa69b262',
  uncles: [
    '0x824cce7c7c2ec6874b9fa9a9a898eb5f27cbaf3991dfa81084c3af60d1db618c',
  ],
}

/**
 * Mocks for ModularWallets rpc responses - eth_maxPriorityFeePerGas.
 */
export const MaxPriorityFeePerGasResult = 1 * 10 ** 9

/**
 * Mocks for ModularWallets rpc responses - eth_gasPrice.
 */
export const GasPriceResult = 1 * 10 ** 9

/**
 * Mocks for ModularWallets rpc responses - eth_getCode.
 */
export const GetCodeResult = '0x12345'

/**
 * Partial mocks for ModularWallets rpc responses - circle_getAddress.
 */
export const MockWallet: ModularWallet = {
  id: 'test-id',
  address: '0x0f6Fed7D7526Aaa1692438AD1D77AaA0Ea9d0a56',
  blockchain: 'ETH-SEPOLIA',
  state: 'LIVE',
  scaCore: 'circle_6900_v1',
  scaConfiguration: {
    initialOwnershipConfiguration: {
      ownershipContractAddress: '0x5a2262d58eB72B84701D6efBf6bB6586C793A65b',
      weightedMultisig: {
        webauthnOwners: [
          {
            publicKeyX: '1237',
            publicKeyY: '789',
            weight: 1,
          },
        ],
        thresholdWeight: 1,
      },
    },
    initCode:
      '0xc83d88c018d143d08afe910221d445189fc6817a81d0dff11c68729a576fa4e64e02721e4abc6e54c356775d074064d0d7a9e8e67e357e6d000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000340000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000000020000000000000000000000005a2262d58eb72b84701d6efbf6bb6586c793a65b00000000000000000000000003431fb00fb2e26b5bc502dfef8da30e1c8643b80000000000000000000000000000000000000000000000000000000000000002a043327d77a74c1c55cfa799284b831fe09535a88b9f5fa4173d334e5ba0fd91d892482cc7e665eca1d358d318d38aa3a63c10247d473d04fc3538f4069ce4ae0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000001e0000000000000000000000000000000000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000004d20000000000000000000000000000000000000000000000000000000000000315000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000',
  },
  createDate: '2024-11-05T01:27:17Z',
  updateDate: '2024-11-05T01:27:17Z',
}

/**
 * Partial mocks for ModularWallets rpc responses - circle_getAddress.
 */
export const MockWalletForValidationError: ModularWallet = {
  id: 'test-id-2',
  address: '0x2F96BdFdef089e4219375Df39fee743AF5D8C0BB',
  blockchain: 'ETH-SEPOLIA',
  state: 'LIVE',
  scaCore: 'circle_6900_v1',
  scaConfiguration: {
    initialOwnershipConfiguration: {
      ownershipContractAddress: '0x5a2262d58eB72B84701D6efBf6bB6586C793A65b',
      weightedMultisig: {
        webauthnOwners: [
          {
            publicKeyX: '1237',
            publicKeyY: '789',
            weight: 1,
          },
        ],
        thresholdWeight: 1,
      },
    },
    initCode:
      '0xc83d88c018d143d08afe910221d445189fc6817a81d0dff11c68729a576fa4e64e02721e4abc6e54c356775d074064d0d7a9e8e67e357e6d000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000340000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000000020000000000000000000000005a2262d58eb72b84701d6efbf6bb6586c793a65b00000000000000000000000003431fb00fb2e26b5bc502dfef8da30e1c8643b80000000000000000000000000000000000000000000000000000000000000002a043327d77a74c1c55cfa799284b831fe09535a88b9f5fa4173d334e5ba0fd91d892482cc7e665eca1d358d318d38aa3a63c10247d473d04fc3538f4069ce4ae0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000001e0000000000000000000000000000000000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000004d20000000000000000000000000000000000000000000000000000000000000315000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000',
  },
  createDate: '2024-11-05T01:27:17Z',
  updateDate: '2024-11-05T01:27:17Z',
}

/**
 * Mocks for ModularWallets rpc responses - circle_getAddress.
 */
export const GetAddressResult: GetAddressReturnType = MockWallet

/**
 * Mocks for ModularWallets rpc responses - circle_getAddress.
 */
export const GetAddressResultForValidationError: GetAddressReturnType =
  MockWalletForValidationError

/**
 * Mocks for ModularWallets action - getAddress.
 */
export const GetAddressMockParameters: GetAddressParameters = [
  {
    scaConfiguration: {
      initialOwnershipConfiguration: {
        weightedMultisig: {
          webauthnOwners: [
            {
              publicKeyX: '1',
              publicKeyY: '1',
              weight: 1,
            },
          ],
          thresholdWeight: 1,
        },
      },
      scaCore: 'circle_6900_v1',
    },
  },
]

/**
 * Mocks for Paymaster rpc responses - pm_getPaymasterData.
 */
export const GetPaymasterDataResult = {
  paymaster: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef',
  paymasterData:
    '0xb3b20624f8f0f86eb50dd04688409e5cea4bd02d700bf6e79e9384d47d6a5a35',
}

/**
 * Mocks for Paymaster rpc responses - pm_getPaymasterStubData.
 */
export const GetPaymasterStubDataResult = {
  paymaster: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef',
  paymasterData:
    '0xb3b20624f8f0f86eb50dd04688409e5cea4bd02d700bf6e79e9384d47d6a5a35',
  isFinal: false,
  paymasterVerificationGasLimit: '0x0',
  paymasterPostOpGasLimit: '0x0',
}
