import rateLimit from "express-rate-limit";

// all limiters
const baseLimiter = {
  standardHeaders: true,
  legacyHeaders: false,
};

// Register limiter
export const registerLimiter = rateLimit({
  ...baseLimiter,
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    status: 429,
    message: "تعداد تلاش بیش از حد مجاز است، بعداً دوباره امتحان کنید",
  },
});

// Login limiter
export const loginLimiter = rateLimit({
  ...baseLimiter,
  windowMs: 2 * 60 * 1000,
  max: 7,
  message: {
    status: 429,
    message: "تعداد تلاش بیش از حد مجاز است، بعداً دوباره امتحان کنید",
  },
});

// Limited by phone number (fallback to IP)
export const otpLimiter = rateLimit({
  ...baseLimiter,
  windowMs: 2 * 60 * 1000,
  max: 3,
  keyGenerator: (req) => req.body.phone || req.ip,
  message: {
    status: 429,
    message: "تعداد تلاش بیش از حد مجاز است، بعداً دوباره امتحان کنید",
  },
});

// Prevents OTP spam
export const otpResendLimiter = rateLimit({
  ...baseLimiter,
  windowMs: 2 * 60 * 1000,
  max: 3,
  keyGenerator: (req) => req.body.phone || req.ip,
  message: {
    status: 429,
    message: "تعداد تلاش بیش از حد مجاز است، بعداً دوباره امتحان کنید",
  },
});

// Forgot password OTP limiter
export const otpForgotLimiter = rateLimit({
  ...baseLimiter,
  windowMs: 2 * 60 * 1000,
  max: 3,
  keyGenerator: (req) => req.body.phone || req.ip,
  message: {
    status: 429,
    message: "تعداد تلاش بیش از حد مجاز است، بعداً دوباره امتحان کنید",
  },
});

// Change password limiter
export const changePasswordLimiter = rateLimit({
  ...baseLimiter,
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    status: 429,
    message: "تعداد تلاش بیش از حد مجاز است، بعداً دوباره امتحان کنید",
  },
});

export const TokenLimiter = rateLimit({
  ...baseLimiter,
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    status: 429,
    message: "تعداد تلاش بیش از حد مجاز است، بعداً دوباره امتحان کنید",
  },
});
