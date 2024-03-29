A back-end boilerplate get start a new project, bootstrapped by Koa, Apollo Server, Graphql, Typescript...

## Tech Stack

- [x] [KOA](https://github.com/koajs/koa)
- [x] [koa-bodyparser](https://github.com/koajs/bodyparser)
- [x] [koa-router](https://github.com/ZijianHe/koa-router)
- [x] [kors](https://github.com/koajs/cors)
- [x] [Apollo Server](https://github.com/apollographql/apollo-server/tree/main/packages/apollo-server-koa)
- [x] [Type-Graphql](https://github.com/MichalLytek/type-graphql)
- [x] [TypeORM](https://github.com/typeorm/typeorm)
- [x] [pg](https://github.com/brianc/node-postgres/tree/master/packages/pg)
- [x] [Dotenv](https://github.com/motdotla/dotenv)

## Quick start

#### Make sure that you have Node.js and npm and postgres installed.

Create `.env` and copy `.env.example`, change with the postgres configuration.

#### Clone this repo using

```
$ git clone --depth=1 <GIT_URL> <YOUR_PROJECT_NAME> && cd <YOUR_PROJECT_NAME> && rm -rf .git
```

After cloning this repository, you can add your own git repository use it as the original.

#### Move to the appropriate directory:

```
$ cd <YOUR_PROJECT_NAME>
```

Check out a list script below

### Available scripts

#### Install node modules

```
$ npm install or yarn
```

#### Create default database

KRAP-BE provided set up script for ease create postgresDB locally by command:

```
$ yarn localdb
```

#### Start hot reload

```
$ npm run local or yarn local
```

#### Start development

```
$ npm run dev or yarn dev
```

#### Test

```
$ npm run test or yarn test
```

#### Migration

Easy to create migration file by command:

```
$ yarn mg <FILE_NAME>
```

#### Production build

```
$ npm run build or yarn build
```

## How can use the boilerplate

This is boilerplate and it doesn't require one-way development.
All folder structure is just an example to follow, you could create which folder you see it make sense to you.

## Contributing

All contributions to this boilerplate are welcome.

Checkout contribute guide [here](CONTRIBUTING.md).
