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


  /*
  import "dotenv/config";
import connectDB from "./db/connectDB.js";
import { app } from "./server.js";
import "./config/cloudinary.js";

const PORT = process.env.PORT || 3000;

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
/*
  import "dotenv/config";
import connectDB from "./db/connectDB.js";
import { app } from "./server.js";
import "./config/cloudinary.js";

import http from "http";
import { Server } from "socket.io";

const PORT = process.env.PORT || 3000;

// create server
const server = http.createServer(app);

// attach socket
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
});

// socket connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// DB + server start
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server running with Socket.IO on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err);
  });*/

  import "dotenv/config";
import connectDB from "./db/connectDB.js";
import { app } from "./server.js";
import "./config/cloudinary.js";

import http from "http";
import { Server } from "socket.io";

const PORT = process.env.PORT || 3000;

// create server
const server = http.createServer(app);

// attach socket
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
});
app.set("io", io);
// socket connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // join room (using any id you pass from frontend)
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room: ${roomId}`);
  });

  // send live data (location / message etc.)
  socket.on("sendData", ({ roomId, data }) => {
    io.to(roomId).emit("receiveData", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// DB + server start
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server running with Socket.IO on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err);
  });
  