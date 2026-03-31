import app from "./app.js";
//import dotenv from "dotenv";
//dotenv.config();
import config from "./config/index.js";

console.log( config.app, config.database.pool)
const port = config.app.port;

// const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`server listen in port ${port} ...!`);
});
