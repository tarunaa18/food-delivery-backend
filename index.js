import "dotenv/config";

import http from "http";
import { Server } from "socket.io";

import { app } from "./server.js";

import connectDB from "./db/connectDB.js";
import "./config/cloudinary.js";

import "./config/redis.js";
import redisClient from "./config/redis.js";

const PORT = process.env.PORT || 5000;

/* ---------------- HTTP SERVER ---------------- */
const server = http.createServer(app);

/* ---------------- SOCKET.IO ---------------- */
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    },
});

app.set("io", io);

/* ---------------- LIVE TRACKING ---------------- */
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinRoom", (roomId) => {
        socket.join(roomId);
    });

    socket.on("sendLocation", async ({ driverId, orderId, lat, lng }) => {
        try {
            await redisClient.set(
                `driver:${driverId}:location`,
                JSON.stringify({
                    lat,
                    lng,
                    updatedAt: Date.now(),
                })
            );

            io.to(orderId).emit("driverLocationUpdate", {
                driverId,
                orderId,
                lat,
                lng,
                updatedAt: Date.now(),
            });

        } catch (err) {
            console.log("Location error:", err);
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

/* ---------------- START SERVER ---------------- */
connectDB()
    .then(() => {
        server.listen(PORT, "0.0.0.0", () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("DB Error:", err);
    });