import dotenv from "dotenv";
dotenv.config();

const config = {
  app: {
    port: process.env.PORT || 5500, 
    serviceName: process.env.SERVICE_NAME || "SERVICE_API_LOGIN",
    baseUrl: process.env.BASE_URL || "https://yourdomain.com", 
  },
  logging: {
    level: process.env.LOG_LEVEL_PRO || "error", 
  },
  database: {
    host: process.env.DB_PROD_HOST || "db.yourproduction.com",
    username: process.env.DB_PROD_USERNAME || "prod_user",
    password: process.env.DB_PROD_PASSWORD, 
    database: process.env.DB_PROD_DATABASE || "API_LOGIN",
    dialect: process.env.DB_PROD_DIALECT || "mysql",
    pool: {
      max: parseInt(process.env.DB_POOL_MAX_PRO || "10", 10), 
      min: parseInt(process.env.DB_POOL_MIN_PRO || "2", 10),
      acquire: parseInt(process.env.DB_POOL_ACQUIRE_PRO || "50000", 10),
      idle: parseInt(process.env.DB_POOL_IDLE_PRO || "20000", 10),
    },
  },
  // api sms otp
  apiKeys: {
    externalService: process.env.API_KEY, 
    loginTemplateId: process.env.LOGIN_TEMPLATE_ID,
    verifyTemplateId: process.env.VERIFY_TEMPLATE_ID,
  },
  jwt: {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET, // access token secet key
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET, // refresh token secert key
    accessTokenExpires: process.env.ACCESS_TOKEN_EXPIRES || "15m", // time expires access token
    refreshTokenExpires: process.env.REFRESH_TOKEN_EXPIRES || "7d", // time expires refresh token
  },
};

export default config;
