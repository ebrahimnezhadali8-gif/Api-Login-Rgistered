import mysql from "mysql2";
//import dotenv from "dotenv";
//dotenv.config();
import config from "config";

export const pool = mysql
  .createPool({
    host: config.get('database.host'),
    user: config.get('database.username'),
    password: config.get('database.password'),
    database: config.get('database.database'),
  })
  .promise();
