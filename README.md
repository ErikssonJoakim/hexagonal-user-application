# Hexagonal User Application

[![test](https://github.com/ErikssonJoakim/hexagonal-user-application/actions/workflows/test.yml/badge.svg)](https://github.com/ErikssonJoakim/hexagonal-user-application/actions/workflows/test.yml)

## Install

These instructions will get your project up and running on your local machine for development and testing purposes.

### Prerequisites

Be sure to have the following properly installed:

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

### Launch

Launch the app of your choosing:

```sh
yarn start:graphql
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
