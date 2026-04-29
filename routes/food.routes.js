/*import express from "express";
import { addFood, getFoodByRestaurant } from "../controllers/food.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js"; // Auth middleware
import upload from "../middlewares/upload.middlewares.js"; // File upload middleware

const router = express.Router();

// Only logged-in users can add food, image uploaded
router.post("/", verifyJWT, upload.single("image"), addFood);

// Get all foods for a restaurant (public route, no auth needed)
router.get("/:restaurantId", getFoodByRestaurant);*/
import express from "express";
import {
  addFood,
  getFoodByRestaurant,
  
  updateFood,
  deleteFood
} 
from "../controllers/food.controllers.js";

import { verifyJWT } from "../middlewares/auth.middlewares.js";
import upload from "../middlewares/upload.middlewares.js";

const router = express.Router();

// 🟢 Add food (admin/restaurant owner)
router.post("/add", verifyJWT, upload.single("image"), addFood);

// 🟢 Get food by restaurant
router.get("/restaurant/:restaurantId", getFoodByRestaurant);


// 🟢 Update food
router.put("/update/:foodId", verifyJWT, updateFood);

// 🟢 Delete food
router.delete("/delete/:foodId", verifyJWT, deleteFood);

export default router;