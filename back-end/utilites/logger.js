import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logsDir = path.join(__dirname, "../../logs");

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// mask 
const SENSITIVE_KEYS = [
  "password",
  "token",
  "authorization",
  "refreshToken",
  "accessToken",
  "phone",
];

export const maskSensitive = (data) => {
  if (!data || typeof data !== "object") return data;
  if (Array.isArray(data)) return data.map(maskSensitive);

  const masked = {};
  for (const key in data) {
    if (SENSITIVE_KEYS.includes(key.toLowerCase())) {
      masked[key] = "***MASKED***";
    } else if (typeof data[key] === "object") {
      masked[key] = maskSensitive(data[key]);
    } else {
      masked[key] = data[key];
    }
  }
  return masked;
};

// Transports
const transports = [
  new DailyRotateFile({
    filename: path.join(logsDir, "%DATE%.combined.log"),
    datePattern: "YYYY-MM-DD",
    maxSize: "20m",
    maxFiles: "30d",
  }),
  new DailyRotateFile({
    filename: path.join(logsDir, "%DATE%.error.log"),
    level: "error",
    datePattern: "YYYY-MM-DD",
    maxSize: "20m",
    maxFiles: "60d",
  }),
];

if (process.env.NODE_ENV !== "production") {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

// Logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: process.env.SERVICE_NAME || "api",
    env: process.env.NODE_ENV || "development",
  },
  transports,
});

// Helper
export const logRequest = (payload) => {
  logger.info({ type: "HTTP_REQUEST", ...payload });
};

export const logResponse = (payload) => {
  logger.info({ type: "HTTP_RESPONSE", ...payload });
};

export const logError = (payload) => {
  logger.error({ type: "ERROR", ...payload });
};

export default logger;
