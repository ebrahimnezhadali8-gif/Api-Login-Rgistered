import dotenv from "dotenv";
dotenv.config();

const config = {
  // override app
  app: {
    port: process.env.PORT || 3000,
    serviceName: process.env.SERVICE_NAME || "SERVICE_API_LOGIN",
    baseUrl:
      process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`, // URL app
  },

  // override logging
  logging: {
    level: process.env.LOG_LEVEL || "info", // debug, info, warn, error
  },

  // override database
  apiKeys: {
    externalService: process.env.API_KEY,
    loginTemplateId: process.env.LOGIN_TEMPLATE_ID,
    verifyTemplateId: process.env.VERIFY_TEMPLATE_ID,
  },

  // Tokens JWT
  jwt: {
    accessTokenSecret:
      process.env.ACCESS_TOKEN_SECRET || "SERVICE_API_LOGIN",
    refreshTokenSecret:
      process.env.REFRESH_TOKEN_SECRET || "default_refresh_secret",
    accessTokenExpires: process.env.ACCESS_TOKEN_EXPIRES || "15m",
    refreshTokenExpires: process.env.REFRESH_TOKEN_EXPIRES || "7d",
  },

  // override database
  database: {
    host: process.env.DB_HOST || "127.0.0.1",
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_DATABASE || "API_LOGIN",
    dialect: process.env.DB_DIALECT || "mysql",
    pool: {
      max: parseInt(process.env.DB_POOL_MAX || "5", 10), 
      min: parseInt(process.env.DB_POOL_MIN || "0", 10),
      acquire: parseInt(process.env.DB_POOL_ACQUIRE || "30000", 10),
      idle: parseInt(process.env.DB_POOL_IDLE || "10000", 10),
    },
  },
};

export default config;
