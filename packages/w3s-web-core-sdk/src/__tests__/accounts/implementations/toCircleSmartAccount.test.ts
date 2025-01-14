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
import * as viem from 'viem'
import {
  createBundlerClient,
  toWebAuthnAccount,
} from 'viem/account-abstraction'
import { sepolia } from 'viem/chains'

import {
  FactoryArgsDeployedResult,
  FactoryArgsNotDeployResult,
  LoginCredentialMock,
  MockCircleSmartAccountAddress,
  MockEncodeCallsEmptyCallsResult,
  MockEncodeCallsExecuteBatchResult,
  MockEncodeCallsExecuteResult,
  MockEncodeCallsParams,
  MockGetAddressResult,
  MockGetAddressResultWithParameter,
  MockSignMessageParams,
  MockSignMessageResult,
  MockSignParams,
  MockSignResult,
  MockSignTypedDataParams,
  MockSignTypedDataResult,
  MockSignUserOperationParams,
  MockSignUserOperationResult,
  toModularTransport,
  toPasskeyTransport,
} from '../../../__mocks__'
import { toCircleSmartAccount, toWebAuthnCredential } from '../../../accounts'
import {
  FACTORY as factory,
  SEPOLIA_MINIMUM_UNDEPLOY_VERIFICATION_GAS_LIMIT,
  SEPOLIA_MINIMUM_VERIFICATION_GAS_LIMIT,
  STUB_SIGNATURE,
} from '../../../constants'
import { WebAuthnMode } from '../../../types'
import {
  getInitializeUpgradableMSCAParams,
  getJsonRpcStringifyResponse,
  getPublicKeyParamsFromOwner,
  getSalt,
} from '../../../utils'

import type {
  ToWebAuthnAccountParameters,
  WebAuthnCredential,
} from '../../../types'
import type { WebAuthnAccount } from 'viem/account-abstraction'

const mockNavigatorGet = globalThis.window.navigator.credentials[
  'get'
] as jest.Mock

const passkeyTransport = toPasskeyTransport()
const modularTransport = toModularTransport()
const loginParameters: ToWebAuthnAccountParameters = {
  transport: passkeyTransport,
  mode: WebAuthnMode.Login,
}

const client = createBundlerClient({
  transport: modularTransport,
  chain: sepolia,
})

let credential: WebAuthnCredential
let owner: WebAuthnAccount

beforeAll(async () => {
  mockNavigatorGet.mockResolvedValue(LoginCredentialMock)
  credential = await toWebAuthnCredential(loginParameters)
  owner = toWebAuthnAccount({ credential })
})

describe('Accounts > implementations > toCircleSmartAccount', () => {
  describe('return value: encodeCalls', () => {
    it('should return mock result for execute', async () => {
      const account = await toCircleSmartAccount({
        client,
        owner,
      })

      const encodedData = await account.encodeCalls([MockEncodeCallsParams[0]])

      expect(encodedData).toBe(MockEncodeCallsExecuteResult)
    })

    it('should return mock result for executeBatch', async () => {
      const account = await toCircleSmartAccount({
        client,
        owner,
      })

      const encodedData = await account.encodeCalls(MockEncodeCallsParams)

      expect(encodedData).toBe(MockEncodeCallsExecuteBatchResult)
    })

    it('should return mock result when the `calls` parameter is an empty array', async () => {
      const account = await toCircleSmartAccount({
        client,
        owner,
      })

      const encodedData = await account.encodeCalls([])

      expect(encodedData).toBe(MockEncodeCallsEmptyCallsResult)
    })
  })

  describe('return value: getFactoryArgs', () => {
    it('should return mock factory args if the smart account has not been deployed', async () => {
      const account = await toCircleSmartAccount({
        client,
        owner,
      })

      account.isDeployed = jest.fn().mockResolvedValue(false)
      const encodeFunctionDataSpy = jest.spyOn(viem, 'encodeFunctionData')

      const factoryArgs = await account.getFactoryArgs()

      const { sender } = getPublicKeyParamsFromOwner(owner)
      const salt = getSalt()
      const initializeUpgradableMSCAParams =
        getInitializeUpgradableMSCAParams(owner)

      expect(encodeFunctionDataSpy).toHaveBeenCalledWith({
        abi: factory.abi,
        functionName: 'createAccount',
        args: [sender, salt, initializeUpgradableMSCAParams],
      })
      expect(factoryArgs).toEqual(FactoryArgsNotDeployResult)
    })

    it('should return mock factory args if the smart account has been deployed', async () => {
      const account = await toCircleSmartAccount({
        client,
        owner,
      })
      account.isDeployed = jest.fn().mockResolvedValue(true)

      const factoryArgs = await account.getFactoryArgs()

      expect(factoryArgs).toEqual(FactoryArgsDeployedResult)
    })
  })

  describe('return value: getStubSignature', () => {
    it('should return mock result', async () => {
      const account = await toCircleSmartAccount({
        client,
        owner,
      })

      const stubSignature = await account.getStubSignature()

      expect(stubSignature).toBe(STUB_SIGNATURE)
    })
  })

  describe('return value: getAddress', () => {
    it('should return mock address', async () => {
      const account = await toCircleSmartAccount({
        client,
        owner,
      })

      const address = await account.getAddress()

      expect(address).toBe(MockGetAddressResult)
    })

    it('should return mock address from parameter', async () => {
      const account = await toCircleSmartAccount({
        address: MockCircleSmartAccountAddress,
        client,
        owner,
      })

      const address = await account.getAddress()

      expect(address).toBe(MockGetAddressResultWithParameter)
    })
  })

  describe('return value: sign', () => {
    it('should return mock result', async () => {
      fetchMock.mockResponseOnce(getJsonRpcStringifyResponse(MockSignResult))

      const account = await toCircleSmartAccount({
        client,
        owner,
      })

      const signature = await account.sign(MockSignParams)

      expect(signature).toBe(MockSignResult)

      fetchMock.resetMocks()
    })
  })

  describe('return value: signTypedData', () => {
    it('should return mock result', async () => {
      const account = await toCircleSmartAccount({
        client,
        owner,
      })

      const signature = await account.signTypedData(MockSignTypedDataParams)

      expect(signature).toBe(MockSignTypedDataResult)
    })
  })

  describe('return value: signUserOperation', () => {
    it('should return mock result', async () => {
      const account = await toCircleSmartAccount({
        client,
        owner,
      })

      const signature = await account.signUserOperation(
        MockSignUserOperationParams,
      )

      expect(signature).toBe(MockSignUserOperationResult)
    })
  })

  describe('return value: signMessage', () => {
    it('should return mock result', async () => {
      const account = await toCircleSmartAccount({
        client,
        owner,
      })

      const signature = await account.signMessage(MockSignMessageParams)

      expect(signature).toBe(MockSignMessageResult)
    })
  })

  describe('return value: userOperation.estimateGas', () => {
    beforeEach(() => {
      fetchMock.enableMocks()
    })

    afterEach(() => {
      fetchMock.resetMocks()
    })

    it('should return the updated verification gas limit value when the updated value is greater than the minimum value', async () => {
      const account = await toCircleSmartAccount({
        client,
        owner,
      })

      const mockVerificationGasLimit = 900_000n

      const estimateGas = await account.userOperation?.estimateGas?.({
        verificationGasLimit: mockVerificationGasLimit,
      })

      expect(estimateGas?.verificationGasLimit).toBe(
        BigInt(mockVerificationGasLimit),
      )
    })

    it('should return the minimum verification gas limit value when the updated value is less than the minimum value', async () => {
      const account = await toCircleSmartAccount({
        client,
        owner,
      })

      const estimateGas = await account.userOperation?.estimateGas?.({
        verificationGasLimit: 0n,
      })

      expect(estimateGas?.verificationGasLimit).toBe(
        BigInt(SEPOLIA_MINIMUM_VERIFICATION_GAS_LIMIT),
      )
    })

    it('should return the minimum verification gas limit when the updated value is undefined', async () => {
      const account = await toCircleSmartAccount({
        client,
        owner,
      })

      const estimateGas = await account.userOperation?.estimateGas?.({})

      expect(estimateGas?.verificationGasLimit).toBe(
        BigInt(SEPOLIA_MINIMUM_VERIFICATION_GAS_LIMIT),
      )
    })
  })

  describe('return value: userOperation.estimateGas with undeploy smart wallet cases', () => {
    beforeEach(() => {
      fetchMock.enableMocks()

      const mockGetCode = jest.fn().mockResolvedValue('0x')

      client.transport.key = 'test' // To bypass the wallet address check
      client.extend = jest.fn().mockReturnValue({
        getCode: mockGetCode,
      })
    })

    afterEach(() => {
      fetchMock.resetMocks()
    })

    it(`should return the minimum undeploy verification gas limit constant when the address hasn't been deployed`, async () => {
      const account = await toCircleSmartAccount({
        client,
        owner,
      })

      const estimateGas = await account.userOperation?.estimateGas?.({
        verificationGasLimit: 0n,
      })

      expect(estimateGas?.verificationGasLimit).toBe(
        BigInt(SEPOLIA_MINIMUM_UNDEPLOY_VERIFICATION_GAS_LIMIT),
      )
    })

    it(`should return the minimum undeploy verification gas limit constant when the address hasn't been deployed and the passed-in value is less than the default value`, async () => {
      const account = await toCircleSmartAccount({
        client,
        owner,
      })

      const estimateGas = await account.userOperation?.estimateGas?.({
        verificationGasLimit: 0n,
      })

      expect(estimateGas?.verificationGasLimit).toBe(
        BigInt(SEPOLIA_MINIMUM_UNDEPLOY_VERIFICATION_GAS_LIMIT),
      )
    })

    it(`should return the passed-in verification gas limit value when the address hasn't been deployed and the passed-in value is greater than the default value`, async () => {
      const account = await toCircleSmartAccount({
        client,
        owner,
      })

      const mockVerificationGasLimit = 2_000_000n

      const estimateGas = await account.userOperation?.estimateGas?.({
        verificationGasLimit: mockVerificationGasLimit,
      })

      expect(estimateGas?.verificationGasLimit).toBe(
        BigInt(mockVerificationGasLimit),
      )
    })
  })
})
