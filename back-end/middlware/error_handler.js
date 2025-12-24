import AppError from "../utilites/app_error.js";
import { logError } from "../utilites/logger.js";

const errorHandler = (err, req, res, next) => {
  const requestId = req.requestId || "unknown";
  const userId = req.userId || null;

  logError({
    requestId,
    userId,
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
    statusCode: err.statusCode || 500,
  });

  if (err.name === "ValidationError") {
    return res.status(400).json({ message: "Validation failed" });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      errorCode: err.errorCode,
      message: err.message,
    });
  }

  return res.status(500).json({ message: "خطای سرور" });
};

export default errorHandler;
