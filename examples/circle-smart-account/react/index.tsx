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

import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import {
  toPasskeyTransport,
  toModularTransport,
  toWebAuthnCredential,
  toCircleSmartAccount,
  encodeTransfer,
  ContractAddress,
  WebAuthnMode,
  type WebAuthnCredential,
} from "@circle-fin/modular-wallets-core";
import {
  createPublicClient,
  parseUnits,
  type Address,
  type Client,
} from "viem";
import { arcTestnet } from "viem/chains";
import {
  createBundlerClient,
  toWebAuthnAccount,
  type SmartAccount,
} from "viem/account-abstraction";

// --- 1. SDK setup ---
const clientKey = import.meta.env.VITE_CLIENT_KEY as string;
const clientUrl = import.meta.env.VITE_CLIENT_URL as string;

const passkeyTransport = toPasskeyTransport(clientUrl, clientKey);
const modularTransport = toModularTransport(
  `${clientUrl}/arcTestnet`,
  clientKey,
);

const client = createPublicClient({
  chain: arcTestnet,
  transport: modularTransport,
}) as Client;

// Bundler + paymaster share the modular transport (pm_* on the same RPC).
const bundlerClient = createBundlerClient({
  chain: arcTestnet,
  paymaster: true,
  transport: modularTransport,
});

// --- 2. SDK: passkey auth ---
async function registerPasskey() {
  return toWebAuthnCredential({
    transport: passkeyTransport,
    mode: WebAuthnMode.Register,
    username: "demo-user",
  });
}

async function loginPasskey(credentialId: string | undefined) {
  return toWebAuthnCredential({
    transport: passkeyTransport,
    mode: WebAuthnMode.Login,
    username: "demo-user",
    credentialId,
  });
}

// Circle MSCA is EntryPoint 0.7; narrow so viem accepts `calls` / paymaster helpers.
type CircleAccount = SmartAccount & { entryPoint: { version: "0.7" } };

// --- 3. SDK: wallet + send ---
async function createWallet(credential: WebAuthnCredential) {
  const owner = toWebAuthnAccount({ credential });
  const smartAccount = (await toCircleSmartAccount({
    client,
    owner,
  })) as CircleAccount;
  return { smartAccount, address: smartAccount.address };
}

type Wallet = Awaited<ReturnType<typeof createWallet>>;

async function sendUsdc(account: CircleAccount, recipient: Address) {
  const { to, data } = encodeTransfer(
    recipient,
    ContractAddress.ArcTestnet_USDC,
    parseUnits("1", 6),
  );

  return bundlerClient.sendUserOperation({
    account,
    calls: [{ to, data }],
    maxPriorityFeePerGas: 1_000_000_000n,
  });
}

// --- 4. Demo app ---
const CREDENTIAL_KEY = "mw-credential-id";
const INITIAL_LOG = "Login or register a passkey to begin.";
type LogLine = {
  message: string;
  hash?: string;
};

function App() {
  const [credential, setCredential] = useState<WebAuthnCredential>();
  const [wallet, setWallet] = useState<Wallet>();
  const [registerDisabled, setRegisterDisabled] = useState(
    () => !!localStorage.getItem(CREDENTIAL_KEY),
  );
  const [logLines, setLogLines] = useState<LogLine[]>([
    { message: INITIAL_LOG },
  ]);

  const log = (message: string, hash?: string) => {
    setLogLines((prev) => [
      ...(prev.length === 1 && prev[0].message === INITIAL_LOG ? [] : prev),
      { message, hash },
    ]);
    console.log(message + (hash ?? ""));
  };

  const clearAuthUi = () => {
    setLogLines([]);
    setCredential(undefined);
    setWallet(undefined);
  };

  useEffect(() => {
    if (!credential) return;

    createWallet(credential)
      .then((nextWallet) => {
        setWallet(nextWallet);
        log("✓ MSCA address: " + nextWallet.address);
        log("  Fund this address with testnet USDC before sending.");
      })
      .catch((error) => log("✗ " + String(error)));
  }, [credential]);

  async function handleRegister() {
    clearAuthUi();
    try {
      log("→ Creating passkey (WebAuthn register)...");
      const nextCredential = await registerPasskey();
      localStorage.setItem(CREDENTIAL_KEY, nextCredential.id);
      setRegisterDisabled(true);
      setCredential(nextCredential);
    } catch (error) {
      log("✗ " + String(error));
    }
  }

  async function handleLogin() {
    clearAuthUi();
    try {
      log("→ Logging in with passkey...");
      const nextCredential = await loginPasskey(
        localStorage.getItem(CREDENTIAL_KEY) ?? undefined,
      );
      localStorage.setItem(CREDENTIAL_KEY, nextCredential.id);
      setRegisterDisabled(true);
      setCredential(nextCredential);
    } catch (error) {
      log("✗ " + String(error));
    }
  }

  async function handleSend() {
    try {
      if (!wallet) {
        log("✗ Log in or register first.");
        return;
      }

      const recipient = prompt("Recipient address:") as Address;
      if (!recipient) return;

      log("→ Sending userOp (gasless via paymaster)...");
      log("  To:   " + recipient);

      const userOpHash = await sendUsdc(wallet.smartAccount, recipient);

      log("✓ UserOp submitted: " + userOpHash);
      log("  Waiting for onchain confirmation...");

      const { receipt, success } =
        await bundlerClient.waitForUserOperationReceipt({
          hash: userOpHash,
          timeout: 60_000,
        });

      log("✓ Transaction hash: ", receipt.transactionHash);
      log(success ? "✓ Confirmed onchain" : "✗ Reverted onchain");
    } catch (error) {
      log("✗ " + String(error));
    }
  }

  function handleReset() {
    const hasStoredWallet = localStorage.getItem(CREDENTIAL_KEY);
    if (
      hasStoredWallet &&
      !confirm(
        "Create a new wallet? Your current passkey link is cleared. USDC on the current address stays onchain.",
      )
    ) {
      return;
    }
    localStorage.removeItem(CREDENTIAL_KEY);
    clearAuthUi();
    setRegisterDisabled(false);
    if (hasStoredWallet) {
      log("Demo reset. Log in with your passkey or register a new one.");
    }
  }

  return (
    <>
      <header>
        <h1>Create Circle Smart Account</h1>
        <button type="button" onClick={handleReset}>
          Reset demo
        </button>
      </header>
      <main>
        <p>
          This demo lets you register a passkey to create an MSCA wallet on Arc
          Testnet. It uses <code>toCircleSmartAccount</code> to derive and show
          the wallet address, and <code>sendUserOperation</code> (with{" "}
          <code>encodeTransfer</code> for USDC) to send 1 USDC to an EVM address
          of your choice. Gas is covered by the paymaster.
        </p>

        <hr />

        {!credential ? (
          <>
            <button
              type="button"
              disabled={registerDisabled}
              onClick={handleRegister}
            >
              Register passkey
            </button>
            {" | "}
            <button type="button" onClick={handleLogin}>
              Login
            </button>
          </>
        ) : !wallet ? (
          <p>Loading smart account…</p>
        ) : (
          <>
            <p>
              Wallet address: <code>{wallet.address}</code>
            </p>
            <button type="button" onClick={handleSend}>
              Send 1 USDC
            </button>
            {" "}
            <a
              className="faucet-link"
              href="https://faucet.circle.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              USDC faucet
            </a>
          </>
        )}

        <pre>
          {logLines.map((line, index) => (
            <span key={index}>
              {line.message}
              {line.hash && (
                <a
                  href={`https://testnet.arcscan.app/tx/${line.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {line.hash}
                </a>
              )}
              {"\n"}
            </span>
          ))}
        </pre>
      </main>
    </>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
