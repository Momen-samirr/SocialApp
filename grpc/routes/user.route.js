import express from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import {
  getPublicProfile,
  getSuggestionsConnections,
  updateProfile,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/suggestions", protectRoute, getSuggestionsConnections);
router.get("/:userName", protectRoute, getPublicProfile);
router.put("/profile", protectRoute, updateProfile);
export default router;
