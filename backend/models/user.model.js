import mongoose from "mongoose";
import bycrypt from "bcrypt";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passWord: {
      type: String,
      required: true,
    },
    profilePicure: {
      type: String,
      default: "",
    },
    headLine: {
      type: String,
      default: "Social User",
    },
    location: {
      type: String,
      default: "Global",
    },
    about: {
      type: String,
      default: "",
    },
    skills: [String],
    experience: [
      {
        title: String,
        company: String,
        startDate: Date,
        endDate: Date,
        description: String,
      },
    ],
    education: [
      {
        school: String,
        fieldOfStudy: String,
        startYear: Number,
        endYear: Number,
      },
    ],
    connections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("passWord")) return next();

  try {
    const salt = await bycrypt.genSalt(10);

    this.passWord = await bycrypt.hash(this.passWord, salt);

    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (passWord) {
  return await bycrypt.compare(passWord, this.passWord);
};

const User = mongoose.model("User", userSchema);

export default User;
