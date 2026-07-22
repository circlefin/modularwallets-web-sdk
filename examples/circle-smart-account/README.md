# Circle Smart Account Example

This example Vite application demonstrates how to register and log in to a Circle Smart Account using passkeys. It also showcases how to perform a user operation with the account on Polygon Amoy.

## Prerequisites

- A [Circle Console](https://console.circle.com/) account with Modular Wallets enabled
- See Circle’s [console setup guide](https://developers.circle.com/wallets/modular/console-setup) for the full Client Key + Passkey flow

## Environment variables

Copy `.env.example` to `.env` in this folder (`examples/circle-smart-account/.env`):

```bash
cp .env.example .env
```

| Variable | Description |
| --- | --- |
| `VITE_CLIENT_KEY` | Client Key from the Circle Developer Console |
| `VITE_CLIENT_URL` | Base Client URL from the Circle Developer Console — **without** the chain suffix |

> [!IMPORTANT]
> `VITE_CLIENT_URL` must be a full `https://...` URL. The app appends `/polygonAmoy` internally for the modular transport. Passkey (RP) calls use the base URL only. If this variable is empty or already includes `/polygonAmoy`, setup will fail (for example `InvalidProviderError` for `/polygonAmoy`).

Example `.env` shape (use your own credentials):

```env
VITE_CLIENT_KEY=your-client-key
VITE_CLIENT_URL=https://modular-sdk.circle.com/v1/rpc/w3s/buidl
```

Restart `pnpm dev` after changing `.env`.

## Circle console setup

Do **both** of the following in [Configurator](https://console.circle.com/wallets/modular/configurator). Skipping Passkey Domain is a common cause of registration failures.

### 1. Passkey Domain (required)

Configurator → **Passkey** → **Domain Name**:

```text
localhost
```

Omit the port, then **Save**.

> [!WARNING]
> If Passkey Domain is unset, `rp_getRegistrationOptions` fails with  
> `Cannot find the entity config in the system.` (`code: -32012`).  
> Creating a Client Key alone is not enough.

### 2. Client Key

1. Create a **Client Key** (Keys → Create a key → Client Key)
2. Under **Applicable Platforms → Web**, set **Allowed Domain** to `localhost` (no port)
3. Copy the Client Key and base Client URL into `.env` as above

The Passkey Domain and Client Key Allowed Domain should both be `localhost` for this example.

## Install and run

From the repository root:

```bash
pnpm install
pnpm build
```

Then from this folder:

```bash
cd examples/circle-smart-account
pnpm dev
```

Open `http://localhost:5173/`.

## Smoke test

1. Enter a **username** that is **5–50 characters**, using only alphanumeric and `_@.:+-` (e.g. `Tester`, not `Test`)
2. Click **Register** and complete the passkey ceremony (browser / password manager)
3. Confirm a smart account **Address:** appears
4. Optional — send a user operation:
   - Fund the smart account with **Polygon Amoy USDC** (faucet or transfer)
   - **Address:** any Amoy EVM address you control (or the smart account itself)
   - **Amount (USDC):** e.g. `0.01`
   - Click **Send** and confirm a user operation hash / transaction hash appear

## Troubleshooting

| Symptom | Likely cause |
| --- | --- |
| `Cannot find the entity config in the system` (`-32012`) | Passkey Domain not set in Configurator (use `localhost`) |
| `The username is invalid… 5 to 50 characters…` | Username too short or has disallowed characters |
| `InvalidProviderError` for `/polygonAmoy` | `VITE_CLIENT_URL` missing, includes `/polygonAmoy` already, or `.env` not in this folder |
| Client key / domain rejected | Client Key Allowed Domain must be `localhost` without a port |
| Passkey ceremony fails | Browser must support WebAuthn; use HTTPS or `localhost` |
| `Address mismatch` | SDK version older than `1.0.3` (MSCAUpgradable contract update) |
| User operation fails | Missing Amoy USDC balance, or paymaster / Circle client config |

## Important notes

- Ensure the installed SDK version is greater than or equal to `1.0.3`
- `.env` lives in `examples/circle-smart-account/`, not the repository root
- Official setup: [Create a modular wallet (console setup)](https://developers.circle.com/wallets/modular/console-setup)
