import express from "express";
import {
  getMyRestaurant,
  updateRestaurant,
  getRestaurants
} from "../controllers/restaurant.controller.js";

import { verifyJWT } from "../middlewares/auth.middlewares.js";
import upload from "../middlewares/upload.middlewares.js";

const router = express.Router();

// 🟢 Get logged-in admin's restaurant (dashboard)
router.get("/my", verifyJWT, getMyRestaurant);

// 🟢 Update restaurant (complete profile + image upload)
router.put(
  "/update",
  verifyJWT,
  upload.single("image"),
  updateRestaurant
);

// 🟢 Get all restaurants (public/customer side)
router.get("/all", getRestaurants);

// 🔚 Export router
export default router;