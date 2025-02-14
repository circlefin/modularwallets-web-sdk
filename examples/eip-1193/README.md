# EIP-1193 Example

This example Vite application demonstrates how to register and log in to a Circle Smart Account using passkeys. It also showcases how to perform RPC actions, including retrieving an account address, signing personal messages, signing typed data, and sending transactions using the EIP-1193 provider.

## Run the example app

Please follow the instructions to run the example app on your local machine.

### Environment Variables

Before you start to run the app, you need to make sure that all environment variables are configured correctly.

Make a copy of `.env.example` and rename it to `.env`.

Under `.env`, make sure the following environment variables are configured properly:

- `VITE_CLIENT_KEY`: Paste your Client Key here. You can create one in [Circle Developer Console](https://console.circle.com/wallets/modular/configurator).
- `VITE_CLIENT_URL`: Paste the Client URL here. You can copy it from [Circle Developer Console](https://console.circle.com/wallets/modular/configurator).
- `VITE_PUBLIC_RPC_URL`: Paste your public RPC endpoint URL here. You can create one in [Infura](https://infura.io/).

Once you have these environment variables setup, you can now follow the steps below to run the app locally.

### Install dependencies

You first need to make sure you have followed the [README](https://github.com/circlefin/w3s-web-core-sdk/blob/master/README.md) under project root and have installed all dependencies under root folder:

```bash
$ yarn install
```

Now you need to go to this example folder:

```bash
$ cd examples/eip-1193
```

Once you are under the example folder, install all dependencies for the app:

```bash
$ yarn install
```

### Run the app

To run the app locally:

```bash
$ yarn dev
```

Now you should be able to see your app up and running in your browser at: `http://localhost:5173/`.

### Important Notes

- __Do Not Import from `src` or `dist` Directories Directly:__
  
  Always import the Core SDK using the package name:

  ```ts
  import { yourFunction } from 'w3s-web-core-sdk'
  ```

- __Watching Changes from the Core SDK Package__

  If you are developing new SDK features, run `yarn dev` from the [core SDK package directory](../../packages/w3s-web-core-sdk) to build your changes in real time.

- __Ensure Build-Time Constants Are Replaced:__

  Variables like `SDK_VERSION` should be replaced during the build process. If you encounter issues, make sure you're using the compiled code from the dist directory.
