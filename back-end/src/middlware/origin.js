const allowedOrigin = ["http://127.0.0.1:5500", "http://localhost:5500"];

export const checkOrigin = (req, res, next) => {
  const origin = req.headers.origin;

  if (!origin || origin !== allowedOrigin) {
    return res.status(403).json({ message: "Blocked by CORS" });
  }

  next();
};
