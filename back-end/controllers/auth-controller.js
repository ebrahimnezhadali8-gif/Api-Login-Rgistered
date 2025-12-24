import bcrypt from "bcrypt";
import UserModel from "../models/user-model.js";
import AppError from "../utilites/app_error.js";
import { trycatchHandler } from "../utilites/trycatch_handler.js";
import { generateCode, hashCode } from "../services/generate-code.js";
import OtpModel from "../models/otp-user-model.js";
import jwt from "jsonwebtoken";

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
  const token = jwt.sign(
    { id: user[0].id, role: user[0].role, phone: user[0].phone },
    process.env.SECRET_KEY,
    { expiresIn: "2h" } // Time Token
  );
  res.status(200).json({
    message: "ورود با موفقیت انجام شد",
    token: token,
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
