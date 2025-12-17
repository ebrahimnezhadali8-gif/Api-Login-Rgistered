import { pool } from "../utilites/db.js";
import { v4 as uuidv4 } from "uuid";

class UserModel {
  static getUserPhone = async (phone) => {
    const [result] = await pool.query(`call get_user_phone(?)`, [phone]);
    return result[0];
  };
  static addUser = async (name, phone, password) => {
    const id = uuidv4(); //create uuid
    const result = await pool.query(`call insert_user(?,?,?,?)`, [
      id,
      name,
      phone,
      password,
    ]);
    return result;
  };
}

export default UserModel;
