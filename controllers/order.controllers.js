import Order from "../models/order.models.js";
import Restaurant from "../models/restaurant.models.js";

export const createOrder = async (req, res) => {
  try {
    const { items, restaurant, totalAmount, deliveryAddress, deliveryLocation } = req.body;
    
    if (!items || !restaurant || !totalAmount || !deliveryAddress) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    const isSingleRestaurant = items.every(item => {
        return true;
    });

    if (!isSingleRestaurant) {
      return res.status(400).json({ 
        success: false, 
        message: "You can only order from one restaurant at a time." 
      });
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      restaurant, // The specific restaurant ID for this order
      totalAmount,
      deliveryAddress,
      deliveryLocation
    });

    const populatedOrder = await Order.findById(order._id)
      .populate("restaurant")
      .populate("items.food")
      .populate("user", "name");

    const io = req.app.get("io");
    if (io) {
      io.to(restaurant.toString()).emit("newOrderPlaced", populatedOrder);
      io.to("delivery_partners").emit("availableOrder", populatedOrder);
    }
    
    res.status(201).json({ success: true, message: "Order placed successfully", data: populatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🟢 UPDATE ORDER STATUS (Modified to track Delivery Partner)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    // 🟢 Fix: Saves current driver ID so stats appear in their dashboard
    if (req.user.role === 'delivery' || req.user.role === 'driver') {
      order.deliveryPartner = req.user._id;
    }

    order.status = status;
    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate("restaurant")
      .populate("user", "name");

    const io = req.app.get("io");
    if (io) {
      io.to(order._id.toString()).emit("orderUpdated", updatedOrder);
      io.to("delivery_partners").emit("orderUpdated", updatedOrder);
    }

    res.json({ success: true, message: "Order status updated", data: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🟢 GET ALL ORDERS (Modified for History/Stats)
export const getAllOrders = async (req, res) => {
  try {
    const isDeliveryPartner = req.user.role === 'delivery' || req.user.role === 'driver';

    if (isDeliveryPartner) {
      const { type } = req.query;

      // 🟢 NEW: Logic for the Stats/History dashboard
      if (type === 'history') {
        const history = await Order.find({ 
          deliveryPartner: req.user._id, 
          status: 'delivered' 
        })
        .populate("restaurant")
        .sort({ updatedAt: -1 });

        return res.json({ success: true, data: history });
      }

      // Default: Find available pickups
      const availableOrders = await Order.find({ status: 'preparing' })
      .populate("items.food")
      .populate("restaurant")
      .populate("user", "name")
      .sort({ createdAt: -1 });

      return res.json({ success: true, data: availableOrders });
    }

    const myRestaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!myRestaurant) {
      return res.status(404).json({ success: false, message: "Restaurant profile not found." });
    }

    const orders = await Order.find({ restaurant: myRestaurant._id })
      .populate("items.food")
      .populate("restaurant")
      .populate("user", "name") 
      .sort({ createdAt: -1 });

    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// order.controllers.js

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("restaurant") // 🟢 Only populate restaurant to stop the 500 crashes
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders // 🟢 MUST use 'data' key to match TrackOrder.jsx
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 🟢 GET ORDER BY ID (Kept as is)
// order.controllers.js

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("restaurant")      
      .populate("user", "name");   

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // 🟢 DEBUG LOG: Check your terminal! 
    // If you don't see 'deliveryLocation' here, the frontend will crash.
    console.log("📍 Order Location Data:", order.deliveryLocation);

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};