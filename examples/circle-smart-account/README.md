# Circle Smart Account Example

This example Vite application demonstrates how to register and log in to a Circle Smart Account using passkeys. It also showcases how to perform a user operation with the account on Polygon Amoy.

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

You first need to make sure you have followed the [README](https://github.com/circlefin/modularwallets-web-sdk/blob/master/README.md) under project root and have installed all dependencies under root folder:

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
$ cd examples/circle-smart-account
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

- **Ensure the installed SDK version is greater than or equal to `1.0.3`:**

  If you receive an error message that says `Address mismatch` in the example app, make sure you are using the correct version of the SDK as we updated the MSCAUpgradable smart contract implementation in version `1.0.3`. This error occurs when the SDK version is less than `1.0.3`.
