/*
 * Copyright (c) 2026, Circle Internet Group, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useEffect } from "react"
import { createPublicClient, Hex, parseUnits } from "viem"

import { isEthereumWallet } from "@dynamic-labs/ethereum"
import { useDynamicContext } from "@dynamic-labs/sdk-react-core"
import { 
  toCircleSmartAccount,
  toModularTransport,
  walletClientToLocalAccount,
  encodeTransfer,
  ContractAddress
} from "@circle-fin/modular-wallets-core"
import { createBundlerClient, SmartAccount } from "viem/account-abstraction"
import { polygonAmoy } from "viem/chains"

const clientKey = import.meta.env.VITE_CLIENT_KEY as string
const clientUrl = import.meta.env.VITE_CLIENT_URL as string

const USDC_DECIMALS = 6

// Create Circle transports
const modularTransport = toModularTransport(`${clientUrl}/polygonAmoy`, clientKey)

// Create a public client
const client = createPublicClient({
  chain: polygonAmoy,
  transport: modularTransport,
})

// Create a bundler client
const bundlerClient = createBundlerClient({
  chain: polygonAmoy,
  transport: modularTransport,
})

export const Example = () => {
  const { primaryWallet } = useDynamicContext() // Get the wallet information from the Dynamic context provider
  const [account, setAccount] = React.useState<SmartAccount>()
  const [hash, setHash] = React.useState<Hex>()
  const [userOpHash, setUserOpHash] = React.useState<Hex>()

  useEffect(() => {
    setSigner()

    async function setSigner() {
      if (primaryWallet == null) {
        // Reset the account if the wallet is not connected
        setAccount(undefined)

        return
      }

      if (!isEthereumWallet(primaryWallet)) {
        throw new Error("This wallet is not an Ethereum wallet")
      }

      const dynamicProvider = await primaryWallet.getWalletClient()

      toCircleSmartAccount({
        client,
        owner: walletClientToLocalAccount(dynamicProvider), // Transform the wallet client to a local account
      }).then(setAccount)
    }
  }, [primaryWallet])

  const sendUserOperation = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!account) return

    const formData = new FormData(event.currentTarget)
    const to = formData.get("to") as `0x${string}`
    const value = formData.get("value") as string

    // Create callData for USDC transfer
    const callData = encodeTransfer(
      to,
      ContractAddress.PolygonAmoy_USDC,
      parseUnits(value, USDC_DECIMALS)
    )

    const hash = await bundlerClient.sendUserOperation({
      account,
      calls: [callData],
      paymaster: true,
    })
    setUserOpHash(hash)

    const { receipt } = await bundlerClient.waitForUserOperationReceipt({
      hash,
    })
    setHash(receipt.transactionHash)
  }

  if (!primaryWallet) {
    return null
  }

  return (
    <div>
      {!account ? (
        <p>Loading...</p>
      ) : (
        <>
          <p>Address: {account?.address}</p>
          <h2>Send User Operation</h2>
          <form onSubmit={sendUserOperation}>
            <input name="to" placeholder="Address" />
            <input name="value" placeholder="Amount (USDC)" />
            <button type="submit">Send</button>
            {userOpHash && <p>User Operation Hash: {userOpHash}</p>}
            {hash && <p>Transaction Hash: {hash}</p>}
          </form>
        </>
      )}
    </div>
  )
}
