const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");
const uploadToCloudinary = require("../../helpers/uploadToCloudinary")
const chatSocket = require("../../socket/client/chat.socket")

// [GET] /chat/
module.exports.index = async (req, res) => {

  chatSocket(res); 

  // Get chat from database
  const chatHistory = await Chat.find({});
  for (const chat of chatHistory) {
    const user = await User.findOne({
      _id: chat.user_id,
    });
    chat.infoUser = user;
  }

  // End get chat from database
  res.render("clients/pages/chat/index", {
    pageTitle: "Chat",
    chats: chatHistory,
  });
};
