# Circle Smart Account — React

React (Vite) demo: register/login with a passkey, create a Circle Smart Account on Arc Testnet, and send a gasless 1 USDC transfer with `@circle-fin/modular-wallets-core`.

## Prerequisites

- A [Circle Console](https://console.circle.com/) account with Modular Wallets enabled
- See Circle’s [console setup guide](https://developers.circle.com/wallets/modular/console-setup) for the full Client Key + Passkey flow

## Environment variables

Copy `.env.example` to `.env` in this folder (`examples/circle-smart-account/react/`):

```bash
cp .env.example .env
```

| Variable | Description |
| --- | --- |
| `VITE_CLIENT_KEY` | Client Key from the Circle Developer Console |
| `VITE_CLIENT_URL` | Base Client URL from the Circle Developer Console — **without** the chain suffix |

> [!IMPORTANT]
> `VITE_CLIENT_URL` must be a full `https://...` URL. The app appends `/arcTestnet` internally for the modular transport. Passkey (RP) calls use the base URL only. If this variable is empty or already includes `/arcTestnet`, setup will fail.

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
cd examples/circle-smart-account/react
pnpm dev
```

Open `http://localhost:5173/`.

## Smoke test

1. Click **Register passkey** and complete the WebAuthn ceremony
2. Confirm a smart account address appears
3. Optional — send a user operation:
   - Fund the smart account with **Arc Testnet USDC** ([faucet](https://faucet.circle.com))
   - Enter a recipient, click **Send 1 USDC**, and confirm a user operation / transaction hash appears

## Troubleshooting

| Symptom | Likely cause |
| --- | --- |
| `Cannot find the entity config in the system` (`-32012`) | Passkey Domain not set in Configurator (use `localhost`) |
| `InvalidProviderError` for `/arcTestnet` | `VITE_CLIENT_URL` missing, includes `/arcTestnet` already, or `.env` not in this folder |
| Client key / domain rejected | Client Key Allowed Domain must be `localhost` without a port |
| Passkey ceremony fails | Browser must support WebAuthn; use HTTPS or `localhost` |
| `Address mismatch` | SDK version older than `1.0.3` (MSCAUpgradable contract update) |
| User operation fails | Missing Arc Testnet USDC balance, or paymaster / Circle client config |

## Important notes

- Ensure the installed SDK version is greater than or equal to `1.0.3`
- `.env` lives in `examples/circle-smart-account/react/`, not the repository root
- Official setup: [Create a modular wallet (console setup)](https://developers.circle.com/wallets/modular/console-setup)
