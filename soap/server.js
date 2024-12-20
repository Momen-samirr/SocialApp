import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import soap from "soap";
import userService from "./soap/user.service.js";
import { fileURLToPath } from "url";
import connectDB from "./lib/connectDB.js";

dotenv.config();
const app = express();
const PORT = process.env.SOAP_PORT || 5011;

// File path setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read WSDL file
const wsdl = fs.readFileSync(path.join(__dirname, "./soap/user.wsdl"), "utf8");

// SOAP Service Setup
soap.listen(app, "/soap/user", userService, wsdl, () => {
  console.log(
    `SOAP UserService is running at http://localhost:${PORT}/soap/user`
  );
});

// Start SOAP server
app.listen(PORT, () => {
  console.log(`SOAP Service is running on port ${PORT}`);
  connectDB();
});
