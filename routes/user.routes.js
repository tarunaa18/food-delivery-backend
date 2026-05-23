import express from "express";
import { registerUser, loginUser } from "../controllers/auth.controllers.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/test", (req, res) => {
    console.log("This is test route");
    return res.status(200).json({
        success: true,
        message: "Ping Success !",
      });
});

export default router;