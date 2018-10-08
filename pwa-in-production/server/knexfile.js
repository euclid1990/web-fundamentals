const dotenv = require('dotenv').config();
const utils = require('./utils');

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './database/dev.sqlite3'
    },
    useNullAsDefault: true,
    migrations: {
      directory: './database/migrations',
      tableName: 'migrations'
    },
    seeds: {
      directory: './database/seeds'
    }
  },
  staging: {
    client: utils.env('DB_DRIVER'),
    connection: {
      host: utils.env('DB_HOST'),
      port: utils.env('DB_PORT'),
      database: utils.env('DB_DATABASE'),
      user: utils.env('DB_USERNAME'),
      password: utils.env('DB_PASSWORD')
    },
    pool: { min: 2, max: 10 },
    migrations: {
      tableName: 'migrations'
    }
  },
  production: {
    client: utils.env('DB_DRIVER'),
    connection: {
      host: utils.env('DB_HOST'),
      port: utils.env('DB_PORT'),
      database: utils.env('DB_DATABASE'),
      user: utils.env('DB_USERNAME'),
      password: utils.env('DB_PASSWORD')
    },
    pool: { min: 2, max: 10 },
    migrations: {
      tableName: 'migrations'
    }
  }
};

