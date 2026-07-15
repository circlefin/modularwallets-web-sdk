# Dynamic Integration Example

This example Vite application demonstrates how to integrate [Dynamic](https://www.dynamic.xyz/)'s SDK with Circle Modular Wallets. A user connects an EOA through Dynamic; the app derives a Circle smart account on Polygon Amoy and can send a gas-sponsored USDC user operation.

## Prerequisites

- A [Circle Modular Wallets](https://console.circle.com/wallets/modular/configurator) client configured for **Polygon Amoy**
- A [Dynamic](https://app.dynamic.xyz/dashboard/overview) project (use the **Sandbox** environment for local development)

## Environment variables

Copy `.env.example` to `.env` in this folder (`examples/dynamic-integration/.env`):

```bash
cp .env.example .env
```

| Variable | Description |
| --- | --- |
| `VITE_CLIENT_KEY` | Client Key from the Circle Developer Console |
| `VITE_CLIENT_URL` | Base Client URL from the Circle Developer Console — **without** the chain suffix |
| `VITE_DYNAMIC_ENV_ID` | Sandbox Environment ID from the Dynamic dashboard |

> [!IMPORTANT]
> `VITE_CLIENT_URL` must be a full `https://...` URL. The app appends `/polygonAmoy` internally. If this variable is empty, you will see `InvalidProviderError: Provider with url "/polygonAmoy" is not set or invalid`.

Example `.env` shape (use your own credentials):

```env
VITE_CLIENT_KEY=your-client-key
VITE_CLIENT_URL=https://modular-sdk.circle.com/v1/rpc/w3s/buidl
VITE_DYNAMIC_ENV_ID=your-dynamic-sandbox-environment-id
```

Restart `pnpm dev` after changing `.env`.

## Dynamic dashboard setup

Configure the **Sandbox** environment that matches `VITE_DYNAMIC_ENV_ID`:

1. **Security → Allowed CORS origins** — add `http://localhost:5173` (include the port Vite prints)
2. **Log in** — enable at least one sign-in method (email, social, or external wallet)
3. **Chains & Networks** — enable **EVM** and **Polygon Amoy**
4. **Wallets** — enable **MetaMask** and/or **WalletConnect**, or enable **Embedded Wallets** with Polygon Amoy

The app already wires up Dynamic per their React quickstart in `App.tsx` (`DynamicContextProvider`, `EthereumWalletConnectors`, `DynamicWidget`).

## Install and run

From the repository root:

```bash
pnpm install
pnpm build
```

Then from this folder:

```bash
cd examples/dynamic-integration
pnpm dev
```

Open `http://localhost:5173/`.

## Smoke test

1. Click the Dynamic connect button — the modal should open without CORS errors in the browser console
2. Sign in and connect an EVM wallet
3. Confirm an **Address:** line appears (Circle smart account derived from the Dynamic EOA)
4. Optional: submit the USDC transfer form (requires Amoy USDC and paymaster enabled on your Circle client)

## Troubleshooting

| Symptom | Likely cause |
| --- | --- |
| `InvalidProviderError` for `/polygonAmoy` | `VITE_CLIENT_URL` missing or `.env` not in this folder |
| CORS errors to `app.dynamicauth.com` | Add `http://localhost:5173` to Dynamic **Allowed CORS origins** (Sandbox env) |
| Connect button renders but modal fails | Dynamic SDK did not initialize — check CORS and `VITE_DYNAMIC_ENV_ID` |
| `This wallet is not an Ethereum wallet` | Connected a non-EVM wallet; enable EVM connectors in Dynamic |
| Stuck on "Loading..." after connect | `getWalletClient()` failed — ensure Polygon Amoy is enabled in Dynamic |
| User operation fails | Circle-side issue (paymaster, funding, or Amoy USDC balance) |

## Important notes

- Ensure the installed SDK version is greater than or equal to `1.0.5`
- `.env` lives in `examples/dynamic-integration/`, not the repository root
