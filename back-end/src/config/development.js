import dotenv from "dotenv";
dotenv.config();

const config = {
  // override logging  development
  logging: {
    level: process.env.LOG_LEVEL_DEV || "debug",
  },
  // override database development
  database: {
    host: process.env.DB_HOST_DEV || "127.0.0.1",
    username: process.env.DB_USER_DEV || "root",
    password: process.env.DB_PASSWORD_DEV || null,
    database: process.env.DB_DATABASE_DEV || "API_LOGIN",
    dialect: process.env.DB_DIALECT_DEV || "mysql",
  },
};

export default config;
