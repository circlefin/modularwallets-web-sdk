import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { polygonAmoy } from 'viem/chains'

import { type Hex, createPublicClient, parseUnits } from 'viem'
import {
  type P256Credential,
  type SmartAccount,
  WebAuthnAccount,
  createBundlerClient,
  toWebAuthnAccount,
} from 'viem/account-abstraction'
import {
  WebAuthnMode,
  toCircleSmartAccount,
  toModularTransport,
  toPasskeyTransport,
  toWebAuthnCredential,
  encodeTransfer,
  ContractAddress
} from '@circle-fin/modular-wallets-core'

const clientKey = import.meta.env.VITE_CLIENT_KEY as string
const clientUrl = import.meta.env.VITE_CLIENT_URL as string

const USDC_DECIMALS = 6

// Create Circle transports
const passkeyTransport = toPasskeyTransport(clientUrl, clientKey)
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

function Example() {
  const [account, setAccount] = React.useState<SmartAccount>()
  const [credential, setCredential] = React.useState<P256Credential>(() =>
    JSON.parse(localStorage.getItem('credential') || 'null'),
  )
  const [username, setUsername] = React.useState<string | undefined>(() => localStorage.getItem("username") || undefined)

  const [hash, setHash] = React.useState<Hex>()
  const [userOpHash, setUserOpHash] = React.useState<Hex>()

  React.useEffect(() => {
    if (!credential) return

    // Create a circle smart account
    toCircleSmartAccount({
      client,
      owner: toWebAuthnAccount({ credential }) as WebAuthnAccount,
      name: username,
    }).then(setAccount)
  }, [credential])

  const register = async () => {
    const username = (document.getElementById('username') as HTMLInputElement).value
    const credential = await toWebAuthnCredential({
      transport: passkeyTransport,
      mode: WebAuthnMode.Register,
      username,
    })
    localStorage.setItem('credential', JSON.stringify(credential))
    localStorage.setItem('username', username)
    setCredential(credential)
    setUsername(username)
  }

  const login = async () => {
    const credential = await toWebAuthnCredential({
      transport: passkeyTransport,
      mode: WebAuthnMode.Login,
    })
    localStorage.setItem('credential', JSON.stringify(credential))
    setCredential(credential)
  }

  const sendUserOperation = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!account) return

    const formData = new FormData(event.currentTarget)
    const to = formData.get('to') as `0x${string}`
    const value = formData.get('value') as string

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

  if (!credential)
    return (
      <>
        <input id="username" name="username" placeholder="Username" />
        <br />
        <button onClick={register}>Register</button>
        <button onClick={login}>Login</button>
      </>
    )
  if (!account) return <p>Loading...</p>

  return (
    <>
      <h2>Account</h2>
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
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Example />,
)
