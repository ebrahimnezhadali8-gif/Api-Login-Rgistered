import dotenv from "dotenv";
dotenv.config();

const config = {
  // override app development
  app: {
    port: process.env.PORT || 3000, 
    serviceName: process.env.SERVICE_NAME || "SERVICE_API_LOGIN",
    baseUrl: `http://localhost:${process.env.PORT || 3000}`,
  },
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
  // override JWT
  jwt: {
    accessTokenSecret:
      process.env.ACCESS_TOKEN_SECRET || "development_access_secret_fallback",
    refreshTokenSecret:
      process.env.REFRESH_TOKEN_SECRET || "development_refresh_secret_fallback",
    accessTokenExpires: process.env.ACCESS_TOKEN_EXPIRES || "15m",
    refreshTokenExpires: process.env.REFRESH_TOKEN_EXPIRES || "7d",
  },
};

export default config;
