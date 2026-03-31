// import UserModel from "../../model/user-model.js";
import AppError from "../utilites/app_error.js";
import { trycatchHandler } from "../utilites/trycatch_handler.js";
import db from "../models/index.js";
const { User } = db;

export const getUserMe = trycatchHandler(async (req, res) => {
  const userId = req.user.id;
  // const result = await UserModel.getUserId(userId);
  const result = await User.findOne({
    where: {
      id: userId,
    },
    attributes: ["id", "name", "phone", "role"],
  });
  if (!result) {
    throw new AppError({
      errorCode: "NOT_FOUND_USER",
      message: "کاربر یافت نشد ",
      statusCode: 404,
    });
  }
  res.status(200).send(result);
});
