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
    friendsList: [
      {
        user_id:String,
        room_chat_id: String
      }
    ],
    acceptFriends: Array,
    requestFriends: Array,
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