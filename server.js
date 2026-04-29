import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Routes
import authRoutes from "./routes/user.routes.js";
import orderRoutes from "./routes/order.routes.js";
import restaurantRoutes from "./routes/restaurant.routes.js";
import foodRoutes from "./routes/food.routes.js";
import deliveryRoutes from "./routes/delivery.routes.js";



const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ message: "API working fine!" });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/restaurants", restaurantRoutes);
app.use("/api/v1/foods", foodRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/delivery", deliveryRoutes);
export { app };