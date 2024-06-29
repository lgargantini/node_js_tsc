# NODE JS example

This project intends to show the basics of Node.JS development,
using Typescript, Sequelize, PostgreSQL

## Structure

- `src`: main project folder
- `views`: generic views to handle http visitors
- `migrations`: sequelize migrations
- `bin`: entry point for Node.JS server
- `__test__`: jest unit test for src folder

# Running NODE JS example project

## Install dependencies

`npm i`

## Build project

`npm build`

## Before Start Step

Create a `.env` file to store your PostgreSQL DB information,
without this information, your app won't run.

e.g.::

```
DB_NAME='<database_name>'
DB_USER='<database_user>'
DB_HOST='<database_host>'
DB_DRIVER='postgres'
DB_PASSWORD='<database_password>'
```

## Start production mode

`npm run start`

## start Development mode

`npm run watch-dev`

## other commands:

### Clean

```
    "clean": "rm -rf node_modules package-lock.json && npm install",
```

### Linter

```
    npm run linter
```

### Testing

```
    "npm run test
```

### Test debug

```
    npm run debug-test
```
