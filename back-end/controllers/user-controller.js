import UserModel from "../models/user-model.js";
import AppError from "../utilites/app_error.js";
import { trycatchHandler } from "../utilites/trycatch_handler.js";

export const getUserMe = trycatchHandler(async (req, res) => {
  const userId = req.user.id;
  const result = await UserModel.getUserId(userId);
  if (!result[0]) {
    throw new AppError({
      errorCode: "NOT_FOUND_USER",
      message: "کاربر یافت نشد ",
      statusCode: 404,
    });
  }
  delete result.password;
  console.log(result);
  res.status(200).send(result[0]);
});
