import bcrypt from "bcrypt";
import AppError from "../utilites/app_error.js";
import { trycatchHandler } from "../utilites/trycatch_handler.js";
import { generateCode, hashCode } from "../services/generate-code.js";
import { sendOtp } from "../services/send-templet.js";
import { AccessToken, RefreshToken } from "../utilites/token.js";
import db from "../models/index.js";
const { User, Otp, Token } = db;
import { v4 as uuidv4 } from "uuid";
import { Sequelize, Op } from "sequelize";
import config from "../config/index.js";
import jwt from "jsonwebtoken";

export const register = trycatchHandler(async (req, res) => {
  const { name, phone, password } = req.body;

  const exists = await User.findOne({
    where: {
      phone: phone,
    },
  });
  if (exists) {
    throw new AppError({
      errorCode: "FOUND_PHONE",
      message: "این شماره تلفن قبلاً ثبت نام کرده است",
      statusCode: 409,
    });
  }
  const hashPassword = await bcrypt.hash(password, 12);

  const id = uuidv4();
  await User.create({
    id: id,
    name: name,
    phone: phone,
    password: hashPassword,
  });

  res.status(201).json({
    success: true,
    message: "ثبت نام با موفقیت انجام شد",
  });
});

export const login = trycatchHandler(async (req, res) => {
  const { phone, password } = req.body;

  const user = await User.findOne({
    where: {
      phone: phone,
    },
  });
  console.log(user);
  if (!user) {
    throw new AppError({
      errorCode: "NOT_FOUND_PHONE",
      message: "شماره تلفن یا رمز عبور اشتباه است",
      statusCode: 401,
    });
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new AppError({
      errorCode: "NOT_FOUND_PHONE",
      message: "شماره تلفن یا رمز عبور اشتباه است",
      statusCode: 401,
    });
  }

  const code = generateCode();
  const hashedCode = hashCode(code);

  const codeUsed = await Otp.update(
    {
      used_at: Sequelize.fn("now"), // یا new Date()
    },
    {
      where: {
        phone: phone,
        used_at: null,
        type: "login",
      },
    },
  );

  const sendOtpCode = await sendOtp(phone, code, "login");
  console.log(sendOtpCode);
  if (!sendOtpCode) {
    throw new AppError({
      errorCode: "NOT_SEND_OTP_CODE",
      message: "خطا در اتصال با سرور",
      statusCode: 500,
    });
  }
  // console.log("کد ورود شما :", `شماره شما: ${phone}`, code);
  const expire = new Date(Date.now() + 3 * 60 * 1000);
  await Otp.create({
    phone: phone,
    code: hashedCode,
    type: "login",
    expires_at: expire,
  });

  res.status(200).json({
    message: "کد به شماره شما ارسال شد ",
  });
});

export const otpCheckLogin = trycatchHandler(async (req, res) => {
  const { phone, code, type } = req.body;
  const user = await User.findOne({
    where: {
      phone: phone,
    },
    attributes: ["id", "name", "phone", "role"],
  });
  if (!user) {
    throw new AppError({
      errorCode: "NOT_FOUND_PHONE",
      message: "شماره نامعتبر است",
      statusCode: 401,
    });
  }
  const otp = await Otp.findOne({
    where: {
      phone: phone,
      expires_at: {
        [Op.gt]: Sequelize.fn("now"), // expires_at > now()
      },
      used_at: null,
      type: type,
    },
  });
  if (!otp) {
    throw new AppError({
      errorCode: "NOT_FOUND_CODE_OTP",
      message: "کد نا معتبر است",
      statusCode: 401,
    });
  }
  const codeHash = hashCode(code);
  if (otp.code !== codeHash) {
    throw new AppError({
      errorCode: "ERROR_CODE_OTP",
      message: "کد نا معتبر است ",
      statusCode: 401,
    });
  }

  const codeUsed = await Otp.update(
    {
      used_at: Sequelize.fn("now"), // یا new Date()
    },
    {
      where: {
        phone: phone,
        used_at: null,
        type: type,
      },
    },
  );
  const accessToken = AccessToken(user);
  const tokenId = uuidv4();
  const refreshToken = RefreshToken(user, tokenId);
  const hashToken = hashCode(refreshToken);
  const expire = 7 * 24 * 60 * 60 * 1000;
  await Token.destroy({
    where: { userId: user.id },
  });
  await Token.create({
    id: tokenId,
    userId: user.id,
    token: hashToken,
    expires_at: new Date(Date.now() + expire),
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: expire,
  });

  res.status(200).json({
    accessToken,
    user: user,
  });
});

export const sendCodeOtp = trycatchHandler(async (req, res) => {
  const { phone, type } = req.body;
  const user = await User.findOne({
    where: {
      phone: phone,
    },
  });
  if (type === "register") {
    if (user) {
      throw new AppError({
        errorCode: "FOUND_PHON",
        message: "شما قبلا ثبت نام کرده اید ",
        statusCode: 401,
      });
    }
  } else {
    if (!user) {
      throw new AppError({
        errorCode: "NOT_FOUND_PHON",
        message: "شماره نامعتبر است ",
        statusCode: 401,
      });
    }
  }

  const code = generateCode();
  const hashedCode = hashCode(code);
  const codeUsed = await Otp.update(
    {
      used_at: Sequelize.fn("now"), // یا new Date()
    },
    {
      where: {
        phone: phone,
        used_at: null,
        type: type,
      },
    },
  );

  const expire = new Date(Date.now() + 3 * 60 * 1000);
  await Otp.create({
    phone: phone,
    code: hashedCode,
    type: type,
    expires_at: expire,
  });

  const sendOtpCode = await sendOtp(phone, code, type);
  if (!sendOtpCode) {
    throw new AppError({
      errorCode: "NOT_SEND_OTP_CODE",
      message: "خطا در اتصال با سرور",
      statusCode: 500,
    });
  }

  res.status(200).json({
    message: "کد به شماره شما ارسال شد ",
  });
});

export const otpCheckForgot = trycatchHandler(async (req, res) => {
  const { phone, code, type } = req.body;
  if (type !== "register") {
    // console.log("Login or forgot", phone, code, type);
    const user = await User.findOne({
      where: {
        phone: phone,
      },
    });
    if (!user) {
      throw new AppError({
        errorCode: "NOT_FOUND_PHON",
        message: "شماره نامعتبر است ",
        statusCode: 401,
      });
    }
  }

  const otp = await Otp.findOne({
    where: {
      phone: phone,
      expires_at: {
        [Op.gt]: Sequelize.fn("now"), // expires_at > now()
      },
      used_at: null,
      type: type,
    },
  });
  if (!otp) {
    throw new AppError({
      errorCode: "NOT_FOUND_CODE_OTP",
      message: "کد نا معتبر است",
      statusCode: 401,
    });
  }
  const codeHash = hashCode(code);
  if (otp.code !== codeHash) {
    throw new AppError({
      errorCode: "ERROR_CODE_OTP",
      message: "کد نامعتبر است ",
      statusCode: 401,
    });
  }

  const codeUsed = await Otp.update(
    {
      used_at: Sequelize.fn("now"), // یا new Date()
    },
    {
      where: {
        phone: phone,
        used_at: null,
        type: type,
      },
    },
  );
  res.status(200).json({
    message: "ورود با موفقیت انجام شد",
  });
});

export const updatePassword = trycatchHandler(async (req, res) => {
  const { phone, password } = req.body;
  const exists = await User.findOne({
    where: {
      phone: phone,
    },
  });
  console.log(exists)
  if (!exists) {
    throw new AppError({
      errorCode: "NOT_FOUND_PHON",
      message: "شماره نامعتبر است ",
      statusCode: 404,
    });
  }

  const hashPassword = await bcrypt.hash(password, 12);
  // await UserModel.updatePassword(exists.id, hashPassword);
  await User.update({ password: hashPassword }, { where: { id: exists.id } });

  res.status(201).json({
    success: true,
    message: "تغییر رمز عبور با موفقیت انجام شد",
  });
});

export const refresh = trycatchHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  console.log(`token : ${token}`);
  if (!token) throw new AppError("NO_REFRESH_TOKEN", "Unauthorized", 401);

  const hashToken = hashCode(token);
  const payload = jwt.verify(token, config.jwt.refreshTokenSecret);

  const user = await User.findOne({
    where: {
      id: payload.sub,
    },
  });
  if (!user) {
    throw new AppError({
      errorCode: "REVOKED",
      message: "احراز هویت تایید نشد",
      statusCode: 401,
    });
  }
  const refresh_token = await Token.findOne({
    where: {
      userId: payload.sub,
    },
  });
  if (hashToken !== refresh_token.token) {
    throw new AppError({
      errorCode: "REVOKED",
      message: "احراز هویت تایید نشد",
      statusCode: 401,
    });
  }
  const newAccessToken = AccessToken(user);
  res.json({ accessToken: newAccessToken });
});
export async function logout(req, res, next) {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.sendStatus(204);
    }
    const tokenHash = hashCode(refreshToken);
    const payload = jwt.verify(refreshToken, config.jwt.refreshTokenSecret);
    console.log(payload);
    await Token.destroy({
      where: {
        id: payload.tid,
      },
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
    });

    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}
