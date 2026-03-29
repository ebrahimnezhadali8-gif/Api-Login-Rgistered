import jwt from "jsonwebtoken";
//import dotenv from "dotenv";
//dotenv.config();
import config from "config"

export const AccessToken = (user) => {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
    },
    config.get('jwt.accessTokenSecret'),
    //process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: config.get('jwt.accessTokenExpires')}//process.env.ACCESS_TOKEN_EXPIRES}
  );
};

export const RefreshToken = (user) => {
  return jwt.sign(
    {
      sub: user.id,
      tokenVersion: user.tokenVersion,//tokenVersion in logout or token leak
    },
    config.get('jwt.refreshTokenSecret'),
    //process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: config.get('jwt.refreshTokenExpires') /*process.env.REFRESH_TOKEN_EXPIRES*/ }
  );
};
