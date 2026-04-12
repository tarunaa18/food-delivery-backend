import dotenv from "dotenv";
import { app } from "./server.js";
import connectDB from "./db/connectDB.js";

dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    app.on("error", (error) => {
      console.error("❌ Server error:", error);
      throw error;
    });
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err);
  });