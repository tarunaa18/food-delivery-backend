import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  items: [
    {
      food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Food"
      },
      quantity: Number
    }
  ],
  totalPrice: Number,
  status: {
    type: String,
    enum: ["placed", "preparing", "out_for_delivery", "delivered"],
    default: "placed"
  }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);