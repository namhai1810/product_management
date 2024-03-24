const User = require("../../models/account.model");


module.exports.requireAuth = async (req, res, next) => {
  const tokenUser = req.cookies.tokenUser;
  if (!tokenUser) {
    res.redirect(`/user/login`);
    return;
  }
  const user = await Userr.findOne({
    tokenUser: tokenUser,
    deleted: false,
  }).select("-password");
  if (!user) {
    res.redirect(`/user/login`);
    return;
  }
  
  next();
};
