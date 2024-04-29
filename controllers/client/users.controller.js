const User = require("../../models/user.model");
const usersSocket = require("../../socket/client/users.socket")


// [GET] /users/not-friend
module.exports.notFriend = async (req, res) => {

    //socket
    usersSocket(res);
    //end socket
    const userId = res.locals.user.id;
    const myUser = await User.findOne({
      _id: userId,
    }).select("requestFriends acceptFriends");
    const requestFriends = myUser.requestFriends;
    const acceptFriends = myUser.acceptFriends;

    const users = await User.find({
      $and: [
        {_id: {$ne: userId}},
        {_id: {$nin: requestFriends}},
        {_id: {$nin: acceptFriends}},
      ],
      status:"active",
      deleted:false,
    }).select("avatar fullName");


    res.render("clients/pages/users/not-friend", {
      pageTitle:"Danh sách người dùng",
      users: users,
    })
}