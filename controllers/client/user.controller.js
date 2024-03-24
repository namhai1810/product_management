const User = require("../../models/user.model");
const md5 = require("md5");

// [GET]  user/register
module.exports.register = async (req, res) => {
  // Lấy ra các sản phẩm nổi bật
  res.render("clients/pages/user/register", {
    pageTitle: "Đăng ký tài khoản",
  });
};
// [POST] user/register
module.exports.registerPost = async (req, res) => {
  // Lấy ra các sản phẩm nổi bật
  const emailExists = await User.findOne({
    email: req.body.email,
    deleted: false,
  });
  if (emailExists) {
    req.flash("error", "Email đã tồn tại!");
    res.redirect("back");
    return;
  }
  req.body.password = md5(req.body.password);
  const user = new User(req.body);
  await user.save();

  res.cookie("tokenUser", user.tokenUser);
  res.redirect("/");
};

// [GET] user/login
module.exports.login = (req, res) => {
  res.render("clients/pages/user/login.pug", {
    pageTitle: "Đăng nhập",
  });
};

// [GET] user/login
module.exports.loginPost = async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
  });
  if (!user) {
    req.flash("error", "Tài khoản không tồn tại");
    res.redirect("back");
    return;
  }

  if (md5(req.body.password) != user.password) {
    req.flash("error", "Vui lòng nhập đúng mật khẩu");
    res.redirect("back");
    return;
  }
  if (user.status !== "active") {
    req.flash("error", "Tài khoản đang bị khóa");
    res.redirect("back");
    return;
  }
  res.cookie("tokenUser", user.tokenUser);
  res.redirect("/");
};
