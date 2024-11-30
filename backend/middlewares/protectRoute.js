import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import appError from "../utilities/appError.js";
import httpStatus from "../utilities/httpStatus.js";
import User from "../models/user.model.js";
dotenv.config();

export const protectRoute = expressAsyncHandler(async (req, res, next) => {
  const { accessToken } = req.cookies;

  if (!accessToken)
    return next(new appError("Unauthorized", 401, httpStatus.FAILED));

  const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  if (!decoded)
    return next(new appError("Unauthorized", 401, httpStatus.FAILED));

  const user = await User.findById(decoded.userId).select("-passWord");
  if (!user) return next(new appError("Unauthorized", 401, httpStatus.FAILED));

  req.user = user;
  next();
});
