import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import connectDB from "./lib/connectDB.js";
import globalError from "./middlewares/globalError.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT || 5000;

app.use("/api/v1/auth", authRoutes);
app.use(globalError);

app.listen(PORT, () => {
  console.log("Server is running on port 5000");
  connectDB();
});
