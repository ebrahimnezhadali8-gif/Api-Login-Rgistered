import { v4 as uuid } from "uuid";

export default function reqContext(req, res, next) {
  req.requestId = req.headers["x-request-id"] || uuid(); // req header front or generate id uuid
  next();
}