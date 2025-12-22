import rateLimit from "express-rate-limit";

export const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: "تعداد تلاش بیش از حد مجاز است، بعداً دوباره امتحان کنید",
  },
});

export const LoginLimiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 7,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: "تعداد تلاش بیش از حد مجاز است، بعداً دوباره امتحان کنید",
  },
});

export const otpLimiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: "تعداد تلاش بیش از حد مجاز است، بعداً دوباره امتحان کنید",
  },
});