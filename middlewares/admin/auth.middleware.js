const systemConfig = require("../../config/system");
const Account = require("../../models/account.model");
const Role = require("../../models/role.model");


module.exports.requireAuth = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    return;
  }
  const user = await Account.findOne({
    token: token,
    deleted: false,
  }).select("-password");
  if (!user) {
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    return;
  }
  const role = await Role.findOne({
    _id: user.role_id,
    deleted: false,
  }).select("title permissions");
  res.locals.user = user;
  res.locals.role = role;
  
  next();
};
