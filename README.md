# Eve ID Minting app

## Installation

First, clone https://github.com/superpowerlabs/eve-id-nfts and deploy your contracts to localhost (or whatever you want).

First, on Mac and Linux, install NVM (https://github.com/nvm-sh/nvm)

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

```

on Windows, install nvm-windows (https://github.com/coreybutler/nvm-windows).

The use nvm to install Node 16.

Then install pnpm globally:

```
npm i -g pnpm

```

In the root you must have a `.env` file with content like in the example in `test-env.example`

When you have it, you can run the Postgres docker container with
```
bin/postgres.sh
```

If you do not have Docker, install it.

To sign data locally, you must have a `env.js` file containing Infura API Key and the private key of the validator set up during the deployment of the contract.


When ready, install the dependencies, build the project and run it

```
pnpm i
pnpm run build
pnpm run start
```

and connect to [http://localhost:8987](http://localhost:8987).

## Copyright

(c) 2021-present Superpower Labs Inc.

## Licence

MIT
````
