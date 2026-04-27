import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 4.0
  },
  image: {
    type: String
  },
  owner: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
}
}, { timestamps: true });

export default mongoose.model("Restaurant", restaurantSchema);