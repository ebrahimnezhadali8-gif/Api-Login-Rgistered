import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const AccessToken = (user) => {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
};

export const RefreshToken = (user) => {
  return jwt.sign(
    {
      sub: user.id,
      tokenVersion: user.tokenVersion,//tokenVersion in logout or token leak
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
};
