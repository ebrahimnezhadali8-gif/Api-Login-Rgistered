import cors from "cors";
import express from "express";
const app = express();
import authRouter from "./routers/auth-router.js";
import errorHandler from "./middlware/error_handler.js";
import reqContext from "./middlware/req-context.js";
import { httpLogger } from "./middlware/http-log.js";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import userRouter from "./routers/user-router.js";

app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    credentials: true,
  })
);
app.use(express.json());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(cookieParser());
app.use(reqContext);
app.use(httpLogger);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use(errorHandler);

export default app;
