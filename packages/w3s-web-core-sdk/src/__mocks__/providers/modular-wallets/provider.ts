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

import { MethodNotImplementedError } from 'web3-errors'

import { ModularWalletsProvider } from '../../../providers'
import { AccountType } from '../../../types'
import { getJsonRpcResponse } from '../../../utils'

import {
  BlockNumberResult,
  BlockResult,
  ChainIdResult,
  CreateAddressMappingResult,
  EntryPointsResult,
  EstimateUserOperationGasResult,
  EthCallResult,
  GasPriceResult,
  GetAddressMappingResult,
  GetAddressResult,
  GetBalanceResult,
  GetCodeResult,
  GetPaymasterDataResult,
  GetPaymasterStubDataResult,
  GetUserOperationReceiptResult,
  GetUserOperationResult,
  MaxPriorityFeePerGasResult,
  SendUserOperationResult,
  GetUserOperationGasPriceResult,
} from './ModularWallets.Mock'

import type {
  EthExecutionAPI,
  Web3APIMethod,
  Web3APIPayload,
  Web3APIReturnType,
  Web3APISpec,
} from 'web3-types'

/**
 * A Web3 provider that mocks Modular Wallets API responses.
 */
export default class MockModularWalletsProvider<
  API extends Web3APISpec = EthExecutionAPI,
> extends ModularWalletsProvider<API> {
  private accountType: AccountType

  /**
   * Creates an instance of MockModularWalletsProvider.
   * @param accountType - The account type that represents the owner. Default is {@link AccountType.WebAuthn}.
   */
  public constructor(accountType: AccountType = AccountType.WebAuthn) {
    super('https://example.com', 'test-client-key')
    this.accountType = accountType
  }

  public async request<
    Method extends Web3APIMethod<API>,
    ResultType = Web3APIReturnType<API, Method>,
  >(
    payload: Web3APIPayload<API, Method>,
    _requestOptions?: RequestInit,
  ): Promise<ResultType> {
    switch (payload.method) {
      case 'eth_supportedEntryPoints':
        return (
          await getJsonRpcResponse<API, Method, ResultType>(
            payload,
            EntryPointsResult,
          )
        ).result
      case 'eth_sendUserOperation':
        return (
          await getJsonRpcResponse<API, Method, ResultType>(
            payload,
            SendUserOperationResult,
          )
        ).result
      case 'eth_estimateUserOperationGas':
        return (
          await getJsonRpcResponse<API, Method, ResultType>(
            payload,
            EstimateUserOperationGasResult,
          )
        ).result
      case 'eth_getUserOperationByHash':
        return (
          await getJsonRpcResponse<API, Method, ResultType>(
            payload,
            GetUserOperationResult,
          )
        ).result
      case 'eth_getUserOperationReceipt':
        return (
          await getJsonRpcResponse<API, Method, ResultType>(
            payload,
            GetUserOperationReceiptResult,
          )
        ).result
      case 'eth_chainId':
        return (
          await getJsonRpcResponse<API, Method, ResultType>(
            payload,
            ChainIdResult,
          )
        ).result
      case 'eth_getBalance':
        return (
          await getJsonRpcResponse<API, Method, ResultType>(
            payload,
            GetBalanceResult,
          )
        ).result
      case 'eth_blockNumber':
        return (
          await getJsonRpcResponse<API, Method, ResultType>(
            payload,
            BlockNumberResult,
          )
        ).result
      case 'eth_call':
        return (
          await getJsonRpcResponse<API, Method, ResultType>(
            payload,
            EthCallResult,
          )
        ).result
      case 'eth_getBlockByNumber':
        return (
          await getJsonRpcResponse<API, Method, ResultType>(
            payload,
            BlockResult,
          )
        ).result
      case 'eth_maxPriorityFeePerGas':
        return (
          await getJsonRpcResponse<API, Method, ResultType>(
            payload,
            MaxPriorityFeePerGasResult,
          )
        ).result
      case 'eth_gasPrice':
        return (
          await getJsonRpcResponse<API, Method, ResultType>(
            payload,
            GasPriceResult,
          )
        ).result
      case 'eth_getCode':
        return (
          await getJsonRpcResponse<API, Method, ResultType>(
            payload,
            GetCodeResult,
          )
        ).result
      case 'circle_getAddress':
        return (
          await getJsonRpcResponse<API, Method, ResultType>(
            payload,
            GetAddressResult[this.accountType],
          )
        ).result
      case 'circle_createAddressMapping':
        return (
          await getJsonRpcResponse<API, Method, ResultType>(
            payload,
            CreateAddressMappingResult,
          )
        ).result
      case 'circle_getAddressMapping':
        return (
          await getJsonRpcResponse<API, Method, ResultType>(
            payload,
            GetAddressMappingResult,
          )
        ).result
      case 'circle_getUserOperationGasPrice':
        return (
          await getJsonRpcResponse<API, Method, ResultType>(
            payload,
            GetUserOperationGasPriceResult,
          )
        ).result
      case 'pm_getPaymasterData':
        return (
          await getJsonRpcResponse<API, Method, ResultType>(
            payload,
            GetPaymasterDataResult,
          )
        ).result
      case 'pm_getPaymasterStubData':
        return (
          await getJsonRpcResponse<API, Method, ResultType>(
            payload,
            GetPaymasterStubDataResult,
          )
        ).result
      default:
        throw new MethodNotImplementedError()
    }
  }
}
