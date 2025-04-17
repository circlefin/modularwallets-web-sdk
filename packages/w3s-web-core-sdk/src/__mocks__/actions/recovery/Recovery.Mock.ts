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
  PublicKeyHexMock,
  RegistrationCredentialMock,
} from '../../providers/rp'

import type {
  EstimateExecuteRecoveryGasParameters,
  EstimateRegisterRecoveryAddressGasParameters,
  RegisterRecoveryAddressParameters,
  ExecuteRecoveryParameters,
} from '../../../actions/recovery'

/**
 * Mock recovery address.
 */
export const RecoveryAddressMock = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'

/**
 * Mock response for recovery gas estimations.
 */
export const EstimateRecoveryUserOperationResponseMock = {
  callGasLimit: BigInt(100),
  preVerificationGas: BigInt(100),
  verificationGasLimit: BigInt(100),
  paymasterPostOpGasLimit: BigInt(100),
  paymasterVerificationGasLimit: BigInt(100),
}

/**
 * Mock response for recovery based user operations.
 */
export const RecoveryUserOperationHashResponseMock =
  '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'

/**
 * Mock recovery call data.
 */
export const RecoveryCallDataMock =
  '0x852b67af00000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000001400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000070997970c51812dc3a010c7d01b50e0d17dc79c80000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'

/**
 * Mock parameters for estimating the gas for registering a recovery address.
 */
export const EstimateRegisterRecoveryAddressGasMockParameters: EstimateRegisterRecoveryAddressGasParameters =
  {
    recoveryAddress: RecoveryAddressMock,
  }

/**
 * Mock parameters for estimating the gas for executing recovery.
 */
export const EstimateExecuteRecoveryGasMockParameters: EstimateExecuteRecoveryGasParameters =
  {
    credential: {
      id: '016Qu2bPC7x8j-j49AAKunC3tGaqeQZOvoP-h-3YEG5',
      publicKey: PublicKeyHexMock,
      raw: RegistrationCredentialMock,
    },
  }

/**
 * Mock parameters for registering a recovery address.
 */
export const RegisterRecoveryAddressMockParameters: RegisterRecoveryAddressParameters =
  {
    recoveryAddress: RecoveryAddressMock,
  }

/**
 * Mock parameters for executing recovery.
 */
export const ExecuteRecoveryMockParameters: ExecuteRecoveryParameters = {
  credential: {
    id: '016Qu2bPC7x8j-j49AAKunC3tGaqeQZOvoP-h-3YEG5',
    publicKey: PublicKeyHexMock,
    raw: RegistrationCredentialMock,
  },
}
