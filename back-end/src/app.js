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
import xssClean from "xss-clean";
import compression from "compression"

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
app.use(compression())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(xssClean());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: ["*"],
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(cookieParser());
app.use(reqContext);
app.use(httpLogger);
app.get("/test" , (req,res ,next)=>{
  res.send("Hi im test running nodejs")
})
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use(errorHandler);

export default app;
