import { getFoodPartnerById, updateProfilePic } from "../controllers/foodPartner.controller.js";
import { authFoodPartnerMiddleware } from "../middleware/auth.middleware.js";
import multer from "multer";
import express from "express"

const uploads = multer({
    storage: multer.memoryStorage(),
});

const router = express.Router()

router.get("/:id", getFoodPartnerById)
router.put("/update-pfp", authFoodPartnerMiddleware, uploads.single("profilePic"), updateProfilePic)

export default router
