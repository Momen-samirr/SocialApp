import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./lib/connectDB.js";
import globalError from "./middlewares/globalError.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import notificationRoutes from "./routes/notification.route.js";
import connectionsRoutes from "./routes/connection.route.js";

dotenv.config();
const app = express();
const PORT = process.env.REST_PORT || 5000;

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/connections", connectionsRoutes);
app.use(globalError);

app.use("/api/test", (req, res) => {
  res.send("Test");
});

app.listen(PORT, () => {
  console.log(`REST API is running on port ${PORT}`);
  connectDB();
});
