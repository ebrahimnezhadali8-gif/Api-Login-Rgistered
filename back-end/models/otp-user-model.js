import { pool } from "../utilites/db.js";

class OtpModel {
  static getOtp = async (user_id, type) => {
    const [result] = await pool.query(`call get_otp(?,?)`, [user_id, type]);
    return result[0];
  };
  static addOtp = async (user_id, code, type, expire) => {
    const result = await pool.query(`call insert_otp(?,?,?,?)`, [
      user_id,
      code,
      type,
      expire,
    ]);
    return result;
  };
  static updateOtp = async (user_id, type) => {
    const result = await pool.query(`call update_used_otp(?,?)`, [
      user_id,
      type,
    ]);
    return result;
  };
}

export default OtpModel;
