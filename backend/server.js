import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import connectDb from "./src/db/Db.js";

const dbUrl = process.env.MONGO_URL;
const PORT = process.env.PORT || 4000;

connectDb(dbUrl)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running at ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Database connection failed:", err);
  });

  