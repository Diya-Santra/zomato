import express from "express";
import { autheUserMiddleware } from "../middleware/auth.middleware.js";
import { getFoodPartnerById } from "../controllers/foodPartner.controller.js";


const router=express.Router()

router.get("/:id",getFoodPartnerById)

export default router
//autheUserMiddleware