import dotenv from "dotenv";
dotenv.config();

const config = {
  // override تنظیمات app
  app: {
    port: process.env.PORT || 3000, // اگر PORT در .env تعریف نشده باشد، 3000
    serviceName: process.env.SERVICE_NAME || "my-express-app-dev",
    baseUrl: `http://localhost:${process.env.PORT || 3000}`,
  },
  // override تنظیمات logging
  logging: {
    level: process.env.LOG_LEVEL || "debug", // در محیط توسعه، لاگ‌های debug را می‌خواهیم
  },
  // override تنظیمات database
  database: {
    host: process.env.DB_HOST_DEV || "127.0.0.1",
    username: process.env.DB_USER_DEV || "root",
    password: process.env.DB_PASSWORD_DEV || null,
    database: process.env.DB_DATABASE_DEV || "database_development",
    dialect: process.env.DB_DIALECT_DEV || "mysql",
    // pool settings can be overridden here if needed
  },
  // override تنظیمات JWT
  jwt: {
    accessTokenSecret:
      process.env.ACCESS_TOKEN_SECRET || "development_access_secret_fallback",
    refreshTokenSecret:
      process.env.REFRESH_TOKEN_SECRET || "development_refresh_secret_fallback",
    accessTokenExpires: process.env.ACCESS_TOKEN_EXPIRES || "15m",
    refreshTokenExpires: process.env.REFRESH_TOKEN_EXPIRES || "7d",
  },
  // secret key مخصوص محیط توسعه
  SECRET_KEY: process.env.SECRET_KEY || "development_secret_key_fallback",
};

export default config;
