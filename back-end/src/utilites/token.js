import jwt from "jsonwebtoken";
import config from "../config/index.js";

export const AccessToken = (user) => {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
    },
    config.jwt.accessTokenSecret,
    { expiresIn: config.jwt.accessTokenExpires },
  );
};

export const RefreshToken = (user, tokenId, familyId) => {
  return jwt.sign(
    { sub: user.id, jti: tokenId, fid: familyId },
    config.jwt.refreshTokenSecret,
    {
      expiresIn: config.jwt.refreshTokenExpires,
    },
  );
};

// settings cookies
export const getCookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: maxAge,
  path: "/",
});
