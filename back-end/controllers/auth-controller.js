import bcrypt from "bcrypt";
import UserModel from "../models/user-model.js";
import AppError from "../utilites/app_error.js";
import { trycatchHandler } from "../utilites/trycatch_handler.js";
import { generateCode, hashCode } from "../services/generate-code.js";
import OtpModel from "../models/otp-user-model.js";
import jwt from "jsonwebtoken";
import { sendOtp } from "../api-message/send-templet.js";
import { AccessToken, RefreshToken } from "../utilites/token.js";
import dotenv from "dotenv";
import TokenModel from "../models/token_model.js";
dotenv.config({ path: "../.env" });

export const register = trycatchHandler(async (req, res) => {
  const { name, phone, password } = req.body;

  const exists = await UserModel.getUserPhone(phone);
  if (exists.length) {
    throw new AppError({
      errorCode: "NOT_FOUND_PHONE",
      message: "این شماره تلفن قبلاً ثبت نام کرده است",
      statusCode: 409,
    });
  }
  const hashPassword = await bcrypt.hash(password, 12);

  await UserModel.addUser(name, phone, hashPassword);

  res.status(201).json({
    success: true,
    message: "ثبت نام با موفقیت انجام شد",
  });
});

export const login = trycatchHandler(async (req, res) => {
  const { phone, password } = req.body;
  const user = await UserModel.getUserPhone(phone);
  if (!user.length) {
    throw new AppError({
      errorCode: "NOT_FOUND_PHONE",
      message: "شماره تلفن یا رمز عبور اشتباه است",
      statusCode: 401,
    });
  }
  const validPassword = await bcrypt.compare(password, user[0].password);
  if (!validPassword) {
    throw new AppError({
      errorCode: "NOT_FOUND_PHONE",
      message: "شماره تلفن یا رمز عبور اشتباه است",
      statusCode: 401,
    });
  }

  const code = generateCode();
  const hashedCode = hashCode(code);

  const codeUsed = await OtpModel.updateOtp(user[0].id, "login");
  //await sendOtp(phone, code, "login");
  console.log("کد ورود شما :", `شماره شما: ${phone}`, code);
  const expire = new Date(Date.now() + 3 * 60 * 1000);
  await OtpModel.addOtp(user[0].id, hashedCode, "login", expire);

  res.status(200).json({
    message: "کد به شماره شما ارسال شد ",
  });
});

export const otpCheckLogin = trycatchHandler(async (req, res) => {
  const { phone, code, type } = req.body;
  const user = await UserModel.getUserPhone(phone);
  if (!user[0]) {
    throw new AppError({
      errorCode: "NOT_FOUND_PHONE",
      message: "شماره نامعتبر است",
      statusCode: 401,
    });
  }
  const otp = await OtpModel.getOtp(user[0].id, type);
  if (!otp[0]) {
    throw new AppError({
      errorCode: "NOT_FOUND_CODE_OTP",
      message: "کد نا معتبر است",
      statusCode: 401,
    });
  }
  const codeHash = hashCode(code);
  if (otp[0].code !== codeHash) {
    throw new AppError({
      errorCode: "ERROR_CODE_OTP",
      message: "کد نا معتبر است ",
      statusCode: 401,
    });
  }

  const codeUsed = await OtpModel.updateOtp(user[0].id, type);
  const accessToken = AccessToken(user[0]);
  const refreshToken = RefreshToken(user[0]);
  const hashToken = hashCode(refreshToken);
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false, // برای localhost
    sameSite: "lax", // برای dev
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  console.log(" cookie set");
  const time_expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await TokenModel.insertToken(user[0].id, hashToken, time_expires);
  res.status(200).json({
    accessToken,
    role: user[0].role,
  });
});

export const sendCodeOtp = trycatchHandler(async (req, res) => {
  const { phone, type } = req.body;
  const user = await UserModel.getUserPhone(phone);
  if (!user[0]) {
    throw new AppError({
      errorCode: "NOT_FOUND_PHON",
      message: "شماره نامعتبر است ",
      statusCode: 401,
    });
  }

  const code = generateCode();
  const hashedCode = hashCode(code);

  const codeUsed = await OtpModel.updateOtp(user[0].id, type);
  await sendOtp(phone, code, type);
  if (type == "login") {
    console.log("کد ورود شما :", `شماره شما: ${phone}`, code);
  } else {
    console.log("کد تایید شما :", `شماره شما: ${phone}`, code);
  }
  const expire = new Date(Date.now() + 3 * 60 * 1000);
  await OtpModel.addOtp(user[0].id, hashedCode, type, expire);

  res.status(200).json({
    message: "کد به شماره شما ارسال شد ",
  });
});

export const otpCheckForgot = trycatchHandler(async (req, res) => {
  const { phone, code, type } = req.body;
  const user = await UserModel.getUserPhone(phone);
  if (!user[0]) {
    throw new AppError({
      errorCode: "NOT_FOUND_PHON",
      message: "شماره نامعتبر است ",
      statusCode: 401,
    });
  }
  const otp = await OtpModel.getOtp(user[0].id, type);
  if (!otp[0]) {
    throw new AppError({
      errorCode: "NOT_FOUND_CODE_OTP",
      message: "کد نا معتبر است",
      statusCode: 401,
    });
  }
  const codeHash = hashCode(code);
  if (otp[0].code !== codeHash) {
    throw new AppError({
      errorCode: "ERROR_CODE_OTP",
      message: "کد نامعتبر است ",
      statusCode: 401,
    });
  }

  const codeUsed = await OtpModel.updateOtp(user[0].id, type);
  res.status(200).json({
    message: "ورود با موفقیت انجام شد",
  });
});

export const updatePassword = trycatchHandler(async (req, res) => {
  const { phone, password } = req.body;
  const exists = await UserModel.getUserPhone(phone.trim());
  if (!exists.length) {
    throw new AppError({
      errorCode: "NOT_FOUND_PHON",
      message: "شماره نامعتبر است ",
      statusCode: 404,
    });
  }

  const hashPassword = await bcrypt.hash(password, 12);
  await UserModel.updatePassword(exists[0].id, hashPassword);

  res.status(201).json({
    success: true,
    message: "تغییر رمز عبور با موفقیت انجام شد",
  });
});

export const refresh = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) throw new AppError("NO_REFRESH", "Unauthorized", 401);

  const hashToken = hashCode(token);
  const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  const user = await UserModel.getUserId(payload.sub);
  if (user[0].token !== payload.token) {
    throw new AppError({
      errorCode: "REVOKED",
      message: "احراز هویت تایید نشد",
      statusCode: 401,
    });
  }
  const refresh_token = await TokenModel.getTokenInUserId(payload.sub);
  if (hashToken !== refresh_token[0].token) {
    throw new AppError({
      errorCode: "REVOKED",
      message: "احراز هویت تایید نشد",
      statusCode: 401,
    });
  }
  const newAccessToken = RefreshToken(user[0]);
  res.json({ accessToken: newAccessToken });
};
export async function logout(req, res, next) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.sendStatus(204);
    }
    const tokenHash = hashCode(refreshToken);
    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const token = await TokenModel.getTokenInUserId(payload.sub);
    if (!token[0]) return res.sendStatus(204);

    await TokenModel.deleteToken(token[0].id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // برای localhost
      sameSite: "lax", // برای dev
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}
