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

export const RefreshToken = (user , tokenId) => {
  return jwt.sign(
    {
      sub: user.id,
      tid: tokenId
    },
    config.jwt.refreshTokenSecret,
    {
      expiresIn: config.jwt.refreshTokenExpires,
    },
  );
};
