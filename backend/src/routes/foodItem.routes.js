import express from "express";
import { createFood, getFood } from "../controllers/foodItem.controller.js";
import { authFoodPartnerMiddleware } from "../middleware/auth.middleware.js";
import { autheUserMiddleware } from "../middleware/auth.middleware.js";
import multer from "multer";

const uploads = multer({
  storage: multer.memoryStorage(),
});

const router = express.Router();

router.post(
  "/create",
  authFoodPartnerMiddleware,
  uploads.single("video"),
  createFood
);

router.get('/get',autheUserMiddleware,getFood)

export default router;
