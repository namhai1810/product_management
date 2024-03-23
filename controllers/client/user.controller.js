const User = require("../../models/user.model")
const md5 = require("md5");

// [GET]  user/register
module.exports.register = async (req, res) => {
  // Lấy ra các sản phẩm nổi bật
  res.render("clients/pages/user/register",{
    pageTitle: "Đăng ký tài khoản"
  })
};
// [POST] user/register
module.exports.registerPost = async (req, res) => {
  // Lấy ra các sản phẩm nổi bật
  console.log(req.body.email)
  const emailExists = await User.findOne({
    email: req.body.email,
    deleted: false,
  });
  if(emailExists) {
    req.flash("error", "Email đã tồn tại!")
    res.redirect("back");
    return;
  }
  req.body.password = md5(req.body.password);
  const user = new User(req.body);
  await user.save();

  res.cookie("tokenUser", user.tokenUser);
  res.redirect("/");
};