import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true
    },

    deliveryAgentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    currentLocation: {
      lat: {
        type: Number,
        default: 0
      },
      lng: {
        type: Number,
        default: 0
      }
    },

    status: {
      type: String,
      enum: [
        "assigned",
        "picked_up",
        "out_for_delivery",
        "delivered"
      ],
      default: "assigned"
    }
  },
  { timestamps: true }
);

const Delivery = mongoose.model("Delivery", deliverySchema);

export default Delivery;