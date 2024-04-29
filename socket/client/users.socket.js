const Users = require("../../models/user.model");

module.exports = async (res) => {
  _io.once("connection", (socket) => {
    socket.on("CLIENT_ADD_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id; //Id ông A
      // Thêm id của A vào accept friends của B
      const exitUserA = await Users.findOne({
        _id: userId,
        acceptFriends: myUserId,
      });
      if (!exitUserA) {
        await Users.updateOne(
          {
            _id: userId,
          },
          {
            $push: {
              acceptFriends: myUserId,
            },
          }
        );
      }
      // Thêm id của B vào request friends của B
      const exitUserB = await Users.findOne({
        _id: myUserId,
        requestFriends: userId,
      });
      if (!exitUserB) {
        await Users.updateOne(
          {
            _id: myUserId,
          },
          {
            $push: {
              requestFriends: userId,
            },
          }
        );
      }
    });

    socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id; //Id ông A
      // Xoá id của A vào accept friends của B
      await Users.updateOne(
        {
          _id: userId,
        },
        {
          $pull: {
            acceptFriends: myUserId,
          },
        }
      );
      // Thêm id của B vào request friends của B
      await Users.updateOne(
        {
          _id: myUserId,
        },
        {
          $pull: {
            requestFriends: userId,
          },
        }
      );
    });
    socket.on("CLIENT_REFUSE_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id; // ID ông B
      // userID: của ông A
      // Xóa ID A trong B
      const exitsAinB = await Users.findOne({
        _id: myUserId,
        acceptFriends: userId,
      });
      if (exitsAinB) {
        await Users.updateOne(
          {
            _id: myUserId,
          },
          {
            $pull: {
              acceptFriends: userId,
            },
          }
        );
      }
      // Xóa ID B trong A
      const exitsBinA = await Users.findOne({
        _id: userId,
        requestFriends: myUserId,
      });
      if (exitsBinA) {
        await Users.updateOne(
          {
            _id: userId,
          },
          {
            $pull: {
              requestFriends: myUserId,
            },
          }
        );
      }
    });
  });
};
