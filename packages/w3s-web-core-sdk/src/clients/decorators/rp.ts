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
  getLoginOptions,
  type GetLoginOptionsParameters,
  getLoginVerification,
  type GetLoginVerificationParameters,
  getRegistrationOptions,
  type GetRegistrationOptionsParameters,
  getRegistrationVerification,
  type GetRegistrationVerificationParameters,
} from '../../actions'

import type {
  GetLoginOptionsReturnType,
  GetLoginVerificationReturnType,
  GetRegistrationOptionsReturnType,
  GetRegistrationVerificationReturnType,
} from '../../types'
import type { Client, Transport } from 'viem'

export type RpActions = {
  /**
   * Returns the login options, including a challenge for verification.
   * @param parameters - Parameters to use. See {@link GetLoginOptionsParameters}.
   * @returns Credential Request Options. See {@link GetLoginOptionsReturnType}.
   */
  getLoginOptions: (
    parameters: GetLoginOptionsParameters,
  ) => Promise<GetLoginOptionsReturnType>
  /**
   * Returns the login verification response to indicate if it's verified or not.
   * @param parameters - Parameters to use. See {@link GetLoginVerificationParameters}.
   * @returns WebAuthn Verification Response. See {@link GetLoginVerificationReturnType}.
   */
  getLoginVerification: (
    parameters: GetLoginVerificationParameters,
  ) => Promise<GetLoginVerificationReturnType>
  /**
   * Returns the registration options, including a challenge for verification.
   * @param parameters - Parameters to use. See {@link GetRegistrationOptionsParameters}.
   * @returns Credential Creation Options. See {@link GetRegistrationOptionsReturnType}.
   */
  getRegistrationOptions: (
    parameters: GetRegistrationOptionsParameters,
  ) => Promise<GetRegistrationOptionsReturnType>
  /**
   * Returns the registration verification response to indicate if it's verified or not.
   * @param parameters - Parameters to use. See {@link GetRegistrationVerificationParameters}.
   * @returns WebAuthn Verification Response. See {@link GetRegistrationVerificationReturnType}.
   */
  getRegistrationVerification: (
    parameters: GetRegistrationVerificationParameters,
  ) => Promise<GetRegistrationVerificationReturnType>
}

/**
 * Returns the RP actions.
 * @param client - Client to use.
 * @returns Rp Actions. See.
 */
export function rpActions<transport extends Transport = Transport>(
  client: Client<transport>,
): RpActions {
  return {
    getLoginOptions: (parameters) => getLoginOptions(client, parameters),
    getLoginVerification: (parameters) =>
      getLoginVerification(client, parameters),
    getRegistrationOptions: (parameters) =>
      getRegistrationOptions(client, parameters),
    getRegistrationVerification: (parameters) =>
      getRegistrationVerification(client, parameters),
  }
}
