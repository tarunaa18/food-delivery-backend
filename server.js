/*import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Routes 
//import authRoutes from "./routes/auth.routes.js";
//import orderRoutes from "./routes/order.routes.js";
import restaurantRoutes from "./routes/restaurant.routes.js";
import foodRoutes from "./routes/food.routes.js";

// Load env
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

// API Routes
//app.use("/api/auth", authRoutes);
//app.use("/api/orders", orderRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/foods", foodRoutes);



// Port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});*/

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// Routes
import authRoutes from "./routes/user.routes.js";
import orderRoutes from "./routes/order.routes.js";
import restaurantRoutes from "./routes/restaurant.routes.js";
import foodRoutes from "./routes/food.routes.js";



// Middlewares
//import { errorHandler } from "./middlewares/error.middleware.js";

// Load environment variables
dotenv.config();

const app = express();

// --------------------
// Global Middlewares
// --------------------
app.use(cors());                       // Handle CORS
app.use(express.json());                // Parse JSON
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(cookieParser());                // Parse cookies

// --------------------
// Test Route
// --------------------
app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

// --------------------
// API Routes
// --------------------
app.use("/api/auth", authRoutes);              // Public: register/login
         // Protected via middleware inside routes
app.use("/api/restaurants", restaurantRoutes);// Protected for adding restaurant
app.use("/api/foods", foodRoutes);            // Protected for adding food
app.use("/api/orders", orderRoutes);
// --------------------
// MongoDB Connection
// --------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log("MongoDB Connection Error:", err));

// --------------------
// Error Handling Middleware
// --------------------
//app.use(errorHandler); // catches errors from all routes/controllers

// --------------------
// Start Server
// --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});