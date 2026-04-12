import User from "../models/user.models.js";
import jwt from "jsonwebtoken";

const ApiResponse = (status, message, statusText, data = null) => ({
  status,
  message,
  statusText,
  data,
});

export const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(403).json(
        ApiResponse(403, "No token provided", "Failed")
      );
    }

    const decoded = jwt.verify(token, "secretkey"); // or process.env.JWT_SECRET

    const user = await User.findById(decoded.id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return res.status(403).json(
        ApiResponse(403, "Invalid token: user not found", "Failed")
      );
    }

    req.user = user;
    next();

  } catch (error) {
    return res.status(403).json(
      ApiResponse(403, "Unauthorized request", "Failed")
    );
  }
};