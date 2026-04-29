import Food from "../models/food.models.js";
import Restaurant from "../models/restaurant.models.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

export const addFood = async (req, res) => {
  try {
    const { name, price, description, restaurantId } = req.body;

    // 🔐 check restaurant exists & belongs to user
    const restaurant = await Restaurant.findOne({
      _id: restaurantId,
      owner: req.user._id,
    });

    if (!restaurant) {
      return res.status(403).json({
        success: false,
        message: "Not authorized for this restaurant",
      });
    }

    // 📸 image required
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Food image is required",
      });
    }

    // upload image
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "food_items",
    });

    fs.unlink(req.file.path, () => {});

    const food = await Food.create({
      name,
      price,
      description,
      image: uploadResult.secure_url,
      restaurantId,
    });

    return res.status(201).json({
      success: true,
      message: "Food added successfully",
      data: food,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getFoodByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const foods = await Food.find({ restaurantId });

    return res.status(200).json({
      success: true,
      data: foods,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const updateFood = async (req, res) => {
  try {
    const { foodId } = req.params;
    const { name, price, description, isAvailable } = req.body;

    const food = await Food.findById(foodId);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    // check restaurant ownership
    const restaurant = await Restaurant.findOne({
      _id: food.restaurantId,
      owner: req.user._id,
    });

    if (!restaurant) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    food.name = name || food.name;
    food.price = price || food.price;
    food.description = description || food.description;
    food.isAvailable = isAvailable ?? food.isAvailable;

    await food.save();

    return res.status(200).json({
      success: true,
      message: "Food updated successfully",
      data: food,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const deleteFood = async (req, res) => {
  try {
    const { foodId } = req.params;

    const food = await Food.findById(foodId);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    const restaurant = await Restaurant.findOne({
      _id: food.restaurantId,
      owner: req.user._id,
    });

    if (!restaurant) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    await food.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Food deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};