import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(3)
    .max(50)
    .pattern(/^[\u0600-\u06FFa-zA-Z\s]+$/)
    .required()
    .messages({
      "string.pattern.base": "نام فقط می‌تواند شامل حروف باشد",
    }),

  phone: Joi.string()
    .trim()
    .pattern(/^09\d{9}$/)
    .required()
    .messages({
      "string.pattern.base": "شماره تلفن معتبر نیست",
    }),

  password: Joi.string()
    .min(6)
    .max(64)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
    .required()
    .messages({
      "string.pattern.base":
        "رمز عبور باید شامل حرف بزرگ، حرف کوچک، عدد و کاراکتر خاص باشد",
    }),
});

export const loginSchema = Joi.object({
  phone: Joi.string()
    .trim()
    .pattern(/^09\d{9}$/)
    .required()
    .messages({
      "string.pattern.base": "شماره تلفن معتبر نیست",
    }),

  password: Joi.string()
    .min(6)
    .max(64)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
    .required()
    .messages({
      "string.pattern.base": "رمز عبور معتبر نیست",
    }),
});
