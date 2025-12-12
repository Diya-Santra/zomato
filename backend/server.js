import express from "express";
import app from "./src/app.js";
import dotenv from "dotenv";
import connectDb from "./src/db/Db.js";
import cookieParser from "cookie-parser";
import authRoutes from "./src/routes/auth.routes.js"
import foodItemRoutes from "./src/routes/foodItem.routes.js"

const dbUrl = process.env.MONGO_URL;
const PORT = process.env.PORT || 4000;

dotenv.config();
app.use(express.json())
app.use(cookieParser())




connectDb(dbUrl)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running at ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Database connection failed:", err);
  });


app.use('/auth',authRoutes)
app.use('/auth/foodItem',foodItemRoutes)