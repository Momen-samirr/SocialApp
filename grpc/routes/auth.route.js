import express from "express";
import {
  getCurrentUser,
  logIn,
  logOut,
  signUp,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/protectRoute.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", logIn);
router.post("/logout", logOut);
router.get("/me", protectRoute, getCurrentUser);
export default router;
