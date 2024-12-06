import expressAsyncHandler from "express-async-handler";
import Notification from "../models/notification.model.js";
import httpStatus from "../utilities/httpStatus.js";

export const getNotifications = expressAsyncHandler(async (req, res, next) => {
  const notifications = await Notification.find({ recipient: req.user._id })
    .sort({ createdAt: -1 })
    .populate("relatedUser", "name userName email profilePicure")
    .populate("relatedPost", "content image");

  res.status(200).json(notifications);
});

export const markNotificationAsRead = expressAsyncHandler(
  async (req, res, next) => {
    const notificationId = req.params.id;

    const notification = await Notification.findByIdAndUpdate(
      { _id: notificationId, recipient: req.user._id },
      { read: true },
      { new: true }
    );

    res.status(200).json({
      status: httpStatus.SUCCESS,
      message: "Notification marked as read successfully",
      data: notification,
    });
  }
);

export const deleteNotification = expressAsyncHandler(
  async (req, res, next) => {
    const notificationId = req.params.id;

    await Notification.findOneAndDelete({
      _id: notificationId,
      recipient: req.user._id,
    });

    res.status(200).json({
      status: httpStatus.SUCCESS,
      message: "Notification deleted successfully",
    });
  }
);
