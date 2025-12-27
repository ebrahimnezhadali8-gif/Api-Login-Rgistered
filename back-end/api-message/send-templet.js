import axios from "axios";
import qs from "qs";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const apikey = process.env.API_KEY;
const url = "http://api.ghasedaksms.com/v2/send/verify";

// function send code OTP with difrent templet 
export const sendOtp = async (phone, code, type) => {
  const templateId =
    type === "login"
      ? process.env.LOGIN_TEMPLATE_ID
      : process.env.VERIFY_TEMPLATE_ID;
  try {
    const response = await axios.post(
      url,
      qs.stringify({
        receptor: phone,
        type: 1,
        template: templateId,
        param1: code,
      }),
      {
        headers: {
          apikey: apikey,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    console.log("پیامک ارسال شد:", response.data);
  } catch (error) {
    console.log("خطا در ارسال پیامک:", error.response?.data || error.message);
  }
};


