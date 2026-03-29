import dotenv from "dotenv";
dotenv.config();

const config = {
  // تنظیمات کلی اپلیکیشن
  app: {
    port: process.env.PORT || 3000,
    serviceName: process.env.SERVICE_NAME || "API_LOGIN",
    baseUrl:
      process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`, // URL اصلی اپلیکیشن
  },

  // تنظیمات لاگینگ
  logging: {
    level: process.env.LOG_LEVEL || "info", // سطح لاگ (debug, info, warn, error)
  },

  // کلیدهای عمومی یا تنظیمات سرویس‌های خارجی
  apiKeys: {
    externalService: process.env.API_KEY,
    loginTemplateId: process.env.LOGIN_TEMPLATE_ID,
    verifyTemplateId: process.env.VERIFY_TEMPLATE_ID,
  },

  // تنظیمات توکن‌های JWT
  jwt: {
    accessTokenSecret:
      process.env.ACCESS_TOKEN_SECRET || "default_access_secret",
    refreshTokenSecret:
      process.env.REFRESH_TOKEN_SECRET || "default_refresh_secret",
    accessTokenExpires: process.env.ACCESS_TOKEN_EXPIRES || "15m",
    refreshTokenExpires: process.env.REFRESH_TOKEN_EXPIRES || "7d",
  },

  // تنظیمات دیتابیس (مقادیر پیش‌فرض و انعطاف‌پذیر)
  // این مقادیر در فایل‌های محیطی override می‌شوند
  database: {
    host: process.env.DB_HOST || "127.0.0.1",
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_DATABASE || "database_default",
    dialect: process.env.DB_DIALECT || "mysql",
    pool: {
      // تنظیمات Pool برای Sequelize
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
};

export default config;