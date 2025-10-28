import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { PrismaClient } from "@prisma/client";

import adminRouter from "./routes/admin.js";
import userRouter from "./routes/user.js";
import courseRouter from "./routes/course.js";

const app = express();
const prisma = new PrismaClient();

// ------------------------
// Middleware
// ------------------------
app.use(cors({
  origin: process.env.FRONTEND_URL || "*", // Allow frontend URL if defined
  credentials: true,
}));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// ------------------------
// Routes
// ------------------------
app.use("/admin", adminRouter);
app.use("/user", userRouter);
app.use("/course", courseRouter);

// ------------------------
// Health Check Route
// ------------------------
app.get("/", (req, res) => {
  res.json({ message: "✅ Server is running successfully!" });
});

// ------------------------
// Global Error Handler
// ------------------------
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({ message: "Internal server error", error: err.message });
});

// ------------------------
// Start Server
// ------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// ------------------------
// Graceful Shutdown
// ------------------------
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("🛑 Prisma disconnected. Server shutting down.");
  process.exit(0);
});

export { prisma };
