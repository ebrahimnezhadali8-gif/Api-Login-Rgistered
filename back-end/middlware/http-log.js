import { logRequest, logResponse, maskSensitive } from "../utilites/logger.js";

export const httpLogger = (req, res, next) => {
  const start = Date.now();

  logRequest({
    requestId: req.requestId,
    userId: req.userId || null,
    method: req.method,
    path: req.originalUrl,
    body: maskSensitive(req.body),
  });

  res.on("finish", () => {
    logResponse({
      requestId: req.requestId,
      userId: req.userId || null,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      duration: Date.now() - start,
    });
  });

  next();
};
