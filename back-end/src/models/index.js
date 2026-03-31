import Sequelize from "sequelize";
import config from "../config/index.js";
import UserModel from "./users.js";
import OtpModel from "./otp.js";

const sequelize = new Sequelize(
  config.database.database,
  config.database.username,
  config.database.password,
  config.database,
);

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = UserModel(sequelize, Sequelize);
db.Otp = OtpModel(sequelize, Sequelize);

export default db;
