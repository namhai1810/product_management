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
    }).select("requestFriends acceptFriends friendsList");
    const requestFriends = myUser.requestFriends;
    const acceptFriends = myUser.acceptFriends;
    const friendsList = myUser.friendsList.map(item => item.user_id);

    const users = await User.find({
      $and: [
        {_id: {$ne: userId}},
        {_id: {$nin: requestFriends}},
        {_id: {$nin: acceptFriends}},
        {_id: {$nin: friendsList}}
      ],
      status:"active",
      deleted:false,
    }).select("avatar fullName");


    res.render("clients/pages/users/not-friend", {
      pageTitle:"Danh sách người dùng",
      users: users,
    })
}

module.exports.request = async (req, res) => {
    //socket
    usersSocket(res);
    //end socket
  const userId = res.locals.user.id;
  const requestUser = await User.findOne({
    _id: userId,
  }).select("requestFriends");
  
  const requestFriends = requestUser.requestFriends;
  const users = await User.find({
    _id: {$in: requestFriends},
    status: "active",
    deleted: false,
  }).select("avatar fullName");

  res.render("clients/pages/users/request", {
    pageTitle:"Lời mời đã gửi",
    users: users,
  })

}

module.exports.accept = async (req, res) => {
  //socket
  usersSocket(res);
  //end socket
  const userId = res.locals.user.id;

  const requestUser = await User.findOne({
    _id: userId,
  }).select("acceptFriends");

  const acceptFriends = requestUser.acceptFriends;
  const users = await User.find({
    _id: {$in: acceptFriends},
    status: "active",
    deleted: false,
  }).select("avatar fullName");

  res.render("clients/pages/users/accept", {
    pageTitle:"Lời mời đã nhận",
    users: users,
  })

}

// [GET] /users/friends
module.exports.friends = async (req, res) => {
  const friendsListId = res.locals.user.friendsList.map(item => item.user_id);

  const users = await User.find({
    _id: { $in: friendsListId },
    status: "active",
    deleted: false
  }).select("id fullName avatar");


  res.render("clients/pages/users/friends", {
    pageTitle: "Danh sách bạn bè",
    users: users
  });
};