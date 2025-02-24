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

import type { Hex } from 'viem'

/**
 * The Webauthn owner.
 */
export interface WebauthnOwner {
  /**
   * The public key X coordinate.
   */
  publicKeyX: string
  /**
   * The public key Y coordinate.
   */
  publicKeyY: string
  /**
   * The weight.
   */
  weight: number
}

/**
 * The Circle modular wallet weighted multisig.
 */
export interface WeightedMultisig {
  /**
   * The Webauthn owners.
   */
  webauthnOwners: WebauthnOwner[]
  /**
   * The threshold weight.
   */
  thresholdWeight: number
}

/**
 * The Circle modular wallet initial ownership configuration.
 */
export interface InitialOwnershipConfiguration {
  /**
   * The ownership contract address.
   */
  ownershipContractAddress: Hex
  /**
   * The weighted multisig.
   */
  weightedMultisig: WeightedMultisig
}

/**
 * The Circle modular wallet SCA configuration.
 */
export interface ScaConfiguration {
  /**
   * The initial ownership configuration.
   */
  initialOwnershipConfiguration: InitialOwnershipConfiguration
  /**
   * The initial code.
   */
  initCode: Hex
}

/**
 * The Circle modular wallet.
 */
export interface ModularWallet {
  /**
   * The wallet ID.
   */
  id: string
  /**
   * The wallet address.
   */
  address: Hex
  /**
   * The blockchain.
   */
  blockchain: string
  /**
   * The state.
   */
  state: string
  /**
   * The SCA core.
   */
  scaCore: string
  /**
   * The SCA configuration.
   */
  scaConfiguration: ScaConfiguration
  /**
   * The create date.
   */
  createDate: string
  /**
   * The update date.
   */
  updateDate: string
}

/**
 * The Get Circle modular wallet address response.
 */
export type GetAddressReturnType = ModularWallet

/**
 * The return type for encodeTransfer.
 */
export interface EncodeTransferReturnType {
  /**
   * The encoded data.
   */
  data: Hex
  /**
   * The token address.
   */
  to: Hex
}
