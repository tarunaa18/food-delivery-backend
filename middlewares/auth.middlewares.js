/*import User from "../models/user.models.js";
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
};*/



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

    // 1. Verify the token using your real secret from .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 2. 🟢 FIXED: Look for the ID in both common formats (_id or id)
    // This ensures that no matter how the login signed the token, we find the user.
    const userId = decoded._id || decoded.id;

    const user = await User.findById(userId).select(
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
    // This happens if the secret is wrong or the token is expired
    return res.status(403).json(
      ApiResponse(403, "Unauthorized request", "Failed")
    );
  }
};