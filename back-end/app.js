import cors from "cors";
import express from "express";
const app = express();

app.use(cors())
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Login API is running...");
});

export default app;