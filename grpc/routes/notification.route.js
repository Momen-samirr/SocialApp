import express from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import {
  deleteNotification,
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", protectRoute, getNotifications);
router.put("/:notificationId/markAsRead", protectRoute, markNotificationAsRead);
router.put("/markAllAsRead", protectRoute, markAllNotificationsAsRead);
router.delete("/:id", protectRoute, deleteNotification);

export default router;
