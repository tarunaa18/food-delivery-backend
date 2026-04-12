import Restaurant from "../models/restaurant.models.js";
//import { v2 as cloudinary } from "cloudinary";
//import cloudinary from "./config/cloudinary.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

// 🟢 CLOUDINARY CONFIG (same file style like your minor project)
/*cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});*/

// 🟢 ADD RESTAURANT
export const addRestaurant = async (req, res) => {
  try {
    const { name, address, rating } = req.body;

    // 1️⃣ Validation
    if (!name || !address) {
      return res.status(400).json({
        success: false,
        message: "Name and address are required",
      });
    }

    // 2️⃣ Check file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Restaurant image is required",
      });
    }

    // 3️⃣ Upload to Cloudinary (same pattern as your post project)
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "food_restaurants",
    });

    // 4️⃣ Delete local file
    fs.unlinkSync(req.file.path);

    // 5️⃣ Save to DB
    const restaurant = await Restaurant.create({
      name,
      address,
      rating,
      image: uploadResult.secure_url,
    });

    // 6️⃣ Response
    return res.status(201).json({
      success: true,
      message: "Restaurant added successfully",
      data: restaurant,
    });

  } catch (error) {
    console.error("ADD RESTAURANT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();

    return res.status(200).json({
      success: true,
      data: restaurants,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
