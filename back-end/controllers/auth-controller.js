import bcrypt from "bcrypt";
import UserModel from "../models/user-model.js";
import AppError from "../utilites/app_error.js";
import { trycatchHandler } from "../utilites/trycatch_handler.js";

export const register = trycatchHandler(async (req, res) => {
  const { name, phone, password } = req.body;

  const exists = await UserModel.getUserPhone(phone);
  if (exists.length) {
    throw new AppError(
      109,
      "این شماره تلفن قبلاً ثبت نام کرده است",
      409
    );
  }

  const hashPassword = await bcrypt.hash(password, 12);

  await UserModel.addUser(name, phone, hashPassword);

  res.status(201).json({
    success: true,
    message: "ثبت نام با موفقیت انجام شد",
  });
});
