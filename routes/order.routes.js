import express from "express";
import {
  placeOrder,
  getMyOrders,
  updateOrderStatus
} from "../controllers/order.controllers.js";

import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = express.Router();

// Place order
router.post("/", verifyJWT, placeOrder);

// Get logged-in user's orders
router.get("/my", verifyJWT, getMyOrders);

// Update order status
router.put("/:id", verifyJWT, updateOrderStatus);

export default router;