
import Order from "../models/order.models.js";

// 🟢 CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    const { items, restaurant, totalAmount, deliveryAddress } = req.body;

    // basic validation
    if (!items || !restaurant || !totalAmount || !deliveryAddress) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const order = await Order.create({
      user: req.user._id, // comes from auth middleware
      items,
      restaurant,
      totalAmount,
      deliveryAddress
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 🟢 GET MY ORDERS
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.food")
      .populate("restaurant")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
/*
// 🟢 UPDATE ORDER STATUS
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    order.status = status;

    await order.save();

    res.json({
      success: true,
      message: "Order status updated",
      order
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};*/

// 🟢 UPDATE ORDER STATUS
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    order.status = status;

    await order.save();

    // ✅ get io
    const io = req.app.get("io");

    // 🔥 send update ONLY to this order room
    io.to(order._id.toString()).emit("orderUpdated", order);

    res.json({
      success: true,
      message: "Order status updated",
      order
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};