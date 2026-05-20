import jwt from "jsonwebtoken";
import db from "../models/index.js";
import AppError from "../utilites/app_error.js";
import config from "../config/index.js";
const { User } = db;

export const auth = async (req, res, next) => {
  const token = req.cookies.accessToken; // Get token from cookies
  if (!token) {
    return next(
      new AppError({
        errorCode: "NO_TOKEN",
        message: "احراز هویت تایید نشد",
        statusCode: 401,
      }),
    );
  }

  try {
    const payload = jwt.verify(token, config.jwt.accessTokenSecret);
    const user = await User.findOne({
      where: {
        id: payload.sub,
      },
      attributes: ["id", "role"],
    });
    if (!user) {
      return next(
        new AppError({
          errorCode: "NOT_FOUND_TOKEN_USER",
          message: " کاربر  نامعتبر است",
          statusCode: 403,
        }),
      );
    }
    req.user = {
      id: user.id,
      role: user.role,
    };
    next();
  } catch {
    return next(
      new AppError({
        errorCode: "TOKEN_EXPIRED",
        message: "توکن منقضی شده است",
        statusCode: 401,
      }),
    );
  }
};

export const roleAuth = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError({
          errorCode: "FORBIDDEN",
          message: "Access denied",
          statusCode: 401,
        }),
      );
    }
    next();
  };
};
