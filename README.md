# w3s-web-core-sdk

[![Test Coverage](https://gist.githubusercontent.com/circle-ops-repo-updater/e7bd19f4fa4b938846ab8dfd3d0fdb76/raw/badge_080600a2cd10.svg)](https://sonarqube.circle.com/component_measures?metric=coverage&view=list&id=circlefin_w3s-web-core-sdk_7e01a87f-7793-4147-b755-e0717a9ed92e)

Repository for the Circle Modular Wallet Web SDK (*aka.* BW Web SDK or Buidl Wallet Web SDK)

## Examples

We've created some example apps in the [examples](./examples/) folder:

- [Circle Smart Account](./examples/circle-smart-account/)

You should be able to run these example apps locally and please follow the instructions under each example's `README` file.

## Setup Guide

Please follow this guide to setup your development environment and start building!

### Install dependencies

Please ensure you are using the correct Node.js version.

We have provided a `.nvmrc` file which can be understood by [nvm](https://github.com/nvm-sh/nvm), [fnm](https://github.com/Schniz/fnm), and [n](https://github.com/tj/n):

```zsh
nvm use || fnm use || n auto
```

> [!NOTE]
> If you are unfamiliar with Node.js version managers, please refer to [our example using `nvm`](#example-installing-a-node-version-manager)

Confirm that you are using the correct Node.js version listed in the `.nvmrc` file with:

```zsh
node -v
```

This project uses `pnpm` to install dependencies, please ensure you have it installed.

> [!TIP]
> Since Node.js v16.13, you can use the [corepack](https://github.com/nodejs/corepack) command to enable `pnpm`:
>
> ```zsh
> corepack enable pnpm
> ```

You can confirm that you have `pnpm` installed with:

```zsh
pnpm -v
```

You can now install the project dependencies using `pnpm`:

```zsh
pnpm install
```

> [!TIP]
> It is good practice to run the `pnpm install` command every time dependencies in the `package.json` are changed when updating your branch

#### Example: installing a node version manager

Install `nvm` to use different versions of node and npm easily.

```zsh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

You can then install the Node.js version of the project by using:

```zsh
nvm use
```

### Lint

To lint the project:

```zsh
pnpm lint
```

### Test

To run all unit tests, run:

```zsh
pnpm test
```

To generate coverage reports:

```zsh
pnpm test:coverage
```
