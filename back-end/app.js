import cors from "cors";
import express from "express";
const app = express();
import userRouter from "./routers/user-router.js";
import errorHandler from "./middlware/error_handler.js";
import reqContext from "./middlware/req-context.js";
import { httpLogger } from "./middlware/http-log.js";

app.use(cors());
app.use(express.json());
app.use(reqContext);
app.use(httpLogger);
app.get("/", (req, res) => {
  res.send("Login API is running...");
});
app.use("/api/auth", userRouter);
app.use(errorHandler);

export default app;
