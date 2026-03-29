import dotenv from "dotenv";
dotenv.config();

const config = {
  app: {
    port: process.env.PORT || 3001, // ممکن است پورت متفاوتی برای تست بخواهید
    serviceName: process.env.SERVICE_NAME || "my-express-app-test",
  },
  logging: {
    level: process.env.LOG_LEVEL || "warn", // در تست، لاگ‌های کمتری می‌خواهیم
  },
  database: {
    host: process.env.DB_HOST_TEST || "127.0.0.1",
    username: process.env.DB_USER_TEST || "root",
    password: process.env.DB_PASSWORD_TEST || null,
    database: process.env.DB_DATABASE_TEST || "database_test",
    dialect: process.env.DB_DIALECT_TEST || "mysql",
  },
  // در محیط تست، ممکن است از کلیدهای موقت یا ساده‌تر استفاده کنید
  jwt: {
    accessTokenSecret: "test_access_secret",
    refreshTokenSecret: "test_refresh_secret",
    accessTokenExpires: "1m", // زمان کوتاه‌تر برای تست
    refreshTokenExpires: "5m",
  },
  SECRET_KEY: "test_secret_key",
};

export default config;
