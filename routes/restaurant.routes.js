import express from "express";
import {  getRestaurants,updateRestaurant } from "../controllers/restaurant.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js"; // Auth middleware
import upload from "../middlewares/upload.middlewares.js"; // File upload middleware

const router = express.Router();


// Get all restaurants (public)
router.get("/", getRestaurants);

// Update restaurant (only owner can update)
router.put("/", verifyJWT, upload.single("image"), updateRestaurant);

export default router;