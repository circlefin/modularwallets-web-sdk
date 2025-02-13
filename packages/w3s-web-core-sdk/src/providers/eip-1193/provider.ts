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

import { type BundlerClient } from 'viem/_types/account-abstraction'

import { BaseProvider } from '../base'

import type { TypedData } from 'abitype'
import type {
  Hex,
  PublicClient,
  SendTransactionParameters,
  TypedDataDefinition,
} from 'viem'
import type {
  EthExecutionAPI,
  Web3APIMethod,
  Web3APIPayload,
  Web3APIReturnType,
  Web3APISpec,
} from 'web3-types'

/**
 * An EIP-1193 provider that connects to the Modular Wallets API.
 * @param bundlerClient - The bundler client.
 * @param publicClient - The public client.
 */
export default class EIP1193Provider<
  API extends Web3APISpec = EthExecutionAPI,
> extends BaseProvider<API> {
  private readonly publicClient: PublicClient
  private readonly bundlerClient: BundlerClient

  public constructor(bundlerClient: BundlerClient, publicClient: PublicClient) {
    super()

    this.bundlerClient = bundlerClient
    this.publicClient = publicClient

    if (this.bundlerClient.account === undefined) {
      throw new Error('Account is required')
    }
  }

  public async request<
    Method extends Web3APIMethod<API>,
    ResultType = Web3APIReturnType<API, Method>,
  >(payload: Web3APIPayload<API, Method>): Promise<ResultType> {
    const { method, params } = payload

    switch (method) {
      case 'eth_accounts':
      case 'eth_requestAccounts': {
        const address = await this.bundlerClient.account!.getAddress()

        return this.getResponse([address], payload)
      }
      case 'personal_sign': {
        const [challenge, address] = params as [Hex, Hex]

        await this.validateAddress(address)

        const result = await this.bundlerClient.account!.signMessage({
          message: challenge,
        })

        return this.getResponse(result, payload)
      }
      case 'eth_sendTransaction': {
        const [{ data, to, value }] = params as [SendTransactionParameters]

        if (!to) throw new Error('Missing to address')

        const userOpHash = await this.bundlerClient.sendUserOperation({
          calls: [
            {
              to,
              value: value ?? BigInt(0),
              data: data ?? '0x',
            },
          ],
          account: this.bundlerClient.account,
        })

        const { receipt } =
          await this.bundlerClient.waitForUserOperationReceipt({
            hash: userOpHash,
          })

        return this.getResponse(receipt.transactionHash, payload)
      }
      case 'eth_getTransactionReceipt': {
        const [hash] = params as [Hex]

        const receipt = await this.publicClient.waitForTransactionReceipt({
          hash,
        })

        return this.getResponse(receipt, payload)
      }
      case 'eth_signTypedData_v4': {
        const [address, typedData] = params as [
          Hex,
          TypedDataDefinition<TypedData, string>,
        ]

        await this.validateAddress(address)

        const result =
          await this.bundlerClient.account!.signTypedData(typedData)

        return this.getResponse(result, payload)
      }
      default: {
        const result = await this.bundlerClient.transport.request(payload)

        return this.getResponse(result, payload)
      }
    }
  }

  /**
   * Validates the specified address.
   * @param address - The address to validate.
   */
  private async validateAddress(address: Hex) {
    const clientAddress = await this.bundlerClient.account!.getAddress()

    if (clientAddress !== address) {
      throw new Error('Invalid account')
    }
  }

  /**
   * Creates a JSON-RPC response with the specified result.
   * @param result - The result to include in the response.
   * @param payload - The payload of the request.
   */
  private getResponse<
    API extends Web3APISpec,
    Method extends Web3APIMethod<API>,
    ResultType,
  >(result: unknown, payload: Web3APIPayload<API, Method>): ResultType {
    const { jsonrpc, id } = payload

    return {
      result,
      jsonrpc,
      id,
    } as ResultType
  }
}
