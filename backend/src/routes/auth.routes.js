import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  registerFoodPartner,
  loginFoodPartner,
  logoutFoodPartner,
} from "../controllers/auth.controller.js";
import multer from "multer";

const uploads = multer({
  storage: multer.memoryStorage(),
});

const router = express.Router();

//user auth routes
router.post("/user/register", registerUser);
router.post("/user/login", loginUser);
router.get("/user/logout", logoutUser);

//foodpartner auth routes
router.post("/food-partner/register", uploads.single("profilePic"), registerFoodPartner);
router.post("/food-partner/login", loginFoodPartner);
router.get("/food-partner/logout", logoutFoodPartner);

export default router;
