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
  // Check in existence of user
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
  // Burn OTP after use
  await otp.update({ used_at: Sequelize.fn("now") });
  const codeHash = hashCode(code);
  if (otp.code !== codeHash) {
    throw new AppError({
      errorCode: "ERROR_CODE_OTP",
      message: "کد نا معتبر است ",
      statusCode: 401,
    });
  }

  const tokenId = uuidv4();
  const familyId = uuidv4();
  const accessToken = AccessToken(user);
  const refreshToken = RefreshToken(user, tokenId, familyId);
  const hashToken = hashCode(refreshToken);
  const expire = 7 * 24 * 60 * 60 * 1000;

  // Store the hashed refresh token in the database
  await Token.create({
    id: tokenId,
    userId: user.id,
    token: hashToken,
    expires_at: new Date(Date.now() + expire),
  });

  res.cookie("accessToken", accessToken, getCookieOptions(15 * 60 * 1000)); // 15 minutes
  res.cookie("refreshToken", refreshToken, getCookieOptions(expireDays));

  res.status(200).json({
    success: true,
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
  console.log(exists);
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

// Check if the refresh token is valid and issue a new access token
export const refresh = trycatchHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) throw new AppError("NO_REFRESH_TOKEN", "Unauthorized", 401);

  const hashToken = hashCode(token);
  let payload;
  try {
    payload = jwt.verify(token, config.jwt.refreshTokenSecret);
  } catch (err) {
    throw new AppError("INVALID_TOKEN", "توکن نامعتبر است", 401);
  }
  const { sub: userId, fid: familyId } = payload;
  await sequelize.transaction(async (tx) => {
    const tokenRecord = await Token.findOne({
      where: {
        userId: userId,
        familyId: familyId,
        token: hashToken,
      },
      lock: tx.LOCK.UPDATE,
      transaction: tx,
    });
    if (!tokenRecord) {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      throw new AppError(
        "TOKEN_NOT_FOUND",
        "نشست معتبری یافت نشد، لطفا دوباره لاگین کنید",
        401,
      );
    }
    // if token is already used, it means a possible token theft or replay attack
    if (tokenRecord.is_used) {
      await Token.destroy({
        where: { familyId: familyId },
        transaction: tx,
      });
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      throw new AppError(
        "SECURITY_BREACH",
        "رفتار مشکوک در سیستم شما شناسایی شده است. به دلایل امنیتی لطفا دوباره لاگین کنید",
        403,
      );
    }
    if (hashToken !== tokenRecord.token) {
      throw new AppError("REVOKED", "احراز هویت تایید نشد", 401);
    }

    const user = await User.findByPk(userId, { transaction: tx });
    if (!user) throw new AppError("USER_NOT_FOUND", "کاربر یافت نشد", 401);

    // save the token as used to prevent replay attacks
    await tokenRecord.update({ is_used: true }, { transaction: tx });

    const newSubTokenId = uuidv4();
    const expireDays = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

    const newAccessToken = AccessToken(user);
    const newRefreshToken = RefreshToken(user, newSubTokenId, familyId);

    const newHashToken = hashCode(newRefreshToken);

    await Token.create(
      {
        id: uuidv4(),
        familyId: familyId,
        userId: user.id,
        token: newHashToken,
        is_used: false,
        expires_at: new Date(Date.now() + expireDays),
      },
      { transaction: tx },
    );
    // Set new tokens in cookies
    res.cookie("accessToken", newAccessToken, getCookieOptions(15 * 60 * 1000));
    res.cookie("refreshToken", newRefreshToken, getCookieOptions(expireDays));
  });

  res.status(200).json({ success: true });
});
export const logout = trycatchHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) {
    try {
      const payload = jwt.verify(refreshToken, config.jwt.refreshTokenSecret);
      await Token.destroy({
        where: { familyId: payload.fid },
      });
    } catch (err) {
      console.error("Logout Error: Invalid token", err);
    }
  }
  // Clear cookies
  res.clearCookie("accessToken", getCookieOptions(0));
  res.clearCookie("refreshToken", getCookieOptions(0));
  res.status(200).json({ success: true, message: "با موفقیت خارج شدید" });
});
