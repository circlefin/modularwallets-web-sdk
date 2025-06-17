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

import type { AtLeastOne, NonEmptyArray } from './utils'
import type { Hex, LocalAccount } from 'viem'
import type { WebAuthnAccount } from 'viem/account-abstraction'

/**
 * The EOA identifier.
 */
export interface EOAIdentifier {
  /**
   * The address.
   */
  address: Hex
}

/**
 * The Webauthn identifier.
 */
export interface WebAuthnIdentifier {
  /**
   * The public key X coordinate.
   */
  publicKeyX: string
  /**
   * The public key Y coordinate.
   */
  publicKeyY: string
}

/**
 * The Webauthn owner.
 */
export interface WebauthnOwner extends WebAuthnIdentifier {
  /**
   * The weight.
   */
  weight: number
}

/**
 * The Eoa owner.
 */
export interface EoaOwner extends EOAIdentifier {
  /**
   * The weight.
   */
  weight: number
}

/**
 * The Base type of Circle modular wallet weighted multisig.
 */
export interface WeightedMultisigBase {
  /**
   * The threshold weight.
   */
  thresholdWeight: number
}

/**
 * The Circle modular wallet weighted multisig.
 * Ensures at least one owner is present.
 */
export type WeightedMultisig = WeightedMultisigBase &
  AtLeastOne<{
    owners?: EoaOwner[]
    webauthnOwners?: WebauthnOwner[]
  }>

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

/*
 * Enum representing different types of accounts.
 */
export enum AccountType {
  /** Used for {@link WebAuthnAccount}, an account that relies on WebAuthn for authentication and signing. */
  WebAuthn = 'webAuthn',

  /** Used for {@link LocalAccount}, an account that is stored locally and supports private key-based signing. */
  Local = 'local',
}

/**
 * The owner identifier type for address mapping.
 */
export enum OwnerIdentifierType {
  EOA = 'EOAOWNER',
  WebAuthn = 'WEBAUTHOWNER',
}

/**
 * The owner for address mapping.
 */
export type AddressMappingOwner =
  | {
      /**
       * The EOA owner type.
       */
      type: OwnerIdentifierType.EOA
      /**
       * The EOA identifier.
       */
      identifier: EOAIdentifier
    }
  | {
      /**
       * The WebAuthn owner type.
       */
      type: OwnerIdentifierType.WebAuthn
      /**
       * The WebAuthn identifier.
       */
      identifier: WebAuthnIdentifier
    }

/**
 * The parameters for creating an address mapping.
 */
export interface CreateAddressMappingParameters {
  /**
   * The Circle smart wallet address.
   */
  walletAddress: Hex
  /**
   * The owners of the wallet.
   * Requires at least one owner to be specified.
   */
  owners: NonEmptyArray<AddressMappingOwner>
}

/**
 * The address mapping response.
 */
export interface AddressMappingResponse {
  /**
   * The mapping ID.
   */
  id: string
  /**
   * The blockchain identifier.
   */
  blockchain: string
  /**
   * The owner information.
   */
  owner: AddressMappingOwner
  /**
   * The wallet address.
   */
  walletAddress: Hex
  /**
   * The creation date (ISO 8601 format).
   */
  createDate: string
  /**
   * The last update date (ISO 8601 format).
   */
  updateDate: string
}

/**
 * The return type for adding an address mapping.
 */
export type CreateAddressMappingReturnType = AddressMappingResponse[]

/**
 * The parameters for getting an address mapping.
 */
export interface GetAddressMappingParameters {
  /**
   * The owner information.
   */
  owner: AddressMappingOwner
}

/**
 * The return type for getting an address mapping.
 */
export type GetAddressMappingReturnType = AddressMappingResponse[]

/**
 * Represents gas prices for different priority levels.
 */
export interface GasPriceLevel {
  /**
   * The max priority fee per gas.
   */
  maxPriorityFeePerGas: string
  /**
   * The max fee per gas.
   */
  maxFeePerGas: string
}

/**
 * The get user operation gas price response.
 */
export interface GetUserOperationGasPriceResponse {
  /**
   * The low gas price level.
   */
  low: GasPriceLevel
  /**
   * The medium gas price level.
   */
  medium: GasPriceLevel
  /**
   * The high gas price level.
   */
  high: GasPriceLevel
  /**
   * The deployed verification gas.
   */
  deployed?: string
  /**
   * The non-deployed verification gas.
   */
  notDeployed?: string
}

/**
 * Response type for circle_getUserOperationGasPrice RPC method.
 */
export type GetUserOperationGasPriceReturnType =
  GetUserOperationGasPriceResponse
