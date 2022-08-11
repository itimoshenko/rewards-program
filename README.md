# rewards-program service

## Description

Service for rewards program to customers awarding points based on each recorded purchase.

## Installation

```bash
# install dependencies
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Migrations

```bash
# generate migration on entities changes
$ npm run typeorm -- migration:generate ./src/migrations/MIGRATION_NAME -d ./src/data-source.ts

# create migration
$ npm run typeorm -- migration:create ./src/migrations/MIGRATION_NAME

# run migration
$ npm run typeorm -- migration:run -d ./src/data-source.ts

# revert migration
$ npm run typeorm -- migration:revert -d ./src/data-source.ts
```

## Seed

```bash
# generete initial data for DB
$ npm run seed
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
