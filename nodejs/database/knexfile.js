import dotenv from 'dotenv';
dotenv.config();

const config = {
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
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    },
    searchPath: ['public']
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
      directory: './migrations'
    }
  }
};

export default config;