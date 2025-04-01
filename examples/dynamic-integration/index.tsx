import React, { useEffect } from "react"
import { createPublicClient, Hex, parseEther } from "viem"

import { isEthereumWallet } from "@dynamic-labs/ethereum"
import { useDynamicContext } from "@dynamic-labs/sdk-react-core"
import { toCircleSmartAccount, toModularTransport, walletClientToLocalAccount } from "modular-wallets-core"
import { createBundlerClient, SmartAccount } from "viem/account-abstraction"
import { polygonAmoy } from "viem/chains"

const clientKey = import.meta.env.VITE_CLIENT_KEY as string
const clientUrl = import.meta.env.VITE_CLIENT_URL as string

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

    const hash = await bundlerClient.sendUserOperation({
      account,
      calls: [
        {
          to,
          value: parseEther(value),
        },
      ],
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
            <input name="value" placeholder="Amount (ETH)" />
            <button type="submit">Send</button>
            {userOpHash && <p>User Operation Hash: {userOpHash}</p>}
            {hash && <p>Transaction Hash: {hash}</p>}
          </form>
        </>
      )}
    </div>
  )
}
