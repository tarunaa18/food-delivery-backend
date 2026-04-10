import Restaurant from "../models/restaurant.models.js";

// 🟢 ADD RESTAURANT
export const addRestaurant = async (req, res) => {
  try {
    const { name, address, rating, image } = req.body;

    const restaurant = await Restaurant.create({
      name,
      address,
      rating,
      image
    });

    res.status(201).json({
      success: true,
      message: "Restaurant added",
      data: restaurant
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 🔵 GET ALL RESTAURANTS
export const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();

    res.json({
      success: true,
      data: restaurants
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};