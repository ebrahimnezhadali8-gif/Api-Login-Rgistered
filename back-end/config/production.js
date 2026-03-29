import dotenv from "dotenv";
dotenv.config();

const config = {
  app: {
    port: process.env.PORT || 8080, // پورت استاندارد پروداکشن
    serviceName: process.env.SERVICE_NAME || "my-express-app-prod",
    baseUrl: process.env.BASE_URL || "https://yourdomain.com", // URL واقعی اپلیکیشن
  },
  logging: {
    level: process.env.LOG_LEVEL || "error", // در پروداکشن، فقط خطاها را لاگ می‌کنیم
  },
  database: {
    host: process.env.DB_PROD_HOST || "db.yourproduction.com",
    username: process.env.DB_PROD_USERNAME || "prod_user",
    password: process.env.DB_PROD_PASSWORD, // *حتماً* باید از متغیر محیطی خوانده شود
    database: process.env.DB_PROD_DATABASE || "database_production",
    dialect: process.env.DB_PROD_DIALECT || "mysql",
    pool: {
      max: 20, // Pool بزرگتر برای پروداکشن
      min: 5,
      acquire: 60000,
      idle: 30000,
    },
  },
  apiKeys: {
    externalService: process.env.API_KEY, // کلید API واقعی پروداکشن
    loginTemplateId: process.env.LOGIN_TEMPLATE_ID,
    verifyTemplateId: process.env.VERIFY_TEMPLATE_ID,
  },
  jwt: {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET, // *حتماً* از متغیر محیطی خوانده شود
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET, // *حتماً* از متغیر محیطی خوانده شود
    accessTokenExpires: process.env.ACCESS_TOKEN_EXPIRES || "15m",
    refreshTokenExpires: process.env.REFRESH_TOKEN_EXPIRES || "7d",
  },
  SECRET_KEY: process.env.SECRET_KEY, // کلید مخفی واقعی پروداکشن
};

export default config;
