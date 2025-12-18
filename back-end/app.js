import cors from "cors";
import express from "express";
const app = express();
import userRouter from "./routers/user-router.js";
import errorHandler from "./middlware/error_handler.js";

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Login API is running...");
});
app.use("/api/users", userRouter);
app.use(errorHandler);

export default app;
