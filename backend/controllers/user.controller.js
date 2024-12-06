import expressAsyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import appError from "../utilities/appError.js";
import httpStatus from "../utilities/httpStatus.js";
import cloudinary from "../lib/cloudinary.js";

export const getSuggestionsConnections = expressAsyncHandler(
  async (req, res, next) => {
    const currentUser = await User.findById(req.user._id).select("connections");

    if (!currentUser)
      return next(new appError("User not found", 404, httpStatus.FAILED));

    const suggestionsUsers = await User.find({
      _id: {
        $ne: req.user._id,
        $nin: currentUser.connections,
      },
    })
      .select("name userName profilePicure")
      .limit(6);

    res.status(200).json({
      status: httpStatus.SUCCESS,
      message: "Users fetched successfully",
      data: suggestionsUsers,
    });
  }
);

export const getPublicProfile = expressAsyncHandler(async (req, res, next) => {
  const userProfile = await User.findOne({
    userName: req.params.userName,
  }).select("-passWord");
  if (!userProfile)
    return next(new appError("User not found", 404, httpStatus.FAILED));
  res.status(200).json({
    status: httpStatus.SUCCESS,
    message: "User fetched successfully",
    data: userProfile,
  });
});

export const updateProfile = expressAsyncHandler(async (req, res, next) => {
  const allowedFields = [
    "name",
    "profilePicure",
    "bannerImg",
    "headLine",
    "location",
    "about",
    "skills",
    "experience",
    "education",
  ];

  const updatedData = {};

  for (const field of allowedFields) {
    if (req.body[field]) {
      updatedData[field] = req.body[field];
    }
  }

  if (req.body.profilePicure) {
    const result = await cloudinary.uploader.upload(req.body.profilePicure);
    updatedData.profilePicure = result.secure_url;
  }
  if (req.body.bannerImg) {
    const result = await cloudinary.uploader.upload(req.body.bannerImg);
    updatedData.bannerImg = result.secure_url;
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updatedData },
    { new: true }
  ).select("-passWord");

  res.status(200).json({
    status: httpStatus.SUCCESS,
    message: "User updated successfully",
    data: user,
  });
});
