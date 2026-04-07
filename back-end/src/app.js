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
import { checkOrigin } from "./middlware/origin.js";

const allowedOrigins = ["http://127.0.0.1:5500", "http://localhost:5500"];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(checkOrigin)
app.use(express.json());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
/* app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET , PUT , POST , DELETE , PATCH");
  res.setHeader("Access-Control-Allow-Headers", "Content-type , Authorization");
  next();
});*/
app.use(cookieParser());
app.use(reqContext);
app.use(httpLogger);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use(errorHandler);

export default app;
