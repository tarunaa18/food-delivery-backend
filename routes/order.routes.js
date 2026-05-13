import express from "express";
import { 
  createOrder, 
  getMyOrders, 
  updateOrderStatus, 
  getAllOrders,
  getOrderById
} from "../controllers/order.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.get("/my", verifyJWT, getMyOrders);

router.get("/", verifyJWT, getAllOrders);

router.post("/", verifyJWT, createOrder);

router.put("/:id/status", verifyJWT, updateOrderStatus);

router.get("/:id", verifyJWT, getOrderById);

export default router;