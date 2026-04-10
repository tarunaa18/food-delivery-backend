import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order"
  },
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  currentLocation: {
    lat: Number,
    lng: Number
  },
  status: {
    type: String,
    enum: ["Assigned", "Picked", "On the Way", "Delivered"],
    default: "Assigned"
  }
}, { timestamps: true });

export default mongoose.model("Delivery", deliverySchema);