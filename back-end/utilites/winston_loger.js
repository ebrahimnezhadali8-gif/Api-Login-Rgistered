import winston from "winston";
const { createLogger, format, transports } = winston
import path, { dirname } from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname  =dirname(__filename)
const logsDir = path.join(__dirname, "../logs");
const date = new Date().toISOString().split("T")[0];
const logFileName = path.join(logsDir, `${date}.log`);

const logger = createLogger({
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
      level: "info",
    }),
    new transports.File({
      filename: logFileName,
      level: "error",
    }),
  ],
});

// deleted file in 30 days
const days = 24 * 60 * 60 * 1000; //Milliseconds to days
function cleanOldFile() {
  fs.readdirSync(logsDir).forEach((file) => {
    const filePath = path.join(logsDir, file);
    const fileAgeSeconds = (Date.now() - fs.statSync(filePath).mtimeMs) / days;
    if (fileAgeSeconds > 30) {
      fs.unlinkSync(filePath);
      console.log(`Deleted old file: ${file}`);
    }
  });
}
setInterval(cleanOldFile, days);

export default logger;
