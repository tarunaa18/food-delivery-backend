import Food from "../models/food.models.js";
import Restaurant from "../models/restaurant.models.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

// 🟢 ADD FOOD (ADMIN ONLY)
export const addFood = async (req, res) => {
  try {
    // 🔐 1. Admin check
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    const { name, price, description } = req.body;

    // ✅ 2. Validation
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: "Name and price are required",
      });
    }

    // 🔍 3. Get admin's restaurant
    const restaurant = await Restaurant.findOne({ owner: req.user.id });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "No restaurant found for this admin",
      });
    }

    // ☁️ 4. Upload image to Cloudinary
    let imageUrl = "";

    if (req.file) {
      try {
        const upload = await cloudinary.uploader.upload(req.file.path, {
          folder: "food_items",
        });

        imageUrl = upload.secure_url;

        // 🗑️ delete temp file
        fs.unlink(req.file.path, () => {});
      } catch (err) {
        fs.unlink(req.file.path, () => {});
        throw err;
      }
    }

    // 🆕 5. Create food item
    const food = await Food.create({
      name,
      price,
      description,
      image: imageUrl,
      restaurantId: restaurant._id,
    });

    // ✅ 6. Response
    res.status(201).json({
      success: true,
      message: "Food item added successfully",
      data: food,
    });

  } catch (error) {
    console.error("ADD FOOD ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};


// 🔵 GET FOOD BY RESTAURANT
export const getFoodByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    if (!restaurantId) {
      return res.status(400).json({
        success: false,
        message: "Restaurant ID is required",
      });
    }

    const foods = await Food.find({ restaurantId });

    res.status(200).json({
      success: true,
      data: foods,
    });

  } catch (error) {
    console.error("GET FOOD ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};