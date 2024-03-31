// [GET] /chat/
module.exports.index = (req, res) => {
  _io.on("connection", (socket) => {
    console.log("user connected", socket.id);
  });
  res.render("clients/pages/chat/index", {
    pageTitle: "Chat",
  });
};
