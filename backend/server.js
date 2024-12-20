import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import fs from "fs";
import path from "path";
import soap from "soap";
import bodyParser from "body-parser";
import connectDB from "./lib/connectDB.js";
import globalError from "./middlewares/globalError.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import notificationRoutes from "./routes/notification.route.js";
import connectionsRoutes from "./routes/connection.route.js";
import userService from "./soap/user.service.js";
import { fileURLToPath } from "url";

// Configurations
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// File path setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.raw({ type: () => true, limit: "5mb" }));
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/connections", connectionsRoutes);
app.use(globalError);

// SOAP Service Setup
const wsdl = fs.readFileSync(path.join(__dirname, "./soap/user.wsdl"), "utf8");
soap.listen(app, "/soap/user", userService, wsdl, () => {
  console.log("SOAP UserService is running at /soap/user");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
