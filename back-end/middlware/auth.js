import jwt from "jsonwebtoken";
import AppError from "../utilites/app_error.js";

export const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    throw new AppError({
      errorCode: "NO_TOKEN",
      message: "احراز هویت تایید نشد",
      statusCode: 401,
    });
  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = {
      id: payload.sub,
      role: payload.role,
    };
    next();
  } catch {
    throw new AppError({
      errorCode: "TOKEN_EXPIRED",
      message: "احراز هویت تایید نشد",
      statusCode: 401,
    });
  }
};

export const roleAuth = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError({
        errorCode: "FORBIDDEN",
        message: "Access denied",
        statusCode: 401,
      });
    }
    next();
  };
};
