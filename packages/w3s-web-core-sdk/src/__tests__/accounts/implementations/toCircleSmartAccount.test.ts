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
import { createWalletClient } from 'viem'
import {
  createBundlerClient,
  toWebAuthnAccount,
} from 'viem/account-abstraction'
import { type LocalAccount, privateKeyToAccount } from 'viem/accounts'
import { mainnet, sepolia } from 'viem/chains'

import {
  FactoryArgsDeployedResult,
  FactoryArgsNotDeployResult,
  getMockOwners,
  LoginCredentialMock,
  MockCircleSmartAccountAddress,
  MockEncodeCallsEmptyCallsResult,
  MockEncodeCallsExecuteBatchResult,
  MockEncodeCallsExecuteResult,
  MockEncodeCallsParams,
  MockEoaAccount,
  MockGetAddressResult,
  MockGetAddressResultWithParameter,
  MockSignMessageParams,
  MockSignMessageResult,
  MockSignParams,
  MockSignTypedDataParams,
  MockSignTypedDataResult,
  MockSignUserOperationParams,
  MockSignUserOperationResult,
  MockSignResult,
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
import { AccountType, WebAuthnMode } from '../../../types'
import {
  getInitializeUpgradableMSCAParams,
  getSalt,
  walletClientToLocalAccount,
} from '../../../utils'
import { getSenderForContract } from '../../../utils/address/getSenderForContract'

import type {
  ToWebAuthnAccountParameters,
  WebAuthnCredential,
} from '../../../types'
import type { WalletClient } from 'viem'
import type { BundlerClient, WebAuthnAccount } from 'viem/account-abstraction'

const mockNavigatorGet = globalThis.window.navigator.credentials[
  'get'
] as jest.Mock

const passkeyTransport = toPasskeyTransport()
const loginParameters: ToWebAuthnAccountParameters = {
  transport: passkeyTransport,
  mode: WebAuthnMode.Login,
}

const localTransport = toModularTransport({ accountType: AccountType.Local })
const client: Record<string, BundlerClient> = {
  [AccountType.WebAuthn]: createBundlerClient({
    transport: toModularTransport({ accountType: AccountType.WebAuthn }),
    chain: sepolia,
  }),
  [AccountType.Local]: createBundlerClient({
    transport: localTransport,
    chain: sepolia,
  }),
}

let credential: WebAuthnCredential
let owner: WebAuthnAccount
let localOwner: LocalAccount
let walletClient: WalletClient

const owners = getMockOwners({
  [AccountType.WebAuthn]: () => owner,
  [AccountType.Local]: () => localOwner,
})

beforeAll(async () => {
  mockNavigatorGet.mockResolvedValue(LoginCredentialMock)
  credential = await toWebAuthnCredential(loginParameters)
  owner = toWebAuthnAccount({ credential })
  localOwner = privateKeyToAccount(MockEoaAccount.privateKey)
  walletClient = createWalletClient({
    account: localOwner,
    chain: mainnet,
    transport: localTransport,
  })
})

describe('Accounts > implementations > toCircleSmartAccount', () => {
  describe('return value: encodeCalls', () => {
    it.each(owners)(
      'should return mock result for execute $description',
      async ({ getOwner }) => {
        expect(getOwner()).toBeDefined()
        const owner = getOwner()
        const account = await toCircleSmartAccount({
          client: client[owner.type],
          owner,
        })

        const encodedData = await account.encodeCalls([
          MockEncodeCallsParams[0],
        ])
        expect(encodedData).toBe(MockEncodeCallsExecuteResult[owner.type])
      },
    )

    it.each(owners)(
      'should return mock result for executeBatch $description',
      async ({ getOwner }) => {
        expect(getOwner()).toBeDefined()
        const owner = getOwner()
        const account = await toCircleSmartAccount({
          client: client[owner.type],
          owner,
        })

        const encodedData = await account.encodeCalls(MockEncodeCallsParams)
        expect(encodedData).toBe(MockEncodeCallsExecuteBatchResult)
      },
    )

    it.each(owners)(
      'should return mock result when the `calls` parameter is an empty array $description',
      async ({ getOwner }) => {
        expect(getOwner()).toBeDefined()
        const owner = getOwner()
        const account = await toCircleSmartAccount({
          client: client[owner.type],
          owner,
        })

        const encodedData = await account.encodeCalls([])

        expect(encodedData).toBe(MockEncodeCallsEmptyCallsResult)
      },
    )

    describe('return value: getFactoryArgs', () => {
      it.each(owners)(
        'should return mock factory args if the smart account has not been deployed $description',
        async ({ getOwner }) => {
          expect(getOwner()).toBeDefined()
          const owner = getOwner()
          const account = await toCircleSmartAccount({
            client: client[owner.type],
            owner,
          })

          account.isDeployed = jest.fn().mockResolvedValue(false)
          const encodeFunctionDataSpy = jest.spyOn(viem, 'encodeFunctionData')

          const factoryArgs = await account.getFactoryArgs()

          const sender = getSenderForContract(owner)
          const salt = getSalt()
          const initializeUpgradableMSCAParams =
            getInitializeUpgradableMSCAParams(owner)

          expect(encodeFunctionDataSpy).toHaveBeenCalledWith({
            abi: factory.abi,
            functionName: 'createAccount',
            args: [sender, salt, initializeUpgradableMSCAParams],
          })
          expect(factoryArgs.factory?.toLowerCase()).toEqual(
            FactoryArgsNotDeployResult[owner.type].factory.toLowerCase(),
          )
          expect(factoryArgs.factoryData?.toLocaleLowerCase()).toEqual(
            FactoryArgsNotDeployResult[
              owner.type
            ].factoryData?.toLocaleLowerCase(),
          )
        },
      )

      it.each(owners)(
        'should return mock factory args if the smart account has been deployed $description',
        async ({ getOwner }) => {
          const owner = getOwner()
          const account = await toCircleSmartAccount({
            client: client[owner.type],
            owner,
          })
          account.isDeployed = jest.fn().mockResolvedValue(true)

          const factoryArgs = await account.getFactoryArgs()

          expect(factoryArgs).toEqual(FactoryArgsDeployedResult)
        },
      )
    })

    describe('return value: getStubSignature', () => {
      it.each(owners)(
        'should return mock result $description',
        async ({ getOwner }) => {
          expect(getOwner()).toBeDefined()
          const owner = getOwner()
          const account = await toCircleSmartAccount({
            client: client[owner.type],
            owner,
          })

          const stubSignature = await account.getStubSignature()

          expect(stubSignature).toBe(STUB_SIGNATURE)
        },
      )
    })

    describe('return value: getAddress', () => {
      it.each(owners)(
        'should return mock address $description',
        async ({ getOwner }) => {
          expect(getOwner()).toBeDefined()
          const owner = getOwner()
          const account = await toCircleSmartAccount({
            client: client[owner.type],
            owner,
          })

          const address = await account.getAddress()

          expect(address).toBe(MockGetAddressResult[owner.type])
        },
      )

      it.each(owners)(
        'should return mock address from parameter $description',
        async ({ getOwner }) => {
          expect(getOwner()).toBeDefined()
          const owner = getOwner()
          const account = await toCircleSmartAccount({
            address: MockCircleSmartAccountAddress,
            client: client[owner.type],
            owner,
          })

          const address = await account.getAddress()

          expect(address).toBe(MockGetAddressResultWithParameter)
        },
      )
    })

    describe('return value: sign', () => {
      it.each(owners)(
        'should return mock result $description',
        async ({ getOwner }) => {
          expect(getOwner()).toBeDefined()
          const owner = getOwner()
          const account = await toCircleSmartAccount({
            client: client[owner.type],
            owner,
          })

          const signature = await account.sign(MockSignParams[owner.type])
          expect(signature).toBe(MockSignResult[owner.type])
        },
      )

      it('should throw an error when sign with a LocalAccount converted from WalletClient', async () => {
        const owner = walletClientToLocalAccount(walletClient)
        const account = await toCircleSmartAccount({
          client: client[owner.type],
          owner,
        })
        await expect(account.sign(MockSignParams[owner.type])).rejects.toThrow(
          '`owner` does not support raw sign.',
        )
      })
    })

    describe('return value: signTypedData', () => {
      it.each(owners)(
        'should return mock result $description',
        async ({ getOwner }) => {
          expect(getOwner()).toBeDefined()
          const owner = getOwner()
          const account = await toCircleSmartAccount({
            client: client[owner.type],
            owner,
          })

          const signature = await account.signTypedData(MockSignTypedDataParams)

          expect(signature).toBe(MockSignTypedDataResult[owner.type])
        },
      )

      it('should throw an error when signTypedData with a LocalAccount converted from WalletClient', async () => {
        const owner = walletClientToLocalAccount(walletClient)
        const account = await toCircleSmartAccount({
          client: client[owner.type],
          owner,
        })
        await expect(
          account.signTypedData(MockSignTypedDataParams),
        ).rejects.toThrow('`owner` does not support raw sign.')
      })
    })

    describe('return value: signUserOperation', () => {
      it.each(owners)(
        'should return mock result $description',
        async ({ getOwner }) => {
          expect(getOwner()).toBeDefined()
          const owner = getOwner()
          const account = await toCircleSmartAccount({
            client: client[owner.type],
            owner,
          })

          const signature = await account.signUserOperation(
            MockSignUserOperationParams,
          )

          expect(signature).toBe(MockSignUserOperationResult[owner.type])
        },
      )

      it('should return mock result with a LocalAccount converted from WalletClient', async () => {
        const owner = walletClientToLocalAccount(walletClient)
        const account = await toCircleSmartAccount({
          client: client[owner.type],
          owner,
        })
        const signature = await account.signUserOperation(
          MockSignUserOperationParams,
        )

        expect(signature).toBe(MockSignUserOperationResult[owner.type])
      })
    })

    describe('return value: signMessage', () => {
      it.each(owners)(
        'should return mock result $description',
        async ({ getOwner }) => {
          expect(getOwner()).toBeDefined()
          const owner = getOwner()
          const account = await toCircleSmartAccount({
            client: client[owner.type],
            owner,
          })

          const signature = await account.signMessage(MockSignMessageParams)

          expect(signature).toBe(MockSignMessageResult[owner.type])
        },
      )

      it('should throw an error when signMessage with a LocalAccount converted from WalletClient', async () => {
        const owner = walletClientToLocalAccount(walletClient)
        const account = await toCircleSmartAccount({
          client: client[owner.type],
          owner,
        })
        await expect(
          account.signMessage(MockSignMessageParams),
        ).rejects.toThrow('`owner` does not support raw sign.')
      })
    })

    describe('return value: userOperation.estimateGas', () => {
      beforeEach(() => {
        fetchMock.enableMocks()
      })

      afterEach(() => {
        fetchMock.resetMocks()
      })

      it.each(owners)(
        'should return the updated verification gas limit value when the updated value is greater than the minimum value $description',
        async ({ getOwner }) => {
          expect(getOwner()).toBeDefined()
          const owner = getOwner()
          const account = await toCircleSmartAccount({
            client: client[owner.type],
            owner,
          })

          const mockVerificationGasLimit = 900_000n

          const estimateGas = await account.userOperation?.estimateGas?.({
            verificationGasLimit: mockVerificationGasLimit,
          })

          expect(estimateGas?.verificationGasLimit).toBe(
            BigInt(mockVerificationGasLimit),
          )
        },
      )

      it.each(owners)(
        'should return the minimum verification gas limit value when the updated value is less than the minimum value $description',
        async ({ getOwner }) => {
          expect(getOwner()).toBeDefined()
          const owner = getOwner()
          const account = await toCircleSmartAccount({
            client: client[owner.type],
            owner,
          })

          const estimateGas = await account.userOperation?.estimateGas?.({
            verificationGasLimit: 0n,
          })

          expect(estimateGas?.verificationGasLimit).toBe(
            BigInt(SEPOLIA_MINIMUM_VERIFICATION_GAS_LIMIT),
          )
        },
      )

      it.each(owners)(
        'should return the minimum verification gas limit when the updated value is undefined $description',
        async ({ getOwner }) => {
          expect(getOwner()).toBeDefined()
          const owner = getOwner()
          const account = await toCircleSmartAccount({
            client: client[owner.type],
            owner,
          })

          const estimateGas = await account.userOperation?.estimateGas?.({})

          expect(estimateGas?.verificationGasLimit).toBe(
            BigInt(SEPOLIA_MINIMUM_VERIFICATION_GAS_LIMIT),
          )
        },
      )
    })

    describe('return value: userOperation.estimateGas with undeploy smart wallet cases', () => {
      beforeEach(() => {
        fetchMock.enableMocks()

        const mockGetCode = jest.fn().mockResolvedValue('0x')
        const types: string[] = [AccountType.WebAuthn, AccountType.Local]
        types.forEach((item, _) => {
          client[item].transport.key = 'test'
          client[item].extend = jest.fn().mockReturnValue({
            getCode: mockGetCode,
          })
        })
      })

      afterEach(() => {
        fetchMock.resetMocks()
      })

      it.each(owners)(
        `should return the minimum $description`,
        async ({ getOwner }) => {
          expect(getOwner()).toBeDefined()
          const owner = getOwner()
          const account = await toCircleSmartAccount({
            client: client[owner.type],
            owner,
          })

          const estimateGas = await account.userOperation?.estimateGas?.({
            verificationGasLimit: 0n,
          })
          expect(estimateGas?.verificationGasLimit).toBe(
            BigInt(SEPOLIA_MINIMUM_UNDEPLOY_VERIFICATION_GAS_LIMIT),
          )
        },
      )

      it.each(owners)(
        `should return the minimum undeploy verification gas limit constant when the address hasn't been deployed and the passed-in value is less than the default value $description`,
        async ({ getOwner }) => {
          expect(getOwner()).toBeDefined()
          const owner = getOwner()
          const account = await toCircleSmartAccount({
            client: client[owner.type],
            owner,
          })
          const estimateGas = await account.userOperation?.estimateGas?.({
            verificationGasLimit: 0n,
          })

          expect(estimateGas?.verificationGasLimit).toBe(
            BigInt(SEPOLIA_MINIMUM_UNDEPLOY_VERIFICATION_GAS_LIMIT),
          )
        },
      )

      it.each(owners)(
        `should return the passed-in verification gas limit value when the address hasn't been deployed and the passed-in value is greater than the default value $description`,
        async ({ getOwner }) => {
          expect(getOwner()).toBeDefined()
          const owner = getOwner()
          const account = await toCircleSmartAccount({
            client: client[owner.type],
            owner,
          })

          const mockVerificationGasLimit = 2_000_000n

          const estimateGas = await account.userOperation?.estimateGas?.({
            verificationGasLimit: mockVerificationGasLimit,
          })

          expect(estimateGas?.verificationGasLimit).toBe(
            BigInt(mockVerificationGasLimit),
          )
        },
      )
    })
  })
})
