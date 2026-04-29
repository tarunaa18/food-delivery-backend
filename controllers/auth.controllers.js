import User from "../models/user.models.js";
import Restaurant from "../models/restaurant.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// 🔵 REGISTER USER
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 🔍 Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🆕 Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    let restaurantId = null;

    // 🏪 CREATE RESTAURANT ONLY IF ADMIN
    if (role === "admin") {
      const restaurant = await Restaurant.create({
        name: `${name}'s Restaurant`,
        address: "Not provided",
        rating: 0,
        image: "",
        owner: user._id,
      });

      restaurantId = restaurant._id;
    }

    // 🔑 Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ Send response
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        restaurantId, // 🔥 important
      },
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔍 Check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 🔐 Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 🔑 Token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 🏪 Check if this user owns a restaurant
    const restaurant = await Restaurant.findOne({ owner: user._id });

    let restaurantId = null;

    if (restaurant) {
      restaurantId = restaurant._id;
    }

    // ✅ Response
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        restaurantId, // 🔥 this decides frontend page
      },
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


