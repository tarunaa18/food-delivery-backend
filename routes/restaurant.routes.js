import express from "express";
import { addRestaurant, getRestaurants } from "../controllers/restaurant.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js"; // Auth middleware
import upload from "../middlewares/upload.middlewares.js"; // File upload middleware

const router = express.Router();

// Only logged-in admins can add restaurant
router.post("/", verifyJWT, upload.single("image"), addRestaurant);

// Get all restaurants (public)
router.get("/", getRestaurants);

export default router;