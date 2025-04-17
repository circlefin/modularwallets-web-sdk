# Passkey Recovery Example

This example Vite application demonstrates how to implement passkey recovery for Circle Smart Accounts. It showcases a complete flow where users can:

1. Create a Circle Smart Account with a passkey
2. Generate and register a recovery key (as an Externally Owned Account) with their smart account
3. Recover account access by using the recovery key to create a new passkey if the original one is lost

## Run the example app

Please follow the instructions to run the example app on your local machine.

### Environment Variables

Before you start to run the app, you need to make sure that all environment variables are configured correctly.

Make a copy of `.env.example` and rename it to `.env`.

Under `.env`, make sure the following environment variables are configured properly:

- `VITE_CLIENT_KEY`: Paste your Client Key here. You can create one in [Circle Developer Console](https://console.circle.com/wallets/modular/configurator).
- `VITE_CLIENT_URL`: Paste the Client URL here. You can copy it from [Circle Developer Console](https://console.circle.com/wallets/modular/configurator).

Once you have these environment variables setup, you can now follow the steps below to run the app locally.

### Install dependencies

You first need to make sure you have followed the [README](https://github.com/circlefin/w3s-web-core-sdk/blob/master/README.md) under project root and have installed all dependencies under root folder:

```bash
$ pnpm install
```

#### Important: Build the SDK

Since this project uses pnpm workspaces, you must build the SDK packages before running the example:

```bash
# From the project root directory
$ pnpm build
```

This will generate the necessary distribution files that this example depends on.

Now you need to go to this example folder:

```bash
$ cd examples/passkey-recovery
```

Once you are under the example folder, install all dependencies for the app:

```bash
$ pnpm install
```

### Run the app

To run the app locally:

```bash
$ pnpm dev
```

Now you should be able to see your app up and running in your browser at: `http://localhost:5173/`.

### Important Notes

**Ensure the installed SDK version is greater than or equal to `1.0.7`**
