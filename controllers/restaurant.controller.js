import Restaurant from "../models/restaurant.models.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

// 🟢 ADD RESTAURANT (ADMIN ONLY)
export const addRestaurant = async (req, res) => {
  try {
    // 🔐 0. Role Check (IMPORTANT)
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    const { name, address, rating } = req.body;

    // ✅ 1. Validation
    if (!name || !address) {
      return res.status(400).json({
        success: false,
        message: "Name and address are required",
      });
    }

    // ✅ 2. Rating validation
    if (rating && (rating < 0 || rating > 5)) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 0 and 5",
      });
    }

    // ✅ 3. File check
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Restaurant image is required",
      });
    }

    let uploadResult;

    // ✅ 4. Upload to Cloudinary safely
    try {
      uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "food_restaurants",
      });
    } catch (err) {
      fs.unlink(req.file.path, () => {});
      throw err;
    }

    // ✅ 5. Delete local file (safe)
    fs.unlink(req.file.path, (err) => {
      if (err) console.log("File delete error:", err);
    });

    // ✅ 6. Save to DB
   
    const restaurant = await Restaurant.create({
  name,
  address,
  rating,
  image: uploadResult.secure_url,
  owner: req.user.id,
});

    // ✅ 7. Response
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


// 🟢 GET RESTAURANTS
export const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find()
      .select("name address rating image")
      .sort({ createdAt: -1 });

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