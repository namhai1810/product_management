const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");
// [GET] /chat/
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;
  const fullName = res.locals.user.fullName;
  // Socket io
  _io.once("connection", (socket) => {
    // Socket.once is for event listeners only -
    // when you only want to be notified of the next time an event occurs,
    //  not for the subsequent times it occurs.
    // Hai explained: when we reload many times our webpage => socket.on create mupltiple events,
    // so we will receive multiple messages
    // if we use socket.once, it registers an event listener
    // that will be triggered only once for the specified event
    socket.on("CLIENT_SEND_MESSAGE", async (message) => {
      const chat = new Chat({
        user_id: res.locals.user.id,
        content: message,
      });
      await chat.save();
      // Trả data cho clients
      _io.emit("SERVER_RETURN_MESSAGE", {
        userId: userId,
        fullName: fullName,
        content: message,
      });
      //
    });
  });
  //End  Socket io

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
