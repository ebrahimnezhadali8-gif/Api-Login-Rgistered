import app from "./app.js";
//import dotenv from "dotenv";
//dotenv.config();
import config from "config";

const port = config.get('app.port');
console.log(port , config.get('database.pool.idle'))
// const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`server listen in port ${port} ...!`);
});
