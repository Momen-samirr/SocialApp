import expressAsyncHandler from "express-async-handler";
import appError from "../utilities/appError.js";
import httpStatus from "../utilities/httpStatus.js";
import ConnectionRequest from "../models/connection.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

import dotenv from "dotenv";
dotenv.config();

import { sendConnectionAcceptedEmail } from "../mails/emailsHandler.js";

export const sendConnectionRequest = expressAsyncHandler(
  async (req, res, next) => {
    const { userId } = req.params;

    const senderId = req.user._id;

    if (senderId.toString() === userId.toString()) {
      return next(
        new appError(
          "You cannot send connection request to yourself",
          400,
          httpStatus.FAILED
        )
      );
    }

    if (req.user.connections.includes(userId)) {
      return next(
        new appError(
          "You are already connected with this user",
          400,
          httpStatus.FAILED
        )
      );
    }

    const extistingConnectionRequest = await ConnectionRequest.findOne({
      sender: senderId,
      recipient: userId,
      status: "pending",
    });

    // if (extistingConnectionRequest) {
    //   return next(
    //     new appError(
    //       "You have already sent a connection request to this user",
    //       400,
    //       httpStatus.FAILED
    //     )
    //   );
    // }

    const newConnectionRequest = new ConnectionRequest({
      sender: senderId,
      recipient: userId,
    });

    await newConnectionRequest.save();

    res.status(201).json({
      status: httpStatus.SUCCESS,
      message: "Connection request sent successfully",
      data: newConnectionRequest,
    });
  }
);

export const unSendConnectionRequest = expressAsyncHandler(
  async (req, res, next) => {
    const { userId } = req.params;
    const senderId = req.user._id;

    if (senderId.toString() === userId.toString()) {
      return next(
        new appError(
          "You cannot unsend connection request to yourself",
          400,
          httpStatus.FAILED
        )
      );
    }

    const extistingConnectionRequest = await ConnectionRequest.findOne({
      sender: senderId,
      recipient: userId,
      status: "pending",
    });

    if (!extistingConnectionRequest) {
      return next(
        new appError(
          "You have not sent a connection request to this user",
          400,
          httpStatus.FAILED
        )
      );
    }

    if (extistingConnectionRequest) {
      await ConnectionRequest.findByIdAndDelete(extistingConnectionRequest._id);
    }

    res.status(200).json({
      status: httpStatus.SUCCESS,
      message: "Connection request unsend successfully",
    });
  }
);

export const acceptConnectionRequest = expressAsyncHandler(
  async (req, res, next) => {
    const { requestId } = req.params;
    const userId = req.user._id;
    const request = await ConnectionRequest.findById(requestId)
      .populate("sender", "name userName email profilePicure")
      .populate("recipient", "name userName email profilePicure");

    if (!request) {
      return next(
        new appError("Connection request not found", 404, httpStatus.FAILED)
      );
    }

    if (request.recipient._id.toString() !== userId.toString()) {
      return next(
        new appError(
          "You are not authorized to accept this request",
          401,
          httpStatus.FAILED
        )
      );
    }

    if (request.status !== "pending") {
      return next(
        new appError(
          "This request has already been accepted",
          400,
          httpStatus.FAILED
        )
      );
    }

    request.status = "accepted";

    await request.save();

    await User.findByIdAndUpdate(userId, {
      $addToSet: { connections: request.sender._id },
    });
    await User.findByIdAndUpdate(request.sender._id, {
      $addToSet: { connections: userId },
    });

    const newNotification = new Notification({
      recipient: request.sender._id,
      type: "connectionAccepted",
      relatedUser: userId,
    });

    await newNotification.save();

    const senderEmail = request.sender.email;
    const senderName = request.sender.name;
    const recipientName = request.recipient.name;
    const profileUrl = process.env.CLIENT_URL + "/profile/" + request.userName;
    try {
      await sendConnectionAcceptedEmail(
        senderEmail,
        senderName,
        recipientName,
        profileUrl
      );
    } catch (error) {
      console.log(error);
    }
  }
);

export const rejectConnectionRequest = expressAsyncHandler(
  async (req, res, next) => {
    const { requestId } = req.params;
    const userId = req.user._id;

    const request = await ConnectionRequest.findById(requestId)
      .populate("sender", "name userName email profilePicure")
      .populate("recipient", "name userName email profilePicure");

    if (!request) {
      return next(
        new appError("Connection request not found", 404, httpStatus.FAILED)
      );
    }

    if (request.recipient._id.toString() !== userId.toString()) {
      return next(
        new appError(
          "You are not authorized to reject this request",
          401,
          httpStatus.FAILED
        )
      );
    }

    if (request.status !== "pending") {
      return next(
        new appError(
          "This request has already been rejected",
          400,
          httpStatus.FAILED
        )
      );
    }

    request.status = "rejected";

    await request.save();

    const newNotification = new Notification({
      recipient: request.sender._id,
      type: "connectionRejected",
      relatedUser: userId,
    });

    await newNotification.save();

    res.status(200).json({
      status: httpStatus.SUCCESS,
      message: "Connection request rejected successfully",
      data: request,
    });
  }
);

export const getConnectionRequests = expressAsyncHandler(
  async (req, res, next) => {
    const userId = req.user._id;

    const requests = await ConnectionRequest.find({
      recipient: userId,
      status: "pending",
    }).populate("sender", "name userName email profilePicure");

    if (!requests) {
      return next(
        new appError("No connection requests found", 404, httpStatus.FAILED)
      );
    }

    res.status(200).json({
      status: httpStatus.SUCCESS,
      message: "Connection requests fetched successfully",
      data: requests,
    });
  }
);

export const getUserConnections = expressAsyncHandler(
  async (req, res, next) => {
    const userId = req.user._id;

    const user = await User.findById(userId).populate(
      "connections",
      "name userName email profilePicure"
    );

    if (!user) {
      return next(new appError("User not found", 404, httpStatus.FAILED));
    }

    res.status(200).json({
      status: httpStatus.SUCCESS,
      message: "User connections fetched successfully",
      data: user.connections,
    });
  }
);

export const removeConnection = expressAsyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  const currentUser = req.user._id;

  await User.findByIdAndUpdate(currentUser, { $pull: { connections: userId } });
  await User.findByIdAndUpdate(userId, { $pull: { connections: currentUser } });

  res.status(200).json({
    status: httpStatus.SUCCESS,
    message: "Connection removed successfully",
  });
});

export const getConnectionStatus = expressAsyncHandler(
  async (req, res, next) => {
    const { userId: targetUserId } = req.params;
    const currentUserId = req.user._id;
    const currentUser = req.user;

    if (currentUser.connections.includes(targetUserId)) {
      res.status(200).json({
        message: httpStatus.SUCCESS,
        status: "Connected",
      });
    }

    const pendingRequest = await ConnectionRequest.findOne({
      $or: [
        { sender: currentUserId, recipient: targetUserId },
        { sender: targetUserId, recipient: currentUserId },
      ],
      status: "pending",
    });

    if (pendingRequest) {
      if (pendingRequest.sender.toString() === currentUserId.toString()) {
        return res.status(200).json({
          message: httpStatus.SUCCESS,
          status: "Pending",
        });
      } else {
        return res.status(200).json({
          message: httpStatus.SUCCESS,
          status: "Received",
          pendingRequestId: pendingRequest._id,
        });
      }
    }
    res.status(200).json({
      message: httpStatus.SUCCESS,
      status: "Not_Connected",
    });
  }
);
