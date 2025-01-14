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

import { mainnet, sepolia } from 'viem/chains'

import {
  MAINNET_MINIMUM_UNDEPLOY_VERIFICATION_GAS_LIMIT,
  MAINNET_MINIMUM_VERIFICATION_GAS_LIMIT,
  MINIMUM_UNDEPLOY_VERIFICATION_GAS_LIMIT,
  MINIMUM_VERIFICATION_GAS_LIMIT,
  SEPOLIA_MINIMUM_UNDEPLOY_VERIFICATION_GAS_LIMIT,
  SEPOLIA_MINIMUM_VERIFICATION_GAS_LIMIT,
} from '../../../constants'
import { getMinimumVerificationGasLimit } from '../../../utils'

describe('Utils > smartAccount > getMinimumVerificationGasLimit', () => {
  it('should return Sepolia deployed gas limit when chainId is Sepolia and deployed is true', () => {
    expect(getMinimumVerificationGasLimit(true, sepolia.id)).toBe(
      SEPOLIA_MINIMUM_VERIFICATION_GAS_LIMIT,
    )
  })

  it('should return Sepolia undeployed gas limit when chainId is Sepolia and deployed is false', () => {
    expect(getMinimumVerificationGasLimit(false, sepolia.id)).toBe(
      SEPOLIA_MINIMUM_UNDEPLOY_VERIFICATION_GAS_LIMIT,
    )
  })

  it('should return Mainnet deployed gas limit when chainId is Mainnet and deployed is true', () => {
    expect(getMinimumVerificationGasLimit(true, mainnet.id)).toBe(
      MAINNET_MINIMUM_VERIFICATION_GAS_LIMIT,
    )
  })

  it('should return Mainnet undeployed gas limit when chainId is Mainnet and deployed is false', () => {
    expect(getMinimumVerificationGasLimit(false, mainnet.id)).toBe(
      MAINNET_MINIMUM_UNDEPLOY_VERIFICATION_GAS_LIMIT,
    )
  })

  it('should return default deployed gas limit when chainId is not specified and deployed is true', () => {
    expect(getMinimumVerificationGasLimit(true)).toBe(
      MINIMUM_VERIFICATION_GAS_LIMIT,
    )
  })

  it('should return default undeployed gas limit when chainId is not specified and deployed is false', () => {
    expect(getMinimumVerificationGasLimit(false)).toBe(
      MINIMUM_UNDEPLOY_VERIFICATION_GAS_LIMIT,
    )
  })

  it('should return default deployed gas limit when chainId is not supported and deployed is true', () => {
    expect(getMinimumVerificationGasLimit(true, 999999)).toBe(
      MINIMUM_VERIFICATION_GAS_LIMIT,
    )
  })

  it('should return default undeployed gas limit when chainId is not supported and deployed is false', () => {
    expect(getMinimumVerificationGasLimit(false, 999999)).toBe(
      MINIMUM_UNDEPLOY_VERIFICATION_GAS_LIMIT,
    )
  })
})
