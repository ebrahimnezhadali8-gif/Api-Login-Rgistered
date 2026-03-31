require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER_DEV,
    password: process.env.DB_PASSWORD_DEV,
    database: process.env.DB_DATABASE_DEV,
    host: process.env.DB_HOST_DEV,
    dialect: process.env.DB_DIALECT_DEV
  },
  test: {
    username: process.env.DB_USER_TEST,
    password: process.env.DB_PASSWORD_TEST,
    database: process.env.DB_DATABASE_TEST,
    host: process.env.DB_HOST_TEST,
    dialect: process.env.DB_DIALECT_TEST
  },
  production: {
    username: process.env.DB_HOST_PRO,
    password: process.env.DB_PASSWORD_PRO,
    database: process.env.DB_DATABASE_PRO,
    host: process.env.DB_HOST_PRO,
    dialect: process.env.DB_DIALECT_PRO
  }
};

