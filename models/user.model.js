const mongoose = require("mongoose");
const generateHelper = require("../helpers/generate");
const UserSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
		tokenUser: {
      type: String,
      default: generateHelper.generateRandomString(20),
    },
    phone: String,
    avatar: String,
    status: {
      type: String,
      default: "active"
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema, "users");

module.exports = User;