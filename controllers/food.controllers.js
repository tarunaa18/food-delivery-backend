import Food from "../models/food.models.js";
// 🟢 ADD FOOD
export const addFood = async (req, res) => {
  try {
    const { name, price, description, restaurantId } = req.body;

    const image = req.file?.path; // 🔥 Cloudinary URL

    const food = await Food.create({
      name,
      price,
      description,
      image,
      restaurantId
    });

    res.status(201).json({
      success: true,
      message: "Food item added",
      data: food
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
// 🔵 GET FOOD BY RESTAURANT
export const getFoodByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const foods = await Food.find({ restaurantId });

    res.json({
      success: true,
      data: foods
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};