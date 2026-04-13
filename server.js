import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Routes
import authRoutes from "./routes/user.routes.js";
import orderRoutes from "./routes/order.routes.js";
import restaurantRoutes from "./routes/restaurant.routes.js";
import foodRoutes from "./routes/food.routes.js";

const app = express();

// ✅ CLEAN CORS (same as your other project)
/*app.use(
  cors({
    origin: [process.env.dev_cors_origin, process.env.prod_cors_origin],
    credentials: true,
  })
);*/
/*app.use(cors(

  {
  credentials: true,
}
));*/
app.use(cors({
  origin: "true", // frontend URL
  credentials: true
}));


// Middlewares
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Test Route
app.get("/api/v1/test", (req, res) => {
  res.json({ message: "API working fine!" });
});

// Routes (kept same, just versioned like your other project)
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/restaurants", restaurantRoutes);
app.use("/api/v1/foods", foodRoutes);
app.use("/api/v1/orders", orderRoutes);

export { app };