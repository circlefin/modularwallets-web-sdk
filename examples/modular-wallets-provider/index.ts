import { publicActions } from "viem"
import { createBundlerClient } from "viem/account-abstraction"
import { toModularTransport } from "@circle-fin/modular-wallets-core"

const transport = toModularTransport("<my-client-url>", "<my-client-key>")

const bundlerClient = createBundlerClient({
  transport,
}).extend(publicActions)

bundlerClient.getBlock().then(console.log)
bundlerClient.getSupportedEntryPoints().then(console.log)
