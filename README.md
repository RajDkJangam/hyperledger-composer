# Hyperledger Composer Research Project

on [hyperledger composer](https://github.com/hyperledger/composer)

## Examples

- [auction](./examples/auction)
- [invoice reimbursement](./examples/invoice)

## Local Playground Setup

1. clone composer: `git clone https://github.com/hyperledger/composer`
2. bootstrap dependencies: `lerna bootstrap`
3. init submodules of `composer-playground` package: `git submodule && git submodule update`
4. start up `composer-playground-api` package: `node composer/packages/composer-playground-api/cli.js`
5. build `composer-playground`: `env PLAYGROUND_API=http://localhost:15699 npm run build` (we can change playground api address via process environment variable)
6. start up `composer-playground`: `node composer/packages/composer-playground/cli.js`
7. package the examples: `composer archive create -a dist/{name}-network.bna --sourceType dir --sourceName .`
8. import the `bna` file into playground

## Hyperledger Fabric Deployment

1. use configtxgen to generate a channel genesis file: `configtxgen -profile {GenesisProfile} -outputCreateChannelTx composerchannel.tx -channelID composerchannel`
2. create channel `composerchannel` with orderer
3. peer {composer-peer} join channel `composerchannel`
4. deploy network archive: `composer network deploy -a {networkArchive.bna} -p {connectionProfile} -i {adminId} -s {adminSecret}`