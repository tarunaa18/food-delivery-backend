import User from "../models/user.models.js"; // your User model
import jwt from "jsonwebtoken";

// Optional: create a helper for consistent API responses
const ApiResponse = (status, message, statusText, data = null) => ({
  status,
  message,
  statusText,
  data,
});

export const verifyJWT = async (req, res, next) => {
  try {
    // Token from cookies or Authorization header
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(403).json(ApiResponse(403, "No token provided", "Failed"));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user and exclude sensitive fields
    const user = await User.findById(decoded._id).select("-password -refreshToken");

    if (!user) {
      return res.status(403).json(ApiResponse(403, "Invalid token: user not found", "Failed"));
    }

    req.user = user; // attach user to request
    next();
  } catch (error) {
    return res.status(403).json(ApiResponse(403, "Unauthorized request", "Failed"));
  }
};