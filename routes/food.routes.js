import express from "express";
import { addFood, getFoodByRestaurant } from "../controllers/food.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js"; // Auth middleware
import upload from "../middlewares/upload.middlewares.js"; // File upload middleware

const router = express.Router();

// Only logged-in users can add food, image uploaded
router.post("/", verifyJWT, upload.single("image"), addFood);

// Get all foods for a restaurant (public route, no auth needed)
router.get("/:restaurantId", getFoodByRestaurant);

export default router;