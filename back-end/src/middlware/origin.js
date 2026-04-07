const allowedOrigin = "http://127.0.0.1:5500";

export const checkOrigin = (req, res, next) => {
  const origin = req.headers.origin;
  console.log(origin);
  if (!origin || !allowedOrigin.includes(origin)) {
    return res
      .status(403)
      .json({ message: "شما اجازه درخواست به سرور را ندارید" });
  }

  next();
};
