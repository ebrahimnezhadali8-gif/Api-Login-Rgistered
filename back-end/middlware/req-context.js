import { v4 as uuid } from "uuid";

export default function reqContext(req, res, next) {
  req.requestId = req.headers["x-request-id"] || uuid(); // اگر کلاینت requestId داد استفاده کن
  next();
}