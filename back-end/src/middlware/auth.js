import jwt from "jsonwebtoken";

import db from "../models/index.js";
import AppError from "../utilites/app_error.js";
const { User } = db;

export const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return next(
      new AppError({
        errorCode: "NO_TOKEN",
        message: "احراز هویت تایید نشد",
        statusCode: 401,
      }),
    );
  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
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
          message: "توکن کاربر یافت نشد",
          statusCode: 403,
        }),
      );
    }
    req.user = {
      //id: payload.sub,
      id: user.id,
      role: user.role,
    };
    next();
  } catch {
    return next(
      new AppError({
        errorCode: "TOKEN_EXPIRED",
        message: "احراز هویت تایید نشد",
        statusCode: 403,
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
