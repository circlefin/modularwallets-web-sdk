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
  encodeFunctionData,
  hashMessage,
  hashTypedData,
  pad,
  publicActions,
  slice,
} from 'viem'
import {
  entryPoint07Abi as abi,
  getUserOperationHash,
  toSmartAccount,
} from 'viem/account-abstraction'

import { toCircleModularWalletClient } from '../../clients'
import {
  ENTRY_POINT_07 as entryPoint,
  FACTORY as factory,
  MODULAR_WALLETS_TRANSPORT_KEY,
  STUB_SIGNATURE,
  UPGRADABLE_MSCA as upgradableMsca,
} from '../../constants'
import {
  type ToCircleSmartAccountParameters,
  type ToCircleSmartAccountReturnType,
} from '../../types'
import {
  computeAddress,
  getInitializeUpgradableMSCAParams,
  getMinimumVerificationGasLimit,
  getSenderForContract,
  getSalt,
  toReplaySafeHash,
} from '../../utils'

import { getModularWalletAddress } from './getModularWalletAddress'
import { signAndWrap } from './signAndWrap'

import type { Address, TypedData } from 'abitype'
import type { Hex, TypedDataDefinition } from 'viem'
import type { UserOperation } from 'viem/account-abstraction'

/**
 * Creates a Circle smart account.
 * @param parameters - Parameters to use. See {@link ToCircleSmartAccountParameters}.
 * @returns Circle smart Account. See {@link ToCircleSmartAccountReturnType}.
 */
export async function toCircleSmartAccount(
  parameters: ToCircleSmartAccountParameters,
): Promise<ToCircleSmartAccountReturnType> {
  const { address, client, owner, name } = parameters
  const publicClient = client.extend(publicActions)
  const sender = getSenderForContract(owner)
  const initializeUpgradableMSCAParams =
    getInitializeUpgradableMSCAParams(owner)
  const salt = getSalt()
  let deployed = false

  // Only calls Circle Modular Wallet API if the client transport is a Circle custom transport
  if (client.transport.key === MODULAR_WALLETS_TRANSPORT_KEY) {
    // Transform the client into a Circle modular wallet client and create a modular wallet
    const circleModularWalletClient = toCircleModularWalletClient({ client })
    const wallet = await getModularWalletAddress({
      client: circleModularWalletClient,
      owner,
      name,
    })
    // Check if the wallet address matches the owner address (case insensitive)
    if (wallet.address?.toLowerCase() !== computeAddress(owner).toLowerCase()) {
      throw new Error('Address mismatch')
    }
  }

  return toSmartAccount({
    client,
    entryPoint,
    extend: { abi, factory },
    getAddress: async function (): Promise<Address> {
      if (address) return Promise.resolve(address)
      return Promise.resolve(computeAddress(owner))
    },
    encodeCalls: function (
      calls: readonly {
        to: Hex
        data?: Hex | undefined
        value?: bigint | undefined
      }[],
    ): Promise<Hex> {
      return Promise.resolve(
        encodeFunctionData(
          calls.length === 1
            ? {
                abi: upgradableMsca.abi,
                functionName: 'execute',
                args: [
                  calls[0].to,
                  calls[0].value ?? 0n,
                  calls[0].data ?? '0x',
                ],
              }
            : {
                abi: upgradableMsca.abi,
                functionName: 'executeBatch',
                args: [
                  calls.map((call) => ({
                    data: call.data ?? '0x',
                    target: call.to,
                    value: call.value ?? 0n,
                  })),
                ],
              },
        ),
      )
    },
    async getFactoryArgs() {
      const factoryData = encodeFunctionData({
        abi: factory.abi,
        functionName: 'createAccount',
        args: [sender, salt, initializeUpgradableMSCAParams],
      })
      return Promise.resolve({ factory: factory.address, factoryData })
    },
    async getStubSignature() {
      return Promise.resolve(STUB_SIGNATURE)
    },
    async sign(parameters) {
      const address = await this.getAddress()

      const hash = toReplaySafeHash({
        address,
        chainId: client.chain!.id,
        hash: parameters.hash,
      })

      return signAndWrap({ hash, owner, sender })
    },
    async signMessage(parameters) {
      const address = await this.getAddress()

      const hash = toReplaySafeHash({
        address,
        chainId: client.chain!.id,
        hash: hashMessage(parameters.message),
      })
      return signAndWrap({
        hash,
        owner,
        sender,
      })
    },
    async signTypedData(parameters) {
      const { domain, types, primaryType, message } =
        parameters as TypedDataDefinition<TypedData, string>
      const address = await this.getAddress()

      const hash = toReplaySafeHash({
        address,
        chainId: client.chain!.id,
        hash: hashTypedData({
          domain,
          message,
          primaryType,
          types,
        }),
      })
      return signAndWrap({ hash, owner, sender })
    },
    async signUserOperation(parameters) {
      const { chainId = client.chain!.id, ...userOperation } = parameters

      const address = await this.getAddress()
      const userOperationHash = getUserOperationHash({
        chainId,
        entryPointAddress: entryPoint.address,
        entryPointVersion: entryPoint.version,
        userOperation: {
          ...(userOperation as unknown as UserOperation),
          sender: address,
        },
      })
      const pubKeyId = pad(slice(sender, 2))

      return signAndWrap({
        hash: userOperationHash,
        owner,
        sender: pubKeyId,
        hasUserOpGas: true,
      })
    },
    userOperation: {
      async estimateGas(userOperation) {
        if (!deployed) {
          const code = await publicClient.getCode({
            address: computeAddress(owner),
          })

          deployed = code !== '0x' && Boolean(code)
        }

        const minimumVerificationGasLimit = getMinimumVerificationGasLimit(
          deployed,
          client.chain?.id,
        )

        return Promise.resolve({
          verificationGasLimit: BigInt(
            Math.max(
              Number(userOperation.verificationGasLimit ?? 0n),
              minimumVerificationGasLimit,
            ),
          ),
        })
      },
    },
  })
}
