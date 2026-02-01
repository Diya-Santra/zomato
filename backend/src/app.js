import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import foodItemRoutes from "./routes/foodItem.routes.js";
import foodPartnerRoutes from "./routes/foodPartner.routes.js"
import cors from "cors";

const app = express();
app.use(cors())
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/auth/foodItem", foodItemRoutes);
app.use("/auth/food-partner",foodPartnerRoutes)


app.get("/", (req, res) => {
  res.send("Hello World");
});



export default app;
