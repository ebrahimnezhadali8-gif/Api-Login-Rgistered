import rateLimit from "express-rate-limit";

export const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: "تعداد تلاش بیش از حد مجاز است، بعداً دوباره امتحان کنید",
  },
});