import { pool } from "../utilites/db.js";

class OtpModel {
  static getOtp = async (phone, type) => {
    const [result] = await pool.query(`call get_otp(?,?)`, [phone, type]);
    return result[0];
  };
  static addOtp = async (phone, code, type, expire) => {
    const result = await pool.query(`call insert_otp(?,?,?,?)`, [
      phone,
      code,
      type,
      expire,
    ]);
    return result;
  };
  static updateOtp = async (phone, type) => {
    const result = await pool.query(`call update_used_otp(?,?)`, [
      phone,
      type,
    ]);
    return result;
  };
}

export default OtpModel;
