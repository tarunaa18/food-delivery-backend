/*import "dotenv/config"; // ONLY ONCE, FIRST LINE

import connectDB from "./db/connectDB.js";
import { app } from "./server.js";
import "./config/cloudinary.js"; // init after env

const PORT = process.env.PORT || 5000;

//console.log("CLOUDINARY KEY:", process.env.CLOUDINARY_API_KEY);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err);
  });*/
  import "dotenv/config";
import connectDB from "./db/connectDB.js";
import { app } from "./server.js";
import "./config/cloudinary.js";

const PORT = process.env.PORT || 3000;

console.log("CLOUDINARY KEY:", process.env.CLOUDINARY_API_KEY);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err);
  });