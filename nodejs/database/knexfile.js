require('dotenv').config();

module.exports = {
  staging: {
    client: 'pg',
    connection: {
      host: 'postgres',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    },
    migrations: {
      directory: './database/migrations'
    },
    seeds: {
      directory: './database/seeds'
    }
  },

  production: {
    client: 'pg',
    connection: {
      host: 'postgres',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    },
    migrations: {
      directory: './database/migrations'
    }
  }
};