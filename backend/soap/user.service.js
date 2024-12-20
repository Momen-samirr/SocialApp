import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";

const userService = {
  UserService: {
    UserServicePort: {
      // Get suggestions operation
      GetSuggestions: async ({ userId }, callback) => {
        try {
          const currentUser = await User.findById(userId).select("connections");

          if (!currentUser) {
            return callback({ error: "User not found" });
          }

          const suggestionsUsers = await User.find({
            _id: { $ne: userId, $nin: currentUser.connections },
          })
            .select("name userName profilePicture")
            .limit(6);

          // Ensure correct structure for the callback result
          callback(null, {
            suggestions: JSON.stringify(suggestionsUsers),
          });
        } catch (err) {
          callback({ error: err.message });
        }
      },

      // Get public profile operation
      GetPublicProfile: async ({ userName }, callback) => {
        try {
          const userProfile = await User.findOne({ userName }).select(
            "-passWord"
          );
          if (!userProfile) {
            return callback({ error: "User not found" });
          }

          callback(null, { profile: JSON.stringify(userProfile) });
        } catch (err) {
          callback({ error: err.message });
        }
      },

      // Update profile operation
      UpdateProfile: async ({ userId, profileData }, callback) => {
        try {
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
          const parsedProfileData = JSON.parse(profileData);

          for (const field of allowedFields) {
            if (parsedProfileData[field]) {
              updatedData[field] = parsedProfileData[field];
            }
          }

          if (parsedProfileData.profilePicure) {
            const result = await cloudinary.uploader.upload(
              parsedProfileData.profilePicure
            );
            updatedData.profilePicure = result.secure_url;
          }
          if (parsedProfileData.bannerImg) {
            const result = await cloudinary.uploader.upload(
              parsedProfileData.bannerImg
            );
            updatedData.bannerImg = result.secure_url;
          }

          const user = await User.findByIdAndUpdate(
            userId,
            { $set: updatedData },
            { new: true }
          ).select("-passWord");

          callback(null, {
            message: "User updated successfully",
          });
        } catch (err) {
          callback({ error: err.message });
        }
      },
    },
  },
};

export default userService;
