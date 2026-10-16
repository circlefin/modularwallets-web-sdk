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
const logEl = document.getElementById("log")!;
const registerBtn = document.getElementById("register") as HTMLButtonElement;
const loginBtn = document.getElementById("login") as HTMLButtonElement;
const sendBtn = document.getElementById("send") as HTMLButtonElement;
const resetBtn = document.getElementById("reset") as HTMLButtonElement;
const walletAddressEl = document.getElementById("walletAddress")!;

const log = (msg: string) => {
  logEl.append(msg, "\n");
  console.log(msg);
};

const logTransactionHash = (hash: string) => {
  const message = "✓ Transaction hash: ";
  logEl.append(message);

  const link = document.createElement("a");
  link.href = `https://testnet.arcscan.app/tx/${hash}`;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = hash;
  logEl.append(link, "\n");
  console.log(message + hash);
};

const CREDENTIAL_KEY = "mw-credential-id";

let smartAccount: CircleAccount | undefined;

const hasCredential = !!localStorage.getItem(CREDENTIAL_KEY);
registerBtn.disabled = hasCredential;
sendBtn.disabled = true;

const clearAuthUi = () => {
  logEl.textContent = "";
  walletAddressEl.textContent = "";
  sendBtn.disabled = true;
  smartAccount = undefined;
};

const setAuthenticatedUi = (address: string) => {
  walletAddressEl.textContent = address;
  registerBtn.disabled = true;
  sendBtn.disabled = false;
};

registerBtn.onclick = async () => {
  clearAuthUi();
  try {
    log("→ Creating passkey (WebAuthn register)...");
    const credential = await registerPasskey();
    localStorage.setItem(CREDENTIAL_KEY, credential.id);
    const wallet = await createWallet(credential);
    smartAccount = wallet.smartAccount;
    setAuthenticatedUi(wallet.address);
    log("✓ Passkey created. MSCA address: " + wallet.address);
    log("  Fund this address with testnet USDC before sending.");
  } catch (error) {
    log("✗ " + String(error));
  }
};

loginBtn.onclick = async () => {
  clearAuthUi();
  try {
    log("→ Logging in with passkey...");
    const credential = await loginPasskey(
      localStorage.getItem(CREDENTIAL_KEY) ?? undefined,
    );
    localStorage.setItem(CREDENTIAL_KEY, credential.id);
    const wallet = await createWallet(credential);
    smartAccount = wallet.smartAccount;
    setAuthenticatedUi(wallet.address);
    log("✓ Logged in. MSCA address: " + wallet.address);
  } catch (error) {
    log("✗ " + String(error));
  }
};

resetBtn.onclick = () => {
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
  registerBtn.disabled = false;
  if (hasStoredWallet)
    log("Demo reset. Log in with your passkey or register a new one.");
};

sendBtn.onclick = async () => {
  try {
    if (!smartAccount) {
      log("✗ Log in or register first.");
      return;
    }

    const recipient = prompt("Recipient address:") as Address;
    if (!recipient) return;

    log("→ Sending userOp (gasless via paymaster)...");
    log("  To:   " + recipient);

    const userOpHash = await sendUsdc(smartAccount, recipient);

    log("✓ UserOp submitted: " + userOpHash);
    log("  Waiting for onchain confirmation...");

    const { receipt, success } =
      await bundlerClient.waitForUserOperationReceipt({
        hash: userOpHash,
        timeout: 60_000,
      });

    logTransactionHash(receipt.transactionHash);
    log(success ? "✓ Confirmed onchain" : "✗ Reverted onchain");
  } catch (error) {
    log("✗ " + String(error));
  }
};
