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
      // Lấy độ dài accept friends của B trả lại cho B
      const infoUserB = await Users.findOne({ _id: userId });
      const lengthAcceptFriends = infoUserB.acceptFriends.length;

      socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
        userId: userId,
        lengthAcceptFriends: lengthAcceptFriends,
      });

      // Lấy thông tin A trả về cho B
      const infoUserA = await Users.findOne({
        _id: myUserId,
      }).select("id avatar fullName");
      socket.broadcast.emit("SERVER_RETURN_INFO_ACCEPT_FRIEND", {
        userId: userId,
        infoUserA: infoUserA,
      });
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
       // Lấy độ dài cancel friends của B trả lại cho B
       const infoUserB = await Users.findOne({ _id: userId });
       const lengthAcceptFriends = infoUserB.acceptFriends.length;
 
       socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
         userId: userId,
         lengthAcceptFriends: lengthAcceptFriends,
       });
      //Lấy userId A trả về cho B  
      socket.broadcast.emit("SERVER_RETURN_USER_ID_CANCEL_FRIEND", {
        userId: userId,
        userIdA: myUserId,
      });
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

    socket.on("CLIENT_ACCEPT_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id; //Id ông B
      // Xoá id của A vào accept friends của B và thêm vào list friends của B
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
            $push: {
              friendsList: {
                user_id: userId,
                room_chat_id: "",
              },
            },
            $pull: {
              acceptFriends: userId,
            },
          }
        );
      }
      // Xóa id của B vào request friends của A và thêm vào list friends của A
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
            $push: {
              friendsList: {
                user_id: myUserId,
                room_chat_id: "",
              },
            },
            $pull: {
              requestFriends: myUserId,
            },
          }
        );
      }
      // Thêm id của A vào friend của B
    });
  });
};
