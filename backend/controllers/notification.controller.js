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
    const { notificationId } = req.params;

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

export const markAllNotificationsAsRead = expressAsyncHandler(
  async (req, res, next) => {
    const currentUserId = req.user._id;

    const notifications = await Notification.updateMany(
      { recipient: currentUserId },
      { read: true },
      { new: true }
    );
    if (!notifications)
      return next(
        new appError("Notifications not found", 404, httpStatus.FAILED)
      );

    res.status(200).json({
      status: httpStatus.SUCCESS,
      message: "All notifications marked as read successfully",
      data: notifications,
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
