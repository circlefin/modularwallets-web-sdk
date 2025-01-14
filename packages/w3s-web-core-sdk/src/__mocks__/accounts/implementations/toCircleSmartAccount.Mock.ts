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

/**
 * Mock parameters for the CircleSmartAccount implementation - encodeCalls.
 */
export const MockEncodeCallsParams = [
  {
    to: '0xCA5609B003B2776699bEa123317C82D56913C9AA' as `0x${string}`,
    data: '0x' as `0x${string}`,
  },
  {
    to: '0xc00ac2B0440BFF6699BeA128709982D5691BC7DE' as `0x${string}`,
    data: '0x' as `0x${string}`,
  },
]

/**
 * Mocks for the CircleSmartAccount implementation - toCircleSmartAccount address parameter.
 */
export const MockCircleSmartAccountAddress =
  '0xecf6C34474189B2195dA0D2b9A8F345f0bb762BB'

/**
 * Mocks for the CircleSmartAccount implementation - encodeCalls (execute).
 */
export const MockEncodeCallsExecuteResult =
  '0xb61d27f6000000000000000000000000ca5609b003b2776699bea123317c82d56913c9aa000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000'

/**
 * Mocks for the CircleSmartAccount implementation - encodeCalls (executeBatch).
 */
export const MockEncodeCallsExecuteBatchResult =
  '0x34fcd5be00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000ca5609b003b2776699bea123317c82d56913c9aa000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c00ac2b0440bff6699bea128709982d5691bc7de000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000'

/**
 * Mocks for the CircleSmartAccount implementation - encodeCalls (empty calls).
 */
export const MockEncodeCallsEmptyCallsResult =
  '0x34fcd5be00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000'

/**
 * Mocks for the CircleSmartAccount implementation - getFactoryArgs.
 */
export const FactoryArgsDeployedResult = {
  factory: undefined,
  factoryData: undefined,
}

/**
 * Mocks for the CircleSmartAccount implementation - getFactoryArgs.
 */
export const FactoryArgsNotDeployResult = {
  factory: '0xc83d88C018D143d08AFE910221D445189Fc6817a',
  factoryData:
    '0x81d0dff1863bb58aafe20b10fc2e347a735fb95755f3bbcbc50e78da76846d7dad5b34b2000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000340000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000000020000000000000000000000005a2262d58eb72b84701d6efbf6bb6586c793a65b00000000000000000000000003431fb00fb2e26b5bc502dfef8da30e1c8643b80000000000000000000000000000000000000000000000000000000000000002a043327d77a74c1c55cfa799284b831fe09535a88b9f5fa4173d334e5ba0fd91d892482cc7e665eca1d358d318d38aa3a63c10247d473d04fc3538f4069ce4ae0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000001e0000000000000000000000000000000000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000012b09685da7842117bfedb0668ffe1b6abe4d7e57298402cc996caafebce98b979edfd692718a0962b4ed55a3e768747fe0b6541c1f348fa1e7c2582c672da94c000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000',
}

/**
 * Mocks for the CircleSmartAccount implementation - getStubSignature.
 */
export const MockGetStubSignatureResult = '0x_mocked_stub_signature_result'

/**
 * Mocks for the CircleSmartAccount implementation - getAddress.
 */
export const MockGetAddressResult = '0x2F96BdFdef089e4219375Df39fee743AF5D8C0BA'

/**
 * Mocks for the CircleSmartAccount implementation - getAddress.
 */
export const MockGetAddressResultWithParameter =
  '0xecf6C34474189B2195dA0D2b9A8F345f0bb762BB'

/**
 * Mock parameters for the CircleSmartAccount implementation - sign.
 */
export const MockSignParams = {
  hash: '0xd9eba16ed0ecae432b71fe008c98cc872bb4cc214d3220a36f365326cf807d68' as `0x${string}`,
}

/**
 * Mocks for the CircleSmartAccount implementation - sign.
 */
export const MockReplaySafeHash =
  '0xd9eba16ed0ecae432b71fe008c98cc872bb4cc214d3220a36f365326cf807d68'

/**
 * Mocks for the CircleSmartAccount implementation - sign.
 */
export const MockSignResult =
  '0x863bb58aafe20b10fc2e347a735fb95755f3bbcbc50e78da76846d7dad5b34b2000000000000000000000000000000000000000000000000000000000000004102000000000000000000000000000000000000000000000000000000000000024000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000060a0c43a5828012752b439cca8e2b006a55f41737ae96057d38839ecd03271406f4beaf0d77def012616d6a863c1de9ac097a59c4340d57e8e714d17c4dc736c7600000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000001700000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000d07b2274797065223a22776562617574686e2e676574222c226368616c6c656e6765223a22636f6f354d4238424162314d596673514d537748506d4d596f534e5754624a677962676d34466d6d372d49222c226f726967696e223a22616e64726f69643a61706b2d6b65792d686173683a50474f45667162664253726d6838666664526e45325a5453647072506c634152554a4e5a6e304156596c49222c22616e64726f69645061636b6167654e616d65223a22636972636c652e707773646b2e6277636f726573646b2e74657374227d00000000000000000000000000000000'
/**
 * Mocks for the CircleSmartAccount implementation - wrapSignature.
 */
export const MockWrappedSignResult =
  '0x863bb58aafe20b10fc2e347a735fb95755f3bbcbc50e78da76846d7dad5b34b200000000000000000000000000000000000000000000000000000000000000410200000000000000000000000000000000000000000000000000000000000002a1863bb58aafe20b10fc2e347a735fb95755f3bbcbc50e78da76846d7dad5b34b2000000000000000000000000000000000000000000000000000000000000004102000000000000000000000000000000000000000000000000000000000000024000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000060a0c43a5828012752b439cca8e2b006a55f41737ae96057d38839ecd03271406f4beaf0d77def012616d6a863c1de9ac097a59c4340d57e8e714d17c4dc736c7600000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000001700000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000d07b2274797065223a22776562617574686e2e676574222c226368616c6c656e6765223a22636f6f354d4238424162314d596673514d537748506d4d596f534e5754624a677962676d34466d6d372d49222c226f726967696e223a22616e64726f69643a61706b2d6b65792d686173683a50474f45667162664253726d6838666664526e45325a5453647072506c634152554a4e5a6e304156596c49222c22616e64726f69645061636b6167654e616d65223a22636972636c652e707773646b2e6277636f726573646b2e74657374227d00000000000000000000000000000000'

/**
 * Mocks for the CircleSmartAccount implementation - wrapSignature.
 */
export const MockWrappedUserOpSignResult =
  '0x863bb58aafe20b10fc2e347a735fb95755f3bbcbc50e78da76846d7dad5b34b200000000000000000000000000000000000000000000000000000000000000412200000000000000000000000000000000000000000000000000000000000002a1863bb58aafe20b10fc2e347a735fb95755f3bbcbc50e78da76846d7dad5b34b2000000000000000000000000000000000000000000000000000000000000004102000000000000000000000000000000000000000000000000000000000000024000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000060a0c43a5828012752b439cca8e2b006a55f41737ae96057d38839ecd03271406f4beaf0d77def012616d6a863c1de9ac097a59c4340d57e8e714d17c4dc736c7600000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000001700000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000d07b2274797065223a22776562617574686e2e676574222c226368616c6c656e6765223a22636f6f354d4238424162314d596673514d537748506d4d596f534e5754624a677962676d34466d6d372d49222c226f726967696e223a22616e64726f69643a61706b2d6b65792d686173683a50474f45667162664253726d6838666664526e45325a5453647072506c634152554a4e5a6e304156596c49222c22616e64726f69645061636b6167654e616d65223a22636972636c652e707773646b2e6277636f726573646b2e74657374227d00000000000000000000000000000000'

/**
 * Mocks for the CircleSmartAccount implementation - toEthSignedMessageHash.
 */
export const MockEthSignedMessageResult =
  '0x42b09b45d32c40f3569dce398f3cc24b434144b60eb88e573d470a1fc46d9f92'

/**
 * Mocks for the CircleSmartAccount implementation - publicKey.
 */
export const MockPublicKey = [
  {
    x: 104399299798377307097487227193462381816237738365685799892749492768218029901929n,
    y: 52381118694567697490788325326696537421605379502805922679544517735246258604774n,
  },
]

/**
 * Mocks for the CircleSmartAccount implementation - computeAddress.
 */
export const MockComputedAddressResult =
  '0x0DfBDc93a6a8F11403f55d0034765EEe2B315c3B'

/**
 * Mocks for the CircleSmartAccount implementation - webAuthnSign (internal).
 */
export const MockInternalSignResult =
  '0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000060a0c43a5828012752b439cca8e2b006a55f41737ae96057d38839ecd03271406f4beaf0d77def012616d6a863c1de9ac097a59c4340d57e8e714d17c4dc736c7600000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000001700000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000d07b2274797065223a22776562617574686e2e676574222c226368616c6c656e6765223a22636f6f354d4238424162314d596673514d537748506d4d596f534e5754624a677962676d34466d6d372d49222c226f726967696e223a22616e64726f69643a61706b2d6b65792d686173683a50474f45667162664253726d6838666664526e45325a5453647072506c634152554a4e5a6e304156596c49222c22616e64726f69645061636b6167654e616d65223a22636972636c652e707773646b2e6277636f726573646b2e74657374227d00000000000000000000000000000000'

/**
 * Mocks for the CircleSmartAccount implementation - webAuthnSignMessage (internal).
 */
export const MockInternalSignMessageResult = MockInternalSignResult
/**
 * Mock parameters for the CircleSmartAccount implementation - signTypedData.
 */
export const MockSignTypedDataParams = {
  primaryType: 'EIP712Domain' as `EIP712Domain`,
  domain: {
    name: 'example.com',
    chainId: 1,
  },
}

/**
 * Mocks for the CircleSmartAccount implementation - signTypedData.
 */
export const MockSignTypedDataResult = MockSignResult
/**
 * Mock parameters for the CircleSmartAccount implementation - signUserOperation.
 */
export const MockSignUserOperationParams = {
  sender: '0x1234' as `0x${string}`,
  chainId: 1,
  nonce: 0n,
  callData: '0x123' as `0x${string}`,
  preVerificationGas: 0n,
  signature: '0x1234' as `0x${string}`,
  verificationGasLimit: 0n,
  callGasLimit: 0n,
  maxFeePerGas: 0n,
  maxPriorityFeePerGas: 0n,
}

/**
 * Mocks for the CircleSmartAccount implementation - signUserOperation.
 */
export const MockSignUserOperationResult =
  '0x0000b58aafe20b10fc2e347a735fb95755f3bbcbc50e78da76846d7dad5b34b2000000000000000000000000000000000000000000000000000000000000004122000000000000000000000000000000000000000000000000000000000000024000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000060a0c43a5828012752b439cca8e2b006a55f41737ae96057d38839ecd03271406f4beaf0d77def012616d6a863c1de9ac097a59c4340d57e8e714d17c4dc736c7600000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000001700000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000d07b2274797065223a22776562617574686e2e676574222c226368616c6c656e6765223a22636f6f354d4238424162314d596673514d537748506d4d596f534e5754624a677962676d34466d6d372d49222c226f726967696e223a22616e64726f69643a61706b2d6b65792d686173683a50474f45667162664253726d6838666664526e45325a5453647072506c634152554a4e5a6e304156596c49222c22616e64726f69645061636b6167654e616d65223a22636972636c652e707773646b2e6277636f726573646b2e74657374227d00000000000000000000000000000000'

/**
 * Mock parameters for the CircleSmartAccount implementation - signMessage.
 */
export const MockSignMessageParams = {
  message:
    '0xd9eba16ed0ecae432b71fe008c98cc872bb4cc214d3220a36f365326cf807d68' as `0x${string}`,
}

/**
 * Mocks for the CircleSmartAccount implementation - signMessage.
 */
export const MockSignMessageResult = MockSignResult
