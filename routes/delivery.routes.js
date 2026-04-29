import express from "express";
import { assignDeliveryAgent } from "../controllers/delivery.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post("/assign", verifyJWT, assignDeliveryAgent);

export default router;