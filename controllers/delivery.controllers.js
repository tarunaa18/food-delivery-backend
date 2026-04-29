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

    // 2. Create delivery entry
    const delivery = await Delivery.create({
      orderId,
      deliveryAgentId,
      status: "assigned"
    });

    // 3. Update order status
    order.status = "out_for_delivery";
    await order.save();

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