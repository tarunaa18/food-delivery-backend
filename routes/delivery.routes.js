import express from "express";
import { assignDeliveryAgent,updateDeliveryLocation,updateDeliveryStatus } from "../controllers/delivery.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post("/assign", verifyJWT, assignDeliveryAgent);
router.put("/location", verifyJWT, updateDeliveryLocation);
router.put("/status", verifyJWT, updateDeliveryStatus);

export default router;