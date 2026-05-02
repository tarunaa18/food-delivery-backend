import Delivery from "../models/delivery.models.js";
import Order from "../models/order.models.js";

// 🟢 ASSIGN DELIVERY AGENT
export const assignDeliveryAgent = async (req, res) => {
  try {
    const { orderId, deliveryAgentId } = req.body;

    // 1. Check order exists
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // 🔒 prevent duplicate assignment
    const existingDelivery = await Delivery.findOne({ orderId });

    if (existingDelivery) {
      return res.status(400).json({
        success: false,
        message: "Delivery already assigned"
      });
    }

    // 2. Create delivery entry
    const delivery = await Delivery.create({
      orderId,
      deliveryAgentId,
      status: "assigned"
    });

    // 3. Update order status
    order.status = "out_for_delivery";
    await order.save();

    // 🔥 real-time update
    const io = req.app.get("io");
    io.to(orderId.toString()).emit("deliveryAssigned", {
      orderId,
      delivery
    });

    res.json({
      success: true,
      message: "Delivery agent assigned",
      delivery
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 🟢 UPDATE DELIVERY LOCATION
export const updateDeliveryLocation = async (req, res) => {
  try {
    const { orderId, lat, lng } = req.body;

    const delivery = await Delivery.findOne({ orderId });

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found"
      });
    }

    // 1. Update location in DB
    delivery.currentLocation = { lat, lng };
    await delivery.save();

    // 2. Send real-time update
    const io = req.app.get("io");

    io.to(orderId.toString()).emit("locationUpdate", {
      lat,
      lng
    });

    res.json({
      success: true,
      message: "Location updated",
      location: delivery.currentLocation
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 🟢 UPDATE DELIVERY STATUS
export const updateDeliveryStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const delivery = await Delivery.findOne({ orderId });

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found"
      });
    }

    delivery.status = status;
    await delivery.save();

    // 🔥 real-time update
    const io = req.app.get("io");

    io.to(orderId.toString()).emit("deliveryStatusUpdate", {
      orderId,
      status
    });

    res.json({
      success: true,
      message: "Delivery status updated",
      delivery
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

