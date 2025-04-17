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

import { createBundlerClient } from 'viem/account-abstraction'
import { polygonAmoy } from 'viem/chains'

import { toModularTransport } from '../../../__mocks__'
import { recoveryActions } from '../../../clients'
import { AccountType } from '../../../types'

// Mocking the actions
jest.mock('../../../actions/recovery', () => {
  const jestMockResult = (mockResult: string) => {
    return jest.fn().mockImplementation(() => Promise.resolve({ mockResult }))
  }

  return {
    estimateExecuteRecoveryGas: jestMockResult('gasEstimate'),
    estimateRegisterRecoveryAddressGas: jestMockResult('gasEstimate'),
    executeRecovery: jestMockResult('operationHash'),
    registerRecoveryAddress: jestMockResult('operationHash'),
  }
})

describe('Client > Decorators > recovery', () => {
  const transport = toModularTransport({
    accountType: AccountType.WebAuthn,
  })
  const client = createBundlerClient({
    chain: polygonAmoy,
    transport,
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should include correct recovery actions', () => {
    expect(recoveryActions(client)).toMatchInlineSnapshot(`
      {
        "estimateExecuteRecoveryGas": [Function],
        "estimateRegisterRecoveryAddressGas": [Function],
        "executeRecovery": [Function],
        "registerRecoveryAddress": [Function],
      }
    `)
  })

  it('should execute the recovery actions correctly', async () => {
    // Get the recovery actions
    const actions = recoveryActions(client)
    const params = {} as never

    // Call each action with mock parameters
    const estimateExecuteResult =
      await actions.estimateExecuteRecoveryGas(params)
    const estimateRegisterResult =
      await actions.estimateRegisterRecoveryAddressGas(params)
    const executeResult = await actions.executeRecovery(params)
    const registerResult = await actions.registerRecoveryAddress(params)

    // Verify the results match what our mocks return
    expect(estimateExecuteResult).toEqual({ mockResult: 'gasEstimate' })
    expect(estimateRegisterResult).toEqual({ mockResult: 'gasEstimate' })
    expect(executeResult).toEqual({ mockResult: 'operationHash' })
    expect(registerResult).toEqual({ mockResult: 'operationHash' })
  })
})
