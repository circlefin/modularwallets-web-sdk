import * as React from "react"
import * as ReactDOM from "react-dom/client"

import { EthereumWalletConnectors } from "@dynamic-labs/ethereum"
import { DynamicContextProvider, DynamicWidget } from "@dynamic-labs/sdk-react-core"

import { Example } from "."

const environmentId = import.meta.env.VITE_DYNAMIC_ENV_ID as string

function App() {
  return (
    <DynamicContextProvider
      settings={{
        environmentId,
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      <DynamicWidget variant="modal" />
      <Example />
    </DynamicContextProvider>
  )
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(<App />)
