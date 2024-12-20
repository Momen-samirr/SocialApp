import expressAsyncHandler from "express-async-handler";
import appError from "../utilities/appError.js";
import httpStatus from "../utilities/httpStatus.js";
import User from "../models/user.model.js";
import generateTokens from "../utilities/generateTokens.js";
import storeRefreshToken from "../utilities/storeRefreshToken.js";
import setCookies from "../utilities/setCookies.js";
import { sendWelcomeEmail } from "../mails/emailsHandler.js";
import redis from "../lib/redis.js";
import jwt from "jsonwebtoken";
export const signUp = expressAsyncHandler(async (req, res, next) => {
  const { name, userName, email, passWord } = req.body;
  if (!name || !userName || !email || !passWord)
    return next(
      new appError("Please provide all fields", 400, httpStatus.FAILED)
    );

  if (passWord.length < 6) {
    return next(
      new appError(
        "Password must be at least 6 characters",
        400,
        httpStatus.FAILED
      )
    );
  }

  const existingUserName = await User.findOne({ userName });
  if (existingUserName)
    return next(
      new appError("Username already exists", 400, httpStatus.FAILED)
    );

  const existingEmail = await User.findOne({ email });
  if (existingEmail)
    return next(new appError("Email already exists", 400, httpStatus.FAILED));
  const user = await User.create({
    name,
    userName,
    email,
    passWord,
  });
  const { accessToken, refreshToken } = generateTokens(user._id);
  await storeRefreshToken(user._id, refreshToken);
  setCookies(res, accessToken, refreshToken);

  res.status(201).json({
    status: httpStatus.SUCCESS,
    message: "User created successfully",
    data: user,
  });
  const profileUrl = process.env.CLIENT_URL + "/profile/" + user.userName;

  try {
    await sendWelcomeEmail(user.name, user.email, profileUrl);
  } catch (error) {
    console.log("Error sending welcome email", error);
  }
});
export const logIn = expressAsyncHandler(async (req, res, next) => {
  const { email, passWord } = req.body;
  if (!email || !passWord)
    return next(
      new appError("Please provide all fields", 400, httpStatus.FAILED)
    );
  const realUser = await User.findOne({ email });
  if (!realUser)
    return next(new appError("Invalid credentials", 400, httpStatus.FAILED));

  if (realUser && (await realUser.comparePassword(passWord))) {
    const { accessToken, refreshToken } = generateTokens(realUser._id);
    await storeRefreshToken(realUser._id, refreshToken);
    setCookies(res, accessToken, refreshToken);
    res.status(200).json({
      status: httpStatus.SUCCESS,
      message: "User logged in successfully",
      data: realUser,
    });
  } else {
    return next(new appError("Invalid credentials", 400, httpStatus.FAILED));
  }
});

export const logOut = expressAsyncHandler(async (req, res, next) => {
  const { refreshToken } = req.cookies;
  if (refreshToken) {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    await redis.del(`refreshToken:${decoded.userId}`);
  }
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).json({
    status: httpStatus.SUCCESS,
    message: "User logged out successfully",
  });
});

export const getCurrentUser = expressAsyncHandler(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    status: httpStatus.SUCCESS,
    message: "User fetched successfully",
    data: user,
  });
});
