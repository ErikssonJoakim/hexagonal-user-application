# Hexagonal User Application

[![test](https://github.com/ErikssonJoakim/hexagonal-user-application/actions/workflows/test.yml/badge.svg)](https://github.com/ErikssonJoakim/hexagonal-user-application/actions/workflows/test.yml)
[![lint](https://github.com/ErikssonJoakim/hexagonal-user-application/actions/workflows/lint.yml/badge.svg)](https://github.com/ErikssonJoakim/hexagonal-user-application/actions/workflows/lint.yml)

## Install

These instructions will get your project up and running on your local machine for development and testing purposes.

### Prerequisites

Be sure to have the following properly installed and running:

- [Node.js](https://nodejs.org/ru/) `v18.18` ([gallium](https://nodejs.org/en/blog/release/v18.18.0/))
- [yarn](https://classic.yarnpkg.com) `v1.22.21`
- [Docker](https://www.docker.com/)

### Setup

Install the dependencies and build the project:

```sh
yarn && yarn build
```

### Test

Test the project with the following command:

```sh
yarn test
```

This will build the project and launch `test:jest` and `test:e2e`.

> The e2e test launches the dockerized mysql database together with the graphql api service and the react app, before running the cypress e2e tests. Once completed it shuts down the database and deletes any data that was saved.

### Launch

Launch the app of your choosing:

GraphQL API (dependant on the MySQL database)

```sh
yarn start:graphql
```

React web application (dependant on the GraphQL API)

```sh
yarn start:react-app
```

### Setting up the MySQL database

Launch the following commands to set up the database

### Configuration

The database and server require certain environment variables to work. Go ahead and use the .env.example files provided by changing the file name to '.env'

```sh
mv .env.example .env && \
mv ./database/.env.example ./database/.env
```

### Build docker image

```sh
docker build -t database-image ./database
```

### Run docker container

```sh
docker run --restart=always -d --env-file=./database/.env -p 3306:3306 -v ${PWD}/database/data:/var/lib/mysql --name database-container database-image
```

### Execute queries inside the container

```sh
docker exec -it db-container mysql -u root -psecret test
```
