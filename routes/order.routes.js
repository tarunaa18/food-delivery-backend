import express from "express";
import { createOrder, getMyOrders,updateOrderStatus} from "../controllers/order.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = express.Router();

// 🟢 Create Order
router.post("/", verifyJWT, createOrder);


// Get My Orders
router.get("/my", verifyJWT, getMyOrders);


// 🟢 Update Order Status (for restaurant and delivery person )
router.put("/:orderId/status", verifyJWT, updateOrderStatus);

export default router;