const User = require("../../models/user.model");
module.exports.notFriend = async (req, res) => {
    const userId = res.locals.user.id;
    const users = await User.find({
      _id: {$ne: userId},
      status:"active",
      deleted:false,
    }).select("avatar fullName");


    res.render("clients/pages/users/not-friend", {
      pageTitle:"Danh sách người dùng",
      users: users,
    })
}