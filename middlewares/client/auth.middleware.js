const User = require("../../models/user.model");

module.exports.requireAuth = async (req, res, next) => {
  const tokenUser = req.cookies.tokenUser;
  console.log(tokenUser);
  if (!tokenUser) {
    res.redirect(`/user/login`);
    return;
  }
  const user = await User.findOne({
    tokenUser: tokenUser,
    deleted: false,
  }).select("-password");
  console.log(user);
  if (!user) {
    res.redirect(`/user/login`);
    return;
  }

  next();
};
