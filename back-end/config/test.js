import dotenv from "dotenv";
dotenv.config();

const config = {
  app: {
    port: process.env.PORT || 3001, 
    serviceName: process.env.SERVICE_NAME || "SERVICE_API_LOGIN",
  },
  logging: {
    level: process.env.LOG_LEVEL_TEST || "warn", 
  },
  database: {
    host: process.env.DB_HOST_TEST || "127.0.0.1",
    username: process.env.DB_USER_TEST || "root",
    password: process.env.DB_PASSWORD_TEST || null,
    database: process.env.DB_DATABASE_TEST || "API_LOGIN",
    dialect: process.env.DB_DIALECT_TEST || "mysql",
  },
 
  jwt: {
    accessTokenSecret: "test_access_secret",
    refreshTokenSecret: "test_refresh_secret",
    accessTokenExpires: "1m", 
    refreshTokenExpires: "5m",
  },
};

export default config;
