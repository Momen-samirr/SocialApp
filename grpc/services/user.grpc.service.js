import grpc from "@grpc/grpc-js";
import User from "../models/user.model.js";

// gRPC service method: GetSuggestions
export const GetSuggestions = async (call, callback) => {
  try {
    const userId = call.request.userId;
    if (!userId) {
      return callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: "User ID is required",
      });
    }
    console.log("GetSuggestions called with userId:", userId);

    const currentUser = await User.findById(userId).select("connections");
    if (!currentUser) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: "User not found",
      });
    }

    console.log("Current user:", currentUser);

    const suggestions = await User.find({
      _id: { $ne: currentUser._id, $nin: currentUser.connections },
    })
      .select("id name userName profilePicure")
      .limit(6);

    callback(null, { users: suggestions });
  } catch (err) {
    console.error("Error in GetSuggestions:", err);
    callback({ code: grpc.status.INTERNAL, message: err.message });
  }
};

// gRPC service method: GetPublicProfile
export const GetPublicProfile = async (call, callback) => {
  try {
    const userName = call.request.userName;

    // Validate input and log
    if (!userName) {
      return callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: "UserName is required",
      });
    }
    console.log("GetPublicProfile called with userName:", userName);

    // Fetch user profile
    const userProfile = await User.findOne({ userName });

    if (!userProfile) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: "User not found",
      });
    }

    console.log("User profile:", userProfile);

    // Return user profile
    callback(null, userProfile);
  } catch (err) {
    console.error("Error in GetPublicProfile:", err);
    callback({ code: grpc.status.INTERNAL, message: err.message });
  }
};
