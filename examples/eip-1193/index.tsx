import * as React from "react"
import * as ReactDOM from "react-dom/client"
import { polygonAmoy } from "viem/chains"
import Web3 from "web3"

import { type Hex, createClient, createPublicClient, http, parseUnits } from "viem"
import {
  type P256Credential,
  type SmartAccount,
  WebAuthnAccount,
  createBundlerClient,
  toWebAuthnAccount,
} from "viem/account-abstraction"
import {
  EIP1193Provider,
  WebAuthnMode,
  toCircleSmartAccount,
  toModularTransport,
  toPasskeyTransport,
  toWebAuthnCredential,
  encodeTransfer,
  ContractAddress,
} from "@circle-fin/modular-wallets-core"

const clientKey = import.meta.env.VITE_CLIENT_KEY as string
const clientUrl = import.meta.env.VITE_CLIENT_URL as string
const publicRpcUrl = import.meta.env.VITE_PUBLIC_RPC_URL as string

const USDC_DECIMALS = 6

// Create Circle transports
const passkeyTransport = toPasskeyTransport(clientUrl, clientKey)
const modularTransport = toModularTransport(`${clientUrl}/polygonAmoy`, clientKey)

// Create a public client
const client = createClient({
  chain: polygonAmoy,
  transport: modularTransport,
})

function Example() {
  const [account, setAccount] = React.useState<SmartAccount>()
  const [credential, setCredential] = React.useState<P256Credential>(() =>
    JSON.parse(localStorage.getItem("credential") || "null")
  )

  const [web3, setWeb3] = React.useState<Web3>()
  const [hash, setHash] = React.useState<Hex>()
  const [address, setAddress] = React.useState<string>()
  const [personalSignature, setPersonalSignature] = React.useState<string>()
  const [typedDataSignature, setTypedDataSignature] = React.useState<string>()

  React.useEffect(() => {
    if (!credential) return

    init()

    async function init() {
      // Create a circle smart account
      const account = await toCircleSmartAccount({
        client,
        owner: toWebAuthnAccount({ credential }) as WebAuthnAccount,
      })

      setAccount(account)

      const publicClientInstance = createPublicClient({
        chain: polygonAmoy,
        transport: http(publicRpcUrl),
      })
      const bundlerClientInstance = createBundlerClient({
        account,
        chain: polygonAmoy,
        transport: modularTransport,
      })

      const provider = new EIP1193Provider(bundlerClientInstance, publicClientInstance)
      setWeb3(new Web3(provider))
    }
  }, [credential])

  const register = async () => {
    const username = (document.getElementById("username") as HTMLInputElement).value
    const credential = await toWebAuthnCredential({
      transport: passkeyTransport,
      mode: WebAuthnMode.Register,
      username,
    })
    localStorage.setItem("credential", JSON.stringify(credential))
    setCredential(credential)
  }

  const login = async () => {
    const credential = await toWebAuthnCredential({
      transport: passkeyTransport,
      mode: WebAuthnMode.Login,
    })
    localStorage.setItem("credential", JSON.stringify(credential))
    setCredential(credential)
  }

  const getProviderAddress = async () => {
    if (!web3) return

    const accounts = await web3.eth.getAccounts()

    setAddress(accounts[0])
  }

  const signPersonalMessage = async () => {
    if (!web3) return

    const accounts = await web3.eth.getAccounts()
    const signature = await web3.eth.personal.sign("Hello World", accounts[0], "passphrase")

    setPersonalSignature(signature)
  }

  const sendTx = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!web3 || !account) return

    const formData = new FormData(event.currentTarget)
    const sendTo = formData.get("to") as `0x${string}`
    const value = formData.get("value") as string

    try {
      const suggestedGasPrice = ((await web3.eth.getGasPrice()) * 11n) / 10n // 10% higher than the current gas price to ensure the transaction goes through
      
      // Get the ERC20 transfer method data
      const { to, data } = encodeTransfer(
        sendTo,
        ContractAddress.PolygonAmoy_USDC,
        parseUnits(value, USDC_DECIMALS)
      )

      // Send transaction to the USDC contract address
      const tx = await web3.eth.sendTransaction({
        to,
        from: account.address,
        data,
        gas: 53638, // Estimated gas limit for a simple transaction
        gasPrice: suggestedGasPrice,
      })

      setHash(tx.transactionHash as Hex)
    } catch (err) {
      console.log(err)
    }
  }

  const signTypedData = async () => {
    if (!web3) return

    const accounts = await web3.eth.getAccounts()
    const from = accounts[0]

    const domain = {
      name: "MyDApp",
      version: "1.0",
      chainId: 80002,
      verifyingContract: "0x1111111111111111111111111111111111111111",
    }
    const message = {
      content: "Hello from typed data!",
      sender: from,
      timestamp: Math.floor(Date.now() / 1000),
    }
    const dataToSign = {
      domain,
      message,
      primaryType: "Message",
      types: {
        EIP712Domain: [
          { name: "name", type: "string" },
          { name: "version", type: "string" },
          { name: "chainId", type: "uint256" },
          { name: "verifyingContract", type: "address" },
        ],
        Message: [
          { name: "content", type: "string" },
          { name: "sender", type: "address" },
          { name: "timestamp", type: "uint256" },
        ],
      },
    }

    const signature = await web3.eth.signTypedData(from, dataToSign)

    setTypedDataSignature(signature)
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

      <h2>Send Transaction</h2>
      <form onSubmit={sendTx}>
        <input name="to" placeholder="Address" />
        <input name="value" placeholder="Amount (USDC)" />
        <button type="submit">Send</button>
      </form>
      <button onClick={getProviderAddress}>Get address</button>
      <button onClick={signPersonalMessage}>SignPersonalMessage</button>
      <button onClick={signTypedData}>SignTypedData</button>
      {address && <p>Address: {address}</p>}
      {personalSignature && (
        <p
          style={{
            width: "100%",
            wordWrap: "break-word",
          }}
        >
          Personal Signature: {personalSignature}
        </p>
      )}
      {typedDataSignature && (
        <p
          style={{
            width: "100%",
            wordWrap: "break-word",
          }}
        >
          Typed Data Signature: {typedDataSignature}
        </p>
      )}
      {hash && <p>Transaction Hash: {hash}</p>}
    </>
  )
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(<Example />)
