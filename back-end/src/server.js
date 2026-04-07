import app from "./app.js";
//import dotenv from "dotenv";
//dotenv.config();
import config from "./config/index.js";

const port = config.app.port;

app.listen(port, "127.0.0.1", () => {
  console.log(`server listen in http://127.0.0.1:${port} `);
});
