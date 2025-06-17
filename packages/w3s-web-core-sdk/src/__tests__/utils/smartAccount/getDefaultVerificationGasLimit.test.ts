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

import { createClient } from 'viem'
import { polygonAmoy } from 'viem/chains'

import {
  GetUserOperationGasPriceResult,
  toModularTransport,
} from '../../../__mocks__'
import {
  MINIMUM_VERIFICATION_GAS_LIMIT,
  MINIMUM_UNDEPLOY_VERIFICATION_GAS_LIMIT,
} from '../../../constants'
import { AccountType } from '../../../types'
import { getDefaultVerificationGasLimit } from '../../../utils'

// Define modular wallet actions mock
const mockGetUserOperationGasPrice = jest.fn()

// Mock the modularWalletActions
jest.mock('../../../clients', () => ({
  modularWalletActions: () => ({
    getUserOperationGasPrice: mockGetUserOperationGasPrice,
  }),
}))

describe('Utils > smartAccount > getDefaultVerificationGasLimit', () => {
  // Setup the client
  const transport = toModularTransport({ accountType: AccountType.WebAuthn })
  const client = createClient({
    chain: polygonAmoy,
    transport,
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return correct verification gas limit for deployed smart account', async () => {
    // Mock the getUserOperationGasPrice to return the expected result
    mockGetUserOperationGasPrice.mockResolvedValue(
      GetUserOperationGasPriceResult,
    )

    // Call the function with deployed = true
    const result = await getDefaultVerificationGasLimit(client, true)

    // Verify correct values are returned
    expect(result).toEqual(Number(GetUserOperationGasPriceResult.deployed))

    // Verify the getUserOperationGasPrice was called
    expect(mockGetUserOperationGasPrice).toHaveBeenCalledTimes(1)
  })

  it('should return correct verification gas limit for non-deployed smart account', async () => {
    // Mock the getUserOperationGasPrice to return the expected result
    mockGetUserOperationGasPrice.mockResolvedValue(
      GetUserOperationGasPriceResult,
    )

    // Call the function with deployed = false
    const result = await getDefaultVerificationGasLimit(client, false)

    // Verify correct values are returned
    expect(result).toEqual(Number(GetUserOperationGasPriceResult.notDeployed))

    // Verify the getUserOperationGasPrice was called
    expect(mockGetUserOperationGasPrice).toHaveBeenCalledTimes(1)
  })

  it('should handle missing deployed and notDeployed values', async () => {
    // Create a modified result without deployed and notDeployed values
    const modifiedResult = {
      ...GetUserOperationGasPriceResult,
      deployed: undefined,
      notDeployed: undefined,
    }

    // Mock the getUserOperationGasPrice to return the modified result
    mockGetUserOperationGasPrice.mockResolvedValue(modifiedResult)

    // Call the function with deployed = true (should use the fallback constant value)
    const resultDeployed = await getDefaultVerificationGasLimit(client, true)

    // Verify correct values are returned with the constant for verificationGasLimit
    expect(resultDeployed).toBe(MINIMUM_VERIFICATION_GAS_LIMIT)

    // Call the function with deployed = false (should use the fallback constant value)
    const resultNotDeployed = await getDefaultVerificationGasLimit(
      client,
      false,
    )

    // Verify correct values are returned with the constant for verificationGasLimit
    expect(resultNotDeployed).toBe(MINIMUM_UNDEPLOY_VERIFICATION_GAS_LIMIT)
  })

  it('should handle errors and return fallback values', async () => {
    // Mock the getUserOperationGasPrice to throw an error
    mockGetUserOperationGasPrice.mockRejectedValue(new Error('RPC error'))

    // Call the function with deployed = true (should catch the error and return fallback values)
    const resultDeployed = await getDefaultVerificationGasLimit(client, true)

    // Verify fallback values are returned using the constants
    expect(resultDeployed).toBe(MINIMUM_VERIFICATION_GAS_LIMIT)

    // Call the function with deployed = false (should catch the error and return fallback values)
    const resultNotDeployed = await getDefaultVerificationGasLimit(
      client,
      false,
    )

    // Verify fallback values are returned using the constants
    expect(resultNotDeployed).toBe(MINIMUM_UNDEPLOY_VERIFICATION_GAS_LIMIT)

    // Verify the getUserOperationGasPrice was called twice
    expect(mockGetUserOperationGasPrice).toHaveBeenCalledTimes(2)
  })
})
