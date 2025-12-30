import { pool } from "../utilites/db.js";

class TokenModel {
  static getTokenInUserId = async (user_id) => {
    const [result] = await pool.query(`call get_token_user_id(?)`, [user_id]);
    return result[0];
  };
  static insertToken = async (user_id, token, time_expires) => {
    const result = await pool.query(`call insert_token(? ,? ,?)`, [
      user_id,
      token,
      time_expires,
    ]);
    return result;
  };
  static deleteToken = async (id) => {
    const result = await pool.query(`call delete_token(?)`, [id]);
    return result;
  };
}
export default TokenModel;
