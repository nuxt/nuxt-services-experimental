# nuxt-services

> Example of services features for Nuxt 3.

## Setup

```
yarn install
```

You'll need to provide working connection info for the database you wish to test. 

For testing locally, we recommend installing [MongoDB](https://www.mongodb.com) 
or [PostgreSQL](https://www.postgresql.org/) via [Homebrew](https://brew.sh/).

## Development

```
yarn dev examples/mongodb
yarn dev examples/postgresql
```

## Production

```
yarn build examples/mongodb
yarn start examples/postgresql
```
